import React, { useState, useEffect } from 'react';
import { Plus, Trash2, Calendar, User, FileText, Briefcase, AlertCircle, CheckCircle2, Users, LayoutList, AlertTriangle, Activity, ClipboardList, CheckSquare, Square, X, Cloud, HardDrive, Upload, Copy, CheckCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useToast } from '../context/ToastContext';
import { getSupabaseClient } from '../config/supabase';

const ProjectTracker = () => {
    const { addToast } = useToast();
    const [activeTab, setActiveTab] = useState('projects');
    const [projects, setProjects] = useState([]);
    const [decisions, setDecisions] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [useCloud, setUseCloud] = useState(false);

    // Form state
    const [isAdding, setIsAdding] = useState(false);
    const [isBulkImporting, setIsBulkImporting] = useState(false);
    const [bulkImportText, setBulkImportText] = useState('');
    const [selectedProjects, setSelectedProjects] = useState([]);
    const [isSelectionMode, setIsSelectionMode] = useState(false);
    const [bulkGuideCopied, setBulkGuideCopied] = useState(false);
    const [newProject, setNewProject] = useState({
        name: '',
        stakeholder: '',
        deadline: '',
        status: 'Planning',
        priority: 'Normal',
        requirements: ''
    });

    const supabase = getSupabaseClient();

    // --- Data Fetching ---
    useEffect(() => {
        const fetchData = async () => {
            setIsLoading(true);
            if (supabase) {
                setUseCloud(true);
                try {
                    // Fetch Projects
                    const { data: projData, error: projError } = await supabase
                        .from('projects')
                        .select('*')
                        .order('created_at', { ascending: false });
                    
                    if (projError) throw projError;
                    setProjects(projData || []);

                    // Fetch Decisions
                    const { data: decData, error: decError } = await supabase
                        .from('strategic_items')
                        .select('*')
                        .order('date_logged', { ascending: false });

                    if (decError) throw decError;
                    setDecisions(decData || []);

                } catch (error) {
                    console.error('Error fetching data:', error);
                    addToast('Failed to sync with cloud. Using local mode.', 'error');
                    setUseCloud(false); // Fallback? Or just show empty?
                }
            } else {
                // Local Mock Data (Fallback if Supabase not configured)
                setUseCloud(false);
                setProjects([
                    { id: 1, name: 'ASPA Analytics Dashboard', stakeholder: 'Lakshman', deadline: '2023-12-01', status: 'In Progress', priority: 'High', requirements: 'Local Demo Data' }
                ]);
            }
            setIsLoading(false);
        };

        fetchData();
    }, [supabase, addToast]);

    // --- Actions ---

    const handleAdd = async (e) => {
        e.preventDefault();
        
        if (useCloud && supabase) {
            try {
                const { data, error } = await supabase
                    .from('projects')
                    .insert([{
                        name: newProject.name,
                        stakeholder: newProject.stakeholder,
                        deadline: newProject.deadline || null,
                        status: newProject.status,
                        priority: newProject.priority,
                        requirements: newProject.requirements
                    }])
                    .select();

                if (error) throw error;
                
                setProjects([data[0], ...projects]);
                addToast('Project saved to cloud', 'success');
            } catch (error) {
                console.error('Error adding project:', error);
                addToast('Failed to save project', 'error');
            }
        } else {
            // Local Fallback
            setProjects([...projects, { ...newProject, id: Date.now() }]);
            addToast('Project added (Local only)', 'info');
        }

        setNewProject({ name: '', stakeholder: '', deadline: '', status: 'Planning', priority: 'Normal', requirements: '' });
        setIsAdding(false);
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to delete this project?')) return;

        if (useCloud && supabase) {
            try {
                const { error } = await supabase.from('projects').delete().eq('id', id);
                if (error) throw error;
                setProjects(projects.filter(p => p.id !== id));
                addToast('Project deleted from cloud', 'success');
            } catch (error) {
                console.error('Error deleting project:', error);
                addToast('Failed to delete project', 'error');
            }
        } else {
            setProjects(projects.filter(p => p.id !== id));
            addToast('Project deleted (Local)', 'info');
        }
    };

    const handleBulkDelete = async () => {
        if (selectedProjects.length === 0) return;

        const confirmMessage = `Delete ${selectedProjects.length} project${selectedProjects.length > 1 ? 's' : ''}?`;
        if (!window.confirm(confirmMessage)) return;

        if (useCloud && supabase) {
            try {
                const { error } = await supabase
                    .from('projects')
                    .delete()
                    .in('id', selectedProjects);
                
                if (error) throw error;
                
                setProjects(projects.filter(p => !selectedProjects.includes(p.id)));
                setSelectedProjects([]);
                setIsSelectionMode(false);
                addToast('Projects deleted from cloud', 'success');
            } catch (error) {
                console.error('Error bulk deleting:', error);
                addToast('Failed to delete projects', 'error');
            }
        } else {
            setProjects(projects.filter(p => !selectedProjects.includes(p.id)));
            setSelectedProjects([]);
            setIsSelectionMode(false);
            addToast('Projects deleted (Local)', 'info');
        }
    };

    // --- Helpers ---
    const toggleProjectSelection = (projectId) => {
        setSelectedProjects(prev =>
            prev.includes(projectId)
                ? prev.filter(id => id !== projectId)
                : [...prev, projectId]
        );
    };

    const toggleSelectionMode = () => {
        setIsSelectionMode(!isSelectionMode);
        setSelectedProjects([]);
    };

    const selectAllProjects = () => {
        if (selectedProjects.length === projects.length) {
            setSelectedProjects([]);
        } else {
            setSelectedProjects(projects.map(p => p.id));
        }
    };

    // --- Bulk Import Guide Content ---
    const bulkImportGuideContent = `# Project Bulk Import Format

Paste all your projects, decisions, blockers, stakeholders, deadlines, status, priority, and requirements using this format.

## Format Structure

Use this exact format - copy and paste your data following the structure below:

\`\`\`
## PROJECTS

### Project 1: [Project Name]
**Stakeholder:** [Name]
**Deadline:** YYYY-MM-DD (or leave blank)
**Status:** Planning | Data Modeling | Visualizing | Review | Done
**Priority:** Normal | High | Critical
**Requirements:** 
[Your requirements text here - can be multiple lines]

### Project 2: [Project Name]
**Stakeholder:** [Name]
**Deadline:** YYYY-MM-DD
**Status:** In Progress
**Priority:** High
**Requirements:** 
[Your requirements text]

---

## DECISIONS

### Decision: [Decision Title]
**Date:** YYYY-MM-DD (or leave blank for today)
**Status:** Active | Resolved | Mitigated
**Description:** 
[Description of the decision]

### Decision: [Another Decision]
**Date:** 2024-01-15
**Status:** Resolved
**Description:** 
[Description]

---

## BLOCKERS

### Blocker: [Blocker Title]
**Date:** YYYY-MM-DD (or leave blank for today)
**Status:** Active | Resolved | Mitigated
**Description:** 
[Description of the blocker]

### Blocker: [Another Blocker]
**Date:** 2024-01-20
**Status:** Active
**Description:** 
[Description]
\`\`\`

## Example

\`\`\`
## PROJECTS

### Project 1: ASPA Analytics Dashboard
**Stakeholder:** Lakshman / Venkata
**Deadline:** 2024-12-01
**Status:** In Progress
**Priority:** High
**Requirements:** 
HHS branded theme. Metrics: Impressions, Engagements, Click-through rates.
Need to include date slicer and filter by campaign type.

### Project 2: Jira Delivery Dashboard
**Stakeholder:** David Urer
**Deadline:** 2024-12-15
**Status:** Planning
**Priority:** Critical
**Requirements:** 
Throughput and cycle time views. Need to connect to Jira API.
Include sprint burndown charts.

### Project 3: Campaign Performance Report
**Stakeholder:** Sarah Johnson
**Deadline:** 2024-11-30
**Status:** Review
**Priority:** Normal
**Requirements:** 
Monthly campaign performance metrics with drill-through capabilities.

---

## DECISIONS

### Decision: Use HashRouter
**Date:** 2024-11-22
**Status:** Resolved
**Description:** 
Switched to HashRouter for GitHub Pages compatibility. This allows the app to work without server-side routing configuration.

### Decision: Data Refresh Schedule
**Date:** 2024-11-25
**Status:** Active
**Description:** 
Decided to refresh data daily at 2 AM EST. Need to confirm with stakeholders.

---

## BLOCKERS

### Blocker: Jira API Access
**Date:** 2024-11-20
**Status:** Active
**Description:** 
Waiting on IT approval for PAT token. Cannot proceed with Jira dashboard until access is granted.

### Blocker: Data Source Permissions
**Date:** 2024-11-18
**Status:** Resolved
**Description:** 
Resolved - received necessary permissions from data team.
\`\`\`

## Quick Reference

- **Section Headers:** Use \`## PROJECTS\`, \`## DECISIONS\`, \`## BLOCKERS\`
- **Project Headers:** Use \`### Project 1: [Name]\` or \`### Project: [Name]\`
- **Decision/Blocker Headers:** Use \`### Decision: [Title]\` or \`### Blocker: [Title]\`
- **Fields:** Use \`**Field Name:**\` format (e.g., \`**Stakeholder:**\`, \`**Deadline:**\`)
- **Separators:** Use \`---\` to separate sections
- **Dates:** Use YYYY-MM-DD format (e.g., 2024-12-01) or leave blank
- **Status Values:**
  - Projects: \`Planning\`, \`Data Modeling\`, \`Visualizing\`, \`Review\`, \`Done\`, \`In Progress\`
  - Decisions/Blockers: \`Active\`, \`Resolved\`, \`Mitigated\`
- **Priority Values:** \`Normal\`, \`High\`, \`Critical\`
- **Multi-line text:** Requirements and descriptions can span multiple lines

## Tips

- You can paste this directly from Excel, Google Sheets, or any text editor
- Leave date fields blank to use today's date
- Requirements and descriptions can be as long as needed
- You can include as many projects, decisions, and blockers as you want
- The format is case-sensitive for section headers (\`##\`, \`###\`)`;

    // Copy Bulk Import Guide to Clipboard
    const copyBulkImportGuide = async () => {
        try {
            await navigator.clipboard.writeText(bulkImportGuideContent);
            setBulkGuideCopied(true);
            addToast('✓ Bulk Import Guide copied to clipboard!', 'success');
            setTimeout(() => setBulkGuideCopied(false), 3000);
        } catch (err) {
            // Fallback for older browsers
            const textArea = document.createElement('textarea');
            textArea.value = bulkImportGuideContent;
            document.body.appendChild(textArea);
            textArea.select();
            document.execCommand('copy');
            document.body.removeChild(textArea);
            setBulkGuideCopied(true);
            addToast('✓ Bulk Import Guide copied to clipboard!', 'success');
            setTimeout(() => setBulkGuideCopied(false), 3000);
        }
    };

    // --- Bulk Import Parser ---
    const parseBulkImport = (text) => {
        const projects = [];
        const decisions = [];
        const blockers = [];

        const lines = text.split('\n');
        let currentSection = null;
        let currentItem = null;
        let currentField = null;
        let currentContent = [];

        const flushCurrentItem = () => {
            if (currentItem) {
                if (currentField && currentContent.length > 0) {
                    currentItem[currentField] = currentContent.join('\n').trim();
                }
                
                if (currentSection === 'PROJECTS' && currentItem.name) {
                    projects.push(currentItem);
                } else if (currentSection === 'DECISIONS' && currentItem.title) {
                    decisions.push({ ...currentItem, type: 'Decision' });
                } else if (currentSection === 'BLOCKERS' && currentItem.title) {
                    blockers.push({ ...currentItem, type: 'Pain Point' });
                }
            }
            currentItem = null;
            currentField = null;
            currentContent = [];
        };

        for (let i = 0; i < lines.length; i++) {
            const line = lines[i].trim();
            
            // Section headers
            if (line.match(/^##\s+(PROJECTS|DECISIONS|BLOCKERS)/i)) {
                flushCurrentItem();
                currentSection = line.match(/^##\s+(PROJECTS|DECISIONS|BLOCKERS)/i)[1].toUpperCase();
                continue;
            }

            // Item headers (Project, Decision, Blocker)
            if (line.match(/^###\s+(Project\s*\d*|Decision|Blocker)[\s:]+(.+)/i)) {
                flushCurrentItem();
                const match = line.match(/^###\s+(Project\s*\d*|Decision|Blocker)[\s:]+(.+)/i);
                const itemType = match[1].toLowerCase();
                const title = match[2].trim();
                
                if (itemType.includes('project')) {
                    currentItem = { name: title, stakeholder: '', deadline: '', status: 'Planning', priority: 'Normal', requirements: '' };
                } else {
                    currentItem = { title: title, date_logged: new Date().toISOString().split('T')[0], status: 'Active', description: '' };
                }
                currentField = null;
                currentContent = [];
                continue;
            }

            // Field headers
            if (line.match(/^\*\*([^*]+):\*\*\s*(.*)/)) {
                if (currentItem) {
                    if (currentField && currentContent.length > 0) {
                        currentItem[currentField] = currentContent.join('\n').trim();
                    }
                    currentContent = [];
                }
                
                const match = line.match(/^\*\*([^*]+):\*\*\s*(.*)/);
                const fieldName = match[1].trim().toLowerCase();
                const fieldValue = match[2].trim();
                
                // Map field names to database fields
                const fieldMap = {
                    'stakeholder': 'stakeholder',
                    'deadline': 'deadline',
                    'status': 'status',
                    'priority': 'priority',
                    'requirements': 'requirements',
                    'date': 'date_logged',
                    'description': 'description'
                };

                currentField = fieldMap[fieldName] || fieldName;
                
                if (fieldValue) {
                    currentContent.push(fieldValue);
                }
                continue;
            }

            // Content lines (for multi-line fields)
            if (currentItem && currentField && line) {
                currentContent.push(line);
            }

            // Separator (---) - flush current item
            if (line.match(/^---+$/)) {
                flushCurrentItem();
            }
        }

        flushCurrentItem();

        return { projects, decisions, blockers };
    };

    const handleBulkImport = async () => {
        if (!bulkImportText.trim()) {
            addToast('Please paste your data first', 'error');
            return;
        }

        try {
            const { projects: parsedProjects, decisions: parsedDecisions, blockers: parsedBlockers } = parseBulkImport(bulkImportText);
            
            if (parsedProjects.length === 0 && parsedDecisions.length === 0 && parsedBlockers.length === 0) {
                addToast('No valid data found. Check the format.', 'error');
                return;
            }

            let successCount = 0;
            let errorCount = 0;

            if (useCloud && supabase) {
                // Import Projects
                if (parsedProjects.length > 0) {
                    const projectsToInsert = parsedProjects.map(p => ({
                        name: p.name,
                        stakeholder: p.stakeholder || '',
                        deadline: p.deadline || null,
                        status: p.status || 'Planning',
                        priority: p.priority || 'Normal',
                        requirements: p.requirements || ''
                    }));

                    const { data: projData, error: projError } = await supabase
                        .from('projects')
                        .insert(projectsToInsert)
                        .select();

                    if (projError) throw projError;
                    successCount += projData.length;
                }

                // Import Decisions
                if (parsedDecisions.length > 0) {
                    const decisionsToInsert = parsedDecisions.map(d => ({
                        type: 'Decision',
                        title: d.title,
                        date_logged: d.date_logged || new Date().toISOString().split('T')[0],
                        status: d.status || 'Active',
                        description: d.description || ''
                    }));

                    const { data: decData, error: decError } = await supabase
                        .from('strategic_items')
                        .insert(decisionsToInsert)
                        .select();

                    if (decError) throw decError;
                    successCount += decData.length;
                }

                // Import Blockers
                if (parsedBlockers.length > 0) {
                    const blockersToInsert = parsedBlockers.map(b => ({
                        type: 'Pain Point',
                        title: b.title,
                        date_logged: b.date_logged || new Date().toISOString().split('T')[0],
                        status: b.status || 'Active',
                        description: b.description || ''
                    }));

                    const { data: blockerData, error: blockerError } = await supabase
                        .from('strategic_items')
                        .insert(blockersToInsert)
                        .select();

                    if (blockerError) throw blockerError;
                    successCount += blockerData.length;
                }

                // Refresh data from database
                const { data: projData, error: projError } = await supabase
                    .from('projects')
                    .select('*')
                    .order('created_at', { ascending: false });
                
                if (!projError) setProjects(projData || []);

                const { data: decData, error: decError } = await supabase
                    .from('strategic_items')
                    .select('*')
                    .order('date_logged', { ascending: false });

                if (!decError) setDecisions(decData || []);
            } else {
                // Local fallback
                const newProjects = parsedProjects.map((p, idx) => ({
                    id: Date.now() + idx,
                    ...p
                }));
                setProjects([...newProjects, ...projects]);
                successCount += newProjects.length;
            }

            addToast(`Successfully imported ${successCount} item${successCount !== 1 ? 's' : ''}`, 'success');
            setBulkImportText('');
            setIsBulkImporting(false);
        } catch (error) {
            console.error('Error bulk importing:', error);
            addToast('Failed to import data. Check the format and try again.', 'error');
        }
    };

    const generateReport = () => {
        const activeProjects = projects.filter(p => p.status !== 'Done');
        const activeDecisions = decisions.filter(d => d.status === 'Active');

        const report = `
WEEKLY STATUS REPORT
-------------------
ACTIVE PROJECTS:
${activeProjects.map(p => `- ${p.name} (${p.status}) - Priority: ${p.priority}`).join('\n')}

BLOCKERS / RISKS:
${activeDecisions.length > 0 ? activeDecisions.map(d => `- ${d.title}: ${d.description}`).join('\n') : '- None'}

NEXT STEPS:
- Continue development on active workstreams.
- Review pending decisions.
        `.trim();

        navigator.clipboard.writeText(report);
        addToast('Status Report copied to clipboard!', 'success');
    };

    const getPriorityColor = (p) => {
        switch (p) {
            case 'Critical': return 'bg-red-100 text-red-700 border-red-200';
            case 'High': return 'bg-orange-100 text-orange-700 border-orange-200';
            default: return 'bg-blue-100 text-blue-700 border-blue-200';
        }
    };

    const activeCount = projects.filter(p => p.status !== 'Done').length;
    const criticalCount = projects.filter(p => p.priority === 'Critical').length;
    const blockerCount = decisions.filter(d => d.status === 'Active').length;

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-brand-500"></div>
            </div>
        );
    }

    return (
        <div className="space-y-8">
            {/* Morning Brief Header */}
            <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-sm">
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4 mb-6">
                    <div>
                        <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100 flex items-center gap-3 flex-wrap">
                            Welcome back, Power BI Developer.
                            {useCloud ? (
                                <span className="text-xs px-2 py-1 bg-emerald-100 text-emerald-700 rounded-full flex items-center gap-1 font-normal whitespace-nowrap">
                                    <Cloud className="h-3 w-3" /> Cloud Synced
                                </span>
                            ) : (
                                <span className="text-xs px-2 py-1 bg-amber-100 text-amber-700 rounded-full flex items-center gap-1 font-normal whitespace-nowrap">
                                    <HardDrive className="h-3 w-3" /> Local Mode
                                </span>
                            )}
                        </h1>
                        <p className="text-slate-500 dark:text-slate-400 mt-1">Here is your morning brief for WebFirst Analytics.</p>
                    </div>
                    <div className="flex flex-wrap gap-2 w-full sm:w-auto">
                        <button
                            onClick={generateReport}
                            className="btn-secondary text-sm flex-1 sm:flex-none justify-center"
                        >
                            <FileText className="h-4 w-4" />
                            <span className="ml-2">Generate Report</span>
                        </button>
                        {activeTab === 'projects' && (
                            <>
                                {isSelectionMode ? (
                                    <div className="flex gap-2">
                                        {selectedProjects.length > 0 && (
                                            <button
                                                onClick={handleBulkDelete}
                                                className="btn-secondary text-red-600 hover:bg-red-50 border-red-200 text-xs sm:text-sm"
                                            >
                                                <Trash2 className="h-4 w-4" />
                                                <span className="hidden sm:inline ml-2">Delete ({selectedProjects.length})</span>
                                                <span className="sm:hidden ml-1">Del ({selectedProjects.length})</span>
                                            </button>
                                        )}
                                        <button
                                            onClick={toggleSelectionMode}
                                            className="btn-secondary text-xs sm:text-sm"
                                        >
                                            <X className="h-4 w-4" />
                                            <span className="hidden sm:inline ml-2">Cancel</span>
                                            <span className="sm:hidden ml-1">Cancel</span>
                                        </button>
                                    </div>
                                ) : (
                                    <div className="flex gap-2">
                                        <button
                                            onClick={() => setIsBulkImporting(!isBulkImporting)}
                                            className="btn-secondary text-xs sm:text-sm"
                                            title="Bulk import projects, decisions, and blockers"
                                        >
                                            <Upload className="h-4 w-4" />
                                            <span className="hidden sm:inline ml-2">Bulk Import</span>
                                            <span className="sm:hidden ml-1">Import</span>
                                        </button>
                                        <button
                                            onClick={toggleSelectionMode}
                                            className="btn-secondary text-xs sm:text-sm"
                                            title="Select multiple projects"
                                        >
                                            <CheckSquare className="h-4 w-4" />
                                            <span className="hidden sm:inline ml-2">Select</span>
                                            <span className="sm:hidden ml-1">Select</span>
                                        </button>
                                        <button
                                            onClick={() => setIsAdding(!isAdding)}
                                            className="btn-primary text-xs sm:text-sm"
                                        >
                                            <Plus className="h-4 w-4" />
                                            <span className="hidden sm:inline ml-2">New Project</span>
                                            <span className="sm:hidden ml-1">New</span>
                                        </button>
                                    </div>
                                )}
                            </>
                        )}
                    </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg border border-blue-100">
                        <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 flex-shrink-0">
                            <Activity className="h-5 w-5" />
                        </div>
                        <div>
                            <p className="text-2xl font-bold text-blue-900">{activeCount}</p>
                            <p className="text-xs font-medium text-blue-700 uppercase tracking-wide">Active Projects</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-3 p-3 bg-orange-50 rounded-lg border border-orange-100">
                        <div className="h-10 w-10 rounded-full bg-orange-100 flex items-center justify-center text-orange-600">
                            <AlertCircle className="h-5 w-5" />
                        </div>
                        <div>
                            <p className="text-2xl font-bold text-orange-900">{criticalCount}</p>
                            <p className="text-xs font-medium text-orange-700 uppercase tracking-wide">Critical Items</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-3 p-3 bg-red-50 rounded-lg border border-red-100">
                        <div className="h-10 w-10 rounded-full bg-red-100 flex items-center justify-center text-red-600">
                            <AlertTriangle className="h-5 w-5" />
                        </div>
                        <div>
                            <p className="text-2xl font-bold text-red-900">{blockerCount}</p>
                            <p className="text-xs font-medium text-red-700 uppercase tracking-wide">Active Blockers</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Tabs */}
            <div className="flex gap-1 bg-slate-100 dark:bg-slate-800/50 p-1 rounded-lg w-full sm:w-fit overflow-x-auto">
                <button
                    onClick={() => setActiveTab('projects')}
                    className={`flex-shrink-0 px-3 sm:px-4 py-2 rounded-md text-xs sm:text-sm font-medium transition-all whitespace-nowrap ${activeTab === 'projects' ? 'bg-white dark:bg-slate-700 text-brand-700 dark:text-brand-300 shadow-sm' : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-slate-100'}`}
                >
                    <div className="flex items-center gap-2">
                        <LayoutList className="h-4 w-4" /> 
                        <span>Projects</span>
                    </div>
                </button>
                <button
                    onClick={() => setActiveTab('decisions')}
                    className={`flex-shrink-0 px-3 sm:px-4 py-2 rounded-md text-xs sm:text-sm font-medium transition-all whitespace-nowrap ${activeTab === 'decisions' ? 'bg-white dark:bg-slate-700 text-brand-700 dark:text-brand-300 shadow-sm' : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-slate-100'}`}
                >
                    <div className="flex items-center gap-2">
                        <AlertCircle className="h-4 w-4" /> 
                        <span className="hidden xs:inline">Decisions</span>
                        <span className="xs:hidden">Dec.</span>
                        <span className="hidden sm:inline">& Blockers</span>
                    </div>
                </button>
                <button
                    onClick={() => setActiveTab('team')}
                    className={`flex-shrink-0 px-3 sm:px-4 py-2 rounded-md text-xs sm:text-sm font-medium transition-all whitespace-nowrap ${activeTab === 'team' ? 'bg-white dark:bg-slate-700 text-brand-700 dark:text-brand-300 shadow-sm' : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-slate-100'}`}
                >
                    <div className="flex items-center gap-2">
                        <Users className="h-4 w-4" /> 
                        <span>Team</span>
                        <span className="hidden sm:inline">View</span>
                    </div>
                </button>
            </div>

            {/* Projects Tab */}
            {activeTab === 'projects' && (
                <div className="space-y-6">
                    {isBulkImporting && (
                        <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            className="card border-brand-200 bg-white"
                        >
                            <div className="mb-4">
                                <div className="flex items-center justify-between mb-2">
                                    <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100">Bulk Import</h3>
                                    <button
                                        onClick={() => {
                                            setIsBulkImporting(false);
                                            setBulkImportText('');
                                        }}
                                        className="text-slate-400 hover:text-slate-600"
                                    >
                                        <X className="h-5 w-5" />
                                    </button>
                                </div>
                                <div className="flex items-center justify-between mb-3">
                                    <p className="text-sm text-slate-600 dark:text-slate-400">
                                        Paste all your projects, decisions, and blockers. Copy the format guide below.
                                    </p>
                                    <button
                                        onClick={copyBulkImportGuide}
                                        className={`flex items-center gap-2 px-3 py-1.5 rounded text-xs font-semibold transition-all ${
                                            bulkGuideCopied
                                                ? 'bg-green-500 text-white'
                                                : 'bg-brand-500 hover:bg-brand-600 text-white'
                                        }`}
                                        title="Copy bulk import format guide to clipboard"
                                    >
                                        {bulkGuideCopied ? (
                                            <>
                                                <CheckCircle className="h-4 w-4" />
                                                Copied!
                                            </>
                                        ) : (
                                            <>
                                                <Copy className="h-4 w-4" />
                                                Copy Guide
                                            </>
                                        )}
                                    </button>
                                </div>
                                <div className="mb-3 p-3 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded text-xs font-mono text-slate-600 dark:text-slate-400 max-h-48 overflow-y-auto">
                                    <div className="whitespace-pre-wrap">{bulkImportGuideContent.substring(0, 500)}...</div>
                                    <p className="text-xs text-slate-500 dark:text-slate-500 mt-2 italic">
                                        Click "Copy Guide" above to copy the full format guide
                                    </p>
                                </div>
                            </div>
                            <textarea
                                value={bulkImportText}
                                onChange={(e) => setBulkImportText(e.target.value)}
                                placeholder={`## PROJECTS

### Project 1: [Project Name]
**Stakeholder:** [Name]
**Deadline:** YYYY-MM-DD
**Status:** Planning | Data Modeling | Visualizing | Review | Done
**Priority:** Normal | High | Critical
**Requirements:** 
[Your requirements text here]

---

## DECISIONS

### Decision: [Decision Title]
**Date:** YYYY-MM-DD
**Status:** Active | Resolved | Mitigated
**Description:** 
[Description]

---

## BLOCKERS

### Blocker: [Blocker Title]
**Date:** YYYY-MM-DD
**Status:** Active | Resolved | Mitigated
**Description:** 
[Description]`}
                                className="w-full h-64 bg-slate-50 dark:bg-slate-800 border-2 border-slate-200 dark:border-slate-700 rounded px-3 py-2 text-sm text-slate-700 dark:text-slate-300 placeholder-slate-400 dark:placeholder-slate-500 font-mono resize-none focus:border-brand-500 focus:outline-none transition-colors"
                            />
                            <div className="flex justify-end gap-3 mt-4">
                                <button
                                    type="button"
                                    onClick={() => {
                                        setIsBulkImporting(false);
                                        setBulkImportText('');
                                    }}
                                    className="btn-secondary"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleBulkImport}
                                    className="btn-primary"
                                >
                                    <Upload className="h-4 w-4 mr-2" />
                                    Import All
                                </button>
                            </div>
                        </motion.div>
                    )}
                    {isAdding && (
                        <motion.form
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            className="card border-brand-200 bg-white"
                            onSubmit={handleAdd}
                        >
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                                <div>
                                    <label className="block text-sm text-slate-600 dark:text-slate-300 mb-1">Dashboard Name</label>
                                    <input
                                        required
                                        className="input-field"
                                        value={newProject.name}
                                        onChange={e => setNewProject({ ...newProject, name: e.target.value })}
                                        placeholder="e.g. Campaign Performance"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm text-slate-600 dark:text-slate-300 mb-1">Stakeholder</label>
                                    <input
                                        required
                                        className="input-field"
                                        value={newProject.stakeholder}
                                        onChange={e => setNewProject({ ...newProject, stakeholder: e.target.value })}
                                        placeholder="e.g. Venkata"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm text-slate-600 dark:text-slate-300 mb-1">Deadline</label>
                                    <input
                                        type="date"
                                        required
                                        className="input-field"
                                        value={newProject.deadline}
                                        onChange={e => setNewProject({ ...newProject, deadline: e.target.value })}
                                    />
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm text-slate-600 dark:text-slate-300 mb-1">Status</label>
                                        <select
                                            className="input-field"
                                            value={newProject.status}
                                            onChange={e => setNewProject({ ...newProject, status: e.target.value })}
                                        >
                                            <option>Planning</option>
                                            <option>Data Modeling</option>
                                            <option>Visualizing</option>
                                            <option>Review</option>
                                            <option>Done</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-sm text-slate-600 dark:text-slate-300 mb-1">Priority</label>
                                        <select
                                            className="input-field"
                                            value={newProject.priority}
                                            onChange={e => setNewProject({ ...newProject, priority: e.target.value })}
                                        >
                                            <option>Normal</option>
                                            <option>High</option>
                                            <option>Critical</option>
                                        </select>
                                    </div>
                                </div>
                            </div>
                            <div className="mb-4">
                                <label className="block text-sm text-slate-600 dark:text-slate-300 mb-1">Key Requirements</label>
                                <textarea
                                    className="input-field min-h-[80px]"
                                    value={newProject.requirements}
                                    onChange={e => setNewProject({ ...newProject, requirements: e.target.value })}
                                    placeholder="List the must-have metrics and dimensions..."
                                />
                            </div>
                            <div className="flex justify-end gap-3">
                                <button
                                    type="button"
                                    onClick={() => setIsAdding(false)}
                                    className="btn-secondary"
                                >
                                    Cancel
                                </button>
                                <button type="submit" className="btn-primary">
                                    Save Project
                                </button>
                            </div>
                        </motion.form>
                    )}

                    <div className="grid grid-cols-1 gap-4">
                        {projects.length > 0 ? (
                            <>
                                {isSelectionMode && (
                                    <div className="flex items-center justify-between bg-slate-50 p-3 rounded-lg border border-slate-200">
                                        <div className="flex items-center gap-3">
                                            <button
                                                onClick={selectAllProjects}
                                                className="flex items-center gap-2 text-sm font-medium text-slate-700 dark:text-slate-300 hover:text-brand-700 dark:hover:text-brand-400"
                                            >
                                                {selectedProjects.length === projects.length ? (
                                                    <CheckSquare className="h-4 w-4" />
                                                ) : (
                                                    <Square className="h-4 w-4" />
                                                )}
                                                {selectedProjects.length === projects.length ? 'Deselect All' : 'Select All'}
                                            </button>
                                            <span className="text-sm text-slate-500 dark:text-slate-400">
                                                {selectedProjects.length} of {projects.length} selected
                                            </span>
                                        </div>
                                    </div>
                                )}
                                {projects.map((project) => (
                                    <motion.div
                                        key={project.id}
                                        layout
                                        className={`card hover:border-brand-300 group bg-white ${selectedProjects.includes(project.id) ? 'ring-2 ring-brand-500 border-brand-500' : ''}`}
                                    >
                                        <div className="flex justify-between items-start">
                                            <div className="flex items-start gap-3 flex-1">
                                                {isSelectionMode && (
                                                    <button
                                                        onClick={() => toggleProjectSelection(project.id)}
                                                        aria-label={`Select project ${project.name}`}
                                                        className={`mt-1 p-1 rounded transition-colors ${selectedProjects.includes(project.id)
                                                            ? 'bg-brand-100 text-brand-700'
                                                            : 'hover:bg-slate-100 text-slate-400 dark:text-slate-500'
                                                        }`}
                                                    >
                                                        {selectedProjects.includes(project.id) ? (
                                                            <CheckSquare className="h-4 w-4" />
                                                        ) : (
                                                            <Square className="h-4 w-4" />
                                                        )}
                                                    </button>
                                                )}
                                                <div className="space-y-1 flex-1 min-w-0">
                                    <div className="flex items-center gap-2 flex-wrap">
                                                        <h3 className="text-base sm:text-lg font-semibold text-slate-900 dark:text-slate-100 break-words line-clamp-2">{project.name}</h3>
                                                        <span className={`text-[10px] sm:text-xs px-2 py-0.5 rounded-full border whitespace-nowrap flex-shrink-0 font-medium flex items-center gap-1 ${project.status === 'Done' ? 'bg-emerald-100 text-emerald-700 border-emerald-200' :
                                                            project.status === 'Review' ? 'bg-amber-100 text-amber-700 border-amber-200' :
                                                                'bg-brand-100 text-brand-700 border-brand-200'
                                                            }`}>
                                                            {project.status === 'Done' && <CheckCircle2 className="h-3 w-3" />}
                                                            {project.status}
                                                        </span>
                                                        <span className={`text-[10px] sm:text-xs px-2 py-0.5 rounded-full border whitespace-nowrap flex-shrink-0 font-medium ${getPriorityColor(project.priority)}`}>
                                                            {project.priority}
                                                        </span>
                                                    </div>
                                                    <div className="flex items-center gap-3 sm:gap-4 text-xs sm:text-sm text-slate-500 dark:text-slate-400 flex-wrap">
                                                        <span className="flex items-center gap-1 truncate"><User className="h-3 w-3 flex-shrink-0" /> <span className="truncate">{project.stakeholder}</span></span>
                                                        <span className="flex items-center gap-1 whitespace-nowrap"><Calendar className="h-3 w-3 flex-shrink-0" /> {project.deadline}</span>
                                                    </div>
                                                </div>
                                            </div>
                                            {!isSelectionMode && (
                                                <button
                                                    onClick={() => handleDelete(project.id)}
                                                    aria-label={`Delete project ${project.name}`}
                                                    className="p-2 text-slate-400 dark:text-slate-500 hover:text-red-500 dark:hover:text-red-400 transition-all"
                                                    title="Delete Project"
                                                >
                                                    <Trash2 className="h-4 w-4" />
                                                </button>
                                            )}
                                        </div>
                                    {project.requirements && (
                                        <div className="mt-4 pt-4 border-t border-slate-100 dark:border-slate-700">
                                            <div className="flex items-start gap-2 text-xs sm:text-sm text-slate-600 dark:text-slate-300">
                                                <FileText className="h-4 w-4 mt-0.5 text-slate-400 dark:text-slate-500 flex-shrink-0" />
                                                <p className="break-words overflow-wrap-anywhere">{project.requirements}</p>
                                            </div>
                                        </div>
                                    )}
                                    </motion.div>
                                ))}
                            </>
                        ) : (
                            <div className="text-center py-12 text-slate-400 dark:text-slate-500 border-2 border-dashed border-slate-200 dark:border-slate-700 rounded-xl">
                                <ClipboardList className="h-12 w-12 mx-auto mb-3 opacity-20" />
                                <p className="font-medium text-slate-600 dark:text-slate-300">No active projects</p>
                                <p className="text-sm text-slate-400 dark:text-slate-500 mt-1">Click the New Project button to start tracking.</p>
                            </div>
                        )}
                    </div>
                </div>
            )}

            {/* Decisions & Blockers Tab */}
            {activeTab === 'decisions' && (
                <div className="space-y-4">
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                        <h4 className="font-semibold text-blue-800 flex items-center gap-2">
                            <AlertTriangle className="h-4 w-4" /> Strategic Tracking
                        </h4>
                        <p className="text-sm text-blue-700 mt-1">
                            Track technical decisions and blockers here to demonstrate proactive management for the recompete.
                        </p>
                    </div>

                    {decisions.length > 0 ? (
                        decisions.map((item) => (
                            <div key={item.id} className="card flex gap-4">
                                <div className={`mt-1 p-2 rounded-lg shrink-0 ${item.type === 'Decision' ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700'}`}>
                                    {item.type === 'Decision' ? <CheckCircle2 className="h-5 w-5" /> : <AlertCircle className="h-5 w-5" />}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <div className="flex justify-between items-start gap-3">
                                        <h3 className="font-semibold text-sm sm:text-base text-slate-900 dark:text-slate-100 break-words flex-1 min-w-0">{item.title}</h3>
                                        <span className="text-xs text-slate-500 dark:text-slate-400 whitespace-nowrap flex-shrink-0">{item.date_logged || item.date}</span>
                                    </div>
                                    <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 mt-1 break-words">{item.description}</p>
                                    <div className="mt-3 flex gap-2">
                                        <span className="text-xs font-medium px-2 py-1 bg-slate-100 dark:bg-slate-700 rounded text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-600">
                                            {item.status}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="text-center py-12 text-slate-400 dark:text-slate-500 border-2 border-dashed border-slate-200 dark:border-slate-700 rounded-xl">
                            <p className="font-medium text-slate-600 dark:text-slate-300">No decisions or blockers logged</p>
                        </div>
                    )}
                </div>
            )}

            {/* Team View Tab */}
            {activeTab === 'team' && (
                <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Power BI Developer */}
                        <div className="card border-brand-200">
                            <div className="flex items-center gap-3 mb-4 pb-4 border-b border-slate-100">
                                <div className="h-10 w-10 rounded-full bg-brand-700 flex items-center justify-center text-white font-bold">PD</div>
                                <div>
                                    <h3 className="font-bold text-slate-900 dark:text-slate-100">Power BI Developer</h3>
                                    <p className="text-xs text-slate-500 dark:text-slate-400">Analytics Lead</p>
                                </div>
                            </div>
                            <div className="space-y-3">
                                <div className="text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider">Active Projects</div>
                                {projects.length > 0 ? (
                                    projects.map(p => (
                                        <div className="flex items-center justify-between text-sm p-2 bg-slate-50 rounded border border-slate-100 hover:border-slate-300 transition-colors">
                                            <span className="truncate max-w-[180px] font-medium text-slate-700">{p.name}</span>
                                            <span className={`text-[10px] px-1.5 py-0.5 rounded border font-medium ${p.status === 'Done' ? 'bg-emerald-50 border-emerald-200 text-emerald-700' : 'bg-brand-50 border-brand-200 text-brand-700'}`}>
                                                {p.status}
                                            </span>
                                        </div>
                                    ))
                                ) : (
                                    <div className="text-sm text-slate-400 dark:text-slate-500 italic">No active projects</div>
                                )}
                            </div>
                        </div>

                        {/* Placeholder Teammate */}
                        <div className="card border-slate-200 opacity-75">
                            <div className="flex items-center gap-3 mb-4 pb-4 border-b border-slate-100">
                                <div className="h-10 w-10 rounded-full bg-slate-200 flex items-center justify-center text-slate-500 font-bold">TM</div>
                                <div>
                                    <h3 className="font-bold text-slate-900 dark:text-slate-100">Teammate Name</h3>
                                    <p className="text-xs text-slate-500 dark:text-slate-400">Analyst / Engineer</p>
                                </div>
                            </div>
                            <div className="flex items-center justify-center h-32 text-slate-400 dark:text-slate-500 text-sm border-2 border-dashed border-slate-100 rounded-lg">
                                No active projects assigned
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ProjectTracker;
