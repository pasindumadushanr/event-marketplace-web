describe("Public page wedding design", () => {
  beforeEach(() => {
    cy.intercept("GET", "**/admin/cms/public/settings/*", { body: {} });
  });

  it("keeps About discovery links and uses different wedding ornaments", () => {
    cy.visit("/about");
    cy.get("main .public-page-hero").should(
      "have.css",
      "background-color",
      "rgb(35, 72, 60)",
    );
    cy.get("main .public-page-hero a")
      .first()
      .should("have.attr", "href", "/search");
    cy.get("main .public-page-hero a")
      .last()
      .should("have.attr", "href", "/vendor/register");
    cy.get('[aria-label="Our story"] [data-motif="rings"]').should("exist");
    cy.get('[aria-label="Our values"] [data-motif="ribbon"]').should("exist");
  });

  it("preserves FAQ categories, answers, search and empty-state recovery", () => {
    cy.visit("/faq");
    cy.contains("button", "What is Nakathata.lk?").click();
    cy.contains("premium marketplace connecting").should("be.visible");
    cy.contains(".public-faq-category", "Customers")
      .click()
      .should("have.attr", "aria-pressed", "true");
    cy.contains("button", "Do I need an account to browse vendors?").should(
      "be.visible",
    );
    cy.get('input[aria-label="Search frequently asked questions"]').type(
      "password",
    );
    cy.contains("button", "How do I change my password?").click();
    cy.contains("Account Settings > Security").should("be.visible");
    cy.get('input[aria-label="Search frequently asked questions"]')
      .clear()
      .type("zzzzunmatched");
    cy.contains("No results found").should("be.visible");
    cy.contains("button", "Clear Search").click();
    cy.contains("button", "Do I need an account to browse vendors?").should(
      "be.visible",
    );
    cy.contains("a", "Contact Support").should("have.attr", "href", "/contact");
  });

  it("preserves vendor registration and benefits links", () => {
    cy.visit("/sell");
    cy.get(".public-page-hero a")
      .first()
      .should("have.attr", "href", "/vendor/register");
    cy.get(".public-page-hero a")
      .last()
      .should("have.attr", "href", "#benefits");
    cy.get("#benefits").should("exist");
    cy.get(".public-page-card").should("have.length.greaterThan", 3);
  });

  it("keeps Blog navigation and article content", () => {
    cy.visit("/blog");
    cy.get(".public-page-intro h1").should("contain", "Our Blog");
    cy.contains("a", "Wedding Planning Guide").click();
    cy.location("pathname").should("equal", "/blog/wedding-guide");
    cy.get(".public-page-intro h1").should("contain", "Wedding Planning Guide");
    cy.contains("Wedding planning in Sri Lanka").should("be.visible");
    cy.contains("a", "Back to all posts").should("have.attr", "href", "/blog");
  });

  it("preserves safety limits and job application links", () => {
    cy.visit("/trust");
    cy.get(".public-page-card").should("have.length", 5);
    cy.contains("We do not currently verify identity documents").should(
      "exist",
    );
    cy.contains(
      "does not promise automatic replacements or instant refunds",
    ).should("exist");
    cy.visit("/careers");
    cy.get(".public-page-intro h1").should("contain", "Build the Future");
    cy.contains("a", "Apply Now")
      .should("have.attr", "href")
      .and("match", /^mailto:careers@nakathata\.lk/);
  });

  it("fits the updated pages on mobile without horizontal scrolling", () => {
    cy.viewport(390, 844);
    [
      "/about",
      "/faq",
      "/sell",
      "/blog",
      "/blog/wedding-guide",
      "/trust",
      "/careers",
    ].forEach((route) => {
      cy.visit(route);
      cy.get("main h1").should("be.visible");
      cy.document().then((doc) =>
        expect(doc.documentElement.scrollWidth, route).to.be.at.most(390),
      );
    });
  });

  it("fits public layouts at a compact desktop width", () => {
    cy.viewport(1024, 768);
    ["/about", "/faq", "/sell", "/blog", "/trust", "/careers"].forEach(
      (route) => {
        cy.visit(route);
        cy.document().then((doc) =>
          expect(doc.documentElement.scrollWidth, route).to.be.at.most(1024),
        );
      },
    );
  });
});
