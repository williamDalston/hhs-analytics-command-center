import React, { useState, useEffect } from 'react';
import { Search, Copy, Check, Database, Code } from 'lucide-react';
import { motion } from 'framer-motion';
import { useToast } from '../context/ToastContext';
import { SkeletonList } from './Skeleton';

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

const mPatterns = [
    {
        id: 1,
        title: 'Unpivot Columns',
        description: 'Transform wide data (columns) into tall data (rows) for star schema.',
        code: `let
    Source = Excel.CurrentWorkbook(){[Name="Table1"]}[Content],
    UnpivotedColumns = Table.UnpivotOtherColumns(Source, {"ID"}, "Attribute", "Value")
in
    UnpivotedColumns`,
        category: 'Data Transformation'
    },
    {
        id: 2,
        title: 'Split Column by Delimiter',
        description: 'Split a column containing delimited values into multiple columns.',
        code: `let
    Source = YourTable,
    SplitColumn = Table.SplitColumn(Source, "FullName", Splitter.SplitTextByDelimiter(" ", QuoteStyle.Csv), {"FirstName", "LastName"})
in
    SplitColumn`,
        category: 'Data Transformation'
    },
    {
        id: 3,
        title: 'Change Data Types',
        description: 'Explicitly set data types for all columns (best practice).',
        code: `let
    Source = YourTable,
    ChangedType = Table.TransformColumnTypes(Source,{{"DateColumn", type date}, {"NumberColumn", type number}, {"TextColumn", type text}})
in
    ChangedType`,
        category: 'Data Transformation'
    },
    {
        id: 4,
        title: 'Remove Top/Bottom Rows',
        description: 'Remove header rows or footer rows from imported data.',
        code: `let
    Source = YourTable,
    RemovedTopRows = Table.Skip(Source, 2),
    RemovedBottomRows = Table.RemoveLastN(RemovedTopRows, 1)
in
    RemovedBottomRows`,
        category: 'Data Cleaning'
    },
    {
        id: 5,
        title: 'Filter Rows',
        description: 'Filter rows based on conditions (remove nulls, filter by date, etc.).',
        code: `let
    Source = YourTable,
    FilteredRows = Table.SelectRows(Source, each [Status] = "Active" and [Date] >= #date(2024, 1, 1))
in
    FilteredRows`,
        category: 'Data Cleaning'
    },
    {
        id: 6,
        title: 'REST API Call',
        description: 'Connect to REST API and parse JSON response.',
        code: `let
    url = "https://api.example.com/data",
    Options = [Headers=[#"Authorization"="Bearer " & apiKey]],
    Response = Web.Contents(url, Options),
    JsonData = Json.Document(Response),
    ToTable = Table.FromRecords(JsonData[data])
in
    ToTable`,
        category: 'API Connections'
    },
    {
        id: 7,
        title: 'API Pagination',
        description: 'Handle paginated API responses using List.Generate.',
        code: `let
    BaseUrl = "https://api.example.com/data?page=",
    GetPage = (pageNum) => Json.Document(Web.Contents(BaseUrl & Number.ToText(pageNum))),
    AllPages = List.Generate(
        () => [Page = 1, Data = GetPage(1)],
        each [Data][hasMore] = true,
        each [Page = [Page] + 1, Data = GetPage([Page] + 1)],
        each [Data][items]
    ),
    ToTable = Table.FromList(AllPages, Splitter.SplitByNothing(), null, null, ExtraValues.Error)
in
    ToTable`,
        category: 'API Connections'
    },
    {
        id: 8,
        title: 'Add Custom Column (Conditional)',
        description: 'Add calculated column with IF logic.',
        code: `let
    Source = YourTable,
    AddedCustom = Table.AddColumn(Source, "Category", each if [Value] > 100 then "High" else "Low")
in
    AddedCustom`,
        category: 'Calculations'
    },
    {
        id: 9,
        title: 'Group and Aggregate',
        description: 'Group rows and calculate aggregations (SUM, COUNT, etc.).',
        code: `let
    Source = YourTable,
    GroupedRows = Table.Group(Source, {"Category"}, {{"Total", each List.Sum([Amount]), type number}, {"Count", each Table.RowCount(_), type number}})
in
    GroupedRows`,
        category: 'Aggregations'
    },
    {
        id: 10,
        title: 'Merge Queries (Left Join)',
        description: 'Join two tables using left join pattern.',
        code: `let
    Source = Table.NestedJoin(Table1, {"ID"}, Table2, {"ID"}, "Joined", JoinKind.LeftOuter),
    Expanded = Table.ExpandTableColumn(Source, "Joined", {"Column1", "Column2"})
in
    Expanded`,
        category: 'Joins'
    },
    {
        id: 11,
        title: 'Parameter for Server/Database',
        description: 'Use parameters for dynamic connection strings (Dev/Prod switching).',
        code: `let
    ServerName = ServerParam,
    DatabaseName = DatabaseParam,
    Source = Sql.Database(ServerName, DatabaseName),
    Table = Source{[Schema="dbo",Item="YourTable"]}[Data]
in
    Table`,
        category: 'Best Practices'
    },
    {
        id: 12,
        title: 'Error Handling',
        description: 'Handle errors gracefully with try/otherwise pattern.',
        code: `let
    Source = YourTable,
    SafeDivision = Table.AddColumn(Source, "Ratio", each try [A] / [B] otherwise 0)
in
    SafeDivision`,
        category: 'Error Handling'
    }
];

const PowerQueryLibrary = () => {
    const { addToast } = useToast();
    const [searchTerm, setSearchTerm] = useState('');
    const [copiedId, setCopiedId] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [selectedCategory, setSelectedCategory] = useState('all');

    useEffect(() => {
        const timer = setTimeout(() => setIsLoading(false), 300);
        return () => clearTimeout(timer);
    }, []);

    const categories = ['all', 'Data Transformation', 'Data Cleaning', 'API Connections', 'Calculations', 'Aggregations', 'Joins', 'Best Practices', 'Error Handling'];
    const uniqueCategories = [...new Set(categories)];

    const filteredPatterns = mPatterns.filter(pattern => {
        const matchesSearch = !searchTerm || 
            pattern.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            pattern.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
            pattern.category.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesCategory = selectedCategory === 'all' || pattern.category === selectedCategory;
        return matchesSearch && matchesCategory;
    });

    const copyToClipboard = (code, id) => {
        navigator.clipboard.writeText(code);
        setCopiedId(id);
        addToast('Power Query M code copied!', 'success');
        setTimeout(() => setCopiedId(null), 2000);
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h2 className="text-2xl font-bold text-slate-900">Power Query M Code Library</h2>
                    <p className="text-slate-600">Reusable M code patterns for Power Query transformations.</p>
                </div>
            </div>

            {/* Search and Category Filter */}
            <div className="flex flex-col sm:flex-row gap-4">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 h-4 w-4" />
                    <input
                        type="text"
                        placeholder="Search M code patterns..."
                        className="input-field pl-10 text-sm w-full"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                <div className="flex flex-wrap gap-2">
                    {uniqueCategories.map(cat => (
                        <button
                            key={cat}
                            onClick={() => setSelectedCategory(cat)}
                            className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors ${
                                selectedCategory === cat
                                    ? 'bg-brand-600 text-white'
                                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                            }`}
                        >
                            {cat === 'all' ? 'All' : cat}
                        </button>
                    ))}
                </div>
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
                                    title="Copy M Code"
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
                    <Code className="h-12 w-12 mx-auto mb-3 opacity-20" />
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

export default PowerQueryLibrary;

