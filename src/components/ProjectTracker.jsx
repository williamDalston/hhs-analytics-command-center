import React, { useState } from 'react';
import { Plus, Trash2, Calendar, User, FileText, Briefcase } from 'lucide-react';
import { motion } from 'framer-motion';

const ProjectTracker = () => {
    const [projects, setProjects] = useState([
        {
            id: 1,
            name: 'ASPA Analytics Dashboard (Social & Web)',
            stakeholder: 'Lakshman / Venkata',
            deadline: '2023-12-01',
            status: 'In Progress',
            requirements: 'HHS branded theme. Metrics: Impressions, Engagements, Video Views, Website Clicks. Sources: Sprinklr, GA4.'
        },
        {
            id: 2,
            name: 'Jira Delivery Dashboard',
            stakeholder: 'David Urer / WebFirst',
            deadline: '2023-12-15',
            status: 'Planning',
            requirements: 'Show throughput, cycle time, and blockers. Transparent view for recompete value.'
        },
        {
            id: 3,
            name: 'HHS Social Media Audit',
            stakeholder: 'Caroline / Sogol',
            deadline: '2023-11-30',
            status: 'Review',
            requirements: 'Audit of current social metrics and gaps. Preparation for automated scripts.'
        }
    ]);

    const [isAdding, setIsAdding] = useState(false);
    const [newProject, setNewProject] = useState({
        name: '',
        stakeholder: '',
        deadline: '',
        status: 'Planning',
        requirements: ''
    });

    const handleAdd = (e) => {
        e.preventDefault();
        setProjects([...projects, { ...newProject, id: Date.now() }]);
        setNewProject({ name: '', stakeholder: '', deadline: '', status: 'Planning', requirements: '' });
        setIsAdding(false);
    };

    const handleDelete = (id) => {
        setProjects(projects.filter(p => p.id !== id));
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h2 className="text-2xl font-bold text-slate-900">Project Tracker</h2>
                    <p className="text-slate-600">Manage deliverables for ASPA and WebFirst.</p>
                </div>
                <button
                    onClick={() => setIsAdding(!isAdding)}
                    className="btn-primary"
                >
                    <Plus className="h-4 w-4" /> New Project
                </button>
            </div>

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
    );
};

export default ProjectTracker;
