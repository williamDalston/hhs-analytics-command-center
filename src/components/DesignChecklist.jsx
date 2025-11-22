import React, { useState, useEffect } from 'react';
import { CheckCircle, Circle, AlertTriangle, ShieldCheck } from 'lucide-react';
import { motion } from 'framer-motion';

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

const DesignChecklist = () => {
    const [checkedItems, setCheckedItems] = useState(getInitialChecklistState);

    // Save state to local storage on change
    useEffect(() => {
        if (typeof window === 'undefined') return;
        localStorage.setItem('pbi-checklist-hhs', JSON.stringify(checkedItems));
    }, [checkedItems]);

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
