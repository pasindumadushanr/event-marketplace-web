describe('06 - Complete Multi-Persona Lifecycle & User Scenarios', () => {
  beforeEach(() => {
    cy.viewport(1280, 800);
  });

  const mockVendorUser = {
    id: 'vendor-user-lifecycle-1',
    email: 'vendor.director@luxeevents.fun',
    firstName: 'Marcus',
    lastName: 'Vance',
    roleName: 'VENDOR',
  };

  const mockCustomerUser = {
    id: 'customer-user-lifecycle-2',
    email: 'elena.rodriguez@gmail.com',
    firstName: 'Elena',
    lastName: 'Rodriguez',
    roleName: 'CUSTOMER',
  };

  const mockBusiness = {
    id: 'biz-lifecycle-101',
    slug: 'grand-royal-photography',
    name: 'Grand Royal Photography',
    description: 'Premier wedding and editorial photography based in Colombo, Sri Lanka.',
    city: 'Colombo',
    address: '45 Galle Road, Colombo 03',
    phone: '+94 77 123 4567',
    email: 'hello@grandroyalphotography.com',
    website: 'https://grandroyalphotography.com',
    logo: 'https://images.unsplash.com/photo-1542038784456-1ea8e935640e?w=200',
    coverImage: 'https://images.unsplash.com/photo-1519741497674-611481863552?w=1200',
    isVerified: true,
    status: 'ACTIVE',
    rating: 5.0,
    reviewCount: 1,
    categoryId: 'cat-photography',
    category: { name: 'Photography', slug: 'photography' },
    packages: [
      {
        id: 'pkg-royal-platinum',
        name: 'Platinum Wedding Story',
        description: 'Full day coverage with two master photographers and 4K aerial drone cinematics.',
        price: 350000,
        duration: '12 Hours',
        features: ['2 Master Photographers', '4K Drone Coverage', '500+ Hand-Edited Photos', 'Flush-Mount Album'],
        image: 'https://images.unsplash.com/photo-1537633552985-df8429e8048b?w=600'
      }
    ],
    profileSettings: {
      features: [
        { groupName: 'Amenities', features: ['Drone Permitted', 'Same-Day Preview'] }
      ],
      hours: [
        { day: 'monday', openTime: '08:30', closeTime: '18:00', isClosed: false },
        { day: 'tuesday', openTime: '08:30', closeTime: '18:00', isClosed: false },
        { day: 'wednesday', openTime: '08:30', closeTime: '18:00', isClosed: false },
        { day: 'thursday', openTime: '08:30', closeTime: '18:00', isClosed: false },
        { day: 'friday', openTime: '08:30', closeTime: '18:00', isClosed: false },
        { day: 'saturday', openTime: '09:00', closeTime: '17:00', isClosed: false },
        { day: 'sunday', openTime: '10:00', closeTime: '15:00', isClosed: true }
      ],
      policies: {
        bookingPolicy: '30% advance deposit is required to lock in the calendar date.',
        cancellationPolicy: 'Cancellations up to 30 days prior receive a full refund minus processing fee.'
      },
      seo: {
        metaTitle: 'Grand Royal Photography | Best Wedding Photographer in Colombo',
        metaDescription: 'Book premier wedding coverage in Sri Lanka.'
      },
      blockedDates: ['2026-12-25', '2026-12-31']
    }
  };

  it('Scenario 1: Vendor publishes and unpublishes business profile from dashboard', () => {
    cy.intercept('GET', '**/vendor/business', {
      statusCode: 200,
      body: mockBusiness
    }).as('getVendorBusiness');

    cy.intercept('PATCH', '**/vendor/business/unpublish', {
      statusCode: 200,
      body: { ...mockBusiness, status: 'INACTIVE' }
    }).as('unpublishBusiness');

    cy.intercept('PATCH', '**/vendor/business/publish', {
      statusCode: 200,
      body: { ...mockBusiness, status: 'ACTIVE' }
    }).as('publishBusiness');

    cy.visit('/vendor', {
      onBeforeLoad(win) {
        win.localStorage.setItem('accessToken', 'mock-vendor-token');
        win.localStorage.setItem('user', JSON.stringify(mockVendorUser));
      }
    });
    cy.wait('@getVendorBusiness');

    // Business is currently Live & Active
    cy.contains('Live & Active').should('be.visible');
    cy.contains('button', 'Unpublish Business').should('be.visible').click();

    // Verify unpublish PATCH was called and toast displayed
    cy.wait('@unpublishBusiness');
    cy.contains(/unpublished|hidden/i, { timeout: 6000 }).should('be.visible');

    // Now unpublish state is active -> can publish again
    cy.contains('button', 'Publish Business').should('be.visible').click();
    cy.wait('@publishBusiness');
    cy.contains(/live on the marketplace/i, { timeout: 6000 }).should('be.visible');
  });

  it('Scenario 2: Customer storefront booking, blackout date rejection, and inquiry submission', () => {
    cy.intercept('GET', '**/discovery/vendors/grand-royal-photography', {
      statusCode: 200,
      body: mockBusiness
    }).as('getStorefront');

    cy.intercept('POST', '**/bookings', {
      statusCode: 201,
      body: {
        id: 'booking-lifecycle-202',
        date: '2026-11-15',
        notes: 'Outdoor sunset garden ceremony at Cinnamon Grand.',
        packageId: 'pkg-royal-platinum',
        status: 'PENDING'
      }
    }).as('createBooking');

    cy.intercept('POST', '**/payments/create-session', {
      statusCode: 201,
      body: {
        id: 'session-lifecycle-303',
        url: '/checkout/mock?session_id=session-lifecycle-303'
      }
    }).as('createPaymentSession');

    cy.visit('/business/grand-royal-photography', {
      onBeforeLoad(win) {
        win.localStorage.setItem('accessToken', 'mock-customer-token');
        win.localStorage.setItem('user', JSON.stringify(mockCustomerUser));
      }
    });
    cy.wait('@getStorefront');

    // Storefront hero and details are visible
    cy.contains('Grand Royal Photography').should('be.visible');
    cy.contains('Service Packages').should('be.visible');
    cy.contains('Platinum Wedding Story').should('be.visible');

    // Click request package
    cy.contains('button', 'Request this Package').first().click();

    // Booking modal opens
    cy.contains('Request Booking').should('be.visible');
    cy.contains('Platinum Wedding Story').should('be.visible');

    // Try blacked-out date (e.g. 2026-12-25)
    cy.get('input[type="date"]').type('2026-12-25');
    cy.contains(/blacked out by vendor|unavailable/i).should('be.visible');
    cy.contains('button', 'Submit Request').should('be.disabled');

    // Choose valid available date
    cy.get('input[type="date"]').clear().type('2026-11-15');
    cy.contains(/blacked out by vendor/i).should('not.exist');
    cy.contains('button', 'Submit Request').should('not.be.disabled');

    // Enter event notes and submit
    cy.get('textarea').type('Outdoor sunset garden ceremony at Cinnamon Grand.');
    cy.contains('button', 'Submit Request').click();

    // Verify booking creation and payment session redirects
    cy.wait('@createBooking');
    cy.wait('@createPaymentSession');
    cy.url().should('include', '/checkout/mock?session_id=session-lifecycle-303');
  });

  it('Scenario 3: Customer completes advance payment deposit on checkout mock page', () => {
    const mockSession = {
      id: 'session-lifecycle-303',
      businessName: 'Grand Royal Photography',
      packageName: 'Platinum Wedding Story',
      totalAmount: 350000,
      paymentStatus: 'PENDING'
    };

    cy.intercept('GET', '**/payments/session/session-lifecycle-303', {
      statusCode: 200,
      body: mockSession
    }).as('getSession');

    cy.intercept('POST', '**/payments/process', {
      statusCode: 200,
      body: { success: true }
    }).as('processPayment');

    cy.visit('/checkout/mock?session_id=session-lifecycle-303');
    cy.wait('@getSession');

    cy.contains('Grand Royal Photography').should('be.visible');
    cy.contains('Platinum Wedding Story').should('be.visible');
    cy.contains(/350,000/).should('be.visible');

    // Execute simulated payment
    cy.contains('button', 'Simulate Successful Payment').click();
    cy.wait('@processPayment');

    // Confirm redirection to checkout success page
    cy.url().should('include', '/checkout/success');
    cy.contains('Payment Successful!').should('be.visible');
  });

  it('Scenario 4: Vendor reviews booking, approves request, and completes event lifecycle', () => {
    const initialBookings = [
      {
        id: 'booking-lifecycle-202',
        date: '2026-11-15T00:00:00.000Z',
        status: 'PENDING',
        paymentStatus: 'PENDING',
        totalAmount: 350000,
        notes: 'Outdoor sunset garden ceremony at Cinnamon Grand.',
        customer: {
          firstName: 'Elena',
          lastName: 'Rodriguez',
          email: 'elena.rodriguez@gmail.com',
          phone: '+94 71 987 6543'
        },
        package: {
          name: 'Platinum Wedding Story'
        }
      }
    ];

    cy.intercept('GET', '**/bookings/vendor', (req) => {
      req.reply({ statusCode: 200, body: initialBookings });
    }).as('getVendorBookings');

    cy.intercept('PATCH', '**/bookings/vendor/booking-lifecycle-202/status', (req) => {
      req.reply({
        statusCode: 200,
        body: { ...initialBookings[0], status: req.body.status }
      });
    }).as('updateBookingStatus');

    cy.visit('/vendor/bookings', {
      onBeforeLoad(win) {
        win.localStorage.setItem('accessToken', 'mock-vendor-token');
        win.localStorage.setItem('user', JSON.stringify(mockVendorUser));
      }
    });
    cy.wait('@getVendorBookings');

    // Check incoming pending booking
    cy.contains('Elena Rodriguez').should('be.visible');
    cy.contains('Platinum Wedding Story').should('be.visible');
    cy.contains('Pending Review').should('be.visible');

    // Vendor approves booking request
    cy.contains('button', 'Approve & Request Advance').click();
    cy.wait('@updateBookingStatus').its('request.body.status').should('eq', 'CONFIRMED');
    cy.contains(/successfully/i, { timeout: 6000 }).should('be.visible');
  });

  it('Scenario 5: Customer leaves a 5-star review, and vendor responds with a public reply', () => {
    const existingReviews = [
      {
        id: 'rev-lifecycle-501',
        customer: {
          firstName: 'Elena',
          lastName: 'Rodriguez',
          profileImage: null
        },
        customerName: 'Elena Rodriguez',
        rating: 5,
        comment: 'Marcus and the Grand Royal team were absolutely phenomenal for our wedding!',
        createdAt: new Date().toISOString(),
        reply: null
      }
    ];

    cy.intercept('GET', '**/discovery/vendors/grand-royal-photography', {
      statusCode: 200,
      body: {
        ...mockBusiness,
        reviews: existingReviews
      }
    }).as('getStorefront');

    cy.intercept('POST', '**/reviews', {
      statusCode: 201,
      body: existingReviews[0]
    }).as('postCustomerReview');

    // 1. Customer visits storefront and submits review
    cy.visit('/business/grand-royal-photography', {
      onBeforeLoad(win) {
        win.localStorage.setItem('accessToken', 'mock-customer-token');
        win.localStorage.setItem('user', JSON.stringify(mockCustomerUser));
      }
    });
    cy.wait('@getStorefront');

    // Open review modal
    cy.contains('button', 'Write a Review').click();
    cy.get('textarea').type('Marcus and the Grand Royal team were absolutely phenomenal for our wedding!');
    cy.contains('button', 'Publish Review').click();
    cy.wait('@postCustomerReview');
    cy.contains(/review has been published/i, { timeout: 6000 }).should('be.visible');

    // 2. Vendor views reviews in vendor portal and replies
    cy.intercept('GET', 'http://localhost:3001/vendor/reviews', {
      statusCode: 200,
      body: existingReviews
    }).as('getVendorReviews');

    cy.intercept('PATCH', 'http://localhost:3001/vendor/reviews/rev-lifecycle-501/reply', {
      statusCode: 200,
      body: {
        ...existingReviews[0],
        reply: 'Thank you so much Elena! It was an absolute honor capturing your special day.'
      }
    }).as('replyToReview');

    cy.visit('/vendor/reviews', {
      onBeforeLoad(win) {
        win.localStorage.setItem('accessToken', 'mock-vendor-token');
        win.localStorage.setItem('user', JSON.stringify(mockVendorUser));
      }
    });
    cy.wait('@getVendorReviews');

    cy.contains('Customer Reviews').should('be.visible');
    cy.contains('Elena Rodriguez').should('be.visible');
    cy.contains('Marcus and the Grand Royal team were absolutely phenomenal').should('be.visible');

    // Click Reply to Customer
    cy.contains('button', 'Reply to Customer').click();
    cy.get('textarea[placeholder*="Write your reply" i]').type('Thank you so much Elena! It was an absolute honor capturing your special day.');
    cy.contains('button', 'Post Reply').click();

    cy.wait('@replyToReview').its('request.body.reply').should('include', 'absolute honor');
    cy.contains(/Reply posted successfully/i, { timeout: 6000 }).should('be.visible');
  });

  it('Scenario 6: Navbar navigation routes personas accurately across portals', () => {
    // Admin user Navbar test
    const mockAdminUser = {
      id: 'admin-user-1',
      email: 'admin@luxeevents.fun',
      firstName: 'Chief',
      lastName: 'Administrator',
      roleName: 'ADMIN'
    };

    cy.visit('/', {
      onBeforeLoad(win) {
        win.localStorage.setItem('accessToken', 'mock-admin-token');
        win.localStorage.setItem('user', JSON.stringify(mockAdminUser));
      }
    });
    cy.get('a[href="/admin"]').contains('Admin Portal').should('be.visible');

    // Vendor user Navbar test
    cy.visit('/', {
      onBeforeLoad(win) {
        win.localStorage.setItem('accessToken', 'mock-vendor-token');
        win.localStorage.setItem('user', JSON.stringify(mockVendorUser));
      }
    });
    cy.get('a[href="/vendor"]').contains('Dashboard').should('be.visible');

    // Guest / Customer user Navbar test
    cy.visit('/', {
      onBeforeLoad(win) {
        win.localStorage.clear();
      }
    });
    cy.get('a[href="/vendor/register"]').contains('Become a Vendor').should('be.visible');
  });
});
