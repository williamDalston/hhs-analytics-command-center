import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Send, Bot, User, Sparkles, Settings, Key, Database, AlertCircle, Copy, Trash2, Download, MessageSquare, ChevronDown, NotebookPen, Eraser, Wand2, Maximize2, Minimize2, BookmarkPlus, ArrowDownToLine, GripVertical, PanelRightOpen, PanelRightClose, PanelLeftOpen, PanelLeftClose, Type } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { useToast } from '../context/ToastContext';
import { useSidebar } from '../context/SidebarContext';

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

const MIN_NOTES_WIDTH = 180;
const MAX_NOTES_WIDTH = 4000;
const MIN_CHAT_WIDTH = 280;

const clampValue = (value, min, max) => Math.min(Math.max(value, min), max);

const getInitialNotesWidth = () => {
    if (typeof window === 'undefined') {
        return 360;
    }
    return clampValue(window.innerWidth * 0.3, MIN_NOTES_WIDTH, MAX_NOTES_WIDTH);
};

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
const FONT_SIZE_STORAGE_KEY = 'guru_font_size';
const LINE_HEIGHT_STORAGE_KEY = 'guru_line_height';

// Font size configurations
const FONT_SIZES = {
    small: { label: 'Small', message: 'text-xs', meta: 'text-[10px]', code: 'text-xs', description: 'Compact' },
    medium: { label: 'Medium', message: 'text-sm', meta: 'text-xs', code: 'text-sm', description: 'Default' },
    large: { label: 'Large', message: 'text-base', meta: 'text-sm', code: 'text-base', description: 'Comfortable' },
    xlarge: { label: 'Extra Large', message: 'text-lg', meta: 'text-sm', code: 'text-base', description: 'Accessibility' }
};

const LINE_HEIGHTS = {
    normal: { label: 'Normal', class: 'leading-normal' },
    relaxed: { label: 'Relaxed', class: 'leading-relaxed' },
    loose: { label: 'Loose', class: 'leading-loose' }
};

// Use Gemini models - try latest first, fallback to older versions
// Updated model configuration to use stable versions
const GEMINI_MODELS = ["gemini-2.5-flash", "gemini-2.0-flash", "gemini-1.5-flash", "gemini-pro"];
const GEMINI_API_VERSIONS = ["v1beta", "v1"];
const GEMINI_MODEL = GEMINI_MODELS[0]; // Default to latest
const PROJECT_GEMINI_KEY = import.meta.env.VITE_GEMINI_API_KEY?.trim() || '';
const GEMINI_KEY_ALLOWED_HOSTS = import.meta.env.VITE_GEMINI_KEY_ALLOWED_HOSTS || 'localhost,127.0.0.1,williamdalston.github.io';

const parseHostRules = (value) => {
    return value
        .split(',')
        .map(entry => entry.trim())
        .filter(Boolean)
        .map(entry => {
            const withoutProtocol = entry.replace(/^https?:\/\//, '');
            const beforePath = withoutProtocol.split('/')[0];
            return beforePath.toLowerCase();
        });
};

const matchesHostRule = (rule, hostname, hostWithPort) => {
    if (rule === '*') return true;
    if (rule.startsWith('.')) {
        const normalizedRule = rule.slice(1);
        return hostname === normalizedRule || hostname.endsWith(`.${normalizedRule}`);
    }
    if (rule.includes(':')) {
        return hostWithPort === rule;
    }
    return hostname === rule;
};

const GEMINI_PROJECT_HOST_RULES = parseHostRules(GEMINI_KEY_ALLOWED_HOSTS);

const isHostAllowedForProjectKey = () => {
    if (!PROJECT_GEMINI_KEY) return false;
    if (import.meta.env.DEV) return true;
    if (typeof window === 'undefined') return false;
    if (GEMINI_PROJECT_HOST_RULES.length === 0) return true;

    const hostname = window.location.hostname.toLowerCase();
    const hostWithPort = window.location.host.toLowerCase();
    return GEMINI_PROJECT_HOST_RULES.some(rule => matchesHostRule(rule, hostname, hostWithPort));
};

const getProjectKeyForCurrentHost = () => (isHostAllowedForProjectKey() ? PROJECT_GEMINI_KEY : '');

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
    const projectKey = getProjectKeyForCurrentHost();
    if (projectKey) {
        return { key: projectKey, source: 'project' };
    }
    return { key: '', source: 'none' };
};

const truncateText = (text, length = 120) => {
    if (!text) return '';
    return text.length > length ? `${text.slice(0, length)}…` : text;
};

const PowerBIGuru = () => {
    const { addToast } = useToast();
    const { isSidebarCollapsed, toggleSidebar } = useSidebar();
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
    const workspaceRef = useRef(null);
    const [notesPanelWidth, setNotesPanelWidth] = useState(() => getInitialNotesWidth());
    const [isNotesPanelCollapsed, setIsNotesPanelCollapsed] = useState(false);
    const [isDesktopLayout, setIsDesktopLayout] = useState(() => {
        if (typeof window === 'undefined') return false;
        return window.innerWidth >= 1024;
    });
    const [sessionNotes, setSessionNotes] = useState(() => {
        if (typeof window === 'undefined') return '';
        return window.localStorage.getItem(NOTES_STORAGE_KEY) || '';
    });
    const [isCompactMode, setIsCompactMode] = useState(false);
    const [isMaximized, setIsMaximized] = useState(false);
    const [currentQuestion, setCurrentQuestion] = useState(null);
    const [lastAnswerId, setLastAnswerId] = useState(null);
    const [fontSize, setFontSize] = useState(() => {
        if (typeof window === 'undefined') return 'medium';
        return window.localStorage.getItem(FONT_SIZE_STORAGE_KEY) || 'medium';
    });
    const [lineHeight, setLineHeight] = useState(() => {
        if (typeof window === 'undefined') return 'relaxed';
        return window.localStorage.getItem(LINE_HEIGHT_STORAGE_KEY) || 'relaxed';
    });
    const [showStyleSettings, setShowStyleSettings] = useState(false);
    const getMaxNotesWidth = useCallback(() => {
        if (!workspaceRef.current || typeof window === 'undefined') {
            return MAX_NOTES_WIDTH;
        }
        const styles = window.getComputedStyle(workspaceRef.current);
        const gapValue = parseFloat(styles.columnGap || styles.gap || '0') || 0;
        const bounds = workspaceRef.current.getBoundingClientRect();
        const available = bounds.width - gapValue - MIN_CHAT_WIDTH;
        return clampValue(available, MIN_NOTES_WIDTH, MAX_NOTES_WIDTH);
    }, [workspaceRef]);

    const recalcNotesWidth = useCallback(() => {
        if (typeof window === 'undefined') return;
        const nextIsDesktop = window.innerWidth >= 1024;
        setIsDesktopLayout(nextIsDesktop);
        if (!nextIsDesktop) return;
        const safeMax = getMaxNotesWidth();
        setNotesPanelWidth(prev => clampValue(prev, MIN_NOTES_WIDTH, safeMax));
    }, [getMaxNotesWidth]);

    useEffect(() => {
        // Debug: Log API key availability in development
        if (import.meta.env.DEV) {
            if (!PROJECT_GEMINI_KEY) {
                console.log("PowerBI Guru: Project Access Code Not Configured");
            } else {
                console.log(
                    "PowerBI Guru: Project Access Code",
                    isHostAllowedForProjectKey()
                        ? "Available for this host"
                        : `Configured but blocked for host ${(typeof window !== 'undefined' && window.location.hostname) || 'unknown'}`
                );
            }
        }
    }, []);

    useEffect(() => {
        recalcNotesWidth();
        if (typeof window === 'undefined') return undefined;
        window.addEventListener('resize', recalcNotesWidth);
        return () => window.removeEventListener('resize', recalcNotesWidth);
    }, [recalcNotesWidth]);

    useEffect(() => {
        recalcNotesWidth();
    }, [isMaximized, recalcNotesWidth]);

    useEffect(() => {
        if (typeof window === 'undefined') return;
        window.localStorage.setItem(MESSAGES_STORAGE_KEY, JSON.stringify(messages));
    }, [messages]);

    const scrollToMessage = (id) => {
        if (!id) return;
        const el = document.getElementById(`message-${id}`);
        if (el) {
            el.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    };

    useEffect(() => {
        const lastMsg = messages[messages.length - 1];
        if (lastMsg?.sender === 'bot' && !lastMsg.isSystem && currentQuestion?.id) {
            scrollToMessage(currentQuestion.id);
            return;
        }
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages, currentQuestion]);

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
        if (typeof window === 'undefined') return;
        window.localStorage.setItem(FONT_SIZE_STORAGE_KEY, fontSize);
    }, [fontSize]);

    useEffect(() => {
        if (typeof window === 'undefined') return;
        window.localStorage.setItem(LINE_HEIGHT_STORAGE_KEY, lineHeight);
    }, [lineHeight]);

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

        // Assume connected if key is present to avoid 404 checks on unsupported endpoints
        setConnectionStatus('connected');
        setConnectionError('');
        setVerifiedApiVersion('v1beta'); // Default assumption

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
        const fallbackKey = getProjectKeyForCurrentHost() || '';
        const hasRestrictedProjectKey = Boolean(PROJECT_GEMINI_KEY) && !fallbackKey;
        setIsUsingCustomKey(false);
        setKeyInput('');
        setApiKey(fallbackKey);
        setConnectionStatus(fallbackKey ? 'connecting' : 'idle');
        setConnectionError('');
        addToast(
            fallbackKey
                ? 'Reverted to the built-in HHS access code.'
                : hasRestrictedProjectKey
                    ? 'The built-in HHS access code is restricted on this domain. Add your personal key to enable AI responses.'
                    : 'Access code removed. Running in local knowledge mode.',
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
            setCurrentQuestion(null);
            setLastAnswerId(null);
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

    const handleNotesResizeStart = (event) => {
        if (!isDesktopLayout || isNotesPanelCollapsed || !workspaceRef.current) return;
        event.preventDefault();
        const startX = event.clientX;
        const startWidth = notesPanelWidth;
        const previousUserSelect = document.body.style.userSelect;
        document.body.style.userSelect = 'none';

        const handlePointerMove = (moveEvent) => {
            const maxWidth = getMaxNotesWidth();
            const delta = moveEvent.clientX - startX;
            // Dragging right (positive delta) moves handle right -> decreases notes width (notes are on right)
            // Dragging left (negative delta) moves handle left -> increases notes width
            const nextWidth = clampValue(startWidth - delta, MIN_NOTES_WIDTH, maxWidth);
            setNotesPanelWidth(nextWidth);
        };

        const handlePointerUp = () => {
            document.body.style.userSelect = previousUserSelect;
            window.removeEventListener('pointermove', handlePointerMove);
            window.removeEventListener('pointerup', handlePointerUp);
        };

        window.addEventListener('pointermove', handlePointerMove);
        window.addEventListener('pointerup', handlePointerUp);
    };

    const handleResizableKeyDown = (event) => {
        if (!isDesktopLayout || isNotesPanelCollapsed || !workspaceRef.current) return;
        if (event.key !== 'ArrowLeft' && event.key !== 'ArrowRight') return;
        event.preventDefault();
        const maxWidth = getMaxNotesWidth();
        // Left arrow moves separator left -> increases notes width
        // Right arrow moves separator right -> decreases notes width
        const delta = event.key === 'ArrowLeft' ? 24 : -24;
        setNotesPanelWidth(prev => clampValue(prev + delta, MIN_NOTES_WIDTH, maxWidth));
    };

    const toggleNotesPanel = () => {
        setIsNotesPanelCollapsed(prev => !prev);
        if (typeof window !== 'undefined') {
            requestAnimationFrame(() => recalcNotesWidth());
        }
    };

    const toggleCompactMode = () => {
        setIsCompactMode(prev => !prev);
    };

    const toggleMaximize = () => {
        setIsMaximized(prev => !prev);
    };

    const handleAddMessageToNotes = (text) => {
        if (!text) return;
        setSessionNotes(prev => `${prev ? `${prev}\n\n` : ''}${text}`);
        addToast('Saved to session notes', 'success');
    };

    const formatMessageTime = (msg, fallbackToNow = false) => {
        if (msg.isSystem && msg.id === 'welcome' && !fallbackToNow) return '';
        const source = msg.createdAt || (typeof msg.id === 'number' ? new Date(msg.id).toISOString() : null);
        const date = source ? new Date(source) : (fallbackToNow ? new Date() : null);
        if (!date) return '';
        return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    };

    const messageSpacingClass = isCompactMode ? 'space-y-2' : 'space-y-4';
    const messagePaddingClass = isCompactMode ? 'p-3' : 'p-4';
    const currentFontSizeConfig = FONT_SIZES[fontSize] || FONT_SIZES.medium;
    const messageMetaClass = currentFontSizeConfig.meta;

    // Typing Effect Hook
    const useTypingEffect = (text, shouldAnimate) => {
        const [displayedText, setDisplayedText] = useState(shouldAnimate ? '' : text);
        
        useEffect(() => {
            if (!shouldAnimate) {
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
        }, [text, shouldAnimate]);

        return displayedText;
    };

    // Message Content Component with Typing Support
    const MessageContent = ({ text, shouldAnimate }) => {
        const display = useTypingEffect(text, shouldAnimate);
        
        // Only run the split logic if we have text
        if (!display) return <span className="animate-pulse">...</span>;

        const parts = display.split(/(```[\s\S]*?```)/g);
        const currentFontSize = FONT_SIZES[fontSize] || FONT_SIZES.medium;
        const currentLineHeight = LINE_HEIGHTS[lineHeight] || LINE_HEIGHTS.relaxed;
        
        return (
            <div className={`whitespace-pre-wrap ${currentLineHeight.class} ${currentFontSize.message}`}>
                {parts.map((part, i) => {
                    // Check for complete code blocks
                    if (part.startsWith('```') && part.endsWith('```')) {
                        const match = part.match(/^```(\w+)?\n([\s\S]*)```$/);
                        const language = match ? match[1] : '';
                        const content = match ? match[2] : part.slice(3, -3);
                        
                        return (
                            <div key={i} className="my-3 rounded-lg bg-slate-800 text-slate-100 overflow-hidden shadow-sm border border-slate-700">
                                        <div className="flex items-center justify-between px-3 py-1.5 bg-slate-900/50 text-slate-400 border-b border-white/10 select-none">
                                            <span className={`uppercase font-semibold tracking-wider ${currentFontSize.meta}`}>{language || 'CODE'}</span>
                                            <button 
                                               onClick={(e) => {
                                                   e.stopPropagation();
                                                   handleCopyMessage(content.trim());
                                               }}
                                               className="hover:text-white flex items-center gap-1.5 transition-colors text-xs"
                                               aria-label="Copy code"
                                            >
                                                <Copy className="h-3 w-3" /> Copy
                                            </button>
                                        </div>
                                <pre className={`p-3 overflow-x-auto font-mono ${currentFontSize.code} scrollbar-thin scrollbar-thumb-slate-600 scrollbar-track-transparent`}>
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
        setCurrentQuestion({ id: userMsg.id, text: userMsg.text });

        // 1. Try Local Knowledge First
        const localMatch = processLocalQuery(userMsg.text);

        if (localMatch) {
            setTimeout(() => {
                const botMsg = {
                    id: Date.now() + 1,
                    text: localMatch.answer,
                    sender: 'bot',
                    link: localMatch.link,
                    createdAt: new Date().toISOString()
                };
                setMessages(prev => [...prev, botMsg]);
                setLastAnswerId(botMsg.id);
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
                        // Only log in development
                        if (import.meta.env.DEV) {
                            console.log(`Initialized model ${modelName}, attempting to use it...`);
                        }
                        // Don't test with generateContent - just try to use it directly
                        break; // Use this model
                    } catch (modelError) {
                        // Only log in development
                        if (import.meta.env.DEV) {
                            console.warn(`Model ${modelName} failed to initialize:`, modelError.message);
                        }
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

                // Only log in development
                if (import.meta.env.DEV) {
                    console.log('Full conversation for AI:', contents);
                }

                // Add timeout for mobile devices
                const timeoutMs = 30000; // 30 seconds
                const timeoutPromise = new Promise((_, reject) =>
                    setTimeout(() => reject(new Error('Request timeout')), timeoutMs)
                );

                const generatePromise = model.generateContent({
                    contents: contents,
                    generationConfig: {
                        maxOutputTokens: 1000,
                    },
                });

                const result = await Promise.race([generatePromise, timeoutPromise]);
                const response = await result.response;
                const text = response.text();

                const botMsg = { id: Date.now() + 1, text, sender: 'bot', createdAt: new Date().toISOString() };
                setMessages(prev => [...prev, botMsg]);
                setLastAnswerId(botMsg.id);
            } catch (error) {
                // Keep error logging for production debugging
                console.error("AI Connection Error:", error.message);
                if (import.meta.env.DEV) {
                    console.error("Error details:", error.stack);
                }

                // Check error types
                const isAuthError = error.message?.includes('API_KEY') ||
                                   error.message?.includes('PERMISSION_DENIED') ||
                                   error.message?.includes('INVALID_ARGUMENT');
                const isTimeoutError = error.message?.includes('timeout') || error.message?.includes('Timeout');
                const isNetworkError = error.message?.includes('network') || error.message?.includes('fetch');

                if (isAuthError) {
                    setConnectionStatus('error');
                    setConnectionError('Invalid API key or insufficient permissions');
                }

                // Show user-friendly error with specific guidance
                let errorText;
                if (isAuthError) {
                    errorText = "I couldn't connect to the AI service with the current access code. Please update your API key in settings, or I can help with local knowledge about DAX and Power BI.";
                } else if (isTimeoutError) {
                    errorText = "The AI service is taking too long to respond. This can happen on slower connections. Please try again, or I can help with local knowledge about DAX and Power BI.";
                } else if (isNetworkError) {
                    errorText = "I'm having trouble reaching the AI service. Please check your internet connection and try again, or I can help with local knowledge about DAX and Power BI.";
                } else {
                    errorText = "I'm having trouble connecting to the AI service right now. Let me help with what I know about DAX and Power BI instead.";
                }

                const errorMsg = {
                    id: Date.now() + 1,
                    text: errorText,
                    sender: 'bot',
                    isError: true,
                    createdAt: new Date().toISOString()
                };
                setMessages(prev => [...prev, errorMsg]);
                setLastAnswerId(errorMsg.id);

                // Don't return here - let it fall through to local knowledge
            } finally {
                setIsTyping(false);
            }
            return;
        }

        // Fallback if no key and no local match
        setTimeout(() => {
            const fallbackMsg = {
                id: Date.now() + 1,
                text: "I don't have an answer for that in my local knowledge base. To unlock full AI capabilities, please configure the AI Access Code in settings.",
                sender: 'bot',
                isSystem: true,
                createdAt: new Date().toISOString()
            };
            setMessages(prev => [...prev, fallbackMsg]);
            setLastAnswerId(fallbackMsg.id);
            setIsTyping(false);
        }, 600);
    };

    const projectKeyForHost = getProjectKeyForCurrentHost();
    const isEnvKey = Boolean(projectKeyForHost);
    const hasProjectKeyConfigured = Boolean(PROJECT_GEMINI_KEY);
    const isProjectKeyBlocked = hasProjectKeyConfigured && !isEnvKey;
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

    const shouldRenderNotesPanel = !isNotesPanelCollapsed;
    const notesPanelStyle = isDesktopLayout ? { width: `${notesPanelWidth}px` } : undefined;
    const sessionNotesContent = (
        <>
            <div className="flex items-center justify-between mb-3 gap-2">
                <div>
                    <p className="text-sm font-semibold text-slate-900 flex items-center gap-2">
                        <NotebookPen className="h-4 w-4 text-brand-500" />
                        Session Notes
                    </p>
                    <p className="text-xs text-slate-500">Capture insights or follow-ups</p>
                </div>
                <div className="flex gap-1">
                    <button
                        onClick={handleCopyNotes}
                        className="p-2 text-slate-400 hover:text-brand-600 hover:bg-brand-50 rounded transition-colors"
                        title="Copy notes"
                        aria-label="Copy notes"
                    >
                        <Copy className="h-4 w-4" />
                    </button>
                    <button
                        onClick={handleClearNotes}
                        className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded transition-colors"
                        title="Clear notes"
                        aria-label="Clear notes"
                    >
                        <Eraser className="h-4 w-4" />
                    </button>
                </div>
            </div>
            <textarea
                value={sessionNotes}
                onChange={(e) => setSessionNotes(e.target.value)}
                placeholder="Capture project context, action items, or next steps..."
                className="input-field flex-1 min-h-[200px] resize-none"
            />
            <p className="text-[11px] text-slate-400 text-right mt-2">
                Autosaved locally • {sessionNotes.trim().length} chars
            </p>
        </>
    );

    if (isMaximized) {
        return (
            <div className="fixed inset-0 z-50 bg-white flex flex-col">
                <div className="bg-slate-50 border-b border-slate-200 px-4 py-3 flex flex-wrap items-center justify-between gap-3">
                    <div className="flex items-center gap-2">
                        <Sparkles className="h-5 w-5 text-brand-600" />
                        <h2 className="text-lg font-bold text-slate-900">Power BI Guru</h2>
                        {connectionBadge && (
                            <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${connectionBadge.className}`}>
                                {connectionBadge.text}
                            </span>
                        )}
                    </div>
                    <div className="flex flex-wrap items-center gap-2">
                        <button
                            onClick={toggleSidebar}
                            aria-pressed={isSidebarCollapsed}
                            aria-label={isSidebarCollapsed ? 'Show sidebar' : 'Hide sidebar'}
                            className={`hidden lg:flex p-2 rounded-lg text-sm font-medium items-center gap-2 border transition-colors ${isSidebarCollapsed
                                ? 'border-slate-200 text-slate-600 hover:bg-slate-100'
                                : 'bg-emerald-50 text-emerald-700 border-emerald-100'
                                }`}
                            title={isSidebarCollapsed ? 'Show sidebar' : 'Hide sidebar'}
                        >
                            {isSidebarCollapsed ? <PanelLeftOpen className="h-4 w-4" /> : <PanelLeftClose className="h-4 w-4" />}
                            <span className="hidden xl:inline">{isSidebarCollapsed ? 'Show sidebar' : 'Hide sidebar'}</span>
                        </button>
                        <button
                            onClick={toggleNotesPanel}
                            aria-pressed={!isNotesPanelCollapsed}
                            aria-label={isNotesPanelCollapsed ? 'Show notes panel' : 'Hide notes panel'}
                            className={`p-2 rounded-lg text-sm font-medium flex items-center gap-2 border transition-colors ${isNotesPanelCollapsed
                                ? 'border-slate-200 text-slate-600 hover:bg-slate-100'
                                : 'bg-brand-50 text-brand-700 border-brand-100'
                                }`}
                        >
                            {isNotesPanelCollapsed ? <PanelRightOpen className="h-4 w-4" /> : <PanelRightClose className="h-4 w-4" />}
                            <span className="hidden sm:inline">{isNotesPanelCollapsed ? 'Show notes' : 'Hide notes'}</span>
                        </button>
                        <button
                            onClick={toggleMaximize}
                            className="p-2 hover:bg-slate-200 rounded-lg transition-colors text-slate-600"
                            title="Exit Fullscreen"
                        >
                            <Minimize2 className="h-5 w-5" />
                        </button>
                    </div>
                </div>

                <div className="flex-1 flex flex-col overflow-hidden">
                    <div
                        ref={workspaceRef}
                        className="flex-1 flex flex-col gap-4 lg:flex-row lg:items-stretch px-4 pb-4 pt-2 overflow-hidden"
                    >
                        <div className="flex-1 flex flex-col min-w-0 bg-white relative border border-slate-200 rounded-xl shadow-sm">
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
                                            className="flex-shrink-0 px-3 py-1 text-xs bg-slate-100 text-slate-700 rounded-full hover:bg-brand-50 hover:text-brand-700 transition-colors whitespace-nowrap"
                                        >
                                            {prompt.label}
                                        </button>
                                    ))}
                                </div>
                                <div className="ml-auto flex items-center gap-2">
                                    <button
                                        onClick={() => setShowStyleSettings(!showStyleSettings)}
                                        className={`p-1.5 rounded transition-colors flex items-center gap-1 ${showStyleSettings ? 'bg-brand-100 text-brand-700' : 'text-slate-400 hover:text-slate-600 hover:bg-slate-200'}`}
                                        title="Text & Style Settings"
                                        aria-label="Text style settings"
                                    >
                                        <Type className="h-4 w-4" />
                                    </button>
                                    <button
                                        onClick={handleExportChat}
                                        className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-200 rounded transition-colors"
                                        title="Export chat"
                                        aria-label="Export chat"
                                    >
                                        <Download className="h-4 w-4" />
                                    </button>
                                    <button
                                        onClick={handleClearChat}
                                        className="p-1.5 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded transition-colors"
                                        title="Clear chat"
                                        aria-label="Clear chat"
                                    >
                                        <Trash2 className="h-4 w-4" />
                                    </button>
                                </div>
                            </div>

                            <AnimatePresence>
                                {showStyleSettings && (
                                    <motion.div
                                        initial={{ height: 0, opacity: 0 }}
                                        animate={{ height: 'auto', opacity: 1 }}
                                        exit={{ height: 0, opacity: 0 }}
                                        className="overflow-hidden border-b border-slate-200"
                                    >
                                        <div className="px-4 py-3 bg-gradient-to-br from-brand-50 to-slate-50">
                                            <div className="flex items-center gap-2 mb-3">
                                                <Type className="h-4 w-4 text-brand-600" />
                                                <h3 className="font-semibold text-slate-900 text-sm">Text & Style Settings</h3>
                                            </div>
                                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-3xl">
                                                <div>
                                                    <label className="block text-xs font-medium text-slate-700 mb-2">Font Size</label>
                                                    <div className="grid grid-cols-2 gap-2">
                                                        {Object.entries(FONT_SIZES).map(([key, config]) => (
                                                            <button
                                                                key={key}
                                                                onClick={() => setFontSize(key)}
                                                                className={`px-3 py-2 text-xs rounded-lg border transition-all ${
                                                                    fontSize === key
                                                                        ? 'bg-brand-600 text-white border-brand-600 shadow-md'
                                                                        : 'bg-white text-slate-700 border-slate-200 hover:border-brand-300 hover:bg-brand-50'
                                                                }`}
                                                            >
                                                                <div className="font-semibold">{config.label}</div>
                                                                <div className="text-[10px] opacity-75">{config.description}</div>
                                                            </button>
                                                        ))}
                                                    </div>
                                                </div>
                                                <div>
                                                    <label className="block text-xs font-medium text-slate-700 mb-2">Line Spacing</label>
                                                    <div className="grid grid-cols-1 gap-2">
                                                        {Object.entries(LINE_HEIGHTS).map(([key, config]) => (
                                                            <button
                                                                key={key}
                                                                onClick={() => setLineHeight(key)}
                                                                className={`px-3 py-2 text-xs rounded-lg border transition-all ${
                                                                    lineHeight === key
                                                                        ? 'bg-brand-600 text-white border-brand-600 shadow-md'
                                                                        : 'bg-white text-slate-700 border-slate-200 hover:border-brand-300 hover:bg-brand-50'
                                                                }`}
                                                            >
                                                                {config.label}
                                                            </button>
                                                        ))}
                                                    </div>
                                                </div>
                                            </div>
                                            <p className="text-xs text-slate-500 mt-3 flex items-center gap-1">
                                                <Sparkles className="h-3 w-3" />
                                                Settings are saved automatically and persist across sessions
                                            </p>
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>

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
                                            } ${msg.id === lastAnswerId ? 'ring-2 ring-brand-200 shadow-brand-200/60' : ''}`}>
                                            <button
                                                onClick={() => handleCopyMessage(msg.text)}
                                                className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity text-slate-400 hover:text-brand-600 bg-white/20 p-1 rounded"
                                                title="Copy message"
                                                aria-label="Copy message"
                                            >
                                                <Copy className="h-3 w-3" />
                                            </button>
                                            {msg.sender === 'bot' && !msg.isSystem && (
                                            <button
                                                onClick={() => handleAddMessageToNotes(msg.text)}
                                                className="absolute top-2 right-12 opacity-0 group-hover:opacity-100 transition-opacity text-slate-400 hover:text-brand-600 bg-white/20 p-1 rounded"
                                                title="Save to notes"
                                                aria-label="Save to notes"
                                            >
                                                    <BookmarkPlus className="h-3 w-3" />
                                                </button>
                                            )}
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
                                                shouldAnimate={msg.id === lastAnswerId && msg.sender === 'bot' && !msg.isSystem}
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
                                <AnimatePresence>
                                    {isTyping && (
                                        <motion.div
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            exit={{ opacity: 0, y: -10 }}
                                            className="flex justify-start"
                                        >
                                            <div className="bg-slate-100 rounded-2xl rounded-bl-none p-4 flex gap-1">
                                                <span className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" />
                                                <span className="w-2 h-2 bg-slate-400 rounded-full animate-bounce delay-75" />
                                                <span className="w-2 h-2 bg-slate-400 rounded-full animate-bounce delay-150" />
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                                <div ref={messagesEndRef} />
                            </div>

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
                                        aria-label="Send message"
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

                        {shouldRenderNotesPanel && (
                            <div className="flex flex-col gap-4 lg:gap-0 lg:flex-row shrink-0 w-full lg:w-auto">
                                {isDesktopLayout && (
                            <div
                                className="hidden lg:flex items-center justify-center w-5 cursor-col-resize select-none text-slate-400 hover:bg-slate-100 hover:text-brand-500 transition-colors -ml-2.5 z-10"
                                role="separator"
                                        aria-label="Resize session notes panel"
                                        aria-orientation="vertical"
                                        tabIndex={0}
                                        onPointerDown={handleNotesResizeStart}
                                        onKeyDown={handleResizableKeyDown}
                                        title="Drag to resize notes"
                                    >
                                        <div className="flex flex-col items-center gap-1 bg-white/80 rounded-full px-1 py-3 shadow-sm border border-slate-200">
                                            <GripVertical className="h-4 w-4" />
                                        </div>
                                    </div>
                                )}
                                <div
                                    className="border border-slate-200 bg-slate-50 rounded-xl shadow-inner p-4 sm:p-5 flex flex-col w-full lg:w-auto transition-[width] duration-200 max-h-[300px] lg:max-h-none"
                                    style={notesPanelStyle}
                                >
                                    {sessionNotesContent}
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="flex flex-col gap-4 min-h-[calc(100vh-10rem)] sm:min-h-[calc(100vh-8rem)]">
            <div className="flex flex-wrap items-start justify-between gap-3 mb-2 sm:mb-4">
                <div>
                    <h2 className="text-xl sm:text-2xl font-bold text-slate-900 flex flex-wrap items-center gap-2">
                        <Sparkles className="h-5 w-5 sm:h-6 sm:w-6 text-brand-600" />
                        Power BI Guru
                        {connectionBadge && (
                            <span className={`text-[10px] sm:text-xs px-2 py-0.5 rounded-full font-medium ${connectionBadge.className}`}>
                                {connectionBadge.text}
                            </span>
                        )}
                    </h2>
                    <p className="text-sm sm:text-base text-slate-600 mt-1">Your AI assistant for DAX, Design, and Strategy.</p>
                    {apiKey && (
                        <p className="mt-1 text-xs text-slate-500">
                            {isUsingCustomKey
                                ? 'Using your personal Gemini access code.'
                                : isEnvKey
                                    ? 'Using the built-in HHS Gemini access code.'
                                    : 'Using the currently stored Gemini access code.'}
                        </p>
                    )}
                    {!apiKey && isProjectKeyBlocked && (
                        <p className="mt-1 text-xs text-amber-600 flex items-center gap-1">
                            <AlertCircle className="h-3 w-3" />
                            Built-in cloud access is limited to approved internal domains. Add your own access code in settings to chat from this site.
                        </p>
                    )}
                    {connectionStatus === 'error' && apiKey && (
                        <p className="mt-1 text-sm text-rose-600 flex items-center gap-1">
                            <AlertCircle className="h-4 w-4" />
                            <span>{connectionError || 'Unable to connect to the AI. Update the access code in settings.'}</span>
                        </p>
                    )}
                </div>
                <div className="flex flex-wrap items-center gap-2">
                    <button
                        onClick={toggleSidebar}
                        aria-pressed={isSidebarCollapsed}
                        aria-label={isSidebarCollapsed ? 'Show sidebar' : 'Hide sidebar'}
                        className={`hidden lg:flex p-2.5 sm:p-2 rounded-lg text-sm font-medium items-center gap-2 border transition-colors ${isSidebarCollapsed
                            ? 'border-slate-200 text-slate-600 hover:bg-slate-100'
                            : 'bg-emerald-50 text-emerald-700 border-emerald-100'
                            }`}
                        title={isSidebarCollapsed ? 'Show sidebar' : 'Hide sidebar'}
                    >
                        {isSidebarCollapsed ? <PanelLeftOpen className="h-4 w-4" /> : <PanelLeftClose className="h-4 w-4" />}
                        <span className="hidden xl:inline">{isSidebarCollapsed ? 'Show sidebar' : 'Hide sidebar'}</span>
                    </button>
                    <button
                        onClick={toggleNotesPanel}
                        aria-pressed={!isNotesPanelCollapsed}
                        aria-label={isNotesPanelCollapsed ? 'Show notes panel' : 'Hide notes panel'}
                        className={`p-2.5 sm:p-2 rounded-lg text-xs sm:text-sm font-medium flex items-center gap-1.5 sm:gap-2 border transition-colors ${isNotesPanelCollapsed
                            ? 'border-slate-200 text-slate-600 hover:bg-slate-100'
                            : 'bg-brand-50 text-brand-700 border-brand-100'
                            }`}
                    >
                        {isNotesPanelCollapsed ? <PanelRightOpen className="h-4 w-4" /> : <PanelRightClose className="h-4 w-4" />}
                        <span className="hidden sm:inline">{isNotesPanelCollapsed ? 'Show notes' : 'Hide notes'}</span>
                    </button>
                    <button
                        onClick={toggleMaximize}
                        className="p-2.5 sm:p-2 rounded-lg bg-slate-100 text-slate-600 hover:bg-slate-200 transition-colors"
                        title="Maximize (Fullscreen Mode)"
                        aria-label="Maximize (Fullscreen Mode)"
                    >
                        <Maximize2 className="h-5 w-5" />
                    </button>
                    <button
                        onClick={() => setShowSettings(!showSettings)}
                        className={`p-2.5 sm:p-2 rounded-lg transition-colors ${showSettings
                            ? 'bg-brand-50 text-brand-700'
                            : isUsingCustomKey
                                ? 'bg-emerald-100 text-emerald-700'
                                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                            }`}
                        title="Manage AI Access Code"
                        aria-label="Manage AI Access Code"
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
            <div
                ref={workspaceRef}
                className="flex-1 flex flex-col gap-4 lg:flex-row lg:items-stretch overflow-hidden"
            >
                <div className="flex-1 bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden flex flex-col relative min-w-0 min-h-[420px]">
                    <div className="bg-slate-50 border-b border-slate-200 px-3 sm:px-4 py-2 sm:py-3 flex flex-wrap items-center gap-3">
                        <div className="flex items-center gap-2">
                            <MessageSquare className="h-4 w-4 text-slate-500" />
                            <span className="text-sm font-medium text-slate-700">Conversation</span>
                            <span className="text-xs text-slate-500 bg-slate-200 px-2 py-0.5 rounded-full">
                                {messages.filter(msg => !msg.isSystem).length} messages
                            </span>
                        </div>
                        <div className="flex gap-1.5 sm:gap-2 ml-auto">
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

                    <div className="px-3 sm:px-4 py-2 sm:py-3 border-b border-slate-100 bg-white flex flex-wrap items-center gap-2">
                        <div className="flex items-center gap-2 text-[10px] sm:text-xs font-semibold uppercase text-slate-500">
                            <Wand2 className="h-3 w-3 text-brand-500" />
                            <span className="hidden xs:inline">Quick prompts</span>
                        </div>
                        <div className="flex flex-wrap gap-1.5 sm:gap-2">
                            {QUICK_PROMPTS.map(prompt => (
                                <button
                                    key={prompt.label}
                                    onClick={() => handleQuickPrompt(prompt.value)}
                                    className="px-2.5 sm:px-3 py-1.5 sm:py-1 text-[11px] sm:text-xs bg-slate-100 text-slate-700 rounded-full hover:bg-brand-50 hover:text-brand-700 transition-colors whitespace-nowrap flex-shrink-0"
                                >
                                    {prompt.label}
                                </button>
                            ))}
                        </div>
                        <div className="ml-auto flex items-center gap-1.5 sm:gap-2">
                            <button
                                onClick={() => setShowStyleSettings(!showStyleSettings)}
                                className={`text-[11px] sm:text-xs px-2.5 sm:px-3 py-1.5 sm:py-1 rounded-full border flex items-center gap-1 sm:gap-1.5 ${showStyleSettings ? 'bg-brand-600 text-white border-brand-600' : 'border-slate-200 text-slate-600 hover:bg-slate-100'}`}
                                title="Text & Style Settings"
                                aria-label="Text & Style Settings"
                            >
                                <Type className="h-3 w-3" />
                                <span className="hidden sm:inline">Style</span>
                            </button>
                            <button
                                onClick={toggleCompactMode}
                                className={`text-[11px] sm:text-xs px-2.5 sm:px-3 py-1.5 sm:py-1 rounded-full border whitespace-nowrap ${isCompactMode ? 'bg-brand-600 text-white border-brand-600' : 'border-slate-200 text-slate-600'}`}
                                aria-label={isCompactMode ? 'Switch to normal mode' : 'Switch to compact mode'}
                            >
                                {isCompactMode ? 'Compact' : 'Normal'}
                            </button>
                        </div>
                    </div>

                    <AnimatePresence>
                        {showStyleSettings && (
                            <motion.div
                                initial={{ height: 0, opacity: 0 }}
                                animate={{ height: 'auto', opacity: 1 }}
                                exit={{ height: 0, opacity: 0 }}
                                className="overflow-hidden border-b border-slate-200"
                            >
                                <div className="px-3 sm:px-4 py-3 bg-gradient-to-br from-brand-50 to-slate-50">
                                    <div className="flex items-center gap-2 mb-3">
                                        <Type className="h-4 w-4 text-brand-600" />
                                        <h3 className="font-semibold text-slate-900 text-sm">Text & Style Settings</h3>
                                    </div>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-xs font-medium text-slate-700 mb-2">Font Size</label>
                                            <div className="grid grid-cols-2 gap-2">
                                                {Object.entries(FONT_SIZES).map(([key, config]) => (
                                                    <button
                                                        key={key}
                                                        onClick={() => setFontSize(key)}
                                                        className={`px-3 py-2 text-xs rounded-lg border transition-all ${
                                                            fontSize === key
                                                                ? 'bg-brand-600 text-white border-brand-600 shadow-md'
                                                                : 'bg-white text-slate-700 border-slate-200 hover:border-brand-300 hover:bg-brand-50'
                                                        }`}
                                                    >
                                                        <div className="font-semibold">{config.label}</div>
                                                        <div className="text-[10px] opacity-75">{config.description}</div>
                                                    </button>
                                                ))}
                                            </div>
                                        </div>
                                        <div>
                                            <label className="block text-xs font-medium text-slate-700 mb-2">Line Spacing</label>
                                            <div className="grid grid-cols-1 gap-2">
                                                {Object.entries(LINE_HEIGHTS).map(([key, config]) => (
                                                    <button
                                                        key={key}
                                                        onClick={() => setLineHeight(key)}
                                                        className={`px-3 py-2 text-xs rounded-lg border transition-all ${
                                                            lineHeight === key
                                                                ? 'bg-brand-600 text-white border-brand-600 shadow-md'
                                                                : 'bg-white text-slate-700 border-slate-200 hover:border-brand-300 hover:bg-brand-50'
                                                        }`}
                                                    >
                                                        {config.label}
                                                    </button>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                    <p className="text-xs text-slate-500 mt-3 flex items-center gap-1">
                                        <Sparkles className="h-3 w-3" />
                                        Settings are saved automatically and persist across sessions
                                    </p>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>

                    {currentQuestion && (
                        <div className="px-3 sm:px-4 py-2 sm:py-3 border-b border-slate-100 bg-slate-50 flex flex-wrap items-center gap-3">
                            <div className="flex-1 min-w-[240px]">
                                <p className="text-xs uppercase font-semibold text-slate-500 tracking-wide">Current question</p>
                                <p className="font-medium text-slate-900">{truncateText(currentQuestion.text, 160)}</p>
                            </div>
                            <div className="flex items-center gap-2">
                                <button
                                    onClick={() => scrollToMessage(currentQuestion.id)}
                                    className="px-3 py-1.5 text-xs rounded-full bg-white border border-slate-200 hover:border-brand-300 hover:text-brand-600 transition-colors flex items-center gap-1"
                                >
                                    <ArrowDownToLine className="h-3 w-3" /> Jump to question
                                </button>
                                <button
                                    onClick={() => handleAddMessageToNotes(currentQuestion.text)}
                                    className="px-3 py-1.5 text-xs rounded-full bg-brand-50 text-brand-700 border border-brand-100 flex items-center gap-1"
                                >
                                    <BookmarkPlus className="h-3 w-3" /> Save
                                </button>
                            </div>
                        </div>
                    )}

                    <div
                        ref={messagesContainerRef}
                        className={`flex-1 overflow-y-auto p-3 sm:p-4 lg:p-5 ${messageSpacingClass} relative`}
                    >
                        {messages.map((msg) => (
                            <motion.div
                                key={msg.id}
                                id={`message-${msg.id}`}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                            >
                                <div className={`max-w-[80%] rounded-2xl ${messagePaddingClass} group relative ${msg.sender === 'user'
                                    ? 'bg-brand-600 text-white rounded-br-none'
                                    : msg.isSystem
                                        ? 'bg-amber-50 text-amber-800 border border-amber-100'
                                        : 'bg-slate-100 text-slate-800 rounded-bl-none'
                                    } ${msg.id === lastAnswerId ? 'ring-2 ring-brand-200 shadow-lg shadow-brand-200/60' : ''}`}>
                                    <button
                                        onClick={() => handleCopyMessage(msg.text)}
                                        className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity text-slate-400 hover:text-brand-600"
                                        title="Copy message"
                                        aria-label="Copy message"
                                    >
                                        <Copy className="h-4 w-4" />
                                    </button>
                                    {msg.sender === 'bot' && !msg.isSystem && (
                                        <button
                                            onClick={() => handleAddMessageToNotes(msg.text)}
                                            className="absolute top-2 right-10 opacity-0 group-hover:opacity-100 transition-opacity text-slate-400 hover:text-brand-600"
                                            title="Save to notes"
                                            aria-label="Save to notes"
                                        >
                                            <BookmarkPlus className="h-4 w-4" />
                                        </button>
                                    )}
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
                                        shouldAnimate={msg.id === lastAnswerId && msg.sender === 'bot' && !msg.isSystem}
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
                        <AnimatePresence>
                            {isTyping && (
                                <motion.div
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -10 }}
                                    className="flex justify-start"
                                >
                                    <div className="bg-slate-100 rounded-2xl rounded-bl-none p-4 flex gap-1">
                                        <span className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" />
                                        <span className="w-2 h-2 bg-slate-400 rounded-full animate-bounce delay-75" />
                                        <span className="w-2 h-2 bg-slate-400 rounded-full animate-bounce delay-150" />
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                        <div ref={messagesEndRef} />
                    </div>

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

                    <div className="p-3 sm:p-4 bg-slate-50 border-t border-slate-200">
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
                                placeholder="Ask anything about Power BI..."
                                className="input-field flex-1 shadow-sm resize-none min-h-[48px] sm:min-h-[44px] max-h-[200px] text-base sm:text-sm"
                                rows={1}
                            />
                                    <button
                                        onClick={handleSend}
                                        disabled={!input.trim() || isTyping}
                                        className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed min-w-[48px] sm:min-w-[44px]"
                                        aria-label="Send message"
                                    >
                                <Send className="h-5 w-5 sm:h-4 sm:w-4" />
                            </button>
                        </div>
                        <p className="text-[10px] sm:text-xs text-slate-400 mt-2 text-center flex flex-wrap items-center justify-center gap-x-2 gap-y-1">
                            <span className="hidden sm:inline">Enter = Send</span>
                            <span className="hidden sm:inline">Shift+Enter = New line</span>
                            <span className="sm:hidden">Tap Send or press Enter</span>
                            <span className="hidden md:inline">Copy buttons appear when you hover a message</span>
                        </p>
                        {!apiKey && (
                            <p className="text-xs text-slate-400 mt-2 text-center">
                                Running in <span className="font-semibold text-brand-600">Local Knowledge Mode</span>. Add an Access Code for full AI features.
                            </p>
                        )}
                    </div>
                </div>

                {shouldRenderNotesPanel && (
                    <div className="flex flex-col gap-4 lg:gap-0 lg:flex-row shrink-0 w-full lg:w-auto">
                        {isDesktopLayout && (
                            <div
                                className="hidden lg:flex items-center justify-center w-5 cursor-col-resize select-none text-slate-400 hover:bg-slate-100 hover:text-brand-500 transition-colors -ml-2.5 z-10"
                                role="separator"
                                aria-label="Resize session notes panel"
                                aria-orientation="vertical"
                                tabIndex={0}
                                onPointerDown={handleNotesResizeStart}
                                onKeyDown={handleResizableKeyDown}
                                title="Drag to resize notes"
                            >
                                <div className="flex flex-col items-center gap-1 bg-white/80 rounded-full px-1 py-3 shadow-sm border border-slate-200">
                                    <GripVertical className="h-4 w-4" />
                                </div>
                            </div>
                        )}
                        <aside
                            className="bg-white border border-slate-200 rounded-xl shadow-sm p-4 sm:p-5 flex flex-col w-full lg:w-auto min-h-[260px] max-h-[300px] lg:max-h-none transition-[width] duration-200"
                            style={notesPanelStyle}
                        >
                            {sessionNotesContent}
                        </aside>
                    </div>
                )}
            </div>
        </div>
    );
};

export default PowerBIGuru;
