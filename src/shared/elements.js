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

  const DEFAULTS = {
    button:   { w:120, h:40,  label:'Refresh view' },
    icon:     { w:44,  h:44,  label:'', meta: { iconName: 'zap', iconSize: 24 } },
    image:    { w:160, h:110, label:'Image' },
    text:     { w:180, h:28,  label:'Section title' },
    shape:    { w:90,  h:90,  label:'' },
    graph:    { w:280, h:170, label:'', binding:'Sheet1!B2:E10' },
    group:    { w:320, h:220, label:'Group' },
    repeating:{ w:320, h:160, label:'Repeating group', binding:'Sheet1!A2:D20' },
    popup:    { w:280, h:180, label:'Popup' },
    floating: { w:260, h:170, label:'Floating group' },
    input:    { w:200, h:38,  label:'Enter value' },
    multiline:{ w:220, h:80,  label:'Enter notes' },
    dropdown: { w:200, h:38,  label:'Select region', meta:{ options:['North','South','East','West'] } },
    checkbox: { w:22,  h:22,  label:'' },
    slider:   { w:180, h:34,  label:'', meta:{ min:0, max:100, value:55 } },
    date:     { w:180, h:38,  label:'Select date' },
    upload:   { w:200, h:80,  label:'Drop file or browse' }
  };

  // Most popular Lucide icons for dashboards (no duplicates)
  const ICONS = [
    'zap', 'home', 'user', 'users', 'settings', 'search', 'bell', 'mail', 'calendar', 'clock',
    'folder', 'file', 'file-text', 'image', 'download', 'upload', 'star', 'heart', 'check', 'x',
    'plus', 'minus', 'trash', 'edit', 'save', 'share', 'link', 'external-link', 'copy', 'paste',
    'filter', 'sort', 'arrow-up', 'arrow-down', 'arrow-left', 'arrow-right', 'chevron-up', 'chevron-down',
    'chevron-left', 'chevron-right', 'menu', 'grid', 'list', 'bar-chart', 'bar-chart-2', 'pie-chart',
    'line-chart', 'area-chart', 'target', 'trending-up', 'trending-down', 'activity', 'pulse', 'database',
    'server', 'cloud', 'cloud-upload', 'cloud-download', 'hard-drive', 'cpu', 'monitor', 'laptop',
    'smartphone', 'tablet', 'printer', 'wifi', 'bluetooth', 'battery', 'lock', 'unlock', 'key', 'shield',
    'shield-check', 'alert-triangle', 'info', 'help-circle', 'alert-circle', 'check-circle', 'x-circle',
    'minus-circle', 'plus-circle', 'circle', 'square', 'triangle', 'hexagon', 'sun', 'moon',
    'cloud-rain', 'cloud-lightning', 'cloud-snow', 'wind', 'droplets', 'thermometer', 'globe', 'map-pin',
    'map', 'navigation', 'compass', 'phone', 'phone-call', 'voicemail', 'message-square', 'message-circle',
    'inbox', 'send', 'mail-check', 'at-sign', 'book', 'book-open', 'bookmark', 'bookmark-check', 'library',
    'graduation-cap', 'award', 'trophy', 'medal', 'gift', 'package', 'shopping-cart', 'shopping-bag',
    'credit-card', 'wallet', 'dollar-sign', 'euro', 'pound-sterling', 'yen', 'rupee', 'bitcoin', 'cash',
    'receipt', 'file-invoice', 'file-dollar', 'file-plus', 'file-minus', 'file-x', 'file-check', 'folder-plus',
    'folder-minus', 'folder-x', 'folder-check', 'folder-open', 'folder-sync', 'folder-key', 'folder-lock',
    'layers', 'layout', 'columns', 'grid-3x3', 'grid-2x2', 'layout-grid', 'layout-list', 'layout-dashboard',
    'sliders-horizontal', 'sliders', 'gauge', 'speedometer', 'thermometer-sun', 'thermometer-snowflake', 'thermometer-half',
    'percent', 'ratio', 'divide', 'equals', 'not-equals', 'greater-than', 'less-than', 'greater-than-equal',
    'less-than-equal', 'infinity', 'pi', 'function-square', 'calculator', 'scissors', 'clipboard', 'clipboard-check',
    'clipboard-list', 'clipboard-x', 'clipboard-pen', 'clipboard-pen-line', 'edit-3', 'edit-2',
    'pencil', 'pen', 'pen-tool', 'pen-line', 'pen-square', 'pen-square-line', 'highlighter', 'eraser',
    'type', 'bold', 'italic', 'underline', 'strikethrough', 'align-left', 'align-center', 'align-right',
    'align-justify', 'list-ordered', 'indent', 'outdent', 'link-2', 'link-2-off', 'image-plus',
    'image-minus', 'image-x', 'image-check', 'camera', 'video', 'mic', 'mic-off', 'play', 'pause',
    'stop', 'skip-forward', 'skip-back', 'rewind', 'fast-forward', 'volume-2', 'volume-x', 'volume-1', 'volume',
    'maximize', 'minimize', 'fullscreen', 'fullscreen-exit', 'expand', 'shrink', 'corner-down-left', 'corner-down-right',
    'corner-left-down', 'corner-left-up', 'corner-right-down', 'corner-right-up', 'corner-up-left', 'corner-up-right',
    'move', 'move-3d', 'move-up', 'move-down', 'move-left', 'move-right', 'rotate-cw', 'rotate-ccw',
    'flip-vertical', 'flip-horizontal', 'refresh-cw', 'refresh-ccw', 'repeat', 'repeat-1', 'shuffle', 'sync',
    'arrow-up-circle', 'arrow-down-circle', 'arrow-left-circle', 'arrow-right-circle', 'arrow-up-right', 'arrow-down-right',
    'arrow-down-left', 'arrow-up-left', 'chevron-up-circle', 'chevron-down-circle', 'chevron-left-circle', 'chevron-right-circle',
    'chevrons-up', 'chevrons-down', 'chevrons-left', 'chevrons-right', 'sync-off', 'folder-down', 'folder-up',
    'file-down', 'file-up', 'file-sync', 'cloud-sync', 'cloud-fog', 'cloud-off', 'sunrise', 'sunset',
    'moon-stars', 'stars', 'sparkles', 'flame', 'fire', 'droplet', 'snowflake', 'umbrella',
    'thermometer-quarter', 'thermometer-three-quarters', 'wind-arrow-down', 'wind-arrow-up', 'wind-arrow-right',
    'wind-arrow-left', 'tornado', 'eye', 'eye-off', 'watch', 'clock-1', 'clock-2', 'clock-3',
    'clock-4', 'clock-5', 'clock-6', 'clock-7', 'clock-8', 'clock-9', 'clock-10', 'clock-11',
    'clock-12', 'calendar-check', 'calendar-x', 'calendar-minus', 'calendar-plus', 'calendar-range',
    'calendar-clock', 'calendar-days', 'calendar-week', 'calendar-month', 'calendar-year', 'calendar-arrow-down',
    'calendar-arrow-up', 'calendar-arrow-left', 'calendar-arrow-right', 'user-plus', 'user-minus', 'user-x',
    'user-check', 'user-pen', 'user-square', 'user-square-check', 'user-square-x', 'user-square-minus',
    'user-square-plus', 'user-circle', 'user-circle-check', 'user-circle-x', 'user-circle-minus', 'user-circle-plus',
    'user-search', 'user-cog', 'user-star', 'user-heart', 'user-lock', 'user-unlock', 'user-key',
    'user-shield', 'user-shield-check', 'user-shield-x', 'user-shield-minus', 'user-shield-plus', 'user-shield-search',
    'user-shield-cog', 'user-shield-star', 'user-shield-heart', 'user-shield-lock', 'user-shield-unlock',
    'user-shield-key', 'crown', 'scepter', 'throne', 'castle', 'building', 'building-2', 'building-4',
    'apartment', 'hotel', 'hospital', 'school', 'bank', 'university', 'factory', 'construction',
    'scaffold', 'hard-hat', 'tool', 'wrench', 'screwdriver', 'hammer', 'drill', 'saw', 'axe',
    'chainsaw', 'pipe', 'pipe-wrench', 'pliers', 'wire', 'wire-off', 'wifi-off', 'wifi-0',
    'wifi-1', 'wifi-2', 'wifi-3', 'bluetooth-off', 'bluetooth-connected', 'bluetooth-searching',
    'bluetooth-paired', 'bluetooth-pairing', 'bluetooth-disconnected', 'battery-charging', 'battery-full',
    'battery-half', 'battery-low', 'battery-empty', 'battery-off', 'plug', 'plug-zap', 'plug-x',
    'plug-off', 'power', 'power-off', 'lightbulb', 'lightbulb-off', 'lightbulb-zap', 'lamp', 'lamp-desk',
    'lamp-floor', 'lamp-wall', 'lamp-ceiling', 'lamp-table', 'tv', 'tv-2', 'monitor-off', 'monitor-speaker',
    'laptop-2', 'smartphone-nfc', 'smartphone-message', 'smartphone-call', 'smartphone-lock', 'smartphone-unlock',
    'smartphone-key', 'smartphone-shield', 'smartphone-shield-check', 'printer-off', 'printer-check', 'printer-x',
    'printer-plus', 'printer-minus', 'scanner', 'scanner-off', 'scanner-check', 'scanner-x', 'fax',
    'fax-off', 'fax-check', 'fax-x', 'mouse-pointer', 'mouse-pointer-click', 'mouse', 'mouse-off',
    'touchpad', 'gamepad', 'gamepad-2', 'joystick', 'key-off', 'key-check', 'key-x', 'key-plus',
    'key-minus', 'lock-open', 'lock-keyhole', 'unlock-keyhole', 'keyhole', 'keyhole-square', 'keyhole-circle',
    'shield-off', 'shield-alert', 'shield-half', 'shield-zap', 'shield-heart', 'shield-star',
    'shield-dollar', 'shield-euro', 'shield-pound', 'shield-yen', 'shield-rupee', 'shield-bitcoin',
    'shield-cash', 'shield-credit-card', 'shield-wallet', 'shield-gift', 'shield-package', 'shield-shopping-cart',
    'shield-shopping-bag', 'shield-receipt', 'shield-file-invoice', 'shield-file-dollar', 'shield-file-plus',
    'shield-file-minus', 'shield-file-x', 'shield-file-check', 'shield-folder-plus', 'shield-folder-minus',
    'shield-folder-x', 'shield-folder-check', 'shield-folder-open', 'shield-folder-sync', 'shield-folder-key',
    'shield-folder-lock'
  ];

  function chartSVG(title) {
    return `<div style="font-size:10.5px;color:#9AA2AC;font-weight:600;margin-bottom:8px;">${title || 'Chart'}</div>
    <svg width="100%" height="100%" viewBox="0 0 260 110" preserveAspectRatio="none">
      <rect x="10" y="40" width="26" height="60" rx="3" fill="#1E7F5C" opacity="0.85"/>
      <rect x="50" y="20" width="26" height="80" rx="3" fill="#1E7F5C"/>
      <rect x="90" y="55" width="26" height="45" rx="3" fill="#1E7F5C" opacity="0.6"/>
      <rect x="130" y="10" width="26" height="90" rx="3" fill="#1E7F5C" opacity="0.95"/>
      <rect x="170" y="65" width="26" height="35" rx="3" fill="#1E7F5C" opacity="0.5"/>
      <rect x="210" y="35" width="26" height="65" rx="3" fill="#1E7F5C" opacity="0.75"/>
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
      overflow: 'hidden'
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
        const borderStyle = m.borderStyle || 'solid';
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
          boxShadow: m.shadowStyle === 'none' ? 'none' : (m.shadowStyle || '0 2px 8px rgba(0,0,0,0.15)')
        });
        node.innerHTML = `<i data-lucide="${iconName}" style="width: ${iconSize}px; height: ${iconSize}px;"></i>`;
        // If lucide is available, render the icon
        if (window.lucide) {
          window.lucide.createIcons();
        }
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
        applyStyle(node, { background: el.fill || '#E8A33D', border: '1.5px solid ' + (el.fill || '#E8A33D') });
        break;
      case 'image':
        applyStyle(node, {
          background: 'repeating-linear-gradient(45deg,#EFF1F4,#EFF1F4 8px,#F7F8FA 8px,#F7F8FA 16px)',
          border: '1.5px dashed #9AA2AC', color: '#9AA2AC', fontSize: '11px'
        });
        node.textContent = el.label || 'Image';
        break;
      case 'graph':
        applyStyle(node, { background: '#fff', border: '1.5px solid #E4E7EB', flexDirection: 'column', padding: '10px', alignItems: 'stretch' });
        node.innerHTML = chartSVG(el.label || 'Chart');
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
      meta: def.meta || {}
    }, overrides || {});
  }

  return { TYPE_LABELS, DEFAULTS, buildNode, makeElement, ICONS };
})();
