import React, { useState } from 'react';
import { Search, Copy, Check, BookOpen } from 'lucide-react';
import { motion } from 'framer-motion';
import { useToast } from '../context/ToastContext';

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

const DAXLibrary = () => {
    const { addToast } = useToast();
    const [searchTerm, setSearchTerm] = useState('');
    const [copiedId, setCopiedId] = useState(null);

    const filteredPatterns = daxPatterns.filter(pattern =>
        pattern.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        pattern.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        pattern.category.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const copyToClipboard = (code, id) => {
        navigator.clipboard.writeText(code);
        setCopiedId(id);
        addToast('DAX pattern copied to clipboard!', 'success');
        setTimeout(() => setCopiedId(null), 2000);
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h2 className="text-2xl font-bold text-slate-900">DAX Pattern Library</h2>
                    <p className="text-slate-600">HHS & WebFirst approved metrics and patterns.</p>
                </div>
                <div className="flex gap-3 w-full md:w-auto">
                    <div className="relative flex-1 md:w-64">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 h-4 w-4" />
                        <input
                            type="text"
                            placeholder="Search patterns..."
                            className="input-field pl-10"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    <button
                        onClick={() => addToast('Request submitted to Analytics Lead.', 'info')}
                        className="btn-secondary whitespace-nowrap"
                    >
                        Request Pattern
                    </button>
                </div>
            </div>

            {filteredPatterns.length > 0 ? (
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
                                        <h3 className="text-lg font-semibold text-brand-700">{pattern.title}</h3>
                                        <span className="text-xs px-2 py-1 rounded-full bg-slate-100 text-slate-600 border border-slate-200">
                                            {pattern.category}
                                        </span>
                                    </div>
                                    <p className="text-sm text-slate-600">{pattern.description}</p>
                                </div>
                                <button
                                    onClick={() => copyToClipboard(pattern.code, pattern.id)}
                                    className="p-2 rounded-lg bg-slate-100 hover:bg-brand-600 text-slate-500 hover:text-white transition-colors duration-200"
                                    title="Copy DAX"
                                >
                                    {copiedId === pattern.id ? <Check className="h-5 w-5" /> : <Copy className="h-5 w-5" />}
                                </button>
                            </div>
                            <div className="relative">
                                <pre className="bg-slate-50 p-4 rounded-lg overflow-x-auto text-sm font-mono text-slate-700 border border-slate-200">
                                    <code>{pattern.code}</code>
                                </pre>
                            </div>
                        </motion.div>
                    ))}
                </div>
            ) : (
                <div className="text-center py-12 text-slate-400">
                    <BookOpen className="h-12 w-12 mx-auto mb-3 opacity-20" />
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
