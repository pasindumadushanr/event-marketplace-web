describe("Vendor dashboard loading recovery", () => {
  const business = {
    id: "vendor-test",
    name: "Sunrise Photography",
    status: "INACTIVE",
    profileSettings: {},
  };

  function visitDashboard() {
    cy.intercept("GET", "**/vendor/packages", { body: [] });
    cy.intercept("GET", "**/vendor/gallery", { body: [] });
    cy.visit("/vendor", {
      onBeforeLoad(win) {
        win.localStorage.setItem("accessToken", "local-test-only");
        win.localStorage.setItem(
          "user",
          JSON.stringify({
            id: "v1",
            firstName: "Test",
            lastName: "Vendor",
            roleName: "VENDOR",
          }),
        );
      },
    });
  }

  it("retries a failed business profile without changing approval or saved data", () => {
    cy.intercept("GET", "**/vendor/business/onboarding/status", {
      body: { vendorStatus: "APPROVED", emailVerified: true },
    });
    cy.intercept("GET", "**/vendor/business", { statusCode: 500, body: {} });
    visitDashboard();
    cy.contains("We couldn’t load your business profile").should("be.visible");
    cy.intercept("GET", "**/vendor/business", { body: business }).as(
      "profileRetry",
    );
    cy.contains('[role="alert"]', "We couldn’t load your business profile")
      .contains("button", "Try again").click();
    cy.wait("@profileRetry");
    cy.contains("Edit My Business Page").should("be.visible");
    cy.contains("Sunrise Photography").should("be.visible");
  });

  it("keeps a failed approval request blocked and retries it independently", () => {
    cy.intercept("GET", "**/vendor/business/onboarding/status", {
      statusCode: 500,
      body: {},
    });
    cy.intercept("GET", "**/vendor/business", { body: business });
    visitDashboard();
    cy.contains("We couldn’t check your business status").should("be.visible");
    cy.contains("Edit My Business Page").should("not.exist");
    cy.intercept("GET", "**/vendor/business/onboarding/status", {
      body: { vendorStatus: "UNDER_REVIEW", emailVerified: true },
    });
    cy.contains('[role="alert"]', "We couldn’t check your business status")
      .contains("button", "Try again").click();
    cy.contains("Edit My Business Page").should("be.visible");
  });
});
