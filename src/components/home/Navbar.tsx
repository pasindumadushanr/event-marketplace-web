'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu, X, Diamond, User as UserIcon, Heart, CalendarDays, LogOut, Settings } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/lib/auth-context';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

function UserAccountNav() {
  const { user, logout } = useAuth();
  if (!user) return null;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger>
        <Button variant="ghost" className="relative h-10 w-10 rounded-full border border-slate-200">
          <Avatar className="h-10 w-10">
            <AvatarImage src={user.profileImage} alt={user.firstName} />
            <AvatarFallback className="bg-primary/10 text-primary font-medium">
              {user.firstName?.charAt(0)}
            </AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="end">
        <div className="flex items-center justify-start gap-2 p-2">
          <div className="flex flex-col space-y-1 leading-none">
            <p className="font-medium">{user.firstName} {user.lastName}</p>
            <p className="w-[200px] truncate text-sm text-muted-foreground">
              {user.email}
            </p>
          </div>
        </div>
        <DropdownMenuSeparator />
        <DropdownMenuItem>
          <Link href="/account/bookings" className="cursor-pointer flex items-center">
            <CalendarDays className="mr-2 h-4 w-4" />
            <span>My Bookings</span>
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem>
          <Link href="/account/favorites" className="cursor-pointer flex items-center">
            <Heart className="mr-2 h-4 w-4" />
            <span>Saved Favorites</span>
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem>
          <Link href="/account/settings" className="cursor-pointer flex items-center">
            <Settings className="mr-2 h-4 w-4" />
            <span>Account Settings</span>
          </Link>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem className="cursor-pointer text-red-600 focus:text-red-600" onClick={logout}>
          <LogOut className="mr-2 h-4 w-4" />
          <span>Log out</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export function Navbar() {
  const { user } = useAuth();
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

          {/* Global Search Bar (Desktop) */}
          <div className="hidden lg:flex flex-1 max-w-md mx-8">
            <div className="relative w-full group">
              <input
                type="text"
                placeholder="Search vendors, venues, categories..."
                className={`w-full pl-5 pr-12 py-2.5 rounded-full border outline-none transition-all duration-300 shadow-sm
                  ${isScrolled 
                    ? 'bg-slate-50 border-slate-200 text-slate-900 focus:bg-white focus:border-primary focus:ring-4 focus:ring-primary/10' 
                    : 'bg-white/10 border-white/20 text-white placeholder:text-white/60 focus:bg-white/20 focus:border-white/40'
                  }
                `}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    window.location.href = `/search?q=${e.currentTarget.value}`;
                  }
                }}
              />
              <button 
                className={`absolute right-1.5 top-1.5 p-1.5 rounded-full transition-colors
                  ${isScrolled ? 'bg-primary text-white hover:bg-primary/90' : 'bg-white/20 text-white hover:bg-white/30'}
                `}
                onClick={(e) => {
                  const input = e.currentTarget.previousSibling as HTMLInputElement;
                  if (input.value) window.location.href = `/search?q=${input.value}`;
                }}
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
              </button>
            </div>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-6">
            
            <div className="flex items-center gap-4 pl-6 border-l border-slate-300/30">
              {user ? (
                <>
                  {user.roleName === 'VENDOR' || user.roleName === 'ADMIN' ? (
                    <Link href="/vendor">
                      <Button variant={isScrolled ? "outline" : "secondary"} className={`font-medium ${!isScrolled && 'bg-white/10 text-white hover:bg-white/20 border-white/20'}`}>
                        Dashboard
                      </Button>
                    </Link>
                  ) : (
                    <Link href="/sell" className={`text-sm font-medium hover:text-primary ${isScrolled ? 'text-slate-600' : 'text-white/90'}`}>
                      Become a Vendor
                    </Link>
                  )}
                  <UserAccountNav />
                </>
              ) : (
                <>
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
                </>
              )}
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
