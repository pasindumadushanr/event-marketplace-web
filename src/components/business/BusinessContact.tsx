'use client';

import { Phone, Mail, Globe, Camera, MessageCircle } from 'lucide-react';

interface BusinessContactProps {
  contact: {
    phone: string;
    email: string;
    whatsapp?: string;
    website?: string;
    facebook?: string;
    instagram?: string;
  };
}

export function BusinessContact({ contact }: BusinessContactProps) {
  return (
    <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100">
      <h3 className="text-lg font-bold text-slate-900 mb-4">Contact Information</h3>
      
      <div className="space-y-4 mb-6">
        <a href={`tel:${contact.phone}`} className="flex items-center gap-3 text-slate-700 hover:text-primary transition-colors font-medium">
          <div className="h-8 w-8 rounded-full bg-slate-50 flex items-center justify-center shrink-0">
            <Phone className="h-4 w-4" />
          </div>
          {contact.phone}
        </a>
        
        <a href={`mailto:${contact.email}`} className="flex items-center gap-3 text-slate-700 hover:text-primary transition-colors font-medium">
          <div className="h-8 w-8 rounded-full bg-slate-50 flex items-center justify-center shrink-0">
            <Mail className="h-4 w-4" />
          </div>
          {contact.email}
        </a>
        
        {contact.website && (
          <a href={contact.website} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 text-slate-700 hover:text-primary transition-colors font-medium">
            <div className="h-8 w-8 rounded-full bg-slate-50 flex items-center justify-center shrink-0">
              <Globe className="h-4 w-4" />
            </div>
            Website
          </a>
        )}
      </div>

      <div className="flex gap-3 pt-4 border-t border-slate-100">
        {contact.whatsapp && (
          <a href={`https://wa.me/${contact.whatsapp.replace(/[^0-9]/g, '')}`} target="_blank" rel="noopener noreferrer" className="h-10 w-10 rounded-full bg-green-50 text-green-600 flex items-center justify-center hover:bg-green-100 transition-colors">
            <MessageCircle className="h-5 w-5" />
          </a>
        )}
        {contact.facebook && (
          <a href={contact.facebook} target="_blank" rel="noopener noreferrer" className="h-10 w-10 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center hover:bg-blue-100 transition-colors">
            <Globe className="h-5 w-5" />
          </a>
        )}
        {contact.instagram && (
          <a href={contact.instagram} target="_blank" rel="noopener noreferrer" className="h-10 w-10 rounded-full bg-pink-50 text-pink-600 flex items-center justify-center hover:bg-pink-100 transition-colors">
            <Camera className="h-5 w-5" />
          </a>
        )}
      </div>
    </div>
  );
}
