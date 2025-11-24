import React from 'react';
import { Ruler, Type, Download, Layout, ShieldCheck, Copy } from 'lucide-react';
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

const StyleGuide = () => {
    const { addToast } = useToast();

    const copyColor = (hex, name) => {
        navigator.clipboard.writeText(hex);
        addToast(`Copied ${name} (${hex}) to clipboard`, 'success');
    };

    // Comprehensive HHS Power BI Theme
    const downloadPowerBITheme = () => {
        const theme = {
            "name": "HHS Official Theme",
            "version": "1.0.0",
            "description": "Official HHS.gov Power BI theme with brand colors, accessibility compliance, and best practices",
            "dataColors": [
                "#005ea2",  // Primary Blue
                "#1a4480",  // Primary Dark (Navy)
                "#00bde3",  // Primary Vivid (Cyan)
                "#face00",  // Secondary (Yellow)
                "#00a398",  // Accent Cool
                "#162e51",  // Primary Darker
                "#97d4ea",  // Primary Light
                "#d54309",  // Accent Warm Darker (for alerts/negative)
                "#565c65",  // Base Dark
                "#1dc2ae",  // Accent Cool
                "#ccecf2",  // Primary Lighter
                "#e5faff",  // Primary Lightest
                "#185394",  // HHS Blue (Logo)
                "#f3966d",  // Accent Warm
                "#3d4551"   // Base Darker
            ],
            "background": "#f1f3f6",
            "foreground": "#1c1d1f",
            "tableAccentColor": "#005ea2",
            "visualStyles": {
                "*": {
                    "*": {
                        "background": [
                            {
                                "transparency": 0,
                                "color": {
                                    "solid": {
                                        "color": "#ffffff"
                                    }
                                }
                            }
                        ],
                        "border": [
                            {
                                "show": false
                            }
                        ],
                        "title": [
                            {
                                "show": true,
                                "fontColor": {
                                    "solid": {
                                        "color": "#162e51"
                                    }
                                },
                                "fontFamily": "Source Sans Pro",
                                "fontSize": 14,
                                "alignment": "left"
                            }
                        ],
                        "dataLabels": [
                            {
                                "show": true,
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
                },
                "card": {
                    "*": {
                        "card": {
                            "outline": "None",
                            "outlineColor": {
                                "solid": {
                                    "color": "#dfe1e2"
                                }
                            },
                            "backgroundColor": {
                                "solid": {
                                    "color": "#ffffff"
                                }
                            },
                            "foregroundColor": {
                                "solid": {
                                    "color": "#1c1d1f"
                                }
                            },
                            "fontFamily": "Source Sans Pro"
                        }
                    }
                },
                "kpi": {
                    "*": {
                        "kpiIndicator": {
                            "fontFamily": "Source Sans Pro"
                        }
                    }
                },
                "slicer": {
                    "*": {
                        "general": {
                            "outlineColor": {
                                "solid": {
                                    "color": "#dfe1e2"
                                }
                            },
                            "selectedItemColor": {
                                "solid": {
                                    "color": "#005ea2"
                                }
                            },
                            "fontColor": {
                                "solid": {
                                    "color": "#1c1d1f"
                                }
                            },
                            "fontFamily": "Source Sans Pro"
                        }
                    }
                },
                "page": {
                    "*": {
                        "background": [
                            {
                                "transparency": 0,
                                "color": {
                                    "solid": {
                                        "color": "#f1f3f6"
                                    }
                                }
                            }
                        ]
                    }
                }
            },
            "outspace": [
                {
                    "visualType": "slicer",
                    "outspacePaneColor": {
                        "solid": {
                            "color": "#ffffff"
                        }
                    },
                    "outspacePaneTextColor": {
                        "solid": {
                            "color": "#1c1d1f"
                        }
                    }
                }
            ],
            "semanticColors": {
                "primaryTextColor": {
                    "solid": {
                        "color": "#1c1d1f"
                    }
                },
                "secondaryTextColor": {
                    "solid": {
                        "color": "#565c65"
                    }
                },
                "emphasisColor": {
                    "solid": {
                        "color": "#005ea2"
                    }
                },
                "goodColor": {
                    "solid": {
                        "color": "#00a398"
                    }
                },
                "neutralColor": {
                    "solid": {
                        "color": "#dfe1e2"
                    }
                },
                "warningColor": {
                    "solid": {
                        "color": "#face00"
                    }
                },
                "badColor": {
                    "solid": {
                        "color": "#d54309"
                    }
                }
            }
        };

        const blob = new Blob([JSON.stringify(theme, null, 2)], { type: 'application/json' });
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
        </div>
    );
};

export default StyleGuide;

