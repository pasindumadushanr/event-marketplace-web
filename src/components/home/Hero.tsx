'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Search, MapPin, Grid } from 'lucide-react';
import { Input } from '@/components/ui/input';

export function Hero() {
  return (
    <div className="relative min-h-[90vh] flex items-center justify-center pt-20 overflow-hidden">
      {/* Background Image with Overlay */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-slate-900/60 z-10" />
        <img 
          src="https://images.unsplash.com/photo-1511795409834-ef04bbd61622?q=80&w=2069&auto=format&fit=crop" 
          alt="Luxury Wedding Event" 
          className="w-full h-full object-cover scale-105 transform origin-center animate-out zoom-in duration-[20000ms]"
        />
      </div>

      <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-12">
        
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="space-y-6"
        >
          <span className="inline-block py-1 px-3 rounded-full bg-white/10 border border-white/20 text-white/90 text-sm font-medium backdrop-blur-md mb-2">
            The Premier Destination for Luxury Events
          </span>
          <h1 className="text-5xl md:text-7xl font-extrabold text-white tracking-tight drop-shadow-xl leading-tight">
            Everything You Need for Your <span className="text-primary italic">Perfect Event</span>
          </h1>
          <p className="text-xl md:text-2xl text-slate-200 font-light max-w-3xl mx-auto drop-shadow-md">
            Discover and book the finest venues, photographers, and event professionals for weddings and corporate galas.
          </p>
        </motion.div>

        {/* Search Bar Component */}
        <motion.div 
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
          className="bg-white p-2 rounded-2xl shadow-2xl max-w-4xl mx-auto flex flex-col md:flex-row gap-2"
        >
          <div className="flex-1 flex items-center px-4 bg-slate-50 rounded-xl border border-transparent hover:border-slate-200 transition-colors">
            <Search className="h-5 w-5 text-slate-400" />
            <Input 
              type="text" 
              placeholder="What are you looking for?" 
              className="border-0 bg-transparent focus-visible:ring-0 shadow-none text-lg h-14"
            />
          </div>
          
          <div className="w-full md:w-64 flex items-center px-4 bg-slate-50 rounded-xl border border-transparent hover:border-slate-200 transition-colors">
            <Grid className="h-5 w-5 text-slate-400" />
            <select className="w-full bg-transparent border-0 focus:ring-0 text-slate-700 h-14 px-3 outline-none">
              <option value="">All Categories</option>
              <option value="venues">Hotels & Venues</option>
              <option value="photo">Photographers</option>
              <option value="decor">Decorators</option>
            </select>
          </div>

          <div className="w-full md:w-64 flex items-center px-4 bg-slate-50 rounded-xl border border-transparent hover:border-slate-200 transition-colors">
            <MapPin className="h-5 w-5 text-slate-400" />
            <select className="w-full bg-transparent border-0 focus:ring-0 text-slate-700 h-14 px-3 outline-none">
              <option value="">Any Location</option>
              <option value="colombo">Colombo</option>
              <option value="kandy">Kandy</option>
              <option value="galle">Galle</option>
            </select>
          </div>

          <Button className="h-14 px-8 text-lg bg-primary hover:bg-primary/90 text-primary-foreground font-semibold rounded-xl w-full md:w-auto">
            Search
          </Button>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.8 }}
          className="pt-8 text-slate-300 text-sm font-medium flex items-center justify-center gap-6 flex-wrap"
        >
          <span>Popular:</span>
          <a href="#" className="hover:text-primary transition-colors underline decoration-white/30 underline-offset-4">Cinematic Videography</a>
          <a href="#" className="hover:text-primary transition-colors underline decoration-white/30 underline-offset-4">Beach Venues</a>
          <a href="#" className="hover:text-primary transition-colors underline decoration-white/30 underline-offset-4">Bridal Makeup</a>
        </motion.div>
      </div>
    </div>
  );
}
