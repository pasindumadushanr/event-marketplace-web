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

  it('allows customers to view their bookings and submit a cancellation request', () => {
    const mockBookings = [
      {
        id: 'booking-cancel-test-1',
        date: new Date(Date.now() + 86400000 * 7).toISOString(),
        totalAmount: 120000,
        status: 'PENDING',
        paymentStatus: 'PENDING',
        business: {
          id: 'biz-1',
          name: 'Grand Royal Photography',
        },
        package: {
          name: 'Platinum Wedding Package',
          duration: '8 Hours',
        },
      },
    ];

    cy.intercept('GET', '**/customer/account/bookings', {
      statusCode: 200,
      body: mockBookings,
    }).as('getCustomerBookings');

    cy.intercept('PATCH', '**/bookings/booking-cancel-test-1/cancel', {
      statusCode: 200,
      body: {
        ...mockBookings[0],
        status: 'CANCELLED',
        notes: '[Customer Cancellation: Change of event plans]',
      },
    }).as('cancelBooking');

    cy.visit('/account/bookings');
    cy.wait('@getCustomerBookings');

    cy.contains('My Bookings').should('be.visible');
    cy.contains('Grand Royal Photography').should('be.visible');
    cy.contains('Platinum Wedding Package').should('be.visible');

    // Click Cancel Request button
    cy.contains('button', 'Cancel Request').should('be.visible').click();

    // Confirm modal opens
    cy.contains('Cancel Booking').should('be.visible');
    cy.contains('Are you sure you want to cancel your booking request').should('be.visible');

    // Enter reason
    cy.get('textarea').type('Change of event plans');
    cy.contains('button', 'Confirm Cancellation').click();
    cy.wait('@cancelBooking');

    // Verify booking UI shows cancelled status
    cy.contains(/This booking request was cancelled/i).should('be.visible');
  });
});

