describe("Wedding heading typography", () => {
  beforeEach(() => {
    cy.intercept("GET", "**/admin/cms/public/settings/*", { body: {} });
    cy.intercept("GET", "**/business-categories", {
      body: [
        {
          id: "photos",
          name: "Photographers",
          slug: "photographers",
          status: "ACTIVE",
          parentId: null,
          image: "/images/brand/favicon-96.png",
        },
      ],
    });
    cy.intercept("GET", "**/discovery/search*", {
      body: { data: [], meta: { total: 0 } },
    });
    cy.intercept("GET", "**/discovery/packages*", { body: [] });
  });
  it("loads the display font for headlines while preserving readable interface text", () => {
    cy.visit("/");
    cy.get("main h1")
      .should("have.css", "font-weight", "600")
      .invoke("css", "font-family")
      .should("match", /Cormorant.*Garamond/i);
    cy.get(".home-section-title").each(($heading) =>
      cy
        .wrap($heading)
        .invoke("css", "font-family")
        .should("match", /Cormorant.*Garamond/i),
    );
    cy.get("#home-search-query")
      .invoke("css", "font-family")
      .should("match", /Geist/i);
    cy.get("main h1 + p")
      .invoke("css", "font-family")
      .should("match", /Geist/i);
    cy.get(".vendor-invitation-primary")
      .invoke("css", "font-family")
      .should("match", /Geist/i);
    cy.get("footer h3")
      .first()
      .invoke("css", "font-family")
      .should("match", /Geist/i);
    cy.document().then(async (doc) => {
      await doc.fonts.ready;
      const heading = doc.querySelector("main h1")!;
      const family = doc
        .defaultView!.getComputedStyle(heading)
        .fontFamily.split(",")[0];
      expect(doc.fonts.check(`600 48px ${family}`)).to.equal(true);
    });
  });
  it("styles public directory headlines without changing small card headings", () => {
    cy.visit("/categories");
    cy.get("h1")
      .invoke("css", "font-family")
      .should("match", /Cormorant.*Garamond/i);
    cy.get("main h2")
      .first()
      .invoke("css", "font-family")
      .should("match", /Geist/i);
  });
  it("keeps dashboard headings in Geist", () => {
    cy.intercept("GET", "**/users?roles=VENDOR", { body: [] });
    cy.intercept("GET", "**/subscriptions/plans", { body: [] });
    cy.visit("/admin/users/vendors", {
      onBeforeLoad(win) {
        win.localStorage.setItem("accessToken", "test-admin");
        win.localStorage.setItem(
          "user",
          JSON.stringify({
            id: "admin",
            firstName: "Admin",
            roleName: "SUPER_ADMIN",
          }),
        );
      },
    });
    cy.contains("h2", "Vendors")
      .invoke("css", "font-family")
      .should("match", /Geist/i);
  });
  it("fits mobile headlines and keeps the two calls to action visible", () => {
    cy.viewport(390, 844);
    cy.visit("/");
    cy.get("main").then(($main) =>
      expect($main[0].scrollWidth).to.be.at.most(390),
    );
    cy.get(".vendor-invitation-panel").scrollIntoView({
      offset: { top: -90, left: 0 },
    });
    cy.contains("a", "Register Your Business").should("be.visible");
    cy.contains("a", "Learn More").should("be.visible");
  });
});
