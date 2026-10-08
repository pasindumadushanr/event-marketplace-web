describe("Non-payment readiness", () => {
  it("shows a simple footer without a newsletter signup panel", () => {
    cy.intercept("GET", "**/business-categories", { body: [] });
    cy.intercept("GET", "**/discovery/packages*", { body: [] });
    cy.visit("/");
    cy.get("footer").should("exist");
    cy.get('input[aria-label="Newsletter email address"]').should("not.exist");
    cy.contains("button", "Subscribe").should("not.exist");
  });

  it("serves crawler files and includes public vendor pages in the sitemap", () => {
    cy.request("/robots.txt")
      .its("body")
      .should("contain", "Disallow: /admin")
      .and("contain", "Sitemap:");
    cy.request("/sitemap.xml")
      .its("body")
      .should("contain", "/business/vendor-test")
      .and("not.contain", "/vendor/preview");
  });

  it("renders vendor-specific metadata on the server before browser JavaScript", () => {
    cy.request("/business/vendor-test")
      .its("body")
      .should("contain", "<title>Sunrise Photography | Nakathata.lk</title>")
      .and("contain", 'rel="canonical"');
    cy.visit("/business/vendor-test");
    cy.contains("h1", "Sunrise Photography").should("be.visible");
    cy.get('button[aria-label="Next month"]').click();
    cy.get('button[aria-label="Previous month"]').should("be.enabled");
  });
});
