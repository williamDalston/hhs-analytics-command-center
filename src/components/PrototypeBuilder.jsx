import React, { useState, useEffect } from 'react';
import { CheckCircle, Circle, Database, Box, Layout, ChevronDown, ChevronUp, Briefcase, ExternalLink } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';

const layers = [
    {
        id: 'data',
        title: 'Data Layer',
        icon: Database,
        color: 'blue',
        description: 'Power Query, APIs, and Data Cleaning',
        items: [
            { text: '**Connection Parameters:** Use parameters for Server, Database, and API Base URLs (Dev/Prod switching).' },
            { text: '**Query Folding:** Verify "View Native Query" is active for SQL sources to ensure performance.' },
            { text: '**API Pagination:** Implement robust pagination logic (List.Generate) for API calls.' },
            { text: '**Column Profiling:** Check Column Quality/Distribution for unexpected nulls or outliers.' },
            { text: '**Data Types:** Explicitly set data types for ALL columns (don\'t rely on auto-detect).' },
            { text: '**Naming Conventions:** Use CamelCase or PascalCase consistently (e.g., "OrderDate" not "order_date").' },
            { text: '**Remove Junk:** Filter out top rows, bottom rows, and blank rows early.' },
            { text: '**Star Schema Prep:** Unpivot attribute columns to create tall, narrow tables.' },
            { text: '**Disable Load:** Ensure staging/intermediate queries have "Enable Load" unchecked.' },
            { text: '**Documentation:** Add descriptions to queries in the Properties pane.' }
        ]
    },
    {
        id: 'model',
        title: 'Model Layer',
        icon: Box,
        color: 'emerald',
        description: 'Star Schema, Relationships, and DAX',
        items: [
            { text: '**Dim/Fact Separation:** clearly separate Dimension (Who, What, Where) and Fact (Numbers) tables.' },
            { text: '**Relationships:** Ensure 1-to-Many relationships flow from Dim to Fact (Single Direction).' },
            { text: '**Date Table:** Mark the Date table as "Date Table" to enable Time Intelligence functions.' },
            { text: '**Hide Keys:** Hide Surrogate Keys (IDs) in Fact tables to prevent misuse.' },
            { text: '**Measure Organization:** Use a dedicated "Measures" table or folders for organization.' },
            { text: '**Formatting:** Set currency, decimal places, and thousands separators for all numeric fields.' },
            { text: '**Sort By:** Configure "Sort By Column" for Month Names, Days of Week, etc.' },
            { text: '**Synonyms:** Add Q&A synonyms for key fields (e.g., "Revenue" -> "Sales").' },
            { text: '**DAX Best Practices:** Use DIVIDE() for ratios, avoid calculated columns for metrics.', link: '/dax', linkText: 'View Patterns' },
            { text: '**Row Level Security:** Define RLS roles if data sensitivity requires it.' }
        ]
    },
    {
        id: 'experience',
        title: 'Experience Layer',
        icon: Layout,
        color: 'amber',
        description: 'UX, Branding, and Accessibility',
        items: [
            { text: '**HHS Trust Bar:** Ensure the "Official website of the United States government" banner is visible.' },
            { text: '**Brand Compliance:** Use exact HHS Hex codes (Blue: #005EA2, Navy: #1A4480).', link: '/style-guide', linkText: 'Open Style Guide' },
            { text: '**Typography:** Use approved fonts (Source Sans Pro, Merriweather, or Arial).', link: '/style-guide', linkText: 'Check Fonts' },
            { text: '**Alt Text:** Add meaningful Alt Text to every chart and non-decorative image (508 Compliance).' },
            { text: '**Tab Order:** Configure the "Selection" pane tab order for logical keyboard navigation.' },
            { text: '**Color Contrast:** Verify text/background contrast is at least 4.5:1 (WCAG AA).' },
            { text: '**Slicer Panel:** Group filters in a collapsible sidebar or clear top bar.' },
            { text: '**Page Layout:** Use a grid system; place KPIs at top-left (F-Pattern).' },
            { text: '**Tooltips:** Create custom report page tooltips for detailed insights on hover.' },
            { text: '**Mobile View:** Optimize the mobile layout for phone viewing.' }
        ]
    }
];

const projects = [
    'ASPA Analytics Dashboard',
    'Jira Delivery Dashboard',
    'HHS Social Media Audit',
    'General / Template'
];

const getInitialPrototypeState = () => {
    if (typeof window === 'undefined') {
        return { checked: {}, project: projects[0] };
    }
    const savedChecked = localStorage.getItem('pbi-prototype-builder');
    const savedProject = localStorage.getItem('pbi-prototype-project');
    let parsedChecked = {};
    if (savedChecked) {
        try {
            parsedChecked = JSON.parse(savedChecked);
        } catch (error) {
            console.warn('Failed to parse prototype checklist state', error);
        }
    }
    return {
        checked: parsedChecked,
        project: savedProject || projects[0]
    };
};

const PrototypeBuilder = () => {
    const [checkedItems, setCheckedItems] = useState(() => getInitialPrototypeState().checked);
    const [expandedLayer, setExpandedLayer] = useState('data');
    const [selectedProject, setSelectedProject] = useState(() => getInitialPrototypeState().project);

    useEffect(() => {
        if (typeof window === 'undefined') return;
        localStorage.setItem('pbi-prototype-builder', JSON.stringify(checkedItems));
    }, [checkedItems]);

    useEffect(() => {
        if (typeof window === 'undefined') return;
        localStorage.setItem('pbi-prototype-project', selectedProject);
    }, [selectedProject]);

    const toggleItem = (layerId, itemIdx) => {
        const key = `${selectedProject}-${layerId}-${itemIdx}`;
        setCheckedItems(prev => ({
            ...prev,
            [key]: !prev[key]
        }));
    };

    const getLayerProgress = (layer) => {
        const total = layer.items.length;
        const completed = layer.items.filter((_, idx) => checkedItems[`${selectedProject}-${layer.id}-${idx}`]).length;
        return { completed, total, percent: Math.round((completed / total) * 100) };
    };

    return (
        <div className="space-y-8">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4">
                <div>
                    <h2 className="text-2xl font-bold text-slate-900">Prototype Builder</h2>
                    <p className="text-slate-600">Comprehensive technical checklist for HHS deliverables.</p>
                </div>
                <div className="w-full md:w-64">
                    <label className="block text-xs font-semibold text-slate-500 mb-1 uppercase tracking-wide">Active Project</label>
                    <div className="relative">
                        <Briefcase className="absolute left-3 top-1/2 transform -translate-y-1/2 text-brand-600 h-4 w-4" />
                        <select
                            value={selectedProject}
                            onChange={(e) => setSelectedProject(e.target.value)}
                            className="input-field pl-10 py-2 text-sm font-medium text-brand-900 bg-brand-50 border-brand-200 focus:ring-brand-500"
                        >
                            {projects.map(p => (
                                <option key={p} value={p}>{p}</option>
                            ))}
                        </select>
                    </div>
                </div>
            </div>

            <div className="space-y-6">
                {layers.map((layer) => {
                    const progress = getLayerProgress(layer);
                    const isComplete = progress.percent === 100;
                    const isExpanded = expandedLayer === layer.id;
                    const Icon = layer.icon;

                    // Dynamic color classes
                    const colorClasses = {
                        blue: { bg: 'bg-blue-100', text: 'text-blue-700', bar: 'bg-blue-500', border: 'border-blue-200', lightBg: 'bg-blue-50' },
                        emerald: { bg: 'bg-emerald-100', text: 'text-emerald-700', bar: 'bg-emerald-500', border: 'border-emerald-200', lightBg: 'bg-emerald-50' },
                        amber: { bg: 'bg-amber-100', text: 'text-amber-700', bar: 'bg-amber-500', border: 'border-amber-200', lightBg: 'bg-amber-50' }
                    }[layer.color];

                    return (
                        <motion.div
                            key={layer.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className={`card transition-all duration-300 ${isComplete ? `${colorClasses.border} ${colorClasses.lightBg}/30` : ''}`}
                        >
                            <div
                                onClick={() => setExpandedLayer(isExpanded ? null : layer.id)}
                                className="flex items-center justify-between cursor-pointer"
                            >
                                <div className="flex items-center gap-4">
                                    <div className={`h-12 w-12 rounded-xl flex items-center justify-center shadow-sm
                                        ${colorClasses.bg} ${colorClasses.text}`}>
                                        <Icon className="h-6 w-6" />
                                    </div>
                                    <div>
                                        <h3 className="text-lg font-bold text-slate-900">{layer.title}</h3>
                                        <p className="text-sm text-slate-500">{layer.description}</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-6">
                                    <div className="text-right hidden sm:block">
                                        <div className="text-sm font-semibold text-slate-700">{progress.percent}%</div>
                                        <div className="text-xs text-slate-400">Complete</div>
                                    </div>
                                    {isExpanded ? <ChevronUp className="h-5 w-5 text-slate-400" /> : <ChevronDown className="h-5 w-5 text-slate-400" />}
                                </div>
                            </div>

                            {/* Progress Bar */}
                            <div className="mt-4 h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                                <div
                                    className={`h-full transition-all duration-500 ${colorClasses.bar}`}
                                    style={{ width: `${progress.percent}%` }}
                                />
                            </div>

                            <AnimatePresence>
                                {isExpanded && (
                                    <motion.div
                                        initial={{ height: 0, opacity: 0 }}
                                        animate={{ height: 'auto', opacity: 1 }}
                                        exit={{ height: 0, opacity: 0 }}
                                        className="overflow-hidden"
                                    >
                                        <div className="pt-6 space-y-3">
                                            {layer.items.map((item, idx) => {
                                                // Split item into bold title and description if possible
                                                const parts = item.text.split('**');
                                                const hasBold = parts.length >= 3;

                                                return (
                                                    <div
                                                        key={idx}
                                                        className="flex items-start gap-3 group p-3 rounded-lg hover:bg-slate-50/80 transition-colors border border-transparent hover:border-slate-100"
                                                    >
                                                        <div
                                                            onClick={() => toggleItem(layer.id, idx)}
                                                            className={`mt-0.5 cursor-pointer transition-colors ${checkedItems[`${selectedProject}-${layer.id}-${idx}`] ? colorClasses.text : 'text-slate-300 group-hover:text-slate-400'}`}
                                                        >
                                                            {checkedItems[`${selectedProject}-${layer.id}-${idx}`] ?
                                                                <CheckCircle className="h-5 w-5" /> :
                                                                <Circle className="h-5 w-5" />
                                                            }
                                                        </div>
                                                        <div className="flex-1">
                                                            <span
                                                                onClick={() => toggleItem(layer.id, idx)}
                                                                className={`text-sm cursor-pointer transition-colors ${checkedItems[`${selectedProject}-${layer.id}-${idx}`] ? 'text-slate-400 line-through' : 'text-slate-700'}`}
                                                            >
                                                                {hasBold ? (
                                                                    <>
                                                                        <span className="font-semibold">{parts[1]}</span>
                                                                        {parts[2]}
                                                                    </>
                                                                ) : item.text}
                                                            </span>
                                                            {item.link && (
                                                                <Link
                                                                    to={item.link}
                                                                    className="inline-flex items-center gap-1 ml-2 text-xs font-medium text-brand-600 hover:text-brand-800 hover:underline"
                                                                >
                                                                    {item.linkText} <ExternalLink className="h-3 w-3" />
                                                                </Link>
                                                            )}
                                                        </div>
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </motion.div>
                    );
                })}
            </div>
        </div>
    );
};

export default PrototypeBuilder;
