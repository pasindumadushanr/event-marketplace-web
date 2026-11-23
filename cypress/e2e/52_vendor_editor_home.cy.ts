export {};

const savedBusiness = {
  id: "vendor-test",
  name: "Sunrise Photography",
  categoryId: "photo",
  category: { id: "photo", name: "Photography" },
  vendorStatus: "APPROVED",
  status: "INACTIVE",
  description: "Wedding photography in Colombo",
  phone: "0771234567",
  email: "test@example.com",
  city: "Colombo",
  address: "10 Main Street",
  logo: "/images/brand/nakathata-logo.jpg",
  coverImage: "/images/brand/nakathata-logo.jpg",
  profileSettings: { policies: { bookingPolicy: "Contact us first" } },
};
function visitHome(status = "APPROVED", mode = "v1") {
  cy.intercept("GET", "**/vendor/business/onboarding/status", {
    body: { emailVerified: true, vendorStatus: status },
  });
  cy.intercept("GET", "**/vendor/business", { body: { ...savedBusiness, vendorStatus: status } }).as(
    "business",
  );
  cy.intercept("GET", "**/vendor/packages", { body: [] }).as("packages");
  cy.intercept("GET", "**/vendor/gallery", { body: [] });
  cy.visit("/vendor", {
    onBeforeLoad(win) {
      win.localStorage.setItem("accessToken", "local-test-only");
      win.localStorage.setItem("nakathata_vendor_dashboard_mode", mode);
      win.localStorage.setItem(
        "user",
        JSON.stringify({
          id: "vendor-test",
          firstName: "Test",
          roleName: "VENDOR",
        }),
      );
    },
  });
}
describe("Visual business editor as vendor home", () => {
  it("opens the editor even for an existing full-dashboard preference", () => {
    visitHome();
    cy.contains("h1", "Edit My Business Page").should("be.visible");
    cy.get('[aria-label="Edit Name, logo & cover"]').should("be.visible");
    cy.contains("button", "Easy setup").should("not.exist");
    cy.contains("button", "Full dashboard").should("not.exist");
    cy.contains(
      "Your page is hidden. Saving edits does not publish it.",
    ).should("be.visible");
    cy.get('nav[aria-label="Vendor navigation"] a[href="/vendor"]').should(
      "have.attr",
      "aria-current",
      "page",
    );
    cy.get('a[href="/vendor/dashboard"]').should(
      "contain.text",
      "Dashboard & tools",
    );
  });
  it("saves section edits from the home page without changing visibility", () => {
    visitHome();
    cy.intercept("PATCH", "**/vendor/business", (req) => {
      expect(req.body).not.to.have.property("status");
      expect(req.body).not.to.have.property("vendorStatus");
      req.reply({ body: { ...savedBusiness, ...req.body } });
    }).as("save");
    cy.get('[aria-label="Edit Name, logo & cover"]').click();
    cy.contains("label", "Business name")
      .find("input")
      .clear()
      .type("Sunrise Wedding Studio");
    cy.contains("button", "Save changes").click();
    cy.wait("@save");
    cy.get('[data-profile-section="hero"]').should(
      "contain.text",
      "Sunrise Wedding Studio",
    );
  });
  it("keeps the previous dashboard available in the menu", () => {
    visitHome();
    cy.get('a[href="/vendor/dashboard"]').click();
    cy.location("pathname").should("eq", "/vendor/dashboard");
    cy.contains("button", "Easy setup").should("be.visible");
    cy.contains("button", "Full dashboard").should("be.visible");
  });
  for (const status of ["PENDING", "UNDER_REVIEW", "NEEDS_INFO", "REJECTED"])
    it(`lets ${status} vendors edit a private profile`, () => {
      visitHome(status);
      cy.get('[aria-label="Edit Name, logo & cover"]').should("be.visible");
      cy.get(
        'nav[aria-label="Vendor navigation"] a[href="/vendor/dashboard"]',
      ).should("exist");
    });
  it("sends a finished draft for review without publishing it", () => {
    visitHome("PENDING");
    cy.intercept("PATCH", "**/vendor/business", (req) => {
      Object.assign(savedBusiness.profileSettings, req.body.profileSettings);
      req.reply({ body: savedBusiness });
    });
    cy.intercept("POST", "**/vendor/business/profile-review", {
      body: { vendorStatus: "UNDER_REVIEW", reviewStale: false },
    }).as("submitReview");
    cy.intercept("PATCH", "**/vendor/business/publish", () => {
      throw new Error("Draft must not be published");
    });
    cy.contains("button", "View as customer").click();
    cy.contains("button", "I’ve checked my page").click();
    cy.contains("Preview checked.").should("be.visible");
    cy.contains("a", "Prepare for review").click();
    cy.contains("button", "Submit for review").click();
    cy.wait("@submitReview");
    cy.contains("Your profile is under review").should("be.visible");
    cy.contains("button", "Publish my page").should("not.exist");
  });
  it("shows a status error rather than opening the editor on a failed status check", () => {
    visitHome();
    cy.intercept("GET", "**/vendor/business/onboarding/status", {
      statusCode: 503,
      body: {},
    });
    cy.reload();
    cy.contains("We couldn’t check your business status").should("be.visible");
    cy.get('[aria-label="Edit Name, logo & cover"]').should("not.exist");
  });
  it("opens the editor and navigation on a narrow mobile screen", () => {
    cy.viewport(375, 812);
    visitHome();
    cy.contains("h1", "Edit My Business Page").should("be.visible");
    cy.get('[aria-label="Open navigation"]').click();
    cy.get(
      'nav[aria-label="Vendor navigation"] a[href="/vendor/dashboard"]',
    ).should("be.visible");
    cy.get('[aria-label="Close navigation"]').click();
    cy.document().then((doc) =>
      expect(doc.documentElement.scrollWidth).to.be.at.most(375),
    );
  });
});
