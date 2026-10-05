import { INQUIRY_PREFIX } from "../../src/lib/inquiry-record";
const event = {
  kind: "INQUIRY",
  eventDate: "2099-01-01",
  location: "Colombo Garden",
  guestCount: 150,
  requirements: "Outdoor wedding photography with an album",
};
const inquiry = {
  id: "inquiry",
  conversationId: "room",
  senderId: "c1",
  content: INQUIRY_PREFIX + JSON.stringify(event),
  createdAt: "2026-10-06T10:00:00Z",
  isRead: false,
};
const business = {
  id: "vendor-test",
  name: "Wedding Studio",
  status: "ACTIVE",
  category: { name: "Photography" },
  profileSettings: { bookingMethod: "REQUEST_QUOTE" },
  packages: [],
};
function auth(win: Window, vendor = false) {
  win.localStorage.setItem("accessToken", "test-only");
  win.localStorage.setItem(
    "user",
    JSON.stringify({
      id: vendor ? "v1" : "c1",
      firstName: "Test",
      roleName: vendor ? "VENDOR" : "CUSTOMER",
    }),
  );
}
function fill() {
  cy.contains("label", "Event date").find("input").type(event.eventDate);
  cy.contains("label", "Guest count")
    .find("input")
    .type(String(event.guestCount));
  cy.contains("label", "Event location").find("input").type(event.location);
  cy.contains("label", "Your requirements")
    .find("textarea")
    .type(event.requirements);
}
function vendorInbox(history: any[]) {
  cy.intercept("GET", "**/vendor/business/onboarding/status", {
    body: { vendorStatus: "APPROVED", emailVerified: true },
  });
  cy.intercept("GET", "**/vendor/business", (req) =>
    req.headers.authorization ? req.reply({ body: business }) : req.continue(),
  );
  cy.intercept("GET", "**/chat/conversations?mode=vendor", {
    body: [
      {
        id: "room",
        customer: { id: "c1", firstName: "Customer", lastName: "One" },
        messages: [inquiry],
      },
    ],
  });
  cy.intercept("GET", "**/chat/conversations/room/messages", (req) =>
    req.reply({ body: history }),
  );
  cy.intercept("POST", "**/chat/conversations/room/read", { body: {} });
  cy.visit("/vendor/messages", { onBeforeLoad: (win) => auth(win, true) });
  cy.contains("button", "Customer One").click();
}
describe("Customer event enquiries", () => {
  it("keeps all fields and the request reference on a failed submission, then opens the right conversation", () => {
    cy.intercept("GET", "**/discovery/vendors/vendor-test", { body: business });
    cy.intercept("GET", "**/chat/conversations", {
      body: [
        {
          id: "room",
          business: { name: "Wedding Studio" },
          messages: [inquiry],
        },
      ],
    });
    cy.intercept("GET", "**/chat/conversations/room/messages", {
      body: [inquiry],
    });
    cy.intercept("POST", "**/chat/conversations/room/read", { body: {} });
    let firstId: string;
    let calls = 0;
    cy.intercept("POST", "**/chat/inquiries", (req) => {
      expect(req.body).to.include({
        businessId: "vendor-test",
        eventDate: event.eventDate,
        location: event.location,
        guestCount: 150,
        requirements: event.requirements,
      });
      calls++;
      if (calls === 1) {
        firstId = req.body.requestId;
        req.reply({ statusCode: 500 });
      } else {
        expect(req.body.requestId).to.equal(firstId);
        req.reply({ body: { conversationId: "room", inquiry } });
      }
    }).as("send");
    cy.visit("/business/vendor-test", { onBeforeLoad: (win) => auth(win) });
    cy.contains("button", "Request a Quote").click();
    cy.contains("button", "Send enquiry").click();
    cy.get('[role="dialog"]').should("be.visible");
    fill();
    cy.viewport(390, 844);
    cy.screenshot("customer-enquiry-form-mobile");
    cy.contains("button", "Send enquiry").click();
    cy.wait("@send");
    cy.contains("Your enquiry wasn’t sent").should("be.visible");
    cy.contains("label", "Your requirements")
      .find("textarea")
      .should("have.value", event.requirements);
    cy.contains("button", "Send enquiry").click();
    cy.wait("@send");
    cy.location("search").should("eq", "?conversation=room");
    cy.contains("article", event.location).should("be.visible");
    cy.contains("button", "Decline").should("not.exist");
    cy.document().then((doc) =>
      expect(doc.documentElement.scrollWidth).to.be.at.most(390),
    );
  });
  it("shows the event summary and saves reply, request-details and decline actions through reload", () => {
    const history: any[] = [
      inquiry,
      {
        id: "legacy",
        conversationId: "room",
        senderId: "c1",
        content: "Hello, do you travel?",
        createdAt: "2026-10-06T11:00:00Z",
      },
    ];
    vendorInbox(history);
    cy.contains("Hello, do you travel?").should("be.visible");
    cy.contains("article", "Colombo Garden").should("be.visible");
    cy.screenshot("vendor-enquiry-actions-desktop");
    cy.intercept(
      "POST",
      "**/chat/conversations/room/inquiries/inquiry/respond",
      (req) => {
        const message = {
          id: req.body.requestId,
          conversationId: "room",
          senderId: "v1",
          content:
            INQUIRY_PREFIX +
            JSON.stringify({
              kind: "RESPONSE",
              inquiryId: "inquiry",
              action: req.body.action,
              text: req.body.text,
            }),
          createdAt: new Date().toISOString(),
        };
        history.push(message);
        req.reply({ body: message });
      },
    ).as("respond");
    for (const [button, label, submit, action, status] of [
      ["Reply", "Your reply", "Send reply", "REPLIED", "Replied"],
      [
        "Request more details",
        "What details do you need?",
        "Send request for details",
        "NEEDS_DETAILS",
        "More details requested",
      ],
      [
        "Decline",
        "Reason for declining",
        "Send decline",
        "DECLINED",
        "Declined",
      ],
    ]) {
      cy.contains("button", button).click();
      cy.contains("label", label)
        .find("textarea")
        .clear()
        .type("Thank you. Please contact us about your event.");
      cy.contains("button", submit).click();
      cy.wait("@respond").its("request.body.action").should("eq", action);
      cy.contains("article", status).should("be.visible");
    }
    cy.reload();
    cy.contains("button", "Customer One").click();
    cy.contains("article", "Declined").should("be.visible");
    cy.contains("button", "Decline").should("not.exist");
    cy.contains(INQUIRY_PREFIX).should("not.exist");
  });
  it("retains failed vendor responses and failed ordinary messages", () => {
    vendorInbox([inquiry]);
    cy.contains("button", "Request more details").click();
    cy.contains("label", "What details do you need?")
      .find("textarea")
      .clear()
      .type("What time is the ceremony?");
    cy.intercept(
      "POST",
      "**/chat/conversations/room/inquiries/inquiry/respond",
      { statusCode: 500 },
    );
    cy.contains("button", "Send request for details").click();
    cy.contains("Your response wasn’t sent").should("be.visible");
    cy.contains("label", "What details do you need?")
      .find("textarea")
      .should("have.value", "What time is the ceremony?");
    cy.contains("button", "Cancel").click();
    cy.get('input[aria-label="Message"]').type("A general follow-up message");
    cy.intercept("POST", "**/chat/conversations/room/messages", {
      statusCode: 500,
    });
    cy.get('button[aria-label="Send message"]').click();
    cy.contains("Your message wasn’t sent").should("be.visible");
    cy.get('input[aria-label="Message"]').should(
      "have.value",
      "A general follow-up message",
    );
  });
});
