import { sinhalaDemoInvitation } from "../../src/lib/invitations";

function frame() {
  return cy
    .get('iframe[title="Wedding invitation — W02"]')
    .its("0.contentDocument.body")
    .should((body: HTMLBodyElement) =>
      expect(body.dataset.invitationReady).to.equal("true"),
    )
    .then((body) => cy.wrap(body));
}

describe("Sinhala invitation template", () => {
  it("still opens the original W01 design", () => {
    cy.visit("/invitation-templates/w01");
    cy.get('iframe[title="Wedding invitation — W01"]')
      .its("0.contentDocument.body")
      .should((body: HTMLBodyElement) =>
        expect(body.dataset.invitationReady).to.equal("true"),
      )
      .then((body) => {
        cy.wrap(body).find("#skip-intro").click();
        cy.wrap(body)
          .find(".hero h1")
          .should("contain", "Amaya")
          .and("be.visible");
      });
  });
  it("opens the Sinhala invitation on desktop and mobile without overflow", () => {
    [1280, 390].forEach((width) => {
      cy.viewport(width, 900);
      cy.visit("/invitation-templates/w02");
      frame().find("#cover h1").should("contain", "මංගල ඇරයුම");
      cy.screenshot(`w02-cover-${width}`, { capture: "viewport" });
      frame().find("#open").click();
      frame().find("#one").should("have.text", "අමායා");
      frame().find(".hero-date").should("contain", "සැප්තැම්බර් 18, සෙනසුරාදා");
      frame().find("#time").should("have.text", "ප.ව. 4:00");
      frame()
        .find("#welcome")
        .should("have.text", sinhalaDemoInvitation.welcome);
      frame().find("#reply").should("not.be.visible");
      frame()
        .find("#map")
        .should("have.attr", "href", sinhalaDemoInvitation.mapUrl);
      frame().then((body) =>
        expect(body[0].ownerDocument.documentElement.scrollWidth).to.be.at.most(
          width,
        ),
      );
      cy.screenshot(`w02-open-${width}`, { capture: "viewport" });
    });
  });
  it("offers both designs and includes W02 in its order message", () => {
    cy.intercept("GET", "**/public/invitations/catalogue", {
      body: { orderPhone: "94771234567" },
    });
    cy.visit("/invitation-templates");
    cy.contains("h2", "Olive & Ivory").should("exist");
    cy.contains("article", "මංගල ඇරයුම").within(() => {
      cy.contains("a", "View demo").should(
        "have.attr",
        "href",
        "/invitation-templates/w02",
      );
      cy.contains("a", "Choose on WhatsApp")
        .invoke("attr", "href")
        .then((href) => {
          expect(new URL(href!).searchParams.get("text")).to.contain(
            "W02 — මංගල ඇරයුම",
          );
        });
    });
  });
  it("saves the chosen Sinhala template and previews it in the studio", () => {
    cy.intercept("GET", "**/invitation-studio/session", {
      body: { role: "ADMIN" },
    });
    cy.intercept("GET", "**/invitation-studio/invitations", { body: [] });
    cy.intercept("GET", "**/invitation-studio/settings", {
      body: { orderPhone: "" },
    });
    cy.intercept("POST", "**/invitation-studio/invitations", (req) => {
      expect(req.body.templateId).to.equal("W02");
      expect(req.body.draft.welcome).to.equal(sinhalaDemoInvitation.welcome);
      req.reply({
        body: { id: "w02-test", ...req.body, revision: 1, status: "DRAFT" },
      });
    }).as("save");
    cy.visit("/invitation-studio", {
      onBeforeLoad(win) {
        win.sessionStorage.setItem("invitationStudioToken", "test");
      },
    });
    cy.contains("button", "Create invitation").click();
    cy.contains("button", "Use W02").click();
    cy.contains("label", "Invitation link name")
      .find("input")
      .type("sinhala-wedding");
    cy.contains("button", "Save draft").click();
    cy.wait("@save");
    cy.contains("button", "Preview invitation").click();
    frame().find("#open").click();
    frame().find("#welcome").should("have.text", sinhalaDemoInvitation.welcome);
  });
  it("renders the review's template and treats guest text as text", () => {
    cy.intercept("POST", "**/public/invitations/review", {
      body: {
        templateId: "W02",
        content: {
          ...sinhalaDemoInvitation,
          partnerOne: "<img src=x onerror=alert(1)>",
        },
      },
    });
    cy.visit("/invitation-review/10000000-0000-4000-8000-000000000001#test");
    frame().find("#open").click();
    frame().find("#one").should("have.text", "<img src=x onerror=alert(1)>");
    frame().find("#one img").should("not.exist");
    frame().find("#reply").should("not.be.visible");
  });
});
