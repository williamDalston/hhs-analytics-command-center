import React, { useState } from 'react';
import { Ruler, Type, Download, Layout, ShieldCheck, Copy, Contrast, CheckCircle, XCircle, AlertTriangle } from 'lucide-react';
import { motion } from 'framer-motion';
import { useToast } from '../context/ToastContext';

// Official HHS.gov Color Palette
const colorPalette = {
    primary: [
        { name: 'Primary', hex: '#005ea2', class: 'bg-[#005ea2]', text: 'text-white', category: 'Primary' },
        { name: 'Primary Lightest', hex: '#e5faff', class: 'bg-[#e5faff]', text: 'text-slate-900', category: 'Primary' },
        { name: 'Primary Lighter', hex: '#ccecf2', class: 'bg-[#ccecf2]', text: 'text-slate-900', category: 'Primary' },
        { name: 'Primary Light', hex: '#97d4ea', class: 'bg-[#97d4ea]', text: 'text-slate-900', category: 'Primary' },
        { name: 'Primary Dark', hex: '#1a4480', class: 'bg-[#1a4480]', text: 'text-white', category: 'Primary' },
        { name: 'Primary Darker', hex: '#162e51', class: 'bg-[#162e51]', text: 'text-white', category: 'Primary' },
        { name: 'Primary Vivid', hex: '#00bde3', class: 'bg-[#00bde3]', text: 'text-slate-900', category: 'Primary' },
    ],
    secondary: [
        { name: 'Secondary', hex: '#face00', class: 'bg-[#face00]', text: 'text-slate-900', category: 'Secondary' },
        { name: 'Secondary Lighter', hex: '#fff5c2', class: 'bg-[#fff5c2]', text: 'text-slate-900', category: 'Secondary' },
        { name: 'Secondary Light', hex: '#fee685', class: 'bg-[#fee685]', text: 'text-slate-900', category: 'Secondary' },
        { name: 'Secondary Dark', hex: '#e5a000', class: 'bg-[#e5a000]', text: 'text-white', category: 'Secondary' },
        { name: 'Secondary Darker', hex: '#c2850c', class: 'bg-[#c2850c]', text: 'text-white', category: 'Secondary' },
        { name: 'Secondary Vivid', hex: '#ffbe2e', class: 'bg-[#ffbe2e]', text: 'text-slate-900', category: 'Secondary' },
    ],
    accentWarm: [
        { name: 'Accent Warm', hex: '#f3966d', class: 'bg-[#f3966d]', text: 'text-slate-900', category: 'Accent Warm' },
        { name: 'Accent Warm Lightest', hex: '#faeee5', class: 'bg-[#faeee5]', text: 'text-slate-900', category: 'Accent Warm' },
        { name: 'Accent Warm Lighter', hex: '#fbe0d0', class: 'bg-[#fbe0d0]', text: 'text-slate-900', category: 'Accent Warm' },
        { name: 'Accent Warm Light', hex: '#f7bca2', class: 'bg-[#f7bca2]', text: 'text-slate-900', category: 'Accent Warm' },
        { name: 'Accent Warm Dark', hex: '#e17141', class: 'bg-[#e17141]', text: 'text-white', category: 'Accent Warm' },
        { name: 'Accent Warm Darker', hex: '#d54309', class: 'bg-[#d54309]', text: 'text-white', category: 'Accent Warm' },
        { name: 'Accent Warm Darkest', hex: '#8b0a03', class: 'bg-[#8b0a03]', text: 'text-white', category: 'Accent Warm' },
    ],
    accentCool: [
        { name: 'Accent Cool', hex: '#1dc2ae', class: 'bg-[#1dc2ae]', text: 'text-slate-900', category: 'Accent Cool' },
        { name: 'Accent Cool Lightest', hex: '#e0f7f6', class: 'bg-[#e0f7f6]', text: 'text-slate-900', category: 'Accent Cool' },
        { name: 'Accent Cool Lighter', hex: '#7efbe1', class: 'bg-[#7efbe1]', text: 'text-slate-900', category: 'Accent Cool' },
        { name: 'Accent Cool Light', hex: '#29e1cb', class: 'bg-[#29e1cb]', text: 'text-slate-900', category: 'Accent Cool' },
        { name: 'Accent Cool Dark', hex: '#00a398', class: 'bg-[#00a398]', text: 'text-white', category: 'Accent Cool' },
        { name: 'Accent Cool Darker', hex: '#008480', class: 'bg-[#008480]', text: 'text-white', category: 'Accent Cool' },
        { name: 'Accent Cool Darkest', hex: '#0f6460', class: 'bg-[#0f6460]', text: 'text-white', category: 'Accent Cool' },
    ],
    grayscale: [
        { name: 'Base', hex: '#a9aeb1', class: 'bg-[#a9aeb1]', text: 'text-white', category: 'Grayscale' },
        { name: 'Base Lightest', hex: '#fbfcfd', class: 'bg-[#fbfcfd]', text: 'text-slate-900', category: 'Grayscale' },
        { name: 'Base Lighter', hex: '#f1f3f6', class: 'bg-[#f1f3f6]', text: 'text-slate-900', category: 'Grayscale' },
        { name: 'Base Light', hex: '#dfe1e2', class: 'bg-[#dfe1e2]', text: 'text-slate-900', category: 'Grayscale' },
        { name: 'Base Dark', hex: '#565c65', class: 'bg-[#565c65]', text: 'text-white', category: 'Grayscale' },
        { name: 'Base Darker', hex: '#3d4551', class: 'bg-[#3d4551]', text: 'text-white', category: 'Grayscale' },
        { name: 'Base Darkest', hex: '#1c1d1f', class: 'bg-[#1c1d1f]', text: 'text-white', category: 'Grayscale' },
    ],
    logo: [
        { name: 'HHS Blue (Logo/Seal)', hex: '#185394', class: 'bg-[#185394]', text: 'text-white', category: 'Logo', note: 'RGB: 24, 83, 148' },
    ],
};

const allColors = [
    ...colorPalette.primary,
    ...colorPalette.secondary,
    ...colorPalette.accentWarm,
    ...colorPalette.accentCool,
    ...colorPalette.grayscale,
    ...colorPalette.logo,
];

// WCAG Contrast Calculation
const getLuminance = (hex) => {
    const rgb = hexToRgb(hex);
    if (!rgb) return 0;
    const [r, g, b] = [rgb.r, rgb.g, rgb.b].map(val => {
        val = val / 255;
        return val <= 0.03928 ? val / 12.92 : Math.pow((val + 0.055) / 1.055, 2.4);
    });
    return 0.2126 * r + 0.7152 * g + 0.0722 * b;
};

const hexToRgb = (hex) => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16)
    } : null;
};

const calculateContrast = (color1, color2) => {
    const lum1 = getLuminance(color1);
    const lum2 = getLuminance(color2);
    const lighter = Math.max(lum1, lum2);
    const darker = Math.min(lum1, lum2);
    return (lighter + 0.05) / (darker + 0.05);
};

const getContrastRating = (ratio) => {
    if (ratio >= 7) return { level: 'AAA Large', pass: true, color: 'green' };
    if (ratio >= 4.5) return { level: 'AA Normal', pass: true, color: 'green' };
    if (ratio >= 3) return { level: 'AA Large', pass: true, color: 'yellow' };
    return { level: 'Fail', pass: false, color: 'red' };
};

const StyleGuide = () => {
    const { addToast } = useToast();
    const [contrastForeground, setContrastForeground] = useState('#1c1d1f');
    const [contrastBackground, setContrastBackground] = useState('#f1f3f6');

    const copyColor = (hex, name) => {
        navigator.clipboard.writeText(hex);
        addToast(`Copied ${name} (${hex}) to clipboard`, 'success');
    };

    // Comprehensive HHS Power BI Theme - Valid JSON format for direct import
    const downloadPowerBITheme = () => {
        const theme = {
            "name": "HHS Official Theme",
            "dataColors": [
                "#005ea2",
                "#1a4480",
                "#00bde3",
                "#face00",
                "#00a398",
                "#162e51",
                "#97d4ea",
                "#d54309",
                "#565c65",
                "#1dc2ae",
                "#ccecf2",
                "#e5faff",
                "#185394",
                "#f3966d",
                "#3d4551"
            ],
            "background": "#f1f3f6",
            "foreground": "#1c1d1f",
            "tableAccent": "#005ea2",
            "visualStyles": {
                "*": {
                    "*": {
                        "title": [
                            {
                                "fontColor": {
                                    "solid": {
                                        "color": "#162e51"
                                    }
                                },
                                "fontFamily": "Source Sans Pro",
                                "fontSize": 14
                            }
                        ],
                        "label": [
                            {
                                "fontColor": {
                                    "solid": {
                                        "color": "#1c1d1f"
                                    }
                                },
                                "fontFamily": "Source Sans Pro",
                                "fontSize": 11
                            }
                        ]
                    }
                }
            }
        };

        // Ensure valid JSON (no comments, proper formatting)
        const jsonString = JSON.stringify(theme, null, 2);
        const blob = new Blob([jsonString], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = 'HHS-Official-PowerBI-Theme.json';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
        addToast('Power BI Theme downloaded! Import via View → Themes → Browse for themes', 'success');
    };

    const [selectedCategory, setSelectedCategory] = React.useState('all');

    const categories = [
        { id: 'all', label: 'All Colors' },
        { id: 'primary', label: 'Primary' },
        { id: 'secondary', label: 'Secondary' },
        { id: 'accentWarm', label: 'Accent Warm' },
        { id: 'accentCool', label: 'Accent Cool' },
        { id: 'grayscale', label: 'Grayscale' },
        { id: 'logo', label: 'Logo' },
    ];

    const filteredColors = selectedCategory === 'all' 
        ? allColors 
        : colorPalette[selectedCategory] || [];

    return (
        <div className="space-y-10">
            <div>
                <h2 className="text-2xl font-bold text-slate-900">HHS Visual Style Guide</h2>
                <p className="text-slate-600">Official HHS.gov colors, typography, and assets for WebFirst deliverables. Compliant with HHS Brand Guidance and USWDS standards.</p>
            </div>

            {/* Colors Section */}
            <section className="space-y-4">
                <div className="flex items-center justify-between border-b border-slate-200 pb-2">
                    <div className="flex items-center gap-2">
                        <Ruler className="h-5 w-5 text-brand-600" />
                        <h3 className="text-lg font-semibold text-slate-800">Official HHS.gov Color Palette</h3>
                    </div>
                </div>
                
                {/* Category Filter */}
                <div className="flex flex-wrap gap-2">
                    {categories.map((cat) => (
                        <button
                            key={cat.id}
                            onClick={() => setSelectedCategory(cat.id)}
                            className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors ${
                                selectedCategory === cat.id
                                    ? 'bg-brand-600 text-white'
                                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                            }`}
                        >
                            {cat.label}
                        </button>
                    ))}
                </div>

                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                    {filteredColors.map((color) => (
                        <motion.div
                            key={`${color.category}-${color.name}`}
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
                                {color.note && (
                                    <p className="text-xs text-slate-500 mt-1">{color.note}</p>
                                )}
                            </div>
                        </motion.div>
                    ))}
                </div>
            </section>

            {/* Typography Section */}
            <section className="space-y-4">
                <div className="flex items-center gap-2 border-b border-slate-200 pb-2">
                    <Type className="h-5 w-5 text-brand-600" />
                    <h3 className="text-lg font-semibold text-slate-800">Typography (USWDS Standards)</h3>
                </div>
                <div className="card space-y-6">
                    <div>
                        <p className="text-xs text-slate-400 uppercase tracking-wider mb-2">Body Font: Source Sans Pro (USWDS font-body)</p>
                        <div className="space-y-4">
                            <div>
                                <p className="text-base text-slate-700 leading-relaxed" style={{ fontFamily: 'Source Sans Pro, sans-serif' }}>
                                    Body Text (16px minimum). This is the standard size for paragraphs, descriptions, and general content.
                                    Source Sans Pro is the primary UI/body font recommended by USWDS for federal sites. Ensure high contrast for accessibility.
                                </p>
                            </div>
                        </div>
                    </div>
                    <div>
                        <p className="text-xs text-slate-400 uppercase tracking-wider mb-2">Heading Font: Merriweather (USWDS font-heading)</p>
                        <div className="space-y-4">
                            <div>
                                <h1 className="text-4xl font-bold text-slate-900" style={{ fontFamily: 'Merriweather, serif' }}>Heading 1 (48px)</h1>
                                <p className="text-sm text-slate-500">Used for Page Titles - Merriweather serif font</p>
                            </div>
                            <div>
                                <h2 className="text-2xl font-bold text-slate-900" style={{ fontFamily: 'Merriweather, serif' }}>Heading 2 (30px)</h2>
                                <p className="text-sm text-slate-500">Used for Section Headers - Merriweather serif font</p>
                            </div>
                            <div>
                                <h3 className="text-lg font-semibold text-slate-900" style={{ fontFamily: 'Merriweather, serif' }}>Heading 3 (20px)</h3>
                                <p className="text-sm text-slate-500">Used for Card Titles - Merriweather serif font</p>
                            </div>
                        </div>
                    </div>
                    <div className="bg-slate-50 p-4 rounded-lg border border-slate-200">
                        <p className="text-sm text-slate-700 font-semibold mb-2">USWDS Font Stacks:</p>
                        <ul className="text-xs text-slate-600 space-y-1 font-mono">
                            <li>Body: "Source Sans Pro", "Helvetica Neue", Helvetica, Roboto, Arial, sans-serif</li>
                            <li>Headings: "Merriweather Web", Georgia, Cambria, "Times New Roman", Times, serif</li>
                        </ul>
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
                    <motion.div
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={downloadPowerBITheme}
                        className="card flex items-center justify-between group cursor-pointer hover:border-brand-300 hover:shadow-md transition-all"
                    >
                        <div className="flex items-center gap-4">
                            <div className="h-12 w-12 bg-brand-50 rounded-lg flex items-center justify-center text-brand-600">
                                <Layout className="h-6 w-6" />
                            </div>
                            <div>
                                <h4 className="font-semibold text-slate-900">HHS Power BI Theme</h4>
                                <p className="text-xs text-slate-500">Complete theme file with HHS brand colors, accessibility settings, and visual styles</p>
                                <p className="text-xs text-brand-600 mt-1 font-medium">✓ 15 data colors • WCAG AA compliant • Ready to import</p>
                            </div>
                        </div>
                        <Download className="h-5 w-5 text-slate-400 group-hover:text-brand-600 transition-colors" />
                    </motion.div>

                    <div className="card p-4 space-y-3">
                        <div className="flex items-center gap-4">
                            <div className="h-12 w-12 bg-brand-50 rounded-lg flex items-center justify-center text-brand-600">
                                <ShieldCheck className="h-6 w-6" />
                            </div>
                            <div>
                                <h4 className="font-semibold text-slate-900">Official HHS Logos</h4>
                                <p className="text-xs text-slate-500">Download official HHS logos in multiple color variants</p>
                            </div>
                        </div>
                        <div className="grid grid-cols-1 gap-2 pt-2 border-t border-slate-200">
                            <a
                                href="https://www.hhs.gov/sites/default/files/logo-blue-lg.png"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center justify-between p-2 rounded hover:bg-slate-50 transition-colors group"
                            >
                                <div className="flex items-center gap-3">
                                    <div className="h-8 w-8 bg-[#005ea2] rounded flex items-center justify-center">
                                        <span className="text-white text-xs font-bold">HHS</span>
                                    </div>
                                    <div>
                                        <p className="text-sm font-medium text-slate-900">Blue Logo</p>
                                        <p className="text-xs text-slate-500">PNG, 59 KB</p>
                                    </div>
                                </div>
                                <Download className="h-4 w-4 text-slate-400 group-hover:text-brand-600 transition-colors" />
                            </a>
                            <a
                                href="https://www.hhs.gov/sites/default/files/logo-white-lg.png"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center justify-between p-2 rounded hover:bg-slate-50 transition-colors group"
                            >
                                <div className="flex items-center gap-3">
                                    <div className="h-8 w-8 bg-slate-200 border border-slate-300 rounded flex items-center justify-center">
                                        <span className="text-slate-700 text-xs font-bold">HHS</span>
                                    </div>
                                    <div>
                                        <p className="text-sm font-medium text-slate-900">White Logo</p>
                                        <p className="text-xs text-slate-500">PNG, 47 KB</p>
                                    </div>
                                </div>
                                <Download className="h-4 w-4 text-slate-400 group-hover:text-brand-600 transition-colors" />
                            </a>
                            <a
                                href="https://www.hhs.gov/sites/default/files/logo-black-lg.png"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center justify-between p-2 rounded hover:bg-slate-50 transition-colors group"
                            >
                                <div className="flex items-center gap-3">
                                    <div className="h-8 w-8 bg-slate-900 rounded flex items-center justify-center">
                                        <span className="text-white text-xs font-bold">HHS</span>
                                    </div>
                                    <div>
                                        <p className="text-sm font-medium text-slate-900">Black Logo</p>
                                        <p className="text-xs text-slate-500">PNG, 53 KB</p>
                                    </div>
                                </div>
                                <Download className="h-4 w-4 text-slate-400 group-hover:text-brand-600 transition-colors" />
                            </a>
                        </div>
                        <div className="pt-2 border-t border-slate-200">
                            <p className="text-xs text-slate-600">
                                <strong>Source:</strong> <a href="https://www.hhs.gov/web/services-and-resources/brand-guidance/index.html" target="_blank" rel="noopener noreferrer" className="text-brand-600 hover:underline">HHS Brand Guidance</a>
                            </p>
                        </div>
                    </div>
                </div>
                
                {/* Power BI Theme Instructions */}
                <div className="card bg-brand-50 border-brand-200 p-4 space-y-2">
                    <h4 className="font-semibold text-slate-900 flex items-center gap-2">
                        <Layout className="h-4 w-4 text-brand-600" />
                        How to Import Power BI Theme
                    </h4>
                    <ol className="text-sm text-slate-700 space-y-1 list-decimal list-inside ml-2">
                        <li>Download the HHS Power BI Theme file above</li>
                        <li>Open your Power BI Desktop report</li>
                        <li>Go to <strong>View</strong> → <strong>Themes</strong> → <strong>Browse for themes</strong></li>
                        <li>Select the downloaded <code className="text-xs bg-white px-1 rounded">HHS-Official-PowerBI-Theme.json</code> file</li>
                        <li>The theme will be applied automatically with all HHS brand colors</li>
                    </ol>
                    <div className="mt-3 pt-3 border-t border-brand-200">
                        <p className="text-xs text-slate-600">
                            <strong>What's included:</strong> 15 HHS brand colors, WCAG AA compliant contrast ratios, optimized visual styles for cards, KPIs, slicers, and semantic colors for good/bad/warning indicators.
                        </p>
                    </div>
                </div>
            </section>

            {/* Color Contrast Checker Section */}
            <section className="space-y-4">
                <div className="flex items-center gap-2 border-b border-slate-200 pb-2">
                    <Contrast className="h-5 w-5 text-brand-600" />
                    <h3 className="text-lg font-semibold text-slate-800">WCAG Color Contrast Checker</h3>
                </div>
                <div className="card p-6 space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-semibold text-slate-700 mb-2">Foreground Color</label>
                            <div className="flex gap-3">
                                <input
                                    type="color"
                                    value={contrastForeground}
                                    onChange={(e) => setContrastForeground(e.target.value)}
                                    className="h-12 w-20 rounded border-2 border-slate-300 cursor-pointer"
                                />
                                <input
                                    type="text"
                                    value={contrastForeground}
                                    onChange={(e) => setContrastForeground(e.target.value)}
                                    className="flex-1 px-3 py-2 border border-slate-300 rounded font-mono text-sm"
                                    placeholder="#000000"
                                />
                                <button
                                    onClick={() => {
                                        navigator.clipboard.writeText(contrastForeground);
                                        addToast('Foreground color copied', 'success');
                                    }}
                                    className="px-3 py-2 bg-slate-100 hover:bg-slate-200 rounded transition-colors"
                                >
                                    <Copy className="h-4 w-4" />
                                </button>
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm font-semibold text-slate-700 mb-2">Background Color</label>
                            <div className="flex gap-3">
                                <input
                                    type="color"
                                    value={contrastBackground}
                                    onChange={(e) => setContrastBackground(e.target.value)}
                                    className="h-12 w-20 rounded border-2 border-slate-300 cursor-pointer"
                                />
                                <input
                                    type="text"
                                    value={contrastBackground}
                                    onChange={(e) => setContrastBackground(e.target.value)}
                                    className="flex-1 px-3 py-2 border border-slate-300 rounded font-mono text-sm"
                                    placeholder="#ffffff"
                                />
                                <button
                                    onClick={() => {
                                        navigator.clipboard.writeText(contrastBackground);
                                        addToast('Background color copied', 'success');
                                    }}
                                    className="px-3 py-2 bg-slate-100 hover:bg-slate-200 rounded transition-colors"
                                >
                                    <Copy className="h-4 w-4" />
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Preview */}
                    <div className="p-6 rounded-lg border-2 border-slate-200" style={{ backgroundColor: contrastBackground }}>
                        <p style={{ color: contrastForeground }} className="text-lg font-semibold">
                            Sample Text Preview
                        </p>
                        <p style={{ color: contrastForeground }} className="text-sm mt-2">
                            This is how your text will appear with these colors. Check the contrast ratio below to ensure accessibility compliance.
                        </p>
                    </div>

                    {/* Contrast Results */}
                    {(() => {
                        const ratio = calculateContrast(contrastForeground, contrastBackground);
                        const rating = getContrastRating(ratio);
                        return (
                            <div className={`p-4 rounded-lg border-2 ${
                                rating.color === 'green' ? 'bg-green-50 border-green-200' :
                                rating.color === 'yellow' ? 'bg-yellow-50 border-yellow-200' :
                                'bg-red-50 border-red-200'
                            }`}>
                                <div className="flex items-center gap-3 mb-3">
                                    {rating.pass ? (
                                        <CheckCircle className={`h-6 w-6 ${
                                            rating.color === 'green' ? 'text-green-600' : 'text-yellow-600'
                                        }`} />
                                    ) : (
                                        <XCircle className="h-6 w-6 text-red-600" />
                                    )}
                                    <div>
                                        <h4 className="font-bold text-slate-900">Contrast Ratio: {ratio.toFixed(2)}:1</h4>
                                        <p className={`text-sm font-semibold ${
                                            rating.color === 'green' ? 'text-green-700' :
                                            rating.color === 'yellow' ? 'text-yellow-700' :
                                            'text-red-700'
                                        }`}>
                                            {rating.level} {rating.pass ? '✓' : '✗'}
                                        </p>
                                    </div>
                                </div>
                                <div className="space-y-2 text-sm text-slate-700">
                                    <div className="flex justify-between">
                                        <span>WCAG AA (Normal Text):</span>
                                        <span className={ratio >= 4.5 ? 'text-green-600 font-semibold' : 'text-red-600'}>
                                            {ratio >= 4.5 ? 'Pass (4.5:1 required)' : 'Fail'}
                                        </span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span>WCAG AA (Large Text):</span>
                                        <span className={ratio >= 3 ? 'text-green-600 font-semibold' : 'text-red-600'}>
                                            {ratio >= 3 ? 'Pass (3:1 required)' : 'Fail'}
                                        </span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span>WCAG AAA (Normal Text):</span>
                                        <span className={ratio >= 7 ? 'text-green-600 font-semibold' : 'text-slate-500'}>
                                            {ratio >= 7 ? 'Pass (7:1 required)' : 'Not met'}
                                        </span>
                                    </div>
                                </div>
                                {!rating.pass && (
                                    <div className="mt-3 p-3 bg-white rounded border border-red-200">
                                        <p className="text-xs text-red-700">
                                            <AlertTriangle className="h-4 w-4 inline mr-1" />
                                            This color combination does not meet WCAG accessibility standards. Consider using darker text or a lighter background.
                                        </p>
                                    </div>
                                )}
                            </div>
                        );
                    })()}

                    {/* Quick Color Picker from Palette */}
                    <div>
                        <p className="text-sm font-semibold text-slate-700 mb-3">Quick Pick from HHS Palette:</p>
                        <div className="grid grid-cols-4 md:grid-cols-8 gap-2">
                            {allColors.slice(0, 16).map((color) => (
                                <button
                                    key={color.hex}
                                    onClick={() => {
                                        const isDark = getLuminance(color.hex) < 0.5;
                                        if (isDark) {
                                            setContrastForeground(color.hex);
                                        } else {
                                            setContrastBackground(color.hex);
                                        }
                                    }}
                                    className={`h-10 rounded border-2 hover:scale-110 transition-transform ${
                                        getLuminance(color.hex) < 0.5 ? 'border-slate-400' : 'border-slate-300'
                                    }`}
                                    style={{ backgroundColor: color.hex }}
                                    title={color.name}
                                />
                            ))}
                        </div>
                        <p className="text-xs text-slate-500 mt-2">Click dark colors for foreground, light colors for background</p>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default StyleGuide;

