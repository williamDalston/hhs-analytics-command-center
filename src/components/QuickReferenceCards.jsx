import React, { useState } from 'react';
import { BookOpen, Download, Printer, Copy, Check } from 'lucide-react';
import { motion } from 'framer-motion';
import { useToast } from '../context/ToastContext';

const QuickReferenceCards = () => {
    const { addToast } = useToast();
    const [copiedCard, setCopiedCard] = useState(null);

    const cards = [
        {
            id: 'dax-functions',
            title: 'DAX Common Functions',
            content: `CALCULATE - Modify filter context
FILTER - Filter table expression
RELATED - Get related value from dimension
SUMX - Sum with row context
AVERAGEX - Average with row context
COUNTROWS - Count rows in table
DISTINCTCOUNT - Count unique values
DATEDIFF - Calculate date difference
DATEADD - Add/subtract dates
YEAR, MONTH, DAY - Extract date parts
IF - Conditional logic
SWITCH - Multiple conditions
VAR/RETURN - Variables
DIVIDE - Safe division (handles divide by zero)
BLANK - Return blank value
ISBLANK - Check if blank
FORMAT - Format numbers/dates
RELATEDTABLE - Get related table`
        },
        {
            id: 'm-syntax',
            title: 'Power Query M Syntax',
            content: `let
    Source = ...,
    Step1 = ...,
    Step2 = ...
in
    Step2

Table Functions:
• Table.SelectRows - Filter rows
• Table.AddColumn - Add calculated column
• Table.RemoveColumns - Remove columns
• Table.TransformColumnTypes - Change types
• Table.UnpivotColumns - Unpivot
• Table.Group - Group and aggregate
• Table.Join - Join tables

List Functions:
• List.Sum - Sum list
• List.Average - Average list
• List.Count - Count items
• List.Transform - Transform items

Text Functions:
• Text.Split - Split by delimiter
• Text.Combine - Join text
• Text.Upper/Lower - Case conversion
• Text.Trim - Remove whitespace`
        },
        {
            id: 'hhs-colors',
            title: 'HHS Color Palette',
            content: `Primary Blues:
#005ea2 - Primary Blue
#1a4480 - Primary Darker
#162e51 - Primary Darkest
#00bde3 - Primary Lighter

Accents:
#face00 - Yellow
#00a398 - Teal
#1dc2ae - Teal Lighter
#d54309 - Red

Neutrals:
#1c1d1f - Base Darkest
#565c65 - Base Dark
#f1f3f6 - Base Lighter
#ffffff - White

Light Accents:
#97d4ea - Blue Light
#ccecf2 - Blue Lighter
#e5faff - Blue Lightest
#f3966d - Orange Light`
        },
        {
            id: 'keyboard-shortcuts',
            title: 'Power BI Desktop Shortcuts',
            content: `Ctrl+N - New report
Ctrl+O - Open report
Ctrl+S - Save
F5 - Refresh data
Ctrl+E - Enter data
Ctrl+D - Duplicate visual
Delete - Delete selected
Ctrl+Z - Undo
Ctrl+Y - Redo
Ctrl+C - Copy
Ctrl+V - Paste
Ctrl+F - Find
F2 - Rename
Alt+Enter - New line in formula
Ctrl+Space - Auto-complete
F1 - Help
Ctrl+Shift+P - Performance analyzer`
        },
        {
            id: 'best-practices',
            title: 'Power BI Best Practices',
            content: `Data Model:
✓ Star schema (fact + dimensions)
✓ One-to-many relationships
✓ Remove unused columns/tables
✓ Set data types explicitly
✓ Use calculated measures (not columns)

Performance:
✓ Limit visuals per page (<10)
✓ Use query folding
✓ Disable auto date/time
✓ Use aggregations for large datasets
✓ Optimize DAX (avoid calculated columns)

Design:
✓ F-pattern layout (KPIs top-left)
✓ Group slicers together
✓ Consistent color scheme
✓ Alt text for all visuals
✓ WCAG AA contrast (4.5:1)

Accessibility:
✓ Meaningful alt text
✓ Logical tab order
✓ High contrast colors
✓ Keyboard navigation
✓ Screen reader friendly`
        },
        {
            id: 'dax-patterns',
            title: 'Common DAX Patterns',
            content: `Year-over-Year Growth:
VAR Current = [Measure]
VAR Previous = CALCULATE([Measure], 
    DATEADD('Date'[Date], -1, YEAR))
RETURN DIVIDE(Current - Previous, Previous)

Running Total:
CALCULATE([Measure],
    FILTER(ALL('Date'[Date]),
        'Date'[Date] <= MAX('Date'[Date])))

Top N:
TOPN(10, VALUES('Table'[Column]), [Measure])

Percentage of Total:
DIVIDE([Measure], 
    CALCULATE([Measure], ALL('Table')))

Previous Period:
CALCULATE([Measure],
    DATEADD('Date'[Date], -1, MONTH))

Moving Average:
AVERAGEX(DATESINPERIOD('Date'[Date],
    LASTDATE('Date'[Date]), -7, DAY), [Measure])`
        }
    ];

    const printCard = (card) => {
        const printWindow = window.open('', '_blank');
        printWindow.document.write(`
            <html>
                <head>
                    <title>${card.title}</title>
                    <style>
                        body { font-family: Arial, sans-serif; padding: 20px; }
                        h1 { color: #005ea2; border-bottom: 2px solid #005ea2; padding-bottom: 10px; }
                        pre { background: #f1f3f6; padding: 15px; border-radius: 5px; white-space: pre-wrap; font-size: 12px; line-height: 1.6; }
                        @media print { body { margin: 0; } }
                    </style>
                </head>
                <body>
                    <h1>${card.title}</h1>
                    <pre>${card.content}</pre>
                </body>
            </html>
        `);
        printWindow.document.close();
        printWindow.print();
    };

    const copyCard = (card) => {
        navigator.clipboard.writeText(`${card.title}\n\n${card.content}`);
        setCopiedCard(card.id);
        addToast(`${card.title} copied to clipboard!`, 'success');
        setTimeout(() => setCopiedCard(null), 2000);
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h2 className="text-2xl font-bold text-slate-900">Quick Reference Cards</h2>
                    <p className="text-slate-600">Printable cheat sheets for Power BI development.</p>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {cards.map((card) => (
                    <motion.div
                        key={card.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="card group"
                    >
                        <div className="flex justify-between items-start mb-4">
                            <h3 className="text-lg font-semibold text-brand-700">{card.title}</h3>
                            <div className="flex gap-2">
                                <button
                                    onClick={() => copyCard(card)}
                                    className="p-2 rounded-lg bg-slate-100 hover:bg-brand-600 text-slate-500 hover:text-white transition-colors"
                                    title="Copy"
                                >
                                    {copiedCard === card.id ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                                </button>
                                <button
                                    onClick={() => printCard(card)}
                                    className="p-2 rounded-lg bg-slate-100 hover:bg-brand-600 text-slate-500 hover:text-white transition-colors"
                                    title="Print"
                                >
                                    <Printer className="h-4 w-4" />
                                </button>
                            </div>
                        </div>
                        <pre className="bg-slate-50 p-4 rounded-lg overflow-x-auto text-xs font-mono text-slate-700 border border-slate-200 whitespace-pre-wrap">
                            {card.content}
                        </pre>
                    </motion.div>
                ))}
            </div>

            <div className="card p-6 bg-brand-50 border-brand-200">
                <div className="flex items-center gap-3 mb-3">
                    <BookOpen className="h-5 w-5 text-brand-600" />
                    <h3 className="text-lg font-semibold text-slate-800">Printing Tips</h3>
                </div>
                <ul className="text-sm text-slate-700 space-y-2">
                    <li>• Click the print icon on any card to print it individually</li>
                    <li>• Use your browser's print dialog (Ctrl/Cmd+P) to print all cards</li>
                    <li>• Select "More settings" → "Background graphics" to include colors</li>
                    <li>• Cards are optimized for 8.5" x 11" paper</li>
                    <li>• Copy cards to clipboard for quick reference while coding</li>
                </ul>
            </div>
        </div>
    );
};

export default QuickReferenceCards;

