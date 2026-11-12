export {};
describe("Vendor Google sign-in", () => {
  beforeEach(() => {
    cy.intercept("GET", "**/auth/google/vendor-status", {
      body: { enabled: true },
    });
  });
  for (const route of ["/vendor/login", "/vendor/register"]) {
    it(`offers Google alongside email at ${route} with vendor intent`, () => {
      cy.viewport(390, 844);
      cy.intercept("GET", "**/auth/google?intent=vendor", {
        headers: { "content-type": "text/html" },
        body: "<html><body>Google redirect started</body></html>",
      }).as("google");
      cy.visit(route);
      cy.get("#email").should("exist");
      cy.get("#password").should("exist");
      cy.wait(1000);
      cy.contains("button", "Continue with Google")
        .should("be.enabled")
        .should("be.visible")
        .click();
      cy.wait("@google").its("request.query.intent").should("eq", "vendor");
    });
  }
  it("routes a Google vendor session into application guidance and removes tokens from the URL", () => {
    const access = `header.${btoa(JSON.stringify({ sub: "google-vendor", role: "VENDOR", email: "vendor@example.test", firstName: "Test" }))}.signature`;
    cy.intercept("GET", "**/vendor/business/onboarding/status", {
      body: { emailVerified: true, vendorStatus: "NOT_STARTED" },
    });
    cy.intercept("GET", "**/vendor/business", (req) =>
      req.headers.authorization
        ? req.reply({
            statusCode: 404,
            body: { message: "Complete onboarding" },
          })
        : req.continue(),
    );
    cy.visit(`/auth/callback#accessToken=${access}&refreshToken=test-refresh`);
    cy.location("pathname").should("eq", "/vendor");
    cy.contains("Submit Application").should("be.visible");
    cy.location("hash").should("eq", "");
    cy.window().then((win) =>
      expect(JSON.parse(win.localStorage.getItem("user")!).roleName).to.eq(
        "VENDOR",
      ),
    );
  });
  it("explains a cancelled or rejected Google sign-in without losing password login", () => {
    cy.visit("/vendor/login?googleError=1");
    cy.contains("Google sign-in did not complete.").should("be.visible");
    cy.get("#email").should("be.visible");
    cy.contains("Forgot password?").should("be.visible");
  });
  it("keeps email login available while the backend is not ready", () => {
    cy.intercept("GET", "**/auth/google/vendor-status", { statusCode: 404 });
    cy.visit("/vendor/login");
    cy.contains("Google sign-in is temporarily unavailable.").should(
      "be.visible",
    );
    cy.contains("button", "Continue with Google").should("be.disabled");
    cy.get("#password").should("be.enabled");
  });
});
