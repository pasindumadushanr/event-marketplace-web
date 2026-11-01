export {};
const business = {
  id: "vendor-test",
  name: "Test Studio",
  vendorStatus: "APPROVED",
  status: "INACTIVE",
  email: "owner@example.com",
  phone: "0771234567",
  description: "Our wedding photography business",
  city: "Colombo",
  category: { id: "photo", name: "Photography" },
  profileSettings: {},
};
function vendor(path: string, withBusiness = true) {
  cy.intercept("GET", "**/vendor/business/onboarding/status", {
    body: {
      emailVerified: true,
      vendorStatus: withBusiness ? "APPROVED" : "NOT_STARTED",
    },
  });
  cy.intercept(
    "GET",
    "**/vendor/business",
    withBusiness
      ? { body: business }
      : { statusCode: 404, body: { message: "Complete onboarding" } },
  );
  cy.intercept("GET", "**/vendor/gallery", { body: [] });
  cy.intercept("GET", "**/vendor/packages", { body: [] });
  cy.visit(path, {
    onBeforeLoad(win) {
      win.localStorage.setItem("accessToken", "old-access");
      win.localStorage.setItem("refreshToken", "old-refresh");
      win.localStorage.setItem(
        "user",
        JSON.stringify({
          id: "vendor-test",
          firstName: "Test",
          lastName: "Vendor",
          email: "owner@example.com",
          roleName: "VENDOR",
        }),
      );
    },
  });
}
describe("Vendor launch fixes", () => {
  it("offers vendor recovery and returns to vendor sign-in", () => {
    cy.visit("/vendor/login");
    cy.contains("a", "Forgot password?").click();
    cy.location("search").should("eq", "?from=vendor");
    cy.contains("a", "Back to Sign In").should(
      "have.attr",
      "href",
      "/vendor/login",
    );
  });
  it("pauses sensitive uploads and explains direct payments", () => {
    vendor("/vendor/documents");
    cy.contains("Document uploads are temporarily paused").should("be.visible");
    cy.get('input[type="file"]').should("not.exist");
    cy.visit("/vendor/revenue");
    cy.contains("Payments are arranged directly").should("be.visible");
    cy.contains("Pending Payouts").should("not.exist");
    cy.visit("/vendor/business/content");
    cy.contains("Custom sections are not available yet").should("be.visible");
  });
  it("loads saved notifications, persists direct read status and recovers from failures", () => {
    let read = false;
    cy.intercept("GET", "**/notifications/me", (req) =>
      req.reply({
        body: [
          {
            id: "direct",
            title: "Account update",
            message: "Your business details were reviewed.",
            userId: "vendor-test",
            isRead: read,
            createdAt: "2026-11-01T10:00:00Z",
          },
          {
            id: "broadcast",
            title: "Announcement",
            message: "Welcome to launch.",
            userId: null,
            isRead: false,
            createdAt: "2026-11-01T10:00:00Z",
          },
        ],
      }),
    );
    cy.intercept("PATCH", "**/notifications/direct/read", (req) => {
      read = true;
      req.reply({ body: { isRead: true } });
    }).as("read");
    vendor("/vendor/notifications");
    cy.contains("article", "Account update")
      .contains("button", "Mark as read")
      .click();
    cy.wait("@read");
    cy.reload();
    cy.contains("article", "Account update")
      .contains("Read")
      .should("be.visible");
    cy.contains("article", "Announcement").find("button").should("not.exist");
    cy.intercept("GET", "**/notifications/me", { statusCode: 503 });
    cy.reload();
    cy.contains('[role="alert"]', "Could not load notifications").should(
      "be.visible",
    );
    cy.contains("No notifications yet.").should("not.exist");
    cy.intercept("GET", "**/notifications/me", { body: [] });
    cy.contains("button", "Try again").click();
    cy.contains("No notifications yet.").should("be.visible");
  });
  it("keeps the onboarding draft after a reload for the same account", () => {
    vendor("/vendor/onboarding", false);
    cy.get('input[name="name"]').type("Recovered Studio");
    cy.reload();
    cy.get('input[name="name"]').should("have.value", "Recovered Studio");
  });
  it("reports a verification delivery failure and supports retry", () => {
    cy.intercept("GET", "**/vendor/business/onboarding/status", {
      body: { emailVerified: false, vendorStatus: "NOT_STARTED" },
    });
    cy.intercept("POST", "**/auth/send-verification-otp", {
      statusCode: 503,
      body: {
        message:
          "We could not send your verification email. Please try again shortly.",
      },
    }).as("send");
    cy.visit("/vendor/verify-email", {
      onBeforeLoad(win) {
        win.localStorage.setItem("accessToken", "test");
        win.localStorage.setItem(
          "user",
          JSON.stringify({ id: "v", roleName: "VENDOR" }),
        );
      },
    });
    cy.wait("@send");
    cy.contains("We could not send your verification email.").should(
      "be.visible",
    );
    cy.intercept("POST", "**/auth/send-verification-otp", {
      body: { message: "Accepted for delivery" },
    }).as("retry");
    cy.contains("button", "Resend Code").click();
    cy.wait("@retry");
    cy.contains("button", "Resend Code").should("be.disabled");
  });
  it("requires password proof for an email change and signs out afterward", () => {
    cy.intercept("PATCH", "**/users/me", (req) => {
      expect(req.body).to.include({
        email: "new@example.com",
        currentPassword: "example-password",
      });
      req.reply({ body: { email: "new@example.com", emailVerified: false } });
    }).as("email");
    cy.intercept("POST", "**/auth/logout", { body: { message: "Signed out" } });
    vendor("/vendor/settings");
    cy.get('input[name="email"]').clear().type("new@example.com");
    cy.get("#email-change-password").type("example-password");
    cy.contains("button", "Save Changes").click();
    cy.wait("@email");
    cy.location("pathname").should("eq", "/vendor/login");
    cy.window().then((win) =>
      expect(win.localStorage.getItem("accessToken")).to.equal(null),
    );
  });
  it("renews an expired access token and retries the protected request", () => {
    cy.intercept("GET", "**/bookings/vendor", (req) =>
      req.headers.authorization === "Bearer new-access"
        ? req.reply({ body: [] })
        : req.reply({ statusCode: 401 }),
    ).as("bookings");
    cy.intercept("POST", "**/auth/refresh", (req) => {
      expect(req.body.refreshToken).to.equal("old-refresh");
      req.reply({
        body: { accessToken: "new-access", refreshToken: "new-refresh" },
      });
    }).as("refresh");
    vendor("/vendor/bookings");
    cy.wait("@refresh");
    cy.window().then((win) =>
      expect(win.localStorage.getItem("accessToken")).to.equal("new-access"),
    );
    cy.location("pathname").should("eq", "/vendor/bookings");
    cy.contains("No booking requests yet").should("exist");
  });
  it("does not restore a revoked session when refresh is refused", () => {
    cy.intercept("GET", "**/bookings/vendor", { statusCode: 401 });
    cy.intercept("POST", "**/auth/refresh", { statusCode: 401 }).as(
      "refreshDenied",
    );
    vendor("/vendor/bookings");
    cy.wait("@refreshDenied");
    cy.location("pathname").should("eq", "/vendor/login");
    cy.window().then((win) => {
      expect(win.localStorage.getItem("accessToken")).to.equal(null);
      expect(win.localStorage.getItem("refreshToken")).to.equal(null);
    });
  });
});
