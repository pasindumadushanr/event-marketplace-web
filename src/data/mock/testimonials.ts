import { Testimonial } from '@/types';

export const mockTestimonials: Testimonial[] = [
  {
    id: 't1',
    customerName: 'Sarah & John',
    customerImage: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=200&auto=format&fit=crop',
    vendorName: 'The Grand Ballroom Colombo',
    rating: 5,
    text: '"Absolutely stunning venue! The staff was incredibly professional and made our wedding day a total dream. Highly recommended for large gatherings."',
  },
  {
    id: 't2',
    customerName: 'Amanda P.',
    customerImage: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=200&auto=format&fit=crop',
    vendorName: 'Lumina Photography',
    rating: 5,
    text: '"They captured every magical moment perfectly. The photo album is beyond our expectations. Worth every penny!"',
  },
  {
    id: 't3',
    customerName: 'Kusal & Thilini',
    customerImage: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=200&auto=format&fit=crop',
    vendorName: 'Royal Florals & Decor',
    rating: 4,
    text: '"The floral arrangements were beautiful. They completely transformed the venue into a garden paradise just like we wanted."',
  }
];
