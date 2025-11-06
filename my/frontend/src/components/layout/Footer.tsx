'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';
import { Mail, MapPin, Phone, Clock } from 'lucide-react';

interface NavLink {
  id: number;
  label: string;
  href: string;
}

interface NavigationSection {
  id: number;
  title: string;
  links: NavLink[];
}

interface ContactInfo {
  id: number;
  title: string;
  email: string;
  phone: string;
  address: string;
  hours: string;
}

interface SocialLink {
  id: number;
  iconName: string;
  label: string;
  href: string;
}

interface Newsletter {
  id: number;
  title: string;
  description: string;
  placeholder: string;
  buttonText: string;
  successMessage: string;
}

interface Copyright {
  id: number;
  companyName: string;
  rightsText: string;
  madeWithText: string;
  locationText: string;
}

interface FooterProps {
  logo?: {
    url: string;
    alternativeText: string;
  };
  tagline?: string;
  description?: string;
  servicesSection?: NavigationSection;
  learnSection?: NavigationSection;
  exploreSection?: NavigationSection;
  connectSection?: NavigationSection;
  contactInfo?: ContactInfo;
  socialTitle?: string;
  socialLinks?: SocialLink[];
  newsletter?: Newsletter;
  certifications?: string;
  copyright?: Copyright;
  locale: string;
}

const getSocialIcon = (iconName: string) => {
  const iconLower = iconName.toLowerCase();

  switch (iconLower) {
    case 'instagram':
      return (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
          <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
        </svg>
      );
    case 'facebook':
      return (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
          <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
        </svg>
      );
    case 'youtube':
      return (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
          <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
        </svg>
      );
    case 'mail':
      return <Mail className="w-5 h-5" />;
    case 'twitter':
    case 'x':
      return (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
          <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
        </svg>
      );
    default:
      return (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
          <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
        </svg>
      );
  }
};

export function Footer({
  logo,
  tagline,
  description,
  servicesSection,
  learnSection,
  exploreSection,
  connectSection,
  contactInfo,
  socialTitle,
  socialLinks = [],
  newsletter,
  certifications,
  copyright,
  locale,
}: FooterProps) {
  const [email, setEmail] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);

  const addLocaleToUrl = (url: string) => {
    if (!url) return '/';
    if (url.startsWith(`/${locale}`)) return url;
    if (url.startsWith('/')) return `/${locale}${url}`;
    return url;
  };

  const handleNewsletterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle newsletter submission
    setIsSubmitted(true);
    setTimeout(() => {
      setEmail('');
      setIsSubmitted(false);
    }, 3000);
  };

  return (
    <footer className="relative bg-gradient-to-b from-[#2A100B] via-[#1A0606] to-[#0A0202] overflow-hidden">
      {/* Texture overlay */}
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)' opacity='0.5'/%3E%3C/svg%3E")`,
        }}
      />

      <div className="relative z-10">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
          {/* Main Footer Content */}
          <div className="py-12 sm:py-16 lg:py-20">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
              {/* Brand Section */}
              <div className="lg:col-span-4">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                  viewport={{ once: true }}
                >
                  {/* Logo */}
                  {logo && (
                    <Link href={`/${locale}`} className="inline-block mb-4">
                      <Image
                        src={logo.url}
                        alt={logo.alternativeText || 'Logo'}
                        width={120}
                        height={40}
                        className="h-10 w-auto"
                      />
                    </Link>
                  )}

                  {/* Tagline */}
                  {tagline && (
                    <p className="text-[#D4A574] font-serif text-lg mb-4">{tagline}</p>
                  )}

                  {/* Description */}
                  {description && (
                    <p className="text-[#E0D9C9]/70 text-sm leading-relaxed mb-6">
                      {description}
                    </p>
                  )}

                  {/* Newsletter */}
                  {newsletter && (
                    <div className="mt-6">
                      <h3 className="text-[#E0D9C9] font-semibold mb-2">{newsletter.title}</h3>
                      <p className="text-[#E0D9C9]/60 text-sm mb-4">{newsletter.description}</p>
                      <form onSubmit={handleNewsletterSubmit} className="flex gap-2">
                        <input
                          type="email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          placeholder={newsletter.placeholder}
                          className="flex-1 px-4 py-2 bg-[#E0D9C9]/10 border border-[#E0D9C9]/20 rounded-lg text-[#E0D9C9] placeholder:text-[#E0D9C9]/40 focus:outline-none focus:ring-2 focus:ring-[#D4A574]/50 text-sm"
                          required
                        />
                        <button
                          type="submit"
                          className="px-6 py-2 bg-[#D4A574] hover:bg-[#C59564] text-[#2A100B] font-medium rounded-lg transition-colors duration-300 text-sm whitespace-nowrap"
                        >
                          {newsletter.buttonText}
                        </button>
                      </form>
                      {isSubmitted && (
                        <motion.p
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="text-[#D4A574] text-sm mt-2"
                        >
                          {newsletter.successMessage}
                        </motion.p>
                      )}
                    </div>
                  )}

                  {/* Certifications */}
                  {certifications && (
                    <div className="mt-6">
                      <p className="text-[#E0D9C9]/50 text-xs">{certifications}</p>
                    </div>
                  )}
                </motion.div>
              </div>

              {/* Navigation Sections */}
              <div className="lg:col-span-8">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                  {/* Services Section */}
                  {servicesSection && (
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5, delay: 0.1 }}
                      viewport={{ once: true }}
                    >
                      <h3 className="text-[#E0D9C9] font-semibold mb-4 text-sm uppercase tracking-wider">
                        {servicesSection.title}
                      </h3>
                      <ul className="space-y-3">
                        {servicesSection.links.map((link) => (
                          <li key={link.id}>
                            <Link
                              href={addLocaleToUrl(link.href)}
                              className="text-[#E0D9C9]/70 hover:text-[#D4A574] transition-colors duration-300 text-sm"
                            >
                              {link.label}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    </motion.div>
                  )}

                  {/* Learn Section */}
                  {learnSection && (
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5, delay: 0.2 }}
                      viewport={{ once: true }}
                    >
                      <h3 className="text-[#E0D9C9] font-semibold mb-4 text-sm uppercase tracking-wider">
                        {learnSection.title}
                      </h3>
                      <ul className="space-y-3">
                        {learnSection.links.map((link) => (
                          <li key={link.id}>
                            <Link
                              href={addLocaleToUrl(link.href)}
                              className="text-[#E0D9C9]/70 hover:text-[#D4A574] transition-colors duration-300 text-sm"
                            >
                              {link.label}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    </motion.div>
                  )}

                  {/* Explore Section */}
                  {exploreSection && (
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5, delay: 0.3 }}
                      viewport={{ once: true }}
                    >
                      <h3 className="text-[#E0D9C9] font-semibold mb-4 text-sm uppercase tracking-wider">
                        {exploreSection.title}
                      </h3>
                      <ul className="space-y-3">
                        {exploreSection.links.map((link) => (
                          <li key={link.id}>
                            <Link
                              href={addLocaleToUrl(link.href)}
                              className="text-[#E0D9C9]/70 hover:text-[#D4A574] transition-colors duration-300 text-sm"
                            >
                              {link.label}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    </motion.div>
                  )}

                  {/* Connect Section */}
                  {connectSection && (
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5, delay: 0.4 }}
                      viewport={{ once: true }}
                    >
                      <h3 className="text-[#E0D9C9] font-semibold mb-4 text-sm uppercase tracking-wider">
                        {connectSection.title}
                      </h3>
                      <ul className="space-y-3">
                        {connectSection.links.map((link) => (
                          <li key={link.id}>
                            <Link
                              href={addLocaleToUrl(link.href)}
                              className="text-[#E0D9C9]/70 hover:text-[#D4A574] transition-colors duration-300 text-sm"
                            >
                              {link.label}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    </motion.div>
                  )}
                </div>

                {/* Contact Info */}
                {contactInfo && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.5 }}
                    viewport={{ once: true }}
                    className="mt-8 pt-8 border-t border-[#E0D9C9]/10"
                  >
                    <h3 className="text-[#E0D9C9] font-semibold mb-4">{contactInfo.title}</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                      {contactInfo.email && (
                        <div className="flex items-start gap-3">
                          <div className="p-2 rounded-lg bg-[#D4A574]/10">
                            <Mail className="w-4 h-4 text-[#D4A574]" />
                          </div>
                          <div>
                            <p className="text-[#E0D9C9]/50 text-xs mb-1">Email</p>
                            <a
                              href={`mailto:${contactInfo.email}`}
                              className="text-[#E0D9C9]/70 hover:text-[#D4A574] text-sm transition-colors duration-300"
                            >
                              {contactInfo.email}
                            </a>
                          </div>
                        </div>
                      )}

                      {contactInfo.phone && (
                        <div className="flex items-start gap-3">
                          <div className="p-2 rounded-lg bg-[#D4A574]/10">
                            <Phone className="w-4 h-4 text-[#D4A574]" />
                          </div>
                          <div>
                            <p className="text-[#E0D9C9]/50 text-xs mb-1">Phone</p>
                            <a
                              href={`tel:${contactInfo.phone}`}
                              className="text-[#E0D9C9]/70 hover:text-[#D4A574] text-sm transition-colors duration-300"
                            >
                              {contactInfo.phone}
                            </a>
                          </div>
                        </div>
                      )}

                      {contactInfo.address && (
                        <div className="flex items-start gap-3">
                          <div className="p-2 rounded-lg bg-[#D4A574]/10">
                            <MapPin className="w-4 h-4 text-[#D4A574]" />
                          </div>
                          <div>
                            <p className="text-[#E0D9C9]/50 text-xs mb-1">Address</p>
                            <p className="text-[#E0D9C9]/70 text-sm">{contactInfo.address}</p>
                          </div>
                        </div>
                      )}

                      {contactInfo.hours && (
                        <div className="flex items-start gap-3">
                          <div className="p-2 rounded-lg bg-[#D4A574]/10">
                            <Clock className="w-4 h-4 text-[#D4A574]" />
                          </div>
                          <div>
                            <p className="text-[#E0D9C9]/50 text-xs mb-1">Hours</p>
                            <p className="text-[#E0D9C9]/70 text-sm">{contactInfo.hours}</p>
                          </div>
                        </div>
                      )}
                    </div>
                  </motion.div>
                )}
              </div>
            </div>

            {/* Social Links */}
            {socialLinks.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.6 }}
                viewport={{ once: true }}
                className="mt-12 pt-8 border-t border-[#E0D9C9]/10"
              >
                {socialTitle && (
                  <h3 className="text-[#E0D9C9] font-semibold mb-4 text-center">{socialTitle}</h3>
                )}
                <div className="flex justify-center gap-4">
                  {socialLinks.map((social) => (
                    <motion.a
                      key={social.id}
                      href={social.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      whileHover={{ scale: 1.1, y: -2 }}
                      whileTap={{ scale: 0.95 }}
                      className="relative p-3 rounded-xl bg-[#E0D9C9]/5 hover:bg-[#D4A574]/10 text-[#E0D9C9]/60 hover:text-[#D4A574] transition-all duration-300 group"
                      aria-label={social.label}
                    >
                      {/* Glow effect */}
                      <div className="absolute inset-0 rounded-xl bg-[#D4A574]/20 blur-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                      <div className="relative">{getSocialIcon(social.iconName)}</div>
                    </motion.a>
                  ))}
                </div>
              </motion.div>
            )}
          </div>

          {/* Copyright Section */}
          {copyright && (
            <div className="border-t border-[#E0D9C9]/10 py-6">
              <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                <motion.p
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  transition={{ duration: 0.5 }}
                  viewport={{ once: true }}
                  className="text-[#E0D9C9]/50 text-sm text-center md:text-left"
                >
                  © {new Date().getFullYear()} {copyright.companyName}. {copyright.rightsText}
                </motion.p>

                <motion.div
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  transition={{ duration: 0.5, delay: 0.1 }}
                  viewport={{ once: true }}
                  className="flex flex-col md:flex-row items-center gap-4 text-sm text-[#E0D9C9]/50"
                >
                  <span>{copyright.madeWithText}</span>
                  <span>{copyright.locationText}</span>
                </motion.div>
              </div>
            </div>
          )}
        </div>

        {/* Decorative Wave */}
        <div className="absolute bottom-0 left-0 right-0 h-24 overflow-hidden opacity-5">
          <svg
            className="absolute bottom-0 w-full h-full"
            viewBox="0 0 1200 120"
            preserveAspectRatio="none"
          >
            <path
              d="M0,0 C150,50 350,50 600,25 C850,0 1050,0 1200,25 L1200,120 L0,120 Z"
              fill="currentColor"
              className="text-[#D4A574]"
            />
          </svg>
        </div>
      </div>
    </footer>
  );
}
