import React, { useState } from 'react';
import { Plus, Trash2, Calendar, User, FileText, Briefcase, AlertCircle, CheckCircle2, Users, LayoutList, AlertTriangle, Activity } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useToast } from '../context/ToastContext';

const ProjectTracker = () => {
    const { addToast } = useToast();
    const [activeTab, setActiveTab] = useState('projects');
    const [projects, setProjects] = useState([
        {
            id: 1,
            name: 'ASPA Analytics Dashboard (Social & Web)',
            stakeholder: 'Lakshman / Venkata',
            deadline: '2023-12-01',
            status: 'In Progress',
            priority: 'High',
            requirements: 'HHS branded theme. Metrics: Impressions, Engagements, Video Views, Website Clicks. Sources: Sprinklr, GA4.'
        },
        {
            id: 2,
            name: 'Jira Delivery Dashboard',
            stakeholder: 'David Urer / WebFirst',
            deadline: '2023-12-15',
            status: 'Planning',
            priority: 'Critical',
            requirements: 'Show throughput, cycle time, and blockers. Transparent view for recompete value.'
        },
        {
            id: 3,
            name: 'HHS Social Media Audit',
            stakeholder: 'Caroline / Sogol',
            deadline: '2023-11-30',
            status: 'Review',
            priority: 'Normal',
            requirements: 'Audit of current social metrics and gaps. Preparation for automated scripts.'
        }
    ]);

    const [decisions, setDecisions] = useState([
        {
            id: 1,
            type: 'Decision',
            title: 'Use HashRouter for GitHub Pages',
            date: '2023-11-22',
            status: 'Resolved',
            description: 'Switched to HashRouter to resolve 404 errors on subpath deployment.'
        },
        {
            id: 2,
            type: 'Pain Point',
            title: 'Jira API Access Delay',
            date: '2023-11-20',
            status: 'Active',
            description: 'Waiting on IT approval for PAT token generation. Blocked on live data connection.'
        }
    ]);

    const [isAdding, setIsAdding] = useState(false);
    const [newProject, setNewProject] = useState({
        name: '',
        stakeholder: '',
        deadline: '',
        status: 'Planning',
        priority: 'Normal',
        requirements: ''
    });

    const handleAdd = (e) => {
        e.preventDefault();
        setProjects([...projects, { ...newProject, id: Date.now() }]);
        setNewProject({ name: '', stakeholder: '', deadline: '', status: 'Planning', priority: 'Normal', requirements: '' });
        setIsAdding(false);
        addToast('New project added successfully', 'success');
    };

    const handleDelete = (id) => {
        setProjects(projects.filter(p => p.id !== id));
        addToast('Project deleted', 'info');
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

    return (
        <div className="space-y-8">
            {/* Morning Brief Header */}
            <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-sm">
                <div className="flex justify-between items-start mb-4">
                    <div>
                        <h1 className="text-2xl font-bold text-slate-900">Welcome back, Will.</h1>
                        <p className="text-slate-500">Here is your morning brief for WebFirst Analytics.</p>
                    </div>
                    <div className="flex gap-2">
                        <button
                            onClick={generateReport}
                            className="btn-secondary"
                        >
                            <FileText className="h-4 w-4" /> Generate Report
                        </button>
                        {activeTab === 'projects' && (
                            <button
                                onClick={() => setIsAdding(!isAdding)}
                                className="btn-primary"
                            >
                                <Plus className="h-4 w-4" /> New Project
                            </button>
                        )}
                    </div>
                </div>

                <div className="grid grid-cols-3 gap-4">
                    <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg border border-blue-100">
                        <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600">
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
            <div className="flex gap-1 bg-slate-100 p-1 rounded-lg w-fit">
                <button
                    onClick={() => setActiveTab('projects')}
                    className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${activeTab === 'projects' ? 'bg-white text-brand-700 shadow-sm' : 'text-slate-600 hover:text-slate-900'}`}
                >
                    <div className="flex items-center gap-2"><LayoutList className="h-4 w-4" /> Projects</div>
                </button>
                <button
                    onClick={() => setActiveTab('decisions')}
                    className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${activeTab === 'decisions' ? 'bg-white text-brand-700 shadow-sm' : 'text-slate-600 hover:text-slate-900'}`}
                >
                    <div className="flex items-center gap-2"><AlertCircle className="h-4 w-4" /> Decisions & Blockers</div>
                </button>
                <button
                    onClick={() => setActiveTab('team')}
                    className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${activeTab === 'team' ? 'bg-white text-brand-700 shadow-sm' : 'text-slate-600 hover:text-slate-900'}`}
                >
                    <div className="flex items-center gap-2"><Users className="h-4 w-4" /> Team View</div>
                </button>
            </div>

            {/* Projects Tab */}
            {activeTab === 'projects' && (
                <div className="space-y-6">
                    {isAdding && (
                        <motion.form
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            className="card border-brand-200 bg-white"
                            onSubmit={handleAdd}
                        >
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                                <div>
                                    <label className="block text-sm text-slate-600 mb-1">Dashboard Name</label>
                                    <input
                                        required
                                        className="input-field"
                                        value={newProject.name}
                                        onChange={e => setNewProject({ ...newProject, name: e.target.value })}
                                        placeholder="e.g. Campaign Performance"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm text-slate-600 mb-1">Stakeholder</label>
                                    <input
                                        required
                                        className="input-field"
                                        value={newProject.stakeholder}
                                        onChange={e => setNewProject({ ...newProject, stakeholder: e.target.value })}
                                        placeholder="e.g. Venkata"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm text-slate-600 mb-1">Deadline</label>
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
                                        <label className="block text-sm text-slate-600 mb-1">Status</label>
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
                                        <label className="block text-sm text-slate-600 mb-1">Priority</label>
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
                                <label className="block text-sm text-slate-600 mb-1">Key Requirements</label>
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
                        {projects.map((project) => (
                            <motion.div
                                key={project.id}
                                layout
                                className="card hover:border-brand-300 group bg-white"
                            >
                                <div className="flex justify-between items-start">
                                    <div className="space-y-1">
                                        <div className="flex items-center gap-3">
                                            <h3 className="text-lg font-semibold text-slate-900">{project.name}</h3>
                                            <span className={`text-xs px-2 py-0.5 rounded-full border ${project.status === 'Done' ? 'bg-emerald-100 text-emerald-700 border-emerald-200' :
                                                project.status === 'Review' ? 'bg-amber-100 text-amber-700 border-amber-200' :
                                                    'bg-brand-100 text-brand-700 border-brand-200'
                                                }`}>
                                                {project.status}
                                            </span>
                                            <span className={`text-xs px-2 py-0.5 rounded-full border ${getPriorityColor(project.priority)}`}>
                                                {project.priority}
                                            </span>
                                        </div>
                                        <div className="flex items-center gap-4 text-sm text-slate-500">
                                            <span className="flex items-center gap-1"><User className="h-3 w-3" /> {project.stakeholder}</span>
                                            <span className="flex items-center gap-1"><Calendar className="h-3 w-3" /> {project.deadline}</span>
                                        </div>
                                    </div>
                                    <button
                                        onClick={() => handleDelete(project.id)}
                                        className="p-2 text-slate-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-all"
                                    >
                                        <Trash2 className="h-4 w-4" />
                                    </button>
                                </div>
                                {project.requirements && (
                                    <div className="mt-4 pt-4 border-t border-slate-100">
                                        <div className="flex items-start gap-2 text-sm text-slate-600">
                                            <FileText className="h-4 w-4 mt-0.5 text-slate-400" />
                                            <p>{project.requirements}</p>
                                        </div>
                                    </div>
                                )}
                            </motion.div>
                        ))}
                    </div>
                </div>
            )}

            {/* Decisions & Blockers Tab */}
            {activeTab === 'decisions' && (
                <div className="space-y-4">
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                        <h4 className="font-semibold text-blue-800 flex items-center gap-2">
                            <AlertTriangle className="h-4 w-4" /> Why track this?
                        </h4>
                        <p className="text-sm text-blue-700 mt-1">
                            Documenting key technical decisions and blockers is critical for the recompete. It proves we are proactive and strategic, not just "order takers."
                        </p>
                    </div>

                    {decisions.map((item) => (
                        <div key={item.id} className="card flex gap-4">
                            <div className={`mt-1 p-2 rounded-lg shrink-0 ${item.type === 'Decision' ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700'}`}>
                                {item.type === 'Decision' ? <CheckCircle2 className="h-5 w-5" /> : <AlertCircle className="h-5 w-5" />}
                            </div>
                            <div className="flex-1">
                                <div className="flex justify-between items-start">
                                    <h3 className="font-semibold text-slate-900">{item.title}</h3>
                                    <span className="text-xs text-slate-500">{item.date}</span>
                                </div>
                                <p className="text-sm text-slate-600 mt-1">{item.description}</p>
                                <div className="mt-3 flex gap-2">
                                    <span className="text-xs font-medium px-2 py-1 bg-slate-100 rounded text-slate-600 border border-slate-200">
                                        {item.status}
                                    </span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Team View Tab */}
            {activeTab === 'team' && (
                <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Will Alston */}
                        <div className="card border-brand-200">
                            <div className="flex items-center gap-3 mb-4 pb-4 border-b border-slate-100">
                                <div className="h-10 w-10 rounded-full bg-brand-700 flex items-center justify-center text-white font-bold">WA</div>
                                <div>
                                    <h3 className="font-bold text-slate-900">Will Alston</h3>
                                    <p className="text-xs text-slate-500">Analytics Lead</p>
                                </div>
                            </div>
                            <div className="space-y-3">
                                <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Active Projects</div>
                                {projects.map(p => (
                                    <div key={p.id} className="flex items-center justify-between text-sm p-2 bg-slate-50 rounded border border-slate-100">
                                        <span className="truncate max-w-[180px]">{p.name}</span>
                                        <span className={`text-[10px] px-1.5 py-0.5 rounded border ${p.status === 'Done' ? 'bg-emerald-50 border-emerald-200 text-emerald-700' : 'bg-brand-50 border-brand-200 text-brand-700'}`}>
                                            {p.status}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Placeholder Teammate */}
                        <div className="card border-slate-200 opacity-75">
                            <div className="flex items-center gap-3 mb-4 pb-4 border-b border-slate-100">
                                <div className="h-10 w-10 rounded-full bg-slate-200 flex items-center justify-center text-slate-500 font-bold">TM</div>
                                <div>
                                    <h3 className="font-bold text-slate-900">Teammate Name</h3>
                                    <p className="text-xs text-slate-500">Analyst / Engineer</p>
                                </div>
                            </div>
                            <div className="flex items-center justify-center h-32 text-slate-400 text-sm border-2 border-dashed border-slate-100 rounded-lg">
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
