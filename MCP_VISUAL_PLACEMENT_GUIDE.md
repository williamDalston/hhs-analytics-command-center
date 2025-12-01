# Power BI Visual Placement Guide for MCP Server Agent

## CRITICAL: What NOT to Do

**DO NOT create empty pages without visuals.** The MCP server must:
1. **Create pages WITH visuals already placed** (not empty placeholders)
2. **Use correct coordinates** from the layout calculations
3. **Include visual metadata** (type, data bindings, formatting)
4. **Follow Power BI's coordinate system** exactly

---

## Power BI Coordinate System & Units

### Coordinate System Basics
- **Origin (0,0)**: Top-left corner of the report page
- **X-axis**: Increases from left to right
- **Y-axis**: Increases from top to bottom
- **Units**: Power BI uses a coordinate system where:
  - Standard page width: **1280 units** (16:9 ratio)
  - Standard page height: **720 units** (16:9 ratio)
  - Alternative common sizes:
    - 1920 x 1080 (ultrawide/desktop)
    - 1024 x 768 (4:3 ratio)
    - 375 x 812 (mobile portrait)

### Visual Position Format
Each visual in the .pbip JSON structure requires:
```json
{
  "x": 20,          // Left position (pixels/units)
  "y": 100,         // Top position (pixels/units)
  "z": 1,           // Z-index (layer order)
  "width": 600,     // Width in units
  "height": 400,    // Height in units
  "visualType": "barChart",  // Visual type identifier
  "config": { ... } // Visual-specific configuration
}
```

---

## Standard Page Layout Measurements

### HHS Federal Layout (Standard)
```
Page Dimensions: 1280 x 720 units (16:9)

┌─────────────────────────────────────────────────────────┐
│ Trust Bar (Optional)                                    │ 32px height
│ "An official website of the United States government"   │ y: 0-32
├─────────────────────────────────────────────────────────┤
│ Header Bar                                              │ 88px height
│ [Logo 60x60] [Title Area]              [Yellow Accent] │ y: 32-120
├─────────────────────────────────────────────────────────┤
│ Slicer Zone (Optional)                                  │ 60px height
│ [Filters/Slicers]                                       │ y: 120-180
├─────────────────────────────────────────────────────────┤
│                                                          │
│ [Sidebar 280px]  │  Main Content Area                   │
│ [Slicers]        │  [Visual Grid]                       │
│                  │  - Gap: 20px                         │
│                  │  - Padding: 20px                     │
│                  │                                      │
├─────────────────────────────────────────────────────────┤
│ Footer (Optional)                                       │ Variable height
└─────────────────────────────────────────────────────────┘
```

### Layout Element Measurements
- **Standard Padding**: 20px from all edges
- **Visual Gap**: 16-20px between visuals
- **Header Height**: 88px (Federal layout)
- **Trust Bar Height**: 32px
- **Slicer Zone Height**: 60px
- **Sidebar Width**: 260-280px (Federal/Sidebar layouts)
- **KPI Card Height**: 110px (standard)
- **Card Border Radius**: 8px (government aesthetic)

---

## Common Visual Dimensions

### Visual Size Guidelines
**Minimum Sizes:**
- Small visual: 200 x 150 units
- Medium visual: 400 x 300 units
- Large visual: 600 x 400 units
- Full-width chart: 1200 x 500 units (with padding)

**KPI Cards:**
- Width: 220-280 units (for 4-5 KPIs across)
- Height: 110-130 units
- Spacing: 16-20 units between cards

**Standard Chart Sizes:**
- Small chart: 300 x 250 units
- Medium chart: 500 x 350 units
- Large chart: 700 x 450 units
- Full chart: 1200 x 600 units

**Slicer Dimensions:**
- Horizontal slicer: Full width - 40px padding
- Vertical slicer: 200-250px width x variable height
- Dropdown slicer: 180-220px width x 40px height

---

## Layout Pattern Calculations

### 1. Federal Layout (HHS Standard)
**When to use:** Standard HHS dashboards, executive reports

```
Header: y = 0-88 (or y = 32-120 if trust bar enabled)
Slicer Zone: y = 88 + padding/2 = 98 (or 120 + 10 = 130 with trust bar)
Content Start Y: y = 88 + 20 = 108 (or 150 with trust bar + slicer zone)

Sidebar (if enabled):
  - X: 20 (padding)
  - Width: 280px
  - Y: Content Start Y
  - Height: Page Height - Content Start Y - Footer - Padding

Main Content Area:
  - X: 20 + 280 + 20 = 320 (with sidebar)
  - Width: Page Width - 320 - 20 (right padding) = 940
  - Y: Content Start Y

Visual Grid Calculation (2x2 example):
  Available Width: 940
  Available Height: 720 - 108 - (footer) = ~600
  Gap: 20px
  
  Visual Width = (940 - 20) / 2 = 460px
  Visual Height = (600 - 20) / 2 = 290px
  
  Visual 1: x=320, y=108, w=460, h=290
  Visual 2: x=800, y=108, w=460, h=290
  Visual 3: x=320, y=418, w=460, h=290
  Visual 4: x=800, y=418, w=460, h=290
```

### 2. Grid Layout
**When to use:** Balanced dashboards with equal-weight visuals

```
Standard 2x2 Grid (1280x720 page):
  Padding: 20px
  Gap: 20px
  Available: 1240 x 680 (after padding)
  
  Visual Width = (1240 - 20) / 2 = 610px
  Visual Height = (680 - 20) / 2 = 330px
  
  Visual positions:
    Row 1, Col 1: x=20, y=20, w=610, h=330
    Row 1, Col 2: x=650, y=20, w=610, h=330
    Row 2, Col 1: x=20, y=370, w=610, h=330
    Row 2, Col 2: x=650, y=370, w=610, h=330

Standard 3x3 Grid (1280x720 page):
  Visual Width = (1240 - 40) / 3 = 400px
  Visual Height = (680 - 40) / 3 = 213px
  
  Formula: x = padding + col * (width + gap)
           y = padding + row * (height + gap)
```

### 3. KPI Top Layout
**When to use:** Executive dashboards, performance monitoring

```
KPI Row (Top):
  Y: 20 (after padding)
  Height: 110px
  Width per KPI: (Page Width - 40 - (gaps * (count-1))) / count
  
  4 KPIs example:
    KPI Width = (1280 - 40 - 60) / 4 = 295px
    KPI 1: x=20, y=20, w=295, h=110
    KPI 2: x=335, y=20, w=295, h=110
    KPI 3: x=650, y=20, w=295, h=110
    KPI 4: x=965, y=20, w=295, h=110

Main Charts (Below KPIs):
  Start Y: 20 + 110 + 20 = 150
  Available Height: 720 - 150 - 20 = 550
  
  2x1 layout:
    Chart 1: x=20, y=150, w=610, h=550
    Chart 2: x=650, y=150, w=610, h=550
```

### 4. Sidebar Layout
**When to use:** Dashboards requiring extensive filtering

```
Sidebar (Left):
  X: 20
  Width: 260px
  Y: 20 (or after title/slicer zone)
  Height: Page Height - Y - Padding

Main Area:
  X: 20 + 260 + 20 = 300
  Width: 1280 - 300 - 20 = 960
  Y: 20 (or after title/slicer zone)

KPI Strip (Optional):
  X: 300
  Y: 20
  Width: 960
  Height: 110

Visual Grid:
  Start Y: 20 + 110 + 20 = 150 (with KPI strip)
  Available: 960 x (720 - 150 - 20) = 960 x 550
  
  2 columns:
    Visual Width = (960 - 20) / 2 = 470px
```

### 5. Three Column Layout
**When to use:** Detailed analysis dashboards

```
Column Width: (Page Width - 40 - 40) / 3 = 400px (for 1280px page)
Gap: 20px

Column 1: x=20, width=400
Column 2: x=440, width=400
Column 3: x=860, width=400

Visuals stack vertically within each column:
  Start Y: 20
  Visual Height: Variable based on content
  Gap between visuals: 20px
```

### 6. Asymmetric Layout
**When to use:** Focused analysis with supporting context

```
Main Area (Left, ~60-70%):
  Width: ~800px (for 1280px page)
  X: 20
  Y: 20
  
Side Cards (Right, ~30-40%):
  Width: ~440px
  X: 840
  Y: 20
  
Side Card 1: x=840, y=20, w=440, h=350
Side Card 2: x=840, y=390, w=440, h=350

Main Visual: x=20, y=20, w=800, h=720-40=680
```

---

## Calculation Formulas

### Generic Visual Placement Formula
```javascript
// Calculate visual dimensions for grid layout
function calculateVisualPosition(pageWidth, pageHeight, row, col, totalRows, totalCols, padding = 20, gap = 20) {
  const availableWidth = pageWidth - (padding * 2);
  const availableHeight = pageHeight - (padding * 2);
  
  const visualWidth = (availableWidth - (gap * (totalCols - 1))) / totalCols;
  const visualHeight = (availableHeight - (gap * (totalRows - 1))) / totalRows;
  
  const x = padding + (col * (visualWidth + gap));
  const y = padding + (row * (visualHeight + gap));
  
  return {
    x: Math.round(x),
    y: Math.round(y),
    width: Math.round(visualWidth),
    height: Math.round(visualHeight)
  };
}
```

### Federal Layout with Header
```javascript
function calculateFederalLayout(pageWidth, pageHeight, row, col, totalRows, totalCols, hasSidebar = false) {
  const padding = 20;
  const gap = 20;
  const headerHeight = 88;
  const sidebarWidth = hasSidebar ? 280 : 0;
  
  const contentStartY = headerHeight + (padding / 2);
  const contentHeight = pageHeight - contentStartY - padding;
  
  const mainAreaX = padding + sidebarWidth + (sidebarWidth > 0 ? gap : 0);
  const mainAreaWidth = pageWidth - mainAreaX - padding;
  
  const visualWidth = (mainAreaWidth - (gap * (totalCols - 1))) / totalCols;
  const visualHeight = (contentHeight - (gap * (totalRows - 1))) / totalRows;
  
  const x = mainAreaX + (col * (visualWidth + gap));
  const y = contentStartY + (row * (visualHeight + gap));
  
  return {
    x: Math.round(x),
    y: Math.round(y),
    width: Math.round(visualWidth),
    height: Math.round(visualHeight)
  };
}
```

---

## JSON Structure for Visuals in .pbip Files

### Visual Object Structure
```json
{
  "$schema": "http://powerbi.com/product/schema#visual",
  "visualType": "barChart",
  "config": {
    "objects": {
      "general": {
        "properties": {
          "x": 20,
          "y": 100,
          "width": 600,
          "height": 400,
          "z": 1
        }
      }
    }
  },
  "dataViewMappings": [
    {
      "conditions": [
        {
          "min": {
            "dataRoles": ["Category", "Measure"]
          }
        }
      ]
    }
  ]
}
```

### Page Structure in .pbip
```json
{
  "name": "ReportPage1",
  "displayName": "Dashboard",
  "layout": {
    "width": 1280,
    "height": 720,
    "displayOption": "FitToPage"
  },
  "visualContainers": [
    {
      "x": 20,
      "y": 100,
      "z": 1,
      "width": 600,
      "height": 400,
      "config": "...",
      "filters": "...",
      "query": "..."
    }
  ],
  "filters": [],
  "config": {}
}
```

---

## Critical Rules for MCP Server

### 1. ALWAYS Calculate Positions
- **Never** create empty pages without visuals
- **Always** calculate exact X, Y, Width, Height for each visual
- **Always** account for padding, gaps, headers, and other layout elements

### 2. Validate Measurements
- **Check bounds**: Ensure visuals don't exceed page dimensions
- **Check overlaps**: Ensure visuals don't overlap (unless intentional)
- **Check minimums**: Visuals must be at least 200x150 units (smallest usable size)

### 3. Follow Layout Patterns
- **Use standard patterns**: Federal, Grid, KPI Top, Sidebar, etc.
- **Apply consistent spacing**: 20px padding, 16-20px gaps
- **Respect headers/footers**: Account for fixed-height elements

### 4. Visual Metadata Requirements
Each visual MUST include:
- **Position**: x, y, width, height
- **Visual Type**: barChart, lineChart, card, slicer, etc.
- **Z-index**: Layer order (1, 2, 3, etc.)
- **Data Bindings**: Fields, measures, columns (even if placeholder)
- **Formatting**: Basic formatting (can be refined later)

### 5. Error Prevention
- **Validate JSON structure**: Ensure valid Power BI JSON format
- **Check coordinate ranges**: X >= 0, Y >= 0, Width > 0, Height > 0
- **Prevent overflow**: X + Width <= Page Width, Y + Height <= Page Height
- **Maintain aspect ratios**: Don't create extremely wide or tall visuals

---

## Step-by-Step Process for MCP Server

### When Creating a Report Page with Visuals:

1. **Determine Page Dimensions**
   ```
   Standard: 1280 x 720
   Ultrawide: 1920 x 1080
   Mobile: 375 x 812
   ```

2. **Identify Layout Pattern**
   - Federal (HHS standard)
   - Grid (balanced)
   - KPI Top (executive)
   - Sidebar (filtering)
   - Three Column (detailed)
   - Asymmetric (focused)
   - Mobile (vertical stack)

3. **Calculate Layout Elements**
   - Header height (if Federal layout)
   - Slicer zone (if enabled)
   - Sidebar width (if applicable)
   - Content area dimensions
   - Padding and gaps

4. **Calculate Visual Positions**
   - Use formulas provided above
   - Account for all layout elements
   - Round coordinates to integers

5. **Create Visual Objects**
   - For each visual position:
     - Calculate exact x, y, width, height
     - Assign visual type
     - Set z-index (layer order)
     - Add data bindings (even placeholder)
     - Add basic formatting

6. **Validate and Assemble**
   - Check all coordinates are valid
   - Ensure no overlaps (unless intentional)
   - Verify JSON structure
   - Include all required metadata

---

## Example: Creating a 2x2 Grid Dashboard

### Input Requirements:
- Page: 1280 x 720
- Layout: Grid (2x2)
- Visuals: 4 charts

### Calculations:
```
Page: 1280 x 720
Padding: 20px all sides
Gap: 20px
Available: 1240 x 680

Visual Width = (1240 - 20) / 2 = 610px
Visual Height = (680 - 20) / 2 = 330px

Visual 1: x=20, y=20, w=610, h=330
Visual 2: x=650, y=20, w=610, h=330
Visual 3: x=20, y=370, w=610, h=330
Visual 4: x=650, y=370, w=610, h=330
```

### JSON Output Structure:
```json
{
  "name": "DashboardPage",
  "layout": {
    "width": 1280,
    "height": 720
  },
  "visualContainers": [
    {
      "x": 20,
      "y": 20,
      "z": 1,
      "width": 610,
      "height": 330,
      "visualType": "barChart",
      "config": { /* visual config */ }
    },
    {
      "x": 650,
      "y": 20,
      "z": 2,
      "width": 610,
      "height": 330,
      "visualType": "lineChart",
      "config": { /* visual config */ }
    },
    {
      "x": 20,
      "y": 370,
      "z": 3,
      "width": 610,
      "height": 330,
      "visualType": "pieChart",
      "config": { /* visual config */ }
    },
    {
      "x": 650,
      "y": 370,
      "z": 4,
      "width": 610,
      "height": 330,
      "visualType": "card",
      "config": { /* visual config */ }
    }
  ]
}
```

---

## Common Mistakes to Avoid

### ❌ WRONG: Creating Empty Pages
```json
{
  "visualContainers": []  // NO! Must include visuals
}
```

### ✅ CORRECT: Including Positioned Visuals
```json
{
  "visualContainers": [
    {
      "x": 20,
      "y": 20,
      "width": 600,
      "height": 400,
      "visualType": "barChart",
      "config": { /* ... */ }
    }
  ]
}
```

### ❌ WRONG: Using Placeholder Coordinates
```json
{
  "x": 0,
  "y": 0,
  "width": 100,
  "height": 100  // Too small, not calculated
}
```

### ✅ CORRECT: Using Calculated Coordinates
```json
{
  "x": 320,  // Calculated based on layout
  "y": 108,  // Calculated based on header + padding
  "width": 460,  // Calculated for grid position
  "height": 290  // Calculated for grid position
}
```

---

## Tips for Success

1. **Always Calculate First**: Never guess coordinates. Use the formulas provided.

2. **Account for ALL Elements**: Headers, footers, slicers, sidebars all affect positioning.

3. **Test Your Math**: Verify that visual positions + dimensions don't exceed page boundaries.

4. **Use Consistent Spacing**: 20px padding and 16-20px gaps create professional layouts.

5. **Layer Properly**: Use z-index to control visual layering (slicers on top, charts below).

6. **Include Visual Metadata**: Even if data bindings are placeholders, include them.

7. **Validate Coordinates**: Double-check that X + Width ≤ Page Width and Y + Height ≤ Page Height.

8. **Round Numbers**: Power BI coordinates should be integers, not decimals.

---

## Quick Reference: Standard Measurements

| Element | Width/Height | Notes |
|---------|-------------|-------|
| Standard Page (16:9) | 1280 x 720 | Most common |
| Ultrawide Page | 1920 x 1080 | Desktop displays |
| Header (Federal) | 88px height | HHS standard |
| Trust Bar | 32px height | Optional |
| Slicer Zone | 60px height | Optional |
| Sidebar | 260-280px width | Filter panels |
| Padding | 20px | Standard |
| Gap | 16-20px | Between visuals |
| KPI Card | 220-280px x 110px | Standard size |
| Small Visual | 200 x 150 | Minimum |
| Medium Visual | 400 x 300 | Standard |
| Large Visual | 600 x 400 | Standard |

---

## Final Reminder

**The MCP server must CREATE VISUALS with CALCULATED POSITIONS, not empty pages!**

Every page created must have:
- ✅ Visuals with exact x, y, width, height coordinates
- ✅ Visual types specified (barChart, card, slicer, etc.)
- ✅ Proper layering (z-index)
- ✅ Data bindings (even if placeholder)
- ✅ Valid JSON structure

This is NOT optional. Empty pages are NOT acceptable.





