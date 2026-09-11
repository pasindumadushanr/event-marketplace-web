describe('04 - Booking & Checkout Workflow', () => {
  beforeEach(() => {
    cy.viewport(1280, 800);
  });

  it('renders the mock checkout interface when provided a valid session', () => {
    const mockSession = {
      id: 'session-qa-123',
      businessName: 'Grand Royal Photography',
      packageName: 'Silver Wedding Package',
      totalAmount: 150000,
      paymentStatus: 'PENDING',
    };

    cy.intercept('GET', '**/payments/session/session-qa-123', {
      statusCode: 200,
      body: mockSession,
    }).as('getSession');

    cy.visit('/checkout/mock?session_id=session-qa-123');
    cy.wait('@getSession');

    cy.contains('Checkout (Mock Mode)').should('be.visible');
    cy.contains('Grand Royal Photography').should('be.visible');
    cy.contains('Silver Wedding Package').should('be.visible');
    cy.contains(/150,000/).should('be.visible');
    cy.contains('Simulate Successful Payment').should('be.visible');
    cy.contains('Simulate Failed Payment').should('be.visible');
  });

  it('successfully simulates a successful payment and redirects to success page', () => {
    const mockSession = {
      id: 'session-qa-456',
      businessName: 'Grand Royal Photography',
      packageName: 'Gold Wedding Package',
      totalAmount: 250000,
      paymentStatus: 'PENDING',
    };

    cy.intercept('GET', '**/payments/session/session-qa-456', {
      statusCode: 200,
      body: mockSession,
    }).as('getSession');

    cy.intercept('POST', '**/payments/process', {
      statusCode: 200,
      body: { success: true },
    }).as('processPayment');

    cy.visit('/checkout/mock?session_id=session-qa-456');
    cy.wait('@getSession');

    cy.contains('Simulate Successful Payment').click();
    cy.wait('@processPayment');

    // Asserts transition to success page
    cy.url().should('include', '/checkout/success');
    cy.contains('Payment Successful!').should('be.visible');
  });

  it('handles simulated failed payment and redirects to cancel page', () => {
    const mockSession = {
      id: 'session-qa-789',
      businessName: 'Grand Royal Photography',
      packageName: 'Bronze Package',
      totalAmount: 50000,
      paymentStatus: 'PENDING',
    };

    cy.intercept('GET', '**/payments/session/session-qa-789', {
      statusCode: 200,
      body: mockSession,
    }).as('getSession');

    cy.intercept('POST', '**/payments/process', {
      statusCode: 200,
      body: { success: false, status: 'FAILED' },
    }).as('processPayment');

    cy.visit('/checkout/mock?session_id=session-qa-789');
    cy.wait('@getSession');

    cy.contains('Simulate Failed Payment').click();
    cy.wait('@processPayment');

    // Asserts transition to cancel page
    cy.url().should('include', '/checkout/cancel');
    cy.contains(/Cancelled|Payment Cancelled/i).should('be.visible');
  });
});
