export {};
function auth(win: Window, role = "SUPER_ADMIN") {
  win.localStorage.setItem("accessToken", "test-only");
  win.localStorage.setItem("refreshToken", "test-refresh");
  win.localStorage.setItem(
    "user",
    JSON.stringify({ id: "a1", firstName: "Test", roleName: role }),
  );
}
describe("Admin history and revoked sessions", () => {
  it("shows safe history entries and paginates on phones", () => {
    cy.viewport(390, 844);
    cy.intercept("GET", "**/admin/activity?*", (req) => {
      const page = Number(req.query.page);
      req.reply({
        body: {
          total: 26,
          page,
          pageSize: 25,
          items: [
            {
              id: `log-${page}`,
              actorName: "Review Admin",
              actorId: "a1",
              action: page === 1 ? "APPLICATION_APPROVED" : "SETTING_CHANGED",
              targetType: "BUSINESS",
              targetId: "vendor-id",
              summary:
                page === 1
                  ? "Vendor application approved"
                  : "Platform setting email updated (values redacted)",
              createdAt: "2026-10-06T12:00:00Z",
            },
          ],
        },
      });
    }).as("history");
    cy.visit("/admin/activity", { onBeforeLoad: (win) => auth(win) });
    cy.wait("@history");
    cy.contains("h1", "Admin activity history").should("be.visible");
    cy.contains("Vendor application approved").should("be.visible");
    cy.contains("Sri Lanka time").should("be.visible");
    cy.contains("button", "Next").click();
    cy.wait("@history");
    cy.contains("values redacted").should("be.visible");
    cy.contains("button", "Next").should("be.disabled");
    cy.contains("button", "Previous").click();
    cy.wait("@history");
    cy.document().then((doc) =>
      expect(doc.documentElement.scrollWidth).to.be.at.most(390),
    );
  });
  it("recovers from history loading failures", () => {
    let count = 0;
    cy.intercept("GET", "**/admin/activity?*", (req) => {
      if (++count === 1) req.reply({ statusCode: 503 });
      else req.reply({ body: { total: 0, page: 1, pageSize: 25, items: [] } });
    });
    cy.visit("/admin/activity", { onBeforeLoad: (win) => auth(win) });
    cy.contains("button", "Try again").click();
    cy.contains("No activity recorded yet.").should("be.visible");
  });
  it("keeps ordinary users out of the admin workspace", () => {
    cy.visit("/admin/activity", {
      onBeforeLoad: (win) => auth(win, "CUSTOMER"),
    });
    cy.location("pathname").should("eq", "/admin/login");
    cy.contains("h1", "Admin activity history").should("not.exist");
  });
  it("clears a revoked session and returns administrators to sign-in", () => {
    cy.intercept("GET", "**/admin/activity?*", { statusCode: 401 });
    cy.visit("/admin/activity", { onBeforeLoad: (win) => auth(win) });
    cy.location("pathname").should("eq", "/admin/login");
    cy.window().then((win) => {
      expect(win.localStorage.getItem("accessToken")).to.be.null;
      expect(win.localStorage.getItem("refreshToken")).to.be.null;
      expect(win.localStorage.getItem("user")).to.be.null;
    });
  });
  it("logout-all includes the current device and clears local authentication", () => {
    cy.intercept("POST", "**/users/me/logout-all", {
      body: { message: "Logged out" },
    }).as("logoutAll");
    cy.visit("/admin/security", { onBeforeLoad: (win) => auth(win) });
    cy.on("window:confirm", (text) => {
      expect(text).to.include("including this one");
      return true;
    });
    cy.contains("button", "Log out of all devices").click();
    cy.wait("@logoutAll");
    cy.location("pathname").should("eq", "/admin/login");
    cy.window().then(
      (win) => expect(win.localStorage.getItem("accessToken")).to.be.null,
    );
  });
});
