'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Navbar } from '@/components/home/Navbar';
import { Footer } from '@/components/home/Footer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { MapPin, Phone, Mail, Send, ExternalLink } from 'lucide-react';
import api from '@/lib/api';

const socialLinks = [
  {
    name: 'Facebook',
    href: 'https://web.facebook.com/profile.php?id=61595001868271',
    caption: 'Join our community',
    color: 'bg-[#1877F2]',
    hover: 'hover:border-blue-200 hover:bg-blue-50/50',
    icon: <path d="M14 21v-8h2.7l.4-3H14V8c0-.9.3-1.5 1.6-1.5H17V3.8c-.3 0-1.3-.1-2.4-.1-2.4 0-4 1.5-4 4.1V10H8v3h2.6v8H14Z" fill="currentColor" />,
  },
  {
    name: 'Instagram',
    href: 'https://www.instagram.com/nakathata.lk/',
    caption: '@nakathata.lk',
    color: 'bg-gradient-to-tr from-amber-400 via-rose-500 to-purple-600',
    hover: 'hover:border-pink-200 hover:bg-pink-50/50',
    icon: <><rect x="3" y="3" width="18" height="18" rx="5" fill="none" stroke="currentColor" strokeWidth="2" /><circle cx="12" cy="12" r="4" fill="none" stroke="currentColor" strokeWidth="2" /><circle cx="17.5" cy="6.5" r="1.2" fill="currentColor" /></>,
  },
  {
    name: 'TikTok',
    href: 'https://www.tiktok.com/@nakathata.lk',
    caption: '@nakathata.lk',
    color: 'bg-slate-950',
    hover: 'hover:border-slate-300 hover:bg-slate-50',
    icon: <path d="M16.6 5.82A4.28 4.28 0 0 1 15.54 3h-3.09v12.4a2.59 2.59 0 1 1-2.23-2.56V9.69a5.72 5.72 0 1 0 5.32 5.71V9.11a7.35 7.35 0 0 0 4.3 1.38V7.4a4.3 4.3 0 0 1-3.24-1.58Z" fill="currentColor" />,
  },
  {
    name: 'YouTube',
    href: 'https://www.youtube.com/channel/UCYSC4gU8KyQuhFn7p3RUjMw',
    caption: 'Watch our latest',
    color: 'bg-[#FF0000]',
    hover: 'hover:border-red-200 hover:bg-red-50/50',
    icon: <><rect x="2" y="5" width="20" height="14" rx="4" fill="currentColor" /><path d="m10 9 5 3-5 3V9Z" fill="#FF0000" /></>,
  },
];

const contactSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Please enter a valid email address'),
  phone: z.string().optional(),
  subject: z.string().min(5, 'Subject must be at least 5 characters'),
  message: z.string().min(10, 'Message must be at least 10 characters'),
});

type ContactFormValues = z.infer<typeof contactSchema>;

export default function ContactPage() {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ContactFormValues>({
    resolver: zodResolver(contactSchema),
  });

  const onSubmit = async (data: ContactFormValues) => {
    setIsSubmitting(true);
    try {
      await api.post('/contact', data);
      toast.success('Your message has been sent successfully!');
      reset();
    } catch (error) {
      toast.error('Failed to send message. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 font-sans">
      <div className="bg-slate-900">
        <Navbar />
      </div>
      <div className="h-20 bg-slate-900" />

      {/* Contact Hero */}
      <div className="relative border-b border-slate-200 py-20 lg:py-32 overflow-hidden">
        {/* Background Image & Overlays */}
        <div className="absolute inset-0 z-0">
          <img 
            src="https://images.unsplash.com/photo-1511795409834-ef04bbd61622?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80" 
            alt="Event Planning Contact" 
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-slate-900/70 mix-blend-multiply"></div>
          <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-primary/20 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/3"></div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 tracking-tight drop-shadow-sm">
            Get in Touch
          </h1>
          <p className="text-lg md:text-xl text-slate-200 max-w-2xl mx-auto font-light leading-relaxed">
            Whether you have a question about our marketplace, need help finding a vendor, or want to partner with us, our team is here to assist.
          </p>
        </div>
      </div>

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 lg:gap-16">
          
          {/* Contact Information */}
          <div className="lg:col-span-1 space-y-10">
            <div>
              <h2 className="text-2xl font-bold text-slate-900 mb-6">Contact Information</h2>
              <p className="text-slate-600 mb-8 leading-relaxed">
                Reach out to us through any of these channels or fill out the form, and we will get back to you within 24 hours.
              </p>
            </div>
            
            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-white rounded-xl shadow-sm border border-slate-200 flex items-center justify-center shrink-0">
                  <MapPin className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h4 className="font-bold text-slate-900">Headquarters</h4>
                  <p className="text-slate-500 mt-1">123 Luxury Avenue, Suite 500<br/>Colombo, Sri Lanka</p>
                </div>
              </div>
              
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-white rounded-xl shadow-sm border border-slate-200 flex items-center justify-center shrink-0">
                  <Phone className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h4 className="font-bold text-slate-900">Phone</h4>
                  <p className="text-slate-500 mt-1">+94 (11) 234-5678</p>
                </div>
              </div>
              
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-white rounded-xl shadow-sm border border-slate-200 flex items-center justify-center shrink-0">
                  <Mail className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h4 className="font-bold text-slate-900">Email</h4>
                  <p className="text-slate-500 mt-1">support@luxeevents.com</p>
                </div>
              </div>
            </div>

            <section aria-labelledby="social-media-heading" className="border-t border-slate-200 pt-8">
              <p className="mb-2 text-xs font-semibold uppercase tracking-[0.18em] text-primary">Let’s stay connected</p>
              <h2 id="social-media-heading" className="text-2xl font-bold tracking-tight text-slate-900 mb-3">
                Follow Nakathata.lk
              </h2>
              <p className="text-sm text-slate-500 mb-6 leading-relaxed">
                A little inspiration for your next big celebration. Follow along for ideas, stories, and updates.
              </p>
              <ul className="grid grid-cols-1 min-[360px]:grid-cols-2 gap-3">
                {socialLinks.map(({ name, href, caption, color, hover, icon }) => (
                  <li key={name}>
                    <a
                      href={href}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={`Nakathata.lk on ${name} (opens in a new tab)`}
                      className={`group relative flex h-full flex-col items-start rounded-2xl border border-slate-200/80 bg-white p-4 text-slate-900 shadow-sm transition-colors ${hover} focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary`}
                    >
                      <span className={`mb-4 flex h-11 w-11 items-center justify-center rounded-xl text-white shadow-sm ${color}`}>
                        <svg viewBox="0 0 24 24" className="h-6 w-6" aria-hidden="true" focusable="false">{icon}</svg>
                      </span>
                      <span className="text-sm font-semibold">{name}</span>
                      <span className="mt-1 text-xs leading-relaxed text-slate-500">{caption}</span>
                      <ExternalLink className="absolute right-4 top-4 h-3.5 w-3.5 text-slate-400 transition-colors group-hover:text-slate-700" aria-hidden="true" />
                    </a>
                  </li>
                ))}
              </ul>
            </section>
          </div>

          {/* Contact Form */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-3xl border border-slate-200 p-8 md:p-12 shadow-sm">
              <h3 className="text-2xl font-bold text-slate-900 mb-8">Send us a Message</h3>
              
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="name">Full Name <span className="text-red-500">*</span></Label>
                    <Input id="name" placeholder="John Doe" {...register('name')} />
                    {errors.name && <p className="text-sm text-red-500">{errors.name.message}</p>}
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="email">Email Address <span className="text-red-500">*</span></Label>
                    <Input id="email" type="email" placeholder="john@example.com" {...register('email')} />
                    {errors.email && <p className="text-sm text-red-500">{errors.email.message}</p>}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone Number (Optional)</Label>
                    <Input id="phone" placeholder="+94 77 123 4567" {...register('phone')} />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="subject">Subject <span className="text-red-500">*</span></Label>
                    <Input id="subject" placeholder="How can we help you?" {...register('subject')} />
                    {errors.subject && <p className="text-sm text-red-500">{errors.subject.message}</p>}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="message">Message <span className="text-red-500">*</span></Label>
                  <Textarea 
                    id="message" 
                    placeholder="Tell us about your inquiry..." 
                    className="min-h-[150px] resize-none"
                    {...register('message')} 
                  />
                  {errors.message && <p className="text-sm text-red-500">{errors.message.message}</p>}
                </div>

                <Button 
                  type="submit" 
                  disabled={isSubmitting} 
                  className="w-full md:w-auto px-8 py-6 bg-slate-900 hover:bg-primary text-white text-lg rounded-xl flex items-center gap-2"
                >
                  {isSubmitting ? 'Sending...' : 'Send Message'}
                  <Send className="h-4 w-4" />
                </Button>
              </form>
            </div>
          </div>

        </div>
      </main>

      <Footer />
    </div>
  );
}
