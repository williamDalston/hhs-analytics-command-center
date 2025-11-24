// Simple HTML sanitizer for safe rendering
// Allows only safe HTML tags for tables and basic formatting
const ALLOWED_TAGS = ['table', 'thead', 'tbody', 'tfoot', 'tr', 'td', 'th', 'br', 'p', 'div', 'span', 'strong', 'em', 'b', 'i', 'u', 'ul', 'ol', 'li'];
const ALLOWED_ATTRIBUTES = ['colspan', 'rowspan', 'style'];

export const sanitizeHTML = (html) => {
  if (!html || typeof html !== 'string') return '';
  
  try {
    // Create a temporary div to parse HTML
    const temp = document.createElement('div');
    temp.innerHTML = html;
    
    // Remove dangerous elements
    const dangerous = temp.querySelectorAll('script, iframe, object, embed, form, input, button, link, meta, style');
    dangerous.forEach(el => el.remove());
    
    // Remove all event handlers and dangerous attributes
    const allElements = temp.querySelectorAll('*');
    allElements.forEach(el => {
      // Remove all event handlers
      const attrs = Array.from(el.attributes);
      attrs.forEach(attr => {
        if (attr.name.startsWith('on') || attr.name === 'href' || attr.name === 'src') {
          el.removeAttribute(attr.name);
        }
      });
      
      // Store allowed attributes
      const allowedAttrs = {};
      ALLOWED_ATTRIBUTES.forEach(attrName => {
        if (el.hasAttribute(attrName)) {
          allowedAttrs[attrName] = el.getAttribute(attrName);
        }
      });
      
      // Remove all attributes first
      Array.from(el.attributes).forEach(attr => {
        el.removeAttribute(attr.name);
      });
      
      // Re-add only safe attributes
      Object.entries(allowedAttrs).forEach(([name, value]) => {
        if (name === 'style') {
          // Sanitize style attribute - only allow safe CSS properties
          const safeStyles = value
            .split(';')
            .map(s => s.trim())
            .filter(s => {
              const [prop] = s.split(':').map(x => x.trim().toLowerCase());
              const safeProps = ['color', 'background-color', 'text-align', 'font-weight', 'font-size', 'padding', 'margin', 'border', 'border-collapse', 'width'];
              return safeProps.includes(prop) && !s.includes('expression') && !s.includes('javascript');
            })
            .join('; ');
          if (safeStyles) el.setAttribute('style', safeStyles);
        } else {
          // Validate numeric attributes
          if (name === 'colspan' || name === 'rowspan') {
            const num = parseInt(value, 10);
            if (!isNaN(num) && num > 0 && num <= 100) {
              el.setAttribute(name, num.toString());
            }
          } else {
            el.setAttribute(name, value);
          }
        }
      });
      
      // Remove disallowed tags (keep only text nodes and allowed tags)
      const tagName = el.tagName.toLowerCase();
      if (!ALLOWED_TAGS.includes(tagName)) {
        const parent = el.parentNode;
        if (parent) {
          while (el.firstChild) {
            parent.insertBefore(el.firstChild, el);
          }
          parent.removeChild(el);
        }
      }
    });
    
    return temp.innerHTML;
  } catch (error) {
    console.error('HTML sanitization failed', error);
    // Fallback: escape HTML
    return html.replace(/</g, '&lt;').replace(/>/g, '&gt;');
  }
};

export const isHTMLContent = (text) => {
  if (!text) return false;
  return /<[a-z][\s\S]*>/i.test(text);
};

