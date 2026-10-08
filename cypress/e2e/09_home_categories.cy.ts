import { homeCategories } from "../../src/lib/home-categories";

describe("Homepage category search", () => {
  beforeEach(() => {
    cy.intercept("GET", "**/business-categories", {
      body: [
        {
          id: "transport",
          name: "Wedding Cars & Transport",
          slug: "wedding-cars-transport",
          parentId: null,
        },
        {
          id: "cars",
          name: "Wedding Cars",
          slug: "wedding-cars",
          parentId: "transport",
        },
      ],
    }).as("categories");
    cy.intercept("GET", "**/discovery/search*", (req) => {
      if (!new URL(req.url).searchParams.has("limit")) req.alias = "search";
      req.reply({ body: { data: [], meta: { total: 0 } } });
    });
  });

  it("shows all requested labels in order", () => {
    cy.visit("/");
    cy.get('select[aria-label="Category"] option').then(($options) => {
      expect([...$options].map((option) => option.textContent)).to.deep.equal([
        "All Categories",
        "Venues & Halls",
        "Photography & Video",
        "Bridal & Groom Wear",
        "Salons & Makeup",
        "Floral & Decor",
        "Catering & Cakes",
        "Jewellery",
        "Bands & DJ Music",
        "Wedding Planners",
        "Traditional & Poruwa",
        "Invitations & Cards",
        "Wedding Cars",
        "Event Security",
      ]);
    });
    expect(new Set(homeCategories.map((item) => item.slug)).size).to.equal(13);
  });

  it("passes category, keyword, and location to search and retains the selection", () => {
    cy.viewport(390, 844);
    cy.visit("/");
    cy.wait("@categories");
    cy.get('select[aria-label="Category"]').select("Wedding Cars");
    cy.get('input[placeholder="What are you looking for?"]').type("classic");
    cy.get('select[aria-label="Location"]').select("Colombo");
    cy.get('select[aria-label="Category"]').should(
      "have.value",
      "wedding-cars",
    );
    cy.get('input[placeholder="What are you looking for?"]').should(
      "have.value",
      "classic",
    );
    cy.get('select[aria-label="Category"]')
      .closest("form")
      .contains("button", "Search")
      .click();
    cy.location("search").should("include", "categorySlug=wedding-cars");
    cy.wait("@search").then(({ request }) => {
      const params = new URL(request.url).searchParams;
      expect(params.get("categorySlug")).to.equal("wedding-cars");
      expect(params.get("q")).to.equal("classic");
      expect(params.get("city")).to.equal("Colombo");
    });
    cy.contains("label", "Subcategory")
      .find("select")
      .should("have.value", "cars");
    cy.contains("button", "Apply Filters").click();
    cy.wait("@search")
      .its("request.url")
      .should("include", "categorySlug=wedding-cars");
    cy.intercept("GET", "**/discovery/search*", {
      body: { data: [], meta: { total: 0 } },
    }).as("clearedSearch");
    cy.contains("label", "Main category").find("select").select("");
    cy.contains("label", "Main category")
      .find("select")
      .should("have.value", "");
    cy.contains("label", "Subcategory").should("not.exist");
    cy.contains("button", "Apply Filters").click();
    cy.wait("@clearedSearch")
      .its("request.url")
      .should("not.include", "categorySlug")
      .and("not.include", "categoryId");
  });

  it("searches a custom town and shows its vendors without asking for location permission", () => {
    cy.intercept("GET", "**/discovery/search*", (req) => {
      const params = new URL(req.url).searchParams;
      req.reply({
        body: {
          data:
            params.get("city") === "Walasmulla"
              ? [
                  {
                    id: "walasmulla-test",
                    name: "Walasmulla Wedding Studio",
                    city: "Walasmulla",
                    isVerified: false,
                    startingPrice: 0,
                    rating: 0,
                    reviewCount: 0,
                  },
                ]
              : [],
          meta: {
            total: params.get("city") === "Walasmulla" ? 1 : 0,
            page: 1,
            totalPages: 1,
          },
        },
      });
    }).as("townSearch");
    const geolocation = cy.stub().as("unrequestedLocation");
    cy.visit("/", {
      onBeforeLoad(win) {
        Object.defineProperty(win.navigator, "geolocation", {
          configurable: true,
          value: { getCurrentPosition: geolocation },
        });
      },
    });
    cy.get('select[aria-label="Location"]').select("__custom_town__");
    cy.get("#home-custom-town").type("  Walasmulla  ");
    cy.get("#home-custom-town")
      .closest("form")
      .contains("button", "Search")
      .click();
    cy.location("search")
      .should("contain", "city=Walasmulla")
      .and("not.contain", "__custom_town__");
    cy.get('input[aria-label="Town or city"]').should(
      "have.value",
      "Walasmulla",
    );
    cy.contains("Walasmulla Wedding Studio").should("be.visible");
    cy.get("@unrequestedLocation").should("not.have.been.called");
    cy.viewport(390, 844);
    cy.document().then((doc) =>
      expect(doc.documentElement.scrollWidth).to.be.at.most(390),
    );
  });

  it("requires a custom town and can switch back to a district or all locations", () => {
    cy.visit("/");
    cy.get('select[aria-label="Location"]').select("__custom_town__");
    cy.get("#home-custom-town")
      .closest("form")
      .contains("button", "Search")
      .click();
    cy.location("pathname").should("eq", "/");
    cy.get("#home-custom-town")
      .should("have.prop", "validity")
      .its("valid")
      .should("eq", false);
    cy.get('select[aria-label="Location"]').select("Colombo");
    cy.get("#home-custom-town").should("not.exist");
    cy.get('select[aria-label="Location"]').select("");
    cy.get('select[aria-label="Location"]')
      .closest("form")
      .contains("button", "Search")
      .click();
    cy.location("pathname").should("eq", "/search");
    cy.location("search").should("not.contain", "city=");
  });
});
