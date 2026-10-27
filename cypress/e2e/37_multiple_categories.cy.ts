import { DEFAULT_PLATFORM } from "../../src/lib/platform-settings";

const categories = [
  {
    id: "photo",
    name: "Photography",
    slug: "photography",
    status: "ACTIVE",
    parentId: null,
  },
  {
    id: "video",
    name: "Videography",
    slug: "videography",
    status: "ACTIVE",
    parentId: null,
  },
];
const original = {
  id: "vendor-test",
  name: "Sunrise Photo & Film",
  categoryId: "photo",
  category: categories[0],
  categoryIds: ["photo"],
  categories: [categories[0]],
  description: "Wedding photography and films",
  status: "ACTIVE",
  vendorStatus: "APPROVED",
  phone: "0771234567",
  email: "studio@example.com",
  address: "Colombo",
  city: "Colombo",
  logo: "/images/brand/nakathata-logo.jpg",
  coverImage: "/images/brand/nakathata-logo.jpg",
  profileSettings: { policies: { bookingPolicy: "Contact us first" } },
  packages: [],
  galleries: [],
  reviews: [],
};
function auth(win: Window) {
  win.localStorage.setItem("accessToken", "test-only");
  win.localStorage.setItem(
    "user",
    JSON.stringify({ id: "v1", firstName: "Test", roleName: "VENDOR" }),
  );
}
describe("Multiple categories for one vendor", () => {
  beforeEach(() => {
    cy.intercept("GET", "**/admin/cms/public/platform-settings", {
      body: { ...DEFAULT_PLATFORM, analytics: { googleAnalyticsId: "" } },
    });
    cy.intercept("GET", "**/admin/cms/public/settings/*", { body: {} });
    cy.intercept("GET", "**/business-categories", { body: categories });
    cy.intercept("GET", "**/vendor/business/onboarding/status", {
      body: { vendorStatus: "APPROVED", emailVerified: true },
    });
  });
  it("keeps the existing main category, saves another, reloads and removes it", () => {
    let saved: any = structuredClone(original);
    cy.intercept("GET", "**/vendor/business", (req) =>
      req.headers.authorization ? req.reply({ body: saved }) : req.continue(),
    );
    cy.intercept("PATCH", "**/vendor/business", (req) => {
      expect(req.body).not.to.have.property("categoryIds");
      expect(req.body.categoryId).to.equal("photo");
      expect(req.body.profileSettings.categoryIds).to.include("photo");
      saved = {
        ...saved,
        ...req.body,
        categoryIds: req.body.profileSettings.categoryIds,
        profileSettings: {
          ...saved.profileSettings,
          ...req.body.profileSettings,
        },
        categories: categories.filter((c) =>
          req.body.profileSettings.categoryIds.includes(c.id),
        ),
      };
      req.reply({ body: saved });
    }).as("saveCategories");
    cy.visit("/vendor/business/general", { onBeforeLoad: auth });
    cy.get('[data-testid="business-category-selector"] select')
      .first()
      .should("have.value", "photo");
    cy.contains('label:has(input[type="checkbox"])', "Videography")
      .find('input[type="checkbox"]')
      .check();
    cy.contains("button", "Save Changes").click();
    cy.wait("@saveCategories")
      .its("request.body.profileSettings.categoryIds")
      .should("deep.equal", ["photo", "video"]);
    cy.reload();
    cy.contains('label:has(input[type="checkbox"])', "Videography")
      .find('input[type="checkbox"]')
      .should("be.checked");
    cy.viewport(390, 844);
    cy.get('[data-testid="business-category-selector"]').scrollIntoView();
    cy.document().then((doc) =>
      expect(doc.documentElement.scrollWidth).to.be.at.most(390),
    );
    cy.screenshot("multiple-categories-mobile", { capture: "viewport" });
    cy.contains('label:has(input[type="checkbox"])', "Videography")
      .find('input[type="checkbox"]')
      .uncheck();
    cy.contains("button", "Save Changes").click();
    cy.wait("@saveCategories")
      .its("request.body.profileSettings.categoryIds")
      .should("deep.equal", ["photo"]);
    cy.then(() =>
      expect(saved.profileSettings.policies.bookingPolicy).to.equal(
        "Contact us first",
      ),
    );
  });
  it("keeps selected categories when saving fails", () => {
    cy.intercept("GET", "**/vendor/business", (req) =>
      req.headers.authorization
        ? req.reply({ body: original })
        : req.continue(),
    );
    cy.intercept("PATCH", "**/vendor/business", {
      statusCode: 500,
      body: { message: "Please try again" },
    });
    cy.visit("/vendor/business/general", { onBeforeLoad: auth });
    cy.contains('label:has(input[type="checkbox"])', "Videography")
      .find('input[type="checkbox"]')
      .check();
    cy.contains("button", "Save Changes").click();
    cy.contains("Please try again").should("be.visible");
    cy.contains('label:has(input[type="checkbox"])', "Videography")
      .find('input[type="checkbox"]')
      .should("be.checked");
  });
  it("submits multiple categories in new vendor onboarding", () => {
    cy.intercept("GET", "**/vendor/business", (req) =>
      req.headers.authorization
        ? req.reply({ statusCode: 404 })
        : req.continue(),
    );
    cy.intercept("GET", "**/vendor/business/onboarding/status", {
      body: { vendorStatus: "NOT_STARTED", emailVerified: true },
    });
    cy.intercept("POST", "**/vendor/business/onboarding/wizard", (req) => {
      expect(req.body.categoryId).to.equal("photo");
      expect(req.body.profileSettings.categoryIds).to.deep.equal([
        "photo",
        "video",
      ]);
      req.reply({ body: { id: "new-vendor" } });
    }).as("application");
    cy.visit("/vendor/onboarding", { onBeforeLoad: auth });
    cy.get('input[name="name"]').type("New Wedding Studio");
    cy.get('input[name="email"]').type("new@example.com");
    cy.get('input[name="phone"]').type("0771234567");
    cy.contains("button", "Next").click();
    cy.get('[data-testid="business-category-selector"] select')
      .first()
      .select("photo");
    cy.contains('label:has(input[type="checkbox"])', "Videography")
      .find('input[type="checkbox"]')
      .check();
    for (let step = 0; step < 3; step++) cy.contains("button", "Next").click();
    cy.contains("button", "Submit Application").click();
    cy.wait("@application");
  });
  it("displays both services on one business profile", () => {
    cy.intercept("GET", "**/discovery/vendors/vendor-test", {
      body: { ...original, categoryIds: ["photo", "video"], categories },
    });
    cy.visit("/business/vendor-test");
    cy.get('[aria-label="Business categories"]')
      .should("contain.text", "Photography")
      .and("contain.text", "Videography");
    cy.get("h1").should("have.length", 1).and("contain.text", original.name);
  });
  it("shows one result with both service labels under either category", () => {
    cy.intercept("GET", "**/discovery/search*", (req) => {
      expect(["photo", "video"]).to.include(
        new URL(req.url).searchParams.get("categoryId"),
      );
      req.reply({
        body: {
          data: [
            {
              ...original,
              categories,
              startingPrice: 0,
              rating: 0,
              reviewCount: 0,
              isVerified: false,
            },
          ],
          meta: { total: 1, page: 1, totalPages: 1 },
        },
      });
    });
    for (const id of ["photo", "video"]) {
      cy.visit(`/search?categoryId=${id}`);
      cy.contains("h3", original.name).should("have.length", 1);
      cy.contains("Photography · Videography").should("be.visible");
    }
  });
});
