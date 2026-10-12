// Import commands.js using ES2015 syntax:
import "./commands";

// Local regression tests must never send traffic to a real GA4 property.
beforeEach(() => {
  cy.intercept("GET", "**googletagmanager.com/gtag/js*", { body: "" });
});

// Ignore specific Next.js or React hydration exceptions that do not affect functionality
Cypress.on("uncaught:exception", (err) => {
  if (
    err.message.includes("NEXT_REDIRECT") ||
    err.message.includes("Hydration failed") ||
    err.message.includes("hydrating") ||
    err.message.includes("Minified React error") ||
    err.message.includes("ResizeObserver") ||
    err.message.includes("Performance") ||
    err.message.includes("negative time stamp") ||
    err.message.includes("Rendered more hooks")
  ) {
    return false;
  }
  return true;
});
