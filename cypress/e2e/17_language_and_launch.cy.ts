import { phrases, translate } from "../../src/lib/language";
import { setupProgress } from "../../src/components/vendor/setup-progress";
import { SRI_LANKA_DISTRICTS } from "../../src/lib/districts";

function auth(win: Window, role = "VENDOR") {
  win.localStorage.setItem("accessToken", "test-only");
  win.localStorage.setItem(
    "user",
    JSON.stringify({ id: "v1", firstName: "Test", roleName: role }),
  );
}
function language(code: "en" | "si" | "ta") {
  cy.get('fieldset[aria-label="Form language"]')
    .first()
    .find(`button[lang="${code}"]`)
    .click();
}
const profile = {
  id: "vendor-test",
  name: "Real vendor",
  description: "",
  status: "INACTIVE",
  category: { name: "Photography" },
  profileSettings: {},
};
function vendorMocks() {
  cy.intercept("GET", "**/vendor/business/onboarding/status", {
    body: { vendorStatus: "APPROVED", emailVerified: true },
  });
  cy.intercept("GET", "**/vendor/business", (req) =>
    req.headers.authorization ? req.reply({ body: profile }) : req.continue(),
  );
  cy.intercept("GET", "**/vendor/packages", { body: [] });
  cy.intercept("GET", "**/vendor/gallery", { body: [] });
}
describe("Gradual languages and nationwide launch support", () => {
  it("covers all setup guidance and all 25 districts without changing unknown content", () => {
    expect(new Set(SRI_LANKA_DISTRICTS).size).to.equal(25);
    const progress = setupProgress(profile, [], {
      vendorStatus: "PENDING",
      emailVerified: false,
    });
    for (const step of progress.steps) {
      for (const key of [
        step.title,
        step.hint,
        ...step.issues.map((i) => i.label),
      ]) {
        expect(phrases[key], key).to.have.length(2);
      }
    }
    expect(translate("ta", "Sunrise Photography")).to.equal(
      "Sunrise Photography",
    );
    expect(
      translate("si", "{count} of 6 steps complete", { count: 2 }),
    ).to.include("2");
  });
  it("keeps registration drafts, translates validation, and remembers the selected language", () => {
    cy.viewport(390, 844);
    cy.visit("/register");
    cy.get("#firstName").type("Nimali");
    language("si");
    cy.contains("h1", translate("si", "Create an account")).should(
      "be.visible",
    );
    cy.get('form button[type="submit"]').click();
    cy.contains(translate("si", "Last name is required")).should("be.visible");
    language("ta");
    cy.get("#firstName").should("have.value", "Nimali");
    cy.contains(translate("ta", "Last name is required")).should("be.visible");
    cy.document().then((doc) =>
      expect(doc.documentElement.scrollWidth).to.be.at.most(390),
    );
    cy.screenshot("tamil-registration-phone", { capture: "viewport" });
    cy.visit("/vendor/register");
    cy.contains(translate("ta", "Create Vendor Account")).should("be.visible");
    cy.get('fieldset button[lang="ta"]').should(
      "have.attr",
      "aria-pressed",
      "true",
    );
  });
  it("retains English API field names and vendor role while submitting localized registration", () => {
    cy.intercept('GET', 'https://www.google.com/recaptcha/api.js*', {
      headers: { 'content-type': 'application/javascript' },
      body: 'window.grecaptcha = { ready: function(cb) { cb(); }, execute: function() { return Promise.resolve("test-register-token"); } };',
    });
    cy.intercept("POST", "**/auth/register", (req) => {
      expect(req.body).to.include({
        firstName: "Nimali",
        lastName: "Perera",
        email: "nimali@example.com",
        role: "VENDOR",
      });
      req.reply({ statusCode: 503 });
    }).as("register");
    cy.visit("/register");
    language("si");
    cy.get("#firstName").type("Nimali");
    cy.get("#lastName").type("Perera");
    cy.get("#email").type("nimali@example.com");
    cy.get("#password").type("test-password");
    cy.get('label[for="vendor"]').click();
    cy.get('form button[type="submit"]').click();
    cy.wait("@register");
    cy.contains(translate("si", "Failed to register")).should("be.visible");
    cy.get("#firstName").should("have.value", "Nimali");
  });
  it("localizes saved-profile guidance without enabling publication or altering progress", () => {
    vendorMocks();
    cy.visit("/vendor/business", { onBeforeLoad: (win) => auth(win) });
    cy.get("#business-setup").find('button[lang="ta"]').click();
    cy.get("#business-setup")
      .contains(translate("ta", "Write a short business introduction"))
      .should("exist");
    cy.get("#business-setup")
      .contains("button", translate("ta", "Publish my page"))
      .should("be.disabled");
    cy.get("#business-setup ol > li").should("have.length", 6);
    cy.viewport(390, 844);
    cy.get("#business-setup").scrollIntoView();
    cy.document().then((doc) =>
      expect(doc.documentElement.scrollWidth).to.be.at.most(390),
    );
    cy.screenshot("tamil-setup-phone", { capture: "viewport" });
  });
  it("keeps onboarding fields while switching languages and offers every district", () => {
    vendorMocks();
    cy.visit("/vendor/onboarding", { onBeforeLoad: (win) => auth(win) });
    cy.get('input[name="name"]').type("My business");
    language("si");
    cy.get('input[name="name"]').should("have.value", "My business");
    cy.contains("button", translate("si", "Next")).click();
    cy.contains("button", translate("si", "Next")).click();
    cy.get("#onboarding-district option").should("have.length", 26);
    cy.get("#onboarding-district").select("Jaffna");
    language("ta");
    cy.get("#onboarding-district").should("have.value", "Jaffna");
    cy.viewport(390, 844);
    cy.document().then((doc) =>
      expect(doc.documentElement.scrollWidth).to.be.at.most(390),
    );
  });
  it("localizes email verification without changing the OTP request", () => {
    cy.intercept("GET", "**/vendor/business/onboarding/status", {
      body: { vendorStatus: "PENDING", emailVerified: false },
    });
    cy.intercept("POST", "**/auth/send-verification-otp", { body: {} }).as(
      "sendOtp",
    );
    cy.intercept("POST", "**/auth/verify-email-otp", (req) => {
      expect(req.body).to.deep.equal({ otp: "123456" });
      req.reply({ statusCode: 400 });
    }).as("verifyOtp");
    cy.visit("/vendor/verify-email", { onBeforeLoad: (win) => auth(win) });
    cy.wait("@sendOtp");
    language("ta");
    cy.get('input[autocomplete="one-time-code"]').type("123456");
    cy.contains("button", translate("ta", "Verify Email")).click();
    cy.wait("@verifyOtp");
    cy.contains(translate("ta", "Failed to verify email.")).should(
      "be.visible",
    );
    cy.get('input[autocomplete="one-time-code"]').should(
      "have.value",
      "123456",
    );
  });
  it("translates enquiry validation and keeps entered details unchanged", () => {
    cy.intercept("GET", "**/discovery/vendors/vendor-test", {
      body: {
        ...profile,
        status: "ACTIVE",
        profileSettings: { bookingMethod: "REQUEST_QUOTE" },
        packages: [],
      },
    });
    cy.intercept("POST", "**/chat/inquiries", (req) => {
      expect(req.body).to.include({
        eventDate: "2099-01-01",
        location: "Jaffna",
        guestCount: 25,
        requirements: "Our wedding photography requirements",
      });
      req.reply({ statusCode: 503 });
    }).as("inquiry");
    cy.visit("/business/vendor-test", {
      onBeforeLoad: (win) => auth(win, "CUSTOMER"),
    });
    cy.contains("button", "Message Vendor").first().click();
    language("si");
    cy.get('[role="dialog"] button[type="submit"]').click();
    cy.contains(
      translate(
        "si",
        "Add a future event date, location, guest count and at least 10 characters describing your requirements.",
      ),
    ).should("be.visible");
    language("ta");
    cy.contains(
      translate(
        "ta",
        "Add a future event date, location, guest count and at least 10 characters describing your requirements.",
      ),
    ).should("be.visible");
    cy.get('[role="dialog"] input[type="date"]').type("2099-01-01");
    cy.get('[role="dialog"] input[type="number"]').type("25");
    cy.contains("label", translate("ta", "Event location"))
      .find("input")
      .type("Jaffna");
    cy.get('[role="dialog"] textarea').type(
      "Our wedding photography requirements",
    );
    cy.get('[role="dialog"] button[type="submit"]').click();
    cy.wait("@inquiry");
    cy.contains(
      translate(
        "ta",
        "Your enquiry wasn’t sent. Your details are still here; please try again.",
      ),
    ).should("be.visible");
    cy.get('[role="dialog"] textarea').should(
      "have.value",
      "Our wedding photography requirements",
    );
  });
  it("loads a nationwide read-only batch and filters all districts with truthful errors", () => {
    let requests = 0;
    cy.intercept(
      "GET",
      "**/admin/vendors/applications/launch-overview*",
      (req) => {
        requests++;
        if (requests === 1) expect(req.query).not.to.have.property("district");
        if (requests === 2) {
          expect(req.query.district).to.equal("Jaffna");
          req.reply({ statusCode: 503 });
          return;
        }
        req.reply({
          body: {
            total: 1,
            page: 1,
            pageSize: 25,
            windowDays: 30,
            vendors: [
              {
                ...profile,
                district: "Jaffna",
                city: "Jaffna",
                category: "Photography",
                vendorStatus: "PENDING",
                missing: ["Photos", "Services"],
                inquiries: {
                  received: 3,
                  unanswered: 2,
                  replied: 1,
                  declined: 0,
                  needsDetails: 0,
                },
              },
            ],
          },
        });
      },
    ).as("launch");
    cy.visit("/admin/launch", { onBeforeLoad: (win) => auth(win, "ADMIN") });
    cy.wait("@launch");
    cy.contains("Real vendor").should("be.visible");
    cy.get('select[aria-label="District"] option').should("have.length", 26);
    cy.contains("View public profile").should("not.exist");
    cy.get('select[aria-label="District"]').select("Jaffna");
    cy.wait("@launch");
    cy.contains("This is not an empty vendor list.").should("be.visible");
    cy.contains("button", "Try again").click();
    cy.wait("@launch");
    cy.contains("Profiles needing help in this batch").should("be.visible");
    cy.contains("button", "Next batch").should("be.disabled");
  });
  it("does not request launch data for a non-admin", () => {
    cy.intercept(
      "GET",
      "**/admin/vendors/applications/launch-overview*",
      () => {
        throw new Error("No launch query allowed");
      },
    );
    cy.visit("/admin/launch", { onBeforeLoad: (win) => auth(win, "CUSTOMER") });
    cy.location('pathname').should('equal', '/admin/login');
  });
});
