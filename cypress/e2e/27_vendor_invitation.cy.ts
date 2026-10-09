describe("Vendor invitation design", () => {
  beforeEach(() => {
    cy.intercept("GET", "**/admin/cms/public/settings/*", { body: {} });
    cy.intercept("GET", "**/business-categories", { body: [] });
    cy.intercept("GET", "**/discovery/packages*", { body: [] });
    cy.intercept("GET", "**/discovery/search*", {
      body: { data: [], meta: { total: 0 } },
    });
  });
  it("keeps the invitation simple with separate registration and information links", () => {
    cy.viewport(1200, 800);
    cy.visit("/");
    cy.get('section[aria-labelledby="vendor-invitation-title"]')
      .scrollIntoView({ offset: { top: -90, left: 0 } })
      .within(() => {
        cy.get("h2")
          .should("be.visible")
          .and("contain.text", "Grow Your Event");
        cy.get("p")
          .should("have.length", 1)
          .and("contain.text", "Showcase your work and connect with customers");
        cy.get("h3, ul, .vendor-invitation-benefits").should("not.exist");
        cy.contains("a", "Register Your Business").should(
          "have.attr",
          "href",
          "/vendor/register",
        );
        cy.contains("a", "Learn More").should("have.attr", "href", "/sell");
        cy.get("a button").should("not.exist");
        cy.get(".vendor-invitation-decoration")
          .should("have.attr", "aria-hidden", "true")
          .and("have.css", "pointer-events", "none");
      });
  });
  it("stacks neatly on mobile without horizontal overflow", () => {
    cy.viewport(390, 844);
    cy.visit("/");
    cy.get('section[aria-labelledby="vendor-invitation-title"]')
      .scrollIntoView({ offset: { top: -80, left: 0 } })
      .then(($section) => {
        expect($section[0].scrollWidth).to.be.at.most(390);
      });
    cy.get(".vendor-invitation-panel").then(($panel) => {
      expect($panel[0].scrollWidth).to.be.at.most($panel[0].clientWidth);
    });
    cy.contains("a", "Register Your Business").should("be.visible");
    cy.contains("a", "Learn More").should("be.visible");
  });
});
