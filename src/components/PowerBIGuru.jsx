import React, { useState, useEffect, useRef } from 'react';
import { Send, Bot, User, Sparkles, Settings, Key, Database, AlertCircle, Copy, Trash2, Download, MessageSquare, ChevronDown, NotebookPen, Eraser, Wand2, Maximize2, Minimize2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { useToast } from '../context/ToastContext';

// Local Knowledge Base (Mocking internal data for "Free Tier")
const LOCAL_KNOWLEDGE = [
    {
        keywords: ['yoy', 'year over year', 'growth'],
        answer: "For Year-over-Year growth, use the 'YoY Growth %' pattern in the DAX Library. It uses `SAMEPERIODLASTYEAR`.",
        link: '/dax'
    },
    {
        keywords: ['blue', 'color', 'hex', 'brand'],
        answer: "The official HHS Blue hex code is #005EA2. You can find the full palette in the Style Guide.",
        link: '/style-guide'
    },
    {
        keywords: ['pareto', '80/20'],
        answer: "We have a Pareto Analysis pattern in the DAX Library under 'Advanced Analytics'.",
        link: '/dax'
    },
    {
        keywords: ['font', 'typography'],
        answer: "The approved font is 'Source Sans Pro'. See the Style Guide for heading sizes.",
        link: '/style-guide'
    },
    {
        keywords: ['dax', 'measure', 'calculation'],
        answer: "The DAX Library contains patterns for Time Intelligence, Financial Formulas, and more. Check the 'DAX Library' tab.",
        link: '/dax'
    }
];

const createInitialMessage = () => ({
    id: 'welcome',
    text: "Hi, I'm your Analytics Assistant. Ask me about DAX, HHS Branding, or data strategy.",
    sender: 'bot',
    isSystem: true,
    createdAt: new Date().toISOString()
});

const QUICK_PROMPTS = [
    { label: 'Generate DAX', value: 'Create a reusable DAX measure for year-over-year revenue with clear comments.' },
    { label: 'Explain Visual', value: 'Explain how to design an executive KPI card for Power BI with HHS branding guidance.' },
    { label: 'Build Checklist', value: 'Give me a pre-publish checklist for a Power BI report destined for leadership review.' },
    { label: 'Debug Measure', value: 'Help me troubleshoot why my DAX measure is returning blank values.' }
];

const NOTES_STORAGE_KEY = 'guru_session_notes';
const MESSAGES_STORAGE_KEY = 'guru_messages';

// Use Gemini models - try latest first, fallback to older versions
const GEMINI_MODELS = ["gemini-2.5-flash", "gemini-2.0-flash", "gemini-1.5-flash", "gemini-pro"];
const GEMINI_API_VERSIONS = ["v1beta", "v1"];
const GEMINI_MODEL = GEMINI_MODELS[0]; // Default to latest
const PROJECT_GEMINI_KEY = import.meta.env.VITE_GEMINI_API_KEY?.trim() || '';

const getStoredCustomKey = () => {
    if (typeof window === 'undefined') return '';
    const storedKey = window.localStorage.getItem('gemini_api_key');
    return storedKey ? storedKey.trim() : '';
};

const resolveInitialApiKey = () => {
    const customKey = getStoredCustomKey();
    if (customKey) {
        return { key: customKey, source: 'custom' };
    }
    if (PROJECT_GEMINI_KEY) {
        return { key: PROJECT_GEMINI_KEY, source: 'project' };
    }
    return { key: '', source: 'none' };
};

const PowerBIGuru = () => {
    const { addToast } = useToast();
    const initialKeyInfoRef = useRef(resolveInitialApiKey());
    const [messages, setMessages] = useState(() => {
        if (typeof window === 'undefined') return [createInitialMessage()];
        try {
            const saved = window.localStorage.getItem(MESSAGES_STORAGE_KEY);
            return saved ? JSON.parse(saved) : [createInitialMessage()];
        } catch (e) {
            console.error('Failed to parse messages', e);
            return [createInitialMessage()];
        }
    });
    const [input, setInput] = useState('');
    const [apiKey, setApiKey] = useState(initialKeyInfoRef.current.key);
    const [keyInput, setKeyInput] = useState(initialKeyInfoRef.current.source === 'custom' ? initialKeyInfoRef.current.key : '');
    const [isUsingCustomKey, setIsUsingCustomKey] = useState(initialKeyInfoRef.current.source === 'custom');
    const [showSettings, setShowSettings] = useState(false);
    const [isTyping, setIsTyping] = useState(false);
    const [connectionStatus, setConnectionStatus] = useState(initialKeyInfoRef.current.key ? 'connecting' : 'idle');
    const [connectionError, setConnectionError] = useState('');
    const [verifiedApiVersion, setVerifiedApiVersion] = useState(null);
    const messagesEndRef = useRef(null);
    const messagesContainerRef = useRef(null);
    const [isScrolledToBottom, setIsScrolledToBottom] = useState(true);
    const inputRef = useRef(null);
    const [sessionNotes, setSessionNotes] = useState(() => {
        if (typeof window === 'undefined') return '';
        return window.localStorage.getItem(NOTES_STORAGE_KEY) || '';
    });
    const [isCompactMode, setIsCompactMode] = useState(false);
    const [isMaximized, setIsMaximized] = useState(false);

    useEffect(() => {
        console.log("PowerBI Guru: Project Access Code", PROJECT_GEMINI_KEY ? "Available" : "Not Configured");
    }, []);

    useEffect(() => {
        if (typeof window === 'undefined') return;
        window.localStorage.setItem(MESSAGES_STORAGE_KEY, JSON.stringify(messages));
    }, [messages]);

    useEffect(() => {
        const lastMsg = messages[messages.length - 1];
        // If it's a new bot message, scroll to the *User's* previous message to keep context
        // This solves "start at the answer easily"
        if (lastMsg?.sender === 'bot' && !lastMsg.isSystem) {
             const prevMsg = messages[messages.length - 2];
             if (prevMsg?.sender === 'user') {
                 const el = document.getElementById(`message-${prevMsg.id}`);
                 if (el) {
                     el.scrollIntoView({ behavior: 'smooth', block: 'start' });
                     return;
                 }
             }
        }
        
        // Default behavior: scroll to bottom
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    // Track if user is scrolled to bottom
    useEffect(() => {
        const container = messagesContainerRef.current;
        if (!container) return;

        const handleScroll = () => {
            const { scrollTop, scrollHeight, clientHeight } = container;
            const atBottom = scrollTop + clientHeight >= scrollHeight - 10; // 10px tolerance
            setIsScrolledToBottom(atBottom);
        };

        container.addEventListener('scroll', handleScroll);
        // Initial check
        handleScroll();

        return () => container.removeEventListener('scroll', handleScroll);
    }, [messages]);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        if (typeof window === 'undefined') return;
        window.localStorage.setItem(NOTES_STORAGE_KEY, sessionNotes);
    }, [sessionNotes]);

    useEffect(() => {
        if (!inputRef.current) return;
        const textarea = inputRef.current;
        textarea.style.height = 'auto';
        const maxHeight = 200;
        textarea.style.height = `${Math.min(textarea.scrollHeight, maxHeight)}px`;
    }, [input]);

    useEffect(() => {
        const trimmedKey = apiKey.trim();

        if (!trimmedKey) {
            setConnectionStatus('idle');
            setConnectionError('');
            setVerifiedApiVersion(null);
            return;
        }

        let isCancelled = false;
        const controller = new AbortController();

        const verifyKey = async () => {
            setConnectionStatus('connecting');
            setConnectionError('');
            setVerifiedApiVersion(null);
            for (const apiVersion of GEMINI_API_VERSIONS) {
                try {
                    const response = await fetch(
                        `https://generativelanguage.googleapis.com/${apiVersion}/models/${encodeURIComponent(GEMINI_MODEL)}?key=${encodeURIComponent(trimmedKey)}`,
                        { signal: controller.signal }
                    );

                    if (!response.ok) {
                        const errorPayload = await response.json().catch(() => ({}));
                        const errorMessage = errorPayload?.error?.message || 'Unable to verify access code';

                        const isModelUnavailable = response.status === 404 || errorPayload?.error?.status === 'NOT_FOUND';
                        if (isModelUnavailable) {
                            console.warn(`[Gemini] Model ${GEMINI_MODEL} unavailable on API ${apiVersion}. Trying fallback version.`);
                            continue;
                        }

                        throw new Error(errorMessage);
                    }

                    if (isCancelled) return;
                    setConnectionStatus('connected');
                    setConnectionError('');
                    setVerifiedApiVersion(apiVersion);
                    console.info(`[Gemini] Verified ${GEMINI_MODEL} via ${apiVersion}.`);
                    return;
                } catch (error) {
                    if (controller.signal.aborted || isCancelled) return;
                    console.error(`[Gemini] verification error via ${apiVersion}:`, error);
                    break;
                }
            }

            // Don't block the user - just log the issue
            console.warn('[Gemini] Verification failed, but user can still try to chat');
            setConnectionStatus('idle'); // Allow user to try anyway
            setConnectionError(''); // Clear any error to not show in UI
            setVerifiedApiVersion(null);
        };

        verifyKey();

        return () => {
            isCancelled = true;
            controller.abort();
        };
    }, [apiKey]);

    const handleSaveKey = () => {
        const trimmedKey = keyInput.trim();
        if (!trimmedKey) {
            addToast('Please enter a valid access code', 'error');
            return;
        }
        if (typeof window !== 'undefined') {
            window.localStorage.setItem('gemini_api_key', trimmedKey);
        }
        setIsUsingCustomKey(true);
        setApiKey(trimmedKey);
        setKeyInput('');
        setConnectionStatus('connecting');
        setConnectionError('');
        setShowSettings(false);
        addToast('Personal access code saved. Connecting now...', 'success');
    };

    const handleClearKey = () => {
        if (typeof window !== 'undefined') {
            window.localStorage.removeItem('gemini_api_key');
        }
        const fallbackKey = PROJECT_GEMINI_KEY || '';
        setIsUsingCustomKey(false);
        setKeyInput('');
        setApiKey(fallbackKey);
        setConnectionStatus(fallbackKey ? 'connecting' : 'idle');
        setConnectionError('');
        addToast(
            fallbackKey ? 'Reverted to the built-in HHS access code.' : 'Access code removed. Running in local knowledge mode.',
            'info'
        );
    };

    const processLocalQuery = (query) => {
        const lowerQuery = query.toLowerCase();
        return LOCAL_KNOWLEDGE.find(item =>
            item.keywords.some(k => lowerQuery.includes(k))
        );
    };

    const handleCopyMessage = async (text) => {
        if (!text) return;
        try {
            if (typeof navigator === 'undefined' || !navigator.clipboard) {
                throw new Error('Clipboard unavailable');
            }
            await navigator.clipboard.writeText(text);
            addToast('Message copied to clipboard', 'success');
        } catch (error) {
            console.error('Copy failed', error);
            addToast('Unable to copy message', 'error');
        }
    };

    const handleClearChat = () => {
        if (confirm('Clear this conversation and start fresh?')) {
            setMessages([createInitialMessage()]);
            addToast('Conversation cleared', 'success');
            scrollToBottom();
        }
    };

    const handleExportChat = () => {
        const exportText = messages
            .filter(msg => !msg.isSystem)
            .map(msg => `${msg.sender.toUpperCase()} (${formatMessageTime(msg, true)}):\n${msg.text}`)
            .join('\n\n---\n\n');

        const blob = new Blob([exportText], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `power-bi-guru-chat-${new Date().toISOString().split('T')[0]}.txt`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        addToast('Chat exported', 'success');
    };

    const handleQuickPrompt = (promptText) => {
        setInput(promptText);
        inputRef.current?.focus();
    };

    const handleCopyNotes = async () => {
        if (!sessionNotes.trim()) {
            addToast('No notes to copy', 'info');
            return;
        }
        try {
            await navigator.clipboard.writeText(sessionNotes);
            addToast('Session notes copied', 'success');
        } catch (error) {
            console.error('Copy notes failed', error);
            addToast('Unable to copy notes', 'error');
        }
    };

    const handleClearNotes = () => {
        if (!sessionNotes.trim()) return;
        if (confirm('Clear session notes?')) {
            setSessionNotes('');
            addToast('Session notes cleared', 'success');
        }
    };

    const toggleCompactMode = () => {
        setIsCompactMode(prev => !prev);
    };

    const toggleMaximize = () => {
        setIsMaximized(prev => !prev);
    };

    const formatMessageTime = (msg, fallbackToNow = false) => {
        if (msg.isSystem && msg.id === 'welcome' && !fallbackToNow) return '';
        const source = msg.createdAt || (typeof msg.id === 'number' ? new Date(msg.id).toISOString() : null);
        const date = source ? new Date(source) : (fallbackToNow ? new Date() : null);
        if (!date) return '';
        return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    };

    const messageSpacingClass = isCompactMode ? 'space-y-2' : 'space-y-4';
    const messagePaddingClass = isCompactMode ? 'p-3 text-[13px]' : 'p-4 text-sm';
    const messageMetaClass = isCompactMode ? 'text-[10px]' : 'text-xs';

    // Typing Effect Hook
    const useTypingEffect = (text, shouldTyping) => {
        const [displayedText, setDisplayedText] = useState(shouldTyping ? '' : text);
        
        useEffect(() => {
            if (!shouldTyping) {
                setDisplayedText(text);
                return;
            }

            let index = 0;
            const intervalId = setInterval(() => {
                if (index >= text.length) {
                    clearInterval(intervalId);
                    setDisplayedText(text); // Ensure full match at end
                    return;
                }
                // Type faster for longer text to avoid boredom, but keep control
                // Base speed 15, accelerate to 50 for very long texts
                const baseStep = text.length > 1000 ? 50 : (text.length > 500 ? 25 : 10);
                const step = baseStep; 
                setDisplayedText(text.slice(0, index + step));
                index += step;
            }, 10);

            return () => clearInterval(intervalId);
        }, [text, shouldTyping]);

        return displayedText;
    };

    // Message Content Component with Typing Support
    const MessageContent = ({ text, isLastBotMessage }) => {
        const display = useTypingEffect(text, isLastBotMessage);
        
        // Only run the split logic if we have text
        if (!display) return <span className="animate-pulse">...</span>;

        const parts = display.split(/(```[\s\S]*?```)/g);
        return (
            <div className={`whitespace-pre-wrap leading-relaxed ${isCompactMode ? 'text-[13px]' : 'text-sm'}`}>
                {parts.map((part, i) => {
                    // Check for complete code blocks
                    if (part.startsWith('```') && part.endsWith('```')) {
                        const match = part.match(/^```(\w+)?\n([\s\S]*)```$/);
                        const language = match ? match[1] : '';
                        const content = match ? match[2] : part.slice(3, -3);
                        
                        return (
                            <div key={i} className="my-3 rounded-lg bg-slate-800 text-slate-100 overflow-hidden shadow-sm border border-slate-700">
                                <div className="flex justify-between items-center px-3 py-1.5 bg-slate-900/50 text-xs text-slate-400 border-b border-white/10 select-none">
                                    <span className="uppercase font-semibold tracking-wider text-[10px]">{language || 'CODE'}</span>
                                    <button 
                                       onClick={(e) => {
                                           e.stopPropagation();
                                           handleCopyMessage(content.trim());
                                       }}
                                       className="hover:text-white flex items-center gap-1.5 transition-colors"
                                    >
                                        <Copy className="h-3 w-3" /> Copy
                                    </button>
                                </div>
                                <pre className="p-3 overflow-x-auto font-mono text-xs sm:text-sm scrollbar-thin scrollbar-thumb-slate-600 scrollbar-track-transparent">
                                    <code>{content.trim()}</code>
                                </pre>
                            </div>
                        );
                    }
                    // Handle incomplete code blocks (during typing) or regular text
                    return <span key={i}>{part}</span>;
                })}
            </div>
        );
    };


    const handleSend = async () => {
        if (!input.trim()) return;

        const userMsg = { id: Date.now(), text: input, sender: 'user', createdAt: new Date().toISOString() };
        setMessages(prev => [...prev, userMsg]);
        setInput('');
        setIsTyping(true);

        // 1. Try Local Knowledge First
        const localMatch = processLocalQuery(userMsg.text);

        if (localMatch) {
            setTimeout(() => {
                setMessages(prev => [...prev, {
                    id: Date.now() + 1,
                    text: localMatch.answer,
                    sender: 'bot',
                    link: localMatch.link,
                    createdAt: new Date().toISOString()
                }]);
                setIsTyping(false);
            }, 600); // Fake delay for natural feel
            return;
        }

        const trimmedKey = apiKey.trim();

        // 2. Try Cloud AI if Key exists (don't block on verification status)
        if (trimmedKey) {

            try {
                const genAI = new GoogleGenerativeAI(trimmedKey);
                let model;
                let lastModelError;

                // Try different models in order of preference
                for (const modelName of GEMINI_MODELS) {
                    try {
                        model = genAI.getGenerativeModel({
                            model: modelName,
                            systemInstruction: "You are an expert Power BI Developer and Data Analyst for the US Department of Health and Human Services (HHS). Answer questions concisely and professionally. If it involves DAX, provide code snippets."
                        });
                        console.log(`Initialized model ${modelName}, attempting to use it...`);
                        // Don't test with generateContent - just try to use it directly
                        break; // Use this model
                    } catch (modelError) {
                        console.warn(`Model ${modelName} failed to initialize:`, modelError.message);
                        lastModelError = modelError;
                        continue; // Try next model
                    }
                }

                if (!model) {
                    throw lastModelError || new Error('No compatible Gemini model found');
                }

                // Format conversation for Gemini API
                const conversationHistory = messages
                    .filter(msg => !msg.isError && !msg.isSystem) // Exclude errors and system prompts
                    .map(msg => ({
                        role: msg.sender === 'user' ? 'user' : 'model',
                        parts: [{ text: msg.text }]
                    }));

                // Add current user message
                const contents = [
                    ...conversationHistory,
                    {
                        role: 'user',
                        parts: [{ text: userMsg.text }]
                    }
                ];

                console.log('Full conversation for AI:', contents);

                const result = await model.generateContent({
                    contents: contents,
                    generationConfig: {
                        maxOutputTokens: 1000,
                    },
                });

                const response = await result.response;
                const text = response.text();

                setMessages(prev => [...prev, { id: Date.now() + 1, text: text, sender: 'bot', createdAt: new Date().toISOString() }]);
            } catch (error) {
                console.error("AI Connection Error:", error);
                console.error("Error details:", error.message, error.stack);

                // Check if it's an authentication/key error
                const isAuthError = error.message?.includes('API_KEY') ||
                                   error.message?.includes('PERMISSION_DENIED') ||
                                   error.message?.includes('INVALID_ARGUMENT');

                if (isAuthError) {
                    setConnectionStatus('error');
                    setConnectionError('Invalid API key or insufficient permissions');
                }

                // Show user-friendly error and suggest fallback
                setMessages(prev => [...prev, {
                    id: Date.now() + 1,
                    text: isAuthError
                        ? "I couldn't connect to the AI service with the current access code. Please update your API key in settings, or I can help with local knowledge about DAX and Power BI."
                        : "I'm having trouble connecting to the AI service right now. Let me help with what I know about DAX and Power BI instead.",
                    sender: 'bot',
                    isError: true,
                    createdAt: new Date().toISOString()
                }]);

                // Don't return here - let it fall through to local knowledge
            } finally {
                setIsTyping(false);
            }
            return;
        }

        // Fallback if no key and no local match
        setTimeout(() => {
            setMessages(prev => [...prev, {
                id: Date.now() + 1,
                text: "I don't have an answer for that in my local knowledge base. To unlock full AI capabilities, please configure the AI Access Code in settings.",
                sender: 'bot',
                isSystem: true,
                createdAt: new Date().toISOString()
            }]);
            setIsTyping(false);
        }, 600);
    };

    const isEnvKey = Boolean(PROJECT_GEMINI_KEY);
    const connectionBadge = (() => {
        if (!apiKey) return null;
        if (connectionStatus === 'connected') {
            return {
                text: verifiedApiVersion ? `AI Connected (${verifiedApiVersion})` : 'AI Connected',
                className: 'bg-emerald-100 text-emerald-700'
            };
        }
        if (connectionStatus === 'connecting') {
            return { text: 'Verifying Access Code', className: 'bg-sky-100 text-sky-700' };
        }
        if (connectionStatus === 'error') {
            return { text: 'Connection Error', className: 'bg-rose-100 text-rose-700' };
        }
        return null;
    })();

    if (isMaximized) {
        return (
            <div className="fixed inset-0 z-50 bg-white flex flex-col">
                {/* Simplified Header for Fullscreen */}
                <div className="bg-slate-50 border-b border-slate-200 px-4 py-3 flex justify-between items-center shrink-0">
                     <div className="flex items-center gap-2">
                        <Sparkles className="h-5 w-5 text-brand-600" />
                        <h2 className="text-lg font-bold text-slate-900">Power BI Guru</h2>
                        {connectionBadge && (
                            <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${connectionBadge.className}`}>
                                {connectionBadge.text}
                            </span>
                        )}
                    </div>
                    <div className="flex items-center gap-2">
                         <button
                            onClick={toggleMaximize}
                            className="p-2 hover:bg-slate-200 rounded-lg transition-colors text-slate-600"
                            title="Exit Fullscreen"
                        >
                            <Minimize2 className="h-5 w-5" />
                        </button>
                    </div>
                </div>

                <div className="flex-1 flex overflow-hidden">
                    {/* Main Chat Area - Full Height */}
                    <div className="flex-1 flex flex-col min-w-0 bg-white relative">
                        {/* Quick Prompts Bar */}
                        <div className="px-4 py-2 border-b border-slate-100 bg-white flex items-center gap-2 overflow-x-auto shrink-0">
                             <div className="flex items-center gap-2 text-xs font-semibold uppercase text-slate-500 whitespace-nowrap">
                                <Wand2 className="h-3 w-3 text-brand-500" />
                                Quick prompts
                            </div>
                            <div className="flex gap-2">
                                {QUICK_PROMPTS.map(prompt => (
                                    <button
                                        key={prompt.label}
                                        onClick={() => handleQuickPrompt(prompt.value)}
                                        className="px-3 py-1 text-xs bg-slate-100 text-slate-700 rounded-full hover:bg-brand-50 hover:text-brand-700 transition-colors whitespace-nowrap"
                                    >
                                        {prompt.label}
                                    </button>
                                ))}
                            </div>
                            <div className="ml-auto flex items-center gap-2">
                                <button
                                    onClick={handleExportChat}
                                    className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-200 rounded transition-colors"
                                    title="Export chat"
                                >
                                    <Download className="h-4 w-4" />
                                </button>
                                <button
                                    onClick={handleClearChat}
                                    className="p-1.5 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded transition-colors"
                                    title="Clear chat"
                                >
                                    <Trash2 className="h-4 w-4" />
                                </button>
                            </div>
                        </div>

                         <div
                            ref={messagesContainerRef}
                            className={`flex-1 overflow-y-auto p-4 md:p-8 ${messageSpacingClass} relative`}
                        >
                            {messages.map((msg) => (
                                <motion.div
                                    key={msg.id}
                                    id={`message-${msg.id}`}
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                                >
                                    <div className={`max-w-[90%] md:max-w-[70%] rounded-2xl ${messagePaddingClass} group relative shadow-sm ${msg.sender === 'user'
                                        ? 'bg-brand-600 text-white rounded-br-none'
                                        : msg.isSystem
                                            ? 'bg-amber-50 text-amber-800 border border-amber-100'
                                            : 'bg-slate-100 text-slate-800 rounded-bl-none'
                                        }`}>
                                        <button
                                            onClick={() => handleCopyMessage(msg.text)}
                                            className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity text-slate-400 hover:text-brand-600 bg-white/20 p-1 rounded"
                                            title="Copy message"
                                        >
                                            <Copy className="h-3 w-3" />
                                        </button>
                                        <div className={`flex items-center justify-between mb-1 opacity-75 ${messageMetaClass}`}>
                                            <div className="flex items-center gap-2">
                                                {msg.sender === 'user' ? <User className="h-3 w-3" /> : <Bot className="h-3 w-3" />}
                                                <span className="uppercase font-bold tracking-wider">{msg.sender}</span>
                                            </div>
                                            {formatMessageTime(msg) && (
                                                <span className="opacity-75">{formatMessageTime(msg)}</span>
                                            )}
                                        </div>
                                        <MessageContent 
                                            text={msg.text} 
                                            isLastBotMessage={msg.sender === 'bot' && !msg.isSystem && msg.id === messages[messages.length - 1].id}
                                        />
                                        {msg.link && (
                                            <div className="mt-3 pt-3 border-t border-black/10">
                                                <a href={`#${msg.link}`} className="text-xs font-bold flex items-center gap-1 hover:underline">
                                                    View Resource <Database className="h-3 w-3" />
                                                </a>
                                            </div>
                                        )}
                                    </div>
                                </motion.div>
                            ))}
                            {isTyping && (
                                <div className="flex justify-start">
                                    <div className="bg-slate-100 rounded-2xl rounded-bl-none p-4 flex gap-1">
                                        <span className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" />
                                        <span className="w-2 h-2 bg-slate-400 rounded-full animate-bounce delay-75" />
                                        <span className="w-2 h-2 bg-slate-400 rounded-full animate-bounce delay-150" />
                                    </div>
                                </div>
                            )}
                            <div ref={messagesEndRef} />
                        </div>

                         {/* Input Area */}
                        <div className="p-4 bg-slate-50 border-t border-slate-200 shrink-0">
                            <div className="max-w-4xl mx-auto w-full flex gap-2">
                                <textarea
                                    ref={inputRef}
                                    value={input}
                                    onChange={(e) => setInput(e.target.value)}
                                    onKeyDown={(e) => {
                                        if (e.key === 'Enter' && !e.shiftKey) {
                                            e.preventDefault();
                                            handleSend();
                                        }
                                    }}
                                    placeholder="Ask anything about Power BI... (Shift+Enter for new line)"
                                    className="input-field flex-1 shadow-sm resize-none min-h-[48px] max-h-[200px]"
                                    rows={1}
                                />
                                <button
                                    onClick={handleSend}
                                    disabled={!input.trim() || isTyping}
                                    className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed px-6"
                                >
                                    <Send className="h-5 w-5" />
                                </button>
                            </div>
                             {!apiKey && (
                                <p className="text-xs text-slate-400 mt-2 text-center">
                                    Running in <span className="font-semibold text-brand-600">Local Knowledge Mode</span>. Add an Access Code for full AI features.
                                </p>
                            )}
                        </div>
                    </div>

                    {/* Side Panel for Notes in Fullscreen */}
                    <div className="w-80 shrink-0 border-l border-slate-200 bg-slate-50 p-4 flex flex-col">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="font-semibold text-slate-900 flex items-center gap-2">
                                <NotebookPen className="h-4 w-4 text-brand-500" />
                                Session Notes
                            </h3>
                             <div className="flex gap-1">
                                <button onClick={handleCopyNotes} className="p-1.5 hover:bg-slate-200 rounded text-slate-500"><Copy className="h-4 w-4"/></button>
                                <button onClick={handleClearNotes} className="p-1.5 hover:bg-slate-200 rounded text-slate-500"><Eraser className="h-4 w-4"/></button>
                            </div>
                        </div>
                        <textarea
                            value={sessionNotes}
                            onChange={(e) => setSessionNotes(e.target.value)}
                            placeholder="Type notes here..."
                            className="flex-1 input-field resize-none bg-white mb-2"
                        />
                         <p className="text-xs text-slate-500 text-center">
                            Notes are saved locally
                        </p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="h-[calc(100vh-8rem)] flex flex-col">
            <div className="flex justify-between items-center mb-4">
                <div>
                    <h2 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
                        <Sparkles className="h-6 w-6 text-brand-600" />
                        Power BI Guru
                        {connectionBadge && (
                            <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${connectionBadge.className}`}>
                                {connectionBadge.text}
                            </span>
                        )}
                    </h2>
                    <p className="text-slate-600">Your AI assistant for DAX, Design, and Strategy.</p>
                    {apiKey && (
                        <p className="mt-1 text-xs text-slate-500">
                            {isUsingCustomKey
                                ? 'Using your personal Gemini access code.'
                                : isEnvKey
                                    ? 'Using the built-in HHS Gemini access code.'
                                    : 'Using the currently stored Gemini access code.'}
                        </p>
                    )}
                    {connectionStatus === 'error' && apiKey && (
                        <p className="mt-1 text-sm text-rose-600 flex items-center gap-1">
                            <AlertCircle className="h-4 w-4" />
                            <span>{connectionError || 'Unable to connect to the AI. Update the access code in settings.'}</span>
                        </p>
                    )}
                </div>
                <div className="flex gap-2">
                     <button
                        onClick={toggleMaximize}
                        className="p-2 rounded-lg bg-slate-100 text-slate-600 hover:bg-slate-200 transition-colors"
                        title="Maximize (Fullscreen Mode)"
                    >
                        <Maximize2 className="h-5 w-5" />
                    </button>
                    <button
                        onClick={() => setShowSettings(!showSettings)}
                        className={`p-2 rounded-lg transition-colors ${showSettings
                            ? 'bg-brand-50 text-brand-700'
                            : isUsingCustomKey
                                ? 'bg-emerald-100 text-emerald-700'
                                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                            }`}
                        title="Manage AI Access Code"
                    >
                        <Settings className="h-5 w-5" />
                    </button>
                </div>
            </div>

            {/* Settings Panel */}
            <AnimatePresence>
                {showSettings && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="overflow-hidden mb-4"
                    >
                        <div className="bg-slate-50 border border-slate-200 rounded-lg p-4">
                            <h3 className="font-semibold text-slate-900 mb-2 flex items-center gap-2">
                                <Key className="h-4 w-4" /> AI Settings
                            </h3>
                            <p className="text-sm text-slate-600 mb-3">
                                Enter your access code to enable full AI chat capabilities.
                            </p>
                            <div className="flex gap-2">
                                <input
                                    type="password"
                                    value={keyInput}
                                    onChange={(e) => setKeyInput(e.target.value)}
                                    placeholder="Enter Access Code..."
                                    className="input-field flex-1"
                                />
                                <button onClick={handleSaveKey} className="btn-primary">Save & Connect</button>
                                {isUsingCustomKey && (
                                    <button onClick={handleClearKey} className="btn-secondary text-red-600 hover:bg-red-50">Clear</button>
                                )}
                            </div>
                            <div className="text-xs text-slate-500 mt-3 space-y-1">
                                <p>
                                    {isUsingCustomKey
                                        ? 'Currently using your personal Gemini key. Clear to switch back to the built-in HHS access code.'
                                        : isEnvKey
                                            ? 'Using the built-in HHS Gemini key by default. Add your own key if you need to run chats under a personal quota.'
                                            : 'No access code is configured yet. Add one to enable cloud AI responses.'}
                                </p>
                                <p className="text-slate-400">Any personal key you add stays in your browser only.</p>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Workspace */}
            <div className="flex-1 flex flex-col lg:flex-row gap-4 overflow-hidden">
                {/* Chat Area */}
                <div className="flex-1 bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden flex flex-col relative min-w-0">
                    {/* Chat Header */}
                    <div className="bg-slate-50 border-b border-slate-200 px-4 py-3 flex flex-wrap items-center gap-3">
                        <div className="flex items-center gap-2">
                            <MessageSquare className="h-4 w-4 text-slate-500" />
                            <span className="text-sm font-medium text-slate-700">Conversation</span>
                            <span className="text-xs text-slate-500 bg-slate-200 px-2 py-0.5 rounded-full">
                                {messages.filter(msg => !msg.isSystem).length} messages
                            </span>
                        </div>
                        <div className="flex gap-2 ml-auto">
                            <button
                                onClick={handleExportChat}
                                className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-200 rounded transition-colors"
                                title="Export chat"
                            >
                                <Download className="h-4 w-4" />
                            </button>
                            <button
                                onClick={handleClearChat}
                                className="p-1.5 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded transition-colors"
                                title="Clear chat"
                            >
                                <Trash2 className="h-4 w-4" />
                            </button>
                        </div>
                    </div>

                    {/* Quick Prompts */}
                    <div className="px-4 py-3 border-b border-slate-100 bg-white flex flex-wrap items-center gap-2">
                        <div className="flex items-center gap-2 text-xs font-semibold uppercase text-slate-500">
                            <Wand2 className="h-3 w-3 text-brand-500" />
                            Quick prompts
                        </div>
                        <div className="flex flex-wrap gap-2">
                            {QUICK_PROMPTS.map(prompt => (
                                <button
                                    key={prompt.label}
                                    onClick={() => handleQuickPrompt(prompt.value)}
                                    className="px-3 py-1 text-xs bg-slate-100 text-slate-700 rounded-full hover:bg-brand-50 hover:text-brand-700 transition-colors"
                                >
                                    {prompt.label}
                                </button>
                            ))}
                        </div>
                        <button
                            onClick={toggleCompactMode}
                            className={`ml-auto text-xs px-3 py-1 rounded-full border ${isCompactMode ? 'bg-brand-600 text-white border-brand-600' : 'border-slate-200 text-slate-600'}`}
                        >
                            {isCompactMode ? 'Compact mode on' : 'Compact mode off'}
                        </button>
                    </div>

                    <div
                        ref={messagesContainerRef}
                        className={`flex-1 overflow-y-auto p-4 ${messageSpacingClass} relative`}
                    >
                        {messages.map((msg) => (
                            <motion.div
                                key={msg.id}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                            >
                                <div className={`max-w-[80%] rounded-2xl ${messagePaddingClass} group relative ${msg.sender === 'user'
                                    ? 'bg-brand-600 text-white rounded-br-none'
                                    : msg.isSystem
                                        ? 'bg-amber-50 text-amber-800 border border-amber-100'
                                        : 'bg-slate-100 text-slate-800 rounded-bl-none'
                                    }`}>
                                    <button
                                        onClick={() => handleCopyMessage(msg.text)}
                                        className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity text-slate-400 hover:text-brand-600"
                                        title="Copy message"
                                    >
                                        <Copy className="h-4 w-4" />
                                    </button>
                                    <div className={`flex items-center justify-between mb-1 opacity-75 ${messageMetaClass}`}>
                                        <div className="flex items-center gap-2">
                                            {msg.sender === 'user' ? <User className="h-3 w-3" /> : <Bot className="h-3 w-3" />}
                                            <span className="uppercase font-bold tracking-wider">{msg.sender}</span>
                                        </div>
                                        {formatMessageTime(msg) && (
                                            <span className="text-slate-400">{formatMessageTime(msg)}</span>
                                        )}
                                    </div>
                                        <MessageContent 
                                            text={msg.text} 
                                            isLastBotMessage={msg.sender === 'bot' && !msg.isSystem && msg.id === messages[messages.length - 1].id}
                                        />
                                    {msg.link && (
                                        <div className="mt-3 pt-3 border-t border-black/10">
                                            <a href={`#${msg.link}`} className="text-xs font-bold flex items-center gap-1 hover:underline">
                                                View Resource <Database className="h-3 w-3" />
                                            </a>
                                        </div>
                                    )}
                                </div>
                            </motion.div>
                        ))}
                        {isTyping && (
                            <div className="flex justify-start">
                                <div className="bg-slate-100 rounded-2xl rounded-bl-none p-4 flex gap-1">
                                    <span className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" />
                                    <span className="w-2 h-2 bg-slate-400 rounded-full animate-bounce delay-75" />
                                    <span className="w-2 h-2 bg-slate-400 rounded-full animate-bounce delay-150" />
                                </div>
                            </div>
                        )}
                        <div ref={messagesEndRef} />
                    </div>

                    {/* Scroll to Bottom Button */}
                    <AnimatePresence>
                        {!isScrolledToBottom && (
                            <motion.button
                                initial={{ opacity: 0, scale: 0.8 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.8 }}
                                onClick={scrollToBottom}
                                className="absolute bottom-24 right-4 bg-brand-600 text-white p-2 rounded-full shadow-lg hover:bg-brand-700 transition-colors z-10"
                                title="Scroll to bottom"
                            >
                                <ChevronDown className="h-4 w-4" />
                            </motion.button>
                        )}
                    </AnimatePresence>

                    {/* Input Area */}
                    <div className="p-4 bg-slate-50 border-t border-slate-200">
                        <div className="flex gap-2">
                            <textarea
                                ref={inputRef}
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                onKeyDown={(e) => {
                                    if (e.key === 'Enter' && !e.shiftKey) {
                                        e.preventDefault();
                                        handleSend();
                                    }
                                }}
                                placeholder="Ask anything about Power BI... (Shift+Enter for new line)"
                                className="input-field flex-1 shadow-sm resize-none min-h-[48px] max-h-[200px]"
                                rows={1}
                            />
                            <button
                                onClick={handleSend}
                                disabled={!input.trim() || isTyping}
                                className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                <Send className="h-4 w-4" />
                            </button>
                        </div>
                        <p className="text-xs text-slate-400 mt-2 text-center flex flex-wrap items-center justify-center gap-2">
                            <span>Enter = Send</span>
                            <span>Shift+Enter = New line</span>
                            <span>Copy buttons appear when you hover a message</span>
                        </p>
                        {!apiKey && (
                            <p className="text-xs text-slate-400 mt-2 text-center">
                                Running in <span className="font-semibold text-brand-600">Local Knowledge Mode</span>. Add an Access Code for full AI features.
                            </p>
                        )}
                    </div>
                </div>

                {/* Session Notes Panel */}
                <aside className="w-80 shrink-0 hidden lg:flex flex-col space-y-4">
                    <div className="bg-white border border-slate-200 rounded-xl shadow-sm p-4 flex flex-col h-full">
                        <div className="flex items-center justify-between mb-3">
                            <div>
                                <p className="text-sm font-semibold text-slate-900 flex items-center gap-2">
                                    <NotebookPen className="h-4 w-4 text-brand-500" />
                                    Session Notes
                                </p>
                                <p className="text-xs text-slate-500">Jot down insights or follow-ups</p>
                            </div>
                            <div className="flex gap-1">
                                <button
                                    onClick={handleCopyNotes}
                                    className="p-2 text-slate-400 hover:text-brand-600 hover:bg-brand-50 rounded transition-colors"
                                    title="Copy notes"
                                >
                                    <Copy className="h-4 w-4" />
                                </button>
                                <button
                                    onClick={handleClearNotes}
                                    className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded transition-colors"
                                    title="Clear notes"
                                >
                                    <Eraser className="h-4 w-4" />
                                </button>
                            </div>
                        </div>
                        <textarea
                            value={sessionNotes}
                            onChange={(e) => setSessionNotes(e.target.value)}
                            placeholder="Capture project context, action items, or follow-ups..."
                            className="input-field flex-1 min-h-[200px] resize-none"
                        />
                        <p className="text-[11px] text-slate-400 text-right mt-2">
                            Autosaved locally • {sessionNotes.trim().length} chars
                        </p>
                    </div>
                </aside>
            </div>
        </div>
    );
};

export default PowerBIGuru;
