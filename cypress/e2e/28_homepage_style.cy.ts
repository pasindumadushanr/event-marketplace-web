export {};

const labels = [
  "Discover and plan",
  "Explore categories",
  "Featured vendors",
  "Why choose Nakathata",
  "Featured packages",
  "Browse by location",
  "How it works",
];

describe("Wedding-themed homepage sections", () => {
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
          businessCount: 2,
          image: "/images/brand/favicon-96.png",
        },
      ],
    });
    cy.intercept("GET", "**/discovery/search*", {
      body: {
        data: [
          {
            id: "vendor-style",
            name: "Wedding Studio",
            isVerified: false,
            startingPrice: 10000,
            rating: 4,
            reviewCount: 2,
            city: "Colombo",
            category: { name: "Photographers" },
          },
        ],
        meta: { total: 1 },
      },
    });
    cy.intercept("GET", "**/discovery/packages*", {
      body: [
        {
          id: "package-style",
          name: "Wedding Photography",
          price: 10000,
          image: "/images/brand/favicon-96.png",
          business: {
            id: "vendor-style",
            name: "Wedding Studio",
            city: "Colombo",
            category: { name: "Photographers" },
          },
        },
      ],
    });
  });
  it("keeps category, vendor, package and location navigation intact", () => {
    cy.visit("/");
    cy.get(".home-wedding-section").should("have.length", 7);
    labels.forEach((label) => {
      cy.get(`section[aria-label="${label}"]`).within(() => {
        cy.get(".home-section-decoration")
          .should("have.attr", "aria-hidden", "true")
          .and("have.css", "pointer-events", "none");
      });
    });
    cy.get("#categories").within(() => {
      cy.get('a[href="/c/photographers"]').should("exist");
      cy.get('button[aria-label="Next categories"]').should("exist");
      cy.get('button[aria-label="Previous categories"]').should("exist");
    });
    cy.get(
      'section[aria-label="Featured vendors"] a[href="/business/vendor-style"]',
    ).should("exist");
    cy.get('#packages a[href="/business/vendor-style"]').should("exist");
    cy.get(
      'section[aria-label="Browse by location"] a[href="/search?city=Colombo"]',
    ).should("exist");
    cy.get(
      'section[aria-label="Browse by location"] a[href="/locations"]',
    ).should("exist");
    cy.get('section[aria-labelledby="vendor-invitation-title"] p').should(
      "have.length",
      1,
    );
  });
  it("uses compact feature and planning cards with readable trust information", () => {
    cy.visit("/");
    cy.get('section[aria-label="Why choose Nakathata"]').scrollIntoView({
      offset: { top: -90, left: 0 },
    });
    cy.get(".home-feature-card").should("have.length", 6);
    cy.contains(
      "Approval to publish is not identity or quality verification.",
    ).should("exist");
    cy.get('section[aria-label="How it works"]').scrollIntoView({
      offset: { top: -90, left: 0 },
    });
    cy.get(".home-step-card").should("have.length", 4);
    cy.get(".home-step-card").each(($card) =>
      cy.wrap($card).should("have.css", "opacity", "1"),
    );
    cy.get(".home-step-number").should("have.length", 4);
  });
  it("keeps every redesigned section within a small-screen width", () => {
    cy.viewport(390, 844);
    cy.visit("/");
    labels.forEach((label) => {
      cy.get(`section[aria-label="${label}"]`).then(($section) => {
        expect($section[0].scrollWidth, label).to.be.at.most(390);
      });
    });
    cy.get('section[aria-label="Why choose Nakathata"]').scrollIntoView({
      offset: { top: -85, left: 0 },
    });
  });
});
