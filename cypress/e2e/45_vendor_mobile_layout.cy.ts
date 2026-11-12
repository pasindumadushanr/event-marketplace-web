export {};

const business = {
  id: "vendor-test",
  name: "Gunawathi Wedding Photography and Event Services",
  description: "Wedding photography and celebration planning across Sri Lanka.",
  status: "ACTIVE",
  vendorStatus: "APPROVED",
  phone: "0717594316",
  email: "weddingphotographyandcelebrations@example.com",
  address: "10 Wedding Street",
  city: "Walasmulla",
  district: "Hambantota",
  categoryId: "photo",
  category: { id: "photo", name: "Photographers" },
  logo: "/images/brand/nakathata-logo.jpg",
  coverImage: "/images/brand/nakathata-logo.jpg",
  profileSettings: {
    whatsapp: "0717594316",
    tiktok: "https://tiktok.com/@studio",
    policies: { bookingPolicy: "Contact us to book" },
  },
};

function open(path: string) {
  const stub = (url: string, body: unknown) =>
    cy.intercept("GET", url, (req) => {
      if (req.headers.authorization) req.reply({ body });
      else req.continue();
    });
  stub("**/vendor/business/onboarding/status", {
    vendorStatus: "APPROVED",
    emailVerified: true,
  });
  stub("**/vendor/business", business);
  for (const url of [
    "**/vendor/packages",
    "**/vendor/gallery",
    "**/vendor/business/content",
    "**/bookings/vendor",
    "**/chat/conversations*",
    "**/notifications/me",
  ])
    stub(url, []);
  cy.intercept("GET", "**/business-categories", {
    body: [
      { id: "photo", name: "Photographers", status: "ACTIVE", parentId: null },
    ],
  });
  cy.visit(path, {
    onBeforeLoad(win) {
      win.localStorage.setItem("accessToken", "test-only");
      win.localStorage.setItem("nakathata_vendor_dashboard_mode", "v3");
      win.localStorage.setItem(
        "user",
        JSON.stringify({
          id: "vendor-test",
          firstName: "Test",
          roleName: "VENDOR",
        }),
      );
    },
  });
}

describe("Vendor mobile layout", () => {
  for (const width of [320, 390]) {
    for (const route of [
      "/vendor",
      "/vendor/preview",
      "/vendor/business",
      "/vendor/business/general",
      "/vendor/business/contact",
      "/vendor/business/location",
      "/vendor/packages",
      "/vendor/gallery",
    ]) {
      it(`${route} fits at ${width}px`, () => {
        cy.viewport(width, 844);
        open(route);
        cy.get(".vendor-page-content").should("be.visible");
        cy.get(".vendor-page-content h1, .vendor-page-content h2").should(
          "exist",
        );
        cy.get(".vendor-page-content").should(($page) => {
          expect($page[0].scrollWidth, "content width").to.be.at.most(
            $page[0].clientWidth + 1,
          );
        });
        cy.get(".vendor-topbar").should(($bar) => {
          expect($bar[0].scrollWidth, "header width").to.be.at.most(
            $bar[0].clientWidth + 1,
          );
        });
      });
    }
  }
  it("keeps editor buttons touch-friendly and profile metadata aligned", () => {
    cy.viewport(320, 844);
    open("/vendor/preview");
    cy.contains("h1", business.name).should("exist");
    cy.get(".visual-editor-intro h1").should("have.css", "font-size", "20px");
    cy.get(".business-profile-summary h1").should("have.css", "font-size", "20px");
    cy.get(".visual-editor-intro > p").first().should("have.css", "font-size", "13px");
    cy.get(".business-profile-logo").should("have.css", "width", "72px");
    cy.get(".visual-editor-topbar .business-subtle-button").each(($button) => {
      expect($button[0].getBoundingClientRect().height).to.be.at.least(44);
    });
    cy.get('[aria-label="Vendor contact and social media"]').should("exist");
    cy.contains("button", "Edit").first().click();
    cy.get(".visual-edit-panel")
      .should("be.visible")
      .and(($panel) => {
        expect($panel[0].getBoundingClientRect().right).to.be.at.most(320);
      });
  });
});
