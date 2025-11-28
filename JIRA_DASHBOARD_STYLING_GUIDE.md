# Complete Styling Guide: Jira Delivery Dashboard
## HHS Standards + Power BI Best Practices

---

## 🎨 COLOR PALETTE

### Primary Colors (HHS Brand)
- **Primary Blue**: `#005ea2` - Main brand color, use for primary actions, key metrics
- **Primary Dark**: `#1a4480` - Headers, emphasis, important data points
- **Primary Darker**: `#162e51` - Page headers, strong emphasis
- **Primary Vivid**: `#00bde3` - Accents, highlights, positive trends
- **Primary Light**: `#97d4ea` - Subtle backgrounds, light accents
- **Primary Lighter**: `#ccecf2` - Very light backgrounds
- **Primary Lightest**: `#e5faff` - Subtle backgrounds, hover states

### Secondary Colors
- **Secondary Yellow**: `#face00` - Accent color, warnings, attention
- **Secondary Dark**: `#e5a000` - Darker yellow for contrast
- **Secondary Lighter**: `#fff5c2` - Light yellow backgrounds

### Accent Colors
- **Accent Cool**: `#00a398` - Success states, positive metrics
- **Accent Warm**: `#d54309` - Alerts, negative metrics, urgent items
- **Accent Cool Light**: `#1dc2ae` - Light success indicators
- **Accent Warm Light**: `#f3966d` - Light alert indicators

### Neutral/Grayscale
- **Base Darkest**: `#1c1d1f` - Primary text, high contrast
- **Base Darker**: `#3d4551` - Secondary text, labels
- **Base Dark**: `#565c65` - Tertiary text, subtle labels
- **Base**: `#a9aeb1` - Borders, dividers
- **Base Light**: `#dfe1e2` - Light borders, subtle dividers
- **Base Lighter**: `#f1f3f6` - Page background, card backgrounds
- **Base Lightest**: `#fbfcfd` - Pure white alternative

### Logo Color
- **HHS Blue**: `#185394` - Logo/seal specific color

---

## 📝 TYPOGRAPHY

### Font Families
- **Body Text**: `Source Sans Pro` (Primary)
  - Fallback: `Helvetica Neue, Helvetica, Roboto, Arial, sans-serif`
- **Headings**: `Merriweather` (for titles if needed)
  - Fallback: `Georgia, Cambria, Times New Roman, Times, serif`
- **Power BI Default**: Use Source Sans Pro throughout for consistency

### Font Sizes
- **Page Title**: 18-20pt, Bold, Color: `#162e51`
- **Visual Titles**: 14pt, Semi-bold (600), Color: `#162e51`
- **KPI Labels**: 11-12pt, Regular (400), Color: `#3d4551`
- **KPI Values**: 24-28pt, Bold (700), Color: `#1c1d1f`
- **Chart Labels**: 11pt, Regular, Color: `#565c65`
- **Axis Labels**: 10pt, Regular, Color: `#565c65`
- **Data Labels**: 10-11pt, Regular, Color: `#1c1d1f`
- **Tooltips**: 11pt, Regular, Color: `#1c1d1f`

### Font Weights
- **Regular**: 400 (body text, labels)
- **Semi-bold**: 600 (titles, emphasis)
- **Bold**: 700 (KPI values, important numbers)

---

## 🎯 KPI CARD STYLING

### Background & Border
- **Background**: `#fbfcfd` (white/lightest gray)
- **Border**: 1px solid `#dfe1e2` (light gray)
- **Border Radius**: 8px (government aesthetic - sharper corners)
- **Shadow**: Subtle shadow for depth
  - Box Shadow: `0 1px 3px rgba(0, 0, 0, 0.1)`
- **Padding**: 16px all sides

### KPI Value Styling
- **Font**: Source Sans Pro, 28pt, Bold (700)
- **Color**: `#1c1d1f` (darkest for maximum contrast)
- **Alignment**: Left-aligned (standard for KPIs)
- **Line Height**: 1.2

### KPI Label Styling
- **Font**: Source Sans Pro, 11pt, Regular (400)
- **Color**: `#3d4551` (darker gray for readability)
- **Text Transform**: Uppercase (optional, for consistency)
- **Letter Spacing**: 0.5px
- **Margin Top**: 4px

### KPI Trend Indicators
- **Positive Trend**: `#00a398` (accent cool - green)
- **Negative Trend**: `#d54309` (accent warm - red)
- **Neutral/No Change**: `#565c65` (base dark gray)
- **Trend Arrow**: Use up/down arrows with color coding
- **Trend Percentage**: 10pt, Semi-bold, matching trend color

### KPI Card Hover State
- **Background**: `#f1f3f6` (slightly darker on hover)
- **Border**: 1px solid `#97d4ea` (light blue accent)
- **Transition**: 0.2s ease-in-out

### KPI Card Color Coding (Optional)
- **Total**: `#005ea2` (primary blue) - top border accent
- **Resolved**: `#00a398` (accent cool - success green)
- **In Progress**: `#00bde3` (primary vivid - active blue)
- **Backlog**: `#565c65` (base dark - neutral gray)
- **Blocked**: `#d54309` (accent warm - alert red)
- **Points**: `#1a4480` (primary dark - emphasis)
- **Velocity**: `#face00` (secondary yellow - performance)
- **Resolution %**: `#00a398` (accent cool - success)

---

## 📊 CHART STYLING

### General Chart Settings

#### Background
- **Chart Background**: `#fbfcfd` (white)
- **Plot Area Background**: `#fbfcfd` (white)
- **Border**: 1px solid `#dfe1e2` (light gray)
- **Border Radius**: 8px

#### Title
- **Font**: Source Sans Pro, 14pt, Semi-bold (600)
- **Color**: `#162e51` (primary darker)
- **Alignment**: Left
- **Padding**: 12px top, 16px left/right

#### Legend
- **Font**: Source Sans Pro, 11pt, Regular
- **Color**: `#3d4551` (base darker)
- **Position**: Bottom (preferred) or Right
- **Spacing**: 8px between items

#### Gridlines
- **Color**: `#dfe1e2` (base light)
- **Style**: Solid
- **Width**: 1px
- **Opacity**: 0.5

#### Axes
- **Font**: Source Sans Pro, 10pt, Regular
- **Color**: `#565c65` (base dark)
- **Line Color**: `#a9aeb1` (base)
- **Line Width**: 1px
- **Tick Marks**: Minor ticks off, major ticks on

### Bar Chart Specific (Issues by Status, Issues by Project)

#### Data Colors (Sequential)
1. `#005ea2` (Primary Blue)
2. `#1a4480` (Primary Dark)
3. `#00bde3` (Primary Vivid)
4. `#00a398` (Accent Cool)
5. `#face00` (Secondary Yellow)
6. `#d54309` (Accent Warm)
7. `#97d4ea` (Primary Light)
8. `#565c65` (Base Dark)

#### Bar Styling
- **Bar Width**: 60-70% of category width
- **Border**: None (clean look)
- **Spacing**: 20% between categories
- **Rounded Corners**: Top corners only, 2px radius

#### Data Labels
- **Show**: On (for clarity)
- **Font**: Source Sans Pro, 10pt, Semi-bold
- **Color**: `#1c1d1f` (darkest for contrast)
- **Position**: Inside end (top of bar)
- **Format**: Whole numbers, no decimals

#### Category Colors (Semantic)
- **Resolved/Complete**: `#00a398` (green - success)
- **In Progress/Active**: `#00bde3` (vivid blue - active)
- **Backlog/Pending**: `#565c65` (gray - neutral)
- **Blocked/Urgent**: `#d54309` (red - alert)
- **New/Open**: `#005ea2` (primary blue)

### Line Chart Specific (Resolution Trend, Resolution Rate Trend)

#### Line Styling
- **Line Width**: 3px (thick for visibility)
- **Line Style**: Solid
- **Marker Size**: 6px (visible but not overwhelming)
- **Marker Style**: Circle
- **Marker Fill**: Same as line color
- **Marker Border**: White, 2px width

#### Data Colors
- **Primary Line**: `#005ea2` (primary blue)
- **Secondary Line**: `#00a398` (accent cool - green)
- **Tertiary Line**: `#d54309` (accent warm - red)

#### Area Fill (if using area chart)
- **Fill Opacity**: 20-30%
- **Gradient**: From color to transparent

#### Data Points
- **Show on Hover**: Yes
- **Show Always**: Optional (for key points only)

---

## 🎨 PAGE & VISUAL CONTAINER STYLING

### Page Background
- **Color**: `#f1f3f6` (base lighter - light gray)
- **Alternative**: `#fbfcfd` (base lightest - near white)

### Visual Container
- **Background**: `#fbfcfd` (white)
- **Border**: 1px solid `#dfe1e2` (light gray)
- **Border Radius**: 8px
- **Padding**: 0px (charts handle their own padding)
- **Shadow**: Subtle elevation
  - Box Shadow: `0 2px 4px rgba(0, 0, 0, 0.08)`

### Visual Spacing
- **Gap Between Visuals**: 20px
- **Page Padding**: 20px all sides

---

## 💬 TOOLTIP STYLING

### Tooltip Container
- **Background**: `#1c1d1f` (darkest - high contrast)
- **Border**: None (clean look)
- **Border Radius**: 4px
- **Padding**: 12px
- **Shadow**: `0 4px 12px rgba(0, 0, 0, 0.3)`
- **Opacity**: 0.95 (slight transparency for depth)

### Tooltip Text
- **Font**: Source Sans Pro, 11pt, Regular
- **Color**: `#fbfcfd` (white/lightest)
- **Line Height**: 1.5

### Tooltip Labels
- **Font**: Source Sans Pro, 10pt, Regular
- **Color**: `#97d4ea` (primary light - light blue)
- **Text Transform**: Uppercase
- **Letter Spacing**: 0.5px

### Tooltip Values
- **Font**: Source Sans Pro, 12pt, Semi-bold
- **Color**: `#fbfcfd` (white)
- **Format**: Include units, commas for thousands

### Tooltip Structure
```
┌─────────────────────────────┐
│ CATEGORY LABEL              │  ← Light blue, uppercase
│ Value: 1,234                │  ← White, bold
│ Change: +5.2%              │  ← Colored by trend
│ Date: Jan 15, 2024          │  ← Light gray
└─────────────────────────────┘
```

### Tooltip Color Coding
- **Positive Values**: `#00a398` (green)
- **Negative Values**: `#d54309` (red)
- **Neutral Values**: `#97d4ea` (light blue)

---

## 🎭 VISUAL EFFECTS & INTERACTIONS

### Hover States
- **Visual Container**: 
  - Border: 1px solid `#97d4ea` (light blue)
  - Shadow: Slightly increased
  - Transition: 0.2s ease-in-out

### Selection States
- **Selected Visual Border**: 2px solid `#005ea2` (primary blue)
- **Selected Visual Background**: Slight tint of `#e5faff` (primary lightest)

### Focus States (Accessibility)
- **Focus Border**: 2px solid `#005ea2` (primary blue)
- **Focus Outline**: 2px outline, offset 2px
- **Focus Color**: `#005ea2` with 20% opacity background

### Loading States
- **Skeleton Background**: `#f1f3f6` (base lighter)
- **Loading Animation**: Subtle pulse
- **Loading Color**: `#97d4ea` (primary light)

---

## 🎨 DATA COLOR SCHEME

### Recommended Color Order (for categorical data)
1. `#005ea2` - Primary Blue (most important)
2. `#1a4480` - Primary Dark (secondary importance)
3. `#00bde3` - Primary Vivid (active/current)
4. `#00a398` - Accent Cool (success/positive)
5. `#face00` - Secondary Yellow (attention/warning)
6. `#d54309` - Accent Warm (alert/negative)
7. `#97d4ea` - Primary Light (subtle)
8. `#565c65` - Base Dark (neutral)

### Sequential Color Scale (for quantitative data)
- **Low Values**: `#e5faff` (lightest blue)
- **Medium Values**: `#97d4ea` (light blue)
- **High Values**: `#005ea2` (primary blue)
- **Very High**: `#162e51` (primary darker)

### Diverging Color Scale (for positive/negative)
- **Negative**: `#d54309` (red) → `#f3966d` (light red)
- **Neutral**: `#f1f3f6` (gray)
- **Positive**: `#97d4ea` (light blue) → `#005ea2` (blue)

---

## ♿ ACCESSIBILITY REQUIREMENTS (508 Compliance)

### Color Contrast
- **Normal Text**: Minimum 4.5:1 ratio
  - Dark text (`#1c1d1f`) on light background (`#fbfcfd`) = 16.8:1 ✓
  - Light text (`#fbfcfd`) on dark background (`#1c1d1f`) = 16.8:1 ✓
- **Large Text**: Minimum 3:1 ratio
  - All HHS colors meet this requirement

### Alt Text Requirements
- **All Visuals**: Must have meaningful alt text
- **KPI Cards**: "Total: [value], [description]"
- **Charts**: "[Chart type] showing [data description]"
- **Format**: Descriptive, not "Chart 1" or "Visual 2"

### Keyboard Navigation
- **Tab Order**: Logical order (top to bottom, left to right)
- **Focus Indicators**: Visible 2px border in `#005ea2`
- **Interactive Elements**: All must be keyboard accessible

### Screen Reader Support
- **Data Labels**: Include in alt text
- **Chart Titles**: Descriptive and meaningful
- **Data Tables**: Provide table view for screen readers

### Semantic Colors
- **Never rely on color alone**: Use icons, text, or patterns
- **Status Indicators**: Color + icon + text
- **Trends**: Color + arrow + percentage

---

## 📐 SPACING & LAYOUT

### Standard Spacing Scale
- **4px**: Tight spacing (within elements)
- **8px**: Small spacing (between related items)
- **12px**: Medium spacing (between sections)
- **16px**: Standard spacing (card padding)
- **20px**: Large spacing (between visuals, page padding)
- **24px**: Extra large spacing (major sections)

### Visual Padding
- **KPI Cards**: 16px all sides
- **Charts**: 12px top, 16px sides, 8px bottom
- **Page**: 20px all sides

---

## 🎯 SPECIFIC VISUAL RECOMMENDATIONS

### KPI Cards (8 cards total)

#### Card 1: Total
- **Value Color**: `#1c1d1f` (darkest)
- **Top Border Accent**: `#005ea2` (primary blue), 3px
- **Icon**: Database/List icon in `#005ea2`

#### Card 2: Resolved
- **Value Color**: `#00a398` (success green)
- **Top Border Accent**: `#00a398`, 3px
- **Icon**: Checkmark in `#00a398`

#### Card 3: In Progress
- **Value Color**: `#00bde3` (vivid blue)
- **Top Border Accent**: `#00bde3`, 3px
- **Icon**: Clock/Progress icon in `#00bde3`

#### Card 4: Backlog
- **Value Color**: `#565c65` (neutral gray)
- **Top Border Accent**: `#565c65`, 3px
- **Icon**: List/Queue icon in `#565c65`

#### Card 5: Blocked
- **Value Color**: `#d54309` (alert red)
- **Top Border Accent**: `#d54309`, 3px
- **Icon**: Alert/Stop icon in `#d54309`

#### Card 6: Points
- **Value Color**: `#1a4480` (primary dark)
- **Top Border Accent**: `#1a4480`, 3px
- **Icon**: Target/Points icon in `#1a4480`

#### Card 7: Velocity
- **Value Color**: `#face00` (yellow)
- **Top Border Accent**: `#face00`, 3px
- **Icon**: Speed/Arrow icon in `#face00`

#### Card 8: Resolution %
- **Value Color**: `#00a398` (success green)
- **Top Border Accent**: `#00a398`, 3px
- **Icon**: Percentage/Chart icon in `#00a398`

### Chart 1: Issues by Status (Bar Chart)
- **Chart Type**: Clustered or Stacked Bar
- **Colors**: Use semantic colors for statuses
  - Resolved: `#00a398`
  - In Progress: `#00bde3`
  - Backlog: `#565c65`
  - Blocked: `#d54309`
  - New: `#005ea2`
- **Orientation**: Horizontal (easier to read labels)
- **Data Labels**: On, inside end
- **Legend**: Bottom, horizontal

### Chart 2: Issues by Project (Bar Chart)
- **Chart Type**: Clustered Bar
- **Colors**: Use primary color palette (sequential)
- **Orientation**: Horizontal
- **Data Labels**: On, inside end
- **Legend**: Bottom, horizontal

### Chart 3: Resolution Trend (Line Chart)
- **Chart Type**: Line Chart
- **Primary Line**: `#005ea2` (primary blue)
- **Line Width**: 3px
- **Markers**: On, 6px circles
- **Area Fill**: Optional, 20% opacity gradient
- **Gridlines**: Horizontal only, light gray

### Chart 4: Resolution Rate Trend (Line Chart)
- **Chart Type**: Line Chart
- **Primary Line**: `#00a398` (success green)
- **Line Width**: 3px
- **Markers**: On, 6px circles
- **Area Fill**: Optional, 20% opacity gradient
- **Gridlines**: Horizontal only, light gray
- **Y-Axis**: Percentage format (0% - 100%)

---

## 🎨 POWER BI THEME JSON

### Complete Theme Configuration

```json
{
  "name": "HHS Jira Delivery Dashboard Theme",
  "dataColors": [
    "#005ea2",
    "#1a4480",
    "#00bde3",
    "#00a398",
    "#face00",
    "#d54309",
    "#97d4ea",
    "#565c65",
    "#162e51",
    "#1dc2ae",
    "#ccecf2",
    "#e5faff",
    "#185394",
    "#f3966d",
    "#3d4551"
  ],
  "background": "#f1f3f6",
  "foreground": "#1c1d1f",
  "tableAccent": "#005ea2",
  "visualStyles": {
    "*": {
      "*": {
        "title": [
          {
            "fontColor": {
              "solid": {
                "color": "#162e51"
              }
            },
            "fontFamily": "Source Sans Pro",
            "fontSize": 14,
            "fontWeight": 600
          }
        ],
        "label": [
          {
            "fontColor": {
              "solid": {
                "color": "#1c1d1f"
              }
            },
            "fontFamily": "Source Sans Pro",
            "fontSize": 11,
            "fontWeight": 400
          }
        ],
        "categoryAxis": {
          "show": true,
          "axisScale": "linear",
          "axisType": "categorical",
          "labelColor": {
            "solid": {
              "color": "#565c65"
            }
          },
          "fontFamily": "Source Sans Pro",
          "fontSize": 10,
          "labelDisplayUnits": 0,
          "lineColor": {
            "solid": {
              "color": "#a9aeb1"
            }
          }
        },
        "valueAxis": {
          "show": true,
          "axisScale": "linear",
          "axisType": "scalar",
          "labelColor": {
            "solid": {
              "color": "#565c65"
            }
          },
          "fontFamily": "Source Sans Pro",
          "fontSize": 10,
          "lineColor": {
            "solid": {
              "color": "#a9aeb1"
            }
          }
        },
        "gridlines": {
          "show": true,
          "color": {
            "solid": {
              "color": "#dfe1e2"
            }
          },
          "strokeWidth": 1
        }
      }
    },
    "card": {
      "*": {
        "card": [
          {
            "outline": "None",
            "outlineColor": {
              "solid": {
                "color": "#dfe1e2"
              }
            },
            "outlineWeight": 1,
            "backgroundColor": {
              "solid": {
                "color": "#fbfcfd"
              }
            },
            "border": true,
            "borderColor": {
              "solid": {
                "color": "#dfe1e2"
              }
            },
            "padding": 16
          }
        ],
        "calloutValue": [
          {
            "fontColor": {
              "solid": {
                "color": "#1c1d1f"
              }
            },
            "fontFamily": "Source Sans Pro",
            "fontSize": 28,
            "fontWeight": 700
          }
        ],
        "calloutLabel": [
          {
            "fontColor": {
              "solid": {
                "color": "#3d4551"
              }
            },
            "fontFamily": "Source Sans Pro",
            "fontSize": 11,
            "fontWeight": 400
          }
        ]
      }
    },
    "columnChart": {
      "*": {
        "dataPoint": [
          {
            "fill": {
              "solid": {
                "color": "#005ea2"
              }
            }
          }
        ]
      }
    },
    "lineChart": {
      "*": {
        "dataPoint": [
          {
            "fill": {
              "solid": {
                "color": "#005ea2"
              }
            },
            "strokeWidth": 3
          }
        ]
      }
    }
  }
}
```

---

## 📋 IMPLEMENTATION CHECKLIST

### Colors
- [ ] Use HHS primary color palette
- [ ] Ensure 4.5:1 contrast ratio for text
- [ ] Use semantic colors for status indicators
- [ ] Apply consistent color scheme across all visuals

### Typography
- [ ] Set Source Sans Pro as primary font
- [ ] Use appropriate font sizes (14pt titles, 11pt labels)
- [ ] Apply correct font weights (bold for values, regular for labels)
- [ ] Ensure text colors meet contrast requirements

### KPI Cards
- [ ] White background with light gray border
- [ ] 8px border radius
- [ ] 16px padding
- [ ] 28pt bold values, 11pt regular labels
- [ ] Top border accent in semantic color
- [ ] Subtle shadow for depth

### Charts
- [ ] White background
- [ ] 8px border radius
- [ ] 14pt semi-bold titles
- [ ] 11pt regular labels
- [ ] Light gray gridlines
- [ ] Semantic colors for data series
- [ ] Data labels enabled where helpful

### Tooltips
- [ ] Dark background (`#1c1d1f`)
- [ ] White text
- [ ] Light blue labels
- [ ] Include all relevant information
- [ ] Format numbers with commas

### Accessibility
- [ ] Alt text for all visuals
- [ ] Keyboard navigation enabled
- [ ] Focus indicators visible
- [ ] Color not used alone for meaning
- [ ] Logical tab order

### Overall Polish
- [ ] Consistent spacing (20px gaps)
- [ ] Aligned visual containers
- [ ] Professional shadows and borders
- [ ] Smooth hover transitions
- [ ] Clean, government-appropriate aesthetic

---

## 🎯 FINAL RECOMMENDATIONS

### Visual Hierarchy
1. **KPIs** (top) - Most important metrics, largest text
2. **Charts** (below) - Supporting visualizations
3. **Consistent styling** - All visuals follow same design language

### Color Strategy
- **Primary metrics**: Use primary blue (`#005ea2`)
- **Success/Positive**: Use accent cool (`#00a398`)
- **Alerts/Negative**: Use accent warm (`#d54309`)
- **Neutral**: Use base colors (`#565c65`)

### Professional Polish
- **Consistent borders**: 1px solid light gray
- **Subtle shadows**: Add depth without distraction
- **Clean spacing**: 20px standard gaps
- **Government aesthetic**: Sharper corners (8px), professional colors

### User Experience
- **Clear labels**: Every visual has descriptive title
- **Data labels**: Show values where helpful
- **Tooltips**: Rich information on hover
- **Responsive**: Works on different screen sizes

---

This comprehensive styling guide ensures your Jira Delivery Dashboard meets HHS standards, Power BI best practices, and creates a professional, accessible, and visually appealing dashboard.


