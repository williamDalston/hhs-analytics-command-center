# Batch Background Generator - Instructions

## Quick Start

### Option 1: Simple Manual Method (Recommended for Testing)

1. **Open the SVG Generator** in your browser
2. **Open Browser Console** (F12 or Cmd+Option+I)
3. **Copy and paste this script** into the console:

```javascript
// Simple batch generator - generates 20 variations
const configs = [
  {name: "Federal-NoNav-NoSlicer", layoutMode: "federal", showLogo: false, headerHeight: 0, showSlicerZone: false, showFederalKPIs: false, showFederalSidebar: false, federalRows: 2, federalColumns: 2},
  {name: "Federal-WithNav-NoSlicer", layoutMode: "federal", showLogo: true, headerHeight: 88, showSlicerZone: false, showFederalKPIs: false, showFederalSidebar: false, federalRows: 2, federalColumns: 2},
  {name: "Federal-WithNav-WithSlicer", layoutMode: "federal", showLogo: true, headerHeight: 88, showSlicerZone: true, slicerZoneHeight: 60, showFederalKPIs: false, showFederalSidebar: false, federalRows: 2, federalColumns: 2},
  {name: "Federal-WithNav-WithKPI4", layoutMode: "federal", showLogo: true, headerHeight: 88, showSlicerZone: false, showFederalKPIs: true, federalKPICount: 4, federalKPIRowHeight: 100, showFederalSidebar: false, federalRows: 2, federalColumns: 2},
  {name: "Federal-WithNav-WithSlicer-WithKPI4", layoutMode: "federal", showLogo: true, headerHeight: 88, showSlicerZone: true, slicerZoneHeight: 60, showFederalKPIs: true, federalKPICount: 4, federalKPIRowHeight: 100, showFederalSidebar: false, federalRows: 2, federalColumns: 2},
  {name: "Federal-WithNav-WithSidebar", layoutMode: "federal", showLogo: true, headerHeight: 88, showSlicerZone: false, showFederalKPIs: false, showFederalSidebar: true, federalSidebarWidth: 280, federalRows: 2, federalColumns: 2},
  {name: "Federal-WithNav-WithSlicer-WithKPI4-WithSidebar", layoutMode: "federal", showLogo: true, headerHeight: 88, showSlicerZone: true, slicerZoneHeight: 60, showFederalKPIs: true, federalKPICount: 4, federalKPIRowHeight: 100, showFederalSidebar: true, federalSidebarWidth: 280, federalRows: 2, federalColumns: 2},
  {name: "Grid-NoNav-NoSlicer", layoutMode: "grid", showLogo: false, headerHeight: 0, showSlicerZone: false, gridRows: 2, gridColumns: 2},
  {name: "Grid-WithNav-NoSlicer", layoutMode: "grid", showLogo: true, headerHeight: 88, showSlicerZone: false, gridRows: 2, gridColumns: 2},
  {name: "Grid-WithNav-WithSlicer", layoutMode: "grid", showLogo: true, headerHeight: 88, showSlicerZone: true, slicerZoneHeight: 60, gridRows: 2, gridColumns: 2},
  {name: "Grid-WithNav-3x3", layoutMode: "grid", showLogo: true, headerHeight: 88, showSlicerZone: false, gridRows: 3, gridColumns: 3},
  {name: "KPI-NoNav-NoSlicer-4KPIs", layoutMode: "kpi", showLogo: false, headerHeight: 0, showSlicerZone: false, kpiCount: 4},
  {name: "KPI-WithNav-NoSlicer-4KPIs", layoutMode: "kpi", showLogo: true, headerHeight: 88, showSlicerZone: false, kpiCount: 4},
  {name: "KPI-WithNav-WithSlicer-5KPIs", layoutMode: "kpi", showLogo: true, headerHeight: 88, showSlicerZone: true, slicerZoneHeight: 60, kpiCount: 5},
];

async function generateBatch() {
  if (!window.svgGeneratorAPI) {
    console.error('❌ SVG Generator API not found. Make sure the page is loaded.');
    return;
  }
  
  console.log(`🚀 Generating ${configs.length} backgrounds...`);
  
  for (let i = 0; i < configs.length; i++) {
    const cfg = configs[i];
    console.log(`[${i+1}/${configs.length}] ${cfg.name}`);
    
    // Apply config
    window.svgGeneratorAPI.setLayoutMode(cfg.layoutMode);
    await new Promise(r => setTimeout(r, 100));
    
    // Apply all config values
    Object.keys(cfg).forEach(key => {
      if (key !== 'name' && key !== 'layoutMode') {
        window.svgGeneratorAPI.handleConfigChange(key, cfg[key]);
      }
    });
    
    // Wait for layout to update
    await new Promise(r => setTimeout(r, 500));
    
    // Download
    window.svgGeneratorAPI.downloadSVG();
    await new Promise(r => setTimeout(r, 1000));
  }
  
  console.log('✅ Done!');
}

generateBatch();
```

4. **Press Enter** to run
5. **Wait** - files will download automatically!

### Option 2: Full Config File Method

1. **Copy the entire `background-variations-config.json` file content**
2. **Open browser console**
3. **Paste this**:

```javascript
// Load config
const fullConfig = [/* paste JSON array here */];

// Then run the generator
async function generateAll() {
  if (!window.svgGeneratorAPI) {
    console.error('❌ API not found');
    return;
  }
  
  for (let i = 0; i < fullConfig.length; i++) {
    const cfg = fullConfig[i];
    console.log(`[${i+1}/${fullConfig.length}] ${cfg.name}`);
    
    window.svgGeneratorAPI.setLayoutMode(cfg.layoutMode);
    await new Promise(r => setTimeout(r, 100));
    
    Object.keys(cfg).forEach(key => {
      if (key !== 'name' && key !== 'id' && key !== 'layoutMode') {
        window.svgGeneratorAPI.handleConfigChange(key, cfg[key]);
      }
    });
    
    await new Promise(r => setTimeout(r, 500));
    window.svgGeneratorAPI.downloadSVG();
    await new Promise(r => setTimeout(r, 1000));
  }
  
  console.log('✅ Complete!');
}

generateAll();
```

## Configuration Options Reference

### Layout Types
- `"federal"` - Federal layout with header
- `"grid"` - Simple grid layout
- `"kpi"` - KPI-focused layout

### Header Options
- `showLogo: true/false` - Show logo in header
- `headerHeight: 0-120` - Header height (0 = no header)

### Slicer Zone
- `showSlicerZone: true/false` - Show slicer zone
- `slicerZoneHeight: 60-100` - Height of slicer zone

### KPI Row (Federal layout)
- `showFederalKPIs: true/false` - Show KPI row
- `federalKPICount: 3-5` - Number of KPIs
- `federalKPIRowHeight: 80-120` - KPI row height

### Sidebar (Federal layout)
- `showFederalSidebar: true/false` - Show sidebar
- `federalSidebarWidth: 200-350` - Sidebar width

### Grid Configuration
- `federalRows: 1-4` - Number of rows (federal)
- `federalColumns: 1-4` - Number of columns (federal)
- `gridRows: 1-6` - Number of rows (grid)
- `gridColumns: 1-4` - Number of columns (grid)

### Spacing
- `useCustomSpacing: true/false` - Use custom spacing
- `gap: 8-30` - Default gap
- `rowSpacing: 8-30` - Row spacing (if custom)
- `columnSpacing: 8-30` - Column spacing (if custom)
- `sidebarSpacing: 8-30` - Sidebar spacing (if custom)
- `kpiCardSpacing: 8-30` - KPI card spacing (if custom)
- `kpiRowSpacing: 8-30` - KPI row spacing (if custom)

## Tips

1. **Start Small**: Test with 2-3 configs first
2. **Check Downloads**: Make sure browser allows multiple downloads
3. **Naming**: Files will be named automatically with layout and dimensions
4. **Power BI**: Import SVGs as background images in Power BI

## Troubleshooting

- **"API not found"**: Refresh the page and try again
- **Downloads not working**: Check browser download settings
- **Layout not updating**: Increase the timeout (change `500` to `1000`)

