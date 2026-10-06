const stats = {
  totalUsers: 1248,
  activeVendors: 86,
  completedBookings: 32,
  platformRevenue: 125000,
  chartData: ["May", "Jun", "Jul", "Aug", "Sep", "Oct"].map((name, index) => ({
    name,
    total: 20 + index * 12,
  })),
  recentSignups: [
    {
      id: "u1",
      firstName: "Nimali",
      lastName: "Perera",
      email: "nimali@example.com",
      createdAt: "2026-10-06T12:00:00Z",
    },
  ],
};
function visit(role = "SUPER_ADMIN") {
  cy.visit("/admin", {
    onBeforeLoad(win) {
      win.localStorage.setItem("accessToken", "test-admin");
      win.localStorage.setItem(
        "user",
        JSON.stringify({
          id: "a1",
          firstName: "Pasindu",
          lastName: "Admin",
          roleName: role,
        }),
      );
    },
  });
}
describe("Professional admin workspace", () => {
  beforeEach(() => {
    cy.viewport(1280, 800);
  });
  it("shows actual metrics, shortcuts and all navigation groups on desktop", () => {
    cy.intercept("GET", "**/admin/dashboard/stats", stats).as("stats");
    visit();
    cy.wait("@stats");
    cy.contains("h1", "Welcome back, Pasindu.").should("be.visible");
    cy.contains("Approved vendors").should("be.visible");
    cy.contains("1,248").should("be.visible");
    cy.contains("LKR 125,000").should("be.visible");
    cy.get("aside nav").within(() => {
      cy.contains("Vendor Approvals").should("be.visible");
      cy.contains("button", "User Management")
        .click()
        .should("have.attr", "aria-expanded", "true");
      cy.contains("a", "Permissions").should("be.visible");
      cy.contains("button", "Settings").click();
      cy.contains("a", "API Keys").should("be.visible");
      cy.get('a[aria-current="page"]').should("have.text", "Dashboard");
    });
    cy.contains("Nimali Perera").should("be.visible");
    cy.contains("Open vendor approvals").should(
      "have.attr",
      "href",
      "/admin/vendors/approvals",
    );
    cy.contains("Last refreshed at").should("contain", "Sri Lanka time");
    cy.document().then(doc => expect(doc.documentElement.scrollWidth).to.be.at.most(1280));
    cy.screenshot("admin-overview-desktop", { capture: "viewport" });
  });
  it("fits a phone and opens accessible navigation that closes after selection", () => {
    cy.viewport(390, 844);
    cy.intercept("GET", "**/admin/dashboard/stats", stats);
    cy.intercept("GET", "http://127.0.0.1:3021/admin/activity*", {
      body: { items: [], total: 0, page: 1, pageSize: 25 },
    });
    visit();
    cy.contains("1,248").should("be.visible");
    cy.document().then((doc) =>
      expect(doc.documentElement.scrollWidth).to.be.at.most(390),
    );
    cy.screenshot("admin-overview-phone", { capture: "viewport" });
    cy.get('button[aria-label="Open navigation"]').click();
    cy.get('[data-slot="sheet-content"]').within(() => {
      cy.contains("button", "Business Management").click();
      cy.contains("a", "Categories").should("be.visible");
      cy.contains("a", "Activity History").click();
    });
    cy.url().should("include", "/admin/activity");
    cy.get('[data-slot="sheet-content"]').should("not.exist");
    cy.contains("Admin activity history").should("be.visible");
  });
  it("provides a retry when loading fails, then recovers", () => {
    let requests = 0;
    cy.intercept("GET", "**/admin/dashboard/stats", (req) =>
      req.reply(
        ++requests === 1 ? { statusCode: 500, body: {} } : { body: stats },
      ),
    );
    visit();
    cy.get('[role="alert"]').should("contain", "couldn’t load");
    cy.contains("button", "Try again").click();
    cy.contains("1,248").should("be.visible");
    cy.get('[role="alert"]').should("not.exist");
  });
  it("keeps last loaded figures when a refresh fails", () => {
    let requests = 0;
    cy.intercept("GET", "**/admin/dashboard/stats", (req) =>
      req.reply(
        ++requests === 1 ? { body: stats } : { statusCode: 500, body: {} },
      ),
    );
    visit();
    cy.contains("1,248").should("be.visible");
    cy.contains("button", "Refresh overview").click();
    cy.get('[role="alert"]').should("contain", "last successful load");
    cy.contains("1,248").should("be.visible");
  });
  it("hides restricted revenue and handles empty data", () => {
    cy.intercept("GET", "**/admin/dashboard/stats", {
      body: {
        ...stats,
        platformRevenue: null,
        recentSignups: [],
        chartData: [],
      },
    });
    visit("ADMIN");
    cy.contains("1,248").should("be.visible");
    cy.contains("Platform revenue").should("not.exist");
    cy.contains("No recent signups yet.").should("be.visible");
    cy.contains("No registration data available yet.").should("be.visible");
  });
  it("still redirects unauthenticated visitors to the admin login", () => {
    cy.clearLocalStorage();
    cy.visit("/admin");
    cy.url().should("include", "/admin/login");
    cy.get("#email").should("be.visible");
  });
});
