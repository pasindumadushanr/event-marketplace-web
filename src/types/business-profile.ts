export type BookingMethod = 'DIRECT_BOOKING' | 'REQUEST_QUOTE' | 'CONTACT_ONLY';

export interface VerificationStatus {
  isBusinessVerified: boolean;
  isEmailVerified: boolean;
  isPhoneVerified: boolean;
  isIdentityVerified: boolean;
  isRegistrationVerified: boolean;
}

export interface BusinessFeatureGroup {
  groupName: string; // e.g., 'Venue Features', 'Equipment', 'Amenities'
  features: string[]; // e.g., ['Free WiFi', 'AC', 'Parking', 'Swimming Pool']
}

export interface BusinessHours {
  monday: string;
  tuesday: string;
  wednesday: string;
  thursday: string;
  friday: string;
  saturday: string;
  sunday: string;
}

export interface BusinessPolicy {
  booking: string;
  cancellation: string;
  payment: string;
  terms: string;
}

export interface FAQ {
  question: string;
  answer: string;
}

export interface BusinessGalleryImage {
  id: string;
  url: string;
  caption?: string;
}

export interface Package {
  id: string;
  name: string;
  price: number;
  description: string;
  features: string[];
  duration?: string;
  image?: string;
}

export interface Review {
  id: string;
  customerName: string;
  customerImage?: string;
  rating: number;
  date: string;
  comment: string;
  vendorReply?: string;
}

export interface FullBusinessProfile {
  id: string;
  slug: string;
  name: string;
  logo: string;
  coverImage: string;
  categoryId: string;
  categoryName: string;
  
  // Hero Stats
  isVerified: boolean;
  rating: number;
  reviewCount: number;
  startingPrice: number;
  yearsOfExperience: number;
  responseTime: string;
  memberSince: string; // YYYY
  
  // About
  description: string;
  highlights: string[];
  languages: string[];
  
  // Dynamic Data
  verification: VerificationStatus;
  featureGroups: BusinessFeatureGroup[];
  gallery: BusinessGalleryImage[];
  packages: Package[];
  
  // Sidebar & Logistics
  bookingMethod: BookingMethod;
  businessHours: BusinessHours;
  location: {
    address: string;
    city: string;
    district: string;
    mapEmbedUrl?: string; // Google Maps iframe URL
  };
  contact: {
    phone: string;
    email: string;
    whatsapp?: string;
    website?: string;
    facebook?: string;
    instagram?: string;
  };
  
  // Trust & Info
  faq: FAQ[];
  policies: BusinessPolicy;
  reviews: Review[];
}
