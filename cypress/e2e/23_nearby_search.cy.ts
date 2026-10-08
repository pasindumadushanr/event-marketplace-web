const point = { latitude: 6.9271, longitude: 79.8612 };
const card = {
  id: "near-1",
  name: "Nearby Photographer",
  city: "Colombo",
  isVerified: false,
  category: { name: "Photography" },
  startingPrice: 5000,
  rating: 0,
  reviewCount: 0,
  distanceKm: 4.2,
};

describe("Optional 50 km vendor discovery", () => {
  beforeEach(() => {
    cy.intercept("GET", "**/business-categories", { body: [] });
    cy.intercept("GET", "**/discovery/search*", {
      body: { data: [], meta: { total: 0, page: 1, totalPages: 0 } },
    }).as("normal");
  });
  function visit(deny = false) {
    const position = cy
      .stub()
      .callsFake((success, failure) =>
        deny ? failure({ code: 1 }) : success({ coords: point }),
      )
      .as("geolocation");
    cy.visit("/search", {
      onBeforeLoad(win) {
        Object.defineProperty(win.navigator, "geolocation", {
          configurable: true,
          value: { getCurrentPosition: position },
        });
      },
    });
    cy.wait("@normal");
  }
  it("requests permission only after a click and keeps coordinates out of the URL", () => {
    cy.intercept("POST", "**/discovery/nearby", (req) => {
      expect(req.body).to.include({ ...point, sortBy: "DISTANCE" });
      req.reply({
        body: {
          data: [card],
          meta: { total: 1, page: 1, totalPages: 1, radiusKm: 50 },
        },
      });
    }).as("nearby");
    visit();
    cy.get("@geolocation").should("not.have.been.called");
    cy.contains("button", "Use my location").click();
    cy.wait("@nearby");
    cy.contains("Searching within 50 km").should("be.visible");
    cy.get('[data-slot="select-trigger"]').should("contain", "Nearest first");
    cy.contains("Nearby Photographer").should("be.visible");
    cy.contains("About 4.2 km away").should("be.visible");
    cy.url().should("not.contain", "latitude").and("not.contain", "6.9271");
    cy.get("@geolocation").should("have.been.calledOnce");
    cy.viewport(390, 844);
    cy.document().then((doc) =>
      expect(doc.documentElement.scrollWidth).to.be.at.most(390),
    );
  });
  it("allows city search after permission is denied without calling nearby API", () => {
    const nearby = cy.stub().as("unexpectedNearby");
    cy.intercept("POST", "**/discovery/nearby", nearby);
    visit(true);
    cy.contains("button", "Use my location").click();
    cy.contains("Location permission was denied").should("be.visible");
    cy.get('input[placeholder="e.g. Colombo"]')
      .should("be.enabled")
      .type("Kandy");
    cy.contains("button", "Apply Filters").click();
    cy.wait("@normal").its("request.url").should("contain", "city=Kandy");
    cy.get("@unexpectedNearby").should("not.have.been.called");
  });
  it("paginates nearby results without requesting location again", () => {
    cy.intercept("POST", "**/discovery/nearby", (req) => {
      const page = Number(req.body.page);
      req.reply({
        body: {
          data: [
            {
              ...card,
              name: page === 1 ? "First Page Vendor" : "Second Page Vendor",
            },
          ],
          meta: { total: 13, page, totalPages: 2, radiusKm: 50 },
        },
      });
    }).as("nearby");
    visit();
    cy.contains("button", "Use my location").click();
    cy.wait("@nearby");
    cy.contains("button", "Next").click();
    cy.wait("@nearby").its("request.body.page").should("eq", "2");
    cy.contains("Second Page Vendor").should("be.visible");
    cy.get("@geolocation").should("have.been.calledOnce");
  });
  it("explains missing coordinates and clears nearby mode correctly", () => {
    cy.intercept("POST", "**/discovery/nearby", {
      body: {
        data: [],
        meta: { total: 0, page: 1, totalPages: 0, radiusKm: 50 },
      },
    }).as("nearby");
    visit();
    cy.contains("button", "Use my location").click();
    cy.wait("@nearby");
    cy.contains("some vendors have not added their coordinates yet").should(
      "be.visible",
    );
    cy.contains("button", "Clear Filters").click();
    cy.wait("@normal");
    cy.contains("Searching within 50 km").should("not.exist");
    cy.get('input[placeholder="e.g. Colombo"]').should("be.enabled");
  });
  it("shows a retryable API failure rather than claiming no vendors exist", () => {
    cy.intercept("POST", "**/discovery/nearby", {
      statusCode: 503,
      body: { message: "Unavailable" },
    }).as("nearby");
    visit();
    cy.contains("button", "Use my location").click();
    cy.wait("@nearby");
    cy.contains("Search could not load").should("be.visible");
    cy.contains("No vendors found").should("not.exist");
    cy.intercept("POST", "**/discovery/nearby", {
      body: { data: [card], meta: { total: 1, page: 1, totalPages: 1 } },
    });
    cy.contains("button", "Retry search").click();
    cy.contains("Nearby Photographer").should("be.visible");
  });
  it("stores vendor coordinates only after Save and preserves existing profile settings", () => {
    cy.intercept("GET", "**/vendor/business", {
      body: {
        id: "v1",
        name: "Test Business",
        city: "Colombo",
        address: "Colombo",
        vendorStatus: "APPROVED",
        profileSettings: { seo: { slug: "test-business" } },
      },
    });
    cy.intercept("GET", "**/vendor/business/onboarding/status", {
      body: { vendorStatus: "APPROVED", emailVerified: true },
    });
    cy.intercept("PATCH", "**/vendor/business", (req) => {
      expect(req.body.profileSettings.location).to.deep.eq(point);
      req.reply({ body: {} });
    }).as("saveBusiness");
    cy.visit("/vendor/business/location", {
      onBeforeLoad(win) {
        win.localStorage.setItem("accessToken", "local-test-only");
        win.localStorage.setItem(
          "user",
          JSON.stringify({ id: "v1", roleName: "VENDOR", firstName: "Test" }),
        );
      },
    });
    cy.get("#business-latitude").type(String(point.latitude));
    cy.get("#business-longitude").type(String(point.longitude));
    cy.get("@saveBusiness.all").should("have.length", 0);
    cy.contains("button", "Save Changes").click();
    cy.wait("@saveBusiness");
    cy.contains("Location settings saved!").should("be.visible");
  });
});
