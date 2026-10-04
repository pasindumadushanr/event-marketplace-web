const catalog = [
  {
    id: "cars",
    name: "Wedding Cars & Transport",
    slug: "wedding-cars-transport",
    parentId: null,
    status: "ACTIVE",
    businessCount: 3,
  },
  {
    id: "wedding-cars",
    name: "Wedding Cars",
    slug: "wedding-cars",
    parentId: "cars",
    status: "ACTIVE",
    businessCount: 3,
  },
  {
    id: "vintage",
    name: "Vintage & Classic Cars",
    slug: "vintage-classic-cars",
    parentId: "wedding-cars",
    status: "ACTIVE",
    businessCount: 3,
  },
  {
    id: "cakes",
    name: "Cakes, Pastries & Catering",
    slug: "cakes-pastries-catering",
    parentId: null,
    status: "ACTIVE",
    businessCount: 0,
  },
  {
    id: "wedding-cakes",
    name: "Wedding Cakes",
    slug: "wedding-cakes",
    parentId: "cakes",
    status: "ACTIVE",
    businessCount: 0,
  },
  {
    id: "structures",
    name: "Wedding Cake Structures",
    slug: "wedding-cake-structures",
    parentId: "wedding-cakes",
    status: "ACTIVE",
    businessCount: 0,
  },
];

describe("Three-level wedding categories", () => {
  beforeEach(() => {
    cy.intercept("GET", "**/business-categories", { body: catalog });
    cy.intercept("GET", "**/discovery/search*", {
      body: { data: [], meta: { total: 0, totalPages: 1 } },
    }).as("search");
  });
  it("browses main categories, subcategories, and specific services on phones", () => {
    cy.viewport(390, 844);
    cy.visit("/categories");
    cy.contains("h1", "Find your wedding team").should("be.visible");
    cy.contains("summary", "Wedding Cars").click();
    cy.contains("a", "Vintage & Classic Cars").click();
    cy.wait("@search")
      .its("request.url")
      .should("include", "categorySlug=vintage-classic-cars");
    cy.contains("h1", "Vintage & Classic Cars").should("be.visible");
    cy.get('nav[aria-label="Category breadcrumbs"]')
      .should("contain", "Wedding Cars & Transport")
      .and("contain", "Wedding Cars");
    cy.document().then((document) =>
      expect(document.documentElement.scrollWidth).to.be.at.most(390),
    );
  });
  it("filters by the selected service and clears descendants when the main category changes", () => {
    cy.visit("/search");
    cy.contains("label", "Main category").find("select").select("cars");
    cy.contains("label", "Subcategory").find("select").select("wedding-cars");
    cy.contains("label", "Specific service").find("select").select("vintage");
    cy.contains("button", "Apply Filters").click();
    cy.wait("@search");
    cy.wait("@search")
      .its("request.url")
      .should("include", "categoryId=vintage");
    cy.contains("label", "Main category").find("select").select("cakes");
    cy.contains("label", "Specific service").should("not.exist");
    cy.contains("label", "Subcategory").find("select").should("have.value", "");
    cy.contains("button", "Apply Filters").click();
    cy.wait("@search").its("request.url").should("include", "categoryId=cakes");
  });
  it("uses category filtering instead of searching vendor names on category landing pages", () => {
    cy.visit("/c/wedding-cars-transport");
    cy.wait("@search")
      .its("request.url")
      .should("include", "categorySlug=wedding-cars-transport")
      .and("not.include", "?q=");
    cy.contains("a", "Wedding Cars (3)").should("be.visible");
  });
  it("saves and reloads a vendor’s specific service category", () => {
    let profile = {
      id: "vendor-test",
      name: "Classic Wedding Cars",
      categoryId: "cars",
      status: "ACTIVE",
      profileSettings: {},
      description: "Cars for your wedding",
      category: catalog[0],
    };
    cy.intercept("GET", "**/vendor/business/onboarding/status", {
      body: { emailVerified: true, vendorStatus: "APPROVED" },
    });
    cy.intercept("GET", "**/vendor/business", (req) => {
      if (req.headers.authorization) req.reply({ body: profile });
      else req.continue();
    });
    cy.intercept("PATCH", "**/vendor/business", (req) => {
      expect(req.body.categoryId).to.equal("vintage");
      profile = { ...profile, ...req.body, category: catalog[2] };
      req.reply({ body: profile });
    }).as("saveCategory");
    cy.visit("/vendor/business/general", {
      onBeforeLoad(win) {
        win.localStorage.setItem("accessToken", "local-test-only");
        win.localStorage.setItem(
          "user",
          JSON.stringify({ id: "v1", roleName: "VENDOR", firstName: "Test" }),
        );
      },
    });
    cy.contains("label", "Main category")
      .find("select")
      .should("have.value", "cars");
    cy.contains("label", "Subcategory").find("select").select("wedding-cars");
    cy.contains("label", "Specific service").find("select").select("vintage");
    cy.contains("button", "Save Changes").click();
    cy.wait("@saveCategory");
    cy.reload();
    cy.contains("label", "Specific service")
      .find("select")
      .should("have.value", "vintage");
    cy.contains(
      "Selected: Wedding Cars & Transport → Wedding Cars → Vintage & Classic Cars",
    ).should("be.visible");
  });
});
