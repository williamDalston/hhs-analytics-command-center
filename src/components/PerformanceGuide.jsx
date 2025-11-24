import React, { useState, useEffect } from 'react';
import { TrendingUp, CheckCircle, Circle, AlertTriangle, Info, ExternalLink } from 'lucide-react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

const performanceChecklist = [
    {
        category: 'Data Model Optimization',
        icon: 'database',
        items: [
            {
                id: 'model-1',
                text: 'Remove unused columns and tables from the data model',
                tip: 'Unused columns still consume memory. Use "View Dependencies" to identify unused tables.',
                link: null
            },
            {
                id: 'model-2',
                text: 'Ensure relationships are One-to-Many (avoid Many-to-Many)',
                tip: 'Many-to-many relationships can cause performance issues. Use bridge tables when necessary.',
                link: null
            },
            {
                id: 'model-3',
                text: 'Verify query folding is active in Power Query',
                tip: 'Check "View Native Query" in Power Query to ensure operations are pushed to the source.',
                link: null
            },
            {
                id: 'model-4',
                text: 'Set data types explicitly (don\'t rely on auto-detect)',
                tip: 'Auto-detected types can be wrong. Set types explicitly to avoid conversion overhead.',
                link: null
            },
            {
                id: 'model-5',
                text: 'Disable "Auto Date/Time" in model settings',
                tip: 'Auto Date/Time creates hidden date tables that consume memory. Create explicit date tables instead.',
                link: null
            },
            {
                id: 'model-6',
                text: 'Use calculated measures instead of calculated columns when possible',
                tip: 'Calculated columns consume memory and are evaluated at refresh. Measures are calculated on-demand.',
                link: '/dax'
            },
            {
                id: 'model-7',
                text: 'Limit cardinality of relationships (avoid high-cardinality columns)',
                tip: 'High-cardinality relationships (millions of unique values) slow down filtering.',
                link: null
            }
        ]
    },
    {
        category: 'DAX Performance',
        icon: 'code',
        items: [
            {
                id: 'dax-1',
                text: 'Avoid using FILTER() inside CALCULATE when possible',
                tip: 'Use relationship filters or KEEPFILTERS() instead. FILTER() iterates over all rows.',
                link: '/dax'
            },
            {
                id: 'dax-2',
                text: 'Use variables (VAR) to avoid multiple evaluations',
                tip: 'Variables are evaluated once and reused, improving performance and readability.',
                link: '/dax'
            },
            {
                id: 'dax-3',
                text: 'Prefer SUMX/AVERAGEX over SUM/AVERAGE when you need row context',
                tip: 'But use SUM/AVERAGE when possible - they\'re faster for simple aggregations.',
                link: '/dax'
            },
            {
                id: 'dax-4',
                text: 'Avoid using RELATED() in calculated columns (use in measures or relationships)',
                tip: 'RELATED() in calculated columns is evaluated at refresh. Use relationships or measures instead.',
                link: null
            },
            {
                id: 'dax-5',
                text: 'Use DISTINCTCOUNT() sparingly (it\'s expensive)',
                tip: 'Consider using COUNTROWS() with a filtered table if you only need approximate counts.',
                link: null
            },
            {
                id: 'dax-6',
                text: 'Minimize use of ALL() and ALLSELECTED() - they scan entire tables',
                tip: 'These functions remove filters and can be slow on large tables. Use specific filters when possible.',
                link: null
            }
        ]
    },
    {
        category: 'Visual Performance',
        icon: 'layout',
        items: [
            {
                id: 'visual-1',
                text: 'Limit visuals per page (< 10 recommended)',
                tip: 'Each visual requires separate queries. Fewer visuals = faster page load.',
                link: null
            },
            {
                id: 'visual-2',
                text: 'Disable cross-filtering and drill-through on visuals that don\'t need it',
                tip: 'Cross-filtering triggers additional queries. Only enable where necessary.',
                link: null
            },
            {
                id: 'visual-3',
                text: 'Use aggregations for large datasets (especially for charts)',
                tip: 'Pre-aggregate data at the source or use Power BI aggregations feature.',
                link: null
            },
            {
                id: 'visual-4',
                text: 'Limit data points in line/area charts (< 1000 points)',
                tip: 'Too many data points slow rendering. Use date hierarchies or sampling.',
                link: null
            },
            {
                id: 'visual-5',
                text: 'Use table visuals sparingly (they load all rows)',
                tip: 'Tables load all data. Use cards or matrix visuals when possible.',
                link: null
            },
            {
                id: 'visual-6',
                text: 'Disable "Show items with no data" when not needed',
                tip: 'This option can significantly slow down visuals with sparse data.',
                link: null
            }
        ]
    },
    {
        category: 'Power Query Optimization',
        icon: 'zap',
        items: [
            {
                id: 'query-1',
                text: 'Verify query folding is active (check "View Native Query")',
                tip: 'Query folding pushes operations to the source database, improving performance.',
                link: '/power-query'
            },
            {
                id: 'query-2',
                text: 'Filter data as early as possible in the query',
                tip: 'Filtering early reduces the amount of data processed in subsequent steps.',
                link: '/power-query'
            },
            {
                id: 'query-3',
                text: 'Remove unnecessary columns before transformations',
                tip: 'Fewer columns = less memory usage and faster transformations.',
                link: '/power-query'
            },
            {
                id: 'query-4',
                text: 'Use "Disable Load" for intermediate/staging queries',
                tip: 'Intermediate queries don\'t need to be loaded into the model if they\'re only used in other queries.',
                link: null
            },
            {
                id: 'query-5',
                text: 'Avoid merging large tables if possible (use relationships instead)',
                tip: 'Merges can be slow. Use relationships in the model when possible.',
                link: null
            },
            {
                id: 'query-6',
                text: 'Use parameters for connection strings (enables query folding)',
                tip: 'Parameters help with query folding and make it easier to switch between dev/prod.',
                link: '/power-query'
            }
        ]
    },
    {
        category: 'Refresh & Data Loading',
        icon: 'refresh',
        items: [
            {
                id: 'refresh-1',
                text: 'Use incremental refresh for large datasets',
                tip: 'Incremental refresh only loads new/changed data, dramatically reducing refresh time.',
                link: null
            },
            {
                id: 'refresh-2',
                text: 'Schedule refreshes during off-peak hours',
                tip: 'Reduces load on source systems and improves user experience.',
                link: null
            },
            {
                id: 'refresh-3',
                text: 'Use DirectQuery only when real-time data is required',
                tip: 'DirectQuery is slower than Import mode. Use Import mode when possible.',
                link: null
            },
            {
                id: 'refresh-4',
                text: 'Optimize source queries (add WHERE clauses, indexes)',
                tip: 'Faster source queries = faster Power BI refreshes. Work with DBAs to optimize.',
                link: null
            }
        ]
    }
];

const getInitialChecklistState = () => {
    if (typeof window === 'undefined') return {};
    const saved = localStorage.getItem('pbi-performance-checklist');
    try {
        return saved ? JSON.parse(saved) : {};
    } catch (error) {
        return {};
    }
};

const PerformanceGuide = () => {
    const [checkedItems, setCheckedItems] = useState(getInitialChecklistState);
    const [expandedCategories, setExpandedCategories] = useState({});

    useEffect(() => {
        if (typeof window !== 'undefined') {
            localStorage.setItem('pbi-performance-checklist', JSON.stringify(checkedItems));
        }
    }, [checkedItems]);

    const toggleItem = (itemId) => {
        setCheckedItems(prev => ({
            ...prev,
            [itemId]: !prev[itemId]
        }));
    };

    const toggleCategory = (category) => {
        setExpandedCategories(prev => ({
            ...prev,
            [category]: !prev[category]
        }));
    };

    const calculateProgress = (items) => {
        const checkedCount = items.filter(item => checkedItems[item.id]).length;
        return Math.round((checkedCount / items.length) * 100);
    };

    const totalProgress = () => {
        const allItems = performanceChecklist.flatMap(cat => cat.items);
        const checkedCount = allItems.filter(item => checkedItems[item.id]).length;
        return Math.round((checkedCount / allItems.length) * 100);
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h2 className="text-2xl font-bold text-slate-900">Performance Optimization Guide</h2>
                    <p className="text-slate-600">Checklist for optimizing Power BI report performance.</p>
                </div>
                <div className="card p-4 bg-brand-50 border-brand-200">
                    <div className="flex items-center gap-3">
                        <TrendingUp className="h-5 w-5 text-brand-600" />
                        <div>
                            <div className="text-sm text-slate-600">Overall Progress</div>
                            <div className="text-2xl font-bold text-brand-700">{totalProgress()}%</div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="space-y-6">
                {performanceChecklist.map((category) => {
                    const progress = calculateProgress(category.items);
                    const isExpanded = expandedCategories[category.category] !== false;

                    return (
                        <motion.div
                            key={category.category}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="card"
                        >
                            <button
                                onClick={() => toggleCategory(category.category)}
                                className="w-full flex items-center justify-between mb-4"
                            >
                                <div className="flex items-center gap-3">
                                    <div className="p-2 bg-brand-100 rounded-lg">
                                        <TrendingUp className="h-5 w-5 text-brand-600" />
                                    </div>
                                    <div className="text-left">
                                        <h3 className="text-lg font-semibold text-slate-800">{category.category}</h3>
                                        <div className="text-sm text-slate-600">
                                            {category.items.filter(item => checkedItems[item.id]).length} / {category.items.length} completed
                                        </div>
                                    </div>
                                </div>
                                <div className="flex items-center gap-4">
                                    <div className="w-24 bg-slate-200 rounded-full h-2">
                                        <div
                                            className="bg-brand-600 h-2 rounded-full transition-all"
                                            style={{ width: `${progress}%` }}
                                        />
                                    </div>
                                    <span className="text-sm font-semibold text-slate-700">{progress}%</span>
                                </div>
                            </button>

                            {isExpanded && (
                                <div className="space-y-3">
                                    {category.items.map((item) => (
                                        <div
                                            key={item.id}
                                            className="flex items-start gap-3 p-3 rounded-lg hover:bg-slate-50 transition-colors"
                                        >
                                            <button
                                                onClick={() => toggleItem(item.id)}
                                                className="mt-0.5 flex-shrink-0"
                                            >
                                                {checkedItems[item.id] ? (
                                                    <CheckCircle className="h-5 w-5 text-green-600" />
                                                ) : (
                                                    <Circle className="h-5 w-5 text-slate-400" />
                                                )}
                                            </button>
                                            <div className="flex-1">
                                                <label
                                                    onClick={() => toggleItem(item.id)}
                                                    className="cursor-pointer text-slate-700 font-medium"
                                                >
                                                    {item.text}
                                                </label>
                                                {item.tip && (
                                                    <div className="mt-1 flex items-start gap-2 text-sm text-slate-600">
                                                        <Info className="h-4 w-4 mt-0.5 flex-shrink-0" />
                                                        <span>{item.tip}</span>
                                                    </div>
                                                )}
                                                {item.link && (
                                                    <Link
                                                        to={item.link}
                                                        className="mt-2 inline-flex items-center gap-1 text-xs text-brand-600 hover:text-brand-700"
                                                    >
                                                        Learn more <ExternalLink className="h-3 w-3" />
                                                    </Link>
                                                )}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </motion.div>
                    );
                })}
            </div>

            <div className="card p-6 bg-yellow-50 border-yellow-200">
                <div className="flex items-start gap-3">
                    <AlertTriangle className="h-5 w-5 text-yellow-600 flex-shrink-0 mt-0.5" />
                    <div>
                        <h3 className="font-semibold text-slate-800 mb-2">Performance Analyzer</h3>
                        <p className="text-sm text-slate-700">
                            Use Power BI Desktop's Performance Analyzer (View → Performance Analyzer) to identify slow visuals and queries.
                            This checklist complements the analyzer by helping you implement best practices proactively.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PerformanceGuide;

