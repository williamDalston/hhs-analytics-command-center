import React, { useState } from 'react';
import { GitCompare, Upload, FileText, AlertCircle, CheckCircle, XCircle, Info } from 'lucide-react';
import { motion } from 'framer-motion';
import { useToast } from '../context/ToastContext';

const ReportComparisonTool = () => {
    const { addToast } = useToast();
    const [report1, setReport1] = useState('');
    const [report2, setReport2] = useState('');
    const [comparison, setComparison] = useState(null);

    const parseReportSpec = (input) => {
        try {
            return JSON.parse(input);
        } catch {
            return null;
        }
    };

    const compareReports = () => {
        if (!report1.trim() || !report2.trim()) {
            addToast('Please provide both report specifications', 'error');
            return;
        }

        const spec1 = parseReportSpec(report1);
        const spec2 = parseReportSpec(report2);

        if (!spec1 || !spec2) {
            addToast('Invalid JSON format. Use exported report specifications.', 'error');
            return;
        }

        const differences = {
            metadata: [],
            branding: [],
            layout: [],
            powerBI: []
        };

        // Compare metadata
        if (spec1.metadata?.layout !== spec2.metadata?.layout) {
            differences.metadata.push({
                field: 'Layout Type',
                old: spec1.metadata?.layout,
                new: spec2.metadata?.layout
            });
        }
        if (spec1.metadata?.dimensions?.width !== spec2.metadata?.dimensions?.width ||
            spec1.metadata?.dimensions?.height !== spec2.metadata?.dimensions?.height) {
            differences.metadata.push({
                field: 'Dimensions',
                old: `${spec1.metadata?.dimensions?.width}×${spec1.metadata?.dimensions?.height}`,
                new: `${spec2.metadata?.dimensions?.width}×${spec2.metadata?.dimensions?.height}`
            });
        }

        // Compare branding
        if (spec1.branding?.trustBar?.enabled !== spec2.branding?.trustBar?.enabled) {
            differences.branding.push({
                field: 'Trust Bar',
                old: spec1.branding?.trustBar?.enabled ? 'Enabled' : 'Disabled',
                new: spec2.branding?.trustBar?.enabled ? 'Enabled' : 'Disabled'
            });
        }
        if (spec1.branding?.header?.height !== spec2.branding?.header?.height) {
            differences.branding.push({
                field: 'Header Height',
                old: `${spec1.branding?.header?.height}px`,
                new: `${spec2.branding?.header?.height}px`
            });
        }
        if (spec1.branding?.colors?.background !== spec2.branding?.colors?.background) {
            differences.branding.push({
                field: 'Background Color',
                old: spec1.branding?.colors?.background,
                new: spec2.branding?.colors?.background
            });
        }
        if (spec1.branding?.colors?.accent !== spec2.branding?.colors?.accent) {
            differences.branding.push({
                field: 'Accent Color',
                old: spec1.branding?.colors?.accent,
                new: spec2.branding?.colors?.accent
            });
        }

        // Compare layout
        const visualCount1 = spec1.layout?.visualAreas?.length || 0;
        const visualCount2 = spec2.layout?.visualAreas?.length || 0;
        if (visualCount1 !== visualCount2) {
            differences.layout.push({
                field: 'Visual Count',
                old: `${visualCount1} visuals`,
                new: `${visualCount2} visuals`
            });
        }

        if (spec1.layout?.slicerZone?.enabled !== spec2.layout?.slicerZone?.enabled) {
            differences.layout.push({
                field: 'Slicer Zone',
                old: spec1.layout?.slicerZone?.enabled ? 'Enabled' : 'Disabled',
                new: spec2.layout?.slicerZone?.enabled ? 'Enabled' : 'Disabled'
            });
        }

        // Compare Power BI recommendations
        const visualCount1Rec = spec1.powerBI?.recommendations?.currentVisualCount || 0;
        const visualCount2Rec = spec2.powerBI?.recommendations?.currentVisualCount || 0;
        if (visualCount1Rec !== visualCount2Rec) {
            differences.powerBI.push({
                field: 'Visual Count',
                old: `${visualCount1Rec} visuals`,
                new: `${visualCount2Rec} visuals`
            });
        }

        const totalDifferences = Object.values(differences).flat().length;
        setComparison({
            differences,
            totalDifferences,
            report1Name: spec1.metadata?.title || 'Report 1',
            report2Name: spec2.metadata?.title || 'Report 2'
        });

        if (totalDifferences === 0) {
            addToast('Reports are identical!', 'success');
        } else {
            addToast(`Found ${totalDifferences} difference(s)`, 'info');
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h2 className="text-2xl font-bold text-slate-900">Report Comparison Tool</h2>
                    <p className="text-slate-600">Compare two Power BI report specifications to identify differences.</p>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="card p-6 space-y-4">
                    <div className="flex items-center gap-2">
                        <FileText className="h-5 w-5 text-brand-600" />
                        <h3 className="font-semibold text-slate-800">Report 1</h3>
                    </div>
                    <textarea
                        value={report1}
                        onChange={(e) => setReport1(e.target.value)}
                        placeholder="Paste first report specification (JSON)..."
                        className="w-full h-64 p-3 border border-slate-300 rounded-lg font-mono text-xs resize-none focus:ring-2 focus:ring-brand-500 focus:border-brand-500"
                    />
                    <p className="text-xs text-slate-500">
                        Export report specs from the SVG Generator to compare
                    </p>
                </div>
                <div className="card p-6 space-y-4">
                    <div className="flex items-center gap-2">
                        <FileText className="h-5 w-5 text-brand-600" />
                        <h3 className="font-semibold text-slate-800">Report 2</h3>
                    </div>
                    <textarea
                        value={report2}
                        onChange={(e) => setReport2(e.target.value)}
                        placeholder="Paste second report specification (JSON)..."
                        className="w-full h-64 p-3 border border-slate-300 rounded-lg font-mono text-xs resize-none focus:ring-2 focus:ring-brand-500 focus:border-brand-500"
                    />
                    <p className="text-xs text-slate-500">
                        Export report specs from the SVG Generator to compare
                    </p>
                </div>
            </div>

            <div className="flex justify-center">
                <button
                    onClick={compareReports}
                    className="px-4 py-2 bg-brand-600 hover:bg-brand-700 text-white rounded-lg font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                    disabled={!report1.trim() || !report2.trim()}
                >
                    <GitCompare className="h-4 w-4 mr-2" />
                    Compare Reports
                </button>
            </div>

            {comparison && (
                <div className="space-y-4">
                    <div className={`card p-6 ${
                        comparison.totalDifferences === 0
                            ? 'bg-green-50 border-green-200'
                            : 'bg-yellow-50 border-yellow-200'
                    }`}>
                        <div className="flex items-center gap-3 mb-4">
                            {comparison.totalDifferences === 0 ? (
                                <CheckCircle className="h-6 w-6 text-green-600" />
                            ) : (
                                <AlertCircle className="h-6 w-6 text-yellow-600" />
                            )}
                            <div>
                                <h3 className="font-semibold text-slate-800">Comparison Results</h3>
                                <p className="text-sm text-slate-600">
                                    {comparison.report1Name} vs {comparison.report2Name}
                                </p>
                            </div>
                        </div>
                        <div className="text-center">
                            <div className="text-3xl font-bold text-slate-800 mb-1">
                                {comparison.totalDifferences}
                            </div>
                            <div className="text-sm text-slate-600">
                                {comparison.totalDifferences === 0 ? 'No differences found' : 'Difference(s) detected'}
                            </div>
                        </div>
                    </div>

                    {comparison.totalDifferences > 0 && (
                        <div className="space-y-4">
                            {comparison.differences.metadata.length > 0 && (
                                <div className="card p-6">
                                    <h4 className="font-semibold text-slate-800 mb-3">Metadata Differences</h4>
                                    <div className="space-y-2">
                                        {comparison.differences.metadata.map((diff, idx) => (
                                            <div key={idx} className="flex items-center gap-4 p-3 bg-slate-50 rounded">
                                                <span className="font-medium text-slate-700 w-32">{diff.field}:</span>
                                                <span className="text-sm text-red-600 line-through">{diff.old}</span>
                                                <span className="text-slate-400">→</span>
                                                <span className="text-sm text-green-600 font-semibold">{diff.new}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {comparison.differences.branding.length > 0 && (
                                <div className="card p-6">
                                    <h4 className="font-semibold text-slate-800 mb-3">Branding Differences</h4>
                                    <div className="space-y-2">
                                        {comparison.differences.branding.map((diff, idx) => (
                                            <div key={idx} className="flex items-center gap-4 p-3 bg-slate-50 rounded">
                                                <span className="font-medium text-slate-700 w-32">{diff.field}:</span>
                                                <span className="text-sm text-red-600 line-through">{diff.old}</span>
                                                <span className="text-slate-400">→</span>
                                                <span className="text-sm text-green-600 font-semibold">{diff.new}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {comparison.differences.layout.length > 0 && (
                                <div className="card p-6">
                                    <h4 className="font-semibold text-slate-800 mb-3">Layout Differences</h4>
                                    <div className="space-y-2">
                                        {comparison.differences.layout.map((diff, idx) => (
                                            <div key={idx} className="flex items-center gap-4 p-3 bg-slate-50 rounded">
                                                <span className="font-medium text-slate-700 w-32">{diff.field}:</span>
                                                <span className="text-sm text-red-600 line-through">{diff.old}</span>
                                                <span className="text-slate-400">→</span>
                                                <span className="text-sm text-green-600 font-semibold">{diff.new}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            )}

            <div className="card p-6 bg-blue-50 border-blue-200">
                <div className="flex items-start gap-3">
                    <Info className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
                    <div>
                        <h3 className="font-semibold text-slate-800 mb-2">How to Use</h3>
                        <ol className="text-sm text-slate-700 space-y-1 list-decimal list-inside">
                            <li>Generate report specifications using the SVG Generator</li>
                            <li>Export the JSON specification for both reports</li>
                            <li>Paste the JSON specifications into the comparison tool</li>
                            <li>Click "Compare Reports" to see differences</li>
                            <li>Use this to track changes between report versions</li>
                        </ol>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ReportComparisonTool;

