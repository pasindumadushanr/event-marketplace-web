import { 
  TrendingUp, 
  CalendarCheck, 
  Store, 
  Settings, 
  Star, 
  BarChart,
  UserPlus,
  ShieldCheck,
  CheckCircle,
  CreditCard
} from 'lucide-react';

export const sellData = {
  hero: {
    title: 'Grow Your Event Business with LuxeEvents',
    subtitle: 'Join the premier marketplace for luxury event professionals. Reach high-end clients, manage your bookings effortlessly, and scale your business.',
    primaryCTA: 'Start Selling Today',
    primaryLink: '/vendor/register',
    secondaryCTA: 'Learn More',
    secondaryLink: '#benefits'
  },
  
  benefits: [
    {
      title: 'More Visibility',
      description: 'Get your services in front of thousands of clients actively searching for premium event vendors.',
      icon: TrendingUp
    },
    {
      title: 'More Bookings',
      description: 'Fill your calendar faster with qualified leads and seamless direct booking features.',
      icon: CalendarCheck
    },
    {
      title: 'Professional Profile',
      description: 'Showcase your portfolio, packages, and pricing on a beautifully designed business page.',
      icon: Store
    },
    {
      title: 'Easy Management',
      description: 'Manage all your inquiries, messages, and bookings from a centralized, intuitive dashboard.',
      icon: Settings
    },
    {
      title: 'Customer Reviews',
      description: 'Build unparalleled trust with verified client reviews that highlight your expertise.',
      icon: Star
    },
    {
      title: 'Future Analytics',
      description: 'Gain deep insights into your profile views, booking conversion rates, and revenue trends.',
      icon: BarChart
    }
  ],

  howItWorks: [
    {
      title: 'Register Account',
      description: 'Sign up for a free vendor account and verify your email.',
      icon: UserPlus
    },
    {
      title: 'Create Business',
      description: 'Set up your profile, add your services, packages, and portfolio.',
      icon: Store
    },
    {
      title: 'Admin Approval',
      description: 'Our team will review your profile to ensure it meets our premium standards.',
      icon: ShieldCheck
    },
    {
      title: 'Receive Bookings',
      description: 'Start receiving inquiries and confirmed bookings directly from clients.',
      icon: CheckCircle
    }
  ],

  statistics: [
    { label: 'Active Vendors', value: '2,500+' },
    { label: 'Monthly Visitors', value: '500K+' },
    { label: 'Booking Value', value: '$10M+' },
    { label: 'Cities Covered', value: '150+' }
  ],

  testimonials: [
    {
      quote: "Since joining LuxeEvents, our photography business has doubled its bookings. The caliber of clients on this platform is unmatched.",
      name: "Sarah Jenkins",
      role: "Founder, Luminary Studios",
      image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-4.0.3&auto=format&fit=crop&w=256&q=80"
    },
    {
      quote: "The dashboard makes managing inquiries so much easier. I spend less time on admin and more time actually designing events.",
      name: "Marcus Thorne",
      role: "Lead Event Designer",
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=256&q=80"
    },
    {
      quote: "LuxeEvents provided the exact exposure our high-end catering company needed. It's the only marketing channel we need now.",
      name: "Elena Rodriguez",
      role: "Executive Chef",
      image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-4.0.3&auto=format&fit=crop&w=256&q=80"
    }
  ],

  pricing: {
    title: 'Simple, Transparent Pricing',
    description: 'We believe in growing together. Start for free and only pay when you succeed.',
    features: [
      'Beautiful Business Profile',
      'Unlimited Packages & Galleries',
      'Direct Client Messaging',
      'Secure Escrow Payments',
      'Dedicated Vendor Support'
    ],
    commission: '10%'
  },

  cta: {
    title: 'Ready to elevate your business?',
    description: 'Join the exclusive network of top-tier event professionals and start growing today.',
    primaryCTA: 'Create Vendor Account',
    primaryLink: '/vendor/register',
    secondaryCTA: 'View FAQs',
    secondaryLink: '/faq'
  }
};
