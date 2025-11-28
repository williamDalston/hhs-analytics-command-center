# 🚀 How to Generate All SVG Backgrounds at Once

## Quick Steps (3 minutes)

### Step 1: Open Your SVG Generator
1. Start your development server (if not running):
   ```bash
   npm run dev
   ```
2. Open the SVG Generator in your browser (usually `http://localhost:5173` or similar)

### Step 2: Open Browser Console
**On Mac**: Press `Cmd + Option + I` (or `Cmd + Option + J`)  
**On Windows/Linux**: Press `F12` (or `Ctrl + Shift + I`)

You should see a panel open at the bottom or side of your browser with a console tab.

### Step 3: Copy the Script
1. Open the file: `QUICK_BATCH_GENERATOR.js` in this project folder
2. **Select ALL the code** (Cmd+A / Ctrl+A)
3. **Copy it** (Cmd+C / Ctrl+C)

### Step 4: Paste and Run
1. Click in the **console** (the area where you can type)
2. **Paste** the entire script (Cmd+V / Ctrl+V)
3. **Press Enter**

### Step 5: Wait for Downloads
- The script will automatically generate **37 different SVG backgrounds**
- Each one will download automatically
- Check your **Downloads folder** when done
- Takes about **1-2 minutes** total

---

## 📍 Where is the Code File?

The code is in this file:
```
/Users/williamalston/Desktop/Projects/senior-power-bi-develper/QUICK_BATCH_GENERATOR.js
```

**Quick way to open it:**
1. In your code editor, look for `QUICK_BATCH_GENERATOR.js` in the project root
2. Or use Finder/File Explorer to navigate to the project folder

---

## 🎯 What You'll Get

The script generates **37 variations** including:
- ✅ Federal layouts (with/without nav, title, slicer, KPIs, sidebar)
- ✅ Grid layouts (different sizes and configurations)
- ✅ KPI layouts (3, 4, and 5 KPIs)
- ✅ All with **Executive theme** (shadows)
- ✅ All in **16:9 format** (1280x720) - perfect for Power BI

---

## ⚠️ Troubleshooting

### "API not found" Error
- **Solution**: Refresh the page (F5) and try again
- Make sure the SVG Generator page is fully loaded

### Downloads Not Starting
- **Solution**: Check your browser's download settings
- Some browsers block multiple downloads - you may need to allow them
- Look for a download permission popup

### Script Stops Partway
- **Solution**: Check the console for error messages
- You can restart by pasting the script again
- It will skip already downloaded files (they'll have different timestamps)

---

## 🎨 Alternative: Copy Code Directly

If you prefer, here's the code to copy directly:

```javascript
(async function() {
  if (!window.svgGeneratorAPI) {
    console.error('❌ SVG Generator API not found. Please refresh the page and try again.');
    return;
  }

  window.svgGeneratorAPI.setThemeMode('executive');
  window.svgGeneratorAPI.setCanvasPreset('16:9');
  await new Promise(r => setTimeout(r, 200));

  const configs = [
    {name: "Federal-NoNav-NoTitle-NoSlicer-NoKPI-NoSidebar-2x2", layoutMode: "federal", showLogo: false, headerHeight: 0, showTitle: false, showSlicerZone: false, showFederalKPIs: false, showFederalSidebar: false, federalRows: 2, federalColumns: 2},
    {name: "Federal-WithNav-NoTitle-NoSlicer-NoKPI-NoSidebar-2x2", layoutMode: "federal", showLogo: true, headerHeight: 88, showTitle: false, showSlicerZone: false, showFederalKPIs: false, showFederalSidebar: false, federalRows: 2, federalColumns: 2},
    {name: "Federal-WithNav-WithTitle-NoSlicer-NoKPI-NoSidebar-2x2", layoutMode: "federal", showLogo: true, headerHeight: 88, showTitle: true, titlePosition: "top", showSlicerZone: false, showFederalKPIs: false, showFederalSidebar: false, federalRows: 2, federalColumns: 2},
    {name: "Federal-WithNav-NoTitle-WithSlicer-NoKPI-NoSidebar-2x2", layoutMode: "federal", showLogo: true, headerHeight: 88, showTitle: false, showSlicerZone: true, slicerZoneHeight: 60, showFederalKPIs: false, showFederalSidebar: false, federalRows: 2, federalColumns: 2},
    {name: "Federal-WithNav-NoTitle-NoSlicer-WithKPI4-NoSidebar-2x2", layoutMode: "federal", showLogo: true, headerHeight: 88, showTitle: false, showSlicerZone: false, showFederalKPIs: true, federalKPICount: 4, federalKPIRowHeight: 100, showFederalSidebar: false, federalRows: 2, federalColumns: 2},
    {name: "Federal-WithNav-WithSlicer-WithKPI4-NoSidebar-2x2", layoutMode: "federal", showLogo: true, headerHeight: 88, showTitle: false, showSlicerZone: true, slicerZoneHeight: 60, showFederalKPIs: true, federalKPICount: 4, federalKPIRowHeight: 100, showFederalSidebar: false, federalRows: 2, federalColumns: 2},
    {name: "Federal-WithNav-NoTitle-NoSlicer-NoKPI-WithSidebar-2x2", layoutMode: "federal", showLogo: true, headerHeight: 88, showTitle: false, showSlicerZone: false, showFederalKPIs: false, showFederalSidebar: true, federalSidebarWidth: 280, federalRows: 2, federalColumns: 2},
    {name: "Federal-WithNav-WithSlicer-WithKPI4-WithSidebar-2x2", layoutMode: "federal", showLogo: true, headerHeight: 88, showTitle: false, showSlicerZone: true, slicerZoneHeight: 60, showFederalKPIs: true, federalKPICount: 4, federalKPIRowHeight: 100, showFederalSidebar: true, federalSidebarWidth: 280, federalRows: 2, federalColumns: 2},
    {name: "Grid-WithNav-NoSlicer-2x2", layoutMode: "grid", showLogo: true, headerHeight: 88, showTitle: false, showSlicerZone: false, gridRows: 2, gridColumns: 2},
    {name: "Grid-WithNav-WithSlicer-2x2", layoutMode: "grid", showLogo: true, headerHeight: 88, showTitle: false, showSlicerZone: true, slicerZoneHeight: 60, gridRows: 2, gridColumns: 2},
    {name: "KPI-WithNav-NoSlicer-4KPIs", layoutMode: "kpi", showLogo: true, headerHeight: 88, showTitle: false, showSlicerZone: false, kpiCount: 4},
  ];

  console.log(`🚀 Starting batch generation of ${configs.length} backgrounds...`);
  
  for (let i = 0; i < configs.length; i++) {
    const cfg = configs[i];
    console.log(`[${i+1}/${configs.length}] Generating: ${cfg.name}`);
    
    window.svgGeneratorAPI.setLayoutMode(cfg.layoutMode);
    await new Promise(r => setTimeout(r, 100));
    
    Object.keys(cfg).forEach(key => {
      if (key !== 'name' && key !== 'layoutMode') {
        window.svgGeneratorAPI.handleConfigChange(key, cfg[key]);
      }
    });
    
    await new Promise(r => setTimeout(r, 800));
    window.svgGeneratorAPI.downloadSVG();
    await new Promise(r => setTimeout(r, 1000));
  }
  
  console.log('✅ Batch generation complete!');
})();
```

**Note**: This is a shortened version. For all 37 variations, use the full `QUICK_BATCH_GENERATOR.js` file.

---

## 📸 Visual Guide

```
1. Open SVG Generator Page
   ↓
2. Press F12 (or Cmd+Option+I on Mac)
   ↓
3. Click "Console" tab (if not already selected)
   ↓
4. Open QUICK_BATCH_GENERATOR.js file
   ↓
5. Copy ALL the code (Cmd+A, then Cmd+C)
   ↓
6. Paste into console (Cmd+V)
   ↓
7. Press Enter
   ↓
8. Watch console for progress messages
   ↓
9. Check Downloads folder for SVG files!
```

---

**That's it!** The script does everything automatically. Just paste, press Enter, and wait! 🎉

