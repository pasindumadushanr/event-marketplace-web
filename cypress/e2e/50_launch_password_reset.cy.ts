export {};
describe("Vendor launch password recovery acceptance", () => {
  it("requests a code, sets a new password and returns to vendor login", () => {
    cy.intercept("GET", "https://www.google.com/recaptcha/api.js*", {
      headers: { "content-type": "application/javascript" },
      body: "window.grecaptcha={ready:cb=>cb(),execute:()=>Promise.resolve('test-reset-token')};",
    });
    cy.intercept("POST", "**/auth/forgot-password", {
      body: { message: "If that account exists, a reset code was sent." },
    }).as("request");
    cy.intercept("POST", "**/auth/reset-password", {
      body: { message: "Password reset successfully" },
    }).as("reset");
    cy.visit("/forgot-password?from=vendor");
    cy.wait(1000);
    cy.get("#email").type("audit-vendor@example.test");
    cy.contains("button", "Send Recovery Code").click();
    cy.wait("@request");
    cy.get("#otp").type("123456");
    cy.get("#newPassword").type("LaunchTest-Password1!", { log: false });
    cy.get("#confirmPassword").type("LaunchTest-Password1!", { log: false });
    cy.contains("button", "Reset Password").click();
    cy.wait("@reset")
      .its("request.body")
      .should("include", { email: "audit-vendor@example.test", otp: "123456" });
    cy.location("pathname").should("eq", "/vendor/login");
  });
});
