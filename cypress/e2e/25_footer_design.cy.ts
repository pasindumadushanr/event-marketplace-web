describe("Branded footer", () => {
  beforeEach(() => {
    cy.intercept("GET", "**/admin/cms/public/settings/FOOTER_CONTENT", {
      body: {
        description: "Celebrations made simple with Nakathata.",
        copyright: "© Nakathata test",
        subtext: "Everything together.",
        socials: {
          instagram: "https://www.instagram.com/nakathata.lk/",
          linkedin: "#",
        },
      },
    });
    cy.intercept("GET", "**/admin/cms/public/settings/SITE_MEDIA", {
      body: {},
    });
    cy.intercept("GET", "**/business-categories", { body: [] });
    cy.intercept("GET", "**/discovery/packages*", { body: [] });
    cy.intercept("GET", "**/discovery/search*", {
      body: { data: [], meta: { total: 0 } },
    });
  });
  it("preserves CMS copy and useful navigation with labelled social links", () => {
    cy.visit("/");
    cy.get("footer").scrollIntoView();
    cy.get("footer").within(() => {
      cy.contains("Celebrations made simple with Nakathata.").should(
        "be.visible",
      );
      cy.contains("© Nakathata test").should("be.visible");
      cy.get('nav[aria-label="Footer Explore"]')
        .contains("a", "Vendors")
        .should("have.attr", "href", "/search");
      cy.get('nav[aria-label="Footer Support"]')
        .contains("a", "Privacy Policy")
        .should("have.attr", "href", "/privacy");
      cy.get('a[aria-label="Follow Nakathata on Instagram"]').should(
        "have.attr",
        "rel",
        "noopener noreferrer",
      );
      cy.get('a[href="#"]').should("not.exist");
      cy.contains("Make every celebration special.").should("not.exist");
      cy.get('input[aria-label="Newsletter email address"]').should(
        "not.exist",
      );
    });
  });
  it("fits mobile and keeps the simple navigation usable", () => {
    cy.viewport(390, 844);
    cy.visit("/");
    cy.get("footer").scrollIntoView();
    cy.get("footer").then(($footer) =>
      expect($footer[0].scrollWidth).to.be.at.most(390),
    );
    cy.get('nav[aria-label="Footer Company"]')
      .contains("Contact")
      .should("have.attr", "href", "/contact");
  });
});
