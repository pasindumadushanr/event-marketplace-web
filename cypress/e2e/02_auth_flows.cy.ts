describe('02 - Authentication & Route Guard Flows', () => {
  beforeEach(() => {
    cy.viewport(1280, 800);
  });

  it('validates required fields on the customer login page', () => {
    cy.visit('/login');
    // Ensure Next.js dev server finishes client hydration before clicking
    cy.wait(1000);
    cy.get('#email').should('be.visible').type('invalid-email-format');
    cy.contains('button', /Sign in/i).click();
    
    // Check validation error messages
    cy.contains(/valid email|required/i).should('be.visible');
  });

  it('displays an error alert/toast on invalid login credentials', () => {
    cy.visit('/login');
    cy.get('#email').should('be.visible').type('nonexistent-test-user@luxeevents.fun');
    cy.get('#password').type('WrongPassword123!');
    cy.contains('button', /Sign in/i).click();
    
    // Assert error toast or notification is triggered
    cy.contains(/Failed|Invalid|error|Unauthorized/i, { timeout: 8000 }).should('be.visible');
  });

  it('navigates cleanly between customer login and register pages', () => {
    cy.visit('/login');
    cy.contains(/Sign up|Register|Create an account/i).click();
    cy.url().should('include', '/register');
    cy.get('#email').should('be.visible');
    
    cy.contains(/Sign in|Log in/i).click();
    cy.url().should('include', '/login');
  });

  it('validates vendor login portal independently', () => {
    cy.visit('/vendor/login');
    cy.contains(/Vendor|Partner/i).should('exist');
    cy.get('#email').should('be.visible');
    cy.get('#password').should('be.visible');
    
    // Submit invalid credentials
    cy.get('#email').type('fake-vendor@luxeevents.fun');
    cy.get('#password').type('WrongPassword123!');
    cy.contains('button', /Sign In/i).click();
    cy.contains(/Failed|Invalid|error|Unauthorized/i, { timeout: 8000 }).should('be.visible');
  });

  it('handles the full two-step Forgot & Reset Password workflow', () => {
    cy.intercept('POST', '**/auth/forgot-password', {
      statusCode: 200,
      body: { message: 'If that email is registered, an OTP code has been sent.' },
    }).as('requestOtp');

    cy.intercept('POST', '**/auth/reset-password', {
      statusCode: 200,
      body: { message: 'Password reset successfully. You can now log in.' },
    }).as('resetPassword');

    cy.visit('/login');
    cy.contains(/Forgot password\?/i).click();
    cy.url().should('include', '/forgot-password');

    // Step 1: Request OTP
    cy.get('input#email').type('customer@luxeevents.fun');
    cy.contains('button', /Send Recovery Code/i).click();
    cy.wait('@requestOtp');

    // Step 2: Verification screen
    cy.contains('Set New Password').should('be.visible');
    cy.get('input#otp').type('123456');
    cy.get('input#newPassword').type('NewSecurePassword99!');
    cy.get('input#confirmPassword').type('NewSecurePassword99!');
    cy.contains('button', /Reset Password/i).click();
    cy.wait('@resetPassword');

    // Step 3: Success state
    cy.contains(/Password Changed!/i).should('be.visible');
    cy.contains(/Sign In Now/i).should('be.visible');
  });

  it('redirects unauthenticated users attempting to access protected vendor dashboard', () => {
    // Clear any existing tokens
    cy.clearLocalStorage();
    cy.visit('/vendor/business');
    // Expect redirection to login or access blocked
    cy.url().should((url) => {
      expect(url).to.match(/login|auth/);
    });
  });
});

