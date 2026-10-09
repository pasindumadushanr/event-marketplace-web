import { test } from "node:test";
import assert from "node:assert/strict";
import { policyHtml } from "../src/lib/policy-html.ts";
import { faqCategories, validFaqs } from "../src/lib/public-faqs.ts";

test("preserves readable formatting and safe contact links", () => {
  assert.equal(
    policyHtml(
      '<h2>Policy</h2><p><strong>Safe</strong> <a href="/contact">Contact</a></p>',
    ),
    '<h2>Policy</h2><p><strong>Safe</strong> <a href="/contact">Contact</a></p>',
  );
});
test("strips scripts, event handlers, styles, and image tracking", () => {
  const safe = policyHtml(
    '<script>alert(1)</script><style>body{display:none}</style><img src="https://example.com/track"><p onclick="alert(1)" style="position:fixed">Text</p>',
  );
  assert.equal(safe, "<p>Text</p>");
});
test("rejects encoded JavaScript, data URLs, and protocol-relative links", () => {
  const safe = policyHtml(
    '<a href="java&#x73;cript:alert(1)">One</a><a href="data:text/html,hi">Two</a><a href="//example.com">Three</a>',
  );
  assert.equal(safe, "<a>One</a><a>Two</a><a>Three</a>");
});
test("normalizes editor nonbreaking spaces for readable previews", () => {
  assert.equal(
    policyHtml("<p>New\u00a0owner&nbsp;wording</p>"),
    "<p>New owner wording</p>",
  );
});
test("groups admin categories and sorts questions without mutating the response", () => {
  const items = [
    {
      id: "later",
      question: "Later",
      answer: "A",
      category: "GENERAL",
      sortOrder: 20,
    },
    {
      id: "earlier",
      question: "Earlier",
      answer: "A",
      category: "GENERAL",
      sortOrder: 1,
    },
    {
      id: "new",
      question: "Town",
      answer: "A",
      category: "NEARBY_SEARCH",
      sortOrder: 0,
    },
  ];
  assert.deepEqual(
    faqCategories(items).map((group) => [
      group.name,
      group.faqs.map((item) => item.id),
    ]),
    [
      ["Nearby Search", ["new"]],
      ["General", ["earlier", "later"]],
    ],
  );
  assert.equal(items[0].id, "later");
});
test("accepts an intentionally empty list and rejects invalid API responses", () => {
  assert.equal(validFaqs([]), true);
  assert.equal(validFaqs({ error: "unavailable" }), false);
  assert.equal(
    validFaqs([
      { id: "x", question: "Q", answer: "A", category: "", sortOrder: 0 },
    ]),
    false,
  );
});
