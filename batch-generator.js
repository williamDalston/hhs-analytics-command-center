/**
 * Batch Background Generator
 * 
 * This script will generate all background variations from the config file
 * 
 * INSTRUCTIONS:
 * 1. Open your SVG Generator page in the browser
 * 2. Open browser console (F12 or Cmd+Option+I)
 * 3. First, load the config by pasting this at the top:
 *    fetch('/background-variations-config.json')
 *      .then(r => r.json())
 *      .then(data => window.backgroundConfigs = data.variations)
 *      .then(() => console.log('✅ Config loaded!', window.backgroundConfigs.length, 'variations'))
 * 
 * 4. Then paste this entire script
 * 5. Run: batchGenerateFromConfig()
 * 
 * OR manually paste the config array if fetch doesn't work
 */

// Configuration array - paste from background-variations-config.json
const backgroundConfigs = [
  {
    "id": 1,
    "name": "Federal-16:9-NoNav-NoSlicer-NoKPI-NoSidebar-2x2",
    "layoutMode": "federal",
    "canvasPreset": "16:9",
    "width": 1280,
    "height": 720,
    "showLogo": false,
    "headerHeight": 0,
    "showSlicerZone": false,
    "showFederalKPIs": false,
    "showFederalSidebar": false,
    "federalRows": 2,
    "federalColumns": 2,
    "useCustomSpacing": false,
    "gap": 16
  },
  {
    "id": 2,
    "name": "Federal-16:9-WithNav-NoSlicer-NoKPI-NoSidebar-2x2",
    "layoutMode": "federal",
    "canvasPreset": "16:9",
    "width": 1280,
    "height": 720,
    "showLogo": true,
    "headerHeight": 88,
    "showSlicerZone": false,
    "showFederalKPIs": false,
    "showFederalSidebar": false,
    "federalRows": 2,
    "federalColumns": 2,
    "useCustomSpacing": false,
    "gap": 16
  },
  {
    "id": 3,
    "name": "Federal-16:9-WithNav-WithSlicer-NoKPI-NoSidebar-2x2",
    "layoutMode": "federal",
    "canvasPreset": "16:9",
    "width": 1280,
    "height": 720,
    "showLogo": true,
    "headerHeight": 88,
    "showSlicerZone": true,
    "slicerZoneHeight": 60,
    "showFederalKPIs": false,
    "showFederalSidebar": false,
    "federalRows": 2,
    "federalColumns": 2,
    "useCustomSpacing": false,
    "gap": 16
  },
  {
    "id": 4,
    "name": "Federal-16:9-WithNav-NoSlicer-WithKPI4-NoSidebar-2x2",
    "layoutMode": "federal",
    "canvasPreset": "16:9",
    "width": 1280,
    "height": 720,
    "showLogo": true,
    "headerHeight": 88,
    "showSlicerZone": false,
    "showFederalKPIs": true,
    "federalKPICount": 4,
    "federalKPIRowHeight": 100,
    "showFederalSidebar": false,
    "federalRows": 2,
    "federalColumns": 2,
    "useCustomSpacing": false,
    "gap": 16
  },
  {
    "id": 5,
    "name": "Federal-16:9-WithNav-WithSlicer-WithKPI4-NoSidebar-2x2",
    "layoutMode": "federal",
    "canvasPreset": "16:9",
    "width": 1280,
    "height": 720,
    "showLogo": true,
    "headerHeight": 88,
    "showSlicerZone": true,
    "slicerZoneHeight": 60,
    "showFederalKPIs": true,
    "federalKPICount": 4,
    "federalKPIRowHeight": 100,
    "showFederalSidebar": false,
    "federalRows": 2,
    "federalColumns": 2,
    "useCustomSpacing": false,
    "gap": 16
  },
  {
    "id": 6,
    "name": "Federal-16:9-WithNav-NoSlicer-NoKPI-WithSidebar-2x2",
    "layoutMode": "federal",
    "canvasPreset": "16:9",
    "width": 1280,
    "height": 720,
    "showLogo": true,
    "headerHeight": 88,
    "showSlicerZone": false,
    "showFederalKPIs": false,
    "showFederalSidebar": true,
    "federalSidebarWidth": 280,
    "federalRows": 2,
    "federalColumns": 2,
    "useCustomSpacing": false,
    "gap": 16
  },
  {
    "id": 7,
    "name": "Federal-16:9-WithNav-WithSlicer-WithKPI4-WithSidebar-2x2",
    "layoutMode": "federal",
    "canvasPreset": "16:9",
    "width": 1280,
    "height": 720,
    "showLogo": true,
    "headerHeight": 88,
    "showSlicerZone": true,
    "slicerZoneHeight": 60,
    "showFederalKPIs": true,
    "federalKPICount": 4,
    "federalKPIRowHeight": 100,
    "showFederalSidebar": true,
    "federalSidebarWidth": 280,
    "federalRows": 2,
    "federalColumns": 2,
    "useCustomSpacing": false,
    "gap": 16
  },
  {
    "id": 8,
    "name": "Federal-16:9-WithNav-NoSlicer-WithKPI5-NoSidebar-2x3",
    "layoutMode": "federal",
    "canvasPreset": "16:9",
    "width": 1280,
    "height": 720,
    "showLogo": true,
    "headerHeight": 88,
    "showSlicerZone": false,
    "showFederalKPIs": true,
    "federalKPICount": 5,
    "federalKPIRowHeight": 100,
    "showFederalSidebar": false,
    "federalRows": 2,
    "federalColumns": 3,
    "useCustomSpacing": false,
    "gap": 16
  },
  {
    "id": 9,
    "name": "Federal-16:9-WithNav-WithSlicer-WithKPI3-WithSidebar-3x2",
    "layoutMode": "federal",
    "canvasPreset": "16:9",
    "width": 1280,
    "height": 720,
    "showLogo": true,
    "headerHeight": 88,
    "showSlicerZone": true,
    "slicerZoneHeight": 80,
    "showFederalKPIs": true,
    "federalKPICount": 3,
    "federalKPIRowHeight": 120,
    "showFederalSidebar": true,
    "federalSidebarWidth": 280,
    "federalRows": 3,
    "federalColumns": 2,
    "useCustomSpacing": false,
    "gap": 16
  },
  {
    "id": 10,
    "name": "Federal-16:9-WithNav-NoSlicer-NoKPI-NoSidebar-3x3-TightSpacing",
    "layoutMode": "federal",
    "canvasPreset": "16:9",
    "width": 1280,
    "height": 720,
    "showLogo": true,
    "headerHeight": 88,
    "showSlicerZone": false,
    "showFederalKPIs": false,
    "showFederalSidebar": false,
    "federalRows": 3,
    "federalColumns": 3,
    "useCustomSpacing": true,
    "rowSpacing": 8,
    "columnSpacing": 8,
    "sidebarSpacing": 16,
    "kpiCardSpacing": 12,
    "kpiRowSpacing": 20
  },
  {
    "id": 11,
    "name": "Grid-16:9-WithNav-NoSlicer-2x2",
    "layoutMode": "grid",
    "canvasPreset": "16:9",
    "width": 1280,
    "height": 720,
    "showLogo": true,
    "headerHeight": 88,
    "showSlicerZone": false,
    "gridRows": 2,
    "gridColumns": 2,
    "useCustomSpacing": false,
    "gap": 16
  },
  {
    "id": 12,
    "name": "Grid-16:9-WithNav-WithSlicer-2x3",
    "layoutMode": "grid",
    "canvasPreset": "16:9",
    "width": 1280,
    "height": 720,
    "showLogo": true,
    "headerHeight": 88,
    "showSlicerZone": true,
    "slicerZoneHeight": 60,
    "gridRows": 2,
    "gridColumns": 3,
    "useCustomSpacing": false,
    "gap": 16
  },
  {
    "id": 13,
    "name": "Grid-16:9-NoNav-NoSlicer-3x3",
    "layoutMode": "grid",
    "canvasPreset": "16:9",
    "width": 1280,
    "height": 720,
    "showLogo": false,
    "headerHeight": 0,
    "showSlicerZone": false,
    "gridRows": 3,
    "gridColumns": 3,
    "useCustomSpacing": false,
    "gap": 16
  },
  {
    "id": 14,
    "name": "Grid-16:9-WithNav-NoSlicer-3x2-WideSpacing",
    "layoutMode": "grid",
    "canvasPreset": "16:9",
    "width": 1280,
    "height": 720,
    "showLogo": true,
    "headerHeight": 88,
    "showSlicerZone": false,
    "gridRows": 3,
    "gridColumns": 2,
    "useCustomSpacing": true,
    "rowSpacing": 24,
    "columnSpacing": 24,
    "sidebarSpacing": 20,
    "kpiCardSpacing": 20,
    "kpiRowSpacing": 30
  },
  {
    "id": 15,
    "name": "KPI-16:9-WithNav-NoSlicer-4KPIs",
    "layoutMode": "kpi",
    "canvasPreset": "16:9",
    "width": 1280,
    "height": 720,
    "showLogo": true,
    "headerHeight": 88,
    "showSlicerZone": false,
    "kpiCount": 4,
    "useCustomSpacing": false,
    "gap": 16
  },
  {
    "id": 16,
    "name": "KPI-16:9-WithNav-WithSlicer-5KPIs",
    "layoutMode": "kpi",
    "canvasPreset": "16:9",
    "width": 1280,
    "height": 720,
    "showLogo": true,
    "headerHeight": 88,
    "showSlicerZone": true,
    "slicerZoneHeight": 60,
    "kpiCount": 5,
    "useCustomSpacing": false,
    "gap": 16
  },
  {
    "id": 17,
    "name": "KPI-16:9-NoNav-NoSlicer-3KPIs",
    "layoutMode": "kpi",
    "canvasPreset": "16:9",
    "width": 1280,
    "height": 720,
    "showLogo": false,
    "headerHeight": 0,
    "showSlicerZone": false,
    "kpiCount": 3,
    "useCustomSpacing": false,
    "gap": 16
  },
  {
    "id": 18,
    "name": "Federal-Ultrawide-WithNav-WithSlicer-WithKPI4-WithSidebar-2x2",
    "layoutMode": "federal",
    "canvasPreset": "ultrawide",
    "width": 1920,
    "height": 1080,
    "showLogo": true,
    "headerHeight": 88,
    "showSlicerZone": true,
    "slicerZoneHeight": 60,
    "showFederalKPIs": true,
    "federalKPICount": 4,
    "federalKPIRowHeight": 100,
    "showFederalSidebar": true,
    "federalSidebarWidth": 280,
    "federalRows": 2,
    "federalColumns": 2,
    "useCustomSpacing": false,
    "gap": 16
  },
  {
    "id": 19,
    "name": "Grid-Ultrawide-WithNav-NoSlicer-3x4",
    "layoutMode": "grid",
    "canvasPreset": "ultrawide",
    "width": 1920,
    "height": 1080,
    "showLogo": true,
    "headerHeight": 88,
    "showSlicerZone": false,
    "gridRows": 3,
    "gridColumns": 4,
    "useCustomSpacing": false,
    "gap": 16
  },
  {
    "id": 20,
    "name": "Federal-4:3-WithNav-NoSlicer-WithKPI4-NoSidebar-2x2",
    "layoutMode": "federal",
    "canvasPreset": "4:3",
    "width": 1024,
    "height": 768,
    "showLogo": true,
    "headerHeight": 88,
    "showSlicerZone": false,
    "showFederalKPIs": true,
    "federalKPICount": 4,
    "federalKPIRowHeight": 100,
    "showFederalSidebar": false,
    "federalRows": 2,
    "federalColumns": 2,
    "useCustomSpacing": false,
    "gap": 16
  }
];

// Main batch generation function
async function batchGenerateFromConfig(configs = backgroundConfigs) {
    console.log('🚀 Starting batch generation...');
    console.log(`📊 Total variations: ${configs.length}`);
    console.log('⏱️  This will take approximately', Math.ceil(configs.length * 1.5), 'seconds');
    console.log('💡 Make sure your browser allows multiple downloads!');
    
    // Find the React component (this is a hack - adjust based on your setup)
    // We'll need to access the component's state setters
    
    for (let i = 0; i < configs.length; i++) {
        const config = configs[i];
        console.log(`[${i + 1}/${configs.length}] Generating: ${config.name}`);
        
        try {
            // Apply configuration
            await applyConfig(config);
            
            // Wait for layout to generate
            await sleep(500);
            
            // Trigger download
            await downloadCurrentSVG(config.name);
            
            // Wait before next download
            await sleep(1000);
            
        } catch (error) {
            console.error(`Error generating ${config.name}:`, error);
        }
    }
    
    console.log('✅ Batch generation complete!');
}

// Helper function to apply config to React component
async function applyConfig(config) {
    // This is a simplified approach - you may need to adjust based on your React setup
    // The component state should be accessible via React DevTools or window object
    
    // Try to find the component instance
    // Method 1: If component exposes methods via window
    if (window.svgGenerator) {
        window.svgGenerator.setLayoutMode(config.layoutMode);
        window.svgGenerator.setCanvasPreset(config.canvasPreset);
        // ... apply all config values
        return;
    }
    
    // Method 2: Use React DevTools to find component
    // You can manually set this up by adding to your component:
    // useEffect(() => { window.svgGenerator = { setLayoutMode, setConfig, ... } }, []);
    
    // Method 3: Direct DOM manipulation (less reliable)
    // This would require knowing your component's internal structure
    
    console.warn('⚠️  Component instance not found. Please ensure the component exposes methods via window.svgGenerator');
    console.log('💡 Add this to your SVGGenerator component:');
    console.log(`
        useEffect(() => {
            window.svgGenerator = {
                setLayoutMode,
                setCanvasPreset,
                setConfig,
                downloadSVG
            };
        }, []);
    `);
}

// Helper function to download SVG
async function downloadCurrentSVG(name) {
    // Try to call the download function
    if (window.svgGenerator && window.svgGenerator.downloadSVG) {
        window.svgGenerator.downloadSVG();
    } else {
        // Fallback: manually trigger download button click
        const downloadBtn = document.querySelector('button[aria-label*="Download"], button:has(svg[class*="download"])');
        if (downloadBtn) {
            downloadBtn.click();
        } else {
            console.warn('⚠️  Download button not found');
        }
    }
}

// Sleep helper
function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

// Export to window
if (typeof window !== 'undefined') {
    window.batchGenerateFromConfig = batchGenerateFromConfig;
    window.backgroundConfigs = backgroundConfigs;
    console.log('✅ Batch generator loaded!');
    console.log('💡 Run: batchGenerateFromConfig() to start');
    console.log('💡 Or: batchGenerateFromConfig(window.backgroundConfigs.slice(0, 5)) to test with first 5');
}

