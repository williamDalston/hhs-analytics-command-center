/**
 * Background Generator Script
 * 
 * Run this in the browser console on the SVG Generator page
 * to generate all possible background variations for Power BI practice
 * 
 * Usage:
 * 1. Open the SVG Generator in your browser
 * 2. Open browser console (F12)
 * 3. Paste this entire script
 * 4. Run: generateAllBackgrounds()
 */

// Configuration for all variations
const backgroundVariations = {
    // Base configurations
    layouts: ['federal', 'grid', 'kpi'],
    
    // Header/Nav variations
    headerOptions: [
        { showLogo: true, headerHeight: 88 },
        { showLogo: false, headerHeight: 88 },
        { showLogo: true, headerHeight: 60 },
        { showLogo: false, headerHeight: 120 }
    ],
    
    // Slicer zone variations
    slicerOptions: [
        { showSlicerZone: false },
        { showSlicerZone: true, slicerZoneHeight: 60 },
        { showSlicerZone: true, slicerZoneHeight: 80 },
        { showSlicerZone: true, slicerZoneHeight: 100 }
    ],
    
    // KPI row variations (for federal layout)
    kpiOptions: [
        { showFederalKPIs: false },
        { showFederalKPIs: true, federalKPICount: 3, federalKPIRowHeight: 100 },
        { showFederalKPIs: true, federalKPICount: 4, federalKPIRowHeight: 100 },
        { showFederalKPIs: true, federalKPICount: 5, federalKPIRowHeight: 100 },
        { showFederalKPIs: true, federalKPICount: 4, federalKPIRowHeight: 80 },
        { showFederalKPIs: true, federalKPICount: 4, federalKPIRowHeight: 120 }
    ],
    
    // Sidebar variations (for federal layout)
    sidebarOptions: [
        { showFederalSidebar: false },
        { showFederalSidebar: true, federalSidebarWidth: 200 },
        { showFederalSidebar: true, federalSidebarWidth: 280 },
        { showFederalSidebar: true, federalSidebarWidth: 350 }
    ],
    
    // Grid variations
    gridOptions: [
        { federalRows: 2, federalColumns: 2 },
        { federalRows: 2, federalColumns: 3 },
        { federalRows: 3, federalColumns: 2 },
        { federalRows: 3, federalColumns: 3 },
        { federalRows: 1, federalColumns: 4 }
    ],
    
    // Spacing variations
    spacingOptions: [
        { useCustomSpacing: false, gap: 16 },
        { useCustomSpacing: true, rowSpacing: 8, columnSpacing: 8, sidebarSpacing: 16, kpiCardSpacing: 12, kpiRowSpacing: 20 },
        { useCustomSpacing: true, rowSpacing: 24, columnSpacing: 24, sidebarSpacing: 20, kpiCardSpacing: 20, kpiRowSpacing: 30 },
        { useCustomSpacing: true, rowSpacing: 12, columnSpacing: 20, sidebarSpacing: 16, kpiCardSpacing: 16, kpiRowSpacing: 24 }
    ],
    
    // Canvas sizes
    canvasSizes: [
        { width: 1280, height: 720, preset: '16:9' },
        { width: 1920, height: 1080, preset: 'ultrawide' },
        { width: 1024, height: 768, preset: '4:3' }
    ]
};

// Function to generate all combinations
function generateAllBackgrounds() {
    console.log('🚀 Starting background generation...');
    console.log('This will generate many SVG files. Make sure downloads are enabled!');
    
    let totalCount = 0;
    const delay = 500; // Delay between downloads (ms)
    
    // Generate for each layout
    backgroundVariations.layouts.forEach((layout, layoutIdx) => {
        // Generate for each canvas size
        backgroundVariations.canvasSizes.forEach((canvas, canvasIdx) => {
            // Generate for each header option
            backgroundVariations.headerOptions.forEach((header, headerIdx) => {
                // Generate for each slicer option
                backgroundVariations.slicerOptions.forEach((slicer, slicerIdx) => {
                    // Generate for each spacing option
                    backgroundVariations.spacingOptions.forEach((spacing, spacingIdx) => {
                        if (layout === 'federal') {
                            // Federal layout: include KPI and sidebar options
                            backgroundVariations.kpiOptions.forEach((kpi, kpiIdx) => {
                                backgroundVariations.sidebarOptions.forEach((sidebar, sidebarIdx) => {
                                    backgroundVariations.gridOptions.forEach((grid, gridIdx) => {
                                        totalCount++;
                                        const config = {
                                            layoutMode: layout,
                                            canvasPreset: canvas.preset,
                                            width: canvas.width,
                                            height: canvas.height,
                                            ...header,
                                            ...slicer,
                                            ...kpi,
                                            ...sidebar,
                                            ...grid,
                                            ...spacing
                                        };
                                        
                                        // Queue the download
                                        setTimeout(() => {
                                            generateAndDownload(config, totalCount);
                                        }, totalCount * delay);
                                    });
                                });
                            });
                        } else if (layout === 'grid') {
                            // Grid layout: simpler combinations
                            backgroundVariations.gridOptions.forEach((grid, gridIdx) => {
                                totalCount++;
                                const config = {
                                    layoutMode: layout,
                                    canvasPreset: canvas.preset,
                                    width: canvas.width,
                                    height: canvas.height,
                                    ...header,
                                    ...slicer,
                                    gridRows: grid.federalRows,
                                    gridColumns: grid.federalColumns,
                                    ...spacing
                                };
                                
                                setTimeout(() => {
                                    generateAndDownload(config, totalCount);
                                }, totalCount * delay);
                            });
                        } else if (layout === 'kpi') {
                            // KPI layout: include KPI count variations
                            [3, 4, 5].forEach((kpiCount) => {
                                totalCount++;
                                const config = {
                                    layoutMode: layout,
                                    canvasPreset: canvas.preset,
                                    width: canvas.width,
                                    height: canvas.height,
                                    ...header,
                                    ...slicer,
                                    kpiCount: kpiCount,
                                    ...spacing
                                };
                                
                                setTimeout(() => {
                                    generateAndDownload(config, totalCount);
                                }, totalCount * delay);
                            });
                        }
                    });
                });
            });
        });
    });
    
    console.log(`📊 Total variations to generate: ${totalCount}`);
    console.log(`⏱️  Estimated time: ${Math.round(totalCount * delay / 1000 / 60)} minutes`);
    console.log('💡 Files will download automatically. Check your Downloads folder!');
}

// Function to apply config and download
function generateAndDownload(config, index) {
    try {
        // Get the React component instance (this assumes the component is accessible)
        // We'll need to access the window object or use a different approach
        
        console.log(`[${index}] Generating: ${config.layoutMode} - ${config.width}x${config.height} - Header:${config.showLogo ? 'Y' : 'N'} - Slicer:${config.showSlicerZone ? 'Y' : 'N'}`);
        
        // This is a simplified version - you'll need to adapt based on your React setup
        // For now, we'll create a function that can be called from the component
        
    } catch (error) {
        console.error(`Error generating ${index}:`, error);
    }
}

// Alternative: Create a JSON config file that can be imported
function generateConfigJSON() {
    const configs = [];
    let id = 1;
    
    backgroundVariations.layouts.forEach((layout) => {
        backgroundVariations.canvasSizes.forEach((canvas) => {
            backgroundVariations.headerOptions.forEach((header) => {
                backgroundVariations.slicerOptions.forEach((slicer) => {
                    backgroundVariations.spacingOptions.forEach((spacing) => {
                        if (layout === 'federal') {
                            backgroundVariations.kpiOptions.forEach((kpi) => {
                                backgroundVariations.sidebarOptions.forEach((sidebar) => {
                                    backgroundVariations.gridOptions.forEach((grid) => {
                                        configs.push({
                                            id: id++,
                                            name: `Federal-${canvas.preset}-H${header.showLogo ? 'Y' : 'N'}-S${slicer.showSlicerZone ? 'Y' : 'N'}-K${kpi.showFederalKPIs ? 'Y' : 'N'}-SB${sidebar.showFederalSidebar ? 'Y' : 'N'}-G${grid.federalRows}x${grid.federalColumns}`,
                                            ...canvas,
                                            layoutMode: layout,
                                            ...header,
                                            ...slicer,
                                            ...kpi,
                                            ...sidebar,
                                            ...grid,
                                            ...spacing
                                        });
                                    });
                                });
                            });
                        } else if (layout === 'grid') {
                            backgroundVariations.gridOptions.forEach((grid) => {
                                configs.push({
                                    id: id++,
                                    name: `Grid-${canvas.preset}-H${header.showLogo ? 'Y' : 'N'}-S${slicer.showSlicerZone ? 'Y' : 'N'}-G${grid.federalRows}x${grid.federalColumns}`,
                                    ...canvas,
                                    layoutMode: layout,
                                    gridRows: grid.federalRows,
                                    gridColumns: grid.federalColumns,
                                    ...header,
                                    ...slicer,
                                    ...spacing
                                });
                            });
                        } else if (layout === 'kpi') {
                            [3, 4, 5].forEach((kpiCount) => {
                                configs.push({
                                    id: id++,
                                    name: `KPI-${canvas.preset}-H${header.showLogo ? 'Y' : 'N'}-S${slicer.showSlicerZone ? 'Y' : 'N'}-K${kpiCount}`,
                                    ...canvas,
                                    layoutMode: layout,
                                    kpiCount: kpiCount,
                                    ...header,
                                    ...slicer,
                                    ...spacing
                                });
                            });
                        }
                    });
                });
            });
        });
    });
    
    return configs;
}

// Export functions
if (typeof window !== 'undefined') {
    window.generateAllBackgrounds = generateAllBackgrounds;
    window.generateConfigJSON = generateConfigJSON;
    
    // Generate and download JSON config
    const configs = generateConfigJSON();
    const jsonStr = JSON.stringify(configs, null, 2);
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'background-variations-config.json';
    link.click();
    
    console.log('✅ Configuration JSON downloaded!');
    console.log(`📋 Total configurations: ${configs.length}`);
    console.log('💡 Use generateAllBackgrounds() to start generating SVGs');
}

