import React, { useState, useEffect } from 'react';
import { CheckCircle, Circle, BookOpen, ChevronDown, ChevronUp, Trophy } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const sprintDays = [
    {
        day: 1,
        title: "Core Desktop & First Two Models",
        goal: "Be totally comfortable moving around Power BI Desktop and building a basic star schema.",
        tasks: [
            "Rebuild SocialMetrics model cleanly (DimDate, DimPlatform, etc.)",
            "Build one simple model from sample data (Fact + 2-3 Dims)",
            "Create HHS_Executive_OnePager.pbit (Trust bar, header, filters)"
        ]
    },
    {
        day: 2,
        title: "Messy Data & Power Query Pipeline",
        goal: "Treat Power Query like a pipeline you can explain step-by-step.",
        tasks: [
            "Find or create a truly messy file (mixed types, junk rows)",
            "Practice standard cleaning pipeline (Headers -> Types -> Split -> Unpivot)",
            "Save 'Cleaning Template' script/checklist in OneNote"
        ]
    },
    {
        day: 3,
        title: "Modeling Patterns (Jira & GA4)",
        goal: "Be fluent in star schema patterns and explain 'why' to anyone.",
        tasks: [
            "Draft Jira model (FactIssues + DimStatus, DimPriority, etc.)",
            "Draft GA4/Web Traffic model (FactWebTraffic + DimDate, DimSource)",
            "Document the 'One fact, many dimensions' pattern"
        ]
    },
    {
        day: 4,
        title: "Web/API Connections Pattern",
        goal: "Know exactly how to go from REST API -> Power Query -> Tables.",
        tasks: [
            "Practice with an open API (Get Data -> Web -> Advanced)",
            "Master Json.Document(Web.Contents(...))",
            "Write reusable 'API -> Model Script' template"
        ]
    },
    {
        day: 5,
        title: "DAX Deep Dive",
        goal: "Have a small 'DAX toolbox' you can reuse and explain.",
        tasks: [
            "Create core patterns: CALCULATE, DATESYTD, DIVIDE, VAR/RETURN",
            "Write mini 'DAX Explainer' (How CALCULATE works)",
            "Implement 'Top Platform by Engagement' using TOPN"
        ]
    },
    {
        day: 6,
        title: "Front-End Templates & HHS Polish",
        goal: "Have 2-3 reusable report layouts ready for any dataset.",
        tasks: [
            "Build 'Executive Overview' template (.pbit)",
            "Build 'Operations / Delivery View' template (for Jira)",
            "Build 'Diagnostic View' template (for web/social)"
        ]
    },
    {
        day: 7,
        title: "Capstone & Teaching Mode",
        goal: "Prove to yourself you can explain this end-to-end like an expert.",
        tasks: [
            "Pick one scenario (ASPA Social or Jira Delivery)",
            "Build from scratch: Raw Data -> Clean -> Model -> DAX -> Visuals",
            "Document the process as a 'From Raw Data to Dashboard' tutorial"
        ]
    }
];

const getInitialSprintState = () => {
    if (typeof window === 'undefined') return {};
    const saved = localStorage.getItem('pbi-mastery-sprint');
    try {
        return saved ? JSON.parse(saved) : {};
    } catch (error) {
        console.warn('Failed to parse mastery sprint progress', error);
        return {};
    }
};

const MasterySprint = () => {
    const [completedTasks, setCompletedTasks] = useState(getInitialSprintState);
    const [expandedDay, setExpandedDay] = useState(1);

    useEffect(() => {
        if (typeof window === 'undefined') return;
        localStorage.setItem('pbi-mastery-sprint', JSON.stringify(completedTasks));
    }, [completedTasks]);

    const toggleTask = (day, taskIdx) => {
        const key = `${day}-${taskIdx}`;
        setCompletedTasks(prev => ({
            ...prev,
            [key]: !prev[key]
        }));
    };

    const getDayProgress = (day) => {
        const dayData = sprintDays.find(d => d.day === day);
        const total = dayData.tasks.length;
        const completed = dayData.tasks.filter((_, idx) => completedTasks[`${day}-${idx}`]).length;
        return { completed, total, percent: Math.round((completed / total) * 100) };
    };

    const totalProgress = Math.round(
        (Object.values(completedTasks).filter(Boolean).length /
            sprintDays.reduce((acc, day) => acc + day.tasks.length, 0)) * 100
    );

    return (
        <div className="space-y-8">
            <div className="flex justify-between items-end">
                <div>
                    <h2 className="text-2xl font-bold text-slate-900">7-Day Mastery Sprint</h2>
                    <p className="text-slate-600">From Power BI User to Analytics Lead in one week.</p>
                </div>
                <div className="text-right">
                    <div className="text-3xl font-bold text-brand-600">{totalProgress}%</div>
                    <div className="text-xs text-slate-500 uppercase tracking-wider font-semibold">Total Completion</div>
                </div>
            </div>

            <div className="space-y-4">
                {sprintDays.map((day) => {
                    const progress = getDayProgress(day.day);
                    const isComplete = progress.percent === 100;
                    const isExpanded = expandedDay === day.day;

                    return (
                        <motion.div
                            key={day.day}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className={`card transition-all duration-300 ${isComplete ? 'border-emerald-200 bg-emerald-50/30' : ''}`}
                        >
                            <div
                                onClick={() => setExpandedDay(isExpanded ? null : day.day)}
                                className="flex items-center justify-between cursor-pointer"
                            >
                                <div className="flex items-center gap-4">
                                    <div className={`h-10 w-10 rounded-full flex items-center justify-center font-bold text-lg shrink-0
                                        ${isComplete ? 'bg-emerald-100 text-emerald-700' : 'bg-brand-100 text-brand-700'}`}>
                                        {isComplete ? <CheckCircle className="h-6 w-6" /> : day.day}
                                    </div>
                                    <div>
                                        <h3 className="text-lg font-semibold text-slate-900">{day.title}</h3>
                                        <p className="text-sm text-slate-500">{day.goal}</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-4">
                                    <div className="w-24 h-2 bg-slate-100 rounded-full overflow-hidden hidden lg:block">
                                        <div
                                            className={`h-full transition-all duration-500 ${isComplete ? 'bg-emerald-500' : 'bg-brand-500'}`}
                                            style={{ width: `${progress.percent}%` }}
                                        />
                                    </div>
                                    {isExpanded ? <ChevronUp className="h-5 w-5 text-slate-400" /> : <ChevronDown className="h-5 w-5 text-slate-400" />}
                                </div>
                            </div>

                            <AnimatePresence>
                                {isExpanded && (
                                    <motion.div
                                        initial={{ height: 0, opacity: 0 }}
                                        animate={{ height: 'auto', opacity: 1 }}
                                        exit={{ height: 0, opacity: 0 }}
                                        className="overflow-hidden"
                                    >
                                        <div className="pt-6 pl-14 space-y-3">
                                            {day.tasks.map((task, idx) => (
                                                <div
                                                    key={idx}
                                                    onClick={() => toggleTask(day.day, idx)}
                                                    className="flex items-start gap-3 cursor-pointer group"
                                                >
                                                    <div className={`mt-0.5 transition-colors ${completedTasks[`${day.day}-${idx}`] ? 'text-emerald-600' : 'text-slate-300 group-hover:text-brand-400'
                                                        }`}>
                                                        {completedTasks[`${day.day}-${idx}`] ?
                                                            <CheckCircle className="h-5 w-5" /> :
                                                            <Circle className="h-5 w-5" />
                                                        }
                                                    </div>
                                                    <span className={`text-sm transition-colors ${completedTasks[`${day.day}-${idx}`] ? 'text-slate-400 line-through' : 'text-slate-700'
                                                        }`}>
                                                        {task}
                                                    </span>
                                                </div>
                                            ))}
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </motion.div>
                    );
                })}
            </div>

            {totalProgress === 100 && (
                <motion.div
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="bg-gradient-to-r from-amber-100 to-orange-100 border border-amber-200 rounded-xl p-8 text-center"
                >
                    <Trophy className="h-12 w-12 text-amber-600 mx-auto mb-4" />
                    <h3 className="text-2xl font-bold text-amber-900 mb-2">Sprint Completed!</h3>
                    <p className="text-amber-800">
                        You&apos;ve completed the 7-Day Mastery Sprint. You are now ready to lead HHS Analytics with confidence.
                    </p>
                </motion.div>
            )}
        </div>
    );
};

export default MasterySprint;
