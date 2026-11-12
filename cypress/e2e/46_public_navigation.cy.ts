export {};

const links = [
  ["Home", "/"],
  ["Find Vendors", "/search"],
  ["Services", "/categories"],
  ["Locations", "/locations"],
  ["Packages", "/packages"],
  ["About", "/about"],
  ["Contact", "/contact"],
];

describe("Consistent public navigation", () => {
  for (const route of ["/home-v2", "/search"]) {
    it(`shows all links on desktop at ${route}`, () => {
      cy.viewport(1440, 900);
      cy.visit(route);
      cy.get('nav[aria-label="Main navigation"]').within(() => {
        for (const [label, href] of links)
          cy.contains("a", new RegExp(`^${label}$`))
            .should("be.visible")
            .and("have.attr", "href", href);
      });
    });
    it(`shows each link once in the mobile menu at ${route}`, () => {
      cy.viewport(390, 844);
      cy.visit(route);
      // The dev server can paint the server-rendered header before hydration.
      cy.wait(1000);
      cy.get('button[aria-label="Open navigation menu"]').click();
      cy.get("#mobile-navigation").within(() => {
        for (const [label, href] of links)
          cy.get(`a[href="${href}"]`)
            .should("have.length", 1)
            .and("be.visible")
            .and("contain.text", label);
      });
    });
  }
});
