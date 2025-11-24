import React, { useState } from 'react';
import { Database, CheckCircle, XCircle, AlertTriangle, Info } from 'lucide-react';
import { motion } from 'framer-motion';
import { useToast } from '../context/ToastContext';

const DataModelValidator = () => {
    const { addToast } = useToast();
    const [modelInput, setModelInput] = useState('');
    const [validationResults, setValidationResults] = useState(null);

    const parseModelInput = (input) => {
        try {
            return JSON.parse(input);
        } catch {
            // Try to parse as simple text format
            const lines = input.split('\n').filter(l => l.trim());
            const tables = [];
            let currentTable = null;

            lines.forEach(line => {
                const trimmed = line.trim();
                if (trimmed.startsWith('Table:') || trimmed.startsWith('Table ')) {
                    if (currentTable) tables.push(currentTable);
                    currentTable = {
                        name: trimmed.replace(/^Table:?\s*/, '').trim(),
                        columns: [],
                        isFact: false
                    };
                } else if (trimmed.startsWith('Fact:')) {
                    if (currentTable) currentTable.isFact = true;
                } else if (trimmed.startsWith('Dim:') || trimmed.startsWith('Dimension:')) {
                    if (currentTable) currentTable.isFact = false;
                } else if (trimmed && currentTable && trimmed.includes(':')) {
                    const [name, type] = trimmed.split(':').map(s => s.trim());
                    currentTable.columns.push({ name, type });
                }
            });
            if (currentTable) tables.push(currentTable);

            return { tables };
        }
    };

    const validateModel = () => {
        if (!modelInput.trim()) {
            addToast('Please enter model structure', 'error');
            return;
        }

        const model = parseModelInput(modelInput);
        if (!model || !model.tables || model.tables.length === 0) {
            addToast('Could not parse model. Use JSON or text format.', 'error');
            return;
        }

        const results = {
            isValid: true,
            errors: [],
            warnings: [],
            facts: [],
            dimensions: [],
            relationships: []
        };

        // Identify fact and dimension tables
        model.tables.forEach(table => {
            if (table.isFact) {
                results.facts.push(table);
            } else {
                results.dimensions.push(table);
            }
        });

        // Validation rules
        if (results.facts.length === 0) {
            results.errors.push('No fact tables found. Star schema requires at least one fact table.');
            results.isValid = false;
        }

        if (results.facts.length > 3) {
            results.warnings.push(`Multiple fact tables (${results.facts.length}) detected. Consider if this is a snowflake schema.`);
        }

        if (results.dimensions.length === 0) {
            results.warnings.push('No dimension tables found. Star schema typically has multiple dimensions.');
        }

        // Check for many-to-many relationships (if relationships are provided)
        if (model.relationships) {
            model.relationships.forEach(rel => {
                if (rel.cardinality === 'many-to-many') {
                    results.errors.push(`Many-to-many relationship detected: ${rel.from} → ${rel.to}. Use bridge tables instead.`);
                    results.isValid = false;
                }
            });
        }

        // Check for high-cardinality columns
        model.tables.forEach(table => {
            table.columns?.forEach(col => {
                if (col.cardinality && col.cardinality > 1000000) {
                    results.warnings.push(`High-cardinality column detected: ${table.name}.${col.name} (${col.cardinality} unique values). This may impact performance.`);
                }
            });
        });

        // Check for missing relationships
        if (results.facts.length > 0 && results.dimensions.length > 0 && !model.relationships) {
            results.warnings.push('No relationships defined. Ensure fact tables are connected to dimension tables.');
        }

        setValidationResults(results);
        
        if (results.isValid && results.errors.length === 0) {
            addToast('Model validation passed!', 'success');
        } else {
            addToast(`Validation complete: ${results.errors.length} error(s), ${results.warnings.length} warning(s)`, 'warning');
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h2 className="text-2xl font-bold text-slate-900">Data Model Validator</h2>
                    <p className="text-slate-600">Validate Power BI data model for star schema compliance.</p>
                </div>
            </div>

            <div className="card p-6 space-y-4">
                <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">
                        Model Structure (JSON or Text Format)
                    </label>
                    <textarea
                        value={modelInput}
                        onChange={(e) => setModelInput(e.target.value)}
                        placeholder={`JSON Format:
{
  "tables": [
    {"name": "FactSales", "isFact": true, "columns": [...]},
    {"name": "DimDate", "isFact": false, "columns": [...]}
  ],
  "relationships": [...]
}

OR Text Format:
Table: FactSales
Fact:
  OrderID: number
  DateID: number
  Amount: number

Table: DimDate
Dim:
  DateID: number
  Date: date
  Year: number`}
                        className="w-full h-64 p-3 border border-slate-300 rounded-lg font-mono text-sm resize-none focus:ring-2 focus:ring-brand-500 focus:border-brand-500"
                    />
                </div>
                <button
                    onClick={validateModel}
                    className="px-4 py-2 bg-brand-600 hover:bg-brand-700 text-white rounded-lg font-semibold transition-colors w-full sm:w-auto flex items-center justify-center"
                >
                    <Database className="h-4 w-4 mr-2" />
                    Validate Model
                </button>
            </div>

            {validationResults && (
                <div className="space-y-4">
                    {/* Summary */}
                    <div className={`card p-6 ${
                        validationResults.isValid && validationResults.errors.length === 0
                            ? 'bg-green-50 border-green-200'
                            : 'bg-yellow-50 border-yellow-200'
                    }`}>
                        <div className="flex items-center gap-3 mb-4">
                            {validationResults.isValid && validationResults.errors.length === 0 ? (
                                <CheckCircle className="h-6 w-6 text-green-600" />
                            ) : (
                                <AlertTriangle className="h-6 w-6 text-yellow-600" />
                            )}
                            <div>
                                <h3 className="font-semibold text-slate-800">Validation Summary</h3>
                                <p className="text-sm text-slate-600">
                                    {validationResults.facts.length} fact table(s), {validationResults.dimensions.length} dimension table(s)
                                </p>
                            </div>
                        </div>
                        <div className="grid grid-cols-3 gap-4 text-center">
                            <div>
                                <div className="text-2xl font-bold text-slate-800">{validationResults.errors.length}</div>
                                <div className="text-xs text-slate-600">Errors</div>
                            </div>
                            <div>
                                <div className="text-2xl font-bold text-slate-800">{validationResults.warnings.length}</div>
                                <div className="text-xs text-slate-600">Warnings</div>
                            </div>
                            <div>
                                <div className="text-2xl font-bold text-green-600">{validationResults.facts.length + validationResults.dimensions.length}</div>
                                <div className="text-xs text-slate-600">Tables</div>
                            </div>
                        </div>
                    </div>

                    {/* Errors */}
                    {validationResults.errors.length > 0 && (
                        <div className="card p-6 bg-red-50 border-red-200">
                            <div className="flex items-center gap-2 mb-3">
                                <XCircle className="h-5 w-5 text-red-600" />
                                <h3 className="font-semibold text-red-800">Errors</h3>
                            </div>
                            <ul className="space-y-2">
                                {validationResults.errors.map((error, idx) => (
                                    <li key={idx} className="text-sm text-red-700 flex items-start gap-2">
                                        <span className="text-red-600 mt-0.5">•</span>
                                        <span>{error}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}

                    {/* Warnings */}
                    {validationResults.warnings.length > 0 && (
                        <div className="card p-6 bg-yellow-50 border-yellow-200">
                            <div className="flex items-center gap-2 mb-3">
                                <AlertTriangle className="h-5 w-5 text-yellow-600" />
                                <h3 className="font-semibold text-yellow-800">Warnings</h3>
                            </div>
                            <ul className="space-y-2">
                                {validationResults.warnings.map((warning, idx) => (
                                    <li key={idx} className="text-sm text-yellow-700 flex items-start gap-2">
                                        <span className="text-yellow-600 mt-0.5">•</span>
                                        <span>{warning}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}

                    {/* Table List */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {validationResults.facts.length > 0 && (
                            <div className="card p-4">
                                <h4 className="font-semibold text-slate-800 mb-3">Fact Tables</h4>
                                <div className="space-y-2">
                                    {validationResults.facts.map((table, idx) => (
                                        <div key={idx} className="text-sm font-mono text-brand-700 bg-brand-50 p-2 rounded">
                                            {table.name}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                        {validationResults.dimensions.length > 0 && (
                            <div className="card p-4">
                                <h4 className="font-semibold text-slate-800 mb-3">Dimension Tables</h4>
                                <div className="space-y-2">
                                    {validationResults.dimensions.map((table, idx) => (
                                        <div key={idx} className="text-sm font-mono text-slate-700 bg-slate-50 p-2 rounded">
                                            {table.name}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            )}

            <div className="card p-6 bg-blue-50 border-blue-200">
                <div className="flex items-start gap-3">
                    <Info className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
                    <div>
                        <h3 className="font-semibold text-slate-800 mb-2">Star Schema Best Practices</h3>
                        <ul className="text-sm text-slate-700 space-y-1">
                            <li>• One or more fact tables (transactional data)</li>
                            <li>• Multiple dimension tables (descriptive attributes)</li>
                            <li>• One-to-many relationships (fact → dimension)</li>
                            <li>• Avoid many-to-many relationships</li>
                            <li>• Limit high-cardinality columns</li>
                            <li>• Use surrogate keys for relationships</li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DataModelValidator;

