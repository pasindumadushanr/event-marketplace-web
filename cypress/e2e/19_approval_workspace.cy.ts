import { safeAssetUrl } from "../../src/components/admin/application-review";
const id = "3bc1bc7b-fb65-4af0-8119-f25b0b2f844c";
function auth(win: Window, role = "SUPER_ADMIN") {
  win.localStorage.setItem("accessToken", "test-only");
  win.localStorage.setItem(
    "user",
    JSON.stringify({ id: "reviewer", firstName: "Review", roleName: role }),
  );
}
const categories = [
  {
    id: "photo",
    name: "Photography",
    slug: "photography",
    parentId: null,
    status: "ACTIVE",
  },
];
function details(status = "UNDER_REVIEW") {
  return {
    application: {
      id,
      name: "Sunrise Weddings",
      description: "Real event photography in Jaffna",
      categoryId: "photo",
      category: categories[0],
      email: "business@example.com",
      phone: "0771234567",
      address: "25 Main Road",
      city: "Jaffna",
      district: "Jaffna",
      province: "Northern",
      country: "Sri Lanka",
      vendorStatus: status,
      status: "INACTIVE",
      submittedAt: "2026-10-01T12:00:00Z",
      createdAt: "2026-10-01T12:00:00Z",
      waitingDays: 5,
      vendor: {
        id: "vendor",
        firstName: "Real",
        lastName: "Vendor",
        email: "vendor@example.com",
        emailVerified: true,
        status: "ACTIVE",
      },
      isVerified: false,
      logo: "/images/brand/nakathata-logo.jpg",
      coverImage: "/images/brand/nakathata-logo.jpg",
      galleries: [],
      documents: [
        {
          id: "doc",
          type: "BUSINESS_REGISTRATION",
          status: "PENDING",
          url: "/images/brand/nakathata-logo.jpg",
        },
      ],
      packages: [
        {
          id: "p",
          name: "Full day package",
          price: "125000",
          description: "Wedding photos",
          features: ["Full day"],
          status: "ACTIVE",
        },
      ],
      contentSections: [],
      profileSettings: { policies: { bookingPolicy: "Contact us first" } },
      informationRequest:
        status === "NEEDS_INFO"
          ? "Upload a clearer registration document"
          : null,
    },
    history: { items: [] as any[], total: 0, page: 1, pageSize: 25 },
  };
}
function mocks(data: ReturnType<typeof details>) {
  cy.intercept("GET", "**/business-categories", { body: categories });
  cy.intercept("GET", `**/admin/vendors/applications/${id}?*`, (req) =>
    req.reply({ body: data }),
  ).as("detail");
  cy.on("window:confirm", () => true);
}
describe("Vendor approval workspace", () => {
  it("filters, switches queues, paginates and shows waiting badges on phones", () => {
    cy.viewport(390, 844);
    cy.intercept("GET", "**/business-categories", { body: categories });
    cy.intercept("GET", "**/admin/vendors/applications?*", (req) =>
      req.reply({
        body: {
          items: [
            details(
              String(req.query.status) === "APPROVED"
                ? "APPROVED"
                : "UNDER_REVIEW",
            ).application,
          ],
          total: 26,
          page: Number(req.query.page),
          pageSize: 25,
          counts: { pending: 26, approved: 2, rejected: 1 },
        },
      }),
    ).as("queue");
    cy.visit("/admin/vendors/approvals", { onBeforeLoad: (win) => auth(win) });
    cy.wait("@queue");
    cy.contains("5 days waiting").should("be.visible");
    cy.contains("button", "Filters").click();
    cy.get('[aria-label="Search applications"]').type("Sunrise");
    cy.get('[aria-label="District"]').select("Jaffna");
    cy.get('[aria-label="Category"]').select("photo");
    cy.get('[aria-label="Submitted from"]').type("2026-10-01");
    cy.get('[aria-label="Submitted to"]').type("2026-10-07");
    cy.contains("button", "Apply filters").click();
    cy.wait("@queue").then(({ request }) =>
      expect(request.query).to.include({
        q: "Sunrise",
        district: "Jaffna",
        categoryId: "photo",
        from: "2026-10-01",
        to: "2026-10-07",
        workspace: "1",
      }),
    );
    cy.contains("button", "Next").click();
    cy.wait("@queue").then(({ request }) =>
      expect(request.query.page).to.equal("2"),
    );
    cy.get('[role="tab"]').contains("Approved").click();
    cy.wait("@queue").then(({ request }) =>
      expect(request.query).to.include({ status: "APPROVED", page: "1" }),
    );
    cy.contains("Not published").should("be.visible");
    cy.contains("button", "Filters").click();
    cy.contains("button", "Reset filters").click();
    cy.wait("@queue");
    cy.contains('button', 'Filters').click();
    cy.document().then((doc) =>
      expect(doc.documentElement.scrollWidth).to.be.at.most(390),
    );
    cy.screenshot("approval-queue-phone", { capture: "viewport" });
  });
  it("recovers from a queue error while preserving filters", () => {
    let calls = 0;
    cy.intercept("GET", "**/business-categories", { body: categories });
    cy.intercept("GET", "**/admin/vendors/applications?*", (req) =>
      ++calls < 2
        ? req.reply({ statusCode: 503 })
        : req.reply({
            body: {
              items: [],
              total: 0,
              pageSize: 25,
              counts: { pending: 0, approved: 0, rejected: 0 },
            },
          }),
    );
    cy.visit("/admin/vendors/approvals", { onBeforeLoad: (win) => auth(win) });
    cy.contains("button", "Try again").click();
    cy.contains("No matching applications").should("be.visible");
  });
  it("shows full details, file previews and private notes on a phone without emailing notes", () => {
    const data = details();
    mocks(data);
    cy.viewport(390, 844);
    cy.intercept("POST", `**/admin/vendors/applications/${id}/notes`, (req) => {
      expect(req.body).to.deep.equal({ note: "Registration checked by phone" });
      data.history.items.push({
        id: "n",
        actorName: "Review Team",
        action: "NOTE",
        message: req.body.note,
        notificationStatus: "NOT_REQUIRED",
        createdAt: "2026-10-07T00:00:00Z",
      });
      data.history.total = 1;
      req.reply({ body: { id: "n" } });
    }).as("note");
    cy.visit(`/admin/vendors/approvals/${id}`, {
      onBeforeLoad: (win) => auth(win),
    });
    cy.wait("@detail");
    cy.contains("h1", "Sunrise Weddings").should("be.visible");
    cy.contains("Approval and publication are separate").should("be.visible");
    cy.get('img[alt="Business logo"]').should(
      "have.attr",
      "src",
      "/images/brand/nakathata-logo.jpg",
    );
    cy.get("a")
      .contains("Open BUSINESS REGISTRATION")
      .should("have.attr", "rel", "noopener noreferrer");
    cy.get('[aria-label="Private reviewer note"]').type(
      "Registration checked by phone",
    );
    cy.contains("button", "Save private note").click();
    cy.wait("@note");
    cy.wait("@detail");
    cy.contains("h3", "Private reviewer note").should("exist");
    cy.contains("Registration checked by phone").should("exist");
    cy.contains("Email accepted by provider").should("not.exist");
    cy.document().then((doc) =>
      expect(doc.documentElement.scrollWidth).to.be.at.most(390),
    );
    cy.screenshot("application-detail-phone", { capture: "viewport" });
  });
  it("requests information without rejecting and can retry a failed email", () => {
    const data = details();
    mocks(data);
    cy.intercept(
      "PATCH",
      `**/admin/vendors/applications/${id}/request-information`,
      (req) => {
        expect(req.body).to.deep.equal({
          message: "Upload a clearer registration document",
        });
        data.application.vendorStatus = "NEEDS_INFO";
        data.application.informationRequest = req.body.message;
        data.history.items = [
          {
            id: "e",
            action: "INFORMATION_REQUESTED",
            actorName: "Review Team",
            message: req.body.message,
            createdAt: "2026-10-07T00:00:00Z",
            notificationStatus: "FAILED",
          },
        ];
        data.history.total = 1;
        req.reply({ body: { notification: "FAILED" } });
      },
    ).as("request");
    cy.intercept(
      "POST",
      `**/admin/vendors/applications/${id}/notifications/e/retry`,
      (req) => {
        data.history.items[0].notificationStatus = "SENT";
        req.reply({ body: { notification: "SENT" } });
      },
    ).as("retry");
    cy.visit(`/admin/vendors/approvals/${id}`, {
      onBeforeLoad: (win) => auth(win),
    });
    cy.wait("@detail");
    cy.get('[aria-label="Vendor message"]').type(
      "Upload a clearer registration document",
    );
    cy.contains("button", "Request more information").click();
    cy.wait("@request");
    cy.wait("@detail");
    cy.contains("Waiting for the vendor to update and resubmit").should(
      "be.visible",
    );
    cy.contains("button", "Retry email notification").click();
    cy.wait("@retry");
    cy.wait("@detail");
    cy.contains("Email accepted by provider").should("be.visible");
    cy.screenshot("application-request-history", { capture: "viewport" });
  });
  it("approves applications with explicit separate publishing instructions", () => {
    const data = details();
    mocks(data);
    cy.intercept(
      "PATCH",
      `**/admin/vendors/applications/${id}/approve`,
      (req) => {
        data.application.vendorStatus = "APPROVED";
        req.reply({ body: { notification: "SENT" } });
      },
    ).as("approve");
    cy.visit(`/admin/vendors/approvals/${id}`, {
      onBeforeLoad: (win) => auth(win),
    });
    cy.wait("@detail");
    cy.get('[aria-label="Review action"]').select("approve");
    cy.contains("vendor must complete setup and publish").should("be.visible");
    cy.contains("button", "Approve application").click();
    cy.wait("@approve");
    cy.wait("@detail");
    cy.contains("Public profile not published").should("be.visible");
    cy.contains("Approve & Activate").should("not.exist");
  });
  it("keeps a rejection reason on failed save, then displays the saved decision", () => {
    const data = details();
    mocks(data);
    let attempts = 0;
    cy.intercept(
      "PATCH",
      `**/admin/vendors/applications/${id}/reject`,
      (req) => {
        expect(req.body.reason).to.equal("Please provide valid registration");
        if (++attempts === 1) return req.reply({ statusCode: 503 });
        data.application.vendorStatus = "REJECTED";
        data.history.items = [
          {
            id: "e",
            actorName: "Review Team",
            action: "REJECTED",
            message: req.body.reason,
            notificationStatus: "SENT",
            createdAt: "2026-10-07T00:00:00Z",
          },
        ];
        data.history.total = 1;
        req.reply({ body: { notification: "SENT" } });
      },
    ).as("reject");
    cy.visit(`/admin/vendors/approvals/${id}`, {
      onBeforeLoad: (win) => auth(win),
    });
    cy.wait("@detail");
    cy.get('[aria-label="Review action"]').select("reject");
    cy.get('[aria-label="Vendor message"]').type(
      "Please provide valid registration",
    );
    cy.contains("button", "Reject application").click();
    cy.wait("@reject");
    cy.get('[aria-label="Vendor message"]').should(
      "have.value",
      "Please provide valid registration",
    );
    cy.contains("button", "Reject application").click();
    cy.wait("@reject");
    cy.wait("@detail");
    cy.contains("h3", "Application rejected").should("be.visible");
    cy.contains("Email accepted by provider").should("be.visible");
  });
  it("lets vendors see requests, upload documents and resubmit their existing application", () => {
    const data = details("NEEDS_INFO");
    let status = "NEEDS_INFO";
    cy.intercept("GET", "**/vendor/business/onboarding/status", (req) =>
      req.reply({
        body: {
          vendorStatus: status,
          emailVerified: true,
          informationRequest: data.application.informationRequest,
        },
      }),
    );
    cy.intercept("GET", "**/vendor/business", (req) =>
      req.headers.authorization
        ? req.reply({ body: { ...data.application, vendorStatus: status } })
        : req.continue(),
    );
    cy.intercept("GET", "**/vendor/documents", { body: [] });
    cy.intercept("GET", "**/business-categories", { body: categories });
    cy.intercept("POST", "**/vendor/business/onboarding/resubmit", (req) => {
      expect(req.body).to.include({
        name: "Updated Weddings",
        categoryId: "photo",
        logo: "/images/brand/nakathata-logo.jpg",
        phone: "0771234567",
      });
      expect(req.body).not.to.have.property("vendorStatus");
      status = "UNDER_REVIEW";
      req.reply({ body: { message: "Resubmitted" } });
    }).as("resubmit");
    cy.visit("/vendor", { onBeforeLoad: (win) => auth(win, "VENDOR") });
    cy.contains("A few more details are needed").should("be.visible");
    cy.contains("a", "Upload requested documents").click();
    cy.location("pathname").should("eq", "/vendor/documents");
    cy.visit("/vendor/onboarding");
    cy.get('[name="name"]')
      .should("have.value", "Sunrise Weddings")
      .clear()
      .type("Updated Weddings");
    for (let i = 0; i < 4; i++) cy.contains("button", "Next").click();
    cy.contains("button", "Submit Application").click();
    cy.wait("@resubmit");
    cy.location("pathname").should("eq", "/vendor");
    cy.contains("Application Under Review").should("be.visible");
  });
  it("rejects unsafe preview URLs", () => {
    for (const url of [
      "javascript:alert(1)",
      "data:text/html,hello",
      "//evil.test/path",
    ]) {
      expect(safeAssetUrl(url)).to.be.null;
    }
    expect(safeAssetUrl("/images/logo.jpg")).to.equal("/images/logo.jpg");
  });
});
