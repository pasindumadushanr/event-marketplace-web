import { DEFAULT_PLATFORM, DEFAULT_GENERAL } from "../../src/lib/platform-settings";
describe("Homepage versions for feedback", () => {
  it("lets an administrator save either homepage and reload the selection", () => {
    let saved = { ...DEFAULT_GENERAL };
    cy.intercept("GET", "http://127.0.0.1:3021/admin/cms/public/platform-settings", { body: DEFAULT_PLATFORM });
    cy.intercept("GET", "http://127.0.0.1:3021/admin/cms/settings/general", (req) => req.reply({ body: saved }));
    cy.intercept("POST", "**/admin/cms/settings/general", (req) => {
      expect(req.body.value.siteName).to.equal(DEFAULT_GENERAL.siteName);
      saved = req.body.value;
      req.reply({ body: saved });
    }).as("saveHomepage");
    cy.visit("/admin/settings/general", { onBeforeLoad(win) {
      win.localStorage.setItem("accessToken", "test-admin");
      win.localStorage.setItem("user", JSON.stringify({ id: "a1", firstName: "Admin", roleName: "SUPER_ADMIN" }));
    }});
    cy.get("#setting-homepageVersion").should("have.value", "v2").select("v1");
    cy.contains("button", "Save changes").click();
    cy.wait("@saveHomepage");
    cy.reload();
    cy.get("#setting-homepageVersion").should("have.value", "v1");
    cy.contains("a", "Preview Home V1").should("have.attr", "href", "/home-v1");
    cy.contains("a", "Preview Home V2").should("have.attr", "href", "/home-v2");
    cy.get("#setting-homepageVersion").select("v2");
    cy.contains("button", "Save changes").click();
    cy.wait("@saveHomepage");
    cy.reload();
    cy.get("#setting-homepageVersion").should("have.value", "v2");
  });
  beforeEach(() => {
    cy.intercept("GET", "**/admin/cms/public/platform-settings", {
      body: { ...DEFAULT_PLATFORM, analytics: { googleAnalyticsId: "" } },
    });
    cy.intercept("GET", "**/admin/cms/public/settings/*", { body: {} });
    cy.intercept("GET", "**/business-categories", { body: [] });
    cy.intercept("GET", "**/discovery/search*", {
      body: { data: [], meta: { total: 0 } },
    });
    cy.intercept("GET", "**/discovery/packages*", { body: [] });
  });
  it("keeps version previews available without exposing them in public navigation", () => {
    cy.viewport(1440, 900);
    cy.visit("/");
    cy.get('nav[aria-label="Main navigation"]').within(() => {
      cy.contains("a", "Home V1").should("not.exist");
      cy.contains("a", "Home V2").should("not.exist");
      cy.contains("a", "Home").should("have.attr", "href", "/");
    });
    cy.visit("/home-v1");
    cy.location("pathname").should("eq", "/home-v1");
    cy.get(".home-wedding-section").should("have.length", 7);
    cy.visit("/home-v2");
    cy.location("pathname").should("eq", "/home-v2");
    cy.contains("h1", "Find wedding vendors").should("be.visible");
    cy.get("main > section").should("have.length", 4);
    cy.get("main .home-wedding-section").should("not.exist");
  });
  it("shows only Home in the mobile navigation while preserving preview labels", () => {
    cy.viewport(390, 844);
    cy.visit("/");
    cy.get('button[aria-label="Open navigation menu"]').click();
    cy.contains("#mobile-navigation a", "Home V1").should("not.exist");
    cy.contains("#mobile-navigation a", "Home V2").should("not.exist");
    cy.get('#mobile-navigation a[href="/"]').should("be.visible");
    cy.visit("/home-v1");
    cy.get('[aria-label="Breadcrumb"] [aria-current="page"]').should(
      "have.text",
      "Home V1",
    );
    cy.visit("/home-v2");
    cy.get('[aria-label="Breadcrumb"] [aria-current="page"]').should(
      "have.text",
      "Home V2",
    );
    cy.get("#mobile-navigation").should("not.exist");
    cy.get('form[aria-label="Find wedding vendors"] button').should(
      "be.visible",
    );
  });
  it("keeps comparison pages out of search indexing and the sitemap", () => {
    for (const route of ["/home-v1", "/home-v2"]) {
      cy.request(route).then(({ body }) => {
        const doc = new DOMParser().parseFromString(body, "text/html");
        expect(
          doc.querySelector('meta[name="robots"]')?.getAttribute("content"),
        ).to.contain("noindex");
        expect(
          new URL(
            doc.querySelector('link[rel="canonical"]')?.getAttribute("href") ||
              "",
          ).href,
        ).to.equal("https://nakathata.lk/");
      });
    }
    cy.request("/sitemap.xml")
      .its("body")
      .should("not.contain", "/home-v1")
      .and("not.contain", "/home-v2");
    cy.request("/").then(({ body }) => {
      const doc = new DOMParser().parseFromString(body, "text/html");
      expect(
        doc.querySelector('meta[name="robots"]')?.getAttribute("content") || "",
      ).not.to.contain("noindex");
    });
  });
  it("fits both headers on desktop and tablet without horizontal overflow", () => {
    for (const width of [1024, 1280, 1440]) {
      cy.viewport(width, 900);
      for (const route of ["/home-v1", "/home-v2"]) {
        cy.visit(route);
        cy.document().then((doc) =>
          expect(
            doc.documentElement.scrollWidth,
            `${route} ${width}`,
          ).to.be.at.most(width),
        );
        if (width >= 1280)
          cy.get('nav[aria-label="Main navigation"]')
            .contains("a", /^Home$/)
            .should("be.visible");
        else
          cy.get('button[aria-label="Open navigation menu"]').should(
            "be.visible",
          );
      }
    }
  });
});
