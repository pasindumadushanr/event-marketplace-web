import { DEFAULT_PLATFORM } from "../../src/lib/platform-settings";
const vendor = {
  id: "simple-vendor",
  name: "Walasmulla Wedding Studio",
  city: "Walasmulla",
  category: { name: "Photography" },
  coverImage: "/images/brand/nakathata-logo.jpg",
};
describe("Simple customer-first homepage", () => {
  beforeEach(() => {
    cy.intercept("GET", "**/admin/cms/public/platform-settings", {
      body: { ...DEFAULT_PLATFORM, analytics: { googleAnalyticsId: "" } },
    });
    cy.intercept("GET", "**/admin/cms/public/settings/*", { body: {} });
    cy.intercept("GET", "**/discovery/search*", {
      body: { data: [vendor], meta: { total: 1, page: 1, totalPages: 1 } },
    });
    cy.intercept("GET", "**/business-categories", { body: [] });
    cy.intercept("GET", "**/discovery/packages*", { body: [] });
  });
  it("shows only four main sections and removes the unwanted sections", () => {
    cy.visit("/");
    cy.contains("h1", "Find wedding vendors").should("be.visible");
    cy.get("main > section").should("have.length", 4);
    cy.get("main")
      .should("not.contain", "How It Works")
      .and("not.contain", "Browse by Location")
      .and("not.contain", "Book Securely");
    cy.get("main #packages, #home-search-query, .home-wedding-section").should(
      "not.exist",
    );
    cy.get('#categories a[href*="categorySlug="]').should("have.length", 6);
    cy.get('a[href="/business/simple-vendor"]').should("contain", vendor.name);
    cy.contains("a", "List your business").should(
      "have.attr",
      "href",
      "/vendor/register",
    );
    cy.get("footer").should("be.visible");
    cy.screenshot("simple-homepage-desktop", { capture: "viewport" });
  });
  it("searches by service and custom town with no location permission", () => {
    const geolocation = cy.stub().as("locationPermission");
    cy.visit("/", {
      onBeforeLoad(win) {
        Object.defineProperty(win.navigator, "geolocation", {
          configurable: true,
          value: { getCurrentPosition: geolocation },
        });
      },
    });
    cy.get("#simple-service").select("photography-media");
    cy.get("#simple-location").type("  Walasmulla  ");
    cy.get("#simple-location").type("{enter}");
    cy.location("pathname").should("eq", "/search");
    cy.location("search")
      .should("contain", "categorySlug=photography-media")
      .and("contain", "city=Walasmulla")
      .and("not.contain", "q=");
    cy.get('input[aria-label="Town or city"]').should(
      "have.value",
      "Walasmulla",
    );
    cy.contains(vendor.name).should("be.visible");
    cy.get("@locationPermission").should("not.have.been.called");
  });
  it("allows browsing all vendors and a district without forcing a keyword", () => {
    cy.visit("/");
    cy.get("#simple-location").type("Matara");
    cy.get('form[aria-label="Find wedding vendors"] button').click();
    cy.location("search").should("eq", "?city=Matara");
    cy.visit("/");
    cy.get('form[aria-label="Find wedding vendors"] button').click();
    cy.location("pathname").should("eq", "/search");
    cy.location("search").should("eq", "");
  });
  it("keeps uploaded hero images and category navigation working", () => {
    cy.intercept("GET", "**/admin/cms/public/settings/SITE_MEDIA", {
      body: {
        heroImage: "/images/brand/nakathata-logo.jpg",
        categoryImages: {
          "hair-beauty-grooming": "/images/brand/favicon-96.png",
        },
      },
    });
    cy.visit("/");
    cy.get('img[alt="A beautifully arranged wedding celebration"]').should(
      "have.attr",
      "src",
      "/images/brand/nakathata-logo.jpg",
    );
    cy.get('#categories a[href*="hair-beauty-grooming"] img').should(
      "have.attr",
      "src",
      "/images/brand/favicon-96.png",
    );
    cy.contains("#categories a", "Salons & makeup").click();
    cy.location("search").should(
      "contain",
      "categorySlug=hair-beauty-grooming",
    );
  });
  it("shows a retry on vendor failures rather than a false empty result", () => {
    cy.intercept("GET", "**/discovery/search*", { statusCode: 500 });
    cy.visit("/");
    cy.get('[role="alert"]').should("contain", "load vendors");
    cy.intercept("GET", "**/discovery/search*", { body: { data: [vendor] } });
    cy.contains("button", "Try again").click();
    cy.get('a[href="/business/simple-vendor"]').should("exist");
  });
  it("has no horizontal overflow on narrow phones and keeps search usable", () => {
    for (const width of [320, 390]) {
      cy.viewport(width, 844);
      cy.visit("/");
      cy.document().then((doc) =>
        expect(doc.documentElement.scrollWidth).to.be.at.most(width),
      );
      cy.get('form[aria-label="Find wedding vendors"] button').should(
        "be.visible",
      );
      cy.get("#simple-location").should("have.css", "font-size", "16px");
      cy.get('button[aria-label="Open navigation menu"]').click();
      cy.contains("#mobile-navigation a", "Find Vendors").should("be.visible");
      cy.get('button[aria-label="Close navigation menu"]').click();
    }
    cy.screenshot("simple-homepage-mobile", { capture: "viewport" });
  });
  it("preserves the previous layout for comparison and keeps packages reachable", () => {
    cy.visit("/home-classic");
    cy.get(".home-wedding-section").should("have.length", 7);
    cy.get('meta[name="robots"]')
      .should("have.attr", "content")
      .and("contain", "noindex");
    cy.visit("/");
    cy.get('footer a[href="/packages"]').click();
    cy.location("pathname").should("eq", "/packages");
    cy.contains("h2", "Exclusive Packages").should("exist");
  });
});
