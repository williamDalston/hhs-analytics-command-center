import React, { useState, useEffect, useRef } from 'react';
import { Send, Bot, User, Sparkles, Settings, Key, Database, AlertCircle, Copy } from 'lucide-react';
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

const GEMINI_MODEL = "gemini-1.5-flash";
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
    const [messages, setMessages] = useState([
        { id: 1, text: "Hi, I'm your Analytics Assistant. Ask me about DAX, HHS Branding, or data strategy.", sender: 'bot' }
    ]);
    const [input, setInput] = useState('');
    const [apiKey, setApiKey] = useState(initialKeyInfoRef.current.key);
    const [keyInput, setKeyInput] = useState(initialKeyInfoRef.current.source === 'custom' ? initialKeyInfoRef.current.key : '');
    const [isUsingCustomKey, setIsUsingCustomKey] = useState(initialKeyInfoRef.current.source === 'custom');
    const [showSettings, setShowSettings] = useState(false);
    const [isTyping, setIsTyping] = useState(false);
    const [connectionStatus, setConnectionStatus] = useState(initialKeyInfoRef.current.key ? 'connecting' : 'idle');
    const [connectionError, setConnectionError] = useState('');
    const messagesEndRef = useRef(null);
    const inputRef = useRef(null);

    useEffect(() => {
        console.log("PowerBI Guru: Project Access Code", PROJECT_GEMINI_KEY ? "Available" : "Not Configured");
    }, []);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

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
            return;
        }

        let isCancelled = false;
        const controller = new AbortController();

        const verifyKey = async () => {
            setConnectionStatus('connecting');
            setConnectionError('');
            try {
                const response = await fetch(`https://generativelanguage.googleapis.com/v1/models/${GEMINI_MODEL}?key=${encodeURIComponent(trimmedKey)}`, {
                    signal: controller.signal
                });
                if (!response.ok) {
                    const errorPayload = await response.json().catch(() => ({}));
                    throw new Error(errorPayload?.error?.message || 'Unable to verify access code');
                }
                if (isCancelled) return;
                setConnectionStatus('connected');
            } catch (error) {
                if (controller.signal.aborted || isCancelled) return;
                console.error("Gemini verification failed:", error);
                setConnectionStatus('error');
                setConnectionError(error.message || 'Unable to verify access code');
            }
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

    const handleSend = async () => {
        if (!input.trim()) return;

        const userMsg = { id: Date.now(), text: input, sender: 'user' };
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
                    link: localMatch.link
                }]);
                setIsTyping(false);
            }, 600); // Fake delay for natural feel
            return;
        }

        const trimmedKey = apiKey.trim();

        // 2. Try Cloud AI if Key exists and connection is healthy
        if (trimmedKey) {
            if (connectionStatus === 'connecting') {
                setMessages(prev => [...prev, {
                    id: Date.now() + 1,
                    text: "I'm still verifying the AI connection. Please try again in a moment.",
                    sender: 'bot',
                    isSystem: true
                }]);
                setIsTyping(false);
                return;
            }

            if (connectionStatus === 'error') {
                setMessages(prev => [...prev, {
                    id: Date.now() + 1,
                    text: "I couldn't verify the AI access code. Open the AI Settings to update it.",
                    sender: 'bot',
                    isSystem: true,
                    isError: true
                }]);
                setIsTyping(false);
                return;
            }

            try {
                const genAI = new GoogleGenerativeAI(trimmedKey);
                const model = genAI.getGenerativeModel({ 
                    model: GEMINI_MODEL,
                    systemInstruction: "You are an expert Power BI Developer and Data Analyst for the US Department of Health and Human Services (HHS). Answer questions concisely and professionally. If it involves DAX, provide code snippets."
                });

                // Format history for Gemini
                const history = messages
                    .filter(msg => !msg.isError && !msg.isSystem) // Exclude errors and system prompts
                    .map(msg => ({
                        role: msg.sender === 'user' ? 'user' : 'model',
                        parts: [{ text: msg.text }]
                    }));

                const chat = model.startChat({
                    history: history,
                    generationConfig: {
                        maxOutputTokens: 1000,
                    },
                });

                const result = await chat.sendMessage(userMsg.text);
                const response = await result.response;
                const text = response.text();

                setMessages(prev => [...prev, { id: Date.now() + 1, text: text, sender: 'bot' }]);
            } catch (error) {
                console.error("AI Connection Error:", error);
                setMessages(prev => [...prev, {
                    id: Date.now() + 1,
                    text: "I encountered an error connecting to the AI. Please check your access code or internet connection.",
                    sender: 'bot',
                    isError: true
                }]);
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
                isSystem: true
            }]);
            setIsTyping(false);
        }, 600);
    };

    const isEnvKey = Boolean(PROJECT_GEMINI_KEY);
    const connectionBadge = (() => {
        if (!apiKey) return null;
        if (connectionStatus === 'connected') {
            return { text: 'AI Connected', className: 'bg-emerald-100 text-emerald-700' };
        }
        if (connectionStatus === 'connecting') {
            return { text: 'Verifying Access Code', className: 'bg-sky-100 text-sky-700' };
        }
        if (connectionStatus === 'error') {
            return { text: 'Connection Error', className: 'bg-rose-100 text-rose-700' };
        }
        return null;
    })();

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

            {/* Chat Area */}
            <div className="flex-1 bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden flex flex-col">
                <div className="flex-1 overflow-y-auto p-4 space-y-4">
                    {messages.map((msg) => (
                        <motion.div
                            key={msg.id}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                        >
                            <div className={`max-w-[80%] rounded-2xl p-4 group relative ${msg.sender === 'user'
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
                                <div className="flex items-center gap-2 mb-1 opacity-75 text-xs">
                                    {msg.sender === 'user' ? <User className="h-3 w-3" /> : <Bot className="h-3 w-3" />}
                                    <span className="uppercase font-bold tracking-wider">{msg.sender}</span>
                                </div>
                                <div className="whitespace-pre-wrap text-sm leading-relaxed">
                                    {msg.text}
                                </div>
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
        </div>
    );
};

export default PowerBIGuru;
