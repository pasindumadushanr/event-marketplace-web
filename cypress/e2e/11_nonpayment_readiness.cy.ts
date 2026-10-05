describe("Non-payment readiness", () => {
  it("requires consent, saves newsletter signups and shows failures honestly", () => {
    cy.intercept("GET", "**/business-categories", { body: [] });
    cy.intercept("GET", "**/discovery/packages*", { body: [] });
    cy.visit("/");
    cy.get('input[aria-label="Newsletter email address"]').type(
      "reader@example.com",
    );
    cy.contains("button", "Subscribe").should("be.disabled");
    cy.contains("label", "I agree to receive").find("input").check();
    cy.intercept("POST", "**/contact/newsletter", {
      statusCode: 500,
      body: {},
    }).as("failedSignup");
    cy.contains("button", "Subscribe").click();
    cy.wait("@failedSignup");
    cy.contains("We couldn’t save your signup").should("be.visible");
    cy.get('input[aria-label="Newsletter email address"]').should(
      "have.value",
      "reader@example.com",
    );
    cy.intercept("POST", "**/contact/newsletter", (req) => {
      expect(req.body).to.deep.equal({
        email: "reader@example.com",
        consent: true,
      });
      req.reply({ body: { success: true } });
    }).as("signup");
    cy.contains("button", "Subscribe").click();
    cy.wait("@signup");
    cy.contains("Your newsletter signup has been saved").should("be.visible");
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
