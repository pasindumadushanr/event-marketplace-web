'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu, X, Diamond } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const links = [
    { name: 'Home', href: '/' },
    { name: 'Categories', href: '/categories' },
    { name: 'Vendors', href: '/vendors' },
    { name: 'Packages', href: '/packages' },
    { name: 'About', href: '/about' },
  ];

  return (
    <nav 
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled 
          ? 'bg-white/95 backdrop-blur-md shadow-sm border-b border-slate-100 py-3' 
          : 'bg-transparent py-5'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center">
          
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 z-50">
            <div className="h-10 w-10 bg-primary rounded-lg flex items-center justify-center">
              <Diamond className="h-6 w-6 text-white" />
            </div>
            <span className={`text-2xl font-bold tracking-tight ${isScrolled ? 'text-slate-900' : 'text-white'}`}>
              Luxe<span className="font-light">Events</span>
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-8">
            <div className="flex space-x-6">
              {links.map((link) => (
                <Link 
                  key={link.name} 
                  href={link.href}
                  className={`text-sm font-medium transition-colors hover:text-primary ${
                    pathname === link.href 
                      ? 'text-primary' 
                      : isScrolled ? 'text-slate-600' : 'text-white/90'
                  }`}
                >
                  {link.name}
                </Link>
              ))}
            </div>
            
            <div className="flex items-center gap-4 pl-6 border-l border-slate-300/30">
              <Link href="/sell" className={`text-sm font-medium hover:text-primary ${isScrolled ? 'text-slate-600' : 'text-white/90'}`}>
                Become a Vendor
              </Link>
              <Link href="/login">
                <Button variant={isScrolled ? "outline" : "secondary"} className={`font-medium ${!isScrolled && 'bg-white/10 text-white hover:bg-white/20 border-white/20'}`}>
                  Login
                </Button>
              </Link>
              <Link href="/register">
                <Button className="bg-primary hover:bg-primary/90 text-primary-foreground font-medium shadow-lg">
                  Join Now
                </Button>
              </Link>
            </div>
          </div>

          {/* Mobile Menu Toggle */}
          <div className="lg:hidden z-50">
            <button 
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className={`p-2 rounded-md ${isScrolled || isMobileMenuOpen ? 'text-slate-900' : 'text-white'}`}
            >
              {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="lg:hidden absolute top-0 left-0 w-full h-screen bg-white pt-24 px-6 flex flex-col space-y-6 animate-in slide-in-from-top-5">
          {links.map((link) => (
            <Link 
              key={link.name} 
              href={link.href}
              className="text-2xl font-semibold text-slate-800 border-b border-slate-100 pb-4"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              {link.name}
            </Link>
          ))}
          <div className="flex flex-col gap-4 pt-4">
            <Link href="/sell">
              <Button variant="outline" className="w-full text-lg h-12">Become a Vendor</Button>
            </Link>
            <div className="grid grid-cols-2 gap-4">
              <Link href="/login">
                <Button variant="secondary" className="w-full h-12">Login</Button>
              </Link>
              <Link href="/register">
                <Button className="w-full h-12 bg-primary">Join Now</Button>
              </Link>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
