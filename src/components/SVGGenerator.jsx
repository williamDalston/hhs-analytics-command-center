import React, { useState, useEffect, useCallback } from 'react';
import { Download, Layout, Palette, Settings, CheckCircle, Shield, Maximize2, Grid3x3, Columns3, Smartphone, Copy, Grid, Save, FolderOpen, HelpCircle, Image as ImageIcon, FileText } from 'lucide-react';

// --- HHS Official Color Constants ---
const HHS_COLORS = {
    primary: {
        DEFAULT: '#005ea2',
        lightest: '#e5faff',
        lighter: '#ccecf2',
        dark: '#1a4480',
        darker: '#162e51',
        vivid: '#00bde3'
    },
    secondary: {
        DEFAULT: '#face00',
        lighter: '#fff5c2',
        dark: '#e5a000'
    },
    base: {
        lightest: '#fbfcfd',
        lighter: '#f1f3f6',
        light: '#dfe1e2',
        dark: '#565c65',
        darkest: '#1c1d1f'
    },
    accent: {
        warm: '#d54309',
        cool: '#00a398'
    }
};

const SVGGenerator = () => {
    // --- State ---
    const [layoutMode, setLayoutMode] = useState('federal'); // federal, sidebar, grid, kpi, three-col, asymmetric, mobile
    const [themeMode, setThemeMode] = useState('standard'); // standard, executive, frosted
    const [canvasPreset, setCanvasPreset] = useState('16:9'); // 16:9, 4:3, custom, mobile
    const [config, setConfig] = useState({
        width: 1280,
        height: 720,
        bgHex: HHS_COLORS.base.lighter, // #f1f3f6
        cardHex: '#ffffff',
        accentHex: HHS_COLORS.primary.DEFAULT, // #005ea2
        gap: 16,
        padding: 20,
        radius: 8, // Sharper corners for Gov
        strokeWidth: 0,
        opacity: 1,
        noise: false,
        headerHeight: 88,
        footerHeight: 0, // For disclaimers/branding
        kpiCount: 5, // Customizable KPI count
        showFooter: false,
        showTrustBar: false, // "An official website of the United States government" - default OFF
        trustBarHeight: 32,
        showLogo: true, // HHS Logo area
        logoAreaWidth: 200, // Width reserved for logo in header
        logoIsSquare: true, // HHS logo is square-shaped, not rectangular
        showHeaderAccent: true, // Yellow accent line at bottom of header
        showTitle: false, // Dashboard title/header text area - default OFF (users add titles in Power BI)
        titleHeight: 60,
        titlePosition: 'top', // 'top' or 'header' - where title appears
        showSlicerZone: false, // Explicit slicer/filter zone indicator at top
        slicerZoneHeight: 60, // Height of slicer zone if shown at top
        showSlicerZoneLabel: true, // Show "Slicer Zone" label text
        slicerZoneOpacity: 0.08, // Background opacity for slicer zone
        slicerZoneStyle: 'standard', // 'minimal', 'standard', 'full' - controls how much visual indication is shown
        slicerZoneShowBackground: true, // Show background fill
        slicerZoneShowBorders: true, // Show borders
        slicerZoneShowGuides: true, // Show guide lines
        showVisualCountWarning: true, // Warn if too many visuals (>10 recommended)
        gridSpacing: 20, // Grid overlay spacing
        gridOpacity: 0.1, // Grid overlay opacity
        federalRows: 2, // Number of rows for federal layout grid
        federalColumns: 2, // Number of columns for federal layout grid (fallback, used if federalRowColumns not set)
        federalRowColumns: [2, 2], // Array of column counts per row for federal layout
        useFederalPerRowColumns: false, // Toggle to use per-row column configuration for federal layout
        federalSidebarWidth: 280, // Width of sidebar in federal layout
        showFederalSidebar: true, // Show/hide sidebar in federal layout
        sidebarLayoutWidth: 260, // Width of sidebar in sidebar layout
        sidebarVisualCount: 1, // Number of visual areas in sidebar layout main area
        sidebarColumns: 1, // Columns for sidebar layout main area
        gridRows: 2, // Number of rows for grid layout
        gridColumns: 2, // Number of columns for grid layout (fallback, used if gridRowColumns not set)
        gridRowColumns: [2, 2], // Array of column counts per row (e.g., [2, 3, 1] means row 1 has 2 cols, row 2 has 3 cols, row 3 has 1 col)
        usePerRowColumns: false, // Toggle to use per-row column configuration
        kpiVisualCount: 1, // Number of visual areas in KPI layout main area
        kpiColumns: 1, // Columns for KPI layout main area
        kpiMainChartFullWidth: true, // If true, first visual is full-width, rest are in grid below
        threeColVisualCount: 1, // Number of visual areas per column in three-col layout
        asymmetricSideCount: 2, // Number of side cards in asymmetric layout
        mobileVisualCount: 3, // Number of visual cards in mobile layout
        showVisualTypes: true, // Show visual type indicators on cards
        showVisualLabels: true, // Show visual labels on cards
        defaultVisualType: 'card', // Default visual type for new cards
        visualTypes: {}, // Map of item index to visual type (e.g., {0: 'chart', 1: 'table'})
        visualLabels: {} // Map of item index to label text (e.g., {0: 'Sales by Region', 1: 'Monthly Trends'})
    });

    const [items, setItems] = useState([]);
    const [toast, setToast] = useState(null);
    const [showGrid, setShowGrid] = useState(false);
    const [showImportGuide, setShowImportGuide] = useState(false);
    const [showKeyboardShortcuts, setShowKeyboardShortcuts] = useState(false);
    const [showColorGuide, setShowColorGuide] = useState(false);
    const [importMode, setImportMode] = useState(false); // Toggle between manual and wireframe import
    const [wireframeText, setWireframeText] = useState('');
    const [wireframeData, setWireframeData] = useState(null); // Parsed wireframe data

    // --- Canvas Size Presets ---
    const applyCanvasPreset = (preset) => {
        setCanvasPreset(preset);
        switch(preset) {
            case '16:9':
                setConfig(prev => ({ ...prev, width: 1280, height: 720 }));
                break;
            case '4:3':
                setConfig(prev => ({ ...prev, width: 1024, height: 768 }));
                break;
            case 'mobile':
                setConfig(prev => ({ ...prev, width: 375, height: 812 }));
                break;
            case 'ultrawide':
                setConfig(prev => ({ ...prev, width: 1920, height: 1080 }));
                break;
            case 'portrait':
                setConfig(prev => ({ ...prev, width: 720, height: 1280 }));
                break;
            case 'custom':
                // Keep current dimensions
                break;
        }
    };

    // --- Layout Generator Engine ---
    const generateLayout = useCallback(() => {
        const { width, height, gap, padding, headerHeight, footerHeight, kpiCount, showFooter, showTrustBar, trustBarHeight, showLogo, logoAreaWidth, logoIsSquare, showTitle, titleHeight, titlePosition, showSlicerZone, slicerZoneHeight, federalRows, federalColumns, federalRowColumns, useFederalPerRowColumns, federalSidebarWidth, showFederalSidebar, sidebarLayoutWidth, sidebarVisualCount, sidebarColumns, gridRows, gridColumns, gridRowColumns, usePerRowColumns, kpiVisualCount, kpiColumns, kpiMainChartFullWidth, threeColVisualCount, asymmetricSideCount, mobileVisualCount, visualTypes, visualLabels } = config;
        const effW = width - (padding * 2);
        let effH = height - (padding * 2);
        let yOffset = 0;
        
        // Trust Bar (if enabled) - Always at very top
        if (showTrustBar) {
            effH -= trustBarHeight + gap;
            yOffset = trustBarHeight + gap;
        }
        
        // Footer adjustment
        if (showFooter && footerHeight > 0) {
            effH = effH - footerHeight - gap;
        }
        
        let newItems = [];
        let cardIndex = 0; // Track index for card-type items

        // Trust Bar (if enabled)
        if (showTrustBar) {
            newItems.push({ 
                x: 0, 
                y: 0, 
                w: width, 
                h: trustBarHeight, 
                type: 'trustbar', 
                fill: HHS_COLORS.base.lightest 
            });
        }

        const navH = headerHeight; 
        const footerH = showFooter ? footerHeight : 0;

        if (layoutMode === 'federal') {
            // HHS Standard: Top Dark Bar (Nav), White Content Area
            const headerY = yOffset;
            newItems.push({ x: 0, y: headerY, w: width, h: navH, type: 'header', fill: HHS_COLORS.primary.darker });
            
            // Logo area (left side of header) - HHS logo is square
            if (showLogo) {
                const logoSize = config.logoIsSquare ? Math.min(logoAreaWidth, 60) : 60;
                newItems.push({ 
                    x: padding, 
                    y: headerY + (navH - logoSize) / 2, 
                    w: logoSize, 
                    h: logoSize, 
                    type: 'logo', 
                    fill: 'transparent' 
                });
            }
            
            // Title area (right side of header, if enabled and position is 'header')
            if (showTitle && titlePosition === 'header') {
                const titleX = showLogo ? padding + logoAreaWidth + gap : padding;
                const titleW = width - titleX - padding;
                newItems.push({ 
                    x: titleX, 
                    y: headerY + (navH - titleHeight) / 2, 
                    w: titleW, 
                    h: titleHeight, 
                    type: 'title', 
                    fill: 'transparent' 
                });
            }
            
            // Slicer zone at top (if enabled) - for horizontal filter bar
            if (showSlicerZone && slicerZoneHeight > 0) {
                const slicerY = headerY + navH + (padding/2);
                newItems.push({
                    x: padding,
                    y: slicerY,
                    w: effW,
                    h: slicerZoneHeight,
                    type: 'slicerzone',
                    fill: 'transparent'
                });
            }
            
            let contentStartY = headerY + navH + (padding/2);
            // Adjust for slicer zone if shown
            if (showSlicerZone && slicerZoneHeight > 0) {
                contentStartY += slicerZoneHeight + gap;
            }
            const contentH = height - contentStartY - (showFooter ? footerH + gap : 0) - padding;
            
            let mainContentX = padding;
            let mainContentW = effW;
            
            // Left Card (e.g., filters/slicers) - optional
            if (showFederalSidebar && federalSidebarWidth > 0) {
                const sidebarW = Math.min(federalSidebarWidth, effW * 0.4); // Cap at 40% of width
                newItems.push({ x: padding, y: contentStartY, w: sidebarW, h: contentH - padding, type: 'sidebar' });
                mainContentX = padding + sidebarW + gap;
                mainContentW = effW - sidebarW - gap;
            }
            
            // Right side: Grid of visual areas (if rows and columns > 0)
            if (federalRows > 0 && federalColumns > 0 && mainContentW > 0 && contentH > 0) {
                const rows = Math.max(1, federalRows);
                const cardH = Math.max(50, (contentH - padding - (gap * (rows - 1))) / rows); // Min 50px height
                
                // Use per-row columns if enabled, otherwise use uniform columns
                if (useFederalPerRowColumns && federalRowColumns && federalRowColumns.length > 0) {
                    let currentY = contentStartY;
                    for (let row = 0; row < rows; row++) {
                        const cols = Math.max(1, federalRowColumns[row] || federalColumns);
                        const cardW = Math.max(50, (mainContentW - (gap * (cols - 1))) / cols); // Min 50px width
                        
                        for (let col = 0; col < cols; col++) {
                            newItems.push({
                                x: mainContentX + (col * (cardW + gap)),
                                y: currentY,
                                w: cardW,
                                h: cardH,
                                type: 'card',
                                index: cardIndex++
                            });
                        }
                        currentY += cardH + gap;
                    }
                } else {
                    // Uniform columns for all rows
                    const cols = Math.max(1, federalColumns);
                    const cardW = Math.max(50, (mainContentW - (gap * (cols - 1))) / cols); // Min 50px width
                    
                    for (let row = 0; row < rows; row++) {
                        for (let col = 0; col < cols; col++) {
                            newItems.push({
                                x: mainContentX + (col * (cardW + gap)),
                                y: contentStartY + (row * (cardH + gap)),
                                w: cardW,
                                h: cardH,
                                type: 'card',
                                index: cardIndex++
                            });
                        }
                    }
                }
            }

        } else if (layoutMode === 'sidebar') {
            // Classic Dashboard Sidebar
            let contentY = padding + yOffset;
            
            // Title area (if enabled and position is 'top')
            if (showTitle && titlePosition === 'top') {
                newItems.push({ 
                    x: padding, 
                    y: contentY, 
                    w: effW, 
                    h: titleHeight, 
                    type: 'title', 
                    fill: 'transparent' 
                });
                contentY += titleHeight + gap;
            }
            
            // Slicer zone at top (if enabled)
            if (showSlicerZone && slicerZoneHeight > 0) {
                newItems.push({
                    x: padding,
                    y: contentY,
                    w: effW,
                    h: slicerZoneHeight,
                    type: 'slicerzone',
                    fill: 'transparent'
                });
                contentY += slicerZoneHeight + gap;
            }
            
            const sideW = Math.min(sidebarLayoutWidth, effW * 0.35); // Cap at 35% of width
            const mainW = effW - sideW - gap;
            const availableH = effH - (showTitle && titlePosition === 'top' ? titleHeight + gap : 0) - (showSlicerZone && slicerZoneHeight > 0 ? slicerZoneHeight + gap : 0);
            
            newItems.push({ x: padding, y: contentY, w: sideW, h: availableH, type: 'nav' });
            
            const kpiH = 110;
            const mainContentH = availableH - kpiH - gap;
            
            newItems.push({ x: padding + sideW + gap, y: contentY, w: mainW, h: kpiH, type: 'kpi-strip' });
            
            // Grid of visuals in main area
            const cols = Math.max(1, Math.min(sidebarColumns, sidebarVisualCount));
            const rows = Math.max(1, Math.ceil(sidebarVisualCount / cols));
            const cardW = cols > 0 ? Math.max(50, (mainW - (gap * (cols - 1))) / cols) : mainW;
            const cardH = rows > 0 ? Math.max(50, (mainContentH - (gap * (rows - 1))) / rows) : mainContentH;
            
            for (let i = 0; i < sidebarVisualCount; i++) {
                const row = Math.floor(i / cols);
                const col = i % cols;
                newItems.push({
                    x: padding + sideW + gap + (col * (cardW + gap)),
                    y: contentY + kpiH + gap + (row * (cardH + gap)),
                    w: cardW,
                    h: cardH,
                    type: 'card',
                    index: cardIndex++
                });
            }

        } else if (layoutMode === 'grid') {
            // Customizable Grid
            let contentY = padding + yOffset;
            
            // Title area (if enabled and position is 'top')
            if (showTitle && titlePosition === 'top') {
                newItems.push({ 
                    x: padding, 
                    y: contentY, 
                    w: effW, 
                    h: titleHeight, 
                    type: 'title', 
                    fill: 'transparent' 
                });
                contentY += titleHeight + gap;
            }
            
            // Slicer zone at top (if enabled)
            if (showSlicerZone && slicerZoneHeight > 0) {
                newItems.push({
                    x: padding,
                    y: contentY,
                    w: effW,
                    h: slicerZoneHeight,
                    type: 'slicerzone',
                    fill: 'transparent'
                });
                contentY += slicerZoneHeight + gap;
            }
            
            const availableH = effH - (showTitle && titlePosition === 'top' ? titleHeight + gap : 0) - (showSlicerZone && slicerZoneHeight > 0 ? slicerZoneHeight + gap : 0);
            const rowH = (availableH - (gap * (gridRows - 1))) / gridRows;
            
            // Use per-row columns if enabled, otherwise use uniform columns
            if (usePerRowColumns && gridRowColumns && gridRowColumns.length > 0) {
                let currentY = contentY;
                for (let row = 0; row < gridRows; row++) {
                    const cols = Math.max(1, gridRowColumns[row] || gridColumns);
                    const colW = (effW - (gap * (cols - 1))) / cols;
                    
                    for (let col = 0; col < cols; col++) {
                        newItems.push({ 
                            x: padding + (col * (colW + gap)), 
                            y: currentY, 
                            w: colW, 
                            h: rowH, 
                            type: 'card',
                            index: cardIndex++
                        });
                    }
                    currentY += rowH + gap;
                }
            } else {
                // Uniform columns for all rows
                const colW = (effW - (gap * (gridColumns - 1))) / gridColumns;
                
                for (let row = 0; row < gridRows; row++) {
                    for (let col = 0; col < gridColumns; col++) {
                        newItems.push({ 
                            x: padding + (col * (colW + gap)), 
                            y: contentY + (row * (rowH + gap)), 
                            w: colW, 
                            h: rowH, 
                            type: 'card',
                            index: cardIndex++
                        });
                    }
                }
            }
        } 
        else if (layoutMode === 'kpi') {
            // Top KPI Row (customizable count)
            let contentY = padding + yOffset;
            
            // Title area (if enabled and position is 'top')
            if (showTitle && titlePosition === 'top') {
                newItems.push({ 
                    x: padding, 
                    y: contentY, 
                    w: effW, 
                    h: titleHeight, 
                    type: 'title', 
                    fill: 'transparent' 
                });
                contentY += titleHeight + gap;
            }
            
            // Slicer zone at top (if enabled)
            if (showSlicerZone && slicerZoneHeight > 0) {
                newItems.push({
                    x: padding,
                    y: contentY,
                    w: effW,
                    h: slicerZoneHeight,
                    type: 'slicerzone',
                    fill: 'transparent'
                });
                contentY += slicerZoneHeight + gap;
            }
            
            const kpiH = 100;
            const kpiW = (effW - (gap * (kpiCount - 1))) / kpiCount;
            const availableH = effH - (showTitle && titlePosition === 'top' ? titleHeight + gap : 0) - (showSlicerZone && slicerZoneHeight > 0 ? slicerZoneHeight + gap : 0);
            
            for(let i=0; i<kpiCount; i++) {
                newItems.push({ x: padding + (i * (kpiW + gap)), y: contentY, w: kpiW, h: kpiH, type: 'kpi' });
            }
            
            // Visuals below KPIs
            const mainContentH = availableH - kpiH - gap;
            let visualY = contentY + kpiH + gap;
            
            if (kpiMainChartFullWidth && kpiVisualCount > 0) {
                // First visual is full-width (main chart)
                const mainChartH = kpiVisualCount > 1 ? mainContentH * 0.6 : mainContentH; // 60% if there are more visuals below
                newItems.push({
                    x: padding,
                    y: visualY,
                    w: effW,
                    h: mainChartH,
                    type: 'main'
                });
                
                // Remaining visuals in grid below the main chart
                if (kpiVisualCount > 1) {
                    const remainingVisuals = kpiVisualCount - 1;
                    const remainingH = mainContentH - mainChartH - gap;
                    const cols = Math.max(1, Math.min(kpiColumns, remainingVisuals));
                    const rows = Math.max(1, Math.ceil(remainingVisuals / cols));
                    const cardW = cols > 0 ? Math.max(50, (effW - (gap * (cols - 1))) / cols) : effW;
                    const cardH = rows > 0 ? Math.max(50, (remainingH - (gap * (rows - 1))) / rows) : remainingH;
                    
                    for (let i = 0; i < remainingVisuals; i++) {
                        const row = Math.floor(i / cols);
                        const col = i % cols;
                        newItems.push({
                            x: padding + (col * (cardW + gap)),
                            y: visualY + mainChartH + gap + (row * (cardH + gap)),
                            w: cardW,
                            h: cardH,
                            type: 'card',
                            index: cardIndex++
                        });
                    }
                }
            } else {
                // Original grid layout (all visuals in grid)
                const cols = Math.max(1, Math.min(kpiColumns, kpiVisualCount));
                const rows = Math.max(1, Math.ceil(kpiVisualCount / cols));
                const cardW = cols > 0 ? Math.max(50, (effW - (gap * (cols - 1))) / cols) : effW;
                const cardH = rows > 0 ? Math.max(50, (mainContentH - (gap * (rows - 1))) / rows) : mainContentH;
                
                for (let i = 0; i < kpiVisualCount; i++) {
                    const row = Math.floor(i / cols);
                    const col = i % cols;
                    newItems.push({
                        x: padding + (col * (cardW + gap)),
                        y: visualY + (row * (cardH + gap)),
                        w: cardW,
                        h: cardH,
                        type: 'card',
                        index: cardIndex++
                    });
                }
            }
        }
        else if (layoutMode === 'three-col') {
            // 3-column layout (common for executive dashboards)
            let contentY = padding + yOffset;
            
            // Title area (if enabled and position is 'top')
            if (showTitle && titlePosition === 'top') {
                newItems.push({ 
                    x: padding, 
                    y: contentY, 
                    w: effW, 
                    h: titleHeight, 
                    type: 'title', 
                    fill: 'transparent' 
                });
                contentY += titleHeight + gap;
            }
            
            // Slicer zone at top (if enabled)
            if (showSlicerZone && slicerZoneHeight > 0) {
                newItems.push({
                    x: padding,
                    y: contentY,
                    w: effW,
                    h: slicerZoneHeight,
                    type: 'slicerzone',
                    fill: 'transparent'
                });
                contentY += slicerZoneHeight + gap;
            }
            
            const colW = (effW - (gap * 2)) / 3;
            
            // Top KPI row (customizable count)
            const kpiH = 90;
            const kpiW = (effW - (gap * (kpiCount - 1))) / kpiCount;
            const availableH = effH - (showTitle && titlePosition === 'top' ? titleHeight + gap : 0) - (showSlicerZone && slicerZoneHeight > 0 ? slicerZoneHeight + gap : 0);
            
            for(let i=0; i<kpiCount; i++) {
                newItems.push({ x: padding + (i * (kpiW + gap)), y: contentY, w: kpiW, h: kpiH, type: 'kpi' });
            }
            
            // Three columns below - each column can have multiple visuals
            const contentH = availableH - kpiH - gap;
            const visualsPerCol = Math.max(1, threeColVisualCount);
            const visualH = visualsPerCol > 0 ? Math.max(50, (contentH - (gap * (visualsPerCol - 1))) / visualsPerCol) : contentH;
            
            for (let col = 0; col < 3; col++) {
                for (let row = 0; row < visualsPerCol; row++) {
                    newItems.push({ 
                        x: padding + (col * (colW + gap)), 
                        y: contentY + kpiH + gap + (row * (visualH + gap)), 
                        w: colW, 
                        h: visualH, 
                        type: 'card',
                        index: cardIndex++
                    });
                }
            }
        }
        else if (layoutMode === 'asymmetric') {
            // Large main chart + smaller supporting visuals
            let contentY = padding + yOffset;
            
            // Title area (if enabled and position is 'top')
            if (showTitle && titlePosition === 'top') {
                newItems.push({ 
                    x: padding, 
                    y: contentY, 
                    w: effW, 
                    h: titleHeight, 
                    type: 'title', 
                    fill: 'transparent' 
                });
                contentY += titleHeight + gap;
            }
            
            // Slicer zone at top (if enabled)
            if (showSlicerZone && slicerZoneHeight > 0) {
                newItems.push({
                    x: padding,
                    y: contentY,
                    w: effW,
                    h: slicerZoneHeight,
                    type: 'slicerzone',
                    fill: 'transparent'
                });
                contentY += slicerZoneHeight + gap;
            }
            
            const mainW = (effW * 0.65) - (gap / 2);
            const sideW = (effW * 0.35) - (gap / 2);
            
            // Top KPIs (customizable count)
            const kpiH = 100;
            const kpiW = (effW - (gap * (kpiCount - 1))) / kpiCount;
            const availableH = effH - (showTitle && titlePosition === 'top' ? titleHeight + gap : 0) - (showSlicerZone && slicerZoneHeight > 0 ? slicerZoneHeight + gap : 0);
            
            for(let i=0; i<kpiCount; i++) {
                newItems.push({ x: padding + (i * (kpiW + gap)), y: contentY, w: kpiW, h: kpiH, type: 'kpi' });
            }
            
            const contentH = availableH - kpiH - gap;
            
            // Large main chart (left)
            newItems.push({ x: padding, y: contentY + kpiH + gap, w: mainW, h: contentH, type: 'main' });
            
            // Side cards (right) - customizable count
            const sideCardCount = Math.max(1, asymmetricSideCount);
            const sideCardH = sideCardCount > 0 ? Math.max(50, (contentH - (gap * (sideCardCount - 1))) / sideCardCount) : contentH;
            
            for (let i = 0; i < sideCardCount; i++) {
                newItems.push({ 
                    x: padding + mainW + gap, 
                    y: contentY + kpiH + gap + (i * (sideCardH + gap)), 
                    w: sideW, 
                    h: sideCardH, 
                    type: 'card',
                    index: cardIndex++
                });
            }
        }
        else if (layoutMode === 'mobile') {
            // Mobile-optimized vertical stack
            let contentY = padding + yOffset;
            
            // Title area (if enabled and position is 'top') - smaller for mobile
            if (showTitle && titlePosition === 'top') {
                newItems.push({ 
                    x: padding, 
                    y: contentY, 
                    w: effW, 
                    h: titleHeight * 0.8, 
                    type: 'title', 
                    fill: 'transparent' 
                });
                contentY += (titleHeight * 0.8) + gap;
            }
            
            // Slicer zone at top (if enabled) - smaller for mobile
            if (showSlicerZone && slicerZoneHeight > 0) {
                newItems.push({
                    x: padding,
                    y: contentY,
                    w: effW,
                    h: slicerZoneHeight * 0.8,
                    type: 'slicerzone',
                    fill: 'transparent'
                });
                contentY += (slicerZoneHeight * 0.8) + gap;
            }
            
            const availableH = effH - (showTitle && titlePosition === 'top' ? (titleHeight * 0.8) + gap : 0) - (showSlicerZone && slicerZoneHeight > 0 ? (slicerZoneHeight * 0.8) + gap : 0);
            const cardH = mobileVisualCount > 0 ? Math.max(50, (availableH - (gap * (mobileVisualCount - 1))) / mobileVisualCount) : availableH;
            
            for (let i = 0; i < mobileVisualCount; i++) {
                newItems.push({ 
                    x: padding, 
                    y: contentY + (i * (cardH + gap)), 
                    w: effW, 
                    h: cardH, 
                    type: i === 0 ? 'kpi' : 'card' 
                });
            }
        }

        // Add footer if enabled
        if (showFooter && footerHeight > 0) {
            newItems.push({ 
                x: 0, 
                y: height - footerHeight, 
                w: width, 
                h: footerHeight, 
                type: 'footer', 
                fill: HHS_COLORS.base.light 
            });
        }

        setItems(newItems);
        return newItems; // Return items for use in other functions
    }, [layoutMode, config]);

    const handleConfigChange = (key, val) => {
        setConfig(prev => ({ ...prev, [key]: val }));
    };

    // --- HHS Preset Handler ---
    const applyHHSPreset = (type) => {
        if (type === 'official') {
            setConfig(prev => ({
                ...prev,
                bgHex: HHS_COLORS.base.lighter, // #f1f3f6
                cardHex: '#ffffff',
                accentHex: HHS_COLORS.primary.DEFAULT, // #005ea2
                radius: 4, // Official gov is often squarer
                gap: 20,
                padding: 24
            }));
            setThemeMode('standard');
        } else if (type === 'dark_mode') {
            setConfig(prev => ({
                ...prev,
                bgHex: HHS_COLORS.base.darkest, // #1c1d1f
                cardHex: HHS_COLORS.base.dark, // #565c65
                accentHex: HHS_COLORS.primary.vivid, // #00bde3
                radius: 8
            }));
            setThemeMode('standard');
        } else if (type === 'print') {
            setConfig(prev => ({
                ...prev,
                bgHex: '#ffffff',
                cardHex: '#ffffff',
                accentHex: HHS_COLORS.base.dark,
                strokeWidth: 2,
                radius: 0,
                gap: 10
            }));
            setThemeMode('standard');
        }
    };

    // --- SVG Generation ---
    const getSVGString = () => {
        const { bgHex, cardHex, accentHex, radius, strokeWidth, width, height, noise, showVisualTypes, showVisualLabels, visualTypes, visualLabels, defaultVisualType } = config;

        let defs = '';
        let rects = '';
        
        // 1. Definitions (Filters)
        if (themeMode === 'executive') {
            // Professional Shadow
             defs += `
             <filter id="shadow-exec" x="-50%" y="-50%" width="200%" height="200%">
                <feDropShadow dx="0" dy="2" stdDeviation="6" flood-color="#001a33" flood-opacity="0.12"/>
             </filter>`;
        } else if (themeMode === 'frosted') {
             // Note: Real backdrop-blur in SVG is tricky without CSS, we simulate with opacity/white overlay
        }

        if (noise) {
            defs += `<filter id="noise"><feTurbulence type="fractalNoise" baseFrequency="0.6" numOctaves="3" stitchTiles="stitch"/><feColorMatrix type="saturate" values="0" /><feComponentTransfer><feFuncA type="linear" slope="0.05" /></feComponentTransfer></filter>`;
        }

        // 2. Background
        rects += `<rect width="100%" height="100%" fill="${bgHex}" />`;
        if (noise) rects += `<rect width="100%" height="100%" filter="url(#noise)" opacity="1" pointer-events="none"/>`;

        // 3. Items
        items.forEach(item => {
            const isHeader = item.type === 'header';
            const isFooter = item.type === 'footer';
            const isTrustBar = item.type === 'trustbar';
            const isLogo = item.type === 'logo';
            const isTitle = item.type === 'title';
            const isSlicerZone = item.type === 'slicerzone';
            
            // Determine fill based on type
            let fill;
            if (isTrustBar) {
                fill = item.fill || HHS_COLORS.base.lightest;
            } else if (isHeader) {
                fill = item.fill || HHS_COLORS.primary.darker;
            } else if (isFooter) {
                fill = item.fill || HHS_COLORS.base.light;
            } else if (isLogo || isTitle) {
                fill = 'transparent'; // These are placeholder areas
            } else {
                fill = themeMode === 'frosted' ? `${cardHex}CC` : cardHex;
            }
            
            const stroke = strokeWidth > 0 && !isHeader && !isFooter && !isTrustBar && !isLogo && !isTitle ? accentHex : 'none';
            const filter = themeMode === 'executive' && !isHeader && !isFooter && !isTrustBar && !isLogo && !isTitle ? 'url(#shadow-exec)' : 'none';
            
            // Special handling for header/footer/trustbar rounding
            const finalRadius = (isHeader || isFooter || isTrustBar || isLogo || isTitle) ? 0 : radius;

            // Only render visible elements (not transparent placeholders)
            if (!isLogo && !isTitle && !isSlicerZone) {
                rects += `<rect 
                    x="${item.x}" 
                    y="${item.y}" 
                    width="${item.w}" 
                    height="${item.h}" 
                    rx="${finalRadius}" 
                    fill="${fill}"
                    stroke="${stroke}"
                    stroke-width="${(isHeader || isFooter || isTrustBar) ? 0 : strokeWidth}"
                    filter="${filter}"
                />`;
                
                // Add visual type and label for card-type items
                if (item.type === 'card' || item.type === 'kpi' || item.type === 'main') {
                    // Use item.index if available, otherwise find index in items array
                    let itemIndex = item.index;
                    if (itemIndex === undefined) {
                        itemIndex = items.findIndex(i => 
                            Math.abs(i.x - item.x) < 1 && Math.abs(i.y - item.y) < 1 && 
                            Math.abs(i.w - item.w) < 1 && Math.abs(i.h - item.h) < 1 && i.type === item.type
                        );
                    }
                    // Safety check: if index not found, skip visual type/label
                    if (itemIndex >= 0) {
                        const visualType = visualTypes?.[itemIndex] || defaultVisualType || 'card';
                        const visualLabel = visualLabels?.[itemIndex] || '';
                        
                        // Visual type indicator (top-left corner)
                        if (showVisualTypes && visualType !== 'card') {
                        const typeIcons = {
                            'chart': '📊',
                            'table': '📋',
                            'map': '🗺️',
                            'kpi': '📈',
                            'slicer': '🔽',
                            'text': '📄',
                            'image': '🖼️'
                        };
                        const typeColors = {
                            'chart': HHS_COLORS.primary.DEFAULT,
                            'table': HHS_COLORS.accent.cool,
                            'map': HHS_COLORS.primary.vivid,
                            'kpi': HHS_COLORS.secondary.DEFAULT,
                            'slicer': HHS_COLORS.base.dark,
                            'text': HHS_COLORS.accent.warm,
                            'image': HHS_COLORS.primary.dark
                        };
                        const icon = typeIcons[visualType] || '📦';
                        const color = typeColors[visualType] || HHS_COLORS.primary.DEFAULT;
                        
                        // Icon background circle
                        rects += `<circle 
                            cx="${item.x + 20}" 
                            cy="${item.y + 20}" 
                            r="12" 
                            fill="${color}"
                            opacity="0.9"
                        />`;
                        // Icon text
                        rects += `<text 
                            x="${item.x + 20}" 
                            y="${item.y + 20}" 
                            font-family="Arial, sans-serif" 
                            font-size="14" 
                            fill="white"
                            text-anchor="middle"
                            dominant-baseline="middle"
                        >${icon}</text>`;
                        // Type label
                        rects += `<text 
                            x="${item.x + 20}" 
                            y="${item.y + 38}" 
                            font-family="Arial, sans-serif" 
                            font-size="9" 
                            fill="${color}"
                            font-weight="600"
                            text-anchor="middle"
                        >${visualType.toUpperCase()}</text>`;
                    }
                    
                    // Visual label (centered or top)
                    if (showVisualLabels && visualLabel) {
                        const lines = visualLabel.split('\n');
                        const lineHeight = 14;
                        const startY = item.y + (item.h / 2) - ((lines.length - 1) * lineHeight / 2);
                        
                        lines.forEach((line, idx) => {
                            rects += `<text 
                                x="${item.x + item.w / 2}" 
                                y="${startY + (idx * lineHeight)}" 
                                font-family="Arial, sans-serif" 
                                font-size="12" 
                                fill="${HHS_COLORS.base.darkest}"
                                opacity="0.7"
                                font-weight="500"
                                text-anchor="middle"
                                dominant-baseline="middle"
                            >${line}</text>`;
                        });
                        }
                    }
                }
            }
            
            // Trust bar - add subtle bottom border
            if (isTrustBar) {
                rects += `<rect x="0" y="${item.h - 1}" width="${item.w}" height="1" fill="${HHS_COLORS.base.light}" opacity="0.3" />`;
            }
            
            // Header - add yellow accent line at bottom (if enabled) - 3px height per wireframe spec
            if (isHeader && config.showHeaderAccent) {
                rects += `<rect x="0" y="${item.y + item.h - 3}" width="${item.w}" height="3" fill="${HHS_COLORS.secondary.DEFAULT}" />`;
            }
            
            // Footer - add subtle top border
            if (isFooter) {
                rects += `<rect x="0" y="${item.y}" width="${item.w}" height="2" fill="${HHS_COLORS.base.light}" opacity="0.5" />`;
            }
            
            // Logo area - square indicator for HHS logo placement
            if (isLogo) {
                // Subtle background (square)
                rects += `<rect 
                    x="${item.x}" 
                    y="${item.y}" 
                    width="${item.w}" 
                    height="${item.h}" 
                    fill="${HHS_COLORS.primary.DEFAULT}"
                    opacity="0.05"
                />`;
                // Square border (dashed)
                rects += `<rect 
                    x="${item.x}" 
                    y="${item.y}" 
                    width="${item.w}" 
                    height="${item.h}" 
                    fill="none"
                    stroke="${HHS_COLORS.primary.DEFAULT}"
                    stroke-width="2"
                    stroke-dasharray="6,4"
                    opacity="0.4"
                />`;
                // Helper text
                if (config.showLogo) {
                    rects += `<text 
                        x="${item.x + item.w / 2}" 
                        y="${item.y + item.h / 2}" 
                        font-family="Arial, sans-serif" 
                        font-size="10" 
                        fill="${HHS_COLORS.primary.DEFAULT}"
                        opacity="0.5"
                        text-anchor="middle"
                        dominant-baseline="middle"
                    >HHS Logo</text>`;
                }
            }
            
            // Title area - add subtle dashed border to show placement (only if enabled)
            if (isTitle) {
                rects += `<rect 
                    x="${item.x}" 
                    y="${item.y}" 
                    width="${item.w}" 
                    height="${item.h}" 
                    fill="none"
                    stroke="${HHS_COLORS.base.dark}"
                    stroke-width="1"
                    stroke-dasharray="3,3"
                    opacity="0.25"
                />`;
            }
            
            // Slicer zone - flexible visualization for Power BI slicer placement
            if (isSlicerZone) {
                const style = config.slicerZoneStyle || 'standard';
                const showBg = config.slicerZoneShowBackground !== false;
                const showBorders = config.slicerZoneShowBorders !== false;
                const showGuides = config.slicerZoneShowGuides !== false;
                
                // Minimal style: just a subtle top line
                if (style === 'minimal') {
                    rects += `<line 
                        x1="${item.x}" 
                        y1="${item.y}" 
                        x2="${item.x + item.w}" 
                        y2="${item.y}" 
                        stroke="${HHS_COLORS.primary.DEFAULT}"
                        stroke-width="1"
                        stroke-dasharray="4,4"
                        opacity="0.3"
                    />`;
                    if (config.showSlicerZoneLabel) {
                        rects += `<text 
                            x="${item.x + 10}" 
                            y="${item.y + 12}" 
                            font-family="Arial, sans-serif" 
                            font-size="10" 
                            fill="${HHS_COLORS.primary.DEFAULT}"
                            opacity="0.4"
                            font-weight="500"
                        >Slicer Zone</text>`;
                    }
                } 
                // Standard style: top/bottom borders, optional background
                else if (style === 'standard') {
                    if (showBg) {
                        rects += `<rect 
                            x="${item.x}" 
                            y="${item.y}" 
                            width="${item.w}" 
                            height="${item.h}" 
                            fill="${HHS_COLORS.primary.DEFAULT}"
                            opacity="${config.slicerZoneOpacity || 0.08}"
                        />`;
                    }
                    if (showBorders) {
                        // Top border
                        rects += `<line 
                            x1="${item.x}" 
                            y1="${item.y}" 
                            x2="${item.x + item.w}" 
                            y2="${item.y}" 
                            stroke="${HHS_COLORS.primary.DEFAULT}"
                            stroke-width="2"
                            opacity="0.4"
                        />`;
                        // Bottom border
                        rects += `<line 
                            x1="${item.x}" 
                            y1="${item.y + item.h}" 
                            x2="${item.x + item.w}" 
                            y2="${item.y + item.h}" 
                            stroke="${HHS_COLORS.primary.DEFAULT}"
                            stroke-width="2"
                            opacity="0.4"
                        />`;
                    }
                    if (config.showSlicerZoneLabel) {
                        rects += `<text 
                            x="${item.x + item.w / 2}" 
                            y="${item.y + item.h / 2}" 
                            font-family="Arial, sans-serif" 
                            font-size="12" 
                            fill="${HHS_COLORS.primary.DEFAULT}"
                            opacity="0.5"
                            text-anchor="middle"
                            dominant-baseline="middle"
                            font-weight="500"
                        >Slicer Zone</text>`;
                    }
                } 
                // Full style: all borders, background, guides
                else {
                    if (showBg) {
                        rects += `<rect 
                            x="${item.x}" 
                            y="${item.y}" 
                            width="${item.w}" 
                            height="${item.h}" 
                            fill="${HHS_COLORS.primary.DEFAULT}"
                            opacity="${config.slicerZoneOpacity || 0.08}"
                        />`;
                    }
                    if (showBorders) {
                        // Top border
                        rects += `<line 
                            x1="${item.x}" 
                            y1="${item.y}" 
                            x2="${item.x + item.w}" 
                            y2="${item.y}" 
                            stroke="${HHS_COLORS.primary.DEFAULT}"
                            stroke-width="2"
                            opacity="0.4"
                        />`;
                        // Bottom border
                        rects += `<line 
                            x1="${item.x}" 
                            y1="${item.y + item.h}" 
                            x2="${item.x + item.w}" 
                            y2="${item.y + item.h}" 
                            stroke="${HHS_COLORS.primary.DEFAULT}"
                            stroke-width="2"
                            opacity="0.4"
                        />`;
                        // Side borders (dashed)
                        rects += `<line 
                            x1="${item.x}" 
                            y1="${item.y}" 
                            x2="${item.x}" 
                            y2="${item.y + item.h}" 
                            stroke="${HHS_COLORS.primary.DEFAULT}"
                            stroke-width="2"
                            stroke-dasharray="6,4"
                            opacity="0.3"
                        />`;
                        rects += `<line 
                            x1="${item.x + item.w}" 
                            y1="${item.y}" 
                            x2="${item.x + item.w}" 
                            y2="${item.y + item.h}" 
                            stroke="${HHS_COLORS.primary.DEFAULT}"
                            stroke-width="2"
                            stroke-dasharray="6,4"
                            opacity="0.3"
                        />`;
                    }
                    if (config.showSlicerZoneLabel) {
                        rects += `<text 
                            x="${item.x + item.w / 2}" 
                            y="${item.y + item.h / 2}" 
                            font-family="Arial, sans-serif" 
                            font-size="14" 
                            fill="${HHS_COLORS.primary.DEFAULT}"
                            opacity="0.5"
                            text-anchor="middle"
                            dominant-baseline="middle"
                            font-weight="500"
                        >Slicer Zone</text>`;
                        rects += `<text 
                            x="${item.x + item.w / 2}" 
                            y="${item.y + item.h / 2 + 18}" 
                            font-family="Arial, sans-serif" 
                            font-size="11" 
                            fill="${HHS_COLORS.base.dark}"
                            opacity="0.4"
                            text-anchor="middle"
                            dominant-baseline="middle"
                        >Place filters here</text>`;
                    }
                    // Visual guide lines (if enabled)
                    if (showGuides) {
                        const guideSpacing = 40;
                        for (let x = item.x + guideSpacing; x < item.x + item.w; x += guideSpacing) {
                            rects += `<line 
                                x1="${x}" 
                                y1="${item.y + 4}" 
                                x2="${x}" 
                                y2="${item.y + item.h - 4}" 
                                stroke="${HHS_COLORS.primary.DEFAULT}"
                                stroke-width="1"
                                opacity="0.15"
                                stroke-dasharray="2,6"
                            />`;
                        }
                    }
                }
            }
        });
        
        // Add visual count warning if enabled and count > 10
        const visualCount = items.filter(item => 
            ['card', 'kpi', 'main', 'sidebar', 'nav', 'kpi-strip'].includes(item.type)
        ).length;
        
        if (config.showVisualCountWarning && visualCount > 10) {
            rects += `<text x="${width - 20}" y="${height - 20}" font-family="Arial" font-size="12" fill="#d54309" opacity="0.7" text-anchor="end">⚠ ${visualCount} visuals (recommend &lt;10)</text>`;
        }

        return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${width} ${height}" width="${width}" height="${height}">
            <defs>${defs}</defs>
            ${rects}
        </svg>`;
    };

    const copySVGToClipboard = async () => {
        const svgString = getSVGString();
        try {
            await navigator.clipboard.writeText(svgString);
            showToast("SVG Copied to Clipboard!");
        } catch (err) {
            // Fallback for older browsers
            const textArea = document.createElement('textarea');
            textArea.value = svgString;
            document.body.appendChild(textArea);
            textArea.select();
            document.execCommand('copy');
            document.body.removeChild(textArea);
            showToast("SVG Copied to Clipboard!");
        }
    };

    const downloadSVG = () => {
        const svgString = getSVGString();
        const blob = new Blob([svgString], { type: 'image/svg+xml' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        const timestamp = new Date().toISOString().split('T')[0];
        link.download = `HHS-Background-${layoutMode}-${config.width}x${config.height}-${timestamp}.svg`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
        showToast("SVG Exported! Ready for Power BI.");
    };

    const downloadPNG = async () => {
        try {
            const svgString = getSVGString();
            const svgBlob = new Blob([svgString], { type: 'image/svg+xml' });
            const url = URL.createObjectURL(svgBlob);
            
            const img = new Image();
            
            img.onerror = () => {
                URL.revokeObjectURL(url);
                showToast("Error: Could not load image for PNG export");
            };
            
            img.onload = () => {
                try {
                    const canvas = document.createElement('canvas');
                    canvas.width = config.width;
                    canvas.height = config.height;
                    const ctx = canvas.getContext('2d');
                    ctx.drawImage(img, 0, 0);
                    
                    canvas.toBlob((blob) => {
                        if (!blob) {
                            URL.revokeObjectURL(url);
                            showToast("Error: Could not create PNG");
                            return;
                        }
                                const pngUrl = URL.createObjectURL(blob);
                const link = document.createElement('a');
                link.href = pngUrl;
                const timestamp = new Date().toISOString().split('T')[0];
                link.download = `HHS-Background-${layoutMode}-${config.width}x${config.height}-${timestamp}.png`;
                        document.body.appendChild(link);
                        link.click();
                        document.body.removeChild(link);
                        URL.revokeObjectURL(pngUrl);
                        URL.revokeObjectURL(url);
                        showToast("PNG Exported!");
                    }, 'image/png');
                } catch (error) {
                    URL.revokeObjectURL(url);
                    showToast("Error: Failed to create PNG");
                    console.error('PNG export error:', error);
                }
            };
            img.src = url;
        } catch (error) {
            showToast("Error: PNG export failed");
            console.error('PNG export error:', error);
        }
    };

    const downloadReportSpec = () => {
        const layout = generateLayout();
        const spec = {
            metadata: {
                title: `HHS Power BI Report - ${layoutMode.charAt(0).toUpperCase() + layoutMode.slice(1)} Layout`,
                generated: new Date().toISOString(),
                version: '1.0',
                layout: layoutMode,
                dimensions: {
                    width: config.width,
                    height: config.height,
                    aspectRatio: (config.width / config.height).toFixed(2)
                }
            },
            branding: {
                trustBar: {
                    enabled: config.showTrustBar,
                    height: config.trustBarHeight
                },
                header: {
                    height: config.headerHeight,
                    accentLine: config.showHeaderAccent,
                    logo: {
                        enabled: config.showLogo,
                        areaWidth: config.logoAreaWidth,
                        isSquare: config.logoIsSquare
                    },
                    title: {
                        enabled: config.showTitle,
                        height: config.titleHeight,
                        position: config.titlePosition
                    }
                },
                footer: {
                    enabled: config.showFooter,
                    height: config.footerHeight
                },
                colors: {
                    background: config.bgHex,
                    card: config.cardHex,
                    accent: config.accentHex
                }
            },
            layout: {
                slicerZone: {
                    enabled: config.showSlicerZone,
                    height: config.slicerZoneHeight,
                    backgroundOpacity: config.slicerZoneBgOpacity,
                    showLabel: config.showSlicerZoneLabel
                },
                visualAreas: layout.map(item => ({
                    type: item.type,
                    x: item.x,
                    y: item.y,
                    width: item.w,
                    height: item.h,
                    label: item.label || `${item.type} area`
                })),
                grid: {
                    spacing: config.gridSpacing,
                    opacity: config.gridOpacity
                }
            },
            powerBI: {
                recommendations: {
                    maxVisuals: 10,
                    currentVisualCount: layout.filter(item => item.type === 'card' || item.type === 'main').length,
                    warning: layout.filter(item => item.type === 'card' || item.type === 'main').length > 10
                        ? 'Consider reducing visual count for better performance'
                        : null
                },
                importInstructions: [
                    '1. Export the SVG background from this tool',
                    '2. In Power BI Desktop, go to Format → Page background',
                    '3. Select "Image" and upload the exported SVG',
                    '4. Set image fit to "Fit" or "Fill"',
                    '5. Place visuals according to the coordinates in this spec'
                ]
            }
        };

        // Generate both JSON and Markdown versions
        const jsonSpec = JSON.stringify(spec, null, 2);
        const markdownSpec = `# ${spec.metadata.title}

**Generated:** ${new Date(spec.metadata.generated).toLocaleString()}  
**Layout Type:** ${spec.metadata.layout}  
**Dimensions:** ${spec.metadata.dimensions.width} × ${spec.metadata.dimensions.height}px (${spec.metadata.dimensions.aspectRatio}:1)

## Branding Configuration

### Trust Bar
- **Enabled:** ${spec.branding.trustBar.enabled ? 'Yes' : 'No'}
- **Height:** ${spec.branding.trustBar.height}px

### Header
- **Height:** ${spec.branding.header.height}px
- **Accent Line:** ${spec.branding.header.accentLine ? 'Yes' : 'No'}
- **Logo:**
  - Enabled: ${spec.branding.header.logo.enabled ? 'Yes' : 'No'}
  - Area Width: ${spec.branding.header.logo.areaWidth}px
  - Square: ${spec.branding.header.logo.isSquare ? 'Yes' : 'No'}
- **Title:**
  - Enabled: ${spec.branding.header.title.enabled ? 'Yes' : 'No'}
  - Height: ${spec.branding.header.title.height}px
  - Position: ${spec.branding.header.title.position}

### Footer
- **Enabled:** ${spec.branding.footer.enabled ? 'Yes' : 'No'}
- **Height:** ${spec.branding.footer.height}px

### Colors
- **Background:** ${spec.branding.colors.background}
- **Card:** ${spec.branding.colors.card}
- **Accent:** ${spec.branding.colors.accent}

## Layout Details

### Slicer Zone
- **Enabled:** ${spec.layout.slicerZone.enabled ? 'Yes' : 'No'}
- **Height:** ${spec.layout.slicerZone.height}px
- **Background Opacity:** ${spec.layout.slicerZone.backgroundOpacity}
- **Show Label:** ${spec.layout.slicerZone.showLabel ? 'Yes' : 'No'}

### Visual Areas

${spec.layout.visualAreas.map((area, idx) => `
**${idx + 1}. ${area.label}**
- Type: ${area.type}
- Position: (${area.x}, ${area.y})
- Size: ${area.width} × ${area.height}px
`).join('\n')}

### Grid
- **Spacing:** ${spec.layout.grid.spacing}px
- **Opacity:** ${spec.layout.grid.opacity}

## Power BI Recommendations

- **Current Visual Count:** ${spec.powerBI.recommendations.currentVisualCount}
- **Max Recommended:** ${spec.powerBI.recommendations.maxVisuals}
${spec.powerBI.recommendations.warning ? `- ⚠️ **Warning:** ${spec.powerBI.recommendations.warning}` : ''}

### Import Instructions

${spec.powerBI.importInstructions.map(step => step).join('\n')}

---

*This specification was generated by the HHS Power BI Developer Command Center SVG Generator.*
`;

        // Download JSON
        const jsonBlob = new Blob([jsonSpec], { type: 'application/json' });
        const jsonUrl = URL.createObjectURL(jsonBlob);
        const jsonLink = document.createElement('a');
        jsonLink.href = jsonUrl;
        const timestamp = new Date().toISOString().split('T')[0];
        jsonLink.download = `HHS-Report-Spec-${layoutMode}-${config.width}x${config.height}-${timestamp}.json`;
        document.body.appendChild(jsonLink);
        jsonLink.click();
        document.body.removeChild(jsonLink);
        URL.revokeObjectURL(jsonUrl);

        // Download Markdown
        const mdBlob = new Blob([markdownSpec], { type: 'text/markdown' });
        const mdUrl = URL.createObjectURL(mdBlob);
        const mdLink = document.createElement('a');
        mdLink.href = mdUrl;
        mdLink.download = `HHS-Report-Spec-${layoutMode}-${config.width}x${config.height}-${timestamp}.md`;
        document.body.appendChild(mdLink);
        mdLink.click();
        document.body.removeChild(mdLink);
        URL.revokeObjectURL(mdUrl);

        showToast("Report specification exported (JSON + Markdown)!");
    };

    const saveTemplate = () => {
        try {
            const template = {
                layoutMode,
                themeMode,
                canvasPreset,
                config,
                timestamp: new Date().toISOString()
            };
            const templates = JSON.parse(localStorage.getItem('svgGeneratorTemplates') || '[]');
            templates.push(template);
            localStorage.setItem('svgGeneratorTemplates', JSON.stringify(templates));
            showToast("Template Saved!");
        } catch (error) {
            showToast("Error: Could not save template");
            console.error('Template save error:', error);
        }
    };

    const loadTemplate = (template) => {
        try {
            if (!template || !template.config) {
                showToast("Error: Invalid template");
                return;
            }
            setLayoutMode(template.layoutMode || 'federal');
            setThemeMode(template.themeMode || 'standard');
            setCanvasPreset(template.canvasPreset || '16:9');
            setConfig(template.config);
            showToast("Template Loaded!");
        } catch (error) {
            showToast("Error: Could not load template");
            console.error('Template load error:', error);
        }
    };

    const getSavedTemplates = () => {
        try {
            return JSON.parse(localStorage.getItem('svgGeneratorTemplates') || '[]');
        } catch (error) {
            console.error('Error loading templates:', error);
            return [];
        }
    };

    const showToast = (msg) => {
        setToast(msg);
        setTimeout(() => setToast(null), 3000);
    };

    // --- Wireframe Parser ---
    const parseWireframe = (wireframeText) => {
        try {
            const lines = wireframeText.split('\n');
            const pages = [];
            const layouts = {};
            let currentPage = null;
            let currentLayout = null;
            let inLayoutSection = false;
            let inVisualsSection = false;
            
            // Extract common elements
            const commonElements = {
                trustBarHeight: 32,
                padding: 20,
                radius: 8,
                gridSpacing: 20,
                gridOpacity: 0.1,
                headerHeight: 88,
                headerBg: '#162e51',
                accentColor: '#face00',
                accentHeight: 3
            };
            
            // Parse each line
            for (let i = 0; i < lines.length; i++) {
                const line = lines[i];
                
                // Detect page sections (e.g., "## PAGE 1: Page Name")
                const pageMatch = line.match(/##\s*PAGE\s*(\d+):\s*(.+)/i);
                if (pageMatch) {
                    const pageNum = parseInt(pageMatch[1]);
                    const pageName = pageMatch[2].trim();
                    currentPage = {
                        number: pageNum,
                        name: pageName,
                        layout: null,
                        visuals: [],
                        gridConfig: null,
                        settings: {}
                    };
                    pages.push(currentPage);
                    inLayoutSection = false;
                    inVisualsSection = false;
                    continue;
                }
                
                // Detect layout type (e.g., "### Layout Type: FEDERAL")
                const layoutTypeMatch = line.match(/###\s*Layout\s+Type:\s*(\w+)/i);
                if (layoutTypeMatch && currentPage) {
                    let layoutName = layoutTypeMatch[1].toLowerCase().replace(/\s+/g, '-');
                    // Normalize layout names
                    if (layoutName === 'federal') layoutName = 'federal';
                    if (layoutName === 'sidebar') layoutName = 'sidebar';
                    if (layoutName === 'grid') layoutName = 'grid';
                    if (layoutName === 'kpi-top' || layoutName === 'kpi') layoutName = 'kpi';
                    if (layoutName === 'three-column' || layoutName === 'three-col') layoutName = 'three-col';
                    if (layoutName === 'asymmetric') layoutName = 'asymmetric';
                    if (layoutName === 'mobile') layoutName = 'mobile';
                    
                    currentPage.layout = layoutName;
                    currentLayout = layoutName;
                    inLayoutSection = true;
                    if (!layouts[layoutName]) {
                        layouts[layoutName] = { ...commonElements, visuals: [] };
                    }
                    continue;
                }
                
                // Detect layout sections (legacy format: "## 1. FEDERAL LAYOUT")
                const legacyLayoutMatch = line.match(/##\s*\d+\.\s*(\w+)\s+LAYOUT/i);
                if (legacyLayoutMatch && !currentPage) {
                    currentLayout = legacyLayoutMatch[1].toLowerCase().replace(/\s+/g, '-');
                    if (currentLayout === 'federal') currentLayout = 'federal';
                    if (currentLayout === 'sidebar') currentLayout = 'sidebar';
                    if (currentLayout === 'grid') currentLayout = 'grid';
                    if (currentLayout === 'kpi-top' || currentLayout === 'kpi') currentLayout = 'kpi';
                    if (currentLayout === 'three-column' || currentLayout === 'three-col') currentLayout = 'three-col';
                    if (currentLayout === 'asymmetric') currentLayout = 'asymmetric';
                    if (currentLayout === 'mobile') currentLayout = 'mobile';
                    inLayoutSection = true;
                    layouts[currentLayout] = { ...commonElements, visuals: [] };
                    continue;
                }
                
                // Detect Visuals section
                if (line.match(/^\*\*Visuals:\*\*|^Visuals:/i)) {
                    inVisualsSection = true;
                    continue;
                }
                
                // Parse visual specifications (e.g., "1. **Chart 1** - "Sales by Region" (show label: yes)")
                if (inVisualsSection && (currentPage || currentLayout)) {
                    const visualMatch = line.match(/(\d+)\.\s*\*\*([^*]+)\*\*\s*-\s*"([^"]+)"\s*\(show\s+label:\s*(yes|no)\)/i);
                    if (visualMatch) {
                        const visualIndex = parseInt(visualMatch[1]) - 1;
                        const visualType = visualMatch[2].trim();
                        const labelText = visualMatch[3].trim();
                        const showLabel = visualMatch[4].toLowerCase() === 'yes';
                        
                        // Determine visual type
                        let type = 'card';
                        if (visualType.match(/kpi/i)) type = 'kpi';
                        else if (visualType.match(/chart/i)) type = 'chart';
                        else if (visualType.match(/table/i)) type = 'table';
                        else if (visualType.match(/map/i)) type = 'map';
                        else if (visualType.match(/slicer/i)) type = 'slicer';
                        else if (visualType.match(/text/i)) type = 'text';
                        else if (visualType.match(/image/i)) type = 'image';
                        
                        const visual = {
                            index: visualIndex,
                            type: type,
                            label: labelText,
                            showLabel: showLabel,
                            originalType: visualType
                        };
                        
                        if (currentPage) {
                            currentPage.visuals.push(visual);
                        } else if (currentLayout) {
                            if (!layouts[currentLayout].visuals) {
                                layouts[currentLayout].visuals = [];
                            }
                            layouts[currentLayout].visuals.push(visual);
                        }
                        continue;
                    }
                }
                
                // Parse Grid Configuration
                if (line.match(/^\*\*Grid\s+Configuration:\*\*|^Grid\s+Configuration:/i)) {
                    if (currentPage) {
                        currentPage.gridConfig = { rows: null, columns: null, rowColumns: [] };
                    }
                    continue;
                }
                
                // Parse grid rows
                const gridRowsMatch = line.match(/Rows:\s*(\d+)/i);
                if (gridRowsMatch && (currentPage || currentLayout)) {
                    const rows = parseInt(gridRowsMatch[1]);
                    if (currentPage && currentPage.gridConfig) {
                        currentPage.gridConfig.rows = rows;
                    } else if (currentLayout) {
                        layouts[currentLayout].gridRows = rows;
                    }
                }
                
                // Parse grid columns
                const gridColsMatch = line.match(/Columns:\s*(\d+)/i);
                if (gridColsMatch && (currentPage || currentLayout)) {
                    const cols = parseInt(gridColsMatch[1]);
                    if (currentPage && currentPage.gridConfig) {
                        currentPage.gridConfig.columns = cols;
                    } else if (currentLayout) {
                        layouts[currentLayout].gridColumns = cols;
                    }
                }
                
                // Parse per-row columns (e.g., "Row 1 Columns: 3")
                const rowColsMatch = line.match(/Row\s+(\d+)\s+Columns:\s*(\d+)/i);
                if (rowColsMatch && currentPage && currentPage.gridConfig) {
                    const rowIndex = parseInt(rowColsMatch[1]) - 1;
                    const cols = parseInt(rowColsMatch[2]);
                    if (!currentPage.gridConfig.rowColumns) {
                        currentPage.gridConfig.rowColumns = [];
                    }
                    currentPage.gridConfig.rowColumns[rowIndex] = cols;
                }
                
                // Parse page settings (e.g., "**Federal Settings:**", "Sidebar Width: 280px")
                if (currentPage && line.match(/\*\*.*Settings:\*\*|Settings:/i)) {
                    // Settings section detected, will parse individual settings below
                    continue;
                }
                
                // Parse sidebar width in settings
                if (currentPage && line.match(/Sidebar\s+Width:\s*(\d+)/i)) {
                    const sidebarMatch = line.match(/Sidebar\s+Width:\s*(\d+)/i);
                    if (sidebarMatch) {
                        if (!currentPage.settings) currentPage.settings = {};
                        currentPage.settings.sidebarWidth = parseInt(sidebarMatch[1]);
                    }
                }
                
                // Parse show sidebar setting
                if (currentPage && line.match(/Show\s+Sidebar:\s*(yes|no)/i)) {
                    const showMatch = line.match(/Show\s+Sidebar:\s*(yes|no)/i);
                    if (showMatch) {
                        if (!currentPage.settings) currentPage.settings = {};
                        currentPage.settings.showSidebar = showMatch[1].toLowerCase() === 'yes';
                    }
                }
                
                // Parse KPI count in settings
                if (currentPage && line.match(/KPI\s+Count:\s*(\d+)/i)) {
                    const kpiMatch = line.match(/KPI\s+Count:\s*(\d+)/i);
                    if (kpiMatch) {
                        if (!currentPage.settings) currentPage.settings = {};
                        currentPage.settings.kpiCount = parseInt(kpiMatch[1]);
                    }
                }
                
                // Parse visuals per column
                if (currentPage && line.match(/Visuals\s+Per\s+Column:\s*(\d+)/i)) {
                    const visualMatch = line.match(/Visuals\s+Per\s+Column:\s*(\d+)/i);
                    if (visualMatch) {
                        if (!currentPage.settings) currentPage.settings = {};
                        currentPage.settings.visualsPerColumn = parseInt(visualMatch[1]);
                    }
                }
                
                // Parse side card count
                if (currentPage && line.match(/Side\s+Card\s+Count:\s*(\d+)/i)) {
                    const sideMatch = line.match(/Side\s+Card\s+Count:\s*(\d+)/i);
                    if (sideMatch) {
                        if (!currentPage.settings) currentPage.settings = {};
                        currentPage.settings.sideCardCount = parseInt(sideMatch[1]);
                    }
                }
                
                // Parse visual count
                if (currentPage && line.match(/Visual\s+Count:\s*(\d+)/i)) {
                    const visualMatch = line.match(/Visual\s+Count:\s*(\d+)/i);
                    if (visualMatch) {
                        if (!currentPage.settings) currentPage.settings = {};
                        currentPage.settings.visualCount = parseInt(visualMatch[1]);
                    }
                }
                
                // Extract specifications
                if (inLayoutSection && currentLayout) {
                    // Header height
                    const headerMatch = line.match(/Header.*?(\d+)px/i);
                    if (headerMatch) {
                        layouts[currentLayout].headerHeight = parseInt(headerMatch[1]);
                    }
                    
                    // Sidebar width (look for "260-280px" or "260px")
                    const sidebarMatch = line.match(/(?:Sidebar|sidebar).*?(\d+)(?:-(\d+))?px/i);
                    if (sidebarMatch) {
                        layouts[currentLayout].sidebarWidth = parseInt(sidebarMatch[1]);
                    }
                    
                    // Grid dimensions (2×2, 3×3, etc.)
                    const gridMatch = line.match(/(?:Grid|grid).*?(\d+)[×xX](\d+)/i);
                    if (gridMatch) {
                        layouts[currentLayout].gridRows = parseInt(gridMatch[1]);
                        layouts[currentLayout].gridColumns = parseInt(gridMatch[2]);
                    }
                    
                    // KPI count - look for "4 KPI" or count "KPI Card" in diagrams
                    const kpiMatch = line.match(/(\d+)\s+KPI/i);
                    if (kpiMatch) {
                        layouts[currentLayout].kpiCount = parseInt(kpiMatch[1]);
                    }
                    // Count KPI cards in ASCII diagrams
                    const kpiCardMatches = line.match(/KPI\s+Card/gi);
                    if (kpiCardMatches && kpiCardMatches.length > 0) {
                        layouts[currentLayout].kpiCount = Math.max(layouts[currentLayout].kpiCount || 0, kpiCardMatches.length);
                    }
                    
                    // Visual count per column (for three-col layout)
                    const visualPerColMatch = line.match(/(\d+)\s+visual.*?column/i);
                    if (visualPerColMatch) {
                        layouts[currentLayout].visualCount = parseInt(visualPerColMatch[1]);
                    }
                    
                    // General visual count
                    const visualMatch = line.match(/(\d+)\s+visual/i);
                    if (visualMatch && !layouts[currentLayout].visualCount) {
                        layouts[currentLayout].visualCount = parseInt(visualMatch[1]);
                    }
                    
                    // Count Chart instances in diagrams
                    const chartMatches = line.match(/Chart\s+\d+/gi);
                    if (chartMatches && chartMatches.length > 0) {
                        const chartCount = chartMatches.length;
                        if (!layouts[currentLayout].visualCount || chartCount > layouts[currentLayout].visualCount) {
                            layouts[currentLayout].visualCount = chartCount;
                        }
                    }
                }
                
                // End of layout section
                if (line.startsWith('---') && inLayoutSection) {
                    inLayoutSection = false;
                    inVisualsSection = false;
                }
                
                // End of visuals section
                if (line.startsWith('---') && inVisualsSection) {
                    inVisualsSection = false;
                }
            }
            
            // Return pages if found, otherwise return layouts (legacy format)
            if (pages.length > 0) {
                return { pages, layouts, commonElements, hasPages: true };
            } else {
                return { layouts, commonElements, hasPages: false };
            }
        } catch (error) {
            console.error('Error parsing wireframe:', error);
            return null;
        }
    };

    // --- Apply Wireframe Layout ---
    const applyWireframeLayout = (layoutName, wireframeData) => {
        if (!wireframeData) {
            showToast('No wireframe data available');
            return;
        }
        
        // Handle page-based wireframes
        if (wireframeData.hasPages && wireframeData.pages) {
            const page = wireframeData.pages.find(p => p.layout === layoutName || p.number.toString() === layoutName);
            if (page) {
                applyWireframePage(page, wireframeData);
                return;
            }
        }
        
        // Handle legacy layout-based wireframes
        if (!wireframeData.layouts || !wireframeData.layouts[layoutName]) {
            showToast('Layout not found in wireframe');
            return;
        }
        
        const layout = wireframeData.layouts[layoutName];
        const common = wireframeData.commonElements;
        
        // Set layout mode
        setLayoutMode(layoutName);
        
        // Apply common settings
        const newConfig = {
            ...config,
            padding: common.padding || 20,
            radius: common.radius || 8,
            gridSpacing: common.gridSpacing || 20,
            gridOpacity: common.gridOpacity || 0.1,
            headerHeight: layout.headerHeight || common.headerHeight || 88,
            trustBarHeight: common.trustBarHeight || 32,
            showHeaderAccent: true,
            accentHex: common.accentColor || '#face00'
        };
        
        // Apply layout-specific settings
        if (layoutName === 'federal') {
            newConfig.federalRows = layout.gridRows || 2;
            newConfig.federalColumns = layout.gridColumns || 2;
            newConfig.federalSidebarWidth = layout.sidebarWidth || 280;
            newConfig.showFederalSidebar = !!layout.sidebarWidth;
        } else if (layoutName === 'sidebar') {
            newConfig.sidebarLayoutWidth = layout.sidebarWidth || 260;
        } else if (layoutName === 'grid') {
            newConfig.gridRows = layout.gridRows || 2;
            newConfig.gridColumns = layout.gridColumns || 2;
        } else if (layoutName === 'kpi') {
            newConfig.kpiCount = layout.kpiCount || 5;
        } else if (layoutName === 'three-col') {
            newConfig.threeColVisualCount = layout.visualCount || 3;
        } else if (layoutName === 'asymmetric') {
            newConfig.asymmetricSideCount = layout.visualCount || 2;
        } else if (layoutName === 'mobile') {
            newConfig.mobileVisualCount = layout.visualCount || 3;
        }
        
        // Apply visual labels if available
        if (layout.visuals && layout.visuals.length > 0) {
            const visualTypes = {};
            const visualLabels = {};
            layout.visuals.forEach(visual => {
                visualTypes[visual.index] = visual.type;
                visualLabels[visual.index] = visual.showLabel ? visual.label : '';
            });
            newConfig.visualTypes = { ...config.visualTypes, ...visualTypes };
            newConfig.visualLabels = { ...config.visualLabels, ...visualLabels };
            newConfig.showVisualLabels = true;
        }
        
        setConfig(newConfig);
        showToast(`Applied ${layoutName} layout from wireframe!`);
    };

    // --- Apply Wireframe Page ---
    const applyWireframePage = (page, wireframeData) => {
        const common = wireframeData.commonElements;
        const layoutName = page.layout;
        
        if (!layoutName) {
            showToast('Page has no layout type specified');
            return;
        }
        
        // Set layout mode
        setLayoutMode(layoutName);
        
        // Apply common settings
        const newConfig = {
            ...config,
            padding: common.padding || 20,
            radius: common.radius || 8,
            gridSpacing: common.gridSpacing || 20,
            gridOpacity: common.gridOpacity || 0.1,
            headerHeight: common.headerHeight || 88,
            trustBarHeight: common.trustBarHeight || 32,
            showHeaderAccent: true,
            accentHex: common.accentColor || '#face00'
        };
        
        // Apply grid configuration if available
        if (page.gridConfig) {
            if (layoutName === 'federal' || layoutName === 'grid') {
                newConfig.gridRows = page.gridConfig.rows || 2;
                newConfig.gridColumns = page.gridConfig.columns || 2;
                
                // Apply per-row columns if specified
                if (page.gridConfig.rowColumns && page.gridConfig.rowColumns.length > 0) {
                    if (layoutName === 'federal') {
                        newConfig.federalRowColumns = page.gridConfig.rowColumns;
                        newConfig.useFederalPerRowColumns = true;
                    } else if (layoutName === 'grid') {
                        newConfig.gridRowColumns = page.gridConfig.rowColumns;
                        newConfig.usePerRowColumns = true;
                    }
                }
            }
        }
        
        // Apply layout-specific settings from page
        if (layoutName === 'federal') {
            newConfig.federalRows = page.gridConfig?.rows || 2;
            newConfig.federalColumns = page.gridConfig?.columns || 2;
            newConfig.federalSidebarWidth = (page.settings && page.settings.sidebarWidth) || 280;
            newConfig.showFederalSidebar = (page.settings && page.settings.showSidebar !== false) || true;
        } else if (layoutName === 'sidebar') {
            newConfig.sidebarLayoutWidth = (page.settings && page.settings.sidebarWidth) || 260;
        } else if (layoutName === 'grid') {
            newConfig.gridRows = page.gridConfig?.rows || 2;
            newConfig.gridColumns = page.gridConfig?.columns || 2;
        } else if (layoutName === 'kpi') {
            newConfig.kpiCount = (page.settings && page.settings.kpiCount) || 5;
        } else if (layoutName === 'three-col') {
            newConfig.threeColVisualCount = (page.settings && page.settings.visualsPerColumn) || 3;
        } else if (layoutName === 'asymmetric') {
            newConfig.asymmetricSideCount = (page.settings && page.settings.sideCardCount) || 2;
        } else if (layoutName === 'mobile') {
            newConfig.mobileVisualCount = (page.settings && page.settings.visualCount) || 3;
        }
        
        // Apply visual labels
        if (page.visuals && page.visuals.length > 0) {
            const visualTypes = {};
            const visualLabels = {};
            page.visuals.forEach(visual => {
                // Use visual.index for mapping to card items
                visualTypes[visual.index] = visual.type;
                // Only set label if showLabel is true, otherwise empty string
                visualLabels[visual.index] = visual.showLabel ? visual.label : '';
            });
            // Merge with existing config, but prioritize wireframe labels
            newConfig.visualTypes = { ...(config.visualTypes || {}), ...visualTypes };
            newConfig.visualLabels = { ...(config.visualLabels || {}), ...visualLabels };
            // Enable visual labels if any are set to show
            if (page.visuals.some(v => v.showLabel)) {
                newConfig.showVisualLabels = true;
            }
        }
        
        setConfig(newConfig);
        showToast(`Applied Page ${page.number}: ${page.name} (${layoutName})`);
    };

    // Copy Power BI settings to clipboard
    const copyPowerBISettings = async () => {
        const settings = `Power BI Image Settings:
• Image fit: Fit
• Transparency: 0%
• Position: Send to back
• Page size: ${config.width} x ${config.height}px (Custom)

To set page size:
View → Page View → Page Size → Custom → ${config.width} x ${config.height}`;
        try {
            await navigator.clipboard.writeText(settings);
            showToast("Power BI Settings Copied!");
        } catch (err) {
            showToast("Could not copy settings");
        }
    };

    // Copy dimensions to clipboard
    const copyDimensions = async () => {
        const dims = `${config.width} x ${config.height}`;
        try {
            await navigator.clipboard.writeText(dims);
            showToast("Dimensions Copied!");
        } catch (err) {
            showToast("Could not copy dimensions");
        }
    };

    // Calculate aspect ratio
    const getAspectRatio = () => {
        const gcd = (a, b) => b === 0 ? a : gcd(b, a % b);
        const divisor = gcd(config.width, config.height);
        return `${config.width / divisor}:${config.height / divisor}`;
    };

    // Keyboard shortcuts
    useEffect(() => {
        const handleKeyDown = (e) => {
            // Don't trigger shortcuts when typing in inputs
            if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA' || e.target.isContentEditable) {
                return;
            }

            const isMac = navigator.platform.toUpperCase().indexOf('MAC') >= 0;
            const modKey = isMac ? e.metaKey : e.ctrlKey;

            if (modKey) {
                switch (e.key) {
                    case 's':
                        e.preventDefault();
                        // Save template
                        try {
                            const template = {
                                layoutMode,
                                themeMode,
                                canvasPreset,
                                config,
                                timestamp: new Date().toISOString()
                            };
                            const templates = JSON.parse(localStorage.getItem('svgGeneratorTemplates') || '[]');
                            templates.push(template);
                            localStorage.setItem('svgGeneratorTemplates', JSON.stringify(templates));
                            showToast("Template Saved!");
                        } catch (error) {
                            showToast("Error: Could not save template");
                        }
                        break;
                    case 'e':
                        e.preventDefault();
                        // Export SVG
                        const svgString = getSVGString();
                        const blob = new Blob([svgString], { type: 'image/svg+xml' });
                        const url = URL.createObjectURL(blob);
                        const link = document.createElement('a');
                        link.href = url;
                        const timestamp = new Date().toISOString().split('T')[0];
                        link.download = `HHS-Background-${layoutMode}-${config.width}x${config.height}-${timestamp}.svg`;
                        document.body.appendChild(link);
                        link.click();
                        document.body.removeChild(link);
                        URL.revokeObjectURL(url);
                        showToast("SVG Exported! Ready for Power BI.");
                        break;
                    case 'g':
                        e.preventDefault();
                        setShowGrid(prev => !prev);
                        break;
                    case '?':
                        e.preventDefault();
                        setShowKeyboardShortcuts(true);
                        break;
                }
            }

            // Escape to close modals
            if (e.key === 'Escape') {
                setShowImportGuide(false);
                setShowKeyboardShortcuts(false);
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [layoutMode, themeMode, canvasPreset, config]);

    return (
        <div className="flex h-[calc(100vh-4rem)] w-[calc(100%+2rem)] overflow-hidden bg-[#1c1d1f] text-[#f1f3f6] -m-4 lg:-m-10 lg:w-[calc(100%+5rem)] lg:h-[calc(100vh-6rem)]">
            {/* --- LEFT SIDEBAR --- */}
            <div className="w-80 flex-shrink-0 border-r border-[#3d4551] bg-[#162e51] flex flex-col h-full overflow-y-auto font-sans">
                {/* Header */}
                <div className="p-6 border-b border-[#1a4480] bg-[#005ea2]">
                    <h1 className="text-xl font-bold font-serif text-white flex items-center gap-2">
                        <Shield className="w-6 h-6 text-[#face00]" /> HHS.gov Gen
                    </h1>
                    <p className="text-xs text-[#97d4ea] mt-1 opacity-90 font-sans">Official Brand Background Tool</p>
                </div>

                {/* Mode Toggle */}
                <div className="p-4 border-b border-[#3d4551] bg-[#1a4480]">
                    <div className="flex gap-2">
                        <button
                            onClick={() => setImportMode(false)}
                            className={`flex-1 px-3 py-2 rounded text-xs font-semibold transition-all ${
                                !importMode
                                    ? 'bg-[#face00] text-[#162e51]'
                                    : 'bg-[#3d4551] text-white hover:bg-[#565c65]'
                            }`}
                        >
                            Manual Create
                        </button>
                        <button
                            onClick={() => setImportMode(true)}
                            className={`flex-1 px-3 py-2 rounded text-xs font-semibold transition-all ${
                                importMode
                                    ? 'bg-[#face00] text-[#162e51]'
                                    : 'bg-[#3d4551] text-white hover:bg-[#565c65]'
                            }`}
                        >
                            Import Wireframe
                        </button>
                    </div>
                </div>

                {/* Wireframe Import Section */}
                {importMode && (
                    <div className="p-5 border-b border-[#3d4551] space-y-4">
                        <h3 className="text-xs font-bold uppercase tracking-wider text-[#97d4ea] mb-2 flex items-center gap-2">
                            <FileText className="w-3 h-3"/> Wireframe Import
                        </h3>
                        <div className="space-y-3">
                            <div>
                                <label className="text-[10px] text-[#97d4ea] mb-2 block">Paste Wireframe Markdown:</label>
                                <textarea
                                    value={wireframeText}
                                    onChange={(e) => setWireframeText(e.target.value)}
                                    placeholder="Paste your HHS Layout Wireframes.md content here..."
                                    className="w-full h-48 bg-[#1a4480] border border-[#3d4551] rounded px-3 py-2 text-xs text-[#dfe1e2] placeholder-[#565c65] font-mono resize-none"
                                />
                            </div>
                            <button
                                onClick={() => {
                                    const parsed = parseWireframe(wireframeText);
                                    if (parsed) {
                                        setWireframeData(parsed);
                                        showToast('Wireframe parsed successfully!');
                                    } else {
                                        showToast('Error parsing wireframe. Check format.');
                                    }
                                }}
                                className="w-full px-3 py-2 rounded bg-[#005ea2] hover:bg-[#00bde3] text-white text-sm transition-colors border border-[#1a4480]"
                            >
                                Parse Wireframe
                            </button>
                            {wireframeData && (
                                <div className="space-y-3">
                                    {wireframeData.hasPages && wireframeData.pages ? (
                                        <>
                                            <div className="flex items-center justify-between">
                                                <p className="text-[10px] text-[#97d4ea]">Pages Found:</p>
                                                <button
                                                    onClick={async () => {
                                                        try {
                                                            showToast(`Exporting ${wireframeData.pages.length} pages...`);
                                                            // Export all pages sequentially
                                                            for (let idx = 0; idx < wireframeData.pages.length; idx++) {
                                                                const page = wireframeData.pages[idx];
                                                                // Apply the page configuration
                                                                applyWireframePage(page, wireframeData);
                                                                
                                                                // Wait for layout to update
                                                                await new Promise(resolve => setTimeout(resolve, 300));
                                                                
                                                                // Generate and download SVG
                                                                const svgString = getSVGString();
                                                                const blob = new Blob([svgString], { type: 'image/svg+xml' });
                                                                const url = URL.createObjectURL(blob);
                                                                const link = document.createElement('a');
                                                                link.href = url;
                                                                const timestamp = new Date().toISOString().split('T')[0];
                                                                const safeName = page.name.replace(/[^a-zA-Z0-9\s-]/g, '').replace(/\s+/g, '-');
                                                                link.download = `HHS-Page-${page.number}-${safeName}-${timestamp}.svg`;
                                                                document.body.appendChild(link);
                                                                link.click();
                                                                document.body.removeChild(link);
                                                                URL.revokeObjectURL(url);
                                                                
                                                                // Small delay between exports
                                                                if (idx < wireframeData.pages.length - 1) {
                                                                    await new Promise(resolve => setTimeout(resolve, 200));
                                                                }
                                                            }
                                                            showToast(`Exported ${wireframeData.pages.length} pages successfully!`);
                                                        } catch (error) {
                                                            console.error('Error exporting pages:', error);
                                                            showToast('Error exporting pages. Check console.');
                                                        }
                                                    }}
                                                    className="px-2 py-1 rounded bg-[#face00] hover:bg-[#e5a000] text-[#162e51] text-[10px] font-bold transition-colors"
                                                >
                                                    Export All Pages
                                                </button>
                                            </div>
                                            <div className="space-y-2 max-h-64 overflow-y-auto">
                                                {wireframeData.pages.map(page => (
                                                    <div key={page.number} className="p-2 bg-[#1a4480]/30 rounded border border-[#3d4551]">
                                                        <div className="flex items-center justify-between mb-1">
                                                            <span className="text-xs font-semibold text-[#dfe1e2]">
                                                                Page {page.number}: {page.name}
                                                            </span>
                                                            <span className="text-[10px] text-[#97d4ea] capitalize">
                                                                {page.layout}
                                                            </span>
                                                        </div>
                                                        {page.visuals && page.visuals.length > 0 && (
                                                            <p className="text-[10px] text-[#97d4ea] opacity-70 mb-2">
                                                                {page.visuals.length} visual{page.visuals.length !== 1 ? 's' : ''} with labels
                                                            </p>
                                                        )}
                                                        <button
                                                            onClick={() => applyWireframePage(page, wireframeData)}
                                                            className="w-full px-2 py-1 rounded bg-[#1a4480] hover:bg-[#005ea2] text-white text-[10px] font-semibold transition-colors border border-[#3d4551]"
                                                        >
                                                            Apply This Page
                                                        </button>
                                                    </div>
                                                ))}
                                            </div>
                                        </>
                                    ) : (
                                        <>
                                            <p className="text-[10px] text-[#97d4ea]">Available Layouts:</p>
                                            <div className="grid grid-cols-2 gap-2">
                                                {Object.keys(wireframeData.layouts || {}).map(layoutName => (
                                                    <button
                                                        key={layoutName}
                                                        onClick={() => applyWireframeLayout(layoutName, wireframeData)}
                                                        className="px-2 py-1 rounded bg-[#1a4480] hover:bg-[#005ea2] text-white text-[10px] font-semibold transition-colors border border-[#3d4551] capitalize"
                                                    >
                                                        {layoutName.replace(/-/g, ' ')}
                                                    </button>
                                                ))}
                                            </div>
                                        </>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>
                )}

                {/* Quick Presets */}
                <div className="p-5 border-b border-[#3d4551]">
                    <h3 className="text-xs font-bold uppercase tracking-wider text-[#97d4ea] mb-3 flex items-center gap-2">
                        <CheckCircle className="w-3 h-3"/> Quick Actions
                    </h3>
                    <div className="grid grid-cols-1 gap-2">
                        <button 
                            onClick={() => applyHHSPreset('official')} 
                            className="text-left px-3 py-2 rounded bg-[#005ea2] hover:bg-[#00bde3] text-white text-sm transition-colors border border-[#1a4480] flex items-center justify-between"
                            aria-label="Reset to HHS Official colors"
                        >
                            <span>Reset to HHS Official</span>
                            <div className="flex gap-1"><div className="w-2 h-2 rounded-full bg-[#face00]"></div><div className="w-2 h-2 rounded-full bg-white"></div></div>
                        </button>
                        <button 
                            onClick={() => applyHHSPreset('dark_mode')} 
                            className="text-left px-3 py-2 rounded bg-[#3d4551] hover:bg-[#565c65] text-white text-sm transition-colors border border-[#1c1d1f] flex items-center justify-between"
                            aria-label="Apply high contrast dark mode colors"
                        >
                            <span>High Contrast / Dark</span>
                             <div className="flex gap-1"><div className="w-2 h-2 rounded-full bg-[#00bde3]"></div></div>
                        </button>
                        <button onClick={() => {
                            setConfig({
                                width: 1280,
                                height: 720,
                                bgHex: HHS_COLORS.base.lighter,
                                cardHex: '#ffffff',
                                accentHex: HHS_COLORS.primary.DEFAULT,
                                gap: 16,
                                padding: 20,
                                radius: 8,
                                strokeWidth: 0,
                                opacity: 1,
                                noise: false,
                                headerHeight: 88,
                                footerHeight: 0,
                                kpiCount: 5,
                                showFooter: false,
                                showTrustBar: false,
                                trustBarHeight: 32,
                                showLogo: true,
                                logoAreaWidth: 200,
                                logoIsSquare: true,
                                showHeaderAccent: true,
                                showTitle: false,
                                titleHeight: 60,
                                titlePosition: 'top',
                                showSlicerZone: false,
                                slicerZoneHeight: 60,
                                showSlicerZoneLabel: true,
                                slicerZoneOpacity: 0.08,
                                slicerZoneStyle: 'standard',
                                slicerZoneShowBackground: true,
                                slicerZoneShowBorders: true,
                                slicerZoneShowGuides: true,
                                showVisualCountWarning: true,
                                gridSpacing: 20,
                                gridOpacity: 0.1,
                                federalRows: 2,
                                federalColumns: 2,
                                federalRowColumns: [2, 2],
                                useFederalPerRowColumns: false,
                                federalSidebarWidth: 280,
                                showFederalSidebar: true,
                                sidebarLayoutWidth: 260,
                                sidebarVisualCount: 1,
                                sidebarColumns: 1,
                                gridRows: 2,
                                gridColumns: 2,
                                gridRowColumns: [2, 2],
                                usePerRowColumns: false,
                                kpiVisualCount: 1,
                                kpiColumns: 1,
                                kpiMainChartFullWidth: true,
                                threeColVisualCount: 1,
                                asymmetricSideCount: 2,
                                mobileVisualCount: 3,
                                showVisualTypes: true,
                                showVisualLabels: true,
                                defaultVisualType: 'card',
                                visualTypes: {},
                                visualLabels: {}
                            });
                            setCanvasPreset('16:9');
                            setThemeMode('standard');
                            showToast("Reset to defaults");
                        }} className="text-left px-3 py-2 rounded bg-[#3d4551] hover:bg-[#565c65] text-white text-sm transition-colors border border-[#1c1d1f] flex items-center justify-between">
                            <span>Reset All to Defaults</span>
                            <div className="flex gap-1"><div className="w-2 h-2 rounded-full bg-[#97d4ea]"></div></div>
                        </button>
                    </div>
                </div>

                {/* Templates */}
                <div className="p-5 border-b border-[#3d4551]">
                    <h3 className="text-xs font-bold uppercase tracking-wider text-[#97d4ea] mb-3 flex items-center gap-2">
                        <Save className="w-3 h-3"/> Templates
                    </h3>
                    <div className="grid grid-cols-2 gap-2">
                        <button 
                            onClick={saveTemplate} 
                            className="px-3 py-2 rounded bg-[#1a4480] hover:bg-[#005ea2] text-white text-xs font-semibold transition-colors border border-transparent hover:border-[#face00] flex items-center justify-center gap-1"
                            aria-label="Save current configuration as template"
                        >
                            <Save className="w-3 h-3" /> Save
                        </button>
                        {getSavedTemplates().length > 0 && (
                            <div className="relative group">
                                <button className="w-full px-3 py-2 rounded bg-[#1a4480] hover:bg-[#005ea2] text-white text-xs font-semibold transition-colors border border-transparent hover:border-[#face00] flex items-center justify-center gap-1">
                                    <FolderOpen className="w-3 h-3" /> Load
                                </button>
                                <div className="absolute left-0 top-full mt-1 w-48 bg-[#162e51] border border-[#3d4551] rounded shadow-xl z-50 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all">
                                    {getSavedTemplates().slice(-5).reverse().map((template, idx) => (
                                        <button
                                            key={idx}
                                            onClick={() => loadTemplate(template)}
                                            className="w-full text-left px-3 py-2 text-xs text-white hover:bg-[#1a4480] transition-colors border-b border-[#3d4551] last:border-0"
                                        >
                                            {new Date(template.timestamp).toLocaleDateString()} - {template.layoutMode}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* Canvas Size */}
                <div className="p-5 border-b border-[#3d4551]">
                    <h3 className="text-xs font-bold uppercase tracking-wider text-[#97d4ea] mb-3 flex items-center gap-2">
                        <Maximize2 className="w-3 h-3"/> Canvas Size
                    </h3>
                    <div className="grid grid-cols-2 gap-2">
                        {[
                            { key: '16:9', label: '16:9 (HD)' },
                            { key: '4:3', label: '4:3 (Standard)' },
                            { key: 'ultrawide', label: 'Ultrawide' },
                            { key: 'portrait', label: 'Portrait' },
                            { key: 'mobile', label: 'Mobile' },
                            { key: 'custom', label: 'Custom' }
                        ].map(p => (
                            <button 
                                key={p.key}
                                onClick={() => applyCanvasPreset(p.key)}
                                className={`p-2 rounded border text-xs font-semibold transition-all ${canvasPreset === p.key ? 'bg-[#face00] border-[#e5a000] text-[#162e51]' : 'bg-[#1a4480] border-transparent hover:border-[#face00] text-white'}`}
                            >
                                {p.label}
                            </button>
                        ))}
                    </div>
                    {canvasPreset === 'custom' && (
                        <div className="mt-3 space-y-2">
                            <div>
                                <div className="flex justify-between text-xs mb-1 text-[#dfe1e2]">
                                    <span>Width</span>
                                    <span>{config.width}px</span>
                                </div>
                                <input type="range" min="320" max="2560" step="10" value={config.width} onChange={(e) => handleConfigChange('width', Number(e.target.value))} className="w-full" />
                            </div>
                            <div>
                                <div className="flex justify-between text-xs mb-1 text-[#dfe1e2]">
                                    <span>Height</span>
                                    <span>{config.height}px</span>
                                </div>
                                <input type="range" min="240" max="1440" step="10" value={config.height} onChange={(e) => handleConfigChange('height', Number(e.target.value))} className="w-full" />
                            </div>
                        </div>
                    )}
                </div>

                {/* Layout Mode - Only show in manual mode */}
                {!importMode && (
                <div className="p-5 border-b border-[#3d4551]">
                    <h3 className="text-xs font-bold uppercase tracking-wider text-[#97d4ea] mb-3 flex items-center gap-2">
                        <Layout className="w-3 h-3"/> Layout Structure
                    </h3>
                    <div className="grid grid-cols-2 gap-2">
                        {[
                            { key: 'federal', label: 'Federal', icon: Shield },
                            { key: 'sidebar', label: 'Sidebar', icon: Layout },
                            { key: 'grid', label: 'Grid', icon: Grid3x3 },
                            { key: 'kpi', label: 'KPI Top', icon: CheckCircle },
                            { key: 'three-col', label: '3 Column', icon: Columns3 },
                            { key: 'asymmetric', label: 'Asymmetric', icon: Maximize2 },
                            { key: 'mobile', label: 'Mobile', icon: Smartphone }
                        ].map(m => {
                            const Icon = m.icon;
                            return (
                                <button 
                                    key={m.key}
                                    onClick={() => setLayoutMode(m.key)}
                                    className={`p-2 rounded border text-xs capitalize font-semibold transition-all flex items-center justify-center gap-1 ${layoutMode === m.key ? 'bg-[#face00] border-[#e5a000] text-[#162e51]' : 'bg-[#1a4480] border-transparent hover:border-[#face00] text-white'}`}
                                >
                                    <Icon className="w-3 h-3" />
                                    {m.label}
                                </button>
                            );
                        })}
                    </div>
                </div>
                )}

                {/* Layout-Specific Configuration - Only show in manual mode */}
                {!importMode && (
                <div className="p-5 border-b border-[#3d4551] space-y-4">
                    <h3 className="text-xs font-bold uppercase tracking-wider text-[#97d4ea] mb-2 flex items-center gap-2">
                        <Grid3x3 className="w-3 h-3"/> Layout Configuration
                    </h3>
                    
                    <div className="space-y-4">
                        {layoutMode === 'federal' && (
                            <>
                                <div>
                                    <div className="flex justify-between text-xs mb-1 text-[#dfe1e2]">
                                        <span>Header Height</span>
                                        <span>{config.headerHeight}px</span>
                                    </div>
                                    <input type="range" min="60" max="120" value={config.headerHeight} onChange={(e) => handleConfigChange('headerHeight', Number(e.target.value))} className="input-range w-full" />
                                    <p className="text-[10px] text-[#97d4ea] mt-1 opacity-70">Height of top navigation bar</p>
                                </div>
                                <div>
                                    <div className="flex items-center justify-between text-xs mb-2 text-[#dfe1e2]">
                                        <span>Show Sidebar</span>
                                        <label className="relative inline-flex items-center cursor-pointer">
                                            <input type="checkbox" checked={config.showFederalSidebar} onChange={(e) => handleConfigChange('showFederalSidebar', e.target.checked)} className="sr-only peer" />
                                            <div className="w-9 h-5 bg-[#3d4551] peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-[#face00]"></div>
                                        </label>
                                    </div>
                                    {config.showFederalSidebar && (
                                        <div className="mb-3">
                                            <div className="flex justify-between text-xs mb-1 text-[#dfe1e2]">
                                                <span>Sidebar Width</span>
                                                <span>{config.federalSidebarWidth}px</span>
                                            </div>
                                            <input type="range" min="180" max="400" value={config.federalSidebarWidth} onChange={(e) => handleConfigChange('federalSidebarWidth', Number(e.target.value))} className="input-range w-full" />
                                        </div>
                                    )}
                                </div>
                                <div>
                                    <div className="flex justify-between text-xs mb-1 text-[#dfe1e2]">
                                        <span>Grid Rows</span>
                                        <span>{config.federalRows}</span>
                                    </div>
                                    <input type="range" min="0" max="4" value={config.federalRows} onChange={(e) => {
                                        const newRows = Number(e.target.value);
                                        handleConfigChange('federalRows', newRows);
                                        // Update row columns array to match new row count
                                        if (newRows > 0) {
                                            const currentArray = config.federalRowColumns || [];
                                            const newArray = Array.from({ length: newRows }, (_, i) => 
                                                i < currentArray.length ? currentArray[i] : config.federalColumns || 2
                                            );
                                            handleConfigChange('federalRowColumns', newArray);
                                        }
                                    }} className="input-range w-full" />
                                    <p className="text-[10px] text-[#97d4ea] mt-1 opacity-70">Number of rows in grid (0 = no grid)</p>
                                </div>
                                <div>
                                    <div className="flex items-center justify-between text-xs mb-2 text-[#dfe1e2]">
                                        <span>Different Columns Per Row</span>
                                        <label className="relative inline-flex items-center cursor-pointer">
                                            <input type="checkbox" checked={config.useFederalPerRowColumns} onChange={(e) => handleConfigChange('useFederalPerRowColumns', e.target.checked)} className="sr-only peer" />
                                            <div className="w-9 h-5 bg-[#3d4551] peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-[#face00]"></div>
                                        </label>
                                    </div>
                                    {config.useFederalPerRowColumns ? (
                                        <div className="space-y-3 bg-[#1a4480]/20 p-3 rounded border border-[#3d4551]">
                                            <p className="text-[10px] text-[#97d4ea] mb-2 opacity-70">Configure columns for each row:</p>
                                            {Array.from({ length: config.federalRows }).map((_, rowIndex) => {
                                                const cols = config.federalRowColumns?.[rowIndex] || config.federalColumns || 2;
                                                return (
                                                    <div key={rowIndex} className="space-y-2">
                                                        <div className="flex items-center justify-between">
                                                            <div className="flex items-center gap-2">
                                                                <span className="text-xs font-semibold text-[#dfe1e2]">Row {rowIndex + 1}</span>
                                                                <div className="flex gap-1">
                                                                    {[1, 2, 3, 4].map(num => (
                                                                        <button
                                                                            key={num}
                                                                            onClick={() => {
                                                                                const newArray = [...(config.federalRowColumns || [])];
                                                                                newArray[rowIndex] = num;
                                                                                handleConfigChange('federalRowColumns', newArray);
                                                                            }}
                                                                            className={`w-6 h-6 rounded text-[10px] font-bold transition-all ${
                                                                                cols === num 
                                                                                    ? 'bg-[#face00] text-[#162e51]' 
                                                                                    : 'bg-[#3d4551] text-[#dfe1e2] hover:bg-[#565c65]'
                                                                            }`}
                                                                        >
                                                                            {num}
                                                                        </button>
                                                                    ))}
                                                                </div>
                                                            </div>
                                                            <span className="text-xs text-[#97d4ea]">{cols} {cols === 1 ? 'column' : 'columns'}</span>
                                                        </div>
                                                        <input 
                                                            type="range" 
                                                            min="1" 
                                                            max="4" 
                                                            value={cols} 
                                                            onChange={(e) => {
                                                                const newValue = Number(e.target.value);
                                                                const newArray = [...(config.federalRowColumns || [])];
                                                                newArray[rowIndex] = newValue;
                                                                handleConfigChange('federalRowColumns', newArray);
                                                            }} 
                                                            className="input-range w-full" 
                                                        />
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    ) : (
                                        <div>
                                            <div className="flex justify-between text-xs mb-1 text-[#dfe1e2]">
                                                <span>Grid Columns</span>
                                                <span>{config.federalColumns}</span>
                                            </div>
                                            <input type="range" min="0" max="4" value={config.federalColumns} onChange={(e) => handleConfigChange('federalColumns', Number(e.target.value))} className="input-range w-full" />
                                            <p className="text-[10px] text-[#97d4ea] mt-1 opacity-70">Number of columns in grid (0 = no grid)</p>
                                        </div>
                                    )}
                                </div>
                            </>
                        )}

                        {layoutMode === 'sidebar' && (
                            <>
                                <div>
                                    <div className="flex justify-between text-xs mb-1 text-[#dfe1e2]">
                                        <span>Sidebar Width</span>
                                        <span>{config.sidebarLayoutWidth}px</span>
                                    </div>
                                    <input type="range" min="180" max="400" value={config.sidebarLayoutWidth} onChange={(e) => handleConfigChange('sidebarLayoutWidth', Number(e.target.value))} className="input-range w-full" />
                                    <p className="text-[10px] text-[#97d4ea] mt-1 opacity-70">Width of left navigation sidebar</p>
                                </div>
                                <div>
                                    <div className="flex justify-between text-xs mb-1 text-[#dfe1e2]">
                                        <span>Visual Areas</span>
                                        <span>{config.sidebarVisualCount}</span>
                                    </div>
                                    <input type="range" min="1" max="9" value={config.sidebarVisualCount} onChange={(e) => handleConfigChange('sidebarVisualCount', Number(e.target.value))} className="input-range w-full" />
                                    <p className="text-[10px] text-[#97d4ea] mt-1 opacity-70">Number of visual cards below KPIs</p>
                                </div>
                                <div>
                                    <div className="flex justify-between text-xs mb-1 text-[#dfe1e2]">
                                        <span>Columns</span>
                                        <span>{config.sidebarColumns}</span>
                                    </div>
                                    <input type="range" min="1" max="3" value={config.sidebarColumns} onChange={(e) => handleConfigChange('sidebarColumns', Number(e.target.value))} className="input-range w-full" />
                                    <p className="text-[10px] text-[#97d4ea] mt-1 opacity-70">Grid columns for main area</p>
                                </div>
                            </>
                        )}

                        {layoutMode === 'grid' && (
                            <>
                                <div>
                                    <div className="flex justify-between text-xs mb-1 text-[#dfe1e2]">
                                        <span>Rows</span>
                                        <span>{config.gridRows}</span>
                                    </div>
                                    <input type="range" min="1" max="6" value={config.gridRows} onChange={(e) => {
                                        const newRows = Number(e.target.value);
                                        handleConfigChange('gridRows', newRows);
                                        // Update row columns array to match new row count
                                        const currentArray = config.gridRowColumns || [];
                                        const newArray = Array.from({ length: newRows }, (_, i) => 
                                            i < currentArray.length ? currentArray[i] : config.gridColumns || 2
                                        );
                                        handleConfigChange('gridRowColumns', newArray);
                                    }} className="input-range w-full" />
                                    <p className="text-[10px] text-[#97d4ea] mt-1 opacity-70">Number of rows in grid</p>
                                </div>
                                <div>
                                    <div className="flex items-center justify-between text-xs mb-2 text-[#dfe1e2]">
                                        <span>Different Columns Per Row</span>
                                        <label className="relative inline-flex items-center cursor-pointer">
                                            <input type="checkbox" checked={config.usePerRowColumns} onChange={(e) => handleConfigChange('usePerRowColumns', e.target.checked)} className="sr-only peer" />
                                            <div className="w-9 h-5 bg-[#3d4551] peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-[#face00]"></div>
                                        </label>
                                    </div>
                                    {config.usePerRowColumns ? (
                                        <div className="space-y-3 bg-[#1a4480]/20 p-3 rounded border border-[#3d4551]">
                                            <p className="text-[10px] text-[#97d4ea] mb-2 opacity-70">Configure columns for each row:</p>
                                            {Array.from({ length: config.gridRows }).map((_, rowIndex) => {
                                                const cols = config.gridRowColumns?.[rowIndex] || config.gridColumns || 2;
                                                return (
                                                    <div key={rowIndex} className="space-y-2">
                                                        <div className="flex items-center justify-between">
                                                            <div className="flex items-center gap-2">
                                                                <span className="text-xs font-semibold text-[#dfe1e2]">Row {rowIndex + 1}</span>
                                                                <div className="flex gap-1">
                                                                    {[1, 2, 3, 4].map(num => (
                                                                        <button
                                                                            key={num}
                                                                            onClick={() => {
                                                                                const newArray = [...(config.gridRowColumns || [])];
                                                                                newArray[rowIndex] = num;
                                                                                handleConfigChange('gridRowColumns', newArray);
                                                                            }}
                                                                            className={`w-6 h-6 rounded text-[10px] font-bold transition-all ${
                                                                                cols === num 
                                                                                    ? 'bg-[#face00] text-[#162e51]' 
                                                                                    : 'bg-[#3d4551] text-[#dfe1e2] hover:bg-[#565c65]'
                                                                            }`}
                                                                        >
                                                                            {num}
                                                                        </button>
                                                                    ))}
                                                                </div>
                                                            </div>
                                                            <span className="text-xs text-[#97d4ea]">{cols} {cols === 1 ? 'column' : 'columns'}</span>
                                                        </div>
                                                        <input 
                                                            type="range" 
                                                            min="1" 
                                                            max="4" 
                                                            value={cols} 
                                                            onChange={(e) => {
                                                                const newValue = Number(e.target.value);
                                                                const newArray = [...(config.gridRowColumns || [])];
                                                                newArray[rowIndex] = newValue;
                                                                handleConfigChange('gridRowColumns', newArray);
                                                            }} 
                                                            className="input-range w-full" 
                                                        />
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    ) : (
                                        <div>
                                            <div className="flex justify-between text-xs mb-1 text-[#dfe1e2]">
                                                <span>Columns</span>
                                                <span>{config.gridColumns}</span>
                                            </div>
                                            <input type="range" min="1" max="4" value={config.gridColumns} onChange={(e) => handleConfigChange('gridColumns', Number(e.target.value))} className="input-range w-full" />
                                            <p className="text-[10px] text-[#97d4ea] mt-1 opacity-70">Number of columns in grid</p>
                                        </div>
                                    )}
                                </div>
                            </>
                        )}

                        {layoutMode === 'kpi' && (
                            <>
                                <div>
                                    <div className="flex justify-between text-xs mb-1 text-[#dfe1e2]">
                                        <span>KPI Count</span>
                                        <span>{config.kpiCount}</span>
                                    </div>
                                    <input type="range" min="2" max="8" value={config.kpiCount} onChange={(e) => handleConfigChange('kpiCount', Number(e.target.value))} className="input-range w-full" />
                                    <p className="text-[10px] text-[#97d4ea] mt-1 opacity-70">Number of KPI cards in top row</p>
                                </div>
                                <div>
                                    <div className="flex justify-between text-xs mb-1 text-[#dfe1e2]">
                                        <span>Visual Areas</span>
                                        <span>{config.kpiVisualCount}</span>
                                    </div>
                                    <input type="range" min="1" max="9" value={config.kpiVisualCount} onChange={(e) => handleConfigChange('kpiVisualCount', Number(e.target.value))} className="input-range w-full" />
                                    <p className="text-[10px] text-[#97d4ea] mt-1 opacity-70">Number of visual cards below KPIs</p>
                                </div>
                                <div>
                                    <div className="flex justify-between text-xs mb-1 text-[#dfe1e2]">
                                        <span>Columns</span>
                                        <span>{config.kpiColumns}</span>
                                    </div>
                                    <input type="range" min="1" max="3" value={config.kpiColumns} onChange={(e) => handleConfigChange('kpiColumns', Number(e.target.value))} className="input-range w-full" />
                                    <p className="text-[10px] text-[#97d4ea] mt-1 opacity-70">Grid columns for visuals below main chart</p>
                                </div>
                                <div className="flex items-center justify-between p-2 bg-[#1a4480]/30 rounded border border-[#3d4551]">
                                    <div className="flex-1">
                                        <div className="text-xs font-semibold text-[#dfe1e2] mb-1">Main Chart Full-Width</div>
                                        <p className="text-[10px] text-[#97d4ea] opacity-70">
                                            {config.kpiMainChartFullWidth 
                                                ? 'First visual is full-width, rest in grid below' 
                                                : 'All visuals in grid layout'}
                                        </p>
                                    </div>
                                    <label className="relative inline-flex items-center cursor-pointer">
                                        <input type="checkbox" checked={config.kpiMainChartFullWidth} onChange={(e) => handleConfigChange('kpiMainChartFullWidth', e.target.checked)} className="sr-only peer" />
                                        <div className="w-9 h-5 bg-[#3d4551] peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-[#face00]"></div>
                                    </label>
                                </div>
                            </>
                        )}

                        {layoutMode === 'three-col' && (
                            <>
                                <div>
                                    <div className="flex justify-between text-xs mb-1 text-[#dfe1e2]">
                                        <span>KPI Count</span>
                                        <span>{config.kpiCount}</span>
                                    </div>
                                    <input type="range" min="2" max="8" value={config.kpiCount} onChange={(e) => handleConfigChange('kpiCount', Number(e.target.value))} className="input-range w-full" />
                                    <p className="text-[10px] text-[#97d4ea] mt-1 opacity-70">Number of KPI cards in top row</p>
                                </div>
                                <div>
                                    <div className="flex justify-between text-xs mb-1 text-[#dfe1e2]">
                                        <span>Visuals per Column</span>
                                        <span>{config.threeColVisualCount}</span>
                                    </div>
                                    <input type="range" min="1" max="4" value={config.threeColVisualCount} onChange={(e) => handleConfigChange('threeColVisualCount', Number(e.target.value))} className="input-range w-full" />
                                    <p className="text-[10px] text-[#97d4ea] mt-1 opacity-70">Number of visual cards stacked in each column</p>
                                </div>
                            </>
                        )}

                        {layoutMode === 'asymmetric' && (
                            <>
                                <div>
                                    <div className="flex justify-between text-xs mb-1 text-[#dfe1e2]">
                                        <span>KPI Count</span>
                                        <span>{config.kpiCount}</span>
                                    </div>
                                    <input type="range" min="2" max="8" value={config.kpiCount} onChange={(e) => handleConfigChange('kpiCount', Number(e.target.value))} className="input-range w-full" />
                                    <p className="text-[10px] text-[#97d4ea] mt-1 opacity-70">Number of KPI cards in top row</p>
                                </div>
                                <div>
                                    <div className="flex justify-between text-xs mb-1 text-[#dfe1e2]">
                                        <span>Side Cards</span>
                                        <span>{config.asymmetricSideCount}</span>
                                    </div>
                                    <input type="range" min="1" max="4" value={config.asymmetricSideCount} onChange={(e) => handleConfigChange('asymmetricSideCount', Number(e.target.value))} className="input-range w-full" />
                                    <p className="text-[10px] text-[#97d4ea] mt-1 opacity-70">Number of side cards stacked on the right</p>
                                </div>
                            </>
                        )}

                        {layoutMode === 'mobile' && (
                            <div>
                                <div className="flex justify-between text-xs mb-1 text-[#dfe1e2]">
                                    <span>Visual Cards</span>
                                    <span>{config.mobileVisualCount}</span>
                                </div>
                                <input type="range" min="2" max="6" value={config.mobileVisualCount} onChange={(e) => handleConfigChange('mobileVisualCount', Number(e.target.value))} className="input-range w-full" />
                                <p className="text-[10px] text-[#97d4ea] mt-1 opacity-70">Number of cards in vertical stack</p>
                            </div>
                        )}
                    </div>
                </div>

                {/* Visual Types & Labels - Only show in manual mode */}
                {!importMode && (
                <div className="p-5 border-b border-[#3d4551] space-y-4">
                    <h3 className="text-xs font-bold uppercase tracking-wider text-[#97d4ea] mb-2 flex items-center gap-2">
                        <Grid3x3 className="w-3 h-3"/> Visual Types & Labels
                    </h3>
                    
                    <div className="space-y-4">
                        <div>
                            <div className="flex items-center justify-between text-xs mb-2 text-[#dfe1e2]">
                                <span>Show Visual Type Indicators</span>
                                <label className="relative inline-flex items-center cursor-pointer">
                                    <input type="checkbox" checked={config.showVisualTypes} onChange={(e) => handleConfigChange('showVisualTypes', e.target.checked)} className="sr-only peer" />
                                    <div className="w-9 h-5 bg-[#3d4551] peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-[#face00]"></div>
                                </label>
                            </div>
                            <p className="text-[10px] text-[#97d4ea] opacity-70">Show icons and type labels on visual cards</p>
                        </div>
                        
                        <div>
                            <div className="flex items-center justify-between text-xs mb-2 text-[#dfe1e2]">
                                <span>Show Visual Labels</span>
                                <label className="relative inline-flex items-center cursor-pointer">
                                    <input type="checkbox" checked={config.showVisualLabels} onChange={(e) => handleConfigChange('showVisualLabels', e.target.checked)} className="sr-only peer" />
                                    <div className="w-9 h-5 bg-[#3d4551] peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-[#face00]"></div>
                                </label>
                            </div>
                            <p className="text-[10px] text-[#97d4ea] opacity-70">Show custom labels on visual cards</p>
                        </div>

                        {items.filter(item => item.type === 'card' || item.type === 'kpi' || item.type === 'main').length > 0 && (
                            <div className="space-y-3 bg-[#1a4480]/20 p-3 rounded border border-[#3d4551] max-h-64 overflow-y-auto">
                                <p className="text-[10px] text-[#97d4ea] mb-2 opacity-70">Configure each visual card:</p>
                                {items
                                    .filter(item => item.type === 'card' || item.type === 'kpi' || item.type === 'main')
                                    .map((item, idx) => {
                                        const itemIndex = item.index !== undefined ? item.index : idx;
                                        const visualType = config.visualTypes?.[itemIndex] || config.defaultVisualType || 'card';
                                        const visualLabel = config.visualLabels?.[itemIndex] || '';
                                        
                                        return (
                                            <div key={itemIndex} className="space-y-2 p-2 bg-[#162e51]/50 rounded">
                                                <div className="flex items-center justify-between">
                                                    <span className="text-xs font-semibold text-[#dfe1e2]">Visual {itemIndex + 1}</span>
                                                    <span className="text-[10px] text-[#97d4ea]">{Math.round(item.w)}×{Math.round(item.h)}px</span>
                                                </div>
                                                
                                                <div>
                                                    <label className="text-[10px] text-[#97d4ea] mb-1 block">Type:</label>
                                                    <select
                                                        value={visualType}
                                                        onChange={(e) => {
                                                            const newTypes = { ...(config.visualTypes || {}) };
                                                            newTypes[itemIndex] = e.target.value;
                                                            handleConfigChange('visualTypes', newTypes);
                                                        }}
                                                        className="w-full bg-[#1a4480] border border-[#3d4551] rounded px-2 py-1 text-xs text-[#dfe1e2]"
                                                    >
                                                        <option value="card">Card (Generic)</option>
                                                        <option value="chart">📊 Chart</option>
                                                        <option value="table">📋 Table</option>
                                                        <option value="map">🗺️ Map</option>
                                                        <option value="kpi">📈 KPI</option>
                                                        <option value="slicer">🔽 Slicer</option>
                                                        <option value="text">📄 Text Box</option>
                                                        <option value="image">🖼️ Image</option>
                                                    </select>
                                                </div>
                                                
                                                <div>
                                                    <label className="text-[10px] text-[#97d4ea] mb-1 block">Label:</label>
                                                    <input
                                                        type="text"
                                                        value={visualLabel}
                                                        onChange={(e) => {
                                                            const newLabels = { ...(config.visualLabels || {}) };
                                                            newLabels[itemIndex] = e.target.value;
                                                            handleConfigChange('visualLabels', newLabels);
                                                        }}
                                                        placeholder="e.g., Sales by Region"
                                                        className="w-full bg-[#1a4480] border border-[#3d4551] rounded px-2 py-1 text-xs text-[#dfe1e2] placeholder-[#565c65]"
                                                    />
                                                </div>
                                            </div>
                                        );
                                    })}
                            </div>
                        )}
                    </div>
                </div>

                {/* Metrics */}
                <div className="p-5 border-b border-[#3d4551] space-y-6">
                     <h3 className="text-xs font-bold uppercase tracking-wider text-[#97d4ea] mb-2 flex items-center gap-2">
                        <Settings className="w-3 h-3"/> Spacing & Style
                    </h3>
                    
                    <div className="space-y-4">
                        <div>
                            <div className="flex justify-between text-xs mb-1 text-[#dfe1e2]">
                                <span>Card Spacing</span>
                                <span>{config.gap}</span>
                            </div>
                            <input type="range" min="0" max="48" value={config.gap} onChange={(e) => handleConfigChange('gap', Number(e.target.value))} className="input-range w-full" />
                        </div>
                        
                        <div>
                            <div className="flex justify-between text-xs mb-1 text-[#dfe1e2]">
                                <span>Page Padding</span>
                                <span>{config.padding}</span>
                            </div>
                            <input type="range" min="0" max="80" value={config.padding} onChange={(e) => handleConfigChange('padding', Number(e.target.value))} className="input-range w-full" />
                        </div>
                        
                        <div>
                            <div className="flex justify-between text-xs mb-1 text-[#dfe1e2]">
                                <span>Corner Radius</span>
                                <span>{config.radius}</span>
                            </div>
                            <input type="range" min="0" max="32" value={config.radius} onChange={(e) => handleConfigChange('radius', Number(e.target.value))} className="input-range w-full" />
                        </div>

                        <div>
                            <div className="flex justify-between text-xs mb-1 text-[#dfe1e2]">
                                <span>Stroke / Border</span>
                                <span>{config.strokeWidth}</span>
                            </div>
                            <input type="range" min="0" max="4" step="0.5" value={config.strokeWidth} onChange={(e) => handleConfigChange('strokeWidth', Number(e.target.value))} className="input-range w-full" />
                        </div>

                        <div className="pt-2 border-t border-[#3d4551]">
                            <div className="flex items-center justify-between text-xs mb-2 text-[#dfe1e2]">
                                <span>Grid Overlay</span>
                                <label className="relative inline-flex items-center cursor-pointer">
                                    <input type="checkbox" checked={showGrid} onChange={(e) => setShowGrid(e.target.checked)} className="sr-only peer" />
                                    <div className="w-9 h-5 bg-[#3d4551] peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-[#face00]"></div>
                                </label>
                            </div>
                            {showGrid && (
                                <>
                                    <div>
                                        <div className="flex justify-between text-xs mb-1 text-[#dfe1e2]">
                                            <span>Grid Spacing</span>
                                            <span>{config.gridSpacing}px</span>
                                        </div>
                                        <input type="range" min="10" max="50" step="5" value={config.gridSpacing} onChange={(e) => handleConfigChange('gridSpacing', Number(e.target.value))} className="input-range w-full" />
                                    </div>
                                    <div>
                                        <div className="flex justify-between text-xs mb-1 text-[#dfe1e2]">
                                            <span>Grid Opacity</span>
                                            <span>{Math.round(config.gridOpacity * 100)}%</span>
                                        </div>
                                        <input type="range" min="0.05" max="0.3" step="0.05" value={config.gridOpacity} onChange={(e) => handleConfigChange('gridOpacity', Number(e.target.value))} className="input-range w-full" />
                                    </div>
                                </>
                            )}
                        </div>

                        <div>
                            <div className="flex items-center justify-between text-xs mb-2 text-[#dfe1e2]">
                                <span>Show Footer</span>
                                <label className="relative inline-flex items-center cursor-pointer">
                                    <input type="checkbox" checked={config.showFooter} onChange={(e) => handleConfigChange('showFooter', e.target.checked)} className="sr-only peer" />
                                    <div className="w-9 h-5 bg-[#3d4551] peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-[#face00]"></div>
                                </label>
                            </div>
                            {config.showFooter && (
                                <div>
                                    <div className="flex justify-between text-xs mb-1 text-[#dfe1e2]">
                                        <span>Footer Height</span>
                                        <span>{config.footerHeight}px</span>
                                    </div>
                                    <input type="range" min="20" max="120" value={config.footerHeight} onChange={(e) => handleConfigChange('footerHeight', Number(e.target.value))} className="input-range w-full" />
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Branding Elements */}
                <div className="p-5 border-b border-[#3d4551] space-y-4">
                    <h3 className="text-xs font-bold uppercase tracking-wider text-[#97d4ea] mb-2 flex items-center gap-2">
                        <Shield className="w-3 h-3"/> HHS Branding
                    </h3>
                    
                    <div className="space-y-4">
                        {/* Trust Bar */}
                        <div>
                            <div className="flex items-center justify-between text-xs mb-2 text-[#dfe1e2]">
                                <span>Trust Bar</span>
                                <label className="relative inline-flex items-center cursor-pointer">
                                    <input type="checkbox" checked={config.showTrustBar} onChange={(e) => handleConfigChange('showTrustBar', e.target.checked)} className="sr-only peer" />
                                    <div className="w-9 h-5 bg-[#3d4551] peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-[#face00]"></div>
                                </label>
                            </div>
                            {config.showTrustBar && (
                                <div>
                                    <div className="flex justify-between text-xs mb-1 text-[#dfe1e2]">
                                        <span>Trust Bar Height</span>
                                        <span>{config.trustBarHeight}px</span>
                                    </div>
                                    <input type="range" min="24" max="48" value={config.trustBarHeight} onChange={(e) => handleConfigChange('trustBarHeight', Number(e.target.value))} className="input-range w-full" />
                                </div>
                            )}
                        </div>

                        {/* Logo Area */}
                        <div>
                            <div className="flex items-center justify-between text-xs mb-2 text-[#dfe1e2]">
                                <span>Logo Area</span>
                                <label className="relative inline-flex items-center cursor-pointer">
                                    <input type="checkbox" checked={config.showLogo} onChange={(e) => handleConfigChange('showLogo', e.target.checked)} className="sr-only peer" />
                                    <div className="w-9 h-5 bg-[#3d4551] peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-[#face00]"></div>
                                </label>
                            </div>
                            {config.showLogo && layoutMode === 'federal' && (
                                <>
                                    <div>
                                        <div className="flex justify-between text-xs mb-1 text-[#dfe1e2]">
                                            <span>Logo Size</span>
                                            <span>{config.logoIsSquare ? Math.min(config.logoAreaWidth, 60) : config.logoAreaWidth}px</span>
                                        </div>
                                        <input type="range" min="40" max="120" value={config.logoAreaWidth} onChange={(e) => handleConfigChange('logoAreaWidth', Number(e.target.value))} className="input-range w-full" />
                                        <p className="text-[10px] text-[#97d4ea] mt-1 opacity-70">HHS logo is square-shaped (shown as square indicator)</p>
                                    </div>
                                    <div className="mt-2">
                                        <div className="flex items-center justify-between text-xs mb-2 text-[#dfe1e2]">
                                            <span>Square Shape</span>
                                            <label className="relative inline-flex items-center cursor-pointer">
                                                <input type="checkbox" checked={config.logoIsSquare !== false} onChange={(e) => handleConfigChange('logoIsSquare', e.target.checked)} className="sr-only peer" />
                                                <div className="w-9 h-5 bg-[#3d4551] peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-[#face00]"></div>
                                            </label>
                                        </div>
                                        <p className="text-[10px] text-[#97d4ea] opacity-70">HHS logo is square (recommended: ON)</p>
                                    </div>
                                </>
                            )}
                        </div>

                        {/* Header Accent Line */}
                        {layoutMode === 'federal' && (
                            <div>
                                <div className="flex items-center justify-between text-xs mb-2 text-[#dfe1e2]">
                                    <span className="flex items-center gap-1">
                                        <span>Yellow Header Line</span>
                                        <span className="w-2 h-2 rounded-full bg-[#face00]"></span>
                                    </span>
                                    <label className="relative inline-flex items-center cursor-pointer">
                                        <input type="checkbox" checked={config.showHeaderAccent} onChange={(e) => handleConfigChange('showHeaderAccent', e.target.checked)} className="sr-only peer" />
                                        <div className="w-9 h-5 bg-[#3d4551] peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-[#face00]"></div>
                                    </label>
                                </div>
                                <p className="text-[10px] text-[#97d4ea] opacity-70">
                                    {config.showHeaderAccent ? 'Yellow accent line visible at bottom of header' : 'Yellow accent line hidden'}
                                </p>
                            </div>
                        )}

                        {/* Title Area */}
                        <div>
                            <div className="flex items-center justify-between text-xs mb-2 text-[#dfe1e2]">
                                <span>Title Area</span>
                                <label className="relative inline-flex items-center cursor-pointer">
                                    <input type="checkbox" checked={config.showTitle} onChange={(e) => handleConfigChange('showTitle', e.target.checked)} className="sr-only peer" />
                                    <div className="w-9 h-5 bg-[#3d4551] peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-[#face00]"></div>
                                </label>
                            </div>
                            {config.showTitle && (
                                <>
                                    <div className="mb-2">
                                        <span className="text-[10px] uppercase opacity-70 block mb-2">Position</span>
                                        <div className="flex gap-2">
                                            {['top', 'header'].map(pos => (
                                                <button 
                                                    key={pos} 
                                                    onClick={() => handleConfigChange('titlePosition', pos)}
                                                    className={`flex-1 py-1 px-2 text-[10px] uppercase rounded border ${config.titlePosition === pos ? 'bg-[#face00] text-[#162e51] font-bold border-[#face00]' : 'border-[#97d4ea] text-[#97d4ea]'}`}
                                                >
                                                    {pos}
                                                </button>
                                            ))}
                                        </div>
                                        <p className="text-[10px] text-[#97d4ea] mt-1 opacity-70">
                                            {config.titlePosition === 'header' ? 'In header bar (Federal layout only)' : 'At top of content area'}
                                        </p>
                                    </div>
                                    <div>
                                        <div className="flex justify-between text-xs mb-1 text-[#dfe1e2]">
                                            <span>Title Height</span>
                                            <span>{config.titleHeight}px</span>
                                        </div>
                                        <input type="range" min="40" max="100" value={config.titleHeight} onChange={(e) => handleConfigChange('titleHeight', Number(e.target.value))} className="input-range w-full" />
                                    </div>
                                </>
                            )}
                            {!config.showTitle && (
                                <p className="text-[10px] text-[#97d4ea] opacity-70">Tip: You can add title visuals directly in Power BI</p>
                            )}
                        </div>

                        {/* Slicer Zone */}
                        <div>
                            <div className="flex items-center justify-between text-xs mb-2 text-[#dfe1e2]">
                                <span>Slicer Zone</span>
                                <label className="relative inline-flex items-center cursor-pointer">
                                    <input type="checkbox" checked={config.showSlicerZone} onChange={(e) => handleConfigChange('showSlicerZone', e.target.checked)} className="sr-only peer" />
                                    <div className="w-9 h-5 bg-[#3d4551] peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-[#face00]"></div>
                                </label>
                            </div>
                            {config.showSlicerZone && (
                                <>
                                    <div>
                                        <div className="flex justify-between text-xs mb-1 text-[#dfe1e2]">
                                            <span>Slicer Zone Height</span>
                                            <span>{config.slicerZoneHeight}px</span>
                                        </div>
                                        <input type="range" min="40" max="120" value={config.slicerZoneHeight} onChange={(e) => handleConfigChange('slicerZoneHeight', Number(e.target.value))} className="input-range w-full" />
                                        <p className="text-[10px] text-[#97d4ea] mt-1 opacity-70">Height for horizontal filter bar (Power BI best practice)</p>
                                    </div>
                                    <div className="mt-3 pt-3 border-t border-[#3d4551]">
                                        <div className="flex items-center justify-between text-xs mb-2 text-[#dfe1e2]">
                                            <span>Show Label</span>
                                            <label className="relative inline-flex items-center cursor-pointer">
                                                <input type="checkbox" checked={config.showSlicerZoneLabel !== false} onChange={(e) => handleConfigChange('showSlicerZoneLabel', e.target.checked)} className="sr-only peer" />
                                                <div className="w-9 h-5 bg-[#3d4551] peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-[#face00]"></div>
                                            </label>
                                        </div>
                                        <p className="text-[10px] text-[#97d4ea] opacity-70">"Slicer Zone" text label in preview</p>
                                    </div>
                                    <div className="mt-2">
                                        <div className="flex justify-between text-xs mb-1 text-[#dfe1e2]">
                                            <span>Background Opacity</span>
                                            <span>{Math.round((config.slicerZoneOpacity || 0.08) * 100)}%</span>
                                        </div>
                                        <input type="range" min="0.02" max="0.2" step="0.01" value={config.slicerZoneOpacity || 0.08} onChange={(e) => handleConfigChange('slicerZoneOpacity', Number(e.target.value))} className="input-range w-full" />
                                        <p className="text-[10px] text-[#97d4ea] mt-1 opacity-70">Adjust visibility of slicer zone background</p>
                                    </div>
                                    
                                    <div className="mt-3 pt-3 border-t border-[#3d4551]">
                                        <label className="text-[10px] text-[#97d4ea] mb-2 block">Visual Style:</label>
                                        <div className="grid grid-cols-3 gap-2">
                                            {['minimal', 'standard', 'full'].map(style => (
                                                <button
                                                    key={style}
                                                    onClick={() => handleConfigChange('slicerZoneStyle', style)}
                                                    className={`p-2 rounded text-[10px] font-semibold transition-all capitalize ${
                                                        (config.slicerZoneStyle || 'standard') === style
                                                            ? 'bg-[#face00] text-[#162e51] border border-[#e5a000]'
                                                            : 'bg-[#1a4480] text-white border border-transparent hover:border-[#face00]'
                                                    }`}
                                                >
                                                    {style}
                                                </button>
                                            ))}
                                        </div>
                                        <p className="text-[10px] text-[#97d4ea] mt-2 opacity-70">
                                            {(config.slicerZoneStyle || 'standard') === 'minimal' && 'Just a subtle top line indicator'}
                                            {(config.slicerZoneStyle || 'standard') === 'standard' && 'Top/bottom borders, optional background'}
                                            {(config.slicerZoneStyle || 'standard') === 'full' && 'All borders, background, and guide lines'}
                                        </p>
                                    </div>
                                    
                                    {(config.slicerZoneStyle || 'standard') !== 'minimal' && (
                                        <div className="mt-3 pt-3 border-t border-[#3d4551] space-y-2">
                                            <div className="flex items-center justify-between text-xs text-[#dfe1e2]">
                                                <span>Show Background</span>
                                                <label className="relative inline-flex items-center cursor-pointer">
                                                    <input type="checkbox" checked={config.slicerZoneShowBackground !== false} onChange={(e) => handleConfigChange('slicerZoneShowBackground', e.target.checked)} className="sr-only peer" />
                                                    <div className="w-9 h-5 bg-[#3d4551] peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-[#face00]"></div>
                                                </label>
                                            </div>
                                            <div className="flex items-center justify-between text-xs text-[#dfe1e2]">
                                                <span>Show Borders</span>
                                                <label className="relative inline-flex items-center cursor-pointer">
                                                    <input type="checkbox" checked={config.slicerZoneShowBorders !== false} onChange={(e) => handleConfigChange('slicerZoneShowBorders', e.target.checked)} className="sr-only peer" />
                                                    <div className="w-9 h-5 bg-[#3d4551] peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-[#face00]"></div>
                                                </label>
                                            </div>
                                            {(config.slicerZoneStyle || 'standard') === 'full' && (
                                                <div className="flex items-center justify-between text-xs text-[#dfe1e2]">
                                                    <span>Show Guide Lines</span>
                                                    <label className="relative inline-flex items-center cursor-pointer">
                                                        <input type="checkbox" checked={config.slicerZoneShowGuides !== false} onChange={(e) => handleConfigChange('slicerZoneShowGuides', e.target.checked)} className="sr-only peer" />
                                                        <div className="w-9 h-5 bg-[#3d4551] peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-[#face00]"></div>
                                                    </label>
                                                </div>
                                            )}
                                        </div>
                                    )}
                                </>
                            )}
                        </div>

                        {/* Best Practices */}
                        <div className="pt-2 border-t border-[#3d4551]">
                            <div className="flex items-center justify-between text-xs mb-2 text-[#dfe1e2]">
                                <span>Visual Count Warning</span>
                                <label className="relative inline-flex items-center cursor-pointer">
                                    <input type="checkbox" checked={config.showVisualCountWarning} onChange={(e) => handleConfigChange('showVisualCountWarning', e.target.checked)} className="sr-only peer" />
                                    <div className="w-9 h-5 bg-[#3d4551] peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-[#face00]"></div>
                                </label>
                            </div>
                            <p className="text-[10px] text-[#97d4ea] opacity-70">Warns if layout has &gt;10 visuals (Power BI best practice: &lt;10 per page)</p>
                        </div>
                    </div>
                </div>

                {/* Color Tweaks */}
                <div className="p-5 space-y-4">
                    <h3 className="text-xs font-bold uppercase tracking-wider text-[#97d4ea] mb-2 flex items-center gap-2">
                        <Palette className="w-3 h-3"/> Custom Override
                    </h3>
                    <div className="grid grid-cols-2 gap-3">
                        <div className="flex flex-col gap-1">
                            <span className="text-[10px] uppercase opacity-70">Canvas BG</span>
                            <input type="color" value={config.bgHex} onChange={(e) => handleConfigChange('bgHex', e.target.value)} className="w-full h-8 rounded cursor-pointer bg-transparent" />
                        </div>
                        <div className="flex flex-col gap-1">
                            <span className="text-[10px] uppercase opacity-70">Card BG</span>
                            <input type="color" value={config.cardHex} onChange={(e) => handleConfigChange('cardHex', e.target.value)} className="w-full h-8 rounded cursor-pointer bg-transparent" />
                        </div>
                    </div>
                    
                    <div className="pt-4 border-t border-[#3d4551]">
                        <span className="text-[10px] uppercase opacity-70 block mb-2">Visual Style</span>
                         <div className="flex gap-2">
                            {['standard', 'executive', 'frosted'].map(t => (
                                <button 
                                    key={t} 
                                    onClick={() => setThemeMode(t)}
                                    className={`flex-1 py-1 px-2 text-[10px] uppercase rounded border ${themeMode === t ? 'bg-[#face00] text-[#162e51] font-bold border-[#face00]' : 'border-[#97d4ea] text-[#97d4ea]'}`}
                                >
                                    {t}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
                )}

            </div>

            {/* --- RIGHT PREVIEW --- */}
            <div className="flex-1 flex flex-col bg-[#565c65] relative">
                {/* Toolbar */}
                <div className="h-14 border-b border-[#3d4551] bg-[#1c1d1f] flex items-center justify-between px-6 shadow-md z-10">
                    <div className="flex items-center gap-4">
                         <div className="text-sm font-bold text-white font-serif">Preview</div>
                         <div className="text-xs text-[#97d4ea] bg-[#162e51] px-2 py-1 rounded flex items-center gap-2">
                            <span>{config.width} x {config.height}</span>
                            <span className="opacity-50">•</span>
                            <span className="opacity-70">{getAspectRatio()}</span>
                            <button
                                onClick={copyDimensions}
                                className="ml-1 hover:opacity-100 opacity-70 transition-opacity"
                                title="Copy dimensions"
                                aria-label="Copy dimensions to clipboard"
                            >
                                <Copy className="w-3 h-3" />
                            </button>
                         </div>
                         {(() => {
                            const visualCount = items.filter(item => ['card', 'kpi', 'main', 'sidebar', 'nav', 'kpi-strip'].includes(item.type)).length;
                            return (
                                <div className={`text-xs px-2 py-1 rounded ${
                                    visualCount > 10 ? 'bg-[#d54309] text-white' : 'bg-[#162e51] text-[#97d4ea]'
                                }`}>
                                    {visualCount} visual{visualCount !== 1 ? 's' : ''}
                                </div>
                            );
                         })()}
                         <button
                            onClick={() => setShowGrid(!showGrid)}
                            className={`px-3 py-1 rounded text-xs font-semibold transition-colors flex items-center gap-1 ${
                                showGrid ? 'bg-[#face00] text-[#162e51]' : 'bg-[#3d4551] text-white hover:bg-[#565c65]'
                            }`}
                            title="Toggle grid overlay (Ctrl/Cmd+G)"
                        >
                            <Grid className="w-3 h-3" /> Grid
                        </button>
                    </div>
                    
                    <div className="flex items-center gap-2">
                        <button
                            onClick={() => setShowKeyboardShortcuts(true)}
                            className="p-2 rounded bg-[#3d4551] hover:bg-[#565c65] text-white transition-colors"
                            title="Keyboard shortcuts (Ctrl/Cmd+?)"
                            aria-label="Show keyboard shortcuts"
                        >
                            ⌨️
                        </button>
                        <button
                            onClick={() => setShowColorGuide(true)}
                            className="p-2 rounded bg-[#3d4551] hover:bg-[#565c65] text-white transition-colors"
                            title="Data Visualization Color Guide"
                            aria-label="Show color guide for charts"
                        >
                            <Palette className="w-4 h-4" />
                        </button>
                        <button
                            onClick={() => setShowImportGuide(true)}
                            className="p-2 rounded bg-[#3d4551] hover:bg-[#565c65] text-white transition-colors"
                            title="Power BI Import Guide"
                        >
                            <HelpCircle className="w-4 h-4" />
                        </button>
                        <button 
                            onClick={copyPowerBISettings}
                            className="bg-[#1a4480] hover:bg-[#005ea2] text-white px-3 py-2 rounded-md font-semibold text-sm flex items-center gap-2 transition-all border border-transparent hover:border-[#face00]"
                            title="Copy Power BI settings to clipboard"
                            aria-label="Copy Power BI import settings"
                        >
                            <Copy className="w-4 h-4" /> Settings
                        </button>
                        <button 
                            onClick={copySVGToClipboard}
                            className="bg-[#1a4480] hover:bg-[#005ea2] text-white px-3 py-2 rounded-md font-semibold text-sm flex items-center gap-2 transition-all border border-transparent hover:border-[#face00]"
                            title="Copy SVG to clipboard"
                        >
                            <Copy className="w-4 h-4" />
                        </button>
                        <div className="relative group">
                            <button 
                                onClick={downloadSVG}
                                className="bg-[#005ea2] hover:bg-[#00bde3] text-white px-5 py-2 rounded-md font-bold text-sm flex items-center gap-2 shadow-lg transition-all border border-[#1a4480]"
                            >
                                <Download className="w-4 h-4" /> Export
                            </button>
                            <div className="absolute right-0 top-full mt-1 w-40 bg-[#162e51] border border-[#3d4551] rounded shadow-xl z-50 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all">
                                <button
                                    onClick={downloadSVG}
                                    className="w-full text-left px-3 py-2 text-xs text-white hover:bg-[#1a4480] transition-colors flex items-center gap-2 border-b border-[#3d4551]"
                                    aria-label="Download as SVG"
                                >
                                    <Download className="w-3 h-3" /> SVG
                                </button>
                                <button
                                    onClick={downloadPNG}
                                    className="w-full text-left px-3 py-2 text-xs text-white hover:bg-[#1a4480] transition-colors flex items-center gap-2 border-b border-[#3d4551]"
                                    aria-label="Download as PNG"
                                >
                                    <ImageIcon className="w-3 h-3" /> PNG
                                </button>
                                <button
                                    onClick={downloadReportSpec}
                                    className="w-full text-left px-3 py-2 text-xs text-white hover:bg-[#1a4480] transition-colors flex items-center gap-2"
                                    aria-label="Download Report Specification"
                                >
                                    <FileText className="w-3 h-3" /> Spec
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Canvas Container - Padded and Centered */}
                <div className="flex-1 overflow-hidden p-6 md:p-12 flex items-center justify-center bg-repeat" style={{backgroundImage: 'radial-gradient(#3d4551 1px, transparent 1px)', backgroundSize: '20px 20px'}}>
                    
                    {/* THE FIX: aspect-video ensures the div keeps 16:9 ratio.
                        w-full ensures it stretches to fit the panel.
                        max-w/max-h limits it so it doesn't overflow.
                    */}
                    <div 
                        className="w-full max-w-[1280px] bg-white shadow-2xl rounded-sm overflow-hidden ring-4 ring-[#00000020] relative"
                        style={{ 
                            aspectRatio: `${config.width} / ${config.height}`,
                            maxHeight: '80vh'
                        }}
                    >
                        <div 
                            className="w-full h-full"
                            dangerouslySetInnerHTML={{ 
                                __html: getSVGString()
                                    .replace(`width="${config.width}"`, 'width="100%"')
                                    .replace(`height="${config.height}"`, 'height="100%"') 
                            }} 
                        />
                        {showGrid && (
                            <div 
                                className="absolute inset-0 pointer-events-none"
                                style={{
                                    backgroundImage: `
                                        linear-gradient(to right, rgba(0, 0, 0, ${config.gridOpacity}) 1px, transparent 1px),
                                        linear-gradient(to bottom, rgba(0, 0, 0, ${config.gridOpacity}) 1px, transparent 1px)
                                    `,
                                    backgroundSize: `${config.gridSpacing}px ${config.gridSpacing}px`
                                }}
                            />
                        )}
                    </div>

                </div>
                
                {/* Bottom Help Text */}
                {(() => {
                    const visualCount = items.filter(item => ['card', 'kpi', 'main', 'sidebar', 'nav', 'kpi-strip'].includes(item.type)).length;
                    return (
                        <div className="absolute bottom-4 right-4 text-[10px] text-[#dfe1e2] bg-[#1c1d1f] p-2 rounded opacity-70 pointer-events-none max-w-xs">
                            <div className="font-semibold mb-1">Power BI Tips:</div>
                            <div>• Set transparency to 0%</div>
                            <div>• Image Fit: "Fit"</div>
                            <div>• Send background to back</div>
                            {visualCount > 10 && (
                                <div className="mt-2 text-[#d54309] font-semibold">⚠ {visualCount} visuals (recommend &lt;10)</div>
                            )}
                        </div>
                    );
                })()}

                {/* Toast Notification */}
                {toast && (
                    <div className="absolute top-20 left-1/2 -translate-x-1/2 bg-[#00a398] text-white px-6 py-3 rounded-full shadow-xl flex items-center gap-2 animate-bounce font-bold z-50">
                        <CheckCircle className="w-5 h-5"/>
                        {toast}
                    </div>
                )}

                {/* Power BI Import Guide Modal */}
                {showImportGuide && (
                    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                        <div className="bg-[#162e51] border border-[#3d4551] rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                            <div className="p-6 border-b border-[#3d4551] flex items-center justify-between">
                                <h3 className="text-xl font-bold text-white flex items-center gap-2">
                                    <HelpCircle className="w-6 h-6 text-[#face00]" />
                                    Power BI Import Guide
                                </h3>
                                <button
                                    onClick={() => setShowImportGuide(false)}
                                    className="text-[#97d4ea] hover:text-white transition-colors"
                                    aria-label="Close import guide"
                                >
                                    ✕
                                </button>
                            </div>
                            <div className="p-6 space-y-4 text-[#dfe1e2] text-sm">
                                <div>
                                    <h4 className="font-bold text-white mb-2">Step 1: Export Your Background</h4>
                                    <p>Click "Export" and choose SVG (recommended) or PNG format. SVG is vector-based and scales perfectly.</p>
                                </div>
                                <div>
                                    <h4 className="font-bold text-white mb-2">Step 2: Add to Power BI</h4>
                                    <ol className="list-decimal list-inside space-y-1 ml-2">
                                        <li>Open your Power BI report</li>
                                        <li>Go to the page where you want the background</li>
                                        <li>In the Visualizations pane, click "Insert" → "Image"</li>
                                        <li>Select your exported SVG/PNG file</li>
                                    </ol>
                                </div>
                                <div>
                                    <h4 className="font-bold text-white mb-2">Step 3: Configure Image Settings</h4>
                                    <ul className="list-disc list-inside space-y-1 ml-2">
                                        <li><strong>Image fit:</strong> Set to "Fit" (not "Fill" or "Center")</li>
                                        <li><strong>Transparency:</strong> Set to 0% (fully opaque)</li>
                                        <li><strong>Position:</strong> Send to back (right-click → "Send to back")</li>
                                    </ul>
                                </div>
                                <div>
                                    <h4 className="font-bold text-white mb-2">Step 4: Align Your Visuals</h4>
                                    <p>Use the grid overlay (toggle in preview) to help align your Power BI visuals with the background layout. Match your visuals to the card areas shown in the background.</p>
                                </div>
                                <div className="bg-[#1a4480] p-4 rounded border border-[#3d4551]">
                                    <p className="text-[#face00] font-semibold mb-1">💡 Pro Tip:</p>
                                    <p>For best results, set your page size in Power BI to match the canvas dimensions ({config.width} x {config.height}px). Go to View → Page View → Page Size → Custom.</p>
                                </div>
                            </div>
                            <div className="p-6 border-t border-[#3d4551] flex justify-end">
                                <button
                                    onClick={() => setShowImportGuide(false)}
                                    className="px-4 py-2 bg-[#005ea2] hover:bg-[#00bde3] text-white rounded font-semibold transition-colors"
                                    aria-label="Close import guide"
                                >
                                    Got it!
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {/* Color Guide Modal */}
                {showColorGuide && (
                    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                        <div className="bg-[#162e51] border border-[#3d4551] rounded-xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
                            <div className="p-6 border-b border-[#3d4551] flex items-center justify-between">
                                <h3 className="text-xl font-bold text-white flex items-center gap-2">
                                    <Palette className="w-6 h-6 text-[#face00]" />
                                    Data Visualization Color Guide
                                </h3>
                                <button
                                    onClick={() => setShowColorGuide(false)}
                                    className="text-[#97d4ea] hover:text-white transition-colors"
                                    aria-label="Close color guide"
                                >
                                    ✕
                                </button>
                            </div>
                            <div className="p-6 space-y-6 text-[#dfe1e2] text-sm">
                                <div>
                                    <h4 className="font-bold text-white mb-3">HHS Brand Color Palette</h4>
                                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                                        <div className="bg-[#005ea2] p-3 rounded text-white text-xs">
                                            <div className="font-bold mb-1">Primary Blue</div>
                                            <div className="font-mono">#005EA2</div>
                                            <div className="text-[10px] opacity-80 mt-1">Main brand color</div>
                                        </div>
                                        <div className="bg-[#1a4480] p-3 rounded text-white text-xs">
                                            <div className="font-bold mb-1">Navy</div>
                                            <div className="font-mono">#1A4480</div>
                                            <div className="text-[10px] opacity-80 mt-1">Header/dark</div>
                                        </div>
                                        <div className="bg-[#face00] p-3 rounded text-[#162e51] text-xs">
                                            <div className="font-bold mb-1">Yellow</div>
                                            <div className="font-mono">#FACE00</div>
                                            <div className="text-[10px] opacity-80 mt-1">Accent/highlight</div>
                                        </div>
                                        <div className="bg-[#00bde3] p-3 rounded text-white text-xs">
                                            <div className="font-bold mb-1">Cyan</div>
                                            <div className="font-mono">#00BDE3</div>
                                            <div className="text-[10px] opacity-80 mt-1">Secondary accent</div>
                                        </div>
                                    </div>
                                </div>

                                <div>
                                    <h4 className="font-bold text-white mb-3">Recommended Chart Color Schemes</h4>
                                    
                                    <div className="space-y-4">
                                        <div className="bg-[#1a4480] p-4 rounded border border-[#3d4551]">
                                            <div className="font-semibold text-white mb-2">✅ Column/Bar Charts (Sequential Data)</div>
                                            <div className="grid grid-cols-5 gap-2 mb-2">
                                                <div className="h-8 bg-[#005ea2] rounded"></div>
                                                <div className="h-8 bg-[#1a4480] rounded"></div>
                                                <div className="h-8 bg-[#00bde3] rounded"></div>
                                                <div className="h-8 bg-[#face00] rounded"></div>
                                                <div className="h-8 bg-[#565c65] rounded"></div>
                                            </div>
                                            <p className="text-xs opacity-80">Use primary blue → navy → cyan for related categories. Yellow for highlights/outliers.</p>
                                        </div>

                                        <div className="bg-[#1a4480] p-4 rounded border border-[#3d4551]">
                                            <div className="font-semibold text-white mb-2">✅ Line Charts (Time Series)</div>
                                            <div className="grid grid-cols-4 gap-2 mb-2">
                                                <div className="h-8 bg-[#005ea2] rounded"></div>
                                                <div className="h-8 bg-[#00bde3] rounded"></div>
                                                <div className="h-8 bg-[#face00] rounded"></div>
                                                <div className="h-8 bg-[#d54309] rounded"></div>
                                            </div>
                                            <p className="text-xs opacity-80">Primary blue for main metric, cyan for secondary, yellow for comparison, red for alerts.</p>
                                        </div>

                                        <div className="bg-[#1a4480] p-4 rounded border border-[#3d4551]">
                                            <div className="font-semibold text-white mb-2">✅ Pie/Donut Charts (Categorical)</div>
                                            <div className="grid grid-cols-6 gap-2 mb-2">
                                                <div className="h-8 bg-[#005ea2] rounded"></div>
                                                <div className="h-8 bg-[#1a4480] rounded"></div>
                                                <div className="h-8 bg-[#00bde3] rounded"></div>
                                                <div className="h-8 bg-[#face00] rounded"></div>
                                                <div className="h-8 bg-[#00a398] rounded"></div>
                                                <div className="h-8 bg-[#565c65] rounded"></div>
                                            </div>
                                            <p className="text-xs opacity-80">Limit to 5-6 categories max. Use distinct HHS colors for contrast.</p>
                                        </div>
                                    </div>
                                </div>

                                <div>
                                    <h4 className="font-bold text-white mb-3">Contrast & Accessibility</h4>
                                    <div className="bg-[#1a4480] p-4 rounded border border-[#3d4551] space-y-2 text-xs">
                                        <div className="flex items-center gap-2">
                                            <span className="w-3 h-3 rounded bg-green-500"></span>
                                            <span><strong>WCAG AA Compliant:</strong> Primary blue (#005EA2) on white = 4.8:1 ✓</span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <span className="w-3 h-3 rounded bg-green-500"></span>
                                            <span><strong>Yellow Accent:</strong> Use sparingly for highlights (low contrast on white)</span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <span className="w-3 h-3 rounded bg-yellow-500"></span>
                                            <span><strong>Text on Yellow:</strong> Use dark navy (#162e51) for readability</span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <span className="w-3 h-3 rounded bg-green-500"></span>
                                            <span><strong>Data Labels:</strong> Use dark colors (#1c1d1f or #162e51) on light backgrounds</span>
                                        </div>
                                    </div>
                                </div>

                                <div>
                                    <h4 className="font-bold text-white mb-3">Power BI Color Theme Setup</h4>
                                    <div className="bg-[#1a4480] p-4 rounded border border-[#3d4551]">
                                        <p className="text-xs mb-2">To apply HHS colors in Power BI:</p>
                                        <ol className="list-decimal list-inside space-y-1 text-xs ml-2">
                                            <li>Go to <strong>View → Themes → Customize current theme</strong></li>
                                            <li>Set <strong>Data colors</strong> to: #005EA2, #1A4480, #00BDE3, #FACE00, #00A398</li>
                                            <li>Set <strong>Background</strong> to: #F1F3F6 (matches canvas)</li>
                                            <li>Set <strong>Visual header</strong> to: #005EA2</li>
                                        </ol>
                                    </div>
                                </div>

                                <div className="bg-[#face00] p-4 rounded border border-[#e5a000]">
                                    <p className="text-[#162e51] font-semibold mb-1">💡 Pro Tip:</p>
                                    <p className="text-[#162e51] text-xs">For multi-series charts, use blue shades for primary data, cyan for secondary, and yellow only for key highlights or comparisons. Avoid using yellow for large areas or text.</p>
                                </div>
                            </div>
                            <div className="p-6 border-t border-[#3d4551] flex justify-end">
                                <button
                                    onClick={() => setShowColorGuide(false)}
                                    className="px-4 py-2 bg-[#005ea2] hover:bg-[#00bde3] text-white rounded font-semibold transition-colors"
                                >
                                    Got it!
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {/* Keyboard Shortcuts Modal */}
                {showKeyboardShortcuts && (
                    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                        <div className="bg-[#162e51] border border-[#3d4551] rounded-xl shadow-2xl max-w-md w-full">
                            <div className="p-6 border-b border-[#3d4551] flex items-center justify-between">
                                <h3 className="text-xl font-bold text-white flex items-center gap-2">
                                    ⌨️ Keyboard Shortcuts
                                </h3>
                                <button
                                    onClick={() => setShowKeyboardShortcuts(false)}
                                    className="text-[#97d4ea] hover:text-white transition-colors"
                                    aria-label="Close keyboard shortcuts"
                                >
                                    ✕
                                </button>
                            </div>
                            <div className="p-6 space-y-3 text-[#dfe1e2] text-sm">
                                <div className="flex justify-between items-center">
                                    <span>Save Template</span>
                                    <kbd className="px-2 py-1 bg-[#1a4480] rounded text-xs font-mono">Ctrl/Cmd + S</kbd>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span>Export SVG</span>
                                    <kbd className="px-2 py-1 bg-[#1a4480] rounded text-xs font-mono">Ctrl/Cmd + E</kbd>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span>Toggle Grid</span>
                                    <kbd className="px-2 py-1 bg-[#1a4480] rounded text-xs font-mono">Ctrl/Cmd + G</kbd>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span>Show Shortcuts</span>
                                    <kbd className="px-2 py-1 bg-[#1a4480] rounded text-xs font-mono">Ctrl/Cmd + ?</kbd>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span>Close Modal</span>
                                    <kbd className="px-2 py-1 bg-[#1a4480] rounded text-xs font-mono">Esc</kbd>
                                </div>
                            </div>
                            <div className="p-6 border-t border-[#3d4551] flex justify-end">
                                <button
                                    onClick={() => setShowKeyboardShortcuts(false)}
                                    className="px-4 py-2 bg-[#005ea2] hover:bg-[#00bde3] text-white rounded font-semibold transition-colors"
                                >
                                    Got it!
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default SVGGenerator;

