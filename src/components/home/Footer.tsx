'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Diamond, Mail, Globe, Camera, MessageCircle, Briefcase } from 'lucide-react';
import { NewsletterForm } from './NewsletterForm';

export function Footer() {
  const [cms, setCms] = useState<any>(null);

  useEffect(() => {
    async function getFooterSettings() {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'}/admin/cms/public/settings/FOOTER_CONTENT`);
        if (res.ok) {
          const data = await res.json();
          setCms(data.value);
        }
      } catch (error) {
        console.error('Failed to fetch footer settings:', error);
      }
    }
    getFooterSettings();
  }, []);

  const description = cms?.description || 'The premier destination for luxury events. Discover, compare, and book the finest vendors and venues with ease and security.';
  const copyright = cms?.copyright || `© ${new Date().getFullYear()} LuxeEvents Marketplace. All rights reserved.`;
  const subtext = cms?.subtext || 'Designed for Premium Events';
  const socials = cms?.socials || { website: '#', instagram: '#', facebook: '#', linkedin: '#' };

  return (
    <footer className="bg-slate-950 text-slate-300 pt-20 pb-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Newsletter Section */}
        <div className="flex flex-col md:flex-row items-center justify-between p-10 bg-slate-900 rounded-3xl mb-16 border border-slate-800">
          <div className="mb-6 md:mb-0 md:mr-8 text-center md:text-left">
            <h3 className="text-2xl font-bold text-white mb-2">Subscribe to our Newsletter</h3>
            <p className="text-slate-400">Get the latest wedding trends, event tips, and exclusive offers.</p>
          </div>
          <NewsletterForm />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12 lg:gap-8 mb-16">
          
          <div className="lg:col-span-2">
            <Link href="/" className="flex items-center gap-2 mb-6">
              <div className="h-8 w-8 bg-primary rounded-lg flex items-center justify-center">
                <Diamond className="h-5 w-5 text-white" />
              </div>
              <span className="text-2xl font-bold tracking-tight text-white">
                Luxe<span className="font-light">Events</span>
              </span>
            </Link>
            <p className="text-slate-400 leading-relaxed mb-6 max-w-sm">
              {description}
            </p>
            <div className="flex gap-4">
              <a href={socials.website} target="_blank" rel="noopener noreferrer" className="h-10 w-10 rounded-full bg-slate-900 flex items-center justify-center hover:bg-primary hover:text-white transition-colors">
                <Globe className="h-5 w-5" />
              </a>
              <a href={socials.instagram} target="_blank" rel="noopener noreferrer" className="h-10 w-10 rounded-full bg-slate-900 flex items-center justify-center hover:bg-primary hover:text-white transition-colors">
                <Camera className="h-5 w-5" />
              </a>
              <a href={socials.facebook} target="_blank" rel="noopener noreferrer" className="h-10 w-10 rounded-full bg-slate-900 flex items-center justify-center hover:bg-primary hover:text-white transition-colors">
                <MessageCircle className="h-5 w-5" />
              </a>
              <a href={socials.linkedin} target="_blank" rel="noopener noreferrer" className="h-10 w-10 rounded-full bg-slate-900 flex items-center justify-center hover:bg-primary hover:text-white transition-colors">
                <Briefcase className="h-5 w-5" />
              </a>
            </div>
          </div>

          <div>
            <h4 className="text-white font-bold mb-6">Explore</h4>
            <ul className="space-y-4">
              <li><Link href="/#categories" className="hover:text-primary transition-colors">Categories</Link></li>
              <li><Link href="/search" className="hover:text-primary transition-colors">Vendors</Link></li>
              <li><Link href="/#packages" className="hover:text-primary transition-colors">Packages</Link></li>
              <li><Link href="/locations" className="hover:text-primary transition-colors">Locations</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-bold mb-6">Company</h4>
            <ul className="space-y-4">
              <li><Link href="/about" className="hover:text-primary transition-colors">About Us</Link></li>
              <li><Link href="/vendor/register" className="hover:text-primary transition-colors">Become a Vendor</Link></li>
              <li><Link href="/careers" className="hover:text-primary transition-colors">Careers</Link></li>
              <li><Link href="/blog" className="hover:text-primary transition-colors">Blog</Link></li>
              <li><Link href="/contact" className="hover:text-primary transition-colors">Contact</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-bold mb-6">Support</h4>
            <ul className="space-y-4">
              <li><Link href="/faq" className="hover:text-primary transition-colors">FAQ</Link></li>
              <li><Link href="/terms" className="hover:text-primary transition-colors">Terms of Service</Link></li>
              <li><Link href="/privacy" className="hover:text-primary transition-colors">Privacy Policy</Link></li>
              <li><Link href="/trust" className="hover:text-primary transition-colors">Trust & Safety</Link></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-slate-800 pt-8 flex flex-col md:flex-row items-center justify-between text-sm text-slate-500">
          <p>{copyright}</p>
          <div className="flex gap-6 mt-4 md:mt-0">
            <span>{subtext}</span>
          </div>
        </div>

      </div>
    </footer>
  );
}
