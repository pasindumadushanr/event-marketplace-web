describe("Clear public page navigation", () => {
  beforeEach(() => {
    cy.intercept("GET", "**/admin/cms/public/settings/*", { body: {} });
    cy.intercept("GET", "**/discovery/search*", {
      body: { data: [], meta: { total: 0 } },
    });
    cy.intercept("GET", "**/discovery/packages*", { body: [] });
    cy.intercept("GET", "**/business-categories", { body: [] });
  });

  it("identifies About Us and lets visitors go home without opening the menu", () => {
    cy.viewport(390, 844);
    cy.visit("/about");
    cy.get('[aria-label="Breadcrumb"] [aria-current="page"]')
      .should("be.visible")
      .and("have.text", "About Us");
    cy.get('[aria-label="Breadcrumb"] ol').should(
      "have.css",
      "flex-direction",
      "row",
    );
    cy.get('[aria-label="Breadcrumb"] a').then(($home) => {
      cy.get('[aria-label="Breadcrumb"] [aria-current="page"]').then(
        ($page) => {
          expect(
            Math.abs(
              $home[0].getBoundingClientRect().top -
                $page[0].getBoundingClientRect().top,
            ),
          ).to.be.lessThan(18);
        },
      );
    });
    cy.scrollTo(0, 500);
    cy.get('[aria-label="Breadcrumb"] [aria-current="page"]').should(
      "be.visible",
    );
    cy.get('[aria-label="Breadcrumb"] a')
      .should("be.visible")
      .and("have.attr", "href", "/")
      .click();
    cy.location("pathname").should("equal", "/");
    cy.get('[aria-label="Breadcrumb"]').should("not.exist");
    cy.get('a[aria-label="Nakathata.lk home"]').should("be.visible");
  });

  it("highlights About in a scrollable mobile menu and closes after navigation", () => {
    cy.viewport(390, 667);
    cy.visit("/about");
    cy.get('button[aria-label="Open navigation menu"]')
      .click()
      .should("have.attr", "aria-expanded", "true");
    cy.get("#mobile-navigation").should("have.css", "overflow-y", "auto");
    cy.get('#mobile-navigation a[aria-current="page"]')
      .should("contain", "About")
      .and("contain", "Current page");
    cy.contains("#mobile-navigation a", "Home").click();
    cy.location("pathname").should("equal", "/");
    cy.get("#mobile-navigation").should("not.exist");
  });

  it("shows labels on other public pages at narrow mobile widths", () => {
    cy.viewport(320, 720);
    const pages = {
      "/faq": "FAQ",
      "/blog": "Blog",
      "/careers": "Careers",
      "/trust": "Trust & Safety",
      "/privacy": "Privacy Policy",
      "/terms": "Terms of Service",
      "/sell": "For Vendors",
      "/contact": "Contact Us",
      "/locations": "Locations",
      "/categories": "Categories",
      "/search": "Vendors",
      "/blog/wedding-guide": "Blog Article",
      "/business/vendor-test": "Vendor Profile",
    };
    Object.entries(pages).forEach(([route, label]) => {
      cy.visit(route);
      cy.get('[aria-label="Breadcrumb"] [aria-current="page"]')
        .should("be.visible")
        .and("have.text", label);
      cy.get('[aria-label="Breadcrumb"] a').should("be.visible");
      cy.document().then((doc) =>
        expect(doc.documentElement.scrollWidth, route).to.be.at.most(320),
      );
    });
  });

  it("updates the indicator through client navigation and keeps light headers readable", () => {
    cy.viewport(390, 844);
    cy.visit("/about");
    cy.get('button[aria-label="Open navigation menu"]').click();
    cy.contains("#mobile-navigation a", "Blog").click();
    cy.get('[aria-label="Breadcrumb"] [aria-current="page"]').should(
      "have.text",
      "Blog",
    );
    cy.get('[aria-label="Breadcrumb"]').should(
      "have.css",
      "color",
      "rgb(53, 83, 70)",
    );
    cy.get('button[aria-label="Open navigation menu"]').click();
    cy.get('#mobile-navigation a[aria-current="page"]').should(
      "contain",
      "Blog",
    );
    cy.contains("#mobile-navigation a", "FAQ").scrollIntoView().click();
    cy.get('[aria-label="Breadcrumb"] [aria-current="page"]').should(
      "have.text",
      "FAQ",
    );
  });

  it("marks only the correct desktop link and never treats Packages as Home", () => {
    cy.viewport(1280, 800);
    cy.visit("/about");
    cy.get('nav[aria-label="Main navigation"] a[aria-current="page"]')
      .should("have.length", 1)
      .and("have.attr", "href", "/about");
    cy.get('[aria-label="Breadcrumb"]').should("not.be.visible");
    cy.visit("/");
    cy.get('nav[aria-label="Main navigation"] a[aria-current="page"]')
      .should("have.length", 1)
      .and("have.attr", "href", "/");
  });
});
