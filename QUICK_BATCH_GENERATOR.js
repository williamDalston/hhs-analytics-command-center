/**
 * QUICK BATCH GENERATOR - Streamlined for Power BI Practice
 * 
 * Generates backgrounds with:
 * - Only 16:9 canvas (1280x720) - standard Power BI size
 * - Executive theme (with shadows) for all
 * - Lots of variations: nav bar, title, slicer, KPIs, sidebar combinations
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

  // Set executive theme and 16:9 canvas for all
  window.svgGeneratorAPI.setThemeMode('executive');
  window.svgGeneratorAPI.setCanvasPreset('16:9');
  await new Promise(r => setTimeout(r, 200));

  // All variations - focused on nav, title, slicer, KPI combinations
  const configs = [
    // === FEDERAL LAYOUT VARIATIONS ===
    
    // No nav, no slicer variations
    {name: "Federal-NoNav-NoTitle-NoSlicer-NoKPI-NoSidebar-2x2", layoutMode: "federal", showLogo: false, headerHeight: 0, showTitle: false, showSlicerZone: false, showFederalKPIs: false, showFederalSidebar: false, federalRows: 2, federalColumns: 2},
    {name: "Federal-NoNav-WithTitle-NoSlicer-NoKPI-NoSidebar-2x2", layoutMode: "federal", showLogo: false, headerHeight: 0, showTitle: true, titlePosition: "top", showSlicerZone: false, showFederalKPIs: false, showFederalSidebar: false, federalRows: 2, federalColumns: 2},
    
    // With nav, no slicer variations
    {name: "Federal-WithNav-NoTitle-NoSlicer-NoKPI-NoSidebar-2x2", layoutMode: "federal", showLogo: true, headerHeight: 88, showTitle: false, showSlicerZone: false, showFederalKPIs: false, showFederalSidebar: false, federalRows: 2, federalColumns: 2},
    {name: "Federal-WithNav-WithTitle-NoSlicer-NoKPI-NoSidebar-2x2", layoutMode: "federal", showLogo: true, headerHeight: 88, showTitle: true, titlePosition: "top", showSlicerZone: false, showFederalKPIs: false, showFederalSidebar: false, federalRows: 2, federalColumns: 2},
    {name: "Federal-WithNav-TitleInHeader-NoSlicer-NoKPI-NoSidebar-2x2", layoutMode: "federal", showLogo: true, headerHeight: 88, showTitle: true, titlePosition: "header", showSlicerZone: false, showFederalKPIs: false, showFederalSidebar: false, federalRows: 2, federalColumns: 2},
    
    // With nav, with slicer variations
    {name: "Federal-WithNav-NoTitle-WithSlicer-NoKPI-NoSidebar-2x2", layoutMode: "federal", showLogo: true, headerHeight: 88, showTitle: false, showSlicerZone: true, slicerZoneHeight: 60, showFederalKPIs: false, showFederalSidebar: false, federalRows: 2, federalColumns: 2},
    {name: "Federal-WithNav-WithTitle-WithSlicer-NoKPI-NoSidebar-2x2", layoutMode: "federal", showLogo: true, headerHeight: 88, showTitle: true, titlePosition: "top", showSlicerZone: true, slicerZoneHeight: 60, showFederalKPIs: false, showFederalSidebar: false, federalRows: 2, federalColumns: 2},
    
    // KPI variations - No slicer
    {name: "Federal-WithNav-NoTitle-NoSlicer-WithKPI3-NoSidebar-2x2", layoutMode: "federal", showLogo: true, headerHeight: 88, showTitle: false, showSlicerZone: false, showFederalKPIs: true, federalKPICount: 3, federalKPIRowHeight: 100, showFederalSidebar: false, federalRows: 2, federalColumns: 2},
    {name: "Federal-WithNav-NoTitle-NoSlicer-WithKPI4-NoSidebar-2x2", layoutMode: "federal", showLogo: true, headerHeight: 88, showTitle: false, showSlicerZone: false, showFederalKPIs: true, federalKPICount: 4, federalKPIRowHeight: 100, showFederalSidebar: false, federalRows: 2, federalColumns: 2},
    {name: "Federal-WithNav-NoTitle-NoSlicer-WithKPI5-NoSidebar-2x2", layoutMode: "federal", showLogo: true, headerHeight: 88, showTitle: false, showSlicerZone: false, showFederalKPIs: true, federalKPICount: 5, federalKPIRowHeight: 100, showFederalSidebar: false, federalRows: 2, federalColumns: 2},
    {name: "Federal-WithNav-WithTitle-NoSlicer-WithKPI4-NoSidebar-2x2", layoutMode: "federal", showLogo: true, headerHeight: 88, showTitle: true, titlePosition: "top", showSlicerZone: false, showFederalKPIs: true, federalKPICount: 4, federalKPIRowHeight: 100, showFederalSidebar: false, federalRows: 2, federalColumns: 2},
    
    // KPI variations - With slicer
    {name: "Federal-WithNav-NoTitle-WithSlicer-WithKPI4-NoSidebar-2x2", layoutMode: "federal", showLogo: true, headerHeight: 88, showTitle: false, showSlicerZone: true, slicerZoneHeight: 60, showFederalKPIs: true, federalKPICount: 4, federalKPIRowHeight: 100, showFederalSidebar: false, federalRows: 2, federalColumns: 2},
    {name: "Federal-WithNav-WithTitle-WithSlicer-WithKPI4-NoSidebar-2x2", layoutMode: "federal", showLogo: true, headerHeight: 88, showTitle: true, titlePosition: "top", showSlicerZone: true, slicerZoneHeight: 60, showFederalKPIs: true, federalKPICount: 4, federalKPIRowHeight: 100, showFederalSidebar: false, federalRows: 2, federalColumns: 2},
    
    // Sidebar variations
    {name: "Federal-WithNav-NoTitle-NoSlicer-NoKPI-WithSidebar-2x2", layoutMode: "federal", showLogo: true, headerHeight: 88, showTitle: false, showSlicerZone: false, showFederalKPIs: false, showFederalSidebar: true, federalSidebarWidth: 280, federalRows: 2, federalColumns: 2},
    {name: "Federal-WithNav-WithTitle-NoSlicer-NoKPI-WithSidebar-2x2", layoutMode: "federal", showLogo: true, headerHeight: 88, showTitle: true, titlePosition: "top", showSlicerZone: false, showFederalKPIs: false, showFederalSidebar: true, federalSidebarWidth: 280, federalRows: 2, federalColumns: 2},
    {name: "Federal-WithNav-NoTitle-NoSlicer-WithKPI4-WithSidebar-2x2", layoutMode: "federal", showLogo: true, headerHeight: 88, showTitle: false, showSlicerZone: false, showFederalKPIs: true, federalKPICount: 4, federalKPIRowHeight: 100, showFederalSidebar: true, federalSidebarWidth: 280, federalRows: 2, federalColumns: 2},
    {name: "Federal-WithNav-WithSlicer-WithKPI4-WithSidebar-2x2", layoutMode: "federal", showLogo: true, headerHeight: 88, showTitle: false, showSlicerZone: true, slicerZoneHeight: 60, showFederalKPIs: true, federalKPICount: 4, federalKPIRowHeight: 100, showFederalSidebar: true, federalSidebarWidth: 280, federalRows: 2, federalColumns: 2},
    
    // Different grid sizes
    {name: "Federal-WithNav-NoSlicer-WithKPI4-NoSidebar-2x3", layoutMode: "federal", showLogo: true, headerHeight: 88, showTitle: false, showSlicerZone: false, showFederalKPIs: true, federalKPICount: 4, federalKPIRowHeight: 100, showFederalSidebar: false, federalRows: 2, federalColumns: 3},
    {name: "Federal-WithNav-NoSlicer-WithKPI4-NoSidebar-3x2", layoutMode: "federal", showLogo: true, headerHeight: 88, showTitle: false, showSlicerZone: false, showFederalKPIs: true, federalKPICount: 4, federalKPIRowHeight: 100, showFederalSidebar: false, federalRows: 3, federalColumns: 2},
    {name: "Federal-WithNav-NoSlicer-WithKPI4-NoSidebar-3x3", layoutMode: "federal", showLogo: true, headerHeight: 88, showTitle: false, showSlicerZone: false, showFederalKPIs: true, federalKPICount: 4, federalKPIRowHeight: 100, showFederalSidebar: false, federalRows: 3, federalColumns: 3},
    
    // === GRID LAYOUT VARIATIONS ===
    {name: "Grid-NoNav-NoTitle-NoSlicer-2x2", layoutMode: "grid", showLogo: false, headerHeight: 0, showTitle: false, showSlicerZone: false, gridRows: 2, gridColumns: 2},
    {name: "Grid-WithNav-NoTitle-NoSlicer-2x2", layoutMode: "grid", showLogo: true, headerHeight: 88, showTitle: false, showSlicerZone: false, gridRows: 2, gridColumns: 2},
    {name: "Grid-WithNav-WithTitle-NoSlicer-2x2", layoutMode: "grid", showLogo: true, headerHeight: 88, showTitle: true, titlePosition: "top", showSlicerZone: false, gridRows: 2, gridColumns: 2},
    {name: "Grid-WithNav-NoTitle-WithSlicer-2x2", layoutMode: "grid", showLogo: true, headerHeight: 88, showTitle: false, showSlicerZone: true, slicerZoneHeight: 60, gridRows: 2, gridColumns: 2},
    {name: "Grid-WithNav-WithTitle-WithSlicer-2x2", layoutMode: "grid", showLogo: true, headerHeight: 88, showTitle: true, titlePosition: "top", showSlicerZone: true, slicerZoneHeight: 60, gridRows: 2, gridColumns: 2},
    {name: "Grid-WithNav-NoSlicer-2x3", layoutMode: "grid", showLogo: true, headerHeight: 88, showTitle: false, showSlicerZone: false, gridRows: 2, gridColumns: 3},
    {name: "Grid-WithNav-NoSlicer-3x2", layoutMode: "grid", showLogo: true, headerHeight: 88, showTitle: false, showSlicerZone: false, gridRows: 3, gridColumns: 2},
    {name: "Grid-WithNav-NoSlicer-3x3", layoutMode: "grid", showLogo: true, headerHeight: 88, showTitle: false, showSlicerZone: false, gridRows: 3, gridColumns: 3},
    
    // === KPI LAYOUT VARIATIONS ===
    {name: "KPI-NoNav-NoTitle-NoSlicer-3KPIs", layoutMode: "kpi", showLogo: false, headerHeight: 0, showTitle: false, showSlicerZone: false, kpiCount: 3},
    {name: "KPI-WithNav-NoTitle-NoSlicer-4KPIs", layoutMode: "kpi", showLogo: true, headerHeight: 88, showTitle: false, showSlicerZone: false, kpiCount: 4},
    {name: "KPI-WithNav-WithTitle-NoSlicer-4KPIs", layoutMode: "kpi", showLogo: true, headerHeight: 88, showTitle: true, titlePosition: "top", showSlicerZone: false, kpiCount: 4},
    {name: "KPI-WithNav-NoTitle-WithSlicer-5KPIs", layoutMode: "kpi", showLogo: true, headerHeight: 88, showTitle: false, showSlicerZone: true, slicerZoneHeight: 60, kpiCount: 5},
    {name: "KPI-WithNav-WithTitle-WithSlicer-5KPIs", layoutMode: "kpi", showLogo: true, headerHeight: 88, showTitle: true, titlePosition: "top", showSlicerZone: true, slicerZoneHeight: 60, kpiCount: 5},
  ];

  console.log(`🚀 Starting batch generation of ${configs.length} backgrounds...`);
  console.log('📐 Canvas: 16:9 (1280x720) - Standard Power BI size');
  console.log('✨ Theme: Executive (with shadows)');
  console.log('⏱️  This will take approximately', Math.ceil(configs.length * 1.5), 'seconds');
  console.log('💡 Make sure your browser allows multiple downloads!');
  
  for (let i = 0; i < configs.length; i++) {
    const cfg = configs[i];
    console.log(`[${i+1}/${configs.length}] Generating: ${cfg.name}`);
    
    try {
      // Set layout mode first
      window.svgGeneratorAPI.setLayoutMode(cfg.layoutMode);
      await new Promise(r => setTimeout(r, 100));
      
      // Apply all config values
      Object.keys(cfg).forEach(key => {
        if (key !== 'name' && key !== 'layoutMode') {
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
  console.log('🎨 All backgrounds use Executive theme with shadows');
})();
