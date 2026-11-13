import sanitize from "sanitize-html";

/**
 * Safely sanitizes rich text / HTML strings against XSS attacks.
 * Uses the same parser-based allowlist on the server and in the browser.
 */
export function sanitizeHtml(dirtyHtml?: string | null): string {
  if (!dirtyHtml) return "";

  return sanitize(dirtyHtml, {
    allowedTags: [
      "p",
      "br",
      "strong",
      "em",
      "b",
      "i",
      "u",
      "s",
      "strike",
      "h1",
      "h2",
      "h3",
      "h4",
      "h5",
      "h6",
      "ul",
      "ol",
      "li",
      "blockquote",
      "code",
      "pre",
      "a",
      "img",
      "span",
      "div",
      "table",
      "thead",
      "tbody",
      "tr",
      "th",
      "td",
      "hr",
    ],
    allowedAttributes: {
      "*": ["class", "title"],
      a: ["href", "target", "rel"],
      img: ["src", "alt", "width", "height"],
      ol: ["start"],
      li: ["data-list"],
    },
    allowedSchemes: ["http", "https", "mailto", "tel"],
    allowedSchemesByTag: { img: ["http", "https"] },
    allowProtocolRelative: false,
    parseStyleAttributes: false,
    transformTags: {
      a: (_tag, attributes) => ({
        tagName: "a",
        attribs: {
          ...attributes,
          ...(attributes.target === "_blank"
            ? { rel: "noopener noreferrer" }
            : {}),
        },
      }),
    },
  });
}
