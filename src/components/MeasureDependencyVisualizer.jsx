import React, { useState } from 'react';
import { GitBranch, AlertTriangle, Info, Copy, Check } from 'lucide-react';
import { motion } from 'framer-motion';
import { useToast } from '../context/ToastContext';

const MeasureDependencyVisualizer = () => {
    const { addToast } = useToast();
    const [daxInput, setDaxInput] = useState('');
    const [dependencies, setDependencies] = useState([]);
    const [circularDeps, setCircularDeps] = useState([]);
    const [copied, setCopied] = useState(false);

    const parseDAXMeasures = (input) => {
        const measures = [];
        const measureRegex = /(\w+)\s*=\s*([^=]+)/g;
        let match;

        while ((match = measureRegex.exec(input)) !== null) {
            const measureName = match[1].trim();
            const measureBody = match[2].trim();
            
            // Find references to other measures (anything in brackets that's not a table/column reference)
            const references = [];
            const refRegex = /\[([^\]]+)\]/g;
            let refMatch;
            
            while ((refMatch = refRegex.exec(measureBody)) !== null) {
                const ref = refMatch[1];
                // Check if it's a measure reference (not a table.column pattern)
                if (!ref.includes('.')) {
                    references.push(ref);
                }
            }
            
            measures.push({
                name: measureName,
                body: measureBody,
                references: [...new Set(references)] // Remove duplicates
            });
        }
        
        return measures;
    };

    const detectCircularDependencies = (measures) => {
        const circular = [];
        const visited = new Set();
        const recursionStack = new Set();

        const hasCycle = (measureName, path) => {
            if (recursionStack.has(measureName)) {
                circular.push([...path, measureName]);
                return true;
            }
            
            if (visited.has(measureName)) {
                return false;
            }

            visited.add(measureName);
            recursionStack.add(measureName);
            
            const measure = measures.find(m => m.name === measureName);
            if (measure) {
                measure.references.forEach(ref => {
                    hasCycle(ref, [...path, measureName]);
                });
            }
            
            recursionStack.delete(measureName);
            return false;
        };

        measures.forEach(measure => {
            if (!visited.has(measure.name)) {
                hasCycle(measure.name, []);
            }
        });

        return circular;
    };

    const analyzeMeasures = () => {
        if (!daxInput.trim()) {
            addToast('Please enter DAX measures to analyze', 'error');
            return;
        }

        const parsed = parseDAXMeasures(daxInput);
        if (parsed.length === 0) {
            addToast('No measures found. Format: MeasureName = DAX expression', 'error');
            return;
        }

        setDependencies(parsed);
        const circular = detectCircularDependencies(parsed);
        setCircularDeps(circular);
        
        if (circular.length > 0) {
            addToast(`Found ${circular.length} circular dependency chain(s)`, 'warning');
        } else {
            addToast(`Analyzed ${parsed.length} measure(s) - No circular dependencies found`, 'success');
        }
    };

    const copyDependencyGraph = () => {
        if (dependencies.length === 0) return;
        
        const graphText = dependencies.map(m => {
            const refs = m.references.length > 0 ? m.references.join(', ') : 'none';
            return `${m.name} → [${refs}]`;
        }).join('\n');
        
        navigator.clipboard.writeText(graphText);
        setCopied(true);
        addToast('Dependency graph copied!', 'success');
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h2 className="text-2xl font-bold text-slate-900">Measure Dependency Visualizer</h2>
                    <p className="text-slate-600">Analyze DAX measure dependencies and detect circular references.</p>
                </div>
            </div>

            <div className="card p-6 space-y-4">
                <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">
                        Paste DAX Measures
                    </label>
                    <textarea
                        value={daxInput}
                        onChange={(e) => setDaxInput(e.target.value)}
                        placeholder={`Example:
Total Sales = SUM(Sales[Amount])
Avg Sales = DIVIDE([Total Sales], COUNTROWS(Sales))
Growth % = DIVIDE([Total Sales] - [Previous Sales], [Previous Sales])
Previous Sales = CALCULATE([Total Sales], DATEADD('Date'[Date], -1, MONTH))`}
                        className="w-full h-48 p-3 border border-slate-300 rounded-lg font-mono text-sm resize-none focus:ring-2 focus:ring-brand-500 focus:border-brand-500"
                    />
                    <p className="text-xs text-slate-500 mt-1">
                        Enter measures in format: MeasureName = DAX expression
                    </p>
                </div>
                <button
                    onClick={analyzeMeasures}
                    className="px-4 py-2 bg-brand-600 hover:bg-brand-700 text-white rounded-lg font-semibold transition-colors w-full sm:w-auto flex items-center justify-center"
                >
                    <GitBranch className="h-4 w-4 mr-2" />
                    Analyze Dependencies
                </button>
            </div>

            {circularDeps.length > 0 && (
                <div className="card p-6 bg-red-50 border-red-200">
                    <div className="flex items-center gap-2 mb-3">
                        <AlertTriangle className="h-5 w-5 text-red-600" />
                        <h3 className="font-semibold text-red-800">Circular Dependencies Detected</h3>
                    </div>
                    <div className="space-y-2">
                        {circularDeps.map((cycle, idx) => (
                            <div key={idx} className="text-sm text-red-700 font-mono bg-white p-3 rounded border border-red-200">
                                {cycle.join(' → ')} → (circular)
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {dependencies.length > 0 && (
                <div className="space-y-4">
                    <div className="flex items-center justify-between">
                        <h3 className="text-lg font-semibold text-slate-800">Dependency Graph</h3>
                        <button
                            onClick={copyDependencyGraph}
                            className="px-3 py-1 bg-slate-100 hover:bg-slate-200 rounded text-sm flex items-center gap-2"
                        >
                            {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                            Copy Graph
                        </button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {dependencies.map((measure, idx) => (
                            <motion.div
                                key={idx}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="card p-4"
                            >
                                <div className="flex items-start justify-between mb-2">
                                    <h4 className="font-semibold text-brand-700 font-mono">{measure.name}</h4>
                                    <span className="text-xs px-2 py-1 bg-slate-100 rounded">
                                        {measure.references.length} ref{measure.references.length !== 1 ? 's' : ''}
                                    </span>
                                </div>
                                {measure.references.length > 0 ? (
                                    <div className="space-y-1">
                                        <p className="text-xs text-slate-600 mb-1">Depends on:</p>
                                        <div className="flex flex-wrap gap-1">
                                            {measure.references.map((ref, refIdx) => (
                                                <span
                                                    key={refIdx}
                                                    className="text-xs px-2 py-1 bg-brand-100 text-brand-700 rounded font-mono"
                                                >
                                                    {ref}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                ) : (
                                    <p className="text-xs text-slate-500 italic">No dependencies</p>
                                )}
                            </motion.div>
                        ))}
                    </div>
                </div>
            )}

            <div className="card p-6 bg-blue-50 border-blue-200">
                <div className="flex items-start gap-3">
                    <Info className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
                    <div>
                        <h3 className="font-semibold text-slate-800 mb-2">How It Works</h3>
                        <ul className="text-sm text-slate-700 space-y-1">
                            <li>• Parses DAX measures from your input</li>
                            <li>• Identifies measure references (text in brackets)</li>
                            <li>• Detects circular dependencies that can cause errors</li>
                            <li>• Visualizes the dependency graph</li>
                            <li>• Helps refactor measures safely</li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MeasureDependencyVisualizer;

