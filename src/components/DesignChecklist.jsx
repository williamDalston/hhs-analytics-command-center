import React, { useState, useEffect } from 'react';
import { CheckCircle, Circle, AlertTriangle, ShieldCheck, Zap, Info } from 'lucide-react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

const checklistItems = [
    {
        category: 'HHS Branding & Compliance',
        items: [
            'Official Trust Bar ("An official website of the United States government") is present at the top.',
            'HHS Logo and Blue Banner are correctly positioned.',
            'Fonts are standard HHS approved (Source Sans Pro or similar sans-serif).',
            'Color palette matches HHS Brand Guide (Primary Blues, accessible accents).',
            'Disclaimer footer is present where required.'
        ]
    },
    {
        category: '508 Accessibility (Critical)',
        items: [
            'All non-decorative visuals have meaningful Alt Text.',
            'Tab order is logical for keyboard navigation.',
            'Color contrast ratios meet WCAG 2.1 AA standards (4.5:1 for normal text).',
            'Focus indicators are visible when navigating via keyboard.',
            'Screen reader reads data in a logical order.'
        ]
    },
    {
        category: 'Performance & Data Model',
        items: [
            'Remove unused columns and tables from the data model.',
            'Ensure relationships are One-to-Many (avoid Many-to-Many).',
            'Verify query folding is active in Power Query.',
            'Limit visuals per page (< 10 recommended).',
            'Row Level Security (RLS) is configured if data is sensitive.'
        ]
    },
    {
        category: 'Visual Design & UX',
        items: [
            'KPIs are top-left (F-pattern scanning).',
            'Slicers are grouped in a clear left or top sidebar.',
            'Tooltips provide context without clutter.',
            'Drill-throughs are intuitive and labeled.'
        ]
    }
];

const getInitialChecklistState = () => {
    if (typeof window === 'undefined') return {};
    const saved = localStorage.getItem('pbi-checklist-hhs');
    try {
        return saved ? JSON.parse(saved) : {};
    } catch (error) {
        console.warn('Failed to parse checklist state', error);
        return {};
    }
};

// Color contrast checker (simplified version)
const getLuminance = (hex) => {
    const rgb = hexToRgb(hex);
    if (!rgb) return 0;
    const [r, g, b] = [rgb.r, rgb.g, rgb.b].map(val => {
        val = val / 255;
        return val <= 0.03928 ? val / 12.92 : Math.pow((val + 0.055) / 1.055, 2.4);
    });
    return 0.2126 * r + 0.7152 * g + 0.0722 * b;
};

const hexToRgb = (hex) => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16)
    } : null;
};

const calculateContrast = (color1, color2) => {
    const lum1 = getLuminance(color1);
    const lum2 = getLuminance(color2);
    const lighter = Math.max(lum1, lum2);
    const darker = Math.min(lum1, lum2);
    return (lighter + 0.05) / (darker + 0.05);
};

const DesignChecklist = () => {
    const [checkedItems, setCheckedItems] = useState(getInitialChecklistState);
    const [colorChecks, setColorChecks] = useState({
        textColor: '#1c1d1f',
        backgroundColor: '#f1f3f6',
        accentColor: '#005ea2'
    });
    const [autoChecks, setAutoChecks] = useState({});

    // Save state to local storage on change
    useEffect(() => {
        if (typeof window === 'undefined') return;
        localStorage.setItem('pbi-checklist-hhs', JSON.stringify(checkedItems));
    }, [checkedItems]);

    // Auto-check color contrast
    useEffect(() => {
        const textBgContrast = calculateContrast(colorChecks.textColor, colorChecks.backgroundColor);
        const accentBgContrast = calculateContrast(colorChecks.accentColor, colorChecks.backgroundColor);
        
        setAutoChecks({
            textContrast: {
                ratio: textBgContrast,
                passesAA: textBgContrast >= 4.5,
                passesAAA: textBgContrast >= 7
            },
            accentContrast: {
                ratio: accentBgContrast,
                passesAA: accentBgContrast >= 4.5,
                passesAAA: accentBgContrast >= 7
            }
        });
    }, [colorChecks]);

    const toggleItem = (item) => {
        setCheckedItems(prev => ({
            ...prev,
            [item]: !prev[item]
        }));
    };

    const calculateProgress = (categoryItems) => {
        const checkedCount = categoryItems.filter(item => checkedItems[item]).length;
        return Math.round((checkedCount / categoryItems.length) * 100);
    };

    return (
        <div className="space-y-8">
            {/* Automated Accessibility Checks */}
            <div className="card p-6 bg-blue-50 border-blue-200">
                <div className="flex items-center gap-2 mb-4">
                    <Zap className="h-5 w-5 text-blue-600" />
                    <h3 className="text-lg font-semibold text-slate-800">Automated Accessibility Checks</h3>
                </div>
                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-semibold text-slate-700 mb-2">Color Contrast Check</label>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                            <div>
                                <label className="block text-xs text-slate-600 mb-1">Text Color</label>
                                <div className="flex gap-2">
                                    <input
                                        type="color"
                                        value={colorChecks.textColor}
                                        onChange={(e) => setColorChecks(prev => ({ ...prev, textColor: e.target.value }))}
                                        className="h-10 w-20 rounded border-2 border-slate-300 cursor-pointer"
                                    />
                                    <input
                                        type="text"
                                        value={colorChecks.textColor}
                                        onChange={(e) => setColorChecks(prev => ({ ...prev, textColor: e.target.value }))}
                                        className="flex-1 px-2 py-1 border border-slate-300 rounded font-mono text-xs"
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="block text-xs text-slate-600 mb-1">Background Color</label>
                                <div className="flex gap-2">
                                    <input
                                        type="color"
                                        value={colorChecks.backgroundColor}
                                        onChange={(e) => setColorChecks(prev => ({ ...prev, backgroundColor: e.target.value }))}
                                        className="h-10 w-20 rounded border-2 border-slate-300 cursor-pointer"
                                    />
                                    <input
                                        type="text"
                                        value={colorChecks.backgroundColor}
                                        onChange={(e) => setColorChecks(prev => ({ ...prev, backgroundColor: e.target.value }))}
                                        className="flex-1 px-2 py-1 border border-slate-300 rounded font-mono text-xs"
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="block text-xs text-slate-600 mb-1">Accent Color</label>
                                <div className="flex gap-2">
                                    <input
                                        type="color"
                                        value={colorChecks.accentColor}
                                        onChange={(e) => setColorChecks(prev => ({ ...prev, accentColor: e.target.value }))}
                                        className="h-10 w-20 rounded border-2 border-slate-300 cursor-pointer"
                                    />
                                    <input
                                        type="text"
                                        value={colorChecks.accentColor}
                                        onChange={(e) => setColorChecks(prev => ({ ...prev, accentColor: e.target.value }))}
                                        className="flex-1 px-2 py-1 border border-slate-300 rounded font-mono text-xs"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className={`p-3 rounded border-2 ${
                            autoChecks.textContrast?.passesAA
                                ? 'bg-green-50 border-green-200'
                                : 'bg-red-50 border-red-200'
                        }`}>
                            <div className="flex items-center gap-2 mb-1">
                                {autoChecks.textContrast?.passesAA ? (
                                    <CheckCircle className="h-4 w-4 text-green-600" />
                                ) : (
                                    <AlertTriangle className="h-4 w-4 text-red-600" />
                                )}
                                <span className="text-sm font-semibold">Text Contrast</span>
                            </div>
                            <div className="text-xs text-slate-700">
                                Ratio: {autoChecks.textContrast?.ratio?.toFixed(2)}:1
                                {autoChecks.textContrast?.passesAA ? ' ✓ WCAG AA' : ' ✗ Fails AA'}
                                {autoChecks.textContrast?.passesAAA && ' ✓ WCAG AAA'}
                            </div>
                        </div>
                        <div className={`p-3 rounded border-2 ${
                            autoChecks.accentContrast?.passesAA
                                ? 'bg-green-50 border-green-200'
                                : 'bg-red-50 border-red-200'
                        }`}>
                            <div className="flex items-center gap-2 mb-1">
                                {autoChecks.accentContrast?.passesAA ? (
                                    <CheckCircle className="h-4 w-4 text-green-600" />
                                ) : (
                                    <AlertTriangle className="h-4 w-4 text-red-600" />
                                )}
                                <span className="text-sm font-semibold">Accent Contrast</span>
                            </div>
                            <div className="text-xs text-slate-700">
                                Ratio: {autoChecks.accentContrast?.ratio?.toFixed(2)}:1
                                {autoChecks.accentContrast?.passesAA ? ' ✓ WCAG AA' : ' ✗ Fails AA'}
                                {autoChecks.accentContrast?.passesAAA && ' ✓ WCAG AAA'}
                            </div>
                        </div>
                    </div>
                    <div className="text-xs text-slate-600 flex items-center gap-1">
                        <Info className="h-3 w-3" />
                        <span>For more detailed contrast checking, visit the <Link to="/style-guide" className="text-brand-600 hover:underline">Style Guide</Link></span>
                    </div>
                </div>
            </div>
            <div>
                <h2 className="text-2xl font-bold text-slate-900">HHS Delivery Checklist</h2>
                <p className="text-slate-600">Ensure compliance with WebFirst and HHS standards before delivery.</p>
            </div>

            <div className="grid grid-cols-1 gap-8">
                {checklistItems.map((section, idx) => (
                    <motion.div
                        key={section.category}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: idx * 0.1 }}
                        className="card"
                    >
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="text-xl font-semibold text-brand-800 flex items-center gap-2">
                                {section.category.includes('HHS') && <ShieldCheck className="h-5 w-5 text-brand-600" />}
                                {section.category}
                            </h3>
                            <div className="flex items-center gap-2">
                                <div className="w-32 h-2 bg-slate-200 rounded-full overflow-hidden">
                                    <div
                                        className="h-full bg-brand-600 transition-all duration-500"
                                        style={{ width: `${calculateProgress(section.items)}%` }}
                                    />
                                </div>
                                <span className="text-sm text-slate-500 w-8 text-right">{calculateProgress(section.items)}%</span>
                            </div>
                        </div>

                        <div className="space-y-3">
                            {section.items.map((item) => (
                                <div
                                    key={item}
                                    onClick={() => toggleItem(item)}
                                    className={`flex items-start gap-3 p-3 rounded-lg cursor-pointer transition-all duration-200 ${checkedItems[item] ? 'bg-brand-50 border border-brand-200' : 'hover:bg-slate-50 border border-transparent'
                                        }`}
                                >
                                    <div className={`mt-0.5 ${checkedItems[item] ? 'text-brand-600' : 'text-slate-400'}`}>
                                        {checkedItems[item] ? <CheckCircle className="h-5 w-5" /> : <Circle className="h-5 w-5" />}
                                    </div>
                                    <span className={`text-sm ${checkedItems[item] ? 'text-slate-800' : 'text-slate-500'}`}>
                                        {item}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </motion.div>
                ))}
            </div>

            <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 flex items-start gap-3">
                <AlertTriangle className="h-6 w-6 text-amber-600 shrink-0" />
                <div>
                    <h4 className="font-medium text-amber-800">Recompete Critical</h4>
                    <p className="text-sm text-amber-700 mt-1">
                        Attention to detail matters. A polished, accessible, and branded dashboard demonstrates WebFirst&apos;s value to HHS leadership.
                    </p>
                </div>
            </div>
        </div>
    );
};

export default DesignChecklist;
