import DOMPurify from 'dompurify';

/**
 * Safely sanitizes rich text / HTML strings against XSS attacks.
 * Uses DOMPurify when running in browser environments and applies
 * strict attribute & script filtering during server-side pre-renders.
 */
export function sanitizeHtml(dirtyHtml?: string | null): string {
  if (!dirtyHtml) return '';

  if (typeof window !== 'undefined') {
    return DOMPurify.sanitize(dirtyHtml, {
      ALLOWED_TAGS: [
        'p', 'br', 'strong', 'em', 'b', 'i', 'u', 's', 'strike',
        'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
        'ul', 'ol', 'li', 'blockquote', 'code', 'pre',
        'a', 'img', 'span', 'div', 'table', 'thead', 'tbody',
        'tr', 'th', 'td', 'hr'
      ],
      ALLOWED_ATTR: [
        'href', 'src', 'alt', 'title', 'class', 'style', 'target', 'rel', 'width', 'height'
      ],
    });
  }

  // Server-side fallback: strip script, iframe, embed, object, event handlers, and javascript: protocols
  return dirtyHtml
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    .replace(/<iframe\b[^<]*(?:(?!<\/iframe>)<[^<]*)*<\/iframe>/gi, '')
    .replace(/<object\b[^<]*(?:(?!<\/object>)<[^<]*)*<\/object>/gi, '')
    .replace(/<embed\b[^<]*(?:(?!<\/embed>)<[^<]*)*<\/embed>/gi, '')
    .replace(/\s*on\w+\s*=\s*(?:"[^"]*"|'[^']*'|[^\s>]+)/gi, '')
    .replace(/href\s*=\s*["']?javascript:[^"'>]*/gi, 'href="#"')
    .replace(/src\s*=\s*["']?javascript:[^"'>]*/gi, 'src=""');
}
