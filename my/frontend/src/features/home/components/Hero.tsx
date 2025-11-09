"use client";

import React from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import { ArrowRight } from 'lucide-react';
import { HeroSection, Post } from '@/types/strapi';
import { STRAPI_URL } from '@/lib/strapi/client';
import { Link } from '@/i18n/routing';

interface HeroProps {
  data: HeroSection;
  latestPost?: Post;
}

export function Hero({ data, latestPost }: HeroProps) {
  const { header, personName, background, ctaButton, clientStats, clientAvatars } = data;

  // Handle Strapi 5 flat media structure
  const media = Array.isArray(background.media) ? background.media[0] : background.media;

  // Check if URL is already absolute (starts with http:// or https://)
  const isAbsoluteUrl = media?.url?.startsWith('http://') || media?.url?.startsWith('https://');
  const backgroundImageUrl = media?.url
    ? (isAbsoluteUrl ? media.url : `${STRAPI_URL}${media.url}`)
    : '/placeholder.jpg';

  // Get blog post image
  const blogMedia = latestPost?.coverImage ?
    (Array.isArray(latestPost.coverImage.media) ? latestPost.coverImage.media[0] : latestPost.coverImage.media) : null;
  const blogImageUrl = blogMedia?.url
    ? (blogMedia.url.startsWith('http') ? blogMedia.url : `${STRAPI_URL}${blogMedia.url}`)
    : '/placeholder.jpg';

  // Get avatar images - handle both array and object formats
  const avatarImages = (Array.isArray(clientAvatars) ? clientAvatars : [])?.slice(0, 3) || [];

  return (
    <section className="relative min-h-screen overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <Image
          src={backgroundImageUrl}
          alt={background.alt || 'Hero background'}
          fill
          className="object-cover"
          priority
          quality={90}
        />
        {/* Dark overlay for better text readability */}
        <div className="absolute inset-0 bg-gradient-to-br from-black/60 via-black/50 to-black/60" />
      </div>

      {/* Main Content Container */}
      <div className="relative z-10 w-full min-h-screen flex items-center px-3 sm:px-6 lg:px-8 py-8 sm:py-12 md:py-16">
        <div className="max-w-7xl mx-auto w-full">
          {/* Glass Morphism Container */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="relative backdrop-blur-xl bg-white/10 border border-white/20 rounded-2xl sm:rounded-2xl lg:rounded-3xl p-6 sm:p-6 md:p-8 lg:p-10 xl:p-12 shadow-2xl overflow-hidden w-full min-h-[85vh] sm:min-h-[75vh] md:min-h-[80vh] flex flex-col"
          >
            {/* Noise Texture Overlay */}
            <div
              className="absolute inset-0 opacity-[0.03] pointer-events-none"
              style={{
                backgroundImage:
                  "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='3.5' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E\")",
              }}
            />

            {/* Content wrapper */}
            <div className="relative flex flex-col items-center lg:items-start my-auto gap-16 sm:gap-20 md:gap-24">
              {/* Top Section: Main Title and CTA */}
              <div className="text-center lg:text-left w-full">
                <div className="w-full max-w-2xl mx-auto lg:mx-0">
                  {/* Main Headline - Optimized for mobile */}
                  <motion.h1
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2, duration: 0.8, ease: "easeOut" }}
                    className="mb-8 sm:mb-8 md:mb-10 [font-family:var(--font-playfair)] text-4xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-light leading-[1.15] sm:leading-tight tracking-tight"
                  >
                    <span className="text-white block">
                      {header.title}
                    </span>
                    {personName && (
                      <span className="text-white/90 italic font-extralight block mt-3 sm:mt-3 text-3xl sm:text-4xl md:text-5xl lg:text-6xl">
                        {personName}
                      </span>
                    )}
                  </motion.h1>

                  {/* CTA Button */}
                  {ctaButton?.text && ctaButton?.href && (
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.4, duration: 0.8 }}
                      className="flex justify-center lg:justify-start"
                    >
                      <Link
                        href={ctaButton.href}
                        className="inline-flex items-center justify-center gap-2 px-8 sm:px-8 py-4 sm:py-4 text-base sm:text-base md:text-lg font-semibold text-gray-900 bg-white rounded-full transition-all duration-300 hover:bg-gray-100 hover:scale-105 shadow-lg w-full sm:w-auto max-w-sm sm:max-w-none"
                      >
                        {ctaButton.text}
                      </Link>
                    </motion.div>
                  )}
                </div>
              </div>

              {/* Bottom Section: Author Quote, Client Count, and Blog Card */}
              <div className="flex flex-col lg:flex-row justify-center lg:justify-between items-center lg:items-end gap-5 sm:gap-8 lg:gap-10 w-full max-w-full">

                {/* Left: Author Quote - Show last on mobile, first on desktop */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6, duration: 0.8 }}
                  className="w-full lg:max-w-md order-2 lg:order-1 text-center lg:text-left"
                >
                  {personName && (
                    <p className="text-sm sm:text-sm text-white/60 mb-2 sm:mb-2">// {personName}</p>
                  )}
                  {header.subtitle && (
                    <p className="text-white/80 text-sm sm:text-sm md:text-base leading-relaxed">
                      {header.subtitle}
                    </p>
                  )}
                </motion.div>

                {/* Right: Client Count and Blog Card - Show first on mobile, last on desktop */}
                <div className="flex flex-col items-center lg:items-end gap-4 sm:gap-6 lg:gap-8 w-full lg:w-auto order-1 lg:order-2">

                  {/* Client Count Indicator */}
                  {clientStats && (
                    <motion.div
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.7, duration: 0.8 }}
                      className="flex items-center justify-center lg:justify-start gap-3 sm:gap-3 md:gap-4 bg-white/10 backdrop-blur-md border border-white/20 rounded-full px-4 py-2.5 sm:px-4 sm:py-2 md:px-6 md:py-3 w-full sm:w-auto"
                    >
                      {/* Profile Images */}
                      {avatarImages.length > 0 && (
                        <div className="flex -space-x-2 sm:-space-x-3">
                          {avatarImages.map((avatar, index) => {
                            const avatarUrl = avatar.url?.startsWith('http')
                              ? avatar.url
                              : `${STRAPI_URL}${avatar.url}`;
                            return (
                              <div
                                key={avatar.id || index}
                                className="w-8 h-8 sm:w-8 sm:h-8 md:w-10 md:h-10 rounded-full border-2 border-white/30 overflow-hidden relative"
                              >
                                <Image
                                  src={avatarUrl}
                                  alt={avatar.alternativeText || `Client ${index + 1}`}
                                  fill
                                  className="object-cover"
                                />
                              </div>
                            );
                          })}
                          <div className="w-8 h-8 sm:w-8 sm:h-8 md:w-10 md:h-10 rounded-full border-2 border-white/30 bg-white/20 backdrop-blur-sm flex items-center justify-center">
                            <span className="text-white text-xs sm:text-sm font-semibold">+</span>
                          </div>
                        </div>
                      )}

                      {/* Count */}
                      <div className="flex flex-col">
                        <span className="text-white font-bold text-xl sm:text-xl md:text-2xl">{clientStats.number}</span>
                        <span className="text-white/70 text-xs sm:text-xs md:text-sm whitespace-nowrap">{clientStats.label}</span>
                      </div>
                    </motion.div>
                  )}

                  {/* Blog Post Card */}
                  {latestPost && (
                    <motion.div
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.8, duration: 0.8 }}
                      className="w-full lg:w-auto"
                    >
                      <Link
                        href={`/blog/${latestPost.slug}`}
                        className="group flex items-center gap-3 sm:gap-3 md:gap-4 bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl sm:rounded-2xl lg:rounded-3xl overflow-hidden hover:bg-white/15 transition-all duration-300 w-full lg:max-w-sm"
                      >
                        {/* Blog Image */}
                        <div className="relative w-24 h-24 sm:w-24 sm:h-24 md:w-28 md:h-28 lg:w-32 lg:h-32 flex-shrink-0">
                          <Image
                            src={blogImageUrl}
                            alt={latestPost.title}
                            fill
                            className="object-cover"
                          />
                        </div>

                        {/* Blog Content */}
                        <div className="flex-1 py-3 sm:py-3 md:py-4 pr-3 sm:pr-3 md:pr-4 min-w-0">
                          <h3 className="text-white font-semibold text-base sm:text-base md:text-lg mb-2 sm:mb-2 line-clamp-2 [font-family:var(--font-playfair)]">
                            {latestPost.title}
                          </h3>
                          <div className="flex items-center gap-1.5 sm:gap-2 text-white/70 text-xs sm:text-xs md:text-sm group-hover:text-white/90 transition-colors">
                            <span>Read More</span>
                            <ArrowRight className="w-3.5 h-3.5 sm:w-3 sm:h-3 md:w-4 md:h-4 group-hover:translate-x-1 transition-transform" />
                          </div>
                        </div>
                      </Link>
                    </motion.div>
                  )}
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
