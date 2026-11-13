// Exercise the real TypeScript helper in Node, without a DOM or live API.
const assert = require("node:assert/strict");
const { readFileSync } = require("node:fs");
const { resolve } = require("node:path");
const ts = require("typescript");
const source = readFileSync(
  resolve(__dirname, "../src/lib/sanitize.ts"),
  "utf8",
);
const compiled = ts.transpileModule(source, {
  compilerOptions: { module: ts.ModuleKind.CommonJS, esModuleInterop: true },
}).outputText;
const loaded = { exports: {} };
new Function("require", "module", "exports", compiled)(
  require,
  loaded,
  loaded.exports,
);
const { sanitizeHtml } = loaded.exports;
const attacks = [
  "<script>alert(1)</script><p>Safe</p>",
  '<img src="x" onerror="alert(1)">',
  '<a href="jav&#x61;script:alert(1)">link</a>',
  '<a href="java&#10;script:alert(1)">link</a>',
  '<svg><a xlink:href="javascript:alert(1)">bad</a></svg>',
  '<iframe srcdoc="<script>alert(1)</script>"></iframe>',
  '<img src="data:image/svg+xml,<svg onload=alert(1)>">',
  '<div style="position:fixed;inset:0" onclick=alert(1)>text</div>',
];
for (const input of attacks) {
  assert.doesNotMatch(
    sanitizeHtml(input),
    /<script|<svg|<iframe|onerror|onclick|onload|javascript:|srcdoc|data:image|style=/i,
  );
}
assert.equal(sanitizeHtml(null), "");
const safe = sanitizeHtml(
  '<h2>Our story</h2><p><strong>Hello</strong></p><img src="https://example.com/photo.jpg" alt="Wedding"><a href="https://example.com" target="_blank">Visit</a>',
);
assert.match(safe, /<h2>Our story<\/h2>/);
assert.match(safe, /<strong>Hello<\/strong>/);
assert.match(safe, /src="https:\/\/example.com\/photo.jpg"/);
assert.match(safe, /rel="noopener noreferrer"/);
console.log(
  `PASS: ${attacks.length} unsafe HTML cases, empty content and safe formatting on server`,
);
