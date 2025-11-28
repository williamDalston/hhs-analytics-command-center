/**
 * QUICK BATCH GENERATOR - Copy and paste this entire script into browser console
 * 
 * This will generate 20+ different background variations automatically!
 * 
 * INSTRUCTIONS:
 * 1. Open SVG Generator page
 * 2. Open browser console (F12)
 * 3. Paste this ENTIRE script
 * 4. Press Enter
 * 5. Wait for all downloads to complete!
 */

(async function() {
  // Check if API is available
  if (!window.svgGeneratorAPI) {
    console.error('❌ SVG Generator API not found. Please refresh the page and try again.');
    return;
  }

  // All the variations you want to generate
  const configs = [
    {name: "Federal-NoNav-NoSlicer-NoKPI-NoSidebar-2x2", layoutMode: "federal", showLogo: false, headerHeight: 0, showSlicerZone: false, showFederalKPIs: false, showFederalSidebar: false, federalRows: 2, federalColumns: 2, useCustomSpacing: false, gap: 16},
    {name: "Federal-WithNav-NoSlicer-NoKPI-NoSidebar-2x2", layoutMode: "federal", showLogo: true, headerHeight: 88, showSlicerZone: false, showFederalKPIs: false, showFederalSidebar: false, federalRows: 2, federalColumns: 2, useCustomSpacing: false, gap: 16},
    {name: "Federal-WithNav-WithSlicer-NoKPI-NoSidebar-2x2", layoutMode: "federal", showLogo: true, headerHeight: 88, showSlicerZone: true, slicerZoneHeight: 60, showFederalKPIs: false, showFederalSidebar: false, federalRows: 2, federalColumns: 2, useCustomSpacing: false, gap: 16},
    {name: "Federal-WithNav-NoSlicer-WithKPI4-NoSidebar-2x2", layoutMode: "federal", showLogo: true, headerHeight: 88, showSlicerZone: false, showFederalKPIs: true, federalKPICount: 4, federalKPIRowHeight: 100, showFederalSidebar: false, federalRows: 2, federalColumns: 2, useCustomSpacing: false, gap: 16},
    {name: "Federal-WithNav-WithSlicer-WithKPI4-NoSidebar-2x2", layoutMode: "federal", showLogo: true, headerHeight: 88, showSlicerZone: true, slicerZoneHeight: 60, showFederalKPIs: true, federalKPICount: 4, federalKPIRowHeight: 100, showFederalSidebar: false, federalRows: 2, federalColumns: 2, useCustomSpacing: false, gap: 16},
    {name: "Federal-WithNav-NoSlicer-NoKPI-WithSidebar-2x2", layoutMode: "federal", showLogo: true, headerHeight: 88, showSlicerZone: false, showFederalKPIs: false, showFederalSidebar: true, federalSidebarWidth: 280, federalRows: 2, federalColumns: 2, useCustomSpacing: false, gap: 16},
    {name: "Federal-WithNav-WithSlicer-WithKPI4-WithSidebar-2x2", layoutMode: "federal", showLogo: true, headerHeight: 88, showSlicerZone: true, slicerZoneHeight: 60, showFederalKPIs: true, federalKPICount: 4, federalKPIRowHeight: 100, showFederalSidebar: true, federalSidebarWidth: 280, federalRows: 2, federalColumns: 2, useCustomSpacing: false, gap: 16},
    {name: "Federal-WithNav-NoSlicer-WithKPI5-NoSidebar-2x3", layoutMode: "federal", showLogo: true, headerHeight: 88, showSlicerZone: false, showFederalKPIs: true, federalKPICount: 5, federalKPIRowHeight: 100, showFederalSidebar: false, federalRows: 2, federalColumns: 3, useCustomSpacing: false, gap: 16},
    {name: "Federal-WithNav-WithSlicer-WithKPI3-WithSidebar-3x2", layoutMode: "federal", showLogo: true, headerHeight: 88, showSlicerZone: true, slicerZoneHeight: 80, showFederalKPIs: true, federalKPICount: 3, federalKPIRowHeight: 120, showFederalSidebar: true, federalSidebarWidth: 280, federalRows: 3, federalColumns: 2, useCustomSpacing: false, gap: 16},
    {name: "Federal-WithNav-NoSlicer-NoKPI-NoSidebar-3x3-TightSpacing", layoutMode: "federal", showLogo: true, headerHeight: 88, showSlicerZone: false, showFederalKPIs: false, showFederalSidebar: false, federalRows: 3, federalColumns: 3, useCustomSpacing: true, rowSpacing: 8, columnSpacing: 8, sidebarSpacing: 16, kpiCardSpacing: 12, kpiRowSpacing: 20},
    {name: "Grid-NoNav-NoSlicer-2x2", layoutMode: "grid", showLogo: false, headerHeight: 0, showSlicerZone: false, gridRows: 2, gridColumns: 2, useCustomSpacing: false, gap: 16},
    {name: "Grid-WithNav-NoSlicer-2x2", layoutMode: "grid", showLogo: true, headerHeight: 88, showSlicerZone: false, gridRows: 2, gridColumns: 2, useCustomSpacing: false, gap: 16},
    {name: "Grid-WithNav-WithSlicer-2x3", layoutMode: "grid", showLogo: true, headerHeight: 88, showSlicerZone: true, slicerZoneHeight: 60, gridRows: 2, gridColumns: 3, useCustomSpacing: false, gap: 16},
    {name: "Grid-NoNav-NoSlicer-3x3", layoutMode: "grid", showLogo: false, headerHeight: 0, showSlicerZone: false, gridRows: 3, gridColumns: 3, useCustomSpacing: false, gap: 16},
    {name: "Grid-WithNav-NoSlicer-3x2-WideSpacing", layoutMode: "grid", showLogo: true, headerHeight: 88, showSlicerZone: false, gridRows: 3, gridColumns: 2, useCustomSpacing: true, rowSpacing: 24, columnSpacing: 24, sidebarSpacing: 20, kpiCardSpacing: 20, kpiRowSpacing: 30},
    {name: "KPI-NoNav-NoSlicer-3KPIs", layoutMode: "kpi", showLogo: false, headerHeight: 0, showSlicerZone: false, kpiCount: 3, useCustomSpacing: false, gap: 16},
    {name: "KPI-WithNav-NoSlicer-4KPIs", layoutMode: "kpi", showLogo: true, headerHeight: 88, showSlicerZone: false, kpiCount: 4, useCustomSpacing: false, gap: 16},
    {name: "KPI-WithNav-WithSlicer-5KPIs", layoutMode: "kpi", showLogo: true, headerHeight: 88, showSlicerZone: true, slicerZoneHeight: 60, kpiCount: 5, useCustomSpacing: false, gap: 16},
    {name: "Federal-Ultrawide-WithNav-WithSlicer-WithKPI4-WithSidebar-2x2", layoutMode: "federal", canvasPreset: "ultrawide", width: 1920, height: 1080, showLogo: true, headerHeight: 88, showSlicerZone: true, slicerZoneHeight: 60, showFederalKPIs: true, federalKPICount: 4, federalKPIRowHeight: 100, showFederalSidebar: true, federalSidebarWidth: 280, federalRows: 2, federalColumns: 2, useCustomSpacing: false, gap: 16},
    {name: "Grid-Ultrawide-WithNav-NoSlicer-3x4", layoutMode: "grid", canvasPreset: "ultrawide", width: 1920, height: 1080, showLogo: true, headerHeight: 88, showSlicerZone: false, gridRows: 3, gridColumns: 4, useCustomSpacing: false, gap: 16},
  ];

  console.log(`🚀 Starting batch generation of ${configs.length} backgrounds...`);
  console.log('⏱️  This will take approximately', Math.ceil(configs.length * 1.5), 'seconds');
  console.log('💡 Make sure your browser allows multiple downloads!');
  
  for (let i = 0; i < configs.length; i++) {
    const cfg = configs[i];
    console.log(`[${i+1}/${configs.length}] Generating: ${cfg.name}`);
    
    try {
      // Set layout mode first
      window.svgGeneratorAPI.setLayoutMode(cfg.layoutMode);
      await new Promise(r => setTimeout(r, 100));
      
      // Set canvas preset if specified
      if (cfg.canvasPreset) {
        window.svgGeneratorAPI.setCanvasPreset(cfg.canvasPreset);
        await new Promise(r => setTimeout(r, 100));
      }
      
      // Apply all other config values
      Object.keys(cfg).forEach(key => {
        if (key !== 'name' && key !== 'layoutMode' && key !== 'canvasPreset') {
          window.svgGeneratorAPI.handleConfigChange(key, cfg[key]);
        }
      });
      
      // Wait for layout to update
      await new Promise(r => setTimeout(r, 800));
      
      // Download the SVG
      window.svgGeneratorAPI.downloadSVG();
      
      // Wait before next download
      await new Promise(r => setTimeout(r, 1000));
      
    } catch (error) {
      console.error(`❌ Error generating ${cfg.name}:`, error);
    }
  }
  
  console.log('✅ Batch generation complete!');
  console.log(`📁 Check your Downloads folder for ${configs.length} SVG files`);
})();

