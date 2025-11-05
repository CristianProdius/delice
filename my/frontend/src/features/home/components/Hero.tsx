"use client";

import React from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import { Star, ChevronDown } from 'lucide-react';
import { HeroSection } from '@/types/strapi';
import { STRAPI_URL } from '@/lib/strapi/client';
import { Link } from '@/i18n/routing';

interface HeroProps {
  data: HeroSection;
}

export function Hero({ data }: HeroProps) {
  const { header, personName, role, background, ctaButton } = data;

  // Handle Strapi 5 flat media structure
  const media = Array.isArray(background.media) ? background.media[0] : background.media;

  // Check if URL is already absolute (starts with http:// or https://)
  const isAbsoluteUrl = media?.url?.startsWith('http://') || media?.url?.startsWith('https://');
  const backgroundImageUrl = media?.url
    ? (isAbsoluteUrl ? media.url : `${STRAPI_URL}${media.url}`)
    : '/placeholder.jpg';

  return (
    <section className="relative min-h-screen overflow-hidden bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Background Image with Parallax */}
      <motion.div className="absolute inset-0 z-0">
        <div className="absolute inset-0">
          <Image
            src={backgroundImageUrl}
            alt={background.alt || 'Hero background'}
            fill
            className="object-cover"
            priority
            quality={90}
          />
          {/* Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-transparent" />

          {/* Premium Accent Overlay */}
          <div className="absolute inset-0 bg-gradient-to-tr from-primary/10 via-transparent to-primary/10" />
        </div>
      </motion.div>

      {/* Animated floating elements */}
      <div className="absolute top-10 sm:top-20 left-5 sm:left-10 md:left-20 opacity-20 pointer-events-none">
        <div className="w-20 sm:w-24 md:w-32 h-20 sm:h-24 md:h-32 rounded-full bg-gradient-to-br from-primary/40 to-primary/60 blur-2xl sm:blur-3xl animate-pulse" />
      </div>

      <div className="absolute bottom-10 sm:bottom-20 right-5 sm:right-10 md:right-20 opacity-20 pointer-events-none">
        <div className="w-24 sm:w-32 md:w-40 h-24 sm:h-32 md:h-40 rounded-full bg-gradient-to-br from-primary/40 to-primary/60 blur-2xl sm:blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
      </div>

      <div className="absolute top-1/3 right-1/4 opacity-30 pointer-events-none hidden sm:block">
        <div className="w-16 sm:w-20 md:w-24 h-16 sm:h-20 md:h-24 rounded-full bg-gradient-to-br from-primary/30 to-primary/50 blur-xl sm:blur-2xl animate-pulse" style={{ animationDelay: '2s' }} />
      </div>

      {/* Main Content Container */}
      <div className="relative z-10 flex min-h-screen items-center justify-center px-4 sm:px-6 lg:px-8 pt-16 sm:pt-20 pb-8 sm:pb-12 mt-6">
        <motion.div className="w-full max-w-7xl">
          {/* Glass Morphism Card */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="mx-auto max-w-7xl"
          >
            <div className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-2xl sm:rounded-3xl p-6 sm:p-8 md:p-12 lg:p-16 shadow-2xl">
              {/* Premium Badge (using kicker if available) */}
              {header.kicker && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.3, duration: 0.5 }}
                  className="inline-flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-1.5 sm:py-2 mb-4 sm:mb-6 rounded-full bg-gradient-to-r from-primary/20 to-primary/20 border border-primary/30"
                >
                  <Star className="w-3 h-3 sm:w-4 sm:h-4 text-primary" />
                  <span className="text-xs sm:text-sm font-medium text-white">
                    {header.kicker}
                  </span>
                </motion.div>
              )}

              {/* Main Headline */}
              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.4, duration: 0.6 }}
                className="mb-4 sm:mb-6 text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-bold leading-tight"
              >
                <span className="bg-gradient-to-r from-primary via-primary/80 to-primary/60 bg-clip-text text-transparent block">
                  {header.title}
                </span>
                {personName && (
                  <span className="text-white block mt-1 sm:mt-2">
                    {personName}
                  </span>
                )}
              </motion.h1>

              {/* Subtitle */}
              {header.subtitle && (
                <motion.p
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.5, duration: 0.6 }}
                  className="mb-6 sm:mb-8 md:mb-10 text-base sm:text-lg md:text-xl lg:text-2xl text-gray-200 max-w-3xl"
                >
                  {header.subtitle}
                </motion.p>
              )}

              {/* Role */}
              {role && (
                <motion.p
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.55, duration: 0.6 }}
                  className="mb-6 sm:mb-8 text-base sm:text-lg text-gray-300 max-w-2xl"
                >
                  {role}
                </motion.p>
              )}

              {/* CTA Button */}
              {ctaButton?.text && ctaButton?.href && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.6, duration: 0.6 }}
                  className="flex flex-col sm:flex-row gap-3 sm:gap-4 mb-8 sm:mb-10 md:mb-12"
                >
                  <Link
                    href={ctaButton.href}
                    className="group relative overflow-hidden px-6 sm:px-8 py-3 sm:py-4 text-base sm:text-lg font-semibold text-white rounded-xl sm:rounded-2xl transition-all duration-300 w-full sm:w-auto bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary shadow-xl hover:shadow-2xl hover:scale-105"
                  >
                    <span className="relative z-10 flex items-center justify-center gap-2">
                      {ctaButton.text}
                      <span className="group-hover:translate-x-1 transition-transform duration-300">→</span>
                    </span>
                  </Link>
                </motion.div>
              )}
            </div>
          </motion.div>

          {/* Scroll Indicator */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1, duration: 0.6 }}
            className="mt-8 sm:mt-12 flex justify-center"
          >
            <div className="flex flex-col items-center gap-1 sm:gap-2 cursor-pointer animate-bounce">
              <span className="text-white/60 text-xs sm:text-sm">
                Scroll to explore
              </span>
              <ChevronDown className="w-5 h-5 sm:w-6 sm:h-6 text-primary" />
            </div>
          </motion.div>
        </motion.div>
      </div>

      {/* Decorative Bottom Wave */}
      <div className="absolute bottom-0 left-0 right-0 z-20">
        <svg
          viewBox="0 0 1440 120"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-auto"
          preserveAspectRatio="none"
        >
          <path
            d="M0 120L60 110C120 100 240 80 360 70C480 60 600 60 720 65C840 70 960 80 1080 85C1200 90 1320 90 1380 90L1440 90V120H1380C1320 120 1200 120 1080 120C960 120 840 120 720 120C600 120 480 120 360 120C240 120 120 120 60 120H0Z"
            fill="white"
            fillOpacity="0.05"
          />
        </svg>
      </div>
    </section>
  );
}
