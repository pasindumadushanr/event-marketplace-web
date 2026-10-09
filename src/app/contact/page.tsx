'use client';

import { useState } from 'react';
import Link from 'next/link';
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
import { MapPin, Phone, Mail, Send, ExternalLink, ArrowUpRight, MessageCircle, Sparkles, CheckCircle2, LoaderCircle } from 'lucide-react';
import api from '@/lib/api';
import { submissionError } from '@/lib/recaptcha';

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
  const [isSent, setIsSent] = useState(false);

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
    setIsSent(false);
    try {
      await api.post('/contact', data);
      toast.success('Your message has been sent successfully!');
      reset();
      setIsSent(true);
    } catch (error) {
      toast.error(submissionError(error, 'Failed to send message. Please try again.'));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="wedding-typography min-h-screen flex flex-col bg-[#faf8f4] font-sans text-slate-900">
      <div className="bg-slate-900">
        <Navbar />
      </div>
      <div className="h-20 bg-slate-900" />

      {/* Contact Hero */}
      <header className="relative overflow-hidden bg-slate-900 pb-24 pt-14 sm:pb-32 sm:pt-20">
        {/* Background Image & Overlays */}
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(212,175,55,0.16),transparent_60%)]" />
          <div className="absolute -right-24 -top-48 h-[600px] w-[600px] rounded-full border border-white/10" />
          <div className="absolute -right-8 -top-32 h-[470px] w-[470px] rounded-full border border-white/10" />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <p className="mb-6 flex items-center gap-3 text-xs font-semibold uppercase tracking-[0.22em] text-[#e5c76b]">
            <span className="h-px w-8 bg-[#e5c76b]" /> Contact us
          </p>
          <div className="grid items-end gap-8 lg:grid-cols-[1.3fr_1fr] lg:gap-20">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-semibold text-white tracking-tight leading-[1.12]">
              Great celebrations.<br /><span className="font-serif italic font-normal text-[#e5c76b]">Start with a hello.</span>
            </h1>
            <div className="max-w-md">
              <p className="text-base sm:text-lg text-slate-300 leading-relaxed">
                Planning something special? Looking to grow your business? Whatever brings you here, we would love to hear from you.
              </p>
              <a href="#contact-form" className="mt-6 inline-flex items-center gap-2 text-sm font-medium text-white underline decoration-white/30 underline-offset-8 hover:text-[#e5c76b] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#e5c76b]">
                Let’s talk <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
              </a>
            </div>
          </div>
        </div>
      </header>

      <main className="relative z-10 -mt-12 flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 pb-20">
        <div className="grid grid-cols-1 lg:grid-cols-[0.85fr_1.3fr] gap-0 overflow-hidden rounded-3xl border border-slate-200/70 bg-white shadow-[0_20px_70px_-30px_rgba(15,23,42,0.25)]">
          
          {/* Contact Information */}
          <div className="space-y-8 bg-[#f2efe8] p-6 sm:p-10 lg:p-12">
            <div>
              <span className="mb-6 flex h-12 w-12 items-center justify-center rounded-2xl bg-white text-[#8c6c19] shadow-sm"><MessageCircle className="h-6 w-6" aria-hidden="true" /></span>
              <h2 className="text-2xl font-semibold tracking-tight text-slate-900 mb-3">A conversation away.</h2>
              <p className="text-sm text-slate-600 leading-relaxed">
                From finding the right vendor to getting your business listed, let us help with your next step.
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
                  <a href="tel:+94112345678" className="inline-block text-slate-600 mt-1 hover:underline">+94 (11) 234-5678</a>
                </div>
              </div>
              
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-white rounded-xl shadow-sm border border-slate-200 flex items-center justify-center shrink-0">
                  <Mail className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h4 className="font-bold text-slate-900">Email</h4>
                  <a href="mailto:support@nakathata.lk" className="inline-block break-all text-slate-600 mt-1 hover:underline">support@nakathata.lk</a>
                </div>
              </div>
            </div>

            <Link href="/faq" className="group flex items-center justify-between gap-4 rounded-2xl border border-slate-300/60 p-5 transition-colors hover:bg-white focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary">
              <span><span className="block text-sm font-semibold">Looking for a quick answer?</span><span className="mt-1 block text-sm text-slate-500">Explore our frequently asked questions</span></span>
              <ArrowUpRight className="h-5 w-5 shrink-0 text-[#8c6c19]" aria-hidden="true" />
            </Link>
          </div>

          {/* Contact Form */}
          <div id="contact-form" className="scroll-mt-28">
            <div className="p-6 sm:p-10 lg:p-12">
              <p className="mb-2 text-xs font-semibold uppercase tracking-[0.18em] text-[#8c6c19]">Your next step starts here</p>
              <h2 className="text-3xl font-semibold tracking-tight text-slate-900 mb-3">Tell us what’s on your mind.</h2>
              <p className="mb-8 text-sm leading-relaxed text-slate-500">Share a few details and our team will get back to you by email. Fields marked * are required.</p>
              
              <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-6 [&_input]:h-12 [&_input]:rounded-xl [&_input]:border-slate-200 [&_input]:bg-slate-50/70 [&_input]:px-4 [&_input]:shadow-none [&_label]:text-slate-700">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="name">Full Name <span className="text-red-500">*</span></Label>
                    <Input id="name" autoComplete="name" placeholder="Your full name" aria-invalid={!!errors.name} aria-describedby={errors.name ? 'name-error' : undefined} {...register('name')} />
                    {errors.name && <p id="name-error" className="text-sm text-red-600">{errors.name.message}</p>}
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="email">Email Address <span className="text-red-500">*</span></Label>
                    <Input id="email" type="email" autoComplete="email" placeholder="you@example.com" aria-invalid={!!errors.email} aria-describedby={errors.email ? 'email-error' : undefined} {...register('email')} />
                    {errors.email && <p id="email-error" className="text-sm text-red-600">{errors.email.message}</p>}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone Number (Optional)</Label>
                    <Input id="phone" type="tel" autoComplete="tel" placeholder="+94 77 123 4567" {...register('phone')} />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="subject">Subject <span className="text-red-500">*</span></Label>
                    <Input id="subject" placeholder="What would you like help with?" aria-invalid={!!errors.subject} aria-describedby={errors.subject ? 'subject-error' : undefined} {...register('subject')} />
                    {errors.subject && <p id="subject-error" className="text-sm text-red-600">{errors.subject.message}</p>}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="message">Message <span className="text-red-500">*</span></Label>
                  <Textarea 
                    id="message" 
                    placeholder="Tell us about your plans, your business, or how we can help…"
                    className="min-h-[140px] resize-y rounded-xl border-slate-200 bg-slate-50/70 p-4 shadow-none"
                    aria-invalid={!!errors.message}
                    aria-describedby={errors.message ? 'message-error' : undefined}
                    {...register('message')} 
                  />
                  {errors.message && <p id="message-error" className="text-sm text-red-600">{errors.message.message}</p>}
                </div>

                <Button 
                  type="submit" 
                  disabled={isSubmitting} 
                  className="h-13 w-full px-8 bg-slate-900 hover:bg-slate-800 text-white text-sm font-semibold rounded-xl flex items-center justify-center gap-3"
                >
                  {isSubmitting ? 'Sending...' : 'Send Message'}
                  {isSubmitting ? <LoaderCircle className="h-4 w-4 animate-spin motion-reduce:animate-none" aria-hidden="true" /> : <Send className="h-4 w-4" aria-hidden="true" />}
                </Button>
                {isSent && <p role="status" className="flex items-start gap-2 rounded-xl bg-emerald-50 p-4 text-sm text-emerald-800"><CheckCircle2 className="h-5 w-5 shrink-0" aria-hidden="true" />Thanks for reaching out! Your message is with our team.</p>}
              </form>
            </div>
          </div>

        </div>
        <section aria-labelledby="social-media-heading" className="mt-16 sm:mt-20">
          <div className="mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
            <div>
              <p className="mb-3 flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.18em] text-[#8c6c19]"><Sparkles className="h-4 w-4" aria-hidden="true" /> A little inspiration, every day</p>
              <h2 id="social-media-heading" className="text-3xl font-semibold tracking-tight">Stay close to the celebration.</h2>
            </div>
            <p className="max-w-xs text-sm leading-relaxed text-slate-500">Follow Nakathata.lk for fresh ideas, event stories, and a look behind the scenes.</p>
          </div>
          <ul className="grid grid-cols-1 min-[380px]:grid-cols-2 lg:grid-cols-4 gap-4">
            {socialLinks.map(({ name, href, caption, color, hover, icon }) => (
              <li key={name}>
                <a href={href} target="_blank" rel="noopener noreferrer" aria-label={`Nakathata.lk on ${name} (opens in a new tab)`} className={`group relative flex h-full flex-col items-start gap-4 rounded-2xl border border-slate-200/80 bg-white p-5 transition-colors ${hover} focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary`}>
                  <span className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl text-white ${color}`}><svg viewBox="0 0 24 24" className="h-6 w-6" aria-hidden="true" focusable="false">{icon}</svg></span>
                  <span className="min-w-0"><span className="block text-sm font-semibold">{name}</span><span className="mt-1 block text-xs text-slate-500">{caption}</span></span>
                  <ExternalLink className="absolute right-5 top-5 h-3.5 w-3.5 text-slate-400 group-hover:text-slate-700" aria-hidden="true" />
                </a>
              </li>
            ))}
          </ul>
        </section>
      </main>

      <Footer />
    </div>
  );
}
