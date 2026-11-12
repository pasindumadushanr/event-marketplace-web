export {};

const business = {
  id: "vendor-test",
  name: "Sunrise Photography",
  status: "INACTIVE",
  description: "Wedding photography",
  phone: "0771234567",
  email: "test@example.com",
  address: "10 Main Street",
  city: "Colombo",
  logo: "/logo.png",
  coverImage: "/cover.png",
  profileSettings: { policies: { bookingPolicy: "Contact us to book" } },
};

function openDashboard(mode = "v3") {
  cy.intercept("GET", "**/vendor/business/onboarding/status", {
    body: { emailVerified: true, vendorStatus: "APPROVED" },
  });
  cy.intercept("GET", "**/vendor/business", { body: business });
  cy.intercept("GET", "**/vendor/packages", { body: [] });
  cy.intercept("GET", "**/vendor/gallery", { body: [] });
  cy.visit("/vendor", {
    onBeforeLoad(win) {
      win.localStorage.setItem("accessToken", "test-token");
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

describe("Easy vendor dashboard V3", () => {
  it("shows three simple tasks, keeps advanced options closed, and remembers the choice", () => {
    openDashboard("v1");
    cy.contains("button", "Easy (V3)").click();
    cy.get('[data-testid="vendor-dashboard-v3"]').should("be.visible");
    cy.contains("1. About your business").should("be.visible");
    cy.contains("2. Show your work").should("be.visible");
    cy.contains("3. Show your page to customers").should("be.visible");
    cy.contains("summary", "More options")
      .parent()
      .should("not.have.attr", "open");
    cy.contains("a", "WhatsApp & social links").should(
      "have.attr",
      "href",
      "/vendor/business/contact",
    );
    cy.reload();
    cy.contains("button", "Easy (V3)").should(
      "have.attr",
      "aria-pressed",
      "true",
    );
    cy.contains("button", "Simple (V2)").should("exist");
    cy.contains("button", "Detailed (V1)").should("exist");
  });

  it("requires review before publishing, without requiring a paid package", () => {
    openDashboard();
    cy.contains("Review your saved page as a customer").should("be.visible");
    cy.contains("button", "Publish my page").should("be.disabled");
    cy.contains("a", "Add services & prices (optional)").should("be.visible");
  });

  it("shows honest load errors and can retry", () => {
    openDashboard();
    cy.intercept("GET", "**/vendor/packages", { statusCode: 503 });
    cy.reload();
    cy.contains(
      '[role="alert"]',
      "We couldn’t check your saved details",
    ).should("be.visible");
    cy.contains("button", "Publish my page").should("be.disabled");
    cy.intercept("GET", "**/vendor/packages", { body: [] });
    cy.contains("button", "Try again").click();
    cy.contains("Review your saved page as a customer").should("be.visible");
  });

  it("fits a narrow mobile screen", () => {
    cy.viewport(360, 800);
    openDashboard();
    cy.get('[data-testid="vendor-dashboard-v3"]').should("be.visible");
    cy.contains("Review your saved page as a customer").should("be.visible");
    cy.document().then((doc) => {
      expect(doc.documentElement.scrollWidth).to.be.at.most(
        doc.documentElement.clientWidth + 1,
      );
    });
    cy.screenshot("vendor-dashboard-v3-mobile", { capture: "viewport" });
  });
});
