import { 
  ShieldCheck, 
  Star, 
  CalendarCheck, 
  Lock, 
  Search, 
  GitCompare, 
  MousePointerClick, 
  PartyPopper,
  HeartHandshake,
  Lightbulb,
  Users,
  Globe
} from 'lucide-react';

export const aboutData = {
  hero: {
    title: 'Elevating the Art of Celebration',
    description: 'We connect visionary event professionals with clients seeking extraordinary experiences. Discover the finest venues, planners, and creatives all in one exclusive marketplace.',
    primaryCTA: 'Explore Vendors',
    primaryLink: '/search',
    secondaryCTA: 'Become a Vendor',
    secondaryLink: '/register?role=VENDOR'
  },
  
  story: {
    title: 'Our Story',
    content: 'Founded on the belief that every milestone deserves to be celebrated flawlessly, LuxeEvents was created to eliminate the friction in event planning. We recognized a gap between elite event professionals and the clients searching for them. Our platform serves as a curated bridge—bringing together the industry\'s most talented creators with those who appreciate true craftsmanship.'
  },

  missionVision: {
    mission: {
      title: 'Our Mission',
      description: 'To simplify the event planning process by providing a secure, transparent, and inspiring platform where clients can seamlessly discover and book top-tier event professionals.'
    },
    vision: {
      title: 'Our Vision',
      description: 'To become the global standard for luxury event planning, where every significant life moment is crafted by trusted experts through our platform.'
    }
  },

  whyChooseUs: [
    {
      title: 'Verified Vendors',
      description: 'Every professional on our platform undergoes a rigorous vetting process to ensure exceptional quality and reliability.',
      icon: ShieldCheck
    },
    {
      title: 'Trusted Reviews',
      description: 'Real feedback from verified bookings, so you can make decisions with complete confidence.',
      icon: Star
    },
    {
      title: 'Easy Booking',
      description: 'A streamlined, intuitive interface that takes you from discovery to confirmed booking in minutes.',
      icon: CalendarCheck
    },
    {
      title: 'Secure Platform',
      description: 'Enterprise-grade security protecting your data, communications, and financial transactions.',
      icon: Lock
    }
  ],

  howItWorks: [
    {
      title: 'Search',
      description: 'Explore our curated marketplace using advanced filters to find the perfect match.',
      icon: Search
    },
    {
      title: 'Compare',
      description: 'Review portfolios, pricing, and authentic client testimonials side-by-side.',
      icon: GitCompare
    },
    {
      title: 'Book',
      description: 'Communicate directly and secure your date with just a few clicks.',
      icon: MousePointerClick
    },
    {
      title: 'Celebrate',
      description: 'Enjoy peace of mind knowing your event is in the hands of verified experts.',
      icon: PartyPopper
    }
  ],

  statistics: [
    { label: 'Active Vendors', value: '2,500+' },
    { label: 'Happy Customers', value: '15,000+' },
    { label: 'Events Booked', value: '25,000+' },
    { label: 'Categories', value: '45+' }
  ],

  values: [
    {
      title: 'Trust & Transparency',
      description: 'We believe in clear communication and honest relationships above all else.',
      icon: HeartHandshake
    },
    {
      title: 'Innovation',
      description: 'Continuously refining our platform to deliver a state-of-the-art experience.',
      icon: Lightbulb
    },
    {
      title: 'Customer First',
      description: 'Every decision we make is centered around improving the user experience.',
      icon: Users
    },
    {
      title: 'Community',
      description: 'Fostering a supportive network of professionals and clients who inspire each other.',
      icon: Globe
    }
  ],

  cta: {
    title: 'Ready to create something unforgettable?',
    description: 'Join thousands of others who have transformed their event planning experience with LuxeEvents.',
    primaryCTA: 'Start Planning',
    primaryLink: '/search',
    secondaryCTA: 'Join as a Vendor',
    secondaryLink: '/register?role=VENDOR'
  }
};
