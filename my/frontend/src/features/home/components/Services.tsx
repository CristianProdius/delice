"use client";

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  ArrowRight,
  Heart,
  Star,
  Gift,
  Coffee,
  Cake,
  Cookie,
  IceCream,
  ChefHat,
  Sparkles,
  Crown,
  Gem,
  GraduationCap,
  Baby,
  Store,
  PartyPopper,
  Palette,
  Users,
  Utensils,
  Calendar
} from 'lucide-react';
import { ServicesSection } from '@/types/strapi';
import { STRAPI_URL } from '@/lib/strapi/client';

interface ServicesProps {
  data: ServicesSection;
  locale?: string;
}

// Icon mapping function for Lucide icons
const getServiceIcon = (iconName?: string | null) => {
  if (!iconName) return Star;

  const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
    heart: Heart,
    star: Star,
    gift: Gift,
    coffee: Coffee,
    cake: Cake,
    cookie: Cookie,
    icecream: IceCream,
    chef: ChefHat,
    chefhat: ChefHat,
    sparkles: Sparkles,
    crown: Crown,
    gem: Gem,
    graduationcap: GraduationCap,
    baby: Baby,
    store: Store,
    partypopper: PartyPopper,
    palette: Palette,
    users: Users,
    utensils: Utensils,
    calendar: Calendar,
  };

  return iconMap[iconName.toLowerCase()] || Star;
};

// Helper to extract text from Strapi rich text blocks
function extractTextFromBlocks(blocks: any[]): string {
  if (!blocks || !Array.isArray(blocks)) return '';

  return blocks
    .map(block => {
      if (block.children) {
        return block.children
          .map((child: any) => child.text || '')
          .join('');
      }
      return '';
    })
    .join(' ');
}

// Helper to get media URL from Strapi
function getMediaUrl(media?: any): string | null {
  if (!media?.url) return null;
  const isAbsoluteUrl = media.url.startsWith('http://') || media.url.startsWith('https://');
  return isAbsoluteUrl ? media.url : `${STRAPI_URL}${media.url}`;
}

export function Services({ data, locale = 'en' }: ServicesProps) {
  const { header, items } = data;

  const textAlign = header.alignment === 'center'
    ? 'text-center'
    : header.alignment === 'right'
    ? 'text-right'
    : 'text-left';

  return (
    <section className="relative py-20 sm:py-24 lg:py-32 overflow-hidden bg-gradient-to-b from-amber-50/30 via-white to-amber-50/20">
      {/* Background texture */}
      <div
        className="absolute inset-0 opacity-[0.015] pointer-events-none"
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='2.5' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E\")",
        }}
      />

      <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className={`mb-16 sm:mb-20 ${textAlign}`}
        >
          {header.kicker && (
            <motion.p
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              viewport={{ once: true }}
              className="text-sm md:text-base font-medium text-amber-600/70 uppercase tracking-wider mb-2"
            >
              {header.kicker}
            </motion.p>
          )}
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-light text-amber-900 [font-family:var(--font-playfair)] mb-4">
            {header.title}
          </h2>
          {header.subtitle && (
            <p className="text-lg text-amber-800/70 max-w-2xl mx-auto [font-family:var(--font-inter)]">
              {header.subtitle}
            </p>
          )}
          <div className="w-24 h-px bg-gradient-to-r from-transparent via-amber-400 to-transparent mx-auto mt-6"></div>
        </motion.div>

        {/* Services Grid - Responsive masonry layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 auto-rows-fr gap-6 lg:gap-8 max-w-7xl mx-auto">
          {items.map((item, index) => {
            const IconComponent = getServiceIcon(item.iconName);
            const backgroundImage = getMediaUrl(item.image);
            const accentColor = item.accentColor || '#d97706'; // Default to amber-600
            const hasLink = item.ctaButton?.href;

            const cardContent = (
              <div className="relative h-full bg-white/80 backdrop-blur-sm rounded-2xl sm:rounded-3xl border border-amber-100/50 hover:border-amber-200/70 transition-all duration-500 hover:shadow-2xl hover:shadow-amber-500/10 overflow-hidden group-hover:scale-[1.02] transform">
                {/* Full background image if provided */}
                {backgroundImage && (
                  <div
                    className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-15 group-hover:opacity-25 group-hover:scale-105 transition-all duration-700"
                    style={{ backgroundImage: `url(${backgroundImage})` }}
                  />
                )}

                {/* Service card overlay */}
                <div
                  className="absolute inset-0 transition-opacity duration-500"
                  style={{
                    background: backgroundImage
                      ? 'linear-gradient(135deg, rgba(69, 28, 21, 0.85) 0%, rgba(69, 28, 21, 0.75) 50%, rgba(69, 28, 21, 0.85) 100%)'
                      : `linear-gradient(135deg, ${accentColor}20 0%, transparent 50%, ${accentColor}10 100%)`,
                    opacity: backgroundImage ? 1 : 0.5
                  }}
                />

                <div className="relative z-10 p-6 sm:p-8 h-full flex flex-col">
                  {/* Badge if exists */}
                  {item.badge && (
                    <span
                      className="absolute top-4 right-4 px-3 py-1 text-xs font-semibold rounded-full"
                      style={{
                        backgroundColor: backgroundImage ? 'rgba(255, 255, 255, 0.2)' : `${accentColor}20`,
                        color: backgroundImage ? 'white' : accentColor
                      }}
                    >
                      {item.badge}
                    </span>
                  )}

                  {/* Icon */}
                  <div className="mb-6">
                    <div
                      className="inline-flex items-center justify-center w-14 h-14 sm:w-16 sm:h-16 rounded-2xl transition-all duration-500 group-hover:scale-110"
                      style={{
                        backgroundColor: backgroundImage ? 'rgba(255, 255, 255, 0.15)' : `${accentColor}15`,
                        border: backgroundImage ? '2px solid rgba(255, 255, 255, 0.3)' : `2px solid ${accentColor}30`
                      }}
                    >
                      <div style={{ color: backgroundImage ? 'white' : accentColor }}>
                        <IconComponent className="w-7 h-7 sm:w-8 sm:h-8 transition-colors duration-500" />
                      </div>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="flex-1">
                    <h3 className={`text-xl sm:text-2xl font-light [font-family:var(--font-playfair)] mb-3 group-hover:text-amber-800 transition-colors duration-300 ${
                      backgroundImage ? 'text-white' : 'text-amber-900'
                    }`}>
                      {item.title}
                    </h3>
                    <p className={`text-sm sm:text-base leading-relaxed [font-family:var(--font-inter)] mb-6 ${
                      backgroundImage ? 'text-white/90' : 'text-amber-800/70'
                    }`}>
                      {extractTextFromBlocks(item.description)}
                    </p>
                  </div>

                  {/* Price if exists */}
                  {item.price && (
                    <p className={`text-lg sm:text-xl font-semibold mb-4 ${
                      backgroundImage ? 'text-white' : 'text-amber-900'
                    }`}>
                      {item.price}
                    </p>
                  )}

                  {/* CTA Button */}
                  {item.ctaButton?.text && (
                    <div
                      className="flex items-center text-sm font-medium group-hover:gap-2 transition-all duration-300"
                      style={{ color: backgroundImage ? 'white' : accentColor }}
                    >
                      <span className="group-hover:translate-x-1 transition-transform duration-300">
                        {item.ctaButton.text}
                      </span>
                      <ArrowRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-all duration-300" />
                    </div>
                  )}
                </div>

                {/* Hover effect overlay */}
                <div className="absolute inset-0 rounded-2xl sm:rounded-3xl bg-gradient-to-br from-white/0 via-transparent to-amber-50/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
              </div>
            );

            return (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                className={`group relative ${
                  item.gridClass === 'col-span-3'
                    ? 'col-span-1 md:col-span-2 lg:col-span-3'
                    : item.gridClass === 'col-span-2'
                    ? 'col-span-1 md:col-span-2 lg:col-span-2'
                    : item.gridClass === 'row-span-2'
                    ? 'col-span-1 lg:row-span-2'
                    : 'col-span-1'
                }`}
              >
                {hasLink && item.ctaButton?.href ? (
                  <Link
                    href={item.ctaButton.href.startsWith('/') && !item.ctaButton.href.startsWith(`/${locale}`)
                      ? `/${locale}${item.ctaButton.href}`
                      : item.ctaButton.href}
                    className="block h-full"
                  >
                    {cardContent}
                  </Link>
                ) : (
                  <div className="h-full">
                    {cardContent}
                  </div>
                )}
              </motion.div>
            );
          })}
        </div>

        {/* Bottom decorative element */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          viewport={{ once: true }}
          className="flex justify-center mt-16 sm:mt-20"
        >
          <div className="flex items-center gap-2 text-amber-600/40">
            <div className="w-2 h-2 rounded-full bg-amber-400/30"></div>
            <div className="w-3 h-3 rounded-full bg-amber-400/50"></div>
            <Sparkles className="w-4 h-4" />
            <div className="w-3 h-3 rounded-full bg-amber-400/50"></div>
            <div className="w-2 h-2 rounded-full bg-amber-400/30"></div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
