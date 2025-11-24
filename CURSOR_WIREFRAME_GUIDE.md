# Cursor AI Guide: Generate HHS Power BI Wireframes

**Copy this entire guide into Cursor to generate complete wireframe markdown files with chart types and labels.**

## Your Task

Generate a complete HHS Power BI wireframe markdown file that includes:
1. Multiple pages (if needed)
2. Layout specifications (Federal, Grid, KPI Top, etc.)
3. Grid configurations (rows, columns, per-row columns)
4. Visual specifications with chart types and labels
5. Proper formatting for the HHS SVG Generator

## Required Format

The wireframe must follow this exact structure:

```markdown
## PAGE 1: [Page Name]

### Layout Type: [FEDERAL|GRID|KPI|SIDEBAR|THREE-COL|ASYMMETRIC|MOBILE]

**Grid Configuration:**
- Rows: [number]
- Columns: [number]
- Row 1 Columns: [number] (optional - for different columns per row)
- Row 2 Columns: [number] (optional)

**Visuals:**
1. **Chart 1** - "[Label Text]" (show label: yes)
2. **KPI Card 1** - "[Label Text]" (show label: yes)
3. **Table 1** - "[Label Text]" (show label: no)
4. **Map 1** - "[Label Text]" (show label: yes)
```

## Visual Types Supported

Use these exact visual type names:
- `Chart` - For line, bar, column charts
- `KPI Card` or `KPI` - For KPI indicators
- `Table` - For data tables
- `Map` - For geographic visualizations
- `Slicer` - For filter controls
- `Text` - For text boxes
- `Image` - For images
- `Card` - Generic card visual

## Example Complete Wireframe

```markdown
# HHS Power BI Layout Wireframes
## ASPA Social Media Analytics Dashboard

**Model:** ASPA-Social-Media-Analytics
**Date:** 2025-01-15
**Designer:** HHS WebFirst Analytics Team (ASPA)

---

## PAGE 1: Executive Social Media Overview

### Layout Type: FEDERAL

**Grid Configuration:**
- Rows: 3
- Columns: 3
- Row 1 Columns: 4
- Row 2 Columns: 3
- Row 3 Columns: 2

**Visuals:**
1. **KPI Card 1** - "Total Impressions" (show label: yes)
2. **KPI Card 2** - "Engagement Rate" (show label: yes)
3. **KPI Card 3** - "Total Followers" (show label: yes)
4. **KPI Card 4** - "Video Views" (show label: yes)
5. **Chart 1** - "Impressions by Platform Over Time" (show label: yes)
6. **Chart 2** - "Engagement by Content Type" (show label: yes)
7. **Chart 3** - "Top Performing Posts" (show label: yes)
8. **Table 1** - "Campaign Performance Details" (show label: no)
9. **Map 1** - "Geographic Engagement" (show label: yes)

---

## PAGE 2: Platform Comparison

### Layout Type: GRID

**Grid Configuration:**
- Rows: 2
- Columns: 2

**Visuals:**
1. **Chart 1** - "X/Twitter Performance" (show label: yes)
2. **Chart 2** - "Facebook Performance" (show label: yes)
3. **Chart 3** - "Instagram Performance" (show label: yes)
4. **Chart 4** - "YouTube Performance" (show label: yes)

---

## PAGE 3: Campaign Analysis

### Layout Type: KPI

**Grid Configuration:**
- Rows: 2
- Columns: 3

**Visuals:**
1. **KPI Card 1** - "Campaign Reach" (show label: yes)
2. **KPI Card 2** - "Campaign Engagement" (show label: yes)
3. **KPI Card 3** - "Campaign CTR" (show label: yes)
4. **Chart 1** - "Campaign Performance Timeline" (show label: yes)
5. **Chart 2** - "Campaign Comparison" (show label: yes)
6. **Table 1** - "Campaign Details" (show label: no)
```

## Instructions for Cursor

When the user asks you to create a wireframe:

1. **Ask for project details:**
   - Project name
   - Number of pages needed
   - Layout types for each page
   - Key metrics/visuals needed

2. **Generate complete wireframe** following the format above

3. **Include:**
   - All pages with proper headers
   - Grid configurations for each page
   - Visual specifications with:
     - Visual type (Chart, KPI Card, Table, etc.)
     - Descriptive label text
     - Show label preference (yes/no)

4. **Use descriptive labels** that explain what each visual shows

5. **Ensure proper markdown formatting** - the parser is strict

## Common Layout Patterns

### Federal Layout (Executive)
- Use for high-level dashboards
- Typically 2-3 rows, 2-4 columns
- Top row often has KPIs

### Grid Layout (Balanced)
- Use for comparison views
- Typically 2x2 or 3x3
- Equal-sized visuals

### KPI Top Layout
- Use when KPIs are primary focus
- Top row: KPI cards
- Below: Supporting charts

## Output Requirements

Your generated wireframe must:
- ✅ Start with `## PAGE 1:` format
- ✅ Include `### Layout Type:` for each page
- ✅ Have `**Grid Configuration:**` section
- ✅ Have `**Visuals:**` section with numbered list
- ✅ Use exact format: `**Chart 1** - "Label" (show label: yes)`
- ✅ Be ready to paste directly into the HHS SVG Generator

## Tips

- Use clear, descriptive labels
- Match visual types to actual Power BI visuals
- Consider the user's story/flow across pages
- Keep grid configurations reasonable (2-4 columns typically)
- Use "show label: yes" for important visuals, "no" for detailed tables

---

**Ready? Generate a complete wireframe markdown file that the user can paste directly into the HHS SVG Generator to create all their layout SVGs at once!**

