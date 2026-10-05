const vendor = (id: string, name: string, extra = {}) => ({
  id,
  name,
  isVerified: false,
  available: true,
  city: "Colombo",
  district: "Western",
  services: ["Full-day photography", "Wedding album"],
  startingPrice: 50000,
  rating: 4.5,
  reviewCount: 2,
  category: { name: "Photography" },
  ...extra,
});
const saved = [
  vendor("v1", "Sunrise Studio"),
  vendor("v2", "Garden Cakes", {
    city: "Kandy",
    services: ["Floral wedding cake"],
    startingPrice: 0,
    rating: 0,
    reviewCount: 0,
  }),
  vendor("v3", "Classic Cars"),
  vendor("v4", "Fourth Vendor"),
  vendor("v5", "Closed Studio", { available: false }),
].map((business) => ({ id: `f-${business.id}`, business }));
function auth(win: Window) {
  win.localStorage.setItem("accessToken", "test-only");
  win.localStorage.setItem(
    "user",
    JSON.stringify({ id: "c1", firstName: "Customer", roleName: "CUSTOMER" }),
  );
}
describe("Saved vendor shortlist", () => {
  it("compares real details, limits selection to three, persists saves, and fits mobile", () => {
    let list = [...saved];
    cy.intercept("GET", "**/customer/account/favorites", (req) =>
      req.reply({ body: list }),
    ).as("list");
    cy.intercept("DELETE", "**/customer/account/favorites/v1", (req) => {
      list = list.filter((f) => f.business.id !== "v1");
      req.reply({ body: { count: 1 } });
    }).as("remove");
    cy.visit("/account/favorites", { onBeforeLoad: auth });
    cy.wait("@list");
    cy.contains("button", "Compare vendors").should("be.disabled");
    cy.contains("label", "Compare Sunrise Studio").find("input").check();
    cy.contains("label", "Compare Garden Cakes").find("input").check();
    cy.contains("button", "Compare vendors").click();
    cy.get('section[aria-label="Vendor comparison"]').within(() => {
      cy.contains("Kandy").should("be.visible");
      cy.contains("Floral wedding cake").should("be.visible");
      cy.contains("From LKR 50,000").should("be.visible");
      cy.contains("Price on request").should("be.visible");
      cy.contains("4.5 / 5").should("be.visible");
      cy.contains("No reviews yet").should("be.visible");
    });
    cy.contains("label", "Compare Classic Cars").find("input").check();
    cy.contains("label", "Compare Fourth Vendor")
      .find("input")
      .should("be.disabled");
    cy.contains("label", "Compare Closed Studio")
      .find("input")
      .should("be.disabled");
    cy.viewport(390, 844);
    cy.document().then((doc) =>
      expect(doc.documentElement.scrollWidth).to.be.at.most(390),
    );
    cy.get('div[aria-label="Scrollable comparison table"]').scrollTo("right");
    cy.get('section[aria-label="Vendor comparison"]').scrollIntoView();
    cy.screenshot("shortlist-mobile", { capture: "viewport" });
    cy.viewport(1440, 1000);
    cy.document().then((doc) =>
      expect(doc.documentElement.scrollWidth).to.be.at.most(1440),
    );
    cy.get('section[aria-label="Vendor comparison"]').scrollIntoView();
    cy.screenshot("shortlist-desktop", { capture: "viewport" });
    cy.get(
      'article[aria-label="Shortlisted Sunrise Studio"] button[aria-label="Remove from shortlist"]',
    ).click();
    cy.wait("@remove");
    cy.contains("2 of 3 selected").should("be.visible");
    cy.reload();
    cy.wait("@list");
    cy.get('article[aria-label="Shortlisted Sunrise Studio"]').should(
      "not.exist",
    );
  });
  it("shows load failures separately from an empty shortlist and keeps a failed removal saved", () => {
    let failed = true;
    cy.intercept("GET", "**/customer/account/favorites", (req) =>
      req.reply(failed ? { statusCode: 503, body: {} } : { body: saved }),
    );
    cy.visit("/account/favorites", { onBeforeLoad: auth });
    cy.contains("We couldn’t load your shortlist").should("be.visible");
    cy.contains("Start your shortlist").should("not.exist");
    cy.then(() => {
      failed = false;
    });
    cy.contains("button", "Try again").click();
    cy.intercept("DELETE", "**/customer/account/favorites/v1", {
      statusCode: 503,
      body: {},
    });
    cy.get(
      'article[aria-label="Shortlisted Sunrise Studio"] button[aria-label="Remove from shortlist"]',
    ).click();
    cy.contains("Couldn’t update your shortlist").should("be.visible");
    cy.get('article[aria-label="Shortlisted Sunrise Studio"]').should("exist");
  });
  it("connects the public profile save button and restores its saved state", () => {
    let list: typeof saved = [];
    cy.intercept("GET", "**/discovery/vendors/vendor-test", {
      body: {
        ...vendor("vendor-test", "Sunrise Photography"),
        status: "ACTIVE",
        vendorStatus: "APPROVED",
        packages: [],
        reviews: [],
        galleries: [],
        profileSettings: {},
      },
    });
    cy.intercept("GET", "**/customer/account/favorites", (req) =>
      req.reply({ body: list }),
    );
    cy.intercept("POST", "**/customer/account/favorites/vendor-test", (req) => {
      list = [
        {
          id: "f-profile",
          business: vendor("vendor-test", "Sunrise Photography"),
        },
      ];
      req.reply({ body: { id: "f-profile" } });
    }).as("save");
    cy.visit("/business/vendor-test", { onBeforeLoad: auth });
    cy.get('button[aria-label="Save to shortlist"]').click();
    cy.wait("@save");
    cy.contains("button", "Shortlisted").should(
      "have.attr",
      "aria-pressed",
      "true",
    );
    cy.reload();
    cy.contains("button", "Shortlisted").should(
      "have.attr",
      "aria-pressed",
      "true",
    );
  });
  it("asks signed-out customers to sign in without showing another user’s shortlist", () => {
    cy.visit("/account/favorites", {
      onBeforeLoad: (win) => win.localStorage.clear(),
    });
    cy.contains("Sign in to save vendors").should("be.visible");
    cy.contains("a", "Sign in").should("have.attr", "href", "/login");
  });
});
