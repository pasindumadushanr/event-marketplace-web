export interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string;
  icon?: string;
  coverImage?: string;
  businessCount: number;
}

export interface Vendor {
  id: string;
  name: string;
  category: string;
  location: string;
  rating: number;
  reviewCount: number;
  startingPrice: number;
  coverImage: string;
  logo: string;
  isVerified: boolean;
}

export interface Package {
  id: string;
  name: string;
  vendorName: string;
  category: string;
  price: number;
  image: string;
}

export interface Testimonial {
  id: string;
  customerName: string;
  customerImage: string;
  vendorName: string;
  rating: number;
  text: string;
}
