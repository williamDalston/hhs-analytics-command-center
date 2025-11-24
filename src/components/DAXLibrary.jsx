import React, { useState, useEffect } from 'react';
import { Search, Copy, Check, Database, Code, AlertCircle, CheckCircle } from 'lucide-react';
import { motion } from 'framer-motion';
import { useToast } from '../context/ToastContext';
import { SkeletonList } from './Skeleton';

// Utility function to highlight search terms
const highlightText = (text, searchTerm) => {
  if (!searchTerm || !text) return text;

  const regex = new RegExp(`(${searchTerm.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi');
  const parts = text.split(regex);

  return parts.map((part, index) =>
    regex.test(part) ? (
      <mark key={index} className="bg-yellow-200 dark:bg-yellow-600 px-1 rounded">
        {part}
      </mark>
    ) : (
      part
    )
  );
};

const daxPatterns = [
    // Social Media Metrics
    {
        id: 101,
        title: 'Engagement Rate',
        description: 'Total engagements divided by total impressions.',
        code: `Engagement Rate = 
DIVIDE(
    [Total Engagements],
    [Total Impressions],
    0
)`,
        category: 'Social Media'
    },
    {
        id: 102,
        title: 'Impressions Growth %',
        description: 'Month-over-Month growth in impressions.',
        code: `Impressions MoM % = 
VAR CurrentImpressions = [Total Impressions]
VAR PreviousImpressions = CALCULATE([Total Impressions], DATEADD('Date'[Date], -1, MONTH))
RETURN
DIVIDE(CurrentImpressions - PreviousImpressions, PreviousImpressions)`,
        category: 'Social Media'
    },
    {
        id: 103,
        title: 'Follower Net Growth',
        description: 'New followers minus unfollows.',
        code: `Net Follower Growth = 
[New Followers] - [Unfollows]`,
        category: 'Social Media'
    },

    // Jira / Delivery Metrics
    {
        id: 201,
        title: 'Cycle Time (Days)',
        description: 'Average days from "In Progress" to "Done".',
        code: `Avg Cycle Time = 
AVERAGEX(
    FILTER(
        'Jira Issues',
        'Jira Issues'[Status] = "Done" && NOT(ISBLANK('Jira Issues'[InProgressDate]))
    ),
    DATEDIFF('Jira Issues'[InProgressDate], 'Jira Issues'[ResolvedDate], DAY)
)`,
        category: 'Jira Delivery'
    },
    {
        id: 202,
        title: 'Throughput (Issues per Sprint)',
        description: 'Count of issues completed in the current sprint context.',
        code: `Throughput = 
CALCULATE(
    COUNTROWS('Jira Issues'),
    'Jira Issues'[Status] = "Done"
)`,
        category: 'Jira Delivery'
    },
    {
        id: 203,
        title: 'SLA Adherence %',
        description: 'Percentage of tickets resolved within the SLA limit.',
        code: `SLA Adherence % = 
VAR WithinSLA = CALCULATE(COUNTROWS('Jira Issues'), 'Jira Issues'[DaysToResolve] <= [SLA Target])
VAR TotalResolved = CALCULATE(COUNTROWS('Jira Issues'), 'Jira Issues'[Status] = "Done")
RETURN
DIVIDE(WithinSLA, TotalResolved, 0)`,
        category: 'Jira Delivery'
    },

    // Standard Patterns
    {
        id: 1,
        title: 'Year-over-Year Growth',
        description: 'Calculate the percentage growth compared to the same period last year.',
        code: `YoY Growth % = 
VAR CurrentValue = [Total Sales]
VAR PreviousValue = CALCULATE([Total Sales], SAMEPERIODLASTYEAR('Date'[Date]))
RETURN
DIVIDE(CurrentValue - PreviousValue, PreviousValue)`,
        category: 'Time Intelligence'
    },
    {
        id: 2,
        title: 'Moving Average (3 Months)',
        description: 'Calculate the average of the last 3 months.',
        code: `3M Moving Avg = 
AVERAGEX(
    DATESINPERIOD('Date'[Date], LASTDATE('Date'[Date]), -3, MONTH),
    [Total Sales]
)`,
        category: 'Time Intelligence'
    },
    {
        id: 5,
        title: 'Dynamic Title',
        description: 'Create a title that changes based on slicer selection.',
        code: `Dynamic Title = 
"Report for " & 
SELECTEDVALUE('Date'[Year], "All Years") & 
" - " & 
SELECTEDVALUE('Product'[Category], "All Categories")`,
        category: 'String Manipulation'
    },
    {
        id: 6,
        title: 'Pareto Analysis (80/20)',
        description: 'Calculate the cumulative percentage to identify top contributors.',
        code: `Pareto % = 
VAR TotalSales = CALCULATE([Total Sales], ALLSELECTED('Product'))
VAR CurrentSales = [Total Sales]
VAR CumulativeSales = 
    CALCULATE(
        [Total Sales],
        FILTER(
            ALLSELECTED('Product'),
            [Total Sales] >= CurrentSales
        )
    )
RETURN
DIVIDE(CumulativeSales, TotalSales)`,
        category: 'Advanced Analytics'
    }
];

// DAX Formatter
const formatDAX = (code) => {
    if (!code) return '';
    
    let formatted = code.trim();
    
    // Basic indentation for common patterns
    formatted = formatted.replace(/\s*=\s*/g, ' = ');
    formatted = formatted.replace(/\s*,\s*/g, ', ');
    formatted = formatted.replace(/\s*\(\s*/g, '(\n    ');
    formatted = formatted.replace(/\s*\)\s*/g, '\n)');
    
    // Indent CALCULATE, VAR, RETURN patterns
    const lines = formatted.split('\n');
    let indentLevel = 0;
    const indented = lines.map(line => {
        const trimmed = line.trim();
        if (trimmed.startsWith(')') || trimmed.startsWith('RETURN')) {
            indentLevel = Math.max(0, indentLevel - 1);
        }
        const indentedLine = '    '.repeat(indentLevel) + trimmed;
        if (trimmed.includes('(') && !trimmed.includes(')')) {
            indentLevel++;
        }
        if (trimmed.startsWith('VAR ') || trimmed.startsWith('RETURN ')) {
            indentLevel = Math.max(0, indentLevel - 1);
        }
        return indentedLine;
    });
    
    return indented.join('\n');
};

const validateDAX = (code) => {
    const errors = [];
    const warnings = [];
    
    // Check for matching parentheses
    const openParens = (code.match(/\(/g) || []).length;
    const closeParens = (code.match(/\)/g) || []).length;
    if (openParens !== closeParens) {
        errors.push(`Mismatched parentheses: ${openParens} open, ${closeParens} close`);
    }
    
    // Check for matching brackets
    const openBrackets = (code.match(/\[/g) || []).length;
    const closeBrackets = (code.match(/\]/g) || []).length;
    if (openBrackets !== closeBrackets) {
        errors.push(`Mismatched brackets: ${openBrackets} open, ${closeBrackets} close`);
    }
    
    // Check for common issues
    if (code.includes('=') && !code.includes(' = ')) {
        warnings.push('Consider adding spaces around = operator');
    }
    
    return { errors, warnings, isValid: errors.length === 0 };
};

const DAXLibrary = () => {
    const { addToast } = useToast();
    const [searchTerm, setSearchTerm] = useState('');
    const [copiedId, setCopiedId] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [daxInput, setDaxInput] = useState('');
    const [showFormatter, setShowFormatter] = useState(false);

    useEffect(() => {
        // Simulate loading time for better UX
        const timer = setTimeout(() => setIsLoading(false), 300);
        return () => clearTimeout(timer);
    }, []);

    const filteredPatterns = daxPatterns.filter(pattern => {
        const searchLower = searchTerm.toLowerCase();
        return pattern.title.toLowerCase().includes(searchLower) ||
               pattern.description.toLowerCase().includes(searchLower) ||
               pattern.category.toLowerCase().includes(searchLower);
    });

    const copyToClipboard = (code, id) => {
        navigator.clipboard.writeText(code);
        setCopiedId(id);
        addToast('DAX pattern copied to clipboard!', 'success');
        setTimeout(() => setCopiedId(null), 2000);
    };

    const formattedDAX = daxInput ? formatDAX(daxInput) : '';
    const validation = daxInput ? validateDAX(daxInput) : { errors: [], warnings: [], isValid: true };

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h2 className="text-2xl font-bold text-slate-900">DAX Pattern Library</h2>
                    <p className="text-slate-600">HHS & WebFirst approved metrics and patterns.</p>
                </div>
                <button
                    onClick={() => setShowFormatter(!showFormatter)}
                    className={`btn-secondary whitespace-nowrap flex-shrink-0 text-xs sm:text-sm ${showFormatter ? 'bg-brand-600 text-white' : ''}`}
                >
                    <Code className="h-4 w-4 sm:mr-2" />
                    <span className="hidden sm:inline">{showFormatter ? 'Hide' : 'Show'} Formatter</span>
                </button>
            </div>

            {/* DAX Formatter Section */}
            {showFormatter && (
                <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="card p-6 space-y-4"
                >
                    <div className="flex items-center gap-2 mb-4">
                        <Code className="h-5 w-5 text-brand-600" />
                        <h3 className="text-lg font-semibold text-slate-800">DAX Formatter & Validator</h3>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-semibold text-slate-700 mb-2">Paste DAX Code</label>
                            <textarea
                                value={daxInput}
                                onChange={(e) => setDaxInput(e.target.value)}
                                placeholder="Paste your DAX code here..."
                                className="w-full h-64 p-3 border border-slate-300 rounded-lg font-mono text-sm resize-none focus:ring-2 focus:ring-brand-500 focus:border-brand-500"
                            />
                            <div className="flex gap-2 mt-2">
                                <button
                                    onClick={() => {
                                        if (formattedDAX) {
                                            navigator.clipboard.writeText(formattedDAX);
                                            addToast('Formatted DAX copied!', 'success');
                                        }
                                    }}
                                    disabled={!formattedDAX}
                                    className="px-3 py-1 bg-brand-600 text-white rounded text-sm hover:bg-brand-700 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    Copy Formatted
                                </button>
                                <button
                                    onClick={() => setDaxInput('')}
                                    className="px-3 py-1 bg-slate-200 text-slate-700 rounded text-sm hover:bg-slate-300"
                                >
                                    Clear
                                </button>
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm font-semibold text-slate-700 mb-2">Formatted Output</label>
                            <div className="relative">
                                <pre className="w-full h-64 p-3 border border-slate-300 rounded-lg bg-slate-50 font-mono text-sm overflow-auto">
                                    <code className="text-slate-700">{formattedDAX || 'Formatted code will appear here...'}</code>
                                </pre>
                            </div>
                            {validation.errors.length > 0 && (
                                <div className="mt-2 p-3 bg-red-50 border border-red-200 rounded">
                                    <div className="flex items-center gap-2 text-red-700 font-semibold mb-1">
                                        <AlertCircle className="h-4 w-4" />
                                        Errors Found:
                                    </div>
                                    <ul className="text-xs text-red-600 space-y-1">
                                        {validation.errors.map((error, idx) => (
                                            <li key={idx}>• {error}</li>
                                        ))}
                                    </ul>
                                </div>
                            )}
                            {validation.warnings.length > 0 && (
                                <div className="mt-2 p-3 bg-yellow-50 border border-yellow-200 rounded">
                                    <div className="flex items-center gap-2 text-yellow-700 font-semibold mb-1">
                                        <AlertCircle className="h-4 w-4" />
                                        Warnings:
                                    </div>
                                    <ul className="text-xs text-yellow-600 space-y-1">
                                        {validation.warnings.map((warning, idx) => (
                                            <li key={idx}>• {warning}</li>
                                        ))}
                                    </ul>
                                </div>
                            )}
                            {validation.isValid && daxInput && validation.warnings.length === 0 && (
                                <div className="mt-2 p-3 bg-green-50 border border-green-200 rounded flex items-center gap-2 text-green-700">
                                    <CheckCircle className="h-4 w-4" />
                                    <span className="text-sm font-semibold">Code is valid!</span>
                                </div>
                            )}
                        </div>
                    </div>
                </motion.div>
            )}
            <div className="flex gap-2 sm:gap-3 w-full md:w-auto">
                <div className="relative flex-1 md:w-64">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 h-4 w-4" />
                        <input
                            type="text"
                            placeholder="Search patterns..."
                            className="input-field pl-10 text-sm"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    <button
                        onClick={() => addToast('Request submitted to Analytics Lead.', 'info')}
                        className="btn-secondary whitespace-nowrap flex-shrink-0 text-xs sm:text-sm"
                        title="Request a new DAX pattern"
                    >
                        <Database className="h-4 w-4 sm:mr-2" />
                        <span className="hidden xs:inline">Request</span>
                        <span className="hidden sm:inline">Pattern</span>
                    </button>
            </div>

            {isLoading ? (
                <SkeletonList items={6} className="grid grid-cols-1 gap-6" />
            ) : filteredPatterns.length > 0 ? (
                <div className="grid grid-cols-1 gap-6">
                    {filteredPatterns.map((pattern) => (
                        <motion.div
                            key={pattern.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="card group"
                        >
                            <div className="flex justify-between items-start mb-4">
                                <div>
                                    <div className="flex items-center gap-3 mb-1">
                                        <h3 className="text-lg font-semibold text-brand-700">
                                            {highlightText(pattern.title, searchTerm)}
                                        </h3>
                                        <span className="text-xs px-2 py-1 rounded-full bg-slate-100 text-slate-600 border border-slate-200">
                                            {highlightText(pattern.category, searchTerm)}
                                        </span>
                                    </div>
                                    <p className="text-sm text-slate-600">
                                        {highlightText(pattern.description, searchTerm)}
                                    </p>
                                </div>
                                <button
                                    onClick={() => copyToClipboard(pattern.code, pattern.id)}
                                    className="p-2 rounded-lg bg-slate-100 hover:bg-brand-600 text-slate-500 hover:text-white transition-colors duration-200 flex items-center justify-center h-9 w-9"
                                    title="Copy DAX"
                                >
                                    {copiedId === pattern.id ? <Check className="h-5 w-5" /> : <Copy className="h-5 w-5" />}
                                </button>
                            </div>
                            <div className="relative group">
                                <pre className="bg-slate-50 p-4 rounded-lg overflow-x-auto text-sm font-mono text-slate-700 border border-slate-200 group-hover:border-slate-300 transition-colors">
                                    <code>{pattern.code}</code>
                                </pre>
                            </div>
                        </motion.div>
                    ))}
                </div>
            ) : (
                <div className="text-center py-12 text-slate-400">
                    <Database className="h-12 w-12 mx-auto mb-3 opacity-20" />
                    <p>No patterns found for &ldquo;{searchTerm}&rdquo;</p>
                    <button 
                        onClick={() => setSearchTerm('')}
                        className="text-brand-600 font-medium hover:underline mt-2"
                    >
                        Clear search
                    </button>
                </div>
            )}
        </div>
    );
};

export default DAXLibrary;
