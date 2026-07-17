export const faqData = {
  hero: {
    title: 'How can we help you?',
    subtitle: 'Search our knowledge base or browse categories below to find answers to common questions about LuxeEvents.',
  },
  categories: [
    {
      id: 'general',
      name: 'General',
      faqs: [
        {
          question: 'What is LuxeEvents?',
          answer: 'LuxeEvents is a premium marketplace connecting clients with top-tier, vetted event professionals, venues, and creatives for luxury celebrations.'
        },
        {
          question: 'How do I contact customer support?',
          answer: 'You can reach our support team 24/7 through the Contact Us page, or by emailing support@luxeevents.com directly.'
        }
      ]
    },
    {
      id: 'customers',
      name: 'Customers',
      faqs: [
        {
          question: 'Do I need an account to browse vendors?',
          answer: 'No, you can browse all vendors and packages without an account. However, you will need to create a free account to contact a vendor or request a booking.'
        },
        {
          question: 'How do you verify your vendors?',
          answer: 'Every vendor undergoes a strict manual review process by our team. We verify their business credentials, review their past work, and check client references before approving their profile.'
        }
      ]
    },
    {
      id: 'vendors',
      name: 'Vendors',
      faqs: [
        {
          question: 'How much does it cost to become a vendor?',
          answer: 'Creating a basic vendor profile is currently free. We take a small commission only when a successful booking is made through the platform.'
        },
        {
          question: 'How do I get paid?',
          answer: 'Payments are held securely in escrow and released directly to your linked bank account 24 hours after the successful completion of the event.'
        }
      ]
    },
    {
      id: 'bookings',
      name: 'Bookings',
      faqs: [
        {
          question: 'What happens if a vendor cancels?',
          answer: 'In the rare event of a vendor cancellation, our concierge team will immediately step in to help you find a suitable replacement of equal or higher quality, and you will receive a full refund of your deposit.'
        },
        {
          question: 'Can I modify my booking dates?',
          answer: 'Yes, date modifications can be requested through your account dashboard. Approval is subject to the vendor\'s availability and individual cancellation policy.'
        }
      ]
    },
    {
      id: 'payments',
      name: 'Payments',
      faqs: [
        {
          question: 'What payment methods do you accept?',
          answer: 'We accept all major credit cards (Visa, Mastercard, American Express), Apple Pay, and secure bank transfers for large bookings.'
        },
        {
          question: 'Is my payment secure?',
          answer: 'Absolutely. We use enterprise-grade encryption and partner with industry-leading payment processors. Your financial data is never stored directly on our servers.'
        }
      ]
    },
    {
      id: 'account',
      name: 'Account',
      faqs: [
        {
          question: 'How do I change my password?',
          answer: 'You can change your password by navigating to Account Settings > Security from your profile dropdown menu.'
        },
        {
          question: 'Can I delete my account?',
          answer: 'Yes, you can request account deletion from your Account Settings. Please note that for security reasons, active bookings must be completed or cancelled first.'
        }
      ]
    }
  ],
  cta: {
    title: 'Ready to create something unforgettable?',
    description: 'Join thousands of others who have transformed their event planning experience with LuxeEvents.',
    primaryCTA: 'Explore Vendors',
    primaryLink: '/search',
    secondaryCTA: 'Become a Vendor',
    secondaryLink: '/register?role=VENDOR'
  }
};
