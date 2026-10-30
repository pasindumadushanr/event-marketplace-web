import { demoInvitation } from "../../src/lib/invitations";
const id = "10000000-0000-4000-8000-000000000001";
const api = "http://127.0.0.1:3021";
describe("Invitation Studio first template", () => {
  it('renders published invitation metadata and does not expose missing drafts', () => {
    cy.request('/wedding/live-demo-wedding').then(({body,headers}) => {
      expect(headers['x-robots-tag']).to.contain('noindex');
      const doc = new DOMParser().parseFromString(body,'text/html');
      expect(doc.querySelector('meta[property="og:title"]')?.getAttribute('content')).to.contain('Amaya & Kasun');
      expect(doc.querySelector('meta[name="robots"]')?.getAttribute('content')).to.contain('noindex');
    });
    cy.request({url:'/wedding/unpublished-draft',failOnStatusCode:false}).its('status').should('eq',404);
    cy.visit('/wedding/live-demo-wedding');
    cy.get('button[aria-label="Open wedding invitation"]').click();
    cy.contains('a','RSVP on WhatsApp').should('have.attr','href').and('contain','94771234567');
    cy.contains('button','Download invitation card').click();
    cy.contains('[role="status"]','Card downloaded').should('be.visible');
    cy.readFile('cypress/downloads/wedding-invitation.png',null).should(buffer => expect(buffer.slice(1,4).toString()).to.equal('PNG'));
    cy.screenshot('w01-desktop-open',{capture:'viewport'});
  });
  beforeEach(() => {
    cy.intercept("GET", `${api}/public/invitations/catalogue`, {
      body: { orderPhone: "94771234567" },
    });
  });
  it("shows the template, actual price, demo, and WhatsApp order message on a phone", () => {
    cy.viewport(390, 844);
    cy.visit("/invitation-templates");
    cy.contains("h1", "A beautiful beginning").should("be.visible");
    cy.contains("LKR 2,500").should("exist");
    cy.contains("a", "Choose on WhatsApp")
      .invoke("attr", "href")
      .then((href) => {
        expect(href).to.contain("https://wa.me/94771234567");
        expect(new URL(href as string).searchParams.get("text")).to.contain(
          "W01",
        );
      });
    cy.contains("a", "View demo").click();
    cy.get('button[aria-label="Open wedding invitation"]')
      .should("be.visible")
      .click();
    cy.contains("h1", "Amaya").should("be.visible");
    cy.contains("a", "Get directions").should("have.attr", "target", "_blank");
    cy.contains("RSVP is disabled in this demo").should("exist");
    cy.get('button[aria-pressed="false"]').should("contain", "Sound off");
    cy.document().then((doc) =>
      expect(doc.documentElement.scrollWidth).to.be.at.most(390),
    );
    cy.screenshot("w01-phone-open", { capture: "viewport" });
  });
  it("requires a separate studio session without using the marketplace login", () => {
    cy.visit("/invitation-studio");
    cy.location("pathname").should("eq", "/invitation-studio/login");
    cy.contains("h1", "Invitation Studio").should("be.visible");
    cy.window().then((win) =>
      expect(win.localStorage.getItem("accessToken")).to.equal(null),
    );
  });
  it("supports email-code login for studio staff and stores only the studio session", () => {
    cy.intercept("POST", `${api}/auth/login`, {
      body: { requiresOtp: true, userId: id },
    }).as("login");
    cy.intercept("POST", `${api}/auth/verify-admin-login`, {
      body: {
        accessToken: "studio-test",
        user: { roleName: "INVITATION_STAFF" },
      },
    });
    cy.intercept("GET", `${api}/invitation-studio/session`, {
      body: { name: "Studio", role: "INVITATION_STAFF" },
    });
    cy.intercept("GET", `${api}/invitation-studio/invitations`, { body: [] });
    cy.intercept("GET", `${api}/invitation-studio/settings`, {
      body: { orderPhone: "" },
    });
    cy.visit("/invitation-studio/login");
    cy.get('input[type="email"]').type("studio@example.com");
    cy.get('input[type="password"]').type("long-staff-password");
    cy.contains("button", "Sign in to studio").click();
    cy.wait("@login");
    cy.get('input[aria-label="Email verification code"]').type("123456");
    cy.contains("button", "Verify & open studio").click();
    cy.contains("h2", "Beautiful beginnings").should("be.visible");
    cy.window().then((win) => {
      expect(win.sessionStorage.getItem("invitationStudioToken")).to.equal(
        "studio-test",
      );
      expect(win.localStorage.getItem("accessToken")).to.equal(null);
    });
  });
  it("saves drafts, preserves failed edits, previews, and publishes only after approval", () => {
    let row = {
      id,
      slug: "amaya-kasun",
      templateId: "W01",
      status: "DRAFT",
      revision: 1,
      draft: { ...demoInvitation, rsvpPhone: "94771234567" },
    };
    cy.intercept("GET", `${api}/invitation-studio/session`, {
      body: { role: "SUPER_ADMIN" },
    });
    cy.intercept("GET", `${api}/invitation-studio/settings`, {
      body: { orderPhone: "" },
    });
    cy.intercept("GET", `${api}/invitation-studio/invitations`, (req) =>
      req.reply({ body: [row] }),
    );
    cy.intercept("GET", `${api}/invitation-studio/invitations/${id}`, (req) =>
      req.reply({ body: row }),
    );
    let fail = true;
    cy.intercept(
      "PATCH",
      `${api}/invitation-studio/invitations/${id}`,
      (req) => {
        if (fail) {
          fail = false;
          req.reply({
            statusCode: 503,
            body: { message: "Please retry saving" },
          });
          return;
        }
        row = { ...row, draft: req.body.draft, revision: row.revision + 1 };
        req.reply({ body: row });
      },
    ).as("save");
    cy.intercept(
      "POST",
      `${api}/invitation-studio/invitations/${id}/actions`,
      (req) => {
        expect(req.body).to.include({
          action: "publish",
          approved: true,
          revision: 2,
        });
        row = { ...row, status: "PUBLISHED", revision: 3 };
        req.reply({ body: row });
      },
    ).as("publish");
    cy.viewport(390, 844);
    cy.visit("/invitation-studio", {
      onBeforeLoad(win) {
        win.sessionStorage.setItem("invitationStudioToken", "studio-test");
      },
    });
    cy.contains("button", "Open invitation").click();
    cy.contains("label", "First partner’s name")
      .find("input")
      .clear()
      .type("Amaya Updated");
    cy.contains("button", "Publish invitation").should("be.disabled");
    cy.contains("button", "Save draft").click();
    cy.wait("@save");
    cy.contains('[role="alert"]', "Please retry saving").should("be.visible");
    cy.contains("label", "First partner’s name")
      .find("input")
      .should("have.value", "Amaya Updated");
    cy.contains("button", "Save draft").click();
    cy.wait("@save");
    cy.contains("button", "Preview invitation").click();
    cy.get('button[aria-label="Open wedding invitation"]').click();
    cy.contains("h1", "Amaya Updated").should("be.visible");
    cy.contains("a", "RSVP on WhatsApp")
      .should("have.attr", "href")
      .and("contain", "94771234567");
    cy.contains("button", "Back to editor").click();
    cy.contains("button", "Publish invitation").should("be.disabled");
    cy.contains("label", "The customer approved").find("input").check();
    cy.contains("button", "Publish invitation").click();
    cy.wait("@publish");
    cy.contains("a", "Open live invitation").should(
      "have.attr",
      "href",
      "/wedding/amaya-kasun",
    );
    cy.document().then((doc) =>
      expect(doc.documentElement.scrollWidth).to.be.at.most(390),
    );
    cy.screenshot("invitation-studio-phone", { capture: "viewport" });
  });
  it("uses fragment review tokens and shows invalid review links honestly", () => {
    cy.intercept("POST", `${api}/public/invitations/review`, (req) => {
      expect(req.body).to.deep.equal({ id, token: "a".repeat(64) });
      req.reply({ statusCode: 404, body: {} });
    }).as("review");
    cy.visit(`/invitation-review/${id}#${"a".repeat(64)}`);
    cy.wait("@review");
    cy.contains('[role="alert"]', "expired").should("be.visible");
    cy.request(`/invitation-review/${id}`)
      .its("headers")
      .its("x-robots-tag")
      .should("contain", "noindex");
  });
});
