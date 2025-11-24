# Wireframe Parser - Quick Reference

## Quick Start

1. **Switch to Import Mode**: Click "Import Wireframe" button at top of sidebar
2. **Paste Your Wireframe**: Copy/paste your markdown wireframe file
3. **Parse**: Click "Parse Wireframe" button
4. **Apply**: Click any page/layout button to apply it
5. **Export All**: Use "Export All Pages" to generate SVGs for all pages at once

---

## Required Format

### Page Declaration
```markdown
## PAGE 1: Executive Dashboard
```

### Layout Type
```markdown
### Layout Type: FEDERAL
```

### Grid Configuration (for Grid/Federal layouts)
```markdown
**Grid Configuration:**
- Rows: 2
- Columns: 2
- Row 1 Columns: 3  (optional - different columns per row)
- Row 2 Columns: 2
```

### Visual Labels
```markdown
**Visuals:**
1. **Chart 1** - "Sales by Region" (show label: yes)
2. **KPI Card 1** - "Total Revenue" (show label: yes)
3. **Table 1** - "Top Products" (show label: no)
```

---

## Visual Types Supported

- `Chart` → Chart visual
- `KPI Card` or `KPI` → KPI indicator
- `Table` → Table visual
- `Map` → Map visual
- `Slicer` → Slicer/filter
- `Text` → Text box
- `Image` → Image visual
- `Card` → Generic card

---

## Label Display Options

- `(show label: yes)` → Label will appear on the visual
- `(show label: no)` → Label stored but not displayed (for documentation)

---

## Multiple Pages

Each page generates a separate SVG. Use:
```markdown
## PAGE 1: Page Name
## PAGE 2: Another Page
## PAGE 3: Third Page
```

---

## Per-Row Column Control

For layouts with different columns per row:
```markdown
**Grid Configuration:**
- Rows: 3
- Columns: 2 (default)
- Row 1 Columns: 3
- Row 2 Columns: 2
- Row 3 Columns: 1
```

---

## Complete Example

```markdown
## PAGE 1: Executive Dashboard

### Layout Type: GRID

**Grid Configuration:**
- Rows: 3
- Columns: 3

**Visuals:**
1. **Chart 1** - "Q1 Performance" (show label: yes)
2. **Chart 2** - "Q2 Performance" (show label: yes)
3. **Chart 3** - "Q3 Performance" (show label: yes)
4. **KPI Card 1** - "Total Sales" (show label: yes)
5. **Chart 4** - "Regional Breakdown" (show label: no)
6. **Table 1** - "Top Products" (show label: yes)
```

---

## Export All Pages

When you have multiple pages, click "Export All Pages" to:
- Generate separate SVG files for each page
- Automatically name them: `HHS-Page-1-PageName-2025-01-15.svg`
- Apply all settings and labels from wireframe

---

## Tips

✅ **DO:**
- Use exact format: `## PAGE 1: Name`
- Use quotes around label text: `"Label Text"`
- Specify `(show label: yes/no)` for each visual
- Number visuals sequentially: 1, 2, 3...

❌ **DON'T:**
- Skip page numbers
- Forget quotes around labels
- Mix label formats
- Use inconsistent visual type names

---

**See WIREFRAME_IMPORT_GUIDE.md for complete documentation.**

