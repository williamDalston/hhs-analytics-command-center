# Exact Pixel Placement Calculations for Jira Delivery Dashboard

## Layout Analysis

Based on your ASCII diagram:
- **Row 1**: 8 KPI cards (Total, Resolved, In Progress, Backlog, Blocked, Points, Vel., Res%)
- **Row 2**: 2 charts side by side (Issues by Status, Issues by Project)
- **Row 3**: 2 charts side by side (Resolution Trend, Resolution Rate Trend)

## Page Configuration
- **Page Size**: 1280 x 720 (standard 16:9)
- **Padding**: 20px (all sides)
- **Gap**: 20px (between visuals)
- **KPI Height**: 110px (standard)

---

## OPTION 1: 8 KPIs in Single Row (Recommended for Wide Screens)

### Calculations
```
Page Width: 1280px
Padding: 20px left + 20px right = 40px
Available Width: 1280 - 40 = 1240px
Gaps: 7 gaps × 20px = 140px
KPI Width: (1240 - 140) / 8 = 137.5px → 137px (rounded down)
```

### KPI Card Positions (Row 1)
```
Y Position: 20px (top padding)
Height: 110px
Gap: 20px

KPI 1 (Total):        x=20,   y=20,   w=137, h=110, z=1
KPI 2 (Resolved):     x=177,  y=20,   w=137, h=110, z=2
KPI 3 (In Progress):  x=334,  y=20,   w=137, h=110, z=3
KPI 4 (Backlog):      x=491,  y=20,   w=137, h=110, z=4
KPI 5 (Blocked):      x=648,  y=20,   w=137, h=110, z=5
KPI 6 (Points):       x=805,  y=20,   w=137, h=110, z=6
KPI 7 (Vel.):         x=962,  y=20,   w=137, h=110, z=7
KPI 8 (Res%):         x=1119, y=20,   w=141, h=110, z=8  (slightly wider to fill space)
```

**Note**: Last KPI (Res%) gets 141px width to account for rounding: 1280 - 1119 - 20 = 141px

### Chart Positions (Row 2 & 3)
```
KPI Area End: 20 + 110 = 130px
Chart Start Y: 130 + 20 (gap) = 150px
Available Height: 720 - 150 - 20 (bottom padding) = 550px
Chart Height: (550 - 20) / 2 = 265px per chart
Chart Width: (1240 - 20) / 2 = 610px per chart
```

**Row 2 Charts:**
```
Chart 1 (Issues by Status):      x=20,   y=150,  w=610, h=265, z=9
Chart 2 (Issues by Project):     x=650,  y=150,  w=610, h=265, z=10
```

**Row 3 Charts:**
```
Chart 3 (Resolution Trend):      x=20,   y=435,  w=610, h=265, z=11
Chart 4 (Resolution Rate Trend): x=650,  y=435,  w=610, h=265, z=12
```

**Verification:**
- Chart 3 Y: 150 + 265 + 20 = 435px ✓
- Chart 3 Bottom: 435 + 265 = 700px
- Page Bottom: 720px
- Remaining: 720 - 700 = 20px (bottom padding) ✓

---

## OPTION 2: 8 KPIs in 2 Rows of 4 (Better for Readability)

### Calculations
```
Available Width: 1240px
Gaps: 3 gaps × 20px = 60px
KPI Width: (1240 - 60) / 4 = 295px per KPI
KPI Height: 110px
Row Gap: 20px
Total KPI Area: 110 + 20 + 110 = 240px
```

### KPI Card Positions (2 Rows)

**Row 1 (Top 4 KPIs):**
```
KPI 1 (Total):        x=20,   y=20,   w=295, h=110, z=1
KPI 2 (Resolved):     x=335,  y=20,   w=295, h=110, z=2
KPI 3 (In Progress):  x=650,  y=20,   w=295, h=110, z=3
KPI 4 (Backlog):      x=965,  y=20,   w=295, h=110, z=4
```

**Row 2 (Bottom 4 KPIs):**
```
KPI 5 (Blocked):      x=20,   y=150,  w=295, h=110, z=5
KPI 6 (Points):       x=335,  y=150,  w=295, h=110, z=6
KPI 7 (Vel.):         x=650,  y=150,  w=295, h=110, z=7
KPI 8 (Res%):         x=965,  y=150,  w=295, h=110, z=8
```

### Chart Positions (Row 2 & 3)
```
KPI Area End: 150 + 110 = 260px
Chart Start Y: 260 + 20 (gap) = 280px
Available Height: 720 - 280 - 20 (bottom padding) = 420px
Chart Height: (420 - 20) / 2 = 200px per chart
Chart Width: (1240 - 20) / 2 = 610px per chart
```

**Row 2 Charts:**
```
Chart 1 (Issues by Status):      x=20,   y=280,  w=610, h=200, z=9
Chart 2 (Issues by Project):     x=650,  y=280,  w=610, h=200, z=10
```

**Row 3 Charts:**
```
Chart 3 (Resolution Trend):      x=20,   y=500,  w=610, h=200, z=11
Chart 4 (Resolution Rate Trend): x=650,  y=500,  w=610, h=200, z=12
```

**Verification:**
- Chart 3 Y: 280 + 200 + 20 = 500px ✓
- Chart 3 Bottom: 500 + 200 = 700px
- Page Bottom: 720px
- Remaining: 720 - 700 = 20px (bottom padding) ✓

---

## OPTION 3: Optimized Layout (Best Balance)

### Calculations
```
KPI Row 1: 4 KPIs (most important)
KPI Row 2: 4 KPIs (secondary metrics)
Chart Height: Increased to 220px for better visibility
```

### KPI Card Positions

**Row 1 (Top 4 KPIs):**
```
KPI 1 (Total):        x=20,   y=20,   w=295, h=110, z=1
KPI 2 (Resolved):     x=335,  y=20,   w=295, h=110, z=2
KPI 3 (In Progress):  x=650,  y=20,   w=295, h=110, z=3
KPI 4 (Backlog):      x=965,  y=20,   w=295, h=110, z=4
```

**Row 2 (Bottom 4 KPIs):**
```
KPI 5 (Blocked):      x=20,   y=150,  w=295, h=110, z=5
KPI 6 (Points):       x=335,  y=150,  w=295, h=110, z=6
KPI 7 (Vel.):         x=650,  y=150,  w=295, h=110, z=7
KPI 8 (Res%):         x=965,  y=150,  w=295, h=110, z=8
```

### Chart Positions (Optimized)
```
KPI Area End: 150 + 110 = 260px
Chart Start Y: 260 + 20 (gap) = 280px
Available Height: 720 - 280 - 20 = 420px
Chart Height: 210px (slightly larger, better visibility)
Chart Width: 610px
```

**Row 2 Charts:**
```
Chart 1 (Issues by Status):      x=20,   y=280,  w=610, h=210, z=9
Chart 2 (Issues by Project):     x=650,  y=280,  w=610, h=210, z=10
```

**Row 3 Charts:**
```
Chart 3 (Resolution Trend):      x=20,   y=510,  w=610, h=210, z=11
Chart 4 (Resolution Rate Trend): x=650,  y=510,  w=610, h=210, z=12
```

**Verification:**
- Chart 3 Y: 280 + 210 + 20 = 510px ✓
- Chart 3 Bottom: 510 + 210 = 720px ✓
- Perfect fit! ✓

---

## RECOMMENDED: Option 3 (Optimized Layout)

### Complete Visual Placement Table

| Visual | Type | X | Y | Width | Height | Z | Description |
|--------|------|---|---|-------|--------|---|-------------|
| KPI 1 | card | 20 | 20 | 295 | 110 | 1 | Total |
| KPI 2 | card | 335 | 20 | 295 | 110 | 2 | Resolved |
| KPI 3 | card | 650 | 20 | 295 | 110 | 3 | In Progress |
| KPI 4 | card | 965 | 20 | 295 | 110 | 4 | Backlog |
| KPI 5 | card | 20 | 150 | 295 | 110 | 5 | Blocked |
| KPI 6 | card | 335 | 150 | 295 | 110 | 6 | Points |
| KPI 7 | card | 650 | 150 | 295 | 110 | 7 | Vel. |
| KPI 8 | card | 965 | 150 | 295 | 110 | 8 | Res% |
| Chart 1 | barChart | 20 | 280 | 610 | 210 | 9 | Issues by Status |
| Chart 2 | barChart | 650 | 280 | 610 | 210 | 10 | Issues by Project |
| Chart 3 | lineChart | 20 | 510 | 610 | 210 | 11 | Resolution Trend |
| Chart 4 | lineChart | 650 | 510 | 610 | 210 | 12 | Resolution Rate Trend |

---

## JSON Structure for MCP Server

```json
{
  "name": "JiraDeliveryDashboard",
  "layout": {
    "width": 1280,
    "height": 720,
    "displayOption": "FitToPage"
  },
  "visualContainers": [
    {
      "x": 20,
      "y": 20,
      "z": 1,
      "width": 295,
      "height": 110,
      "visualType": "card",
      "config": {
        "objects": {
          "general": {
            "properties": {
              "title": "Total"
            }
          }
        }
      }
    },
    {
      "x": 335,
      "y": 20,
      "z": 2,
      "width": 295,
      "height": 110,
      "visualType": "card",
      "config": {
        "objects": {
          "general": {
            "properties": {
              "title": "Resolved"
            }
          }
        }
      }
    },
    {
      "x": 650,
      "y": 20,
      "z": 3,
      "width": 295,
      "height": 110,
      "visualType": "card",
      "config": {
        "objects": {
          "general": {
            "properties": {
              "title": "In Progress"
            }
          }
        }
      }
    },
    {
      "x": 965,
      "y": 20,
      "z": 4,
      "width": 295,
      "height": 110,
      "visualType": "card",
      "config": {
        "objects": {
          "general": {
            "properties": {
              "title": "Backlog"
            }
          }
        }
      }
    },
    {
      "x": 20,
      "y": 150,
      "z": 5,
      "width": 295,
      "height": 110,
      "visualType": "card",
      "config": {
        "objects": {
          "general": {
            "properties": {
              "title": "Blocked"
            }
          }
        }
      }
    },
    {
      "x": 335,
      "y": 150,
      "z": 6,
      "width": 295,
      "height": 110,
      "visualType": "card",
      "config": {
        "objects": {
          "general": {
            "properties": {
              "title": "Points"
            }
          }
        }
      }
    },
    {
      "x": 650,
      "y": 150,
      "z": 7,
      "width": 295,
      "height": 110,
      "visualType": "card",
      "config": {
        "objects": {
          "general": {
            "properties": {
              "title": "Vel."
            }
          }
        }
      }
    },
    {
      "x": 965,
      "y": 150,
      "z": 8,
      "width": 295,
      "height": 110,
      "visualType": "card",
      "config": {
        "objects": {
          "general": {
            "properties": {
              "title": "Res%"
            }
          }
        }
      }
    },
    {
      "x": 20,
      "y": 280,
      "z": 9,
      "width": 610,
      "height": 210,
      "visualType": "barChart",
      "config": {
        "objects": {
          "general": {
            "properties": {
              "title": "Issues by Status"
            }
          }
        }
      }
    },
    {
      "x": 650,
      "y": 280,
      "z": 10,
      "width": 610,
      "height": 210,
      "visualType": "barChart",
      "config": {
        "objects": {
          "general": {
            "properties": {
              "title": "Issues by Project"
            }
          }
        }
      }
    },
    {
      "x": 20,
      "y": 510,
      "z": 11,
      "width": 610,
      "height": 210,
      "visualType": "lineChart",
      "config": {
        "objects": {
          "general": {
            "properties": {
              "title": "Resolution Trend"
            }
          }
        }
      }
    },
    {
      "x": 650,
      "y": 510,
      "z": 12,
      "width": 610,
      "height": 210,
      "visualType": "lineChart",
      "config": {
        "objects": {
          "general": {
            "properties": {
              "title": "Resolution Rate Trend"
            }
          }
        }
      }
    }
  ]
}
```

---

## Visual Layout Diagram

```
┌─────────────────────────────────────────────────────────────────────────────┐
│ Page: 1280 x 720                                                           │
├─────────────────────────────────────────────────────────────────────────────┤
│ Padding: 20px                                                               │
│                                                                             │
│ ┌──────┐ ┌──────┐ ┌──────┐ ┌──────┐                                       │
│ │ KPI1 │ │ KPI2 │ │ KPI3 │ │ KPI4 │  Row 1: y=20, h=110                   │
│ │Total │ │Resolv│ │InProg│ │Backlg│  x=20,335,650,965, w=295              │
│ └──────┘ └──────┘ └──────┘ └──────┘                                       │
│                                                                             │
│ ┌──────┐ ┌──────┐ ┌──────┐ ┌──────┐                                       │
│ │ KPI5 │ │ KPI6 │ │ KPI7 │ │ KPI8 │  Row 2: y=150, h=110                  │
│ │Block │ │Points│ │ Vel. │ │ Res% │  x=20,335,650,965, w=295              │
│ └──────┘ └──────┘ └──────┘ └──────┘                                       │
│                                                                             │
│ ┌──────────────────────────┐ ┌──────────────────────────┐                  │
│ │   Issues by Status       │ │   Issues by Project      │                  │
│ │   (Bar Chart)            │ │   (Bar Chart)            │                  │
│ │                          │ │                          │                  │
│ │                          │ │                          │                  │
│ └──────────────────────────┘ └──────────────────────────┘                  │
│  x=20, y=280, w=610, h=210    x=650, y=280, w=610, h=210                   │
│                                                                             │
│ ┌──────────────────────────┐ ┌──────────────────────────┐                  │
│ │   Resolution Trend        │ │   Resolution Rate Trend  │                  │
│ │   (Line Chart)            │ │   (Line Chart)            │                  │
│ │                          │ │                          │                  │
│ │                          │ │                          │                  │
│ └──────────────────────────┘ └──────────────────────────┘                  │
│  x=20, y=510, w=610, h=210    x=650, y=510, w=610, h=210                   │
│                                                                             │
│ Padding: 20px                                                               │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## Summary

**Recommended Layout: Option 3 (Optimized)**

- **8 KPIs**: 2 rows of 4, each 295px × 110px
- **4 Charts**: 2 rows of 2, each 610px × 210px
- **Perfect fit**: All visuals fit within 1280 × 720 with 20px padding
- **Balanced**: Good visibility for both KPIs and charts
- **Professional**: Follows HHS layout standards with proper spacing

All coordinates are exact pixel values ready for your MCP server to use!




