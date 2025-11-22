import React from 'react';
import { Ruler, Type, Download, Layout, ShieldCheck, Copy } from 'lucide-react';
import { motion } from 'framer-motion';
import { useToast } from '../context/ToastContext';

const colors = [
    { name: 'HHS Blue', hex: '#005EA2', class: 'bg-[#005EA2]', text: 'text-white' },
    { name: 'HHS Navy', hex: '#1A4480', class: 'bg-[#1A4480]', text: 'text-white' },
    { name: 'HHS Gray', hex: '#F0F0F0', class: 'bg-[#F0F0F0]', text: 'text-slate-900' },
    { name: 'Accent Cool', hex: '#73B3E7', class: 'bg-[#73B3E7]', text: 'text-slate-900' },
    { name: 'Accent Warm', hex: '#FA9441', class: 'bg-[#FA9441]', text: 'text-slate-900' },
];

const StyleGuide = () => {
    const { addToast } = useToast();

    const copyColor = (hex, name) => {
        navigator.clipboard.writeText(hex);
        addToast(`Copied ${name} (${hex}) to clipboard`, 'success');
    };

    return (
        <div className="space-y-10">
            <div>
                <h2 className="text-2xl font-bold text-slate-900">HHS Visual Style Guide</h2>
                <p className="text-slate-600">Official colors, typography, and assets for WebFirst deliverables.</p>
            </div>

            {/* Colors Section */}
            <section className="space-y-4">
                <div className="flex items-center gap-2 border-b border-slate-200 pb-2">
                    <Ruler className="h-5 w-5 text-brand-600" />
                    <h3 className="text-lg font-semibold text-slate-800">Brand Colors</h3>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                    {colors.map((color) => (
                        <motion.div
                            key={color.name}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => copyColor(color.hex, color.name)}
                            className="card p-0 overflow-hidden border-0 shadow-sm cursor-pointer group relative"
                        >
                            <div className={`h-24 ${color.class} flex items-center justify-center`}>
                                <span className={`font-mono text-sm ${color.text} opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1`}>
                                    <Copy className="h-3 w-3" /> Copy
                                </span>
                            </div>
                            <div className="p-3 bg-white border-t border-slate-100">
                                <p className="font-semibold text-slate-900 text-sm">{color.name}</p>
                                <p className="text-xs text-slate-400 font-mono">{color.hex}</p>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </section>

            {/* Typography Section */}
            <section className="space-y-4">
                <div className="flex items-center gap-2 border-b border-slate-200 pb-2">
                    <Type className="h-5 w-5 text-brand-600" />
                    <h3 className="text-lg font-semibold text-slate-800">Typography</h3>
                </div>
                <div className="card space-y-6">
                    <div>
                        <p className="text-xs text-slate-400 uppercase tracking-wider mb-2">Primary Font: Source Sans Pro</p>
                        <div className="space-y-4">
                            <div>
                                <h1 className="text-4xl font-bold text-slate-900">Heading 1 (48px)</h1>
                                <p className="text-sm text-slate-500">Used for Page Titles</p>
                            </div>
                            <div>
                                <h2 className="text-2xl font-bold text-slate-900">Heading 2 (30px)</h2>
                                <p className="text-sm text-slate-500">Used for Section Headers</p>
                            </div>
                            <div>
                                <h3 className="text-lg font-semibold text-slate-900">Heading 3 (20px)</h3>
                                <p className="text-sm text-slate-500">Used for Card Titles</p>
                            </div>
                            <div>
                                <p className="text-base text-slate-700 leading-relaxed">
                                    Body Text (16px). This is the standard size for paragraphs, descriptions, and general content.
                                    Ensure high contrast (Slate-700 or darker) for accessibility.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Assets Section */}
            <section className="space-y-4">
                <div className="flex items-center gap-2 border-b border-slate-200 pb-2">
                    <Download className="h-5 w-5 text-brand-600" />
                    <h3 className="text-lg font-semibold text-slate-800">Downloadable Assets</h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="card flex items-center justify-between group cursor-pointer hover:border-brand-300">
                        <div className="flex items-center gap-4">
                            <div className="h-12 w-12 bg-brand-50 rounded-lg flex items-center justify-center text-brand-600">
                                <Layout className="h-6 w-6" />
                            </div>
                            <div>
                                <h4 className="font-semibold text-slate-900">HHS Power BI Template</h4>
                                <p className="text-xs text-slate-500">.PBIT file with Theme & Layouts</p>
                            </div>
                        </div>
                        <Download className="h-5 w-5 text-slate-400 group-hover:text-brand-600" />
                    </div>

                    <div className="card flex items-center justify-between group cursor-pointer hover:border-brand-300">
                        <div className="flex items-center gap-4">
                            <div className="h-12 w-12 bg-brand-50 rounded-lg flex items-center justify-center text-brand-600">
                                <ShieldCheck className="h-6 w-6" />
                            </div>
                            <div>
                                <h4 className="font-semibold text-slate-900">Official Logos Pack</h4>
                                <p className="text-xs text-slate-500">HHS, ASPA, and WebFirst Logos</p>
                            </div>
                        </div>
                        <Download className="h-5 w-5 text-slate-400 group-hover:text-brand-600" />
                    </div>
                </div>
            </section>
        </div>
    );
};

export default StyleGuide;
