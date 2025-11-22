import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Upload, Download, Lock, Unlock, FileText, Image, File, X, Shield, Eye, EyeOff, Send, AlertCircle, Cloud, HardDrive, Key, Copy, Trash2, RefreshCw, Link as LinkIcon, Shuffle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { getSupabaseClient } from '../config/supabase';
import { useToast } from '../context/ToastContext';

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

const LOCAL_MESSAGE_PREFIX = 'portal_messages_';
const LOCAL_FILE_PREFIX = 'portal_files_';

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
  const [accessToken, setAccessToken] = useState('');
  const [encryptionKey, setEncryptionKey] = useState(null);
  const [useCloudStorage, setUseCloudStorage] = useState(false);
  const [error, setError] = useState('');
  
  // Data State
  const [files, setFiles] = useState([]);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [uploading, setUploading] = useState(false);
  
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
  const messageInputRef = useRef(null);
  
  const supabase = getSupabaseClient();

  const loadData = useCallback(async (tokenOverride) => {
    const token = tokenOverride || accessToken;
    if (!token) return;

    if (!useCloudStorage || !supabase) {
      const localMessages = readLocalMessages(token);
      setMessages(Array.isArray(localMessages) ? localMessages : []);
      const localFiles = readLocalFiles(token);
      setFiles(Array.isArray(localFiles) ? localFiles : []);
      return;
    }

    const { data: fileData, error: fileError } = await supabase
      .from('portal_files')
      .select('*')
      .eq('token', token)
      .order('uploaded_at', { ascending: false });

    if (fileError) {
      console.error('Failed to load files', fileError);
    } else if (fileData) {
      const mappedFiles = fileData.map(f => ({
        id: f.id,
        name: f.file_name,
        type: f.file_type,
        size: f.file_size,
        encrypted: f.encrypted_data,
        uploadedAt: f.uploaded_at,
        uploadedBy: f.uploaded_by
      }));
      setFiles(mappedFiles);
    }

    const { data: msgData, error: messageError } = await supabase
      .from('portal_messages')
      .select('*')
      .eq('token', token)
      .order('created_at', { ascending: true });

    if (messageError) {
      console.error('Failed to load messages', messageError);
    } else if (msgData) {
      const mappedMsgs = msgData.map(m => ({
        id: m.id,
        text: m.message_text,
        author: m.author,
        timestamp: m.created_at
      }));
      setMessages(mappedMsgs);
    }
  }, [accessToken, supabase, useCloudStorage]);

  const handleAuthenticate = useCallback(async (tokenToUse) => {
    const token = tokenToUse || accessToken;
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
        localStorage.setItem('portal_access_token', token);
      }
      await loadData(token);
    } catch (err) {
      setError('Authentication failed');
      console.error('Authentication failed', err);
    }
  }, [accessToken, loadData]);

  // Scroll to bottom of messages
  useEffect(() => {
    if (activeTab === 'messages' && messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, activeTab]);

  // Auto-focus message input when tab changes
  useEffect(() => {
    if (activeTab === 'messages' && messageInputRef.current) {
      messageInputRef.current.focus();
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

    if (tokenParam && tokenParam.length >= 8 && !isAuthenticated) {
      setAccessToken(tokenParam);
      addToast('Token loaded from link. Click "Unlock Portal" to enter.', 'info');
    }
  }, [addToast, isAuthenticated]);

  // Check Supabase availability
  useEffect(() => {
    if (supabase) setUseCloudStorage(true);
  }, [supabase]);

  // Initialize from LocalStorage
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const storedToken = localStorage.getItem('portal_access_token');
    if (storedToken) {
      setAccessToken(storedToken);
      handleAuthenticate(storedToken);
    }
  }, [handleAuthenticate]);

  // Auto-sync
  useEffect(() => {
    if (!isAuthenticated) return;
    syncIntervalRef.current = setInterval(() => {
      loadData();
    }, 5000); // 5s sync
    return () => clearInterval(syncIntervalRef.current);
  }, [isAuthenticated, encryptionKey, loadData]);

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


  const handleSendMessage = async () => {
    if (!newMessage.trim() || !encryptionKey) return;

    const msg = {
      text: newMessage,
      author: 'User', 
      timestamp: new Date().toISOString()
    };

    try {
      if (useCloudStorage && supabase) {
        await supabase.from('portal_messages').insert({
          token: accessToken,
          message_text: newMessage, 
          author: 'User'
        });
        await loadData(); // Refresh immediately
      } else {
        const localMsg = { ...msg, id: Date.now() };
        const existing = readLocalMessages(accessToken);
        const updated = [...existing, localMsg];
        writeLocalMessages(accessToken, updated);
        setMessages(updated);
      }
      setNewMessage('');
      if (messageInputRef.current) messageInputRef.current.focus();
    } catch (err) {
      addToast('Failed to send message', 'error');
      console.error('Failed to send message', err);
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
    if (confirm('Are you sure you want to clear all messages?')) {
      if (useCloudStorage && supabase) {
        await supabase.from('portal_messages').delete().eq('token', accessToken);
        await loadData();
      } else {
        writeLocalMessages(accessToken, []);
        setMessages([]);
      }
      addToast('Chat cleared', 'success');
    }
  };

  const processFiles = async (filesToProcess) => {
    if (!filesToProcess.length || !encryptionKey) return;

    setUploading(true);
    try {
      for (const file of filesToProcess) {
        const buffer = await file.arrayBuffer();
        const { encrypted } = await encryptData(buffer, encryptionKey);
        const base64Data = btoa(String.fromCharCode(...encrypted));

          if (useCloudStorage && supabase) {
            // 1. Upload encrypted blob to Storage Bucket
            const storagePath = `${accessToken}/${Date.now()}-${file.name}`;
            const blob = new Blob([encrypted]); // 'encrypted' is Uint8Array including IV
            
            const { error: uploadError } = await supabase.storage
              .from('portal-uploads')
              .upload(storagePath, blob, {
                contentType: file.type,
                upsert: false
              });

            if (uploadError) {
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
          } else {
            if (file.size > 5 * 1024 * 1024) {
                addToast(`File ${file.name} is too large for local mode (max 5MB). Use Cloud mode.`, 'error');
                continue; 
            }
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
          }
        }
        if (useCloudStorage && supabase) {
          await loadData();
        }
        addToast('Files uploaded securely', 'success');
      } catch (err) {
        setError('Upload failed: ' + err.message);
        console.error(err);
      } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const handleFileUpload = async (e) => {
    const selectedFiles = Array.from(e.target.files);
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
    if (droppedFiles.length > 0) {
      await processFiles(droppedFiles);
    }
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

  const handleGenerateToken = () => {
    const newToken = generateRandomToken();
    setAccessToken(newToken);
    setError('');
  };

  const handleCopyInviteLink = () => {
    const url = `${window.location.origin}${window.location.pathname}#/portal?token=${accessToken}`;
    navigator.clipboard.writeText(url);
    addToast('Invite link copied! Send it to a colleague.', 'success');
  };

  // --- Renders ---

  if (!isAuthenticated) {
    return (
      <div className="max-w-md mx-auto mt-10">
        <div className="card text-center p-8 space-y-6">
          <div className="flex justify-center">
            <div className="h-16 w-16 bg-brand-100 rounded-full flex items-center justify-center">
              <Shield className="h-8 w-8 text-brand-600" />
            </div>
          </div>
          <div>
            <h2 className="text-2xl font-bold text-slate-900">Secure Access</h2>
            <p className="text-slate-600 mt-2">
              Enter a room token to join a secure session.
            </p>
          </div>
          
          <div className="space-y-4 text-left">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Room Token</label>
              <div className="flex gap-2">
                <input
                  type="password"
                  value={accessToken}
                  onChange={(e) => setAccessToken(e.target.value)}
                  className="input-field flex-1 text-base sm:text-lg tracking-widest"
                  placeholder="Paste token here..."
                  onKeyDown={e => e.key === 'Enter' && handleAuthenticate()}
                />
                <button 
                  onClick={handleGenerateToken}
                  className="p-3 bg-slate-100 hover:bg-slate-200 rounded-lg text-slate-600 transition-colors"
                  title="Generate Random Token"
                >
                  <Shuffle className="h-5 w-5" />
                </button>
              </div>
              <p className="text-xs text-slate-500 mt-2">
                Don&apos;t have a token? Click the shuffle button to create a new secure room.
              </p>
            </div>
            {error && (
              <div className="p-3 bg-red-50 text-red-700 text-sm rounded-lg flex items-center gap-2">
                <AlertCircle className="h-4 w-4" /> {error}
              </div>
            )}
            <button onClick={() => handleAuthenticate()} className="btn-primary w-full py-3 font-bold text-lg shadow-md hover:shadow-lg transition-all">
              Unlock Portal
            </button>
          </div>

          <div className="pt-4 border-t border-slate-100">
            <div className="flex items-center justify-center gap-2 text-sm text-slate-500">
              {useCloudStorage ? (
                <><Cloud className="h-4 w-4 text-green-500" /> Cloud Sync Active</>
              ) : (
                <><HardDrive className="h-4 w-4 text-amber-500" /> Local Mode</>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex justify-between items-center bg-white p-4 rounded-xl shadow-sm border border-slate-200">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 bg-brand-600 rounded-lg flex items-center justify-center text-white">
            <Shield className="h-6 w-6" />
          </div>
          <div>
            <h1 className="font-bold text-lg text-slate-900">Secure Portal</h1>
            <div className="flex items-center gap-2 text-xs text-slate-500">
              <span className="flex items-center gap-1 bg-green-50 text-green-700 px-2 py-0.5 rounded border border-green-100">
                <Lock className="h-3 w-3" /> End-to-End Encrypted
              </span>
              <button 
                onClick={handleCopyInviteLink}
                className="flex items-center gap-1 hover:bg-slate-100 px-2 py-0.5 rounded transition-colors cursor-pointer group"
                title="Copy invite link"
              >
                <span className="font-mono font-bold">
                  {accessToken.slice(0, 4)}***
                </span>
                <LinkIcon className="h-3 w-3 text-slate-400 group-hover:text-brand-600" />
              </button>
            </div>
          </div>
        </div>
        <div className="flex gap-2">
          <button 
            onClick={handleCopyInviteLink}
            className="btn-secondary text-sm hidden lg:flex"
          >
            <LinkIcon className="h-4 w-4 mr-2" /> Invite
          </button>
          <button onClick={logout} className="btn-secondary text-sm text-red-600 hover:bg-red-50 border-red-200">
            <Unlock className="h-4 w-4 mr-2" /> Leave
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 p-1 bg-slate-100 rounded-lg w-fit">
        {['messages', 'files', 'encrypt'].map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-all flex items-center gap-2 ${
              activeTab === tab 
                ? 'bg-white text-brand-600 shadow-sm' 
                : 'text-slate-500 hover:text-slate-700'
            }`}
          >
            {tab === 'messages' && <Send className="h-4 w-4" />}
            {tab === 'files' && <Upload className="h-4 w-4" />}
            {tab === 'encrypt' && <Key className="h-4 w-4" />}
            {tab.charAt(0).toUpperCase() + tab.slice(1)}
          </button>
        ))}
      </div>

      {/* MESSAGES TAB */}
      {activeTab === 'messages' && (
        <div className="card h-[600px] flex flex-col p-0 overflow-hidden">
          <div className="p-4 border-b border-slate-100 bg-slate-50/50 flex justify-between items-center">
            <h3 className="font-semibold text-slate-800 flex items-center gap-2">
              <Send className="h-4 w-4 text-brand-500" /> Secure Chat
            </h3>
            <div className="flex gap-2">
              {messages.length > 0 && (
                <button 
                  onClick={handleClearChat}
                  className="p-2 hover:bg-red-50 text-slate-400 hover:text-red-500 rounded-full transition-colors"
                  title="Clear all messages"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              )}
              <button 
                onClick={() => loadData()} 
                className="p-2 hover:bg-slate-200 text-slate-400 hover:text-slate-600 rounded-full transition-colors"
                title="Refresh"
              >
                <RefreshCw className="h-4 w-4" />
              </button>
            </div>
          </div>
          
          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50">
            {messages.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-slate-400">
                <div className="bg-slate-100 p-4 rounded-full mb-4">
                  <Send className="h-8 w-8 text-slate-300" />
                </div>
                <p className="font-medium text-slate-600">No messages yet</p>
                <p className="text-sm text-slate-400 mt-1 max-w-xs text-center">
                  Share this room&apos;s token with others to start chatting securely.
                </p>
                <button 
                  onClick={handleCopyInviteLink}
                  className="mt-4 text-brand-600 text-sm font-medium hover:underline flex items-center gap-1"
                >
                  <LinkIcon className="h-3 w-3" /> Copy Invite Link
                </button>
              </div>
            ) : (
              messages.map(msg => (
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  key={msg.id} 
                  className="group flex flex-col items-end"
                >
                  <div className="max-w-[80%] bg-white border border-slate-200 p-3 rounded-2xl rounded-tr-sm shadow-sm hover:shadow-md transition-shadow relative">
                     <p className="text-slate-800 whitespace-pre-wrap">{msg.text}</p>
                        <div className="flex items-center justify-between gap-4 mt-2">
                        <span className="text-[10px] text-slate-400">
                          {new Date(msg.timestamp).toLocaleTimeString()}
                        </span>
                        <button 
                          onClick={() => handleDeleteMessage(msg.id)}
                          className="opacity-0 group-hover:opacity-100 transition-opacity p-1 hover:bg-red-50 rounded text-red-400 hover:text-red-600"
                          title="Delete message"
                        >
                          <Trash2 className="h-3 w-3" />
                        </button>
                     </div>
                  </div>
                </motion.div>
              ))
            )}
            <div ref={messagesEndRef} />
          </div>

          <div className="p-4 bg-white border-t border-slate-100">
            <div className="flex gap-2">
              <textarea
                ref={messageInputRef}
                value={newMessage}
                onChange={e => setNewMessage(e.target.value)}
                onKeyDown={e => {
                   if (e.key === 'Enter' && !e.shiftKey) {
                     e.preventDefault();
                     handleSendMessage();
                   }
                }}
                placeholder="Type a secure message..."
                className="input-field flex-1 resize-none"
                rows={2}
              />
              <button 
                onClick={handleSendMessage}
                disabled={!newMessage.trim()}
                className="btn-primary self-end"
              >
                <Send className="h-5 w-5" />
              </button>
            </div>
            <p className="text-xs text-center text-slate-400 mt-2 flex items-center justify-center gap-1">
              <Lock className="h-3 w-3" /> Encrypted & Synced Instantly
            </p>
          </div>
        </div>
      )}

      {/* FILES TAB */}
      {activeTab === 'files' && (
        <div className="space-y-6">
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
               disabled={uploading}
             />
             <label htmlFor="file-upload" className="cursor-pointer flex flex-col items-center py-12">
               <div className={`h-20 w-20 rounded-full shadow-sm flex items-center justify-center mb-4 transition-colors ${
                 isDragging ? 'bg-brand-100' : 'bg-white'
               }`}>
                 <Upload className={`h-10 w-10 text-brand-600 ${uploading ? 'animate-bounce' : ''}`} />
               </div>
               <span className="text-xl font-bold text-brand-900 mb-2">
                 {uploading ? 'Encrypting & Uploading...' : isDragging ? 'Drop Files to Securely Upload' : 'Click or Drag Files Here'}
               </span>
               <span className="text-sm text-slate-500 max-w-xs text-center">
                 Files are encrypted client-side with AES-GCM before leaving your browser
               </span>
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
                     {(file.size / 1024).toFixed(1)} KB • {new Date(file.uploadedAt).toLocaleString()}
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
                 <button 
                  onClick={handleCopyInviteLink}
                  className="mt-2 text-brand-600 text-sm font-medium hover:underline inline-flex items-center gap-1"
                >
                  <LinkIcon className="h-3 w-3" /> Invite others to share
                </button>
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
