import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Upload, Download, Lock, Unlock, FileText, Image, File, Shield, Send, AlertCircle, Cloud, HardDrive, Key, Copy, Trash2, RefreshCw, Link as LinkIcon, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { getSupabaseClient } from '../config/supabase';
import { useToast } from '../context/ToastContext';
import { sanitizeHTML, isHTMLContent } from '../utils/htmlSanitizer';

// --- Crypto Utilities ---
const deriveKeyFromToken = async (token) => {
  const encoder = new TextEncoder();
  const keyMaterial = await crypto.subtle.importKey(
    'raw',
    encoder.encode(token),
    { name: 'PBKDF2' },
    false,
    ['deriveBits', 'deriveKey']
  );

  return await crypto.subtle.deriveKey(
    {
      name: 'PBKDF2',
      salt: encoder.encode('hhs-analytics-secure-salt-v1'),
      iterations: 100000,
      hash: 'SHA-256'
    },
    keyMaterial,
    { name: 'AES-GCM', length: 256 },
    true,
    ['encrypt', 'decrypt']
  );
};

const encryptData = async (data, key) => {
  const iv = crypto.getRandomValues(new Uint8Array(12));
  const encrypted = await crypto.subtle.encrypt(
    { name: 'AES-GCM', iv },
    key,
    data
  );

  const combined = new Uint8Array(iv.length + encrypted.byteLength);
  combined.set(iv, 0);
  combined.set(new Uint8Array(encrypted), iv.length);

  return {
    encrypted: combined,
    iv: Array.from(iv)
  };
};

const decryptData = async (encryptedData, key) => {
  const iv = encryptedData.slice(0, 12);
  const data = encryptedData.slice(12);

  try {
    const decrypted = await crypto.subtle.decrypt(
      { name: 'AES-GCM', iv },
      key,
      data
    );
    return decrypted;
  } catch (error) {
    console.error('Decryption failed', error);
    throw new Error('Decryption failed');
  }
};

const generateRandomToken = () => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  const randomValues = new Uint8Array(12);
  crypto.getRandomValues(randomValues);
  for (let i = 0; i < 12; i++) {
    result += chars[randomValues[i] % chars.length];
  }
  return result;
};

// Constants
const LOCAL_MESSAGE_PREFIX = 'portal_messages_';
const LOCAL_FILE_PREFIX = 'portal_files_';
const SYNC_INTERVAL_MS = 3000; // 3 seconds
const MAX_MESSAGE_LENGTH = 10000; // 10KB max message size
const MAX_FILE_SIZE_LOCAL = 5 * 1024 * 1024; // 5MB for local storage
const MAX_FILE_SIZE_CLOUD = 200 * 1024 * 1024; // 200MB recommended max for cloud (Supabase free tier: 1GB total)
const LARGE_FILE_WARNING = 50 * 1024 * 1024; // 50MB - warn user about large files
const PORTAL_TOKEN = 'password';

const getLocalMessageStorageKey = (token) => {
  if (!token) return '';
  return `${LOCAL_MESSAGE_PREFIX}${token}`;
};

const readLocalMessages = (token) => {
  if (typeof window === 'undefined' || !token) return [];
  try {
    const raw = window.localStorage.getItem(getLocalMessageStorageKey(token));
    return raw ? JSON.parse(raw) : [];
  } catch (error) {
    console.error('Failed to read local portal messages', error);
    return [];
  }
};

const writeLocalMessages = (token, msgs) => {
  if (typeof window === 'undefined' || !token) return;
  try {
    window.localStorage.setItem(getLocalMessageStorageKey(token), JSON.stringify(msgs));
  } catch (error) {
    console.error('Failed to persist local portal messages', error);
  }
};

const getLocalFileStorageKey = (token) => {
  if (!token) return '';
  return `${LOCAL_FILE_PREFIX}${token}`;
};

const readLocalFiles = (token) => {
  if (typeof window === 'undefined' || !token) return [];
  try {
    const raw = window.localStorage.getItem(getLocalFileStorageKey(token));
    return raw ? JSON.parse(raw) : [];
  } catch (error) {
    console.error('Failed to read local portal files', error);
    return [];
  }
};

const writeLocalFiles = (token, files) => {
  if (typeof window === 'undefined' || !token) return;
  try {
    window.localStorage.setItem(getLocalFileStorageKey(token), JSON.stringify(files));
  } catch (error) {
    console.error('Failed to persist local portal files', error);
  }
};

// --- Main Component ---

const SecureFilePortal = () => {
  const { addToast } = useToast();
  
  // State
  const [activeTab, setActiveTab] = useState('messages');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [accessToken, setAccessToken] = useState('password');
  const [encryptionKey, setEncryptionKey] = useState(null);
  const [useCloudStorage, setUseCloudStorage] = useState(false);
  const [error, setError] = useState('');
  
  // Data State
  const [files, setFiles] = useState([]);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const messageContentRef = useRef(null);
  const [uploading, setUploading] = useState(false);
  const [sendingMessage, setSendingMessage] = useState(false);
  const [lastSyncTime, setLastSyncTime] = useState(null);
  
  // Encryption Tool State
  const [textToEncrypt, setTextToEncrypt] = useState('');
  const [encryptedText, setEncryptedText] = useState('');
  const [textToDecrypt, setTextToDecrypt] = useState('');
  const [decryptedText, setDecryptedText] = useState('');

  const [isDragging, setIsDragging] = useState(false);
  
  // Refs
  const fileInputRef = useRef(null);
  const syncIntervalRef = useRef(null);
  const messagesEndRef = useRef(null);
  
  const supabase = getSupabaseClient();

  const loadData = useCallback(async (tokenOverride) => {
    const token = tokenOverride || accessToken;
    if (!token) return;

    try {
      if (!useCloudStorage || !supabase) {
        const localMessages = readLocalMessages(token);
        const validMessages = Array.isArray(localMessages) 
          ? localMessages.filter(m => m && m.text && typeof m.text === 'string' && m.text.trim().length > 0) 
          : [];
        setMessages(validMessages);
        const localFiles = readLocalFiles(token);
        setFiles(Array.isArray(localFiles) ? localFiles : []);
        setLastSyncTime(new Date());
        return;
      }

      // Load files and messages in parallel for better performance
      const [fileResult, messageResult] = await Promise.allSettled([
        supabase
          .from('portal_files')
          .select('*')
          .eq('token', token)
          .order('uploaded_at', { ascending: false }),
        supabase
          .from('portal_messages')
          .select('*')
          .eq('token', token)
          .order('created_at', { ascending: true })
      ]);

      // Handle files
      if (fileResult.status === 'fulfilled' && !fileResult.value.error && fileResult.value.data) {
        const mappedFiles = fileResult.value.data.map(f => ({
          id: f.id,
          name: f.file_name || 'Unknown',
          type: f.file_type || 'application/octet-stream',
          size: f.file_size || 0,
          encrypted: f.encrypted_data || '',
          uploadedAt: f.uploaded_at || new Date().toISOString(),
          uploadedBy: f.uploaded_by || 'User'
        }));
        setFiles(mappedFiles);
      } else if (fileResult.status === 'rejected' || fileResult.value?.error) {
        console.error('Failed to load files', fileResult.value?.error || fileResult.reason);
      }

      // Handle messages
      if (messageResult.status === 'fulfilled' && !messageResult.value.error) {
        const mappedMsgs = (messageResult.value.data || [])
          .filter(m => m && m.message_text && typeof m.message_text === 'string' && m.message_text.trim().length > 0)
          .map(m => ({
            id: m.id || `msg-${Date.now()}-${Math.random()}`,
            text: m.message_text || '',
            author: m.author || 'User',
            timestamp: m.created_at || new Date().toISOString()
          }));
        setMessages(mappedMsgs);
      } else {
        console.error('Failed to load messages', messageResult.value?.error || messageResult.reason);
        setMessages([]);
      }
      
      setLastSyncTime(new Date());
    } catch (error) {
      console.error('Error loading data', error);
      addToast('Failed to load data. Please refresh.', 'error');
    }
  }, [accessToken, supabase, useCloudStorage, addToast]);

  const handleAuthenticate = useCallback(async (tokenToUse) => {
    // Always use lowercase "password" as the token - no sharing needed
    const token = PORTAL_TOKEN;
    if (!token || token.length < 8) {
      setError('Token must be at least 8 characters');
      return;
    }

    try {
      const key = await deriveKeyFromToken(token);
      setEncryptionKey(key);
      setAccessToken(token);
      setIsAuthenticated(true);
      setError('');
      if (typeof window !== 'undefined') {
        try {
          localStorage.setItem('portal_access_token', token);
        } catch (e) {
          console.warn('Failed to save token to localStorage', e);
        }
      }
      await loadData(token);
    } catch (err) {
      setError('Authentication failed');
      console.error('Authentication failed', err);
      addToast('Failed to authenticate. Please refresh the page.', 'error');
    }
  }, [loadData, addToast]);

  // Scroll to bottom of messages (debounced for performance)
  useEffect(() => {
    if (activeTab !== 'messages' || !messagesEndRef.current) return;
    
    const timeoutId = setTimeout(() => {
      if (messagesEndRef.current) {
        messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
      }
    }, 100);
    
    return () => clearTimeout(timeoutId);
  }, [messages, activeTab]);

  // Auto-focus message input when tab changes
  useEffect(() => {
    if (activeTab === 'messages' && messageContentRef.current) {
      messageContentRef.current.focus();
    }
  }, [activeTab]);

  // Check URL params for tab and token
  useEffect(() => {
    if (typeof window === 'undefined') return;
    // Support HashRouter (#/portal?token=...) and direct query (?token=...)
    let params;
    if (window.location.hash && window.location.hash.includes('?')) {
      const qs = window.location.hash.split('?')[1];
      params = new URLSearchParams(qs);
    } else {
      params = new URLSearchParams(window.location.search);
    }
    const tab = params.get('tab');
    const tokenParam = params.get('token');

    if (tab && ['messages', 'files', 'encrypt'].includes(tab)) {
      setActiveTab(tab);
    }

    // No need to handle token params - auto-connect always
  }, [addToast, isAuthenticated]);

  // Check Supabase availability
  useEffect(() => {
    if (supabase) setUseCloudStorage(true);
  }, [supabase]);

  // Auto-authenticate on mount - no token sharing needed
  useEffect(() => {
    if (typeof window === 'undefined') return;
    // Always use "password" token and auto-connect
    const token = PORTAL_TOKEN;
    setAccessToken(token);
    handleAuthenticate(token);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Only run once on mount

  // Auto-sync with optimized interval
  useEffect(() => {
    if (!isAuthenticated || !accessToken) return;
    
    // Load immediately
    loadData();
    
    // Then set up interval
    syncIntervalRef.current = setInterval(() => {
      loadData();
    }, SYNC_INTERVAL_MS);
    
    return () => {
      if (syncIntervalRef.current) {
        clearInterval(syncIntervalRef.current);
        syncIntervalRef.current = null;
      }
    };
  }, [isAuthenticated, accessToken, loadData]);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    if (!isAuthenticated || useCloudStorage) return;
    if (!accessToken) return;

    const messageKey = getLocalMessageStorageKey(accessToken);
    const fileKey = getLocalFileStorageKey(accessToken);
    if (!messageKey && !fileKey) return;

    const handleStorage = (event) => {
      if (event.key === messageKey) {
        try {
          const parsed = event.newValue ? JSON.parse(event.newValue) : [];
          setMessages(Array.isArray(parsed) ? parsed : []);
        } catch (error) {
          console.error('Failed to sync portal messages from storage event', error);
        }
        return;
      }

      if (event.key === fileKey) {
        try {
          const parsed = event.newValue ? JSON.parse(event.newValue) : [];
          setFiles(Array.isArray(parsed) ? parsed : []);
        } catch (error) {
          console.error('Failed to sync portal files from storage event', error);
        }
      }
    };

    window.addEventListener('storage', handleStorage);
    return () => window.removeEventListener('storage', handleStorage);
  }, [accessToken, isAuthenticated, useCloudStorage]);

  // --- Actions ---

  const logout = () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('portal_access_token');
      window.history.replaceState({}, '', window.location.pathname);
    }
    setIsAuthenticated(false);
    setAccessToken('');
    setEncryptionKey(null);
    setFiles([]);
    setMessages([]);
  };


  const handlePaste = useCallback((e) => {
    e.preventDefault();
    const clipboardData = e.clipboardData || window.clipboardData;
    const htmlData = clipboardData.getData('text/html');
    const textData = clipboardData.getData('text/plain');
    
    if (!messageContentRef.current) return;
    
    const selection = window.getSelection();
    if (!selection || selection.rangeCount === 0) return;
    
    const range = selection.getRangeAt(0);
    range.deleteContents();
    
    if (htmlData && isHTMLContent(htmlData)) {
      // Sanitize HTML before inserting to prevent XSS
      const sanitizedHTML = sanitizeHTML(htmlData);
      const tempDiv = document.createElement('div');
      tempDiv.innerHTML = sanitizedHTML;
      const fragment = document.createDocumentFragment();
      while (tempDiv.firstChild) {
        fragment.appendChild(tempDiv.firstChild);
      }
      range.insertNode(fragment);
      selection.removeAllRanges();
      selection.addRange(range);
    } else {
      // Plain text paste - escape HTML to prevent XSS
      const escapedText = textData.replace(/</g, '&lt;').replace(/>/g, '&gt;');
      const textNode = document.createTextNode(textData); // Use original text, not escaped
      range.insertNode(textNode);
      range.setStartAfter(textNode);
      selection.removeAllRanges();
      selection.addRange(range);
    }
    
    // Update state after paste
    if (messageContentRef.current) {
      setNewMessage(messageContentRef.current.innerHTML);
    }
  }, []);

  const handleSendMessage = async () => {
    if (sendingMessage || !encryptionKey) return;
    
    // Get content from contentEditable div
    let messageContent = '';
    if (messageContentRef.current) {
      const text = messageContentRef.current.textContent || messageContentRef.current.innerText || '';
      const html = messageContentRef.current.innerHTML || '';
      // Use HTML if it contains formatting (tables, etc.), otherwise use plain text
      messageContent = isHTMLContent(html)
        ? sanitizeHTML(html.trim()) // Sanitize HTML before storing
        : text.trim();
    } else {
      messageContent = newMessage.trim();
    }
    
    // Check if message is empty (accounting for HTML tags and empty divs)
    const textOnly = messageContentRef.current 
      ? (messageContentRef.current.textContent || messageContentRef.current.innerText || '').trim()
      : newMessage.trim();
    
    // Check for empty HTML tags
    const isEmpty = !textOnly || 
      (messageContentRef.current && (
        !messageContentRef.current.innerHTML || 
        messageContentRef.current.innerHTML === '<br>' ||
        /^<div><br><\/div>$/i.test(messageContentRef.current.innerHTML) ||
        /^<p><\/p>$/i.test(messageContentRef.current.innerHTML) ||
        /^<div><\/div>$/i.test(messageContentRef.current.innerHTML)
      ));
    
    if (isEmpty) {
      addToast('Message cannot be empty', 'error');
      return;
    }

    // Check message length
    if (messageContent.length > MAX_MESSAGE_LENGTH) {
      addToast(`Message is too long (max ${MAX_MESSAGE_LENGTH} characters)`, 'error');
      return;
    }

    setSendingMessage(true);
    const msg = {
      text: messageContent,
      author: 'User', 
      timestamp: new Date().toISOString()
    };

    try {
      if (useCloudStorage && supabase) {
        const { error } = await supabase.from('portal_messages').insert({
          token: accessToken,
          message_text: messageContent, 
          author: 'User'
        });
        
        if (error) throw error;
        
        // Optimistically update UI
        const optimisticMsg = { ...msg, id: `temp-${Date.now()}` };
        setMessages(prev => [...prev, optimisticMsg]);
        
        // Refresh to get real ID
        await loadData();
      } else {
        const localMsg = { ...msg, id: Date.now() };
        const existing = readLocalMessages(accessToken);
        const updated = [...existing, localMsg];
        writeLocalMessages(accessToken, updated);
        setMessages(updated);
      }
      
      // Clear input
      setNewMessage('');
      if (messageContentRef.current) {
        messageContentRef.current.innerHTML = '';
        messageContentRef.current.textContent = '';
      }
      
      // Refocus after sending
      setTimeout(() => {
        if (messageContentRef.current) {
          messageContentRef.current.focus();
        }
      }, 100);
    } catch (err) {
      addToast('Failed to send message. Please try again.', 'error');
      console.error('Failed to send message', err);
      // Remove optimistic update on error
      if (useCloudStorage) {
        setMessages(prev => prev.filter(m => !m.id?.toString().startsWith('temp-')));
      }
    } finally {
      setSendingMessage(false);
    }
  };

  const handleDeleteMessage = async (id) => {
    if (useCloudStorage && supabase) {
      await supabase.from('portal_messages').delete().eq('id', id);
      await loadData();
      addToast('Message deleted', 'success');
    } else {
      const existing = readLocalMessages(accessToken);
      const updated = existing.filter(m => m.id !== id);
      writeLocalMessages(accessToken, updated);
      setMessages(updated);
      addToast('Message deleted', 'success');
    }
  };

  const handleClearChat = async () => {
    if (!window.confirm('Are you sure you want to clear all messages? This cannot be undone.')) {
      return;
    }
    
    try {
      if (useCloudStorage && supabase) {
        const { error } = await supabase.from('portal_messages').delete().eq('token', accessToken);
        if (error) throw error;
        await loadData();
      } else {
        writeLocalMessages(accessToken, []);
        setMessages([]);
      }
      addToast('Chat cleared', 'success');
    } catch (err) {
      console.error('Failed to clear chat', err);
      addToast('Failed to clear chat', 'error');
    }
  };

  const processFiles = async (filesToProcess) => {
    if (!filesToProcess.length) {
      addToast('Please select at least one file', 'error');
      return;
    }
    if (!encryptionKey) {
      addToast('Encryption key not ready. Please wait for authentication to complete.', 'error');
      setError('Encryption key not available. Please refresh the page and try again.');
      return;
    }

    setUploading(true);
    try {
      for (const file of filesToProcess) {
        // Check file size limits
        if (!useCloudStorage && file.size > MAX_FILE_SIZE_LOCAL) {
          addToast(`File ${file.name} is too large for local mode (max ${MAX_FILE_SIZE_LOCAL / 1024 / 1024}MB). Please enable Cloud mode (Supabase).`, 'error');
          continue;
        }

        if (useCloudStorage && file.size > MAX_FILE_SIZE_CLOUD) {
          const confirmLarge = window.confirm(
            `File ${file.name} is very large (${(file.size / 1024 / 1024).toFixed(1)}MB). ` +
            `Large files may take time to encrypt and upload, and could exceed browser memory limits. ` +
            `Continue anyway?`
          );
          if (!confirmLarge) continue;
        }

        // Warn about large files
        if (file.size > LARGE_FILE_WARNING) {
          addToast(`Processing large file: ${file.name} (${(file.size / 1024 / 1024).toFixed(1)}MB). This may take a moment...`, 'info');
        }

        // Load file into memory and encrypt
        let buffer;
        try {
          buffer = await file.arrayBuffer();
        } catch (err) {
          throw new Error(`Failed to read file: ${err.message}. File may be too large for browser memory.`);
        }

        let encrypted;
        try {
          const result = await encryptData(buffer, encryptionKey);
          encrypted = result.encrypted;
        } catch (err) {
          throw new Error(`Encryption failed: ${err.message}. File may be too large.`);
        }

        if (useCloudStorage && supabase) {
          // 1. Upload encrypted blob to Storage Bucket
          const storagePath = `${accessToken}/${Date.now()}-${file.name}`;
          const blob = new Blob([encrypted]); // 'encrypted' is Uint8Array including IV
          
          try {
            const { error: uploadError } = await supabase.storage
              .from('portal-uploads')
              .upload(storagePath, blob, {
                contentType: file.type,
                upsert: false
              });

            if (uploadError) {
              // Check if it's a size limit error
              if (uploadError.message.includes('size') || uploadError.message.includes('limit')) {
                throw new Error(`File too large for Supabase storage. Free tier limit: 1GB total. File size: ${(file.size / 1024 / 1024).toFixed(1)}MB`);
              }
              throw new Error(`Storage upload failed: ${uploadError.message}`);
            }

            // 2. Store metadata in DB (repurposing encrypted_data to store Path)
            await supabase.from('portal_files').insert({
              token: accessToken,
              file_name: file.name,
              file_type: file.type,
              file_size: file.size,
              encrypted_data: storagePath, // Store PATH instead of Base64
              iv: 'included_in_blob',
              uploaded_by: 'User'
            });

            addToast(`${file.name} uploaded successfully (${(file.size / 1024 / 1024).toFixed(1)}MB) - Synced to cloud! Check other devices - they should update automatically.`, 'success');
          } catch (uploadErr) {
            throw new Error(`Upload failed for ${file.name}: ${uploadErr.message}`);
          }
        } else {
          // Local mode - already checked size limit above
          const base64Data = btoa(String.fromCharCode(...encrypted));
          const localFile = {
            id: `${Date.now()}-${file.name}-${Math.random().toString(36).slice(2)}`,
            name: file.name,
            type: file.type,
            size: file.size,
            encrypted: base64Data,
            uploadedAt: new Date().toISOString(),
            uploadedBy: 'User'
          };
          const existingFiles = readLocalFiles(accessToken);
          const updatedFiles = [localFile, ...existingFiles];
          writeLocalFiles(accessToken, updatedFiles);
          setFiles(updatedFiles);
            addToast(`${file.name} saved locally (${(file.size / 1024 / 1024).toFixed(1)}MB) - NOTE: Local files don't sync across devices!`, 'success');
            // Still update the UI immediately for local mode
            setFiles(updatedFiles);
        }
      }
      
      // Always reload data after upload to ensure sync
      if (useCloudStorage && supabase) {
        // Wait a moment for database to update, then reload
        await new Promise(resolve => setTimeout(resolve, 500));
        await loadData();
      } else {
        // Local mode - warn user
        addToast('⚠️ File saved locally only - will NOT sync to other devices! Enable Cloud Mode for cross-device sync.', 'error');
      }
    } catch (err) {
      setError('Upload failed: ' + err.message);
      addToast(err.message, 'error');
      console.error('File upload error:', err);
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const handleFileUpload = async (e) => {
    const selectedFiles = Array.from(e.target.files);
    if (!selectedFiles.length) {
      return;
    }
    if (!isAuthenticated || !encryptionKey) {
      addToast('Please wait for authentication to complete before uploading files.', 'error');
      setError('Authentication required. Please refresh the page if this persists.');
      return;
    }
    await processFiles(selectedFiles);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = async (e) => {
    e.preventDefault();
    setIsDragging(false);
    
    const droppedFiles = Array.from(e.dataTransfer.files);
    if (!droppedFiles.length) {
      return;
    }
    if (!isAuthenticated || !encryptionKey) {
      addToast('Please wait for authentication to complete before uploading files.', 'error');
      setError('Authentication required. Please refresh the page if this persists.');
      return;
    }
    await processFiles(droppedFiles);
  };

  const handleDownloadFile = async (file) => {
    try {
      let encryptedBytes;

      // Check if this is a Cloud Storage Path or Legacy Base64
      // Paths are short strings (e.g., "token/timestamp-name"), Base64 of a file is huge.
      const isStoragePath = file.encrypted.length < 500 && !file.encrypted.endsWith('=');

      if (isStoragePath && useCloudStorage && supabase) {
          // Download from Storage Bucket
          const { data, error } = await supabase.storage
            .from('portal-uploads')
            .download(file.encrypted);
          
          if (error) throw error;
          const buffer = await data.arrayBuffer();
          encryptedBytes = new Uint8Array(buffer);
      } else {
          // Fallback for Local Mode or Legacy Files
          encryptedBytes = Uint8Array.from(atob(file.encrypted), c => c.charCodeAt(0));
      }

      const decryptedBuffer = await decryptData(encryptedBytes, encryptionKey);
      const blob = new Blob([decryptedBuffer], { type: file.type });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = file.name;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (err) {
      addToast('Decryption/Download failed. Check your connection.', 'error');
      console.error('Decryption failed during download', err);
    }
  };

  const handleDeleteFile = async (id) => {
    if (useCloudStorage && supabase) {
      // Find file first to get path
      const fileToDelete = files.find(f => f.id === id);
      if (fileToDelete) {
          const isStoragePath = fileToDelete.encrypted.length < 500 && !fileToDelete.encrypted.endsWith('=');
          if (isStoragePath) {
              await supabase.storage.from('portal-uploads').remove([fileToDelete.encrypted]);
          }
      }
      await supabase.from('portal_files').delete().eq('id', id);
      await loadData();
      addToast('File deleted', 'success');
    } else {
       const existing = readLocalFiles(accessToken);
       const updated = existing.filter(f => f.id !== id);
       writeLocalFiles(accessToken, updated);
       setFiles(updated);
       addToast('File deleted', 'success');
    }
  };

  const handleToolEncrypt = async () => {
    if (!textToEncrypt || !encryptionKey) return;
    const encoder = new TextEncoder();
    const { encrypted } = await encryptData(encoder.encode(textToEncrypt), encryptionKey);
    setEncryptedText(btoa(String.fromCharCode(...encrypted)));
  };

  const handleToolDecrypt = async () => {
    if (!textToDecrypt || !encryptionKey) return;
    try {
      const bytes = Uint8Array.from(atob(textToDecrypt), c => c.charCodeAt(0));
      const decrypted = await decryptData(bytes, encryptionKey);
      const decoder = new TextDecoder();
      setDecryptedText(decoder.decode(decrypted));
    } catch (err) {
      addToast('Decryption failed', 'error');
      console.error('Text decryption failed', err);
    }
  };

  const handleCopyInviteLink = async () => {
    try {
      const url = `${window.location.origin}${window.location.pathname}#/portal`;
      await navigator.clipboard.writeText(url);
      addToast('Portal link copied! Anyone can open it to join.', 'success');
    } catch (err) {
      console.error('Failed to copy link', err);
      addToast('Failed to copy link', 'error');
    }
  };

  // --- Renders ---

  // Helper function for relative time
  const getRelativeTime = (timestamp) => {
    if (!timestamp) return 'Just now';
    try {
      const date = new Date(timestamp);
      if (isNaN(date.getTime())) return 'Just now';
      
      const now = new Date();
      const diffMs = now - date;
      const diffSecs = Math.floor(diffMs / 1000);
      const diffMins = Math.floor(diffSecs / 60);
      const diffHours = Math.floor(diffMins / 60);
      const diffDays = Math.floor(diffHours / 24);
      
      if (diffSecs < 10) return 'Just now';
      if (diffSecs < 60) return `${diffSecs}s ago`;
      if (diffMins < 60) return `${diffMins}m ago`;
      if (diffHours < 24) return `${diffHours}h ago`;
      if (diffDays < 7) return `${diffDays}d ago`;
      
      return date.toLocaleDateString();
    } catch {
      return 'Just now';
    }
  };

  // Show loading state while authenticating
  if (!isAuthenticated) {
    return (
      <div className="max-w-md mx-auto mt-10 px-4">
        <div className="card text-center p-8 space-y-6">
          <div className="flex justify-center">
            <motion.div 
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.3 }}
              className="h-16 w-16 bg-gradient-to-br from-brand-500 to-brand-600 rounded-full flex items-center justify-center shadow-lg"
            >
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
              >
                <Shield className="h-8 w-8 text-white" />
              </motion.div>
            </motion.div>
          </div>
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <h2 className="text-2xl font-bold text-slate-900">Connecting...</h2>
            <p className="text-slate-600 mt-2">
              Joining the secure room...
            </p>
          </motion.div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex justify-between items-center bg-gradient-to-r from-white to-slate-50 p-5 rounded-xl shadow-md border border-slate-200">
        <div className="flex items-center gap-4">
          <div className="h-12 w-12 bg-gradient-to-br from-brand-600 to-brand-700 rounded-xl flex items-center justify-center text-white shadow-lg">
            <Shield className="h-6 w-6" />
          </div>
          <div>
            <h1 className="font-bold text-xl text-slate-900">Secure Portal</h1>
            <div className="flex items-center gap-2 text-xs mt-1">
              <span className="flex items-center gap-1.5 bg-green-50 text-green-700 px-2.5 py-1 rounded-full border border-green-200 font-medium">
                <Lock className="h-3 w-3" /> End-to-End Encrypted
              </span>
              {useCloudStorage ? (
                <span className="flex items-center gap-1.5 bg-blue-50 text-blue-700 px-2.5 py-1 rounded-full border border-blue-200 font-medium">
                  <Cloud className="h-3 w-3" /> Cloud Mode - Files Sync
                </span>
              ) : (
                <span className="flex items-center gap-1.5 bg-yellow-50 text-yellow-700 px-2.5 py-1 rounded-full border border-yellow-200 font-medium">
                  <HardDrive className="h-3 w-3" /> Local Mode - No Sync
                </span>
              )}
              <button 
                onClick={handleCopyInviteLink}
                className="flex items-center gap-1.5 hover:bg-slate-100 px-2.5 py-1 rounded-full transition-all duration-200 cursor-pointer group hover:scale-105 active:scale-95"
                title="Copy portal link"
              >
                <span className="font-mono font-bold text-slate-600">
                  {accessToken.slice(0, 4)}***
                </span>
                <LinkIcon className="h-3.5 w-3.5 text-slate-400 group-hover:text-brand-600 transition-colors" />
              </button>
            </div>
          </div>
        </div>
        <div className="flex gap-2">
          <button 
            onClick={handleCopyInviteLink}
            className="btn-secondary text-sm hidden lg:flex items-center gap-2 hover:scale-105 active:scale-95 transition-transform"
          >
            <LinkIcon className="h-4 w-4" /> Copy Link
          </button>
          <button 
            onClick={logout} 
            className="btn-secondary text-sm text-red-600 hover:bg-red-50 border-red-200 hover:scale-105 active:scale-95 transition-transform flex items-center gap-2"
          >
            <Unlock className="h-4 w-4" /> Leave
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 p-1.5 bg-slate-100 rounded-xl w-fit shadow-inner">
        {['messages', 'files', 'encrypt'].map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-5 py-2.5 rounded-lg text-sm font-semibold transition-all duration-200 flex items-center gap-2 ${
              activeTab === tab 
                ? 'bg-white text-brand-600 shadow-md scale-105' 
                : 'text-slate-500 hover:text-slate-700 hover:bg-slate-50'
            }`}
          >
            {tab === 'messages' && <Send className={`h-4 w-4 ${activeTab === tab ? 'text-brand-600' : ''}`} />}
            {tab === 'files' && <Upload className={`h-4 w-4 ${activeTab === tab ? 'text-brand-600' : ''}`} />}
            {tab === 'encrypt' && <Key className={`h-4 w-4 ${activeTab === tab ? 'text-brand-600' : ''}`} />}
            <span>{tab.charAt(0).toUpperCase() + tab.slice(1)}</span>
          </button>
        ))}
      </div>

      {/* MESSAGES TAB */}
      {activeTab === 'messages' && (
        <div className="card h-[600px] flex flex-col p-0 overflow-hidden shadow-lg border border-slate-200">
          <div className="p-4 border-b border-slate-200 bg-gradient-to-r from-white to-slate-50/50 flex justify-between items-center shadow-sm">
            <div className="flex items-center gap-3">
              <div className="h-8 w-8 bg-brand-500 rounded-lg flex items-center justify-center shadow-sm">
                <Send className="h-4 w-4 text-white" />
              </div>
              <div>
                <h3 className="font-semibold text-slate-800">Secure Chat</h3>
                <p className="text-xs text-slate-500">{messages.length} {messages.length === 1 ? 'message' : 'messages'}</p>
              </div>
            </div>
            <div className="flex gap-2">
              {messages.length > 0 && (
                <button 
                  onClick={handleClearChat}
                  className="p-2 hover:bg-red-50 text-slate-400 hover:text-red-600 rounded-lg transition-all duration-200 hover:scale-110 active:scale-95"
                  title="Clear all messages"
                  aria-label="Clear all messages"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              )}
              <button 
                onClick={() => loadData()} 
                className="p-2 hover:bg-slate-200 text-slate-400 hover:text-slate-700 rounded-lg transition-all duration-200 hover:scale-110 active:scale-95"
                title="Refresh messages"
                aria-label="Refresh messages"
              >
                <RefreshCw className="h-4 w-4" />
              </button>
            </div>
          </div>
          
          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50">
            <style>{`
              .message-content table {
                border-collapse: collapse;
                margin: 8px 0;
                width: 100%;
                font-size: 0.875rem;
              }
              .message-content table td, .message-content table th {
                border: 1px solid #cbd5e1;
                padding: 6px 10px;
                text-align: left;
              }
              .message-content table th {
                background-color: #f1f5f9;
                font-weight: 600;
              }
              .message-content table tr:nth-child(even) {
                background-color: #f8fafc;
              }
            `}</style>
            {messages.length === 0 ? (
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="h-full flex flex-col items-center justify-center text-slate-400 px-4"
              >
                <div className="bg-gradient-to-br from-slate-100 to-slate-50 p-6 rounded-full mb-6 shadow-inner">
                  <Send className="h-10 w-10 text-slate-400" />
                </div>
                <h3 className="font-semibold text-lg text-slate-700 mb-2">No messages yet</h3>
                <p className="text-sm text-slate-500 max-w-sm text-center leading-relaxed">
                  Start the conversation! Anyone who opens this portal will automatically see all messages in real-time.
                </p>
                <div className="mt-6 flex items-center gap-2 text-xs text-slate-400">
                  <Lock className="h-3 w-3" />
                  <span>All messages are end-to-end encrypted</span>
                </div>
              </motion.div>
            ) : (
              messages.map((msg, index) => (
                <motion.div 
                  initial={{ opacity: 0, y: 10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  transition={{ delay: index * 0.03, duration: 0.2 }}
                  key={msg.id} 
                  className="group flex flex-col items-end mb-1"
                >
                  <div className="max-w-[85%] sm:max-w-[75%] bg-gradient-to-br from-white to-slate-50 border border-slate-200/80 p-4 rounded-2xl rounded-tr-sm shadow-sm hover:shadow-lg transition-all duration-200 relative group/message">
                    <div 
                      className="message-content text-slate-800 leading-relaxed"
                      dangerouslySetInnerHTML={{ 
                        __html: (() => {
                          if (!msg.text || typeof msg.text !== 'string') return '';
                          try {
                            return isHTMLContent(msg.text)
                              ? sanitizeHTML(msg.text) // Sanitize HTML for security
                              : msg.text.replace(/\n/g, '<br>').replace(/</g, '&lt;').replace(/>/g, '&gt;');
                          } catch (error) {
                            console.error('Error rendering message', error);
                            return msg.text.replace(/</g, '&lt;').replace(/>/g, '&gt;');
                          }
                        })()
                      }}
                      style={{
                        wordBreak: 'break-word',
                        whiteSpace: 'pre-wrap'
                      }}
                      role="article"
                      aria-label={`Message from ${msg.author || 'User'}`}
                    />
                    <div className="flex items-center justify-between gap-3 mt-3 pt-2 border-t border-slate-100">
                      <span className="text-[10px] text-slate-400 font-medium">
                        {getRelativeTime(msg.timestamp)}
                      </span>
                      <div className="flex items-center gap-1 opacity-0 group-hover/message:opacity-100 transition-all duration-200">
                        <button 
                          onClick={async () => {
                            try {
                              // Extract plain text from HTML for copying
                              const tempDiv = document.createElement('div');
                              tempDiv.innerHTML = msg.text || '';
                              const plainText = tempDiv.textContent || tempDiv.innerText || msg.text || '';
                              await navigator.clipboard.writeText(plainText);
                              addToast('Message copied!', 'success');
                            } catch (err) {
                              console.error('Failed to copy message', err);
                              addToast('Failed to copy message', 'error');
                            }
                          }}
                          className="p-1.5 hover:bg-slate-100 rounded-md text-slate-400 hover:text-slate-700 transition-all duration-150 hover:scale-110 active:scale-95"
                          title="Copy message"
                          aria-label="Copy message to clipboard"
                        >
                          <Copy className="h-3.5 w-3.5" />
                        </button>
                        <button 
                          onClick={() => handleDeleteMessage(msg.id)}
                          className="p-1.5 hover:bg-red-50 rounded-md text-red-400 hover:text-red-600 transition-all duration-150 hover:scale-110 active:scale-95"
                          title="Delete message"
                          aria-label="Delete message"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))
            )}
            <div ref={messagesEndRef} />
          </div>

          <div className="p-4 bg-gradient-to-t from-white to-slate-50/50 border-t border-slate-200">
            <div className="flex gap-3 items-end">
              <div className="flex-1 relative">
                <div
                  ref={messageContentRef}
                  contentEditable
                  suppressContentEditableWarning
                  onInput={(e) => {
                    const content = e.currentTarget.innerHTML;
                    setNewMessage(content);
                  }}
                  onPaste={handlePaste}
                  onKeyDown={e => {
                     if (e.key === 'Enter' && !e.shiftKey) {
                       e.preventDefault();
                       handleSendMessage();
                     }
                  }}
                  onFocus={(e) => {
                    e.currentTarget.classList.add('ring-2', 'ring-brand-500/20');
                  }}
                  onBlur={(e) => {
                    e.currentTarget.classList.remove('ring-2', 'ring-brand-500/20');
                  }}
                  data-placeholder="Type a message... (supports tables and formatting)"
                  className="input-field min-h-[64px] max-h-[200px] overflow-y-auto resize-none transition-all duration-200 focus:ring-2 focus:ring-brand-500/20 focus:border-brand-300"
                  style={{
                    whiteSpace: 'pre-wrap',
                    wordBreak: 'break-word',
                    outline: 'none',
                    minHeight: '64px',
                    padding: '12px 16px'
                  }}
                />
                <style>{`
                  [contenteditable][data-placeholder]:empty:before {
                    content: attr(data-placeholder);
                    color: #94a3b8;
                    pointer-events: none;
                    font-style: italic;
                  }
                  [contenteditable]:focus {
                    border-color: rgb(99 102 241);
                  }
                  [contenteditable] table {
                    border-collapse: collapse;
                    margin: 8px 0;
                    width: 100%;
                    font-size: 0.875rem;
                  }
                  [contenteditable] table td, [contenteditable] table th {
                    border: 1px solid #cbd5e1;
                    padding: 4px 8px;
                    text-align: left;
                  }
                  [contenteditable] table th {
                    background-color: #f1f5f9;
                    font-weight: 600;
                  }
                  [contenteditable] table tr:nth-child(even) {
                    background-color: #f8fafc;
                  }
                `}</style>
              </div>
              <button 
                onClick={handleSendMessage}
                disabled={!encryptionKey || sendingMessage}
                className="btn-primary self-end disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 min-w-[100px] justify-center h-[64px] px-6 shadow-md hover:shadow-lg transition-all duration-200 hover:scale-105 active:scale-95 disabled:hover:scale-100"
                aria-label="Send message"
              >
                {sendingMessage ? (
                  <>
                    <Loader2 className="h-5 w-5 animate-spin" />
                    <span className="hidden sm:inline font-medium">Sending...</span>
                  </>
                ) : (
                  <>
                    <Send className="h-5 w-5" />
                    <span className="hidden sm:inline font-medium">Send</span>
                  </>
                )}
              </button>
            </div>
            <div className="text-xs text-center text-slate-400 mt-3 flex items-center justify-center gap-2 flex-wrap">
              <span className="flex items-center gap-1.5 px-2 py-1 bg-slate-50 rounded-full">
                <Lock className="h-3 w-3 text-green-500" /> 
                <span className="font-medium">Encrypted</span>
              </span>
              <span className="text-slate-300">•</span>
              <span className="px-2 py-1 bg-slate-50 rounded-full">
                <span className="font-medium">Real-time sync</span>
              </span>
              {lastSyncTime && (
                <>
                  <span className="text-slate-300">•</span>
                  <span className="text-slate-500">
                    {(() => {
                      try {
                        return lastSyncTime instanceof Date ? lastSyncTime.toLocaleTimeString() : new Date(lastSyncTime).toLocaleTimeString();
                      } catch {
                        return 'Just now';
                      }
                    })()}
                  </span>
                </>
              )}
            </div>
          </div>
        </div>
      )}

      {/* FILES TAB */}
      {activeTab === 'files' && (
        <div className="space-y-6">
          {!useCloudStorage && (
            <div className="card bg-yellow-50 border-2 border-yellow-300 p-4">
              <div className="flex items-center gap-2 text-yellow-800">
                <AlertCircle className="h-5 w-5" />
                <span className="font-bold">⚠️ Local Mode Active - Files Won't Sync!</span>
              </div>
              <p className="text-yellow-700 mt-2 text-sm">
                Files are stored only in this browser's localStorage and <strong>will NOT sync to other computers</strong>. 
                For cross-device sync, you need to enable Cloud Mode with Supabase.
              </p>
              <p className="text-yellow-600 mt-2 text-xs">
                Check your .env file has VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY configured.
              </p>
            </div>
          )}
          {useCloudStorage && (
            <div className="card bg-blue-50 border-2 border-blue-300 p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-blue-800">
                  <Cloud className="h-5 w-5" />
                  <span className="font-bold">Cloud Mode Active - Files Sync Across Devices</span>
                </div>
                <button
                  onClick={() => {
                    loadData();
                    addToast('Refreshing files from cloud...', 'info');
                  }}
                  className="btn-secondary text-sm flex items-center gap-2"
                >
                  <RefreshCw className="h-4 w-4" />
                  Refresh
                </button>
              </div>
              <p className="text-blue-700 mt-2 text-sm">
                Files automatically sync every 3 seconds. Click "Refresh" to sync manually.
              </p>
            </div>
          )}
          {error && (
            <div className="card bg-red-50 border-2 border-red-200 p-4">
              <div className="flex items-center gap-2 text-red-700">
                <AlertCircle className="h-5 w-5" />
                <span className="font-semibold">Upload Error:</span>
              </div>
              <p className="text-red-600 mt-2 text-sm">{error}</p>
              <button 
                onClick={() => setError('')}
                className="mt-3 text-xs text-red-600 hover:text-red-800 underline"
              >
                Dismiss
              </button>
            </div>
          )}
           <div 
             className={`card border-2 border-dashed transition-all duration-200 ${
               isDragging 
                 ? 'border-brand-500 bg-brand-50 scale-[1.01] shadow-lg' 
                 : 'border-brand-200 hover:border-brand-400 bg-brand-50/30'
             }`}
             onDragOver={handleDragOver}
             onDragLeave={handleDragLeave}
             onDrop={handleDrop}
           >
             <input
               type="file"
               multiple
               onChange={handleFileUpload}
               className="hidden"
               id="file-upload"
               ref={fileInputRef}
               disabled={uploading || !isAuthenticated || !encryptionKey}
             />
             <label 
               htmlFor="file-upload" 
               className={`flex flex-col items-center py-12 ${(!isAuthenticated || !encryptionKey) ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'}`}
             >
               <div className={`h-20 w-20 rounded-full shadow-sm flex items-center justify-center mb-4 transition-colors ${
                 isDragging ? 'bg-brand-100' : 'bg-white'
               }`}>
                 <Upload className={`h-10 w-10 text-brand-600 ${uploading ? 'animate-bounce' : ''}`} />
               </div>
               <span className="text-xl font-bold text-brand-900 mb-2">
                 {!isAuthenticated || !encryptionKey 
                   ? 'Please wait for authentication...' 
                   : uploading 
                     ? 'Encrypting & Uploading...' 
                     : isDragging 
                       ? 'Drop Files to Securely Upload' 
                       : 'Click or Drag Files Here'}
               </span>
               <span className="text-sm text-slate-500 max-w-xs text-center">
                 Files are encrypted client-side with AES-GCM before leaving your browser
               </span>
               <div className="mt-3 text-xs text-slate-400 max-w-md text-center space-y-1">
                 {useCloudStorage ? (
                   <>
                     <p><strong>Cloud Mode:</strong> Supports large files up to ~200MB</p>
                     <p className="text-slate-400">Power BI files (.pbix) work best with Cloud mode enabled</p>
                     <p className="text-slate-300">Free tier: 1GB total storage</p>
                   </>
                 ) : (
                   <>
                     <p><strong>Local Mode:</strong> Max 5MB per file</p>
                     <p className="text-slate-400">Enable Cloud mode (Supabase) for larger Power BI files</p>
                   </>
                 )}
               </div>
             </label>
           </div>

           <div className="grid gap-4">
             {files.map(file => (
               <motion.div 
                 layout
                 initial={{ opacity: 0 }}
                 animate={{ opacity: 1 }}
                 key={file.id} 
                 className="card flex items-center gap-4 p-4 hover:shadow-md transition-shadow"
               >
                 <div className="h-12 w-12 bg-slate-100 rounded-lg flex items-center justify-center">
                   {file.type.includes('image') ? (
                     <Image className="h-6 w-6 text-slate-500" />
                   ) : (
                     <FileText className="h-6 w-6 text-slate-500" />
                   )}
                 </div>
                 <div className="flex-1 min-w-0">
                   <h4 className="font-medium text-slate-900 truncate">{file.name}</h4>
                   <p className="text-xs text-slate-500">
                     {(() => {
                       try {
                         const sizeKB = file.size ? (file.size / 1024).toFixed(1) : '0';
                         const date = file.uploadedAt ? (() => {
                           try {
                             const d = new Date(file.uploadedAt);
                             return isNaN(d.getTime()) ? 'Unknown' : d.toLocaleString();
                           } catch {
                             return 'Unknown';
                           }
                         })() : 'Unknown';
                         return `${sizeKB} KB • ${date}`;
                       } catch {
                         return 'Unknown size • Unknown date';
                       }
                     })()}
                   </p>
                 </div>
                 <div className="flex gap-2">
                   <button 
                     onClick={() => handleDownloadFile(file)}
                     className="btn-secondary text-xs"
                   >
                     <Download className="h-4 w-4 mr-1" /> Download
                   </button>
                   <button 
                     onClick={() => handleDeleteFile(file.id)}
                     className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                   >
                     <Trash2 className="h-4 w-4" />
                   </button>
                 </div>
               </motion.div>
             ))}
             {files.length === 0 && (
               <div className="text-center py-12 text-slate-400">
                 <File className="h-12 w-12 mx-auto mb-2 opacity-20" />
                 <p>No files shared yet</p>
                 <p className="text-sm text-slate-400 mt-2">
                  Anyone who opens this portal can see and share files.
                </p>
               </div>
             )}
           </div>
        </div>
      )}

      {/* ENCRYPT TOOL TAB */}
      {activeTab === 'encrypt' && (
        <div className="grid md:grid-cols-2 gap-6">
          <div className="card space-y-4">
            <h3 className="font-bold flex items-center gap-2">
              <Lock className="h-5 w-5 text-brand-600" /> Encrypt Text
            </h3>
            <textarea
              value={textToEncrypt}
              onChange={e => setTextToEncrypt(e.target.value)}
              className="input-field w-full h-32 resize-none"
              placeholder="Enter sensitive text..."
            />
            <button onClick={handleToolEncrypt} className="btn-primary w-full">
              Encrypt
            </button>
            {encryptedText && (
              <div className="bg-slate-900 text-green-400 p-3 rounded-lg text-xs font-mono break-all relative group">
                {encryptedText}
                <button 
                  onClick={() => {
                    navigator.clipboard.writeText(encryptedText);
                    addToast('Copied!', 'success');
                  }}
                  className="absolute top-2 right-2 p-1 bg-slate-800 rounded opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <Copy className="h-3 w-3" />
                </button>
              </div>
            )}
          </div>

          <div className="card space-y-4">
            <h3 className="font-bold flex items-center gap-2">
              <Unlock className="h-5 w-5 text-brand-600" /> Decrypt Text
            </h3>
            <textarea
              value={textToDecrypt}
              onChange={e => setTextToDecrypt(e.target.value)}
              className="input-field w-full h-32 resize-none"
              placeholder="Paste encrypted string..."
            />
            <button onClick={handleToolDecrypt} className="btn-secondary w-full">
              Decrypt
            </button>
            {decryptedText && (
              <div className="bg-green-50 text-green-900 p-3 rounded-lg text-sm border border-green-200">
                {decryptedText}
              </div>
            )}
          </div>
        </div>
      )}

    </div>
  );
};

export default SecureFilePortal;
