describe('03 - Vendor Business Management Dashboard', () => {
  beforeEach(() => {
    cy.viewport(1280, 800);

    // Mock vendor authenticated state
    const mockVendorUser = {
      id: 'mock-vendor-id-123',
      email: 'test-vendor@luxeevents.fun',
      firstName: 'Luxury',
      lastName: 'Vendor',
      roleName: 'VENDOR',
    };

    const mockBusinessData = {
      id: 'biz-123',
      name: 'Grand Royal Photography',
      description: 'Award-winning wedding and event photography studio.',
      city: 'Colombo',
      address: '45 Galle Road',
      phone: '+94771234567',
      email: 'vendor@luxeevents.fun',
      website: 'https://grandroyal.lk',
      isVerified: true,
      categoryId: 'cat-1',
      profileSettings: {
        languages: 'English, Sinhala',
        highlights: 'Experienced, 4K Drone Coverage',
        whatsapp: '+94771234567',
        hours: [
          { day: 'monday', openTime: '09:00', closeTime: '18:00', isClosed: false },
          { day: 'tuesday', openTime: '09:00', closeTime: '18:00', isClosed: false },
          { day: 'sunday', openTime: '10:00', closeTime: '16:00', isClosed: true }
        ],
        policies: {
          booking: '30% advance deposit required to confirm date.',
          cancellation: 'Full refund 14 days prior.'
        }
      }
    };

    // Set localStorage before visiting
    window.localStorage.setItem('accessToken', 'mock-vendor-access-token');
    window.localStorage.setItem('user', JSON.stringify(mockVendorUser));

    // Intercept backend API calls
    cy.intercept('GET', '**/vendor/business', {
      statusCode: 200,
      body: mockBusinessData,
    }).as('getBusiness');

    cy.intercept('PATCH', '**/vendor/business', (req) => {
      req.reply({
        statusCode: 200,
        body: { ...mockBusinessData, ...req.body },
      });
    }).as('updateBusiness');
  });

  it('renders the multi-tab layout and navigates across tabs', () => {
    cy.visit('/vendor/business/general');
    
    // Check navigation sidebar items
    cy.contains('General').should('exist');
    cy.contains('Contact').should('exist');
    cy.contains('Location').should('exist');
    cy.contains('Business Hours').should('exist');
    cy.contains('Policies & FAQ').should('exist');
  });

  it('allows editing General tab and saving business details', () => {
    cy.visit('/vendor/business/general');
    
    // Wait for form to populate
    cy.get('input[name="name"]').clear().type('Grand Royal Photography - Updated');
    cy.get('button').contains(/Save/i).click();

    // Verify PATCH request fired
    cy.wait('@updateBusiness').its('request.body.name').should('include', 'Grand Royal Photography - Updated');
    
    // Verify success toast
    cy.contains(/saved/i, { timeout: 8000 }).should('be.visible');
  });

  it('allows navigating to Business Hours tab and checking schedules', () => {
    cy.visit('/vendor/business/hours');
    cy.contains(/Business Hours|Opening/i).should('exist');
    cy.contains(/Monday|Tuesday|Friday/i).should('exist');
  });

  it('allows navigating to Contact Details tab and updating phone', () => {
    cy.visit('/vendor/business/contact');
    cy.contains(/Contact/i).should('exist');
    cy.get('input[name="phone"]').should('exist');
  });

  it('allows navigating to Policies tab and viewing cancellation policy', () => {
    cy.visit('/vendor/business/policies');
    cy.contains(/Polic/i).should('exist');
  });

  it('renders vendor calendar with blackout management controls', () => {
    cy.intercept('GET', '**/bookings/vendor', {
      statusCode: 200,
      body: [
        {
          id: 'booking-qa-1',
          date: new Date().toISOString(),
          status: 'CONFIRMED',
          totalAmount: 75000,
          customer: { firstName: 'Alice', lastName: 'Silva' },
          package: { name: 'Wedding Photography Deluxe' }
        }
      ]
    }).as('getVendorBookings');

    cy.visit('/vendor/calendar');
    cy.wait('@getVendorBookings');

    cy.contains('Calendar & Blackouts').should('be.visible');
    cy.contains('Confirmed Event').should('be.visible');
    cy.contains('Blackout / Blocked').should('be.visible');
    cy.contains('Today').should('be.visible');
  });
});

