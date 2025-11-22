import React, { useState, useEffect, useRef } from 'react';
import { Send, Bot, User, Sparkles, Settings, Key, Database, Palette, AlertCircle } from 'lucide-react';
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
    }
];

const PowerBIGuru = () => {
    const { addToast } = useToast();
    const [messages, setMessages] = useState([
        { id: 1, text: "Hi, I'm your Analytics Assistant. Ask me about DAX, HHS Branding, or data strategy.", sender: 'bot' }
    ]);
    const [input, setInput] = useState('');
    const [apiKey, setApiKey] = useState('');
    const [showSettings, setShowSettings] = useState(false);
    const [isTyping, setIsTyping] = useState(false);
    const messagesEndRef = useRef(null);

    useEffect(() => {
        // Check for Env Var Key first, then Local Storage
        const envKey = import.meta.env.VITE_GEMINI_API_KEY;
        console.log("PowerBI Guru: Checking for Access Code...", envKey ? "Found in Env" : "Not in Env");
        
        if (envKey) {
            setApiKey(envKey);
        } else {
            const storedKey = localStorage.getItem('gemini_api_key');
            if (storedKey) setApiKey(storedKey);
        }
    }, []);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    const handleSaveKey = () => {
        localStorage.setItem('gemini_api_key', apiKey);
        setShowSettings(false);
        addToast('Access code saved successfully', 'success');
    };

    const handleClearKey = () => {
        localStorage.removeItem('gemini_api_key');
        setApiKey('');
        addToast('Access code removed', 'info');
    };

    const processLocalQuery = (query) => {
        const lowerQuery = query.toLowerCase();
        return LOCAL_KNOWLEDGE.find(item =>
            item.keywords.some(k => lowerQuery.includes(k))
        );
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

        // 2. Try Cloud AI if Key exists
        if (apiKey) {
            try {
                const genAI = new GoogleGenerativeAI(apiKey);
                const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

                const prompt = `You are an expert Power BI Developer and Data Analyst for the US Department of Health and Human Services (HHS).
                Answer the following question concisely and professionally. If it involves DAX, provide code snippets.
                Question: ${userMsg.text}`;

                const result = await model.generateContent(prompt);
                const response = await result.response;
                const text = response.text();

                setMessages(prev => [...prev, { id: Date.now() + 1, text: text, sender: 'bot' }]);
            } catch (error) {
                setMessages(prev => [...prev, {
                    id: Date.now() + 1,
                    text: "I encountered an error connecting to the AI. Please check your access code.",
                    sender: 'bot',
                    isError: true
                }]);
            }
        } else {
            // Fallback if no key and no local match
            setTimeout(() => {
                setMessages(prev => [...prev, {
                    id: Date.now() + 1,
                    text: "I don't have an answer for that in my local knowledge base. To unlock full AI capabilities, please configure the AI Access Code in settings.",
                    sender: 'bot',
                    isSystem: true
                }]);
            }, 600);
        }
        setIsTyping(false);
    };

    const isEnvKey = !!import.meta.env.VITE_GEMINI_API_KEY;

    return (
        <div className="h-[calc(100vh-8rem)] flex flex-col">
            <div className="flex justify-between items-center mb-4">
                <div>
                    <h2 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
                        <Sparkles className="h-6 w-6 text-brand-600" />
                        Power BI Guru
                        {apiKey && <span className="text-xs bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded-full font-medium">AI Connected</span>}
                    </h2>
                    <p className="text-slate-600">Your AI assistant for DAX, Design, and Strategy.</p>
                </div>
                {!isEnvKey && (
                    <button
                        onClick={() => setShowSettings(!showSettings)}
                        className={`p-2 rounded-lg transition-colors ${apiKey ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}
                        title="AI Settings"
                    >
                        <Settings className="h-5 w-5" />
                    </button>
                )}
            </div>

            {/* Settings Panel */}
            <AnimatePresence>
                {showSettings && !isEnvKey && (
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
                                    value={apiKey}
                                    onChange={(e) => setApiKey(e.target.value)}
                                    placeholder="Enter Access Code..."
                                    className="input-field flex-1"
                                />
                                <button onClick={handleSaveKey} className="btn-primary">Save</button>
                                {apiKey && <button onClick={handleClearKey} className="btn-secondary text-red-600 hover:bg-red-50">Clear</button>}
                            </div>
                            <p className="text-xs text-slate-400 mt-2">Your code is stored locally in your browser.</p>
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
                            <div className={`max-w-[80%] rounded-2xl p-4 ${msg.sender === 'user'
                                ? 'bg-brand-600 text-white rounded-br-none'
                                : msg.isSystem
                                    ? 'bg-amber-50 text-amber-800 border border-amber-100'
                                    : 'bg-slate-100 text-slate-800 rounded-bl-none'
                                }`}>
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
                        <input
                            type="text"
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                            placeholder="Ask anything about Power BI..."
                            className="input-field flex-1 shadow-sm"
                        />
                        <button
                            onClick={handleSend}
                            disabled={!input.trim() || isTyping}
                            className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            <Send className="h-4 w-4" />
                        </button>
                    </div>
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
