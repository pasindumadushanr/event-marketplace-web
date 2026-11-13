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
  cy.intercept("GET", "**/auth/vendor-trial", {
    body: {
      startsAt: "2026-11-13T00:00:00Z",
      endsAt: "2027-01-13T00:00:00Z",
      status: "ACTIVE",
    },
  });
  cy.intercept("GET", "**/vendor/business/onboarding/status", {
    body: { emailVerified: true, vendorStatus: "APPROVED" },
  });
  cy.intercept("GET", "**/vendor/business", { body: business });
  cy.intercept("GET", "**/vendor/packages", { body: [] });
  cy.intercept("GET", "**/vendor/gallery", { body: [] });
  cy.visit("/vendor", {
    onBeforeLoad(win) {
      win.localStorage.setItem("accessToken", "test-token");
      if (mode)
        win.localStorage.setItem("nakathata_vendor_dashboard_mode", mode);
      else win.localStorage.removeItem("nakathata_vendor_dashboard_mode");
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
  it("shows original signup dates and no automatic charges during the free period", () => {
    openDashboard();
    cy.get('[aria-label="Your free vendor period"]').within(() => {
      cy.contains("Free access until 13 Jan 2027").should("be.visible");
      cy.contains("13 Nov 2026").should("be.visible");
      cy.contains("No automatic charges").should("be.visible");
    });
  });

  it("keeps an expired vendor live and directs them to support without payment or visibility writes", () => {
    openDashboard();
    let writes = 0;
    cy.intercept(
      { method: "+(POST|PATCH|DELETE)", url: "**/vendor/**" },
      () => {
        writes++;
      },
    );
    cy.intercept("GET", "**/auth/vendor-trial", {
      body: {
        startsAt: "2026-01-01T00:00:00Z",
        endsAt: "2026-03-01T00:00:00Z",
        status: "EXPIRED",
      },
    });
    cy.intercept("GET", "**/vendor/business", {
      body: { ...business, status: "ACTIVE" },
    });
    cy.reload();
    cy.get('[aria-label="Your free vendor period"]').within(() => {
      cy.contains("Your free period has ended").should("be.visible");
      cy.contains("Your page will not be hidden").should("be.visible");
      cy.contains("a", "Contact our team").should(
        "have.attr",
        "href",
        "/vendor/support",
      );
    });
    cy.contains("Visible to customers").should("be.visible");
    cy.then(() => expect(writes).to.equal(0));
  });

  it("can recover from unavailable free-period dates without blocking the dashboard", () => {
    openDashboard();
    cy.intercept("GET", "**/auth/vendor-trial", { statusCode: 503 });
    cy.reload();
    cy.contains(
      '[role="status"]',
      "We couldn’t load your free-period dates",
    ).as("trialError");
    cy.get('[data-testid="vendor-dashboard-v3"]').should("be.visible");
    cy.intercept("GET", "**/auth/vendor-trial", {
      body: {
        startsAt: "2026-11-13T00:00:00Z",
        endsAt: "2027-01-13T00:00:00Z",
        status: "ACTIVE",
      },
    });
    cy.get("@trialError").contains("button", "Try again").click();
    cy.contains("Free access until 13 Jan 2027").should("be.visible");
  });

  it("reminds an incomplete live vendor without hiding the page", () => {
    openDashboard();
    cy.intercept("GET", "**/vendor/business", {
      body: { ...business, status: "ACTIVE", address: "", logo: "" },
    });
    cy.reload();
    cy.get('[aria-label="Complete your business details"]').within(() => {
      cy.contains("Your page is still live").should("be.visible");
      cy.contains("a", "Business address").should(
        "have.attr",
        "href",
        "/vendor/business/location",
      );
      cy.contains("a", "Business logo").should("be.visible");
    });
    cy.contains("Visible to customers").should("be.visible");
    cy.contains("button", "Hide my page").should("be.enabled");
  });

  it("shows three simple tasks, keeps advanced options closed, and remembers the choice", () => {
    openDashboard("v1");
    cy.contains("button", "Easy setup").click();
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
    cy.contains("button", "Easy setup").should(
      "have.attr",
      "aria-pressed",
      "true",
    );
    cy.contains("button", "Simple (V2)").should("not.exist");
    cy.contains("button", "Full dashboard").click();
    cy.reload();
    cy.contains("button", "Full dashboard").should(
      "have.attr",
      "aria-pressed",
      "true",
    );
  });

  for (const savedMode of ["", "v2"]) {
    it(`opens easy setup for ${savedMode || "new"} preferences`, () => {
      openDashboard(savedMode);
      cy.get('[data-testid="vendor-dashboard-v3"]').should("be.visible");
      cy.contains("button", "Easy setup").should(
        "have.attr",
        "aria-pressed",
        "true",
      );
      cy.contains("button", "Simple (V2)").should("not.exist");
    });
  }

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
