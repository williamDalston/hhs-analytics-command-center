# Wireframe Import Guide

## Overview

The Wireframe Import feature allows you to automatically generate Power BI layout SVGs from a structured markdown specification file. This guide explains how to format your wireframe file for optimal parsing and generation.

---

## File Format Requirements

### Basic Structure

Your wireframe file should follow this structure:

```markdown
# HHS Power BI Layout Wireframes
## 7 Official HHS Layout Patterns

**Model:** [Project Name]
**Date:** [Date]
**Designer:** [Team/Name]

---

## LAYOUT SPECIFICATIONS

### Common Elements (All Layouts)
- **Trust Bar:** Optional 32px height
- **Page Padding:** 20px on all sides
- **Card Corner Radius:** 8px
- **Grid Overlay:** 20px grid, 10% opacity
- **Header Background:** #162e51
- **Accent Line:** #face00, 3px height

---

## PAGE 1: [Page Name]

### Layout Type: FEDERAL
**Use Case:** Executive dashboards
**Header:** 88px #162e51 + 3px #face00 accent line

**Grid Configuration:**
- Rows: 2
- Columns: 2
- Row 1 Columns: [2, 3]  (optional: different columns per row)

**Visuals:**
1. **KPI Card 1** - "Total Sales" (show label: yes)
2. **KPI Card 2** - "Revenue Growth" (show label: yes)
3. **Chart 1** - "Sales by Region" (show label: yes)
4. **Chart 2** - "Monthly Trends" (show label: no)

---

## PAGE 2: [Page Name]

### Layout Type: GRID
**Use Case:** Multi-metric dashboard
**Grid:** 3×3 with 20px gutters

**Visuals:**
1. **Chart 1** - "Q1 Performance" (show label: yes)
2. **Chart 2** - "Q2 Performance" (show label: yes)
...
```

---

## Detailed Format Specifications

### 1. Page Declaration

Each page must start with:

```markdown
## PAGE [Number]: [Page Name]
```

**Example:**
```markdown
## PAGE 1: Executive Dashboard
## PAGE 2: Regional Analysis
## PAGE 3: Mobile View
```

### 2. Layout Type

Specify the layout type for each page:

```markdown
### Layout Type: [LAYOUT_NAME]
```

**Supported Layout Types:**
- `FEDERAL` - Federal layout with optional sidebar
- `SIDEBAR` - Sidebar layout with filters
- `GRID` - Grid layout (2×2, 3×3, etc.)
- `KPI` or `KPI TOP` - KPI-focused layout
- `THREE-COLUMN` or `THREE-COL` - Three column layout
- `ASYMMETRIC` - Asymmetric layout
- `MOBILE` - Mobile-optimized layout

**Example:**
```markdown
### Layout Type: GRID
```

### 3. Grid Configuration

For layouts with grids, specify:

```markdown
**Grid Configuration:**
- Rows: [number]
- Columns: [number]
- Row 1 Columns: [array] (optional - for per-row column control)
```

**Examples:**

**Uniform Grid:**
```markdown
**Grid Configuration:**
- Rows: 2
- Columns: 2
```

**Per-Row Columns:**
```markdown
**Grid Configuration:**
- Rows: 3
- Columns: 2 (default)
- Row 1 Columns: 3
- Row 2 Columns: 2
- Row 3 Columns: 1
```

### 4. Visual Specifications

List each visual with its type, label, and optional text display:

```markdown
**Visuals:**
1. **[Visual Type] [Number]** - "[Label Text]" (show label: yes/no)
2. **[Visual Type] [Number]** - "[Label Text]" (show label: yes/no)
```

**Visual Types:**
- `KPI Card` or `KPI` - KPI indicator
- `Chart` - Chart visual
- `Table` - Table visual
- `Map` - Map visual
- `Slicer` - Slicer/filter
- `Text` - Text box
- `Image` - Image visual
- `Card` - Generic card

**Examples:**

```markdown
**Visuals:**
1. **KPI Card 1** - "Total Revenue" (show label: yes)
2. **KPI Card 2** - "Growth Rate" (show label: yes)
3. **Chart 1** - "Sales by Region" (show label: yes)
4. **Chart 2** - "Monthly Trends" (show label: no)
5. **Table 1** - "Top Products" (show label: yes)
6. **Map 1** - "Regional Distribution" (show label: yes)
```

### 5. Layout-Specific Settings

#### Federal Layout
```markdown
**Federal Settings:**
- Sidebar Width: 280px (optional)
- Show Sidebar: yes/no
- Grid Rows: 2
- Grid Columns: 2
```

#### Sidebar Layout
```markdown
**Sidebar Settings:**
- Sidebar Width: 260px
- Main Area Columns: 2
- Visual Count: 6
```

#### Grid Layout
```markdown
**Grid Settings:**
- Rows: 3
- Columns: 3
- Gap: 20px
```

#### KPI Top Layout
```markdown
**KPI Settings:**
- KPI Count: 5
- Main Chart Full Width: yes
- Visuals Below: 4
- Columns Below: 2
```

#### Three-Column Layout
```markdown
**Three-Column Settings:**
- Visuals Per Column: 3
- KPI Count: 4 (optional top row)
```

#### Asymmetric Layout
```markdown
**Asymmetric Settings:**
- Side Card Count: 2
- KPI Count: 4 (optional top row)
```

#### Mobile Layout
```markdown
**Mobile Settings:**
- Visual Count: 5
- Touch Optimized: yes
```

---

## Complete Example

```markdown
# HHS Power BI Layout Wireframes
## Multi-Page Dashboard Specification

**Model:** Social Media Analytics
**Date:** 2025-01-15
**Designer:** HHS WebFirst Analytics Team

---

## LAYOUT SPECIFICATIONS

### Common Elements (All Pages)
- **Trust Bar:** Optional 32px height
- **Page Padding:** 20px on all sides
- **Card Corner Radius:** 8px
- **Grid Overlay:** 20px grid, 10% opacity
- **Header Background:** #162e51
- **Accent Line:** #face00, 3px height

---

## PAGE 1: Executive Overview

### Layout Type: FEDERAL
**Use Case:** Executive dashboard, high-level KPIs
**Header:** 88px #162e51 + 3px #face00 accent line

**Federal Settings:**
- Show Sidebar: yes
- Sidebar Width: 280px
- Grid Rows: 2
- Grid Columns: 2

**Visuals:**
1. **KPI Card 1** - "Total Impressions" (show label: yes)
2. **KPI Card 2** - "Engagement Rate" (show label: yes)
3. **KPI Card 3** - "Follower Growth" (show label: yes)
4. **KPI Card 4** - "Top Platform" (show label: yes)
5. **Chart 1** - "Impressions Over Time" (show label: yes)
6. **Chart 2** - "Engagement by Platform" (show label: yes)
7. **Chart 3** - "Top Performing Posts" (show label: yes)
8. **Chart 4** - "Audience Demographics" (show label: no)

---

## PAGE 2: Detailed Analysis

### Layout Type: GRID
**Use Case:** Balanced multi-metric dashboard
**Grid:** 3×3 with 20px gutters

**Grid Configuration:**
- Rows: 3
- Columns: 3
- Row 1 Columns: 3
- Row 2 Columns: 2
- Row 3 Columns: 1

**Visuals:**
1. **Chart 1** - "Q1 Performance" (show label: yes)
2. **Chart 2** - "Q2 Performance" (show label: yes)
3. **Chart 3** - "Q3 Performance" (show label: yes)
4. **Chart 4** - "Q4 Performance" (show label: yes)
5. **Chart 5** - "Year-over-Year Comparison" (show label: yes)
6. **Table 1** - "Detailed Metrics" (show label: yes)
7. **Chart 6** - "Regional Breakdown" (show label: no)

---

## PAGE 3: Mobile View

### Layout Type: MOBILE
**Use Case:** Touch-optimized mobile dashboard
**Structure:** Full-width, vertical stacking

**Mobile Settings:**
- Visual Count: 4
- Touch Optimized: yes

**Visuals:**
1. **KPI Card 1** - "Today's Metrics" (show label: yes)
2. **Chart 1** - "Quick Overview" (show label: yes)
3. **Chart 2** - "Recent Activity" (show label: no)
4. **KPI Card 2** - "Weekly Summary" (show label: yes)

---

## PAGE 4: Filter-Heavy Analysis

### Layout Type: SIDEBAR
**Use Case:** Filter-heavy dashboard, detailed analysis
**Sidebar:** 260px collapsible left panel

**Sidebar Settings:**
- Sidebar Width: 260px
- Main Area Columns: 2
- Visual Count: 6

**Visuals:**
1. **Slicer 1** - "Date Range" (show label: yes)
2. **Slicer 2** - "Platform" (show label: yes)
3. **Slicer 3** - "Content Type" (show label: yes)
4. **Chart 1** - "Filtered Results" (show label: yes)
5. **Chart 2** - "Comparison View" (show label: yes)
6. **Table 1** - "Detailed Data" (show label: yes)
7. **Chart 3** - "Trend Analysis" (show label: no)
8. **Chart 4** - "Distribution" (show label: yes)
```

---

## Parser Features

### What Gets Extracted

1. **Page Information**
   - Page number and name
   - Layout type for each page

2. **Grid Specifications**
   - Number of rows and columns
   - Per-row column configurations
   - Gap/spacing information

3. **Visual Labels**
   - Text label for each visual
   - Visual type (Chart, KPI, Table, etc.)
   - Show/hide label preference

4. **Layout-Specific Settings**
   - Sidebar width
   - KPI counts
   - Visual counts
   - Column configurations

5. **Common Elements**
   - Padding, radius, colors
   - Header settings
   - Trust bar settings

### Generated Output

When you import a wireframe:
- Each page generates a separate SVG
- Visual labels are applied to cards
- Grid configurations are set automatically
- Layout-specific settings are configured
- Visual types are assigned based on your specification

---

## Tips for Best Results

1. **Be Specific**: Use exact visual type names (Chart, KPI Card, Table, etc.)

2. **Label Everything**: Even if you set `show label: no`, include the label text for documentation

3. **Grid Clarity**: Always specify rows and columns explicitly

4. **Page Organization**: Use clear page numbers and names

5. **Consistent Format**: Follow the format exactly for reliable parsing

6. **Visual Order**: Number visuals in the order they appear (top to bottom, left to right)

---

## Troubleshooting

### Parser Not Finding Layouts
- Ensure layout type is exactly: `FEDERAL`, `GRID`, `KPI`, etc.
- Check that `## PAGE` format is correct

### Visual Labels Not Appearing
- Verify format: `**Visual Type Number** - "Label Text" (show label: yes/no)`
- Check that quotes are around label text

### Grid Not Configuring
- Ensure `Rows:` and `Columns:` are specified
- For per-row columns, use format: `Row 1 Columns: 3`

### Multiple Pages Not Generating
- Each page must start with `## PAGE [Number]:`
- Ensure pages are separated by `---`

---

## Advanced: Custom Visual Types

You can specify custom visual types:

```markdown
**Visuals:**
1. **Custom Visual 1** - "My Custom Chart" (show label: yes)
```

The parser will recognize these and assign them as generic "card" type with your custom label.

---

**Last Updated:** 2025-01-15
**Version:** 2.0

