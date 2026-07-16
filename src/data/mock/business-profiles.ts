import { FullBusinessProfile } from '@/types/business-profile';

export const mockBusinessProfiles: Record<string, FullBusinessProfile> = {
  'the-grand-ballroom-colombo': {
    id: 'v1',
    slug: 'the-grand-ballroom-colombo',
    name: 'The Grand Ballroom Colombo',
    logo: 'https://images.unsplash.com/photo-1560066984-138dadb4c035?q=80&w=200&auto=format&fit=crop',
    coverImage: 'https://images.unsplash.com/photo-1519167758481-83f550bb49b3?q=80&w=1600&auto=format&fit=crop',
    categoryId: '1',
    categoryName: 'Hotels & Venues',
    
    isVerified: true,
    rating: 4.9,
    reviewCount: 128,
    startingPrice: 500000,
    yearsOfExperience: 15,
    responseTime: 'Within 2 hours',
    memberSince: '2021',
    
    description: 'The Grand Ballroom Colombo is the epitome of luxury and elegance. Located in the heart of the city, our venue offers breathtaking architecture, state-of-the-art lighting, and world-class culinary experiences tailored perfectly for your dream wedding or corporate gala.',
    highlights: ['5-Star Luxury Venue', 'In-house International Chefs', 'Dedicated Event Planner', 'Soundproof Architecture'],
    languages: ['English', 'Sinhala', 'Tamil'],
    
    verification: {
      isBusinessVerified: true,
      isEmailVerified: true,
      isPhoneVerified: true,
      isIdentityVerified: true,
      isRegistrationVerified: true,
    },
    
    featureGroups: [
      {
        groupName: 'Venue Amenities',
        features: ['Air Conditioning', 'Free WiFi', 'Valet Parking', 'Bridal Dressing Room', 'Wheelchair Accessible']
      },
      {
        groupName: 'Catering & Dining',
        features: ['Buffet & Set Menus', 'Live Action Stations', 'Liquor License', 'Halal Options Available']
      }
    ],
    
    gallery: [
      { id: 'g1', url: 'https://images.unsplash.com/photo-1519167758481-83f550bb49b3?q=80&w=800' },
      { id: 'g2', url: 'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?q=80&w=800' },
      { id: 'g3', url: 'https://images.unsplash.com/photo-1520854221256-17451cc331bf?q=80&w=800' },
      { id: 'g4', url: 'https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?q=80&w=800' },
      { id: 'g5', url: 'https://images.unsplash.com/photo-1555244162-803834f70033?q=80&w=800' },
    ],
    
    packages: [
      {
        id: 'p1',
        name: 'Silver Wedding Package',
        price: 500000,
        description: 'Perfect for intimate gatherings of up to 150 guests with standard buffet options.',
        features: ['150 Guests', 'Standard Buffet Menu', 'Basic Floral Table Decor', 'Welcome Drinks', '4 Hours Duration'],
        duration: '4 Hours',
        image: 'https://images.unsplash.com/photo-1519167758481-83f550bb49b3?q=80&w=600'
      },
      {
        id: 'p2',
        name: 'Platinum Gala Experience',
        price: 1200000,
        description: 'The ultimate luxury experience for large weddings up to 400 guests.',
        features: ['400 Guests', 'Premium International Buffet', 'Live Band Setup', 'Bridal Suite for 1 Night', 'Corkage Free', '8 Hours Duration'],
        duration: '8 Hours',
        image: 'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?q=80&w=600'
      }
    ],
    
    bookingMethod: 'DIRECT_BOOKING',
    
    businessHours: {
      monday: '9:00 AM - 8:00 PM',
      tuesday: '9:00 AM - 8:00 PM',
      wednesday: '9:00 AM - 8:00 PM',
      thursday: '9:00 AM - 8:00 PM',
      friday: '9:00 AM - 10:00 PM',
      saturday: '9:00 AM - 11:00 PM',
      sunday: '9:00 AM - 11:00 PM',
    },
    
    location: {
      address: 'No 45, Galle Road, Colombo 03',
      city: 'Colombo',
      district: 'Colombo',
      mapEmbedUrl: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d126743.62649033324!2d79.77380295834947!3d6.921833527787363!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3ae253d10f7a7003%3A0x320b2e4d32d3838d!2sColombo%2C%20Sri%20Lanka!5e0!3m2!1sen!2sus!4v1700000000000!5m2!1sen!2sus'
    },
    
    contact: {
      phone: '+94 77 123 4567',
      email: 'events@grandballroom.lk',
      whatsapp: '+94 77 123 4567',
      website: 'https://grandballroom.lk',
      facebook: 'https://facebook.com/grandballroom',
      instagram: 'https://instagram.com/grandballroom'
    },
    
    faq: [
      { question: 'Do you allow outside catering?', answer: 'No, we provide all catering in-house with our executive chefs.' },
      { question: 'Is there a corkage fee for alcohol?', answer: 'Our premium packages include free corkage. Standard packages have a fee of LKR 1000 per bottle.' },
      { question: 'Do you have backup power?', answer: 'Yes, we have a fully automated backup generator capable of supporting the entire venue.' }
    ],
    
    policies: {
      booking: 'A 30% non-refundable deposit is required to secure your date.',
      cancellation: 'Cancellations made 90 days prior receive a 50% refund of any amounts paid beyond the deposit.',
      payment: 'Final payment is due 14 days before the event date.',
      terms: 'By booking, you agree to adhere to noise regulations ending at 12:00 AM.'
    },
    
    reviews: [
      {
        id: 'r1',
        customerName: 'Sarah Perera',
        rating: 5,
        date: 'October 12, 2023',
        comment: 'Absolutely stunning venue! The staff was incredibly professional and made our wedding day a total dream. The food was spectacular.',
        vendorReply: 'Thank you Sarah! It was our absolute pleasure hosting your beautiful wedding.'
      },
      {
        id: 'r2',
        customerName: 'John & Amanda',
        rating: 4,
        date: 'August 05, 2023',
        comment: 'Beautiful hall and great lighting. Only gave 4 stars because parking was a bit tight for our 400 guests, but valet handled it well.'
      }
    ]
  },
  
  'lumina-photography': {
    id: 'v2',
    slug: 'lumina-photography',
    name: 'Lumina Photography',
    logo: 'https://images.unsplash.com/photo-1520854221256-17451cc331bf?q=80&w=200&auto=format&fit=crop',
    coverImage: 'https://images.unsplash.com/photo-1520854221256-17451cc331bf?q=80&w=1600&auto=format&fit=crop',
    categoryId: '2',
    categoryName: 'Photographers',
    
    isVerified: true,
    rating: 4.8,
    reviewCount: 85,
    startingPrice: 150000,
    yearsOfExperience: 8,
    responseTime: 'Within 1 hour',
    memberSince: '2022',
    
    description: 'We specialize in cinematic, authentic, and emotionally driven wedding photography. We don’t just take photos; we capture the feeling of your most important day so you can relive it forever.',
    highlights: ['Award Winning Cinematic Style', 'Drone Coverage Included', 'Same-Day Edit Available'],
    languages: ['English', 'Sinhala'],
    
    verification: {
      isBusinessVerified: true,
      isEmailVerified: true,
      isPhoneVerified: true,
      isIdentityVerified: false,
      isRegistrationVerified: true,
    },
    
    featureGroups: [
      {
        groupName: 'Photography Styles',
        features: ['Cinematic', 'Documentary', 'Traditional', 'Candid']
      },
      {
        groupName: 'Equipment & Formats',
        features: ['4K Video', 'Drone Photography', 'Physical Albums', 'Cloud Delivery']
      }
    ],
    
    gallery: [
      { id: 'g1', url: 'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?q=80&w=800' },
      { id: 'g2', url: 'https://images.unsplash.com/photo-1606800052052-a08af7148866?q=80&w=800' },
      { id: 'g3', url: 'https://images.unsplash.com/photo-1519225421980-715cb0215aed?q=80&w=800' },
    ],
    
    packages: [
      {
        id: 'p1',
        name: 'The Essential Package',
        price: 150000,
        description: 'Perfect coverage for intimate weddings.',
        features: ['1 Photographer', 'High-Res Digital Files', '100 Retouched Photos', 'Online Gallery'],
        duration: '6 Hours',
        image: 'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?q=80&w=600'
      }
    ],
    
    bookingMethod: 'REQUEST_QUOTE',
    
    businessHours: {
      monday: '10:00 AM - 6:00 PM',
      tuesday: '10:00 AM - 6:00 PM',
      wednesday: '10:00 AM - 6:00 PM',
      thursday: '10:00 AM - 6:00 PM',
      friday: '10:00 AM - 6:00 PM',
      saturday: 'By Appointment',
      sunday: 'Closed',
    },
    
    location: {
      address: '22 Peradeniya Road, Kandy',
      city: 'Kandy',
      district: 'Kandy',
    },
    
    contact: {
      phone: '+94 71 999 8888',
      email: 'hello@luminaphoto.com',
      instagram: 'https://instagram.com/luminaphoto'
    },
    
    faq: [
      { question: 'Do you travel outside of Kandy?', answer: 'Yes! We travel island-wide. Travel and accommodation fees apply for locations outside Kandy and Colombo.' }
    ],
    
    policies: {
      booking: 'A 50% deposit secures your date.',
      cancellation: 'Non-refundable deposit.',
      payment: 'Final payment due on the day of the event.',
      terms: 'Digital gallery delivered within 4 weeks.'
    },
    
    reviews: []
  }
};
