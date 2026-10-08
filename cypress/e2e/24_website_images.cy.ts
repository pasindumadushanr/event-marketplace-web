const hero = "https://example.com/new-hero.jpg";
const logo = "https://example.com/new-logo.png";

function visitAdmin() {
  cy.visit("/admin/cms/images", {
    onBeforeLoad(win) {
      win.localStorage.setItem("accessToken", "test-admin");
      win.localStorage.setItem(
        "user",
        JSON.stringify({
          id: "admin",
          firstName: "Test",
          roleName: "SUPER_ADMIN",
        }),
      );
    },
  });
}

describe("Website image controls", () => {
  let saved: Record<string, unknown>;
  beforeEach(() => {
    saved = {};
    cy.intercept("GET", "https://example.com/**", {
      statusCode: 200,
      headers: { "content-type": "image/svg+xml" },
      body: '<svg xmlns="http://www.w3.org/2000/svg" width="80" height="40"><rect width="80" height="40" fill="teal"/></svg>',
    });
    cy.intercept("GET", "**/admin/cms/settings/SITE_MEDIA", (req) =>
      req.reply({ body: saved }),
    );
    cy.intercept("GET", "**/admin/cms/public/settings/SITE_MEDIA", (req) =>
      req.reply({ body: saved }),
    );
    cy.intercept("GET", "**/business-categories", {
      body: [
        {
          id: "photos",
          name: "Photographers",
          slug: "photographers",
          status: "ACTIVE",
          parentId: null,
        },
      ],
    });
    cy.intercept("POST", "**/admin/cms/settings/SITE_MEDIA", (req) => {
      saved = req.body.value;
      req.reply({ body: saved });
    }).as("saveImages");
  });
  it("publishes hero, logo, category and location overrides and restores defaults", () => {
    visitAdmin();
    cy.contains("h1", "Website Images").should("be.visible");
    cy.contains("a", "Website Images").should(
      "have.attr",
      "href",
      "/admin/cms/images",
    );
    cy.get("#image-url-heroImage").type(hero);
    cy.get("#image-url-logoImage").type(logo);
    cy.get("#image-url-locationColombo").type(
      "https://example.com/colombo.jpg",
    );
    cy.get("#image-url-photographers").type("https://example.com/category.jpg");
    cy.then(() => expect(saved).to.deep.equal({}));
    cy.contains("button", "Save Images").click();
    cy.wait("@saveImages")
      .its("request.body.value")
      .should("include", { heroImage: hero, logoImage: logo });
    cy.visit("/");
    cy.get('img[alt="Luxury Wedding Event"]').should("have.attr", "src", hero);
    cy.get('img[alt="Nakathata.lk"]').first().should("have.attr", "src", logo);
    cy.get('img[alt="Colombo"]').should(
      "have.attr",
      "src",
      "https://example.com/colombo.jpg",
    );
    cy.get('img[alt="Photographers"]').should(
      "have.attr",
      "src",
      "https://example.com/category.jpg",
    );
    visitAdmin();
    cy.get('section[aria-label="Homepage hero"]')
      .contains("button", "Reset to default")
      .click();
    cy.contains("button", "Save Images").click();
    cy.wait("@saveImages");
    cy.visit("/");
    cy.get('img[alt="Luxury Wedding Event"]')
      .should("have.attr", "src")
      .and("include", "images.unsplash.com");
  });
  it("uploads a file as multipart data but only publishes after Save", () => {
    cy.intercept("POST", "**/admin/cms/images/upload", (req) => {
      expect(req.headers["content-type"]).to.contain("multipart/form-data");
      req.reply({ body: { url: hero } });
    }).as("upload");
    visitAdmin();
    cy.get('input[aria-label="Upload Homepage hero"]').selectFile(
      {
        contents: Cypress.Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]),
        fileName: "hero.png",
        mimeType: "image/png",
      },
      { force: true },
    );
    cy.wait("@upload");
    cy.get("#image-url-heroImage").should("have.value", hero);
    cy.then(() => expect(saved).to.deep.equal({}));
    cy.contains("button", "Save Images").click();
    cy.wait("@saveImages");
  });
  it("preserves drafts on failed save and refuses insecure URLs", () => {
    visitAdmin();
    cy.get("#image-url-heroImage").type("http://example.com/image.jpg");
    cy.contains("button", "Save Images").click();
    cy.contains("Image URLs must use HTTPS.").should("be.visible");
    cy.get("#image-url-heroImage").clear().type(hero);
    cy.intercept("POST", "**/admin/cms/settings/SITE_MEDIA", {
      statusCode: 500,
      body: {},
    }).as("failedSave");
    cy.contains("button", "Save Images").click();
    cy.wait("@failedSave");
    cy.get("#image-url-heroImage").should("have.value", hero);
    cy.contains("You have unpublished image changes.").should("be.visible");
  });
  it("does not allow saving after settings fail to load", () => {
    cy.intercept("GET", "**/admin/cms/settings/SITE_MEDIA", {
      statusCode: 500,
      body: {},
    });
    visitAdmin();
    cy.contains("Nothing has been changed.").should("be.visible");
    cy.contains("button", "Save Images").should("not.exist");
  });
  it("fits on mobile and rejects unsupported upload formats", () => {
    cy.viewport(390, 844);
    visitAdmin();
    cy.contains("h1", "Website Images").should("be.visible");
    cy.document().then((doc) =>
      expect(doc.documentElement.scrollWidth).to.be.at.most(390),
    );
    cy.get('input[aria-label="Upload Homepage hero"]').selectFile(
      {
        contents: Cypress.Buffer.from("<svg/>"),
        fileName: "unsafe.svg",
        mimeType: "image/svg+xml",
      },
      { force: true },
    );
    cy.contains("Choose a PNG, JPEG or WebP image up to 5 MB.").should(
      "be.visible",
    );
    cy.get("#image-url-heroImage").should("have.value", "");
  });
});
