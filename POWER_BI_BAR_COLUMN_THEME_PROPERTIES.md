# Complete Power BI Bar/Column Chart Theme Properties Reference

## Master List of ALL Themeable Properties for Bar/Column Charts

This document contains the complete list of all Power BI theme JSON properties that can be controlled for Bar/Column charts (Clustered/Stacked Bar, Clustered/Stacked Column, 100% versions).

⚠️ **Important Notes:**
- Not every property appears in every visual type, but Bar/Column charts share the same property model
- Some properties can be themed only at a high level (e.g., fontSize, color, labelColor) but not ultra-specific settings like padding, inner radius, etc.
- Properties are organized by formatting bucket exactly as they appear internally in Power BI

---

## Theme JSON Structure

All properties go under:
```json
{
  "visualStyles": {
    "columnChart": {
      "*": {
        "<propertyBucket>": [{ "<propertyKey>": value }]
      }
    },
    "barChart": {
      "*": {
        "<propertyBucket>": [{ "<propertyKey>": value }]
      }
    }
  }
}
```

---

## 1. Title Properties

```json
"title": [{
  "show": true,
  "text": "Chart Title",
  "fontFamily": "Source Sans Pro",
  "fontSize": 14,
  "fontColor": { "solid": { "color": "#162e51" } },
  "alignment": "left",  // "left" | "center" | "right"
  "background": true,
  "backgroundColor": { "solid": { "color": "#fbfcfd" } },
  "outline": "none",  // "none" | "bottom" | "top" | "left" | "right" | "frame"
  "outlineColor": { "solid": { "color": "#dfe1e2" } },
  "outlineWeight": 1
}]
```

**Property Reference:**
- `title.show` - Boolean: Show/hide title
- `title.text` - String: Title text
- `title.fontFamily` - String: Font family name
- `title.fontSize` - Number: Font size in points
- `title.fontColor` - Object: Color object with solid.color
- `title.alignment` - String: "left" | "center" | "right"
- `title.background` - Boolean: Show title background
- `title.backgroundColor` - Object: Background color
- `title.outline` - String: Outline position
- `title.outlineColor` - Object: Outline color
- `title.outlineWeight` - Number: Outline thickness

---

## 2. Legend Properties

```json
"legend": [{
  "show": true,
  "position": "Bottom",  // "Top" | "Bottom" | "Left" | "Right" | "TopCenter" | "BottomCenter"
  "titleText": "Legend Title",
  "showTitle": true,
  "fontColor": { "solid": { "color": "#3d4551" } },
  "fontSize": 11,
  "fontFamily": "Source Sans Pro",
  "labelColor": { "solid": { "color": "#3d4551" } },
  "background": true,
  "backgroundColor": { "solid": { "color": "#fbfcfd" } },
  "outline": "none",
  "outlineColor": { "solid": { "color": "#dfe1e2" } },
  "outlineWeight": 1
}]
```

**Property Reference:**
- `legend.show` - Boolean: Show/hide legend
- `legend.position` - String: Legend position
- `legend.titleText` - String: Legend title text
- `legend.showTitle` - Boolean: Show legend title
- `legend.fontColor` - Object: Font color
- `legend.fontSize` - Number: Font size
- `legend.fontFamily` - String: Font family
- `legend.labelColor` - Object: Label text color
- `legend.background` - Boolean: Show background
- `legend.backgroundColor` - Object: Background color
- `legend.outline` - String: Outline style
- `legend.outlineColor` - Object: Outline color
- `legend.outlineWeight` - Number: Outline thickness

---

## 3. Data Colors Properties

```json
"dataColors": [{
  "general": {
    "useColorScale": false,
    "colorScaleType": "Sequential",  // "Sequential" | "Diverging"
    "minimum": 0,
    "maximum": 100,
    "minValue": 0,
    "maxValue": 100,
    "nullColor": { "solid": { "color": "#a9aeb1" } }
  },
  "single": {
    "color": { "solid": { "color": "#005ea2" } }
  },
  "fill": {
    "value": { "solid": { "color": "#005ea2" } }
  },
  "defaultColor": { "solid": { "color": "#005ea2" } },
  "showAll": true
}]
```

**Property Reference:**
- `dataColors.general.useColorScale` - Boolean: Use color scale
- `dataColors.general.colorScaleType` - String: "Sequential" | "Diverging"
- `dataColors.general.minimum` - Number: Scale minimum
- `dataColors.general.maximum` - Number: Scale maximum
- `dataColors.general.minValue` - Number: Minimum value
- `dataColors.general.maxValue` - Number: Maximum value
- `dataColors.general.nullColor` - Object: Color for null values
- `dataColors.single.color` - Object: Single color (univariate)
- `dataColors.fill.value` - Object: Fill color for each series
- `dataColors.defaultColor` - Object: Default data color
- `dataColors.showAll` - Boolean: Show all series colors

---

## 4. Data Labels Properties

```json
"labels": [{
  "show": true,
  "color": { "solid": { "color": "#1c1d1f" } },
  "labelColor": { "solid": { "color": "#1c1d1f" } },
  "fontSize": 10,
  "fontFamily": "Source Sans Pro",
  "displayUnits": 0,  // 0 = auto, 1000 = thousands, etc.
  "precision": 0,
  "position": "insideEnd",  // "insideEnd" | "insideCenter" | "outsideEnd"
  "text": "",
  "showSeries": true,
  "showCategory": true,
  "showValue": true,
  "labelDensity": 0,
  "orientation": 0,
  "backgroundColor": { "solid": { "color": "#ffffff" } },
  "backgroundTransparency": 0
}]
```

**Property Reference:**
- `labels.show` - Boolean: Show data labels
- `labels.color` - Object: Label text color
- `labels.labelColor` - Object: Alternative label color property
- `labels.fontSize` - Number: Font size
- `labels.fontFamily` - String: Font family
- `labels.displayUnits` - Number: Display units (0=auto, 1000=thousands, etc.)
- `labels.precision` - Number: Decimal precision
- `labels.position` - String: Label position
- `labels.text` - String: Custom display text
- `labels.showSeries` - Boolean: Show series name
- `labels.showCategory` - Boolean: Show category name
- `labels.showValue` - Boolean: Show value
- `labels.labelDensity` - Number: Label density (0-100)
- `labels.orientation` - Number: Text orientation angle
- `labels.backgroundColor` - Object: Label background color
- `labels.backgroundTransparency` - Number: Background transparency (0-100)

---

## 5. Category Axis Properties (X or Y depending on orientation)

```json
"categoryAxis": [{
  "show": true,
  // Note: axisType is NOT included in themes - Power BI determines this automatically
  "start": 0,
  "end": 100,
  "showAxisTitle": true,
  "axisTitle": "Category",
  "axisTitleColor": { "solid": { "color": "#565c65" } },
  "axisTitleFontSize": 11,
  "axisTitleFontFamily": "Source Sans Pro",
  "labelColor": { "solid": { "color": "#565c65" } },
  "labelDisplayUnits": 0,
  "labelPrecision": 0,
  "labelFontColor": { "solid": { "color": "#565c65" } },
  "labelFontSize": 10,
  "labelFontFamily": "Source Sans Pro",
  "labelDensity": 0,
  "labelAngle": 0,
  "showGridlines": true,
  "gridlineColor": { "solid": { "color": "#dfe1e2" } },
  "gridlineStyle": "solid",
  "gridlineThickness": 1,
  "lineColor": { "solid": { "color": "#a9aeb1" } },
  "lineStyle": "solid",
  "lineThickness": 1,
  "secLine": false,
  "reverse": false
}]
```

**Property Reference:**
- `categoryAxis.show` - Boolean: Show axis
- `categoryAxis.axisType` - **⚠️ NOT for themes:** Power BI determines this automatically. Do not include in theme JSON.
- `categoryAxis.start` - Number: Axis start value
- `categoryAxis.end` - Number: Axis end value
- `categoryAxis.showAxisTitle` - Boolean: Show axis title
- `categoryAxis.axisTitle` - String: Axis title text
- `categoryAxis.axisTitleColor` - Object: Title color
- `categoryAxis.axisTitleFontSize` - Number: Title font size
- `categoryAxis.axisTitleFontFamily` - String: Title font family
- `categoryAxis.labelColor` - Object: Label color
- `categoryAxis.labelDisplayUnits` - Number: Label display units
- `categoryAxis.labelPrecision` - Number: Label precision
- `categoryAxis.labelFontColor` - Object: Label font color
- `categoryAxis.labelFontSize` - Number: Label font size
- `categoryAxis.labelFontFamily` - String: Label font family
- `categoryAxis.labelDensity` - Number: Label density
- `categoryAxis.labelAngle` - Number: Label angle in degrees
- `categoryAxis.showGridlines` - Boolean: Show gridlines
- `categoryAxis.gridlineColor` - Object: Gridline color
- `categoryAxis.gridlineStyle` - String: Gridline style
- `categoryAxis.gridlineThickness` - Number: Gridline thickness
- `categoryAxis.lineColor` - Object: Axis line color
- `categoryAxis.lineStyle` - String: Axis line style
- `categoryAxis.lineThickness` - Number: Axis line thickness
- `categoryAxis.secLine` - Boolean: Show secondary axis line
- `categoryAxis.reverse` - Boolean: Reverse axis order

---

## 6. Value Axis Properties

```json
"valueAxis": [{
  "show": true,
  "showAxisTitle": true,
  "axisTitle": "Value",
  "axisTitleColor": { "solid": { "color": "#565c65" } },
  "axisTitleFontSize": 11,
  "axisTitleFontFamily": "Source Sans Pro",
  "labelColor": { "solid": { "color": "#565c65" } },
  "labelDisplayUnits": 0,
  "labelPrecision": 0,
  "labelFontColor": { "solid": { "color": "#565c65" } },
  "labelFontSize": 10,
  "labelFontFamily": "Source Sans Pro",
  "start": 0,
  "end": 100,
  "includeZero": true,
  "position": "left",  // "left" | "right"
  "showGridlines": true,
  "gridlineColor": { "solid": { "color": "#dfe1e2" } },
  "gridlineStyle": "solid",
  "gridlineThickness": 1,
  "lineColor": { "solid": { "color": "#a9aeb1" } },
  "lineStyle": "solid",
  "lineThickness": 1,
  "labelDensity": 0,
  "labelAngle": 0,
  "reverse": false
}]
```

**Property Reference:**
- `valueAxis.show` - Boolean: Show axis
- `valueAxis.showAxisTitle` - Boolean: Show axis title
- `valueAxis.axisTitle` - String: Axis title text
- `valueAxis.axisTitleColor` - Object: Title color
- `valueAxis.axisTitleFontSize` - Number: Title font size
- `valueAxis.axisTitleFontFamily` - String: Title font family
- `valueAxis.labelColor` - Object: Label color
- `valueAxis.labelDisplayUnits` - Number: Label display units
- `valueAxis.labelPrecision` - Number: Label precision
- `valueAxis.labelFontColor` - Object: Label font color
- `valueAxis.labelFontSize` - Number: Label font size
- `valueAxis.labelFontFamily` - String: Label font family
- `valueAxis.start` - Number: Axis start value
- `valueAxis.end` - Number: Axis end value
- `valueAxis.includeZero` - Boolean: Include zero in scale
- `valueAxis.position` - String: "left" | "right"
- `valueAxis.showGridlines` - Boolean: Show gridlines
- `valueAxis.gridlineColor` - Object: Gridline color
- `valueAxis.gridlineStyle` - String: Gridline style
- `valueAxis.gridlineThickness` - Number: Gridline thickness
- `valueAxis.lineColor` - Object: Axis line color
- `valueAxis.lineStyle` - String: Axis line style
- `valueAxis.lineThickness` - Number: Axis line thickness
- `valueAxis.labelDensity` - Number: Label density
- `valueAxis.labelAngle` - Number: Label angle
- `valueAxis.reverse` - Boolean: Reverse axis order

---

## 7. Plot Area Properties

```json
"plotArea": [{
  "background": true,
  "backgroundColor": { "solid": { "color": "#fbfcfd" } },
  "transparency": 0,
  "outline": "none",
  "outlineColor": { "solid": { "color": "#dfe1e2" } },
  "outlineWeight": 1
}]
```

**Property Reference:**
- `plotArea.background` - Boolean: Show background
- `plotArea.backgroundColor` - Object: Background color
- `plotArea.transparency` - Number: Background transparency (0-100)
- `plotArea.outline` - String: Outline style
- `plotArea.outlineColor` - Object: Outline color
- `plotArea.outlineWeight` - Number: Outline thickness

---

## 8. Effects (Visual Border & Shadow)

```json
"border": [{
  "show": true,
  "color": { "solid": { "color": "#dfe1e2" } },
  "radius": 8,
  "weight": 1
}],
"shadow": [{
  "show": false,
  "color": { "solid": { "color": "#000000" } },
  "blur": 4,
  "angle": 45,
  "distance": 2
}]
```

**Property Reference:**
- `border.show` - Boolean: Show border
- `border.color` - Object: Border color
- `border.radius` - Number: Border radius (rounded corners)
- `border.weight` - Number: Border thickness
- `shadow.show` - Boolean: Show shadow
- `shadow.color` - Object: Shadow color
- `shadow.blur` - Number: Shadow blur radius
- `shadow.angle` - Number: Shadow angle in degrees
- `shadow.distance` - Number: Shadow distance

---

## 9. General Visual Formatting

```json
"general": [{
  "formatString": "",
  "transparency": 0,
  "tooltip": true,
  "wordWrap": false
}]
```

**Property Reference:**
- `general.formatString` - String: DAX format override
- `general.transparency` - Number: Overall transparency (0-100)
- `general.tooltip` - Boolean: Enable tooltips
- `general.wordWrap` - Boolean: Enable word wrap

---

## 10. Small Multiples (if used)

```json
"smallMultiples": [{
  "layoutMode": "flow",  // "flow" | "grid"
  "columns": 2,
  "rows": 2,
  "titleFontColor": { "solid": { "color": "#162e51" } },
  "titleFontSize": 12,
  "titleFontFamily": "Source Sans Pro",
  "backgroundColor": { "solid": { "color": "#fbfcfd" } },
  "backgroundTransparency": 0,
  "borderColor": { "solid": { "color": "#dfe1e2" } },
  "borderWeight": 1,
  "innerPadding": 4,
  "outerPadding": 8
}]
```

**Property Reference:**
- `smallMultiples.layoutMode` - String: "flow" | "grid"
- `smallMultiples.columns` - Number: Number of columns
- `smallMultiples.rows` - Number: Number of rows
- `smallMultiples.titleFontColor` - Object: Title font color
- `smallMultiples.titleFontSize` - Number: Title font size
- `smallMultiples.titleFontFamily` - String: Title font family
- `smallMultiples.backgroundColor` - Object: Background color
- `smallMultiples.backgroundTransparency` - Number: Background transparency
- `smallMultiples.borderColor` - Object: Border color
- `smallMultiples.borderWeight` - Number: Border thickness
- `smallMultiples.innerPadding` - Number: Inner padding
- `smallMultiples.outerPadding` - Number: Outer padding

---

## 11. Zoom Slider (if available)

```json
"zoomSlider": [{
  "show": false,
  "tintColor": { "solid": { "color": "#005ea2" } },
  "thickness": 2,
  "ribbonColor": { "solid": { "color": "#97d4ea" } }
}]
```

**Property Reference:**
- `zoomSlider.show` - Boolean: Show zoom slider
- `zoomSlider.tintColor` - Object: Slider tint color
- `zoomSlider.thickness` - Number: Slider thickness
- `zoomSlider.ribbonColor` - Object: Ribbon color

---

## 12. Additional Formatting Properties

```json
"categoryLabels": [{
  "color": { "solid": { "color": "#565c65" } },
  "fontFamily": "Source Sans Pro",
  "fontSize": 10
}],
"dataPoint": [{
  "outline": false,
  "outlineColor": { "solid": { "color": "#ffffff" } },
  "outlineThickness": 1
}],
"fill": [{
  "color": { "solid": { "color": "#005ea2" } },
  "transparency": 0
}],
"slice": [{
  "expand": false
}]
```

**Property Reference:**
- `categoryLabels.color` - Object: Category label color
- `categoryLabels.fontFamily` - String: Category label font
- `categoryLabels.fontSize` - Number: Category label font size
- `dataPoint.outline` - Boolean: Show data point outline
- `dataPoint.outlineColor` - Object: Data point outline color
- `dataPoint.outlineThickness` - Number: Outline thickness
- `fill.color` - Object: Fill color (per-series override)
- `fill.transparency` - Number: Fill transparency
- `slice.expand` - Boolean: Expand slices (for pie/stacked charts)

---

## 13. Interactions Properties

```json
"visualHeader": [{
  "show": true,
  "position": "top",
  "tooltip": true
}]
```

**Property Reference:**
- `visualHeader.show` - Boolean: Show visual header
- `visualHeader.position` - String: Header position
- `visualHeader.tooltip` - Boolean: Enable header tooltip

---

## 14. Analytics Properties (Limited Themeability)

```json
"analytics": [{
  "constantLine": {
    "color": { "solid": { "color": "#d54309" } },
    "transparency": 0,
    "strokeWidth": 2,
    "style": "solid"
  }
}]
```

**Property Reference:**
- `analytics.constantLine.color` - Object: Constant line color
- `analytics.constantLine.transparency` - Number: Line transparency
- `analytics.constantLine.strokeWidth` - Number: Line width
- `analytics.constantLine.style` - String: Line style

**Note:** Most analytics objects (trendline, min/max, averages) cannot be default-themed.

---

## 15. Background Properties

```json
"background": [{
  "show": true,
  "color": { "solid": { "color": "#f1f3f6" } },
  "transparency": 0
}]
```

**Property Reference:**
- `background.show` - Boolean: Show background
- `background.color` - Object: Background color
- `background.transparency` - Number: Background transparency (0-100)

---

## 16. Layout Properties

```json
"layout": [{
  "lockAspect": false,
  "padding": 0
}]
```

**Property Reference:**
- `layout.lockAspect` - Boolean: Lock aspect ratio
- `layout.padding` - Number: Layout padding

---

## 17. Header Icons Properties

```json
"visualHeader": [{
  "iconColor": { "solid": { "color": "#565c65" } },
  "iconLineColor": { "solid": { "color": "#565c65" } },
  "iconBackground": false,
  "iconBackgroundColor": { "solid": { "color": "#fbfcfd" } },
  "show": true
}]
```

**Property Reference:**
- `visualHeader.iconColor` - Object: Icon color
- `visualHeader.iconLineColor` - Object: Icon line color
- `visualHeader.iconBackground` - Boolean: Show icon background
- `visualHeader.iconBackgroundColor` - Object: Icon background color
- `visualHeader.show` - Boolean: Show header

---

## 18. Tooltips Properties

```json
"tooltips": [{
  "type": "default",  // "default" | "report" | "none"
  "textSize": 11,
  "fontFamily": "Source Sans Pro",
  "fontColor": { "solid": { "color": "#1c1d1f" } },
  "backgroundColor": { "solid": { "color": "#1c1d1f" } },
  "transparency": 5
}]
```

**Property Reference:**
- `tooltips.type` - String: "default" | "report" | "none"
- `tooltips.textSize` - Number: Tooltip text size
- `tooltips.fontFamily` - String: Tooltip font family
- `tooltips.fontColor` - Object: Tooltip text color
- `tooltips.backgroundColor` - Object: Tooltip background color
- `tooltips.transparency` - Number: Background transparency

---

## 19. Shape Properties (Bar rounding, spacing, etc.)

```json
"shape": [{
  "show": true,
  "shapeType": "rectangle",
  "lineStyle": "solid",
  "lineThickness": 0,
  "roundedCorners": 2,  // Only supported in some visuals
  "stackedBarSpacing": 0,
  "innerPadding": 0
}]
```

**Property Reference:**
- `shape.show` - Boolean: Show shape
- `shape.shapeType` - String: Shape type
- `shape.lineStyle` - String: Line style
- `shape.lineThickness` - Number: Line thickness
- `shape.roundedCorners` - Number: Rounded corner radius (limited support)
- `shape.stackedBarSpacing` - Number: Spacing between stacked bars
- `shape.innerPadding` - Number: Inner padding

---

## 20. Sort Properties

**⚠️ NOT Themeable:** Sort settings cannot be themed via JSON.

---

## 21. Responsiveness Properties

**⚠️ NOT Themeable:** Responsiveness behavior is not exposed as a theme property.

---

## Complete Example: HHS Bar/Column Chart Theme

```json
{
  "name": "HHS Bar/Column Chart Theme",
  "visualStyles": {
    "columnChart": {
      "*": {
        "title": [{
          "show": true,
          "fontFamily": "Source Sans Pro",
          "fontSize": 14,
          "fontColor": { "solid": { "color": "#162e51" } },
          "alignment": "left"
        }],
        "legend": [{
          "show": true,
          "position": "Bottom",
          "fontFamily": "Source Sans Pro",
          "fontSize": 11,
          "labelColor": { "solid": { "color": "#3d4551" } }
        }],
        "dataColors": [{
          "defaultColor": { "solid": { "color": "#005ea2" } }
        }],
        "labels": [{
          "show": true,
          "fontFamily": "Source Sans Pro",
          "fontSize": 10,
          "color": { "solid": { "color": "#1c1d1f" } },
          "position": "insideEnd"
        }],
        "categoryAxis": [{
          "show": true,
          "labelFontFamily": "Source Sans Pro",
          "labelFontSize": 10,
          "labelColor": { "solid": { "color": "#565c65" } },
          "showGridlines": true,
          "gridlineColor": { "solid": { "color": "#dfe1e2" } },
          "gridlineThickness": 1,
          "lineColor": { "solid": { "color": "#a9aeb1" } },
          "lineThickness": 1
        }],
        "valueAxis": [{
          "show": true,
          "labelFontFamily": "Source Sans Pro",
          "labelFontSize": 10,
          "labelColor": { "solid": { "color": "#565c65" } },
          "showGridlines": true,
          "gridlineColor": { "solid": { "color": "#dfe1e2" } },
          "gridlineThickness": 1,
          "lineColor": { "solid": { "color": "#a9aeb1" } },
          "lineThickness": 1,
          "includeZero": true
        }],
        "plotArea": [{
          "backgroundColor": { "solid": { "color": "#fbfcfd" } }
        }],
        "border": [{
          "show": true,
          "color": { "solid": { "color": "#dfe1e2" } },
          "radius": 8,
          "weight": 1
        }],
        "background": [{
          "show": true,
          "color": { "solid": { "color": "#fbfcfd" } }
        }]
      }
    },
    "barChart": {
      "*": {
        // Same structure as columnChart
      }
    }
  }
}
```

---

## Usage Tips

1. **Test Incrementally**: Add properties one section at a time to verify they work
2. **Color Format**: Always use `{ "solid": { "color": "#hexcode" } }` format
3. **Font Families**: Use exact font names as they appear in Power BI
4. **Numeric Values**: Use appropriate ranges (e.g., fontSize: 8-24, transparency: 0-100)
5. **Boolean Values**: Use `true`/`false` (not strings)
6. **Validation**: Power BI will ignore invalid properties, so test carefully

---

## Quick Reference: HHS Color Palette

- Primary Blue: `#005ea2`
- Primary Dark: `#1a4480`
- Primary Darker: `#162e51`
- Primary Vivid: `#00bde3`
- Accent Cool (Success): `#00a398`
- Accent Warm (Alert): `#d54309`
- Secondary Yellow: `#face00`
- Base Darkest (Text): `#1c1d1f`
- Base Darker (Labels): `#3d4551`
- Base Dark (Subtle): `#565c65`
- Base Light (Borders): `#dfe1e2`
- Base Lighter (Background): `#f1f3f6`
- Base Lightest (Cards): `#fbfcfd`

---

This reference document provides complete control over Bar/Column chart theming in Power BI. Use it to create exactly the chart styling you need for your HHS dashboards.

