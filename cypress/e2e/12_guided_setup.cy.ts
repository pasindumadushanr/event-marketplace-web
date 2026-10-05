import {
  previewSignature,
  setupProgress,
} from "../../src/components/vendor/setup-progress";

const profile: any = {
  id: "vendor-test",
  name: "Sunrise Photography",
  description: "Wedding photography in Colombo",
  status: "INACTIVE",
  phone: "0771234567",
  email: "test@example.com",
  address: "Colombo",
  city: "Colombo",
  logo: "/images/brand/nakathata-logo.jpg",
  coverImage: "/images/brand/nakathata-logo.jpg",
  category: { id: "photo", name: "Photography" },
  profileSettings: {
    policies: { bookingPolicy: "Contact us before booking" },
    bookingMethod: "CONTACT_ONLY",
  },
};
const account = { vendorStatus: "APPROVED", emailVerified: true };
function visit(path: string, business = profile) {
  cy.intercept("GET", "**/vendor/business", (req) => {
    if (req.headers.authorization) req.reply({ body: business });
    else req.continue();
  });
  cy.intercept("GET", "**/vendor/business/onboarding/status", {
    body: account,
  });
  cy.intercept("GET", "**/vendor/packages", { body: [] });
  cy.intercept("GET", "**/vendor/gallery", { body: [] });
  cy.visit(path, {
    onBeforeLoad(win) {
      win.localStorage.setItem("accessToken", "local-test-only");
      win.localStorage.setItem(
        "user",
        JSON.stringify({ id: "v1", roleName: "VENDOR", firstName: "Test" }),
      );
    },
  });
}
describe("Guided vendor setup", () => {
  it("counts saved fields and links directly to each missing field", () => {
    visit("/vendor/business", { ...profile, phone: " ", coverImage: "" });
    cy.get("#business-setup ol > li").should("have.length", 6);
    cy.get("#business-setup")
      .contains("Upload a cover photo")
      .should("have.attr", "href", "/vendor/business/general");
    cy.get("#business-setup")
      .contains("Add a phone number")
      .should("have.attr", "href", "/vendor/business/contact");
    cy.contains("button", "Publish my page").should("be.disabled");
    cy.viewport(390, 844);
    cy.get("#business-setup").scrollIntoView();
    cy.document().then((doc) =>
      expect(doc.documentElement.scrollWidth).to.be.at.most(390),
    );
    cy.screenshot("guided-setup-mobile");
  });
  it("persists an explicit customer review and publishes from the checklist", () => {
    let saved = structuredClone(profile);
    visit("/vendor/preview");
    cy.intercept("PATCH", "**/vendor/business", (req) => {
      saved.profileSettings = {
        ...saved.profileSettings,
        ...req.body.profileSettings,
      };
      req.reply({ body: saved });
    }).as("review");
    cy.contains("button", "View as customer").click();
    cy.contains("button", "I’ve checked my page").click();
    cy.wait("@review").then(({ request }) =>
      expect(request.body.profileSettings.setupReview.signature).to.equal(
        previewSignature(profile, []),
      ),
    );
    cy.intercept("GET", "**/vendor/business", (req) =>
      req.headers.authorization ? req.reply({ body: saved }) : req.continue(),
    );
    cy.contains("a", "Back to setup checklist").click();
    cy.reload();
    cy.contains("5 of 6 steps complete").should("be.visible");
    cy.intercept("PATCH", "**/vendor/business/publish", {
      statusCode: 500,
      body: { message: "Please try again" },
    }).as("publishFailure");
    cy.contains("button", "Publish my page").click();
    cy.wait("@publishFailure");
    cy.contains("Please try again").should("be.visible");
    cy.intercept("PATCH", "**/vendor/business/publish", {
      body: {},
    }).as("publish");
    cy.contains("button", "Publish my page").click();
    cy.wait("@publish");
    cy.contains("6 of 6 steps complete").should("be.visible");
  });
  it("invalidates a review when saved content changes, but not visibility", () => {
    const reviewed = {
      ...profile,
      profileSettings: {
        ...profile.profileSettings,
        setupReview: { signature: previewSignature(profile, []) },
      },
    };
    expect(setupProgress(reviewed, [], account).canPublish).to.equal(true);
    expect(
      setupProgress({ ...reviewed, status: "ACTIVE" }, [], account).canPublish,
    ).to.equal(true);
    expect(
      setupProgress(
        { ...reviewed, description: "Updated introduction" },
        [],
        account,
      ).canPublish,
    ).to.equal(false);
    expect(
      setupProgress(reviewed, [], {
        ...account,
        emailVerified: false,
      }).blockers.map((issue) => issue.label),
    ).to.include("Verify your account email before publishing");
    expect(
      setupProgress(reviewed, [], { ...account, vendorStatus: "UNDER_REVIEW" })
        .canPublish,
    ).to.equal(false);
  });
  it("does not report empty setup when the API is unavailable", () => {
    visit("/vendor/business");
    cy.intercept("GET", "**/vendor/packages", {
      statusCode: 500,
    });
    cy.reload();
    cy.contains("We couldn’t check your setup").should("be.visible");
    cy.get("#business-setup").should("not.exist");
    cy.intercept("GET", "**/vendor/packages", { body: [] });
    cy.contains("button", "Try again").click();
    cy.get("#business-setup").should("be.visible");
  });
});
