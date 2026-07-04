/* Overlay — shared element definitions & renderer.
   Used by both src/taskpane/taskpane.html (editable canvas) and
   src/content/content.html (published, read-only view), so the two
   surfaces always render an element identically. */

window.OverlayElements = (function () {

  const SYSTEM_FONTS = new Set(['Arial','Georgia','Times New Roman','Courier New','Verdana','Tahoma','Trebuchet MS']);
  const loadedFonts = new Set(['Inter','Space Grotesk','JetBrains Mono']); // already linked in <head> by both surfaces
  function ensureFontLoaded(font){
    if (!font || SYSTEM_FONTS.has(font) || loadedFonts.has(font)) return;
    loadedFonts.add(font);
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = 'https://fonts.googleapis.com/css2?family=' + font.replace(/ /g,'+') + ':wght@400;500;600;700&display=swap';
    document.head.appendChild(link);
  }

  const TYPE_LABELS = {
    button: 'Button', icon: 'Icon', image: 'Image', text: 'Text', shape: 'Shape', graph: 'Graph',
    group: 'Group', repeating: 'Repeating group', popup: 'Popup', floating: 'Floating group',
    input: 'Input', multiline: 'Multiline input', dropdown: 'Dropdown', checkbox: 'Checkbox',
    slider: 'Slider input', date: 'Date picker', upload: 'File uploader'
  };

  const CHART_TYPES = [
    { id: 'line', label: 'Line Chart', icon: 'line-chart' },
    { id: 'area', label: 'Area Chart', icon: 'area-chart' },
    { id: 'column', label: 'Column Chart', icon: 'bar-chart-3' },
    { id: 'bar', label: 'Bar Chart', icon: 'bar-chart-2' },
    { id: 'pie', label: 'Pie Chart', icon: 'pie-chart' },
    { id: 'donut', label: 'Donut Chart', icon: 'circle' },
    { id: 'histogram', label: 'Histogram', icon: 'bar-chart-3' },
    { id: 'box', label: 'Box Plot', icon: 'square' },
    { id: 'scatter', label: 'Scatter Plot', icon: 'circle-dashed' },
    { id: 'bubble', label: 'Bubble Chart', icon: 'circle' },
    { id: 'gantt', label: 'Gantt Chart', icon: 'calendar' },
    { id: 'heat', label: 'Heat Map', icon: 'square' },
    { id: 'waterfall', label: 'Waterfall Chart', icon: 'bar-chart-2' }
  ];

  const DEFAULTS = {
  button:   { w:120, h:40,  label:'Refresh view' },
  icon:     { w:44,  h:44,  label:'', meta: { iconName: 'zap', iconSize: 24, borderStyle: 'none', shadowStyle: 'none' } },
  image:    { w:160, h:110, label:'Image' },
  text:     { w:180, h:28,  label:'Section title' },
  shape:    { w:120,  h:120,  label:'', meta: { shapeType: 'square' } },
    graph:    { w:280, h:170, label:'', binding:'Sheet1!B2:E10', meta:{ chartType:'line' } },
    group:    { w:320, h:220, label:'Group' },
    repeating: { w:320, h:160, label:'Repeating group', binding:'Sheet1!A2:D20' },
    popup:    { w:280, h:180, label:'Popup' },
    floating: { w:260, h:170, label:'Floating group' },
    input:    { w:200, h:38,  label:'Enter value' },
    multiline: { w:220, h:80, label:'Enter notes' },
    dropdown: { w:200, h:38,  label:'Select region', meta:{ options:['North','South','East','West'] } },
    checkbox: { w:22,  h:22,  label:'' },
    slider:   { w:180, h:34,  label:'', meta:{ min:0, max:100, value:55 } },
    date:     { w:180, h:38,  label:'Select date' },
    upload:   { w:200, h:80,  label:'Drop file or browse' }
  };

  // Curated list of valid Lucide icons for dashboards
  const ICONS = [
    'zap', 'home', 'user', 'users', 'settings', 'search', 'bell', 'mail', 'calendar', 'clock',
    'folder', 'file', 'file-text', 'image', 'download', 'upload', 'star', 'heart', 'check', 'x',
    'plus', 'minus', 'trash-2', 'edit', 'save', 'share', 'link', 'external-link', 'copy', 'clipboard',
    'filter', 'arrow-up', 'arrow-down', 'arrow-left', 'arrow-right', 'chevron-up', 'chevron-down',
    'chevron-left', 'chevron-right', 'menu', 'grid', 'list', 'bar-chart-3', 'bar-chart-2', 'pie-chart',
    'line-chart', 'area-chart', 'target', 'trending-up', 'trending-down', 'activity', 'database',
    'server', 'cloud', 'cloud-upload', 'cloud-download', 'hard-drive', 'cpu', 'monitor', 'laptop',
    'smartphone', 'tablet', 'printer', 'wifi', 'bluetooth', 'battery', 'lock', 'unlock', 'key', 'shield',
    'shield-check', 'alert-triangle', 'info', 'help-circle', 'alert-circle', 'check-circle', 'x-circle',
    'minus-circle', 'plus-circle', 'circle', 'square', 'triangle', 'hexagon', 'sun', 'moon',
    'cloud-rain', 'cloud-lightning', 'cloud-snow', 'wind', 'droplets', 'thermometer', 'globe', 'map-pin',
    'map', 'navigation', 'compass', 'phone', 'phone-call', 'voicemail', 'message-square', 'message-circle',
    'inbox', 'send', 'mail-check', 'at-sign', 'book', 'book-open', 'bookmark', 'bookmark-check', 'library',
    'graduation-cap', 'award', 'trophy', 'medal', 'gift', 'package', 'shopping-cart', 'shopping-bag',
    'credit-card', 'wallet', 'dollar-sign', 'euro', 'pound-sterling', 'bitcoin',
    'receipt', 'file-plus', 'file-minus', 'file-x', 'file-check', 'folder-plus',
    'folder-minus', 'folder-x', 'folder-check', 'folder-open', 'layers', 'layout', 'columns', 'grid-3x3',
    'grid-2x2', 'layout-grid', 'layout-list', 'layout-dashboard', 'sliders-horizontal', 'sliders', 'gauge',
    'percent', 'divide',
    'infinity', 'pi', 'calculator', 'scissors', 'clipboard-check', 'clipboard-list',
    'clipboard-x', 'pencil', 'pen', 'pen-tool', 'pen-line', 'pen-square', 'highlighter',
    'eraser', 'type', 'bold', 'italic', 'underline', 'strikethrough', 'align-left', 'align-center',
    'align-right', 'align-justify', 'list-ordered', 'indent', 'outdent', 'link-2', 'image-plus',
    'image-minus', 'camera', 'video', 'mic', 'mic-off', 'play', 'pause',
    'skip-forward', 'skip-back', 'rewind', 'fast-forward', 'volume-2', 'volume-x', 'volume-1',
    'maximize', 'minimize', 'fullscreen', 'expand', 'shrink', 'corner-down-left',
    'corner-down-right', 'corner-left-down', 'corner-left-up', 'corner-right-down', 'corner-right-up',
    'corner-up-left', 'corner-up-right', 'move', 'move-up', 'move-down', 'move-left', 'move-right',
    'rotate-cw', 'rotate-ccw', 'flip-vertical', 'flip-horizontal', 'refresh-cw', 'refresh-ccw',
    'repeat', 'repeat-1', 'shuffle', 'arrow-up-circle', 'arrow-down-circle', 'arrow-left-circle',
    'arrow-right-circle', 'arrow-up-right', 'arrow-down-right', 'arrow-down-left', 'arrow-up-left',
    'chevron-up-circle', 'chevron-down-circle', 'chevron-left-circle', 'chevron-right-circle',
    'chevrons-up', 'chevrons-down', 'chevrons-left', 'chevrons-right', 'folder-down', 'folder-up',
    'file-down', 'file-up', 'cloud-sync', 'cloud-off', 'sunrise', 'sunset', 'moon-star',
    'sparkles', 'flame', 'droplet', 'snowflake', 'umbrella', 'eye', 'eye-off', 'watch',
    'clock-1', 'clock-2', 'clock-3', 'clock-4', 'clock-5', 'clock-6', 'clock-7', 'clock-8',
    'clock-9', 'clock-10', 'clock-11', 'clock-12', 'calendar-check', 'calendar-x', 'calendar-minus',
    'calendar-plus', 'calendar-range', 'calendar-clock', 'calendar-days', 'user-plus', 'user-minus',
    'user-x', 'user-check', 'user-pen', 'user-square', 'user-circle',
    'user-search', 'user-cog', 'user-star', 'user-lock',
    'crown', 'building', 'building-2', 'hotel', 'hospital', 'school',
    'university', 'factory', 'construction', 'hard-hat', 'wrench',
    'hammer', 'drill', 'axe', 'wifi-off', 'bluetooth-off', 'battery-charging', 'battery-full', 'battery-low',
    'plug', 'plug-zap', 'power', 'power-off', 'lightbulb',
    'lightbulb-off', 'lamp', 'lamp-desk', 'lamp-floor', 'lamp-ceiling',
    'monitor-off', 'gamepad-2', 'joystick', 'lock-open',
    'shield-off', 'shield-alert'
  ];

  function chartSVG(title, chartType = 'line') {
    let chartContent = '';
    switch (chartType) {
      case 'area':
        chartContent = `
          <polygon points="10,100 50,60 90,80 130,30 170,70 210,50 250,90 250,100" fill="#1E7F5C" opacity="0.5"/>
          <polyline points="10,100 50,60 90,80 130,30 170,70 210,50 250,90" fill="none" stroke="#1E7F5C" stroke-width="2"/>
        `;
        break;
      case 'pie':
        chartContent = `
          <circle cx="130" cy="55" r="40" fill="#1E7F5C" opacity="0.8"/>
          <path d="M130,55 L130,15 A40,40 0 0,1 170,95 Z" fill="#E8A33D"/>
          <path d="M130,55 L170,95 A40,40 0 0,1 90,95 Z" fill="#3B82F6"/>
        `;
        break;
      case 'donut':
        chartContent = `
          <circle cx="130" cy="55" r="40" fill="#1E7F5C" opacity="0.8"/>
          <circle cx="130" cy="55" r="20" fill="#fff"/>
          <path d="M130,55 L130,15 A40,40 0 0,1 170,95 Z" fill="#E8A33D"/>
          <path d="M130,55 L170,95 A40,40 0 0,1 90,95 Z" fill="#3B82F6"/>
        `;
        break;
      case 'column':
        chartContent = `
          <rect x="20" y="50" width="30" height="50" rx="3" fill="#1E7F5C" opacity="0.9"/>
          <rect x="65" y="30" width="30" height="70" rx="3" fill="#1E7F5C" opacity="0.75"/>
          <rect x="110" y="60" width="30" height="40" rx="3" fill="#1E7F5C"/>
          <rect x="155" y="20" width="30" height="80" rx="3" fill="#1E7F5C" opacity="0.6"/>
          <rect x="200" y="45" width="30" height="55" rx="3" fill="#1E7F5C" opacity="0.8"/>
        `;
        break;
      case 'bar':
        chartContent = `
          <rect x="30" y="20" width="70" height="20" rx="3" fill="#1E7F5C" opacity="0.9"/>
          <rect x="50" y="45" width="50" height="20" rx="3" fill="#1E7F5C" opacity="0.75"/>
          <rect x="20" y="70" width="90" height="20" rx="3" fill="#1E7F5C"/>
          <rect x="60" y="95" width="60" height="20" rx="3" fill="#1E7F5C" opacity="0.6"/>
          <rect x="40" y="120" width="80" height="20" rx="3" fill="#1E7F5C" opacity="0.8"/>
        `;
        break;
      case 'histogram':
        chartContent = `
          <rect x="15" y="30" width="20" height="60" rx="2" fill="#1E7F5C" opacity="0.9"/>
          <rect x="40" y="50" width="20" height="40" rx="2" fill="#1E7F5C" opacity="0.75"/>
          <rect x="65" y="20" width="20" height="70" rx="2" fill="#1E7F5C"/>
          <rect x="90" y="60" width="20" height="30" rx="2" fill="#1E7F5C" opacity="0.6"/>
          <rect x="115" y="40" width="20" height="50" rx="2" fill="#1E7F5C" opacity="0.8"/>
          <rect x="140" y="10" width="20" height="80" rx="2" fill="#1E7F5C" opacity="0.95"/>
          <rect x="165" y="35" width="20" height="55" rx="2" fill="#1E7F5C" opacity="0.7"/>
          <rect x="190" y="55" width="20" height="35" rx="2" fill="#1E7F5C" opacity="0.65"/>
          <rect x="215" y="45" width="20" height="45" rx="2" fill="#1E7F5C" opacity="0.85"/>
        `;
        break;
      case 'scatter':
        chartContent = `
          <circle cx="40" cy="70" r="4" fill="#1E7F5C"/>
          <circle cx="70" cy="50" r="4" fill="#E8A33D"/>
          <circle cx="100" cy="80" r="4" fill="#3B82F6"/>
          <circle cx="130" cy="40" r="4" fill="#1E7F5C"/>
          <circle cx="160" cy="60" r="4" fill="#E8A33D"/>
          <circle cx="190" cy="30" r="4" fill="#3B82F6"/>
          <circle cx="220" cy="70" r="4" fill="#1E7F5C"/>
        `;
        break;
      case 'bubble':
        chartContent = `
          <circle cx="50" cy="70" r="6" fill="#1E7F5C" opacity="0.8"/>
          <circle cx="90" cy="50" r="8" fill="#E8A33D" opacity="0.7"/>
          <circle cx="130" cy="80" r="5" fill="#3B82F6" opacity="0.9"/>
          <circle cx="170" cy="40" r="9" fill="#1E7F5C" opacity="0.6"/>
          <circle cx="210" cy="60" r="7" fill="#E8A33D" opacity="0.8"/>
        `;
        break;
      case 'heat':
        chartContent = `
          <rect x="20" y="20" width="40" height="30" rx="2" fill="#1E7F5C" opacity="0.3"/>
          <rect x="70" y="20" width="40" height="30" rx="2" fill="#1E7F5C" opacity="0.5"/>
          <rect x="120" y="20" width="40" height="30" rx="2" fill="#1E7F5C" opacity="0.7"/>
          <rect x="170" y="20" width="40" height="30" rx="2" fill="#1E7F5C" opacity="0.9"/>
          <rect x="220" y="20" width="40" height="30" rx="2" fill="#1E7F5C" opacity="0.4"/>
          <rect x="20" y="60" width="40" height="30" rx="2" fill="#E8A33D" opacity="0.4"/>
          <rect x="70" y="60" width="40" height="30" rx="2" fill="#E8A33D" opacity="0.6"/>
          <rect x="120" y="60" width="40" height="30" rx="2" fill="#E8A33D" opacity="0.8"/>
          <rect x="170" y="60" width="40" height="30" rx="2" fill="#E8A33D" opacity="0.5"/>
          <rect x="220" y="60" width="40" height="30" rx="2" fill="#E8A33D" opacity="0.7"/>
        `;
        break;
      case 'gantt':
        chartContent = `
          <rect x="30" y="25" width="80" height="15" rx="3" fill="#1E7F5C" opacity="0.8"/>
          <rect x="70" y="45" width="100" height="15" rx="3" fill="#E8A33D" opacity="0.7"/>
          <rect x="140" y="65" width="90" height="15" rx="3" fill="#3B82F6" opacity="0.8"/>
          <rect x="50" y="85" width="120" height="15" rx="3" fill="#1E7F5C" opacity="0.6"/>
        `;
        break;
      case 'waterfall':
        chartContent = `
          <rect x="30" y="50" width="30" height="40" rx="3" fill="#1E7F5C"/>
          <rect x="75" y="30" width="30" height="60" rx="3" fill="#1E7F5C" opacity="0.8"/>
          <rect x="120" y="70" width="30" height="20" rx="3" fill="#D2534A"/>
          <rect x="165" y="40" width="30" height="50" rx="3" fill="#1E7F5C" opacity="0.7"/>
          <rect x="210" y="55" width="30" height="35" rx="3" fill="#1E7F5C"/>
        `;
        break;
      case 'box':
        chartContent = `
          <rect x="60" y="40" width="80" height="40" rx="3" fill="#1E7F5C" opacity="0.5" stroke="#1E7F5C" stroke-width="2"/>
          <line x1="100" y1="20" x2="100" y2="40" stroke="#1E7F5C" stroke-width="2"/>
          <line x1="100" y1="80" x2="100" y2="100" stroke="#1E7F5C" stroke-width="2"/>
          <line x1="70" y1="55" x2="130" y2="55" stroke="#1E7F5C" stroke-width="2"/>
        `;
        break;
      case 'line':
      default:
        chartContent = `
          <polyline points="20,90 60,50 100,70 140,30 180,60 220,40 260,80" fill="none" stroke="#1E7F5C" stroke-width="2"/>
          <circle cx="20" cy="90" r="4" fill="#fff" stroke="#1E7F5C" stroke-width="2"/>
          <circle cx="60" cy="50" r="4" fill="#fff" stroke="#1E7F5C" stroke-width="2"/>
          <circle cx="100" cy="70" r="4" fill="#fff" stroke="#1E7F5C" stroke-width="2"/>
          <circle cx="140" cy="30" r="4" fill="#fff" stroke="#1E7F5C" stroke-width="2"/>
          <circle cx="180" cy="60" r="4" fill="#fff" stroke="#1E7F5C" stroke-width="2"/>
          <circle cx="220" cy="40" r="4" fill="#fff" stroke="#1E7F5C" stroke-width="2"/>
          <circle cx="260" cy="80" r="4" fill="#fff" stroke="#1E7F5C" stroke-width="2"/>
        `;
        break;
    }
    const chartLabel = CHART_TYPES.find(c => c.id === chartType)?.label || 'Chart';
    return `<div style="font-size:10.5px;color:#9AA2AC;font-weight:600;margin-bottom:8px;">${title || chartLabel}</div>
    <svg width="100%" height="100%" viewBox="0 0 260 110" preserveAspectRatio="none">
      ${chartContent}
    </svg>`;
  }

  function baseStyle(el) {
    const s = {
      position: 'absolute',
      left: el.left + 'px',
      top: el.top + 'px',
      width: el.width + 'px',
      height: el.height + 'px',
      borderRadius: '8px',
      boxSizing: 'border-box',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontFamily: 'Inter, sans-serif',
      overflow: 'hidden',
      transform: el.rotation ? `rotate(${el.rotation}deg)` : 'none',
      transformOrigin: 'center center'
    };
    return s;
  }

  function applyStyle(node, styleObj) {
    Object.keys(styleObj).forEach(k => node.style[k] = styleObj[k]);
  }

  // Builds a DOM node for one element. `editable` toggles cursor/interaction hints only —
  // actual drag/resize wiring is attached by the caller (taskpane), not here.
  function buildNode(el) {
    const node = document.createElement('div');
    node.dataset.id = el.id;
    node.dataset.type = el.type;
    applyStyle(node, baseStyle(el));

    switch (el.type) {
      case 'button': {
        const m = el.meta || {};
        ensureFontLoaded(m.fontFamily);
        const textColor = el.fill || '#FFFFFF';
        const bgColor = m.bg || '#1E7F5C';
        const borderStyle = m.borderStyle || 'none';
        const borderRadius = m.radius != null ? m.radius : 8;
        const borderWidth = m.borderWidth || 1;
        const borderColor = m.borderColor || '#000000';
        let border = 'none';
        if (borderStyle !== 'none') {
          border = `${borderWidth}px ${borderStyle} ${borderColor}`;
        }
        applyStyle(node, {
          background: bgColor,
          color: textColor,
          fontWeight: m.bold ? '700' : (m.fontWeight || '600'),
          fontSize: (m.fontSize || 13) + 'px',
          fontFamily: "'" + (m.fontFamily || 'Inter') + "', sans-serif",
          fontStyle: m.italic ? 'italic' : 'normal',
          textDecoration: m.underline ? 'underline' : 'none',
          justifyContent: m.align === 'center' ? 'center' : (m.align === 'right' ? 'flex-end' : 'center'),
          textAlign: m.align || 'center',
          paddingLeft: '12px',
          paddingRight: '12px',
          borderRadius: borderRadius + 'px',
          border: border,
          opacity: m.opacity != null ? m.opacity : 1,
          wordSpacing: (m.wordSpacing || 0) + 'px',
          lineHeight: (m.lineSpacing || 1.4),
          letterSpacing: (m.letterSpacing || 0) + 'px',
          boxShadow: m.shadowStyle === 'none' ? 'none' : (m.shadowStyle || '0 2px 8px rgba(0,0,0,0.15)'),
          textShadow: m.showTextShadow ? (m.textShadowStyle || '0 1px 2px rgba(0,0,0,0.2)') : 'none'
        });
        node.textContent = el.label || 'Button';
        break;
      }
      case 'icon': {
        const m = el.meta || {};
        const iconName = m.iconName || 'zap';
        const iconSize = m.iconSize || 24;
        const iconColor = el.fill || '#12181F';
        const bgColor = m.bg || 'transparent';
        const borderStyle = m.borderStyle || 'none';
        const borderRadius = m.radius != null ? m.radius : 8;
        const borderWidth = m.borderWidth || 1.5;
        const borderColor = m.borderColor || '#12181F';
        let border = 'none';
        if (borderStyle !== 'none') {
          border = `${borderWidth}px ${borderStyle} ${borderColor}`;
        }
        applyStyle(node, {
          background: bgColor,
          color: iconColor,
          border: border,
          borderRadius: borderRadius + 'px',
          opacity: m.opacity != null ? m.opacity : 1,
          boxShadow: m.shadowStyle === 'none' ? 'none' : (m.shadowStyle || 'none')
        });
        node.innerHTML = `<i data-lucide="${iconName}" style="width: ${iconSize}px; height: ${iconSize}px;"></i>`;
        break;
      }
      case 'text': {
        const m = el.meta || {};
        ensureFontLoaded(m.fontFamily);
        applyStyle(node, {
          background: m.bg || 'transparent',
          color: el.fill || '#1C232B',
          fontSize: (m.fontSize || 14) + 'px',
          fontFamily: "'" + (m.fontFamily || 'Inter') + "', sans-serif",
          fontWeight: m.bold ? '700' : '500',
          fontStyle: m.italic ? 'italic' : 'normal',
          textDecoration: m.underline ? 'underline' : 'none',
          justifyContent: m.align === 'center' ? 'center' : (m.align === 'right' ? 'flex-end' : 'flex-start'),
          textAlign: m.align || 'left',
          paddingLeft: '2px',
          borderRadius: (m.radius != null ? m.radius : 8) + 'px'
        });
        node.textContent = el.label || 'Text';
        break;
      }
      case 'shape':
        const m = el.meta || {};
        const shapeType = m.shapeType || 'square';
        const fillColor = el.fill || '#E8A33D';
        const borderColor = m.borderColor || fillColor;
        const borderWidth = m.borderWidth != null ? m.borderWidth : 0;
        const borderRadius = m.borderRadius != null ? m.borderRadius : 0;
        const opacity = m.opacity != null ? m.opacity : 1;
        const shadowStyle = m.shadowStyle || 'none';

        // Set up base styles
        const baseStyles = {
          background: 'transparent',
          border: 'none',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          overflow: 'hidden',
          opacity: opacity,
          boxShadow: shadowStyle,
          borderRadius: borderRadius + 'px'
        };

        applyStyle(node, baseStyles);

        // Create SVG for different shape types using fixed viewBox
        let svgContent = '';
        const viewBoxSize = 100;
        const strokeWidth = borderWidth;

        switch (shapeType) {
          case 'square':
            svgContent = `<rect x="${strokeWidth/2}" y="${strokeWidth/2}" width="${viewBoxSize - strokeWidth}" height="${viewBoxSize - strokeWidth}" fill="${fillColor}" stroke="${borderColor}" stroke-width="${strokeWidth}" rx="${borderRadius}" ry="${borderRadius}"/>`;
            break;
          case 'ellipse':
            svgContent = `<ellipse cx="${viewBoxSize/2}" cy="${viewBoxSize/2}" rx="${(viewBoxSize - strokeWidth)/2}" ry="${(viewBoxSize - strokeWidth)/2}" fill="${fillColor}" stroke="${borderColor}" stroke-width="${strokeWidth}"/>`;
            break;
          case 'line':
            svgContent = `<line x1="${strokeWidth}" y1="${viewBoxSize/2}" x2="${viewBoxSize - strokeWidth}" y2="${viewBoxSize/2}" stroke="${borderColor}" stroke-width="${strokeWidth}" stroke-linecap="round"/>`;
            break;
          case 'arrow':
            const arrowHeadSize = viewBoxSize * 0.2;
            svgContent = `<line x1="${strokeWidth}" y1="${viewBoxSize/2}" x2="${viewBoxSize - arrowHeadSize - strokeWidth}" y2="${viewBoxSize/2}" stroke="${borderColor}" stroke-width="${strokeWidth}" stroke-linecap="round"/>
<polygon points="${viewBoxSize - arrowHeadSize - strokeWidth},${viewBoxSize/2 - arrowHeadSize/1.5} ${viewBoxSize - strokeWidth},${viewBoxSize/2} ${viewBoxSize - arrowHeadSize - strokeWidth},${viewBoxSize/2 + arrowHeadSize/1.5}" fill="${borderColor}" stroke="${borderColor}" stroke-width="${strokeWidth/2}"/>`;
            break;
          case 'special':
            // For special polygon, we use normalized coordinates (0-100) in meta.vertices
            // If no vertices exist, start with a triangle
            if (!m.vertices) {
              m.vertices = [
                { x: 50, y: 15 },
                { x: 85, y: 85 },
                { x: 15, y: 85 }
              ];
            }
            const points = m.vertices.map(v => `${v.x},${v.y}`).join(' ');
            svgContent = `<polygon points="${points}" fill="${fillColor}" stroke="${borderColor}" stroke-width="${strokeWidth}"/>`;
            break;
          default:
            svgContent = `<rect x="${strokeWidth/2}" y="${strokeWidth/2}" width="${viewBoxSize - strokeWidth}" height="${viewBoxSize - strokeWidth}" fill="${fillColor}" stroke="${borderColor}" stroke-width="${strokeWidth}" rx="${borderRadius}" ry="${borderRadius}"/>`;
        }

        node.innerHTML = `<svg width="100%" height="100%" viewBox="0 0 ${viewBoxSize} ${viewBoxSize}" preserveAspectRatio="none">${svgContent}</svg>`;
        break;
      case 'image':
        applyStyle(node, {
          background: 'repeating-linear-gradient(45deg,#EFF1F4,#EFF1F4 8px,#F7F8FA 8px,#F7F8FA 16px)',
          border: '1.5px dashed #9AA2AC', color: '#9AA2AC', fontSize: '11px'
        });
        node.textContent = el.label || 'Image';
        break;
      case 'graph':
        const chartMeta = el.meta || {};
        applyStyle(node, { background: '#fff', border: '1.5px solid #E4E7EB', flexDirection: 'column', padding: '10px', alignItems: 'stretch' });
        node.innerHTML = chartSVG(el.label || '', chartMeta.chartType || 'line');
        break;
      case 'group': case 'repeating': case 'popup': case 'floating':
        applyStyle(node, { background: 'rgba(30,127,92,0.04)', border: '1.5px dashed rgba(30,127,92,0.4)', color: '#6B7480', fontSize: '11px', alignItems: 'flex-start', justifyContent: 'flex-start', padding: '6px 8px' });
        node.textContent = el.label || TYPE_LABELS[el.type];
        break;
      case 'input':
        applyStyle(node, { background: '#fff', border: '1.5px solid #E4E7EB', justifyContent: 'flex-start', paddingLeft: '12px', color: '#9AA2AC', fontSize: '12.5px' });
        node.textContent = el.label || 'Input';
        break;
      case 'multiline':
        applyStyle(node, { background: '#fff', border: '1.5px solid #E4E7EB', justifyContent: 'flex-start', alignItems: 'flex-start', paddingLeft: '12px', paddingTop: '8px', color: '#9AA2AC', fontSize: '12.5px' });
        node.textContent = el.label || 'Notes';
        break;
      case 'dropdown':
        applyStyle(node, { background: '#fff', border: '1.5px solid #E4E7EB', justifyContent: 'space-between', padding: '0 12px', color: '#9AA2AC', fontSize: '12.5px' });
        node.innerHTML = `<span>${el.label || 'Select'}</span><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M6 9l6 6 6-6"/></svg>`;
        break;
      case 'checkbox':
        applyStyle(node, { background: '#fff', border: '1.5px solid #E4E7EB' });
        break;
      case 'slider': {
        const meta = el.meta || { min:0, max:100, value:55 };
        const pct = Math.max(0, Math.min(100, ((meta.value - meta.min) / (meta.max - meta.min)) * 100));
        applyStyle(node, { background: '#fff', border: '1.5px solid #E4E7EB' });
        node.innerHTML = `<div style="position:relative;width:88%;height:3px;background:#E4E7EB;border-radius:2px;">
          <div style="position:absolute;left:0;top:0;height:3px;width:${pct}%;background:#1E7F5C;border-radius:2px;"></div>
          <div style="position:absolute;left:${pct}%;top:50%;transform:translate(-50%,-50%);width:14px;height:14px;border-radius:50%;background:#fff;border:2px solid #1E7F5C;"></div>
        </div>`;
        break;
      }
      case 'date':
        applyStyle(node, { background: '#fff', border: '1.5px solid #E4E7EB', justifyContent: 'flex-start', paddingLeft: '12px', color: '#9AA2AC', fontSize: '12.5px' });
        node.textContent = el.label || 'Select date';
        break;
      case 'upload':
        applyStyle(node, { background: '#fff', border: '1.5px dashed #9AA2AC', color: '#9AA2AC', fontSize: '11px' });
        node.textContent = el.label || 'Drop file or browse';
        break;
      default:
        applyStyle(node, { background: '#eee', color: '#999', fontSize: '11px' });
        node.textContent = el.type;
    }
    return node;
  }

  function makeElement(type, overrides) {
    const def = DEFAULTS[type] || { w: 100, h: 40, label: '' };
    return Object.assign({
      id: 'el_' + Math.random().toString(36).slice(2, 9),
      type,
      left: 40, top: 40,
      width: def.w, height: def.h,
      label: def.label || '',
      fill: null,
      binding: def.binding || null,
      meta: def.meta || {},
      rotation: 0
    }, overrides || {});
  }

  return { TYPE_LABELS, DEFAULTS, buildNode, makeElement, ICONS, CHART_TYPES };
})();
