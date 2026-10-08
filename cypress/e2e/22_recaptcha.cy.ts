describe("reCAPTCHA protected forms", () => {
  function googleScript(fail = false) {
    cy.intercept("GET", "https://www.google.com/recaptcha/api.js*", {
      headers: { "content-type": "application/javascript" },
      body: `window.grecaptcha = {
        ready: function(cb) { cb(); },
        execute: function(key, options) {
          return ${fail ? 'Promise.reject(new Error("blocked"))' : 'Promise.resolve("test-token-" + options.action)'};
        }
      };`,
    }).as("googleScript");
  }
  function fillContact() {
    cy.get("#name").type("Test Customer");
    cy.get("#email").type("test@example.com");
    cy.get("#subject").type("Wedding inquiry");
    cy.get("#message").type("Please help with my wedding planning.");
  }
  it("generates a fresh contact token for each retry and preserves form data on rejection", () => {
    googleScript();
    let count = 0;
    cy.intercept("POST", "**/contact", (req) => {
      expect(req.headers["x-recaptcha-token"]).to.eq("test-token-contact");
      expect(req.body).not.to.have.property("recaptchaToken");
      count++;
      req.reply(
        count === 1
          ? {
              statusCode: 403,
              body: {
                message:
                  "Security verification failed. Please refresh and retry.",
              },
            }
          : { body: { success: true } },
      );
    }).as("contact");
    cy.visit("/contact");
    fillContact();
    cy.contains("button", "Send Message").click();
    cy.wait("@contact");
    cy.contains("Security verification failed.").should("be.visible");
    cy.get("#message").should(
      "have.value",
      "Please help with my wedding planning.",
    );
    cy.contains("button", "Send Message").click();
    cy.wait("@contact");
    cy.contains("Your message has been sent successfully!").should(
      "be.visible",
    );
  });
  it("does not submit when Google token generation fails", () => {
    googleScript(true);
    const request = cy.stub().as("unexpectedRequest");
    cy.intercept("POST", "**/contact", request);
    cy.visit("/contact");
    fillContact();
    cy.contains("button", "Send Message").click();
    cy.contains("Security verification could not complete.").should(
      "be.visible",
    );
    cy.get("@unexpectedRequest").should("not.have.been.called");
    cy.contains("button", "Send Message").should("be.enabled");
  });
  it("uses the distinct password recovery action", () => {
    googleScript();
    cy.intercept("POST", "**/auth/forgot-password", (req) => {
      expect(req.headers["x-recaptcha-token"]).to.eq(
        "test-token-forgot_password",
      );
      req.reply({ body: { success: true } });
    }).as("recovery");
    cy.visit("/forgot-password");
    cy.get("#email").type("test@example.com");
    cy.get("form").submit();
    cy.wait("@recovery");
    cy.contains("Reset code sent!").should("be.visible");
  });
  it("protects vendor registration and handles backend rejection", () => {
    googleScript();
    cy.intercept("POST", "**/auth/register", (req) => {
      expect(req.headers["x-recaptcha-token"]).to.eq("test-token-register");
      expect(req.body.role).to.eq("VENDOR");
      req.reply({
        statusCode: 403,
        body: { message: "Security verification failed. Try again." },
      });
    }).as("registration");
    cy.visit("/vendor/register");
    cy.get("#firstName").type("Test");
    cy.get("#lastName").type("Vendor");
    cy.get("#email").type("vendor@example.com");
    cy.get("#phone").type("0771234567");
    cy.get("#password").type("TestPassword123");
    cy.get("form").submit();
    cy.wait("@registration");
    cy.contains("Security verification failed.").should("be.visible");
  });
  it("shows a configuration error without sending a signup request", () => {
    cy.intercept("GET", "https://www.google.com/recaptcha/api.js*", {
      headers: { "content-type": "application/javascript" },
      body: `window.grecaptcha = { ready: function(cb) { cb(); }, execute: function() { throw new Error("Invalid site key or not loaded in api.js"); } };`,
    });
    const request = cy.stub().as("unexpectedSignup");
    cy.intercept("POST", "**/auth/register", request);
    cy.visit("/vendor/register");
    cy.get("#firstName").type("Test");
    cy.get("#lastName").type("Vendor");
    cy.get("#email").type("vendor@example.com");
    cy.get("#phone").type("0771234567");
    cy.get("#password").type("TestPassword123");
    cy.get("form").submit();
    cy.contains("Security verification is not configured correctly.").should(
      "be.visible",
    );
    cy.get("@unexpectedSignup").should("not.have.been.called");
    cy.get("#email").should("have.value", "vendor@example.com");
    cy.contains("button", "Continue to Onboarding").should("be.enabled");
  });
  it("recovers a blocked primary script without duplicating the form request", () => {
    cy.intercept("GET", "https://www.google.com/recaptcha/api.js*", {
      forceNetworkError: true,
    });
    cy.intercept("GET", "https://www.recaptcha.net/recaptcha/api.js*", {
      headers: { "content-type": "application/javascript" },
      body: `window.grecaptcha = { ready: function(cb) { cb(); }, execute: function(key, options) { return Promise.resolve("fallback-" + options.action); } };`,
    }).as("fallbackScript");
    let requests = 0;
    cy.intercept("POST", "**/contact", (req) => {
      requests++;
      expect(req.headers["x-recaptcha-token"]).to.eq("fallback-contact");
      req.reply({ body: { success: true } });
    }).as("contact");
    cy.visit("/contact");
    fillContact();
    cy.contains("button", "Send Message").click();
    cy.wait("@fallbackScript");
    cy.wait("@contact");
    cy.contains("Your message has been sent successfully!")
      .should("be.visible")
      .then(() => expect(requests).to.eq(1));
  });
});
