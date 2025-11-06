"use client";

import React from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { Award, TrendingUp, Users, Star } from 'lucide-react';
import { AboutSection } from '@/types/strapi';
import { Link } from '@/i18n/routing';
import { STRAPI_URL } from '@/lib/strapi/client';

interface AboutProps {
  data: AboutSection;
}

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

// Icon mapping for highlights
const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  'award': Award,
  'trending-up': TrendingUp,
  'users': Users,
  'star': Star,
};

export function About({ data }: AboutProps) {
  const { header, personName, role, roleSubtitle, highlight, intro, stats, listItem, portrait, ctaButton } = data;

  // Handle portrait image
  const media = Array.isArray(portrait.media) ? portrait.media[0] : portrait.media;
  const isAbsoluteUrl = media?.url?.startsWith('http://') || media?.url?.startsWith('https://');
  const portraitImageUrl = media?.url
    ? (isAbsoluteUrl ? media.url : `${STRAPI_URL}${media.url}`)
    : '/placeholder.jpg';

  return (
    <section className="relative py-20 sm:py-24 lg:py-32 overflow-hidden bg-[#f5f1ed]">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
        {/* Section Header - Centered */}
        {header.title && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-16 sm:mb-20"
          >
            {header.kicker && (
              <p className="text-sm sm:text-base font-medium text-[#92400e] uppercase tracking-wider mb-4">
                {header.kicker}
              </p>
            )}
            <h2 className="text-4xl sm:text-5xl lg:text-6xl font-serif text-[#3d2817] mb-6">
              {header.title}
            </h2>
            {header.subtitle && (
              <p className="text-lg sm:text-xl text-[#78350f]/70 max-w-3xl mx-auto leading-relaxed">
                {header.subtitle}
              </p>
            )}
          </motion.div>
        )}

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
          {/* Left Column: Portrait Image with Person Info */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7 }}
            viewport={{ once: true }}
            className="lg:col-span-5 relative"
          >
            <div className="relative h-[550px] sm:h-[650px] lg:h-[700px] rounded-3xl overflow-hidden shadow-2xl group">
              <Image
                src={portraitImageUrl}
                alt={portrait.alt || personName || 'About'}
                fill
                className="object-cover transition-transform duration-700 group-hover:scale-105"
                sizes="(max-width: 1024px) 100vw, 42vw"
                priority
              />

              {/* Elegant Gradient Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />

              {/* Person Info - Bottom Overlay */}
              {personName && (
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.7, delay: 0.2 }}
                  viewport={{ once: true }}
                  className="absolute bottom-0 left-0 right-0 p-8 text-white"
                >
                  <h3 className="text-3xl sm:text-4xl font-bold mb-3 leading-tight">{personName}</h3>
                  {role && (
                    <p className="text-base sm:text-lg text-[#fbbf24] font-medium mb-2 leading-relaxed">
                      {role}
                    </p>
                  )}
                  {roleSubtitle && (
                    <p className="text-sm sm:text-base text-white/90 italic">
                      {roleSubtitle}
                    </p>
                  )}
                </motion.div>
              )}
            </div>

            {/* Stats - 3 Column Grid Overlapping Image Bottom */}
            {stats && stats.length > 0 && (
              <div className="relative -mt-12 px-4">
                <div className="grid grid-cols-3 gap-3 sm:gap-4">
                  {stats.map((stat, index) => (
                    <motion.div
                      key={stat.id}
                      initial={{ opacity: 0, y: 30 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.6, delay: 0.1 * index }}
                      viewport={{ once: true }}
                      className="bg-white rounded-2xl p-4 sm:p-6 shadow-xl border border-[#d97706]/10 group hover:shadow-2xl hover:-translate-y-2 transition-all duration-300"
                    >
                      <div className="text-center">
                        <div className="text-2xl sm:text-3xl lg:text-4xl font-bold text-[#d97706] mb-2 group-hover:scale-110 transition-transform duration-300">
                          {stat.number}
                        </div>
                        <div className="text-xs sm:text-sm text-[#78350f]/80 font-medium leading-tight">
                          {stat.label}
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            )}
          </motion.div>

          {/* Right Column: Content */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7 }}
            viewport={{ once: true }}
            className="lg:col-span-7 space-y-8"
          >
            {/* Highlight Quote - Large and Prominent */}
            {highlight && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1 }}
                viewport={{ once: true }}
                className="relative"
              >
                <div className="absolute -top-6 -left-4 text-8xl text-[#fbbf24]/20 font-serif leading-none">&quot;</div>
                <div className="relative bg-white rounded-3xl p-8 sm:p-10 shadow-xl border border-[#d97706]/10">
                  <p className="text-xl sm:text-2xl lg:text-3xl font-medium text-[#3d2817] leading-relaxed italic">
                    {highlight}
                  </p>
                </div>
              </motion.div>
            )}

            {/* Intro Text */}
            {intro && intro.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                viewport={{ once: true }}
              >
                <p className="text-base sm:text-lg text-[#78350f]/80 leading-relaxed">
                  {extractTextFromBlocks(intro)}
                </p>
              </motion.div>
            )}

            {/* Key Points with Icons - Improved Layout */}
            {listItem && listItem.length > 0 && (
              <div className="space-y-5">
                {listItem.map((item, index) => {
                  const IconComponent = item.iconName ? iconMap[item.iconName] || Award : Award;

                  return (
                    <motion.div
                      key={item.id}
                      initial={{ opacity: 0, x: 30 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.6, delay: 0.1 * index }}
                      viewport={{ once: true }}
                      className="group"
                    >
                      <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 sm:p-7 shadow-lg hover:shadow-xl transition-all duration-300 border border-[#d97706]/10 hover:-translate-x-2">
                        <div className="flex items-start gap-5">
                          {/* Icon with Gradient Background */}
                          <div className="relative flex-shrink-0">
                            <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-gradient-to-br from-[#fbbf24] to-[#d97706] flex items-center justify-center group-hover:scale-110 group-hover:rotate-3 transition-all duration-300 shadow-lg">
                              <IconComponent className="w-7 h-7 sm:w-8 sm:h-8 text-white" />
                            </div>
                          </div>

                          {/* Content */}
                          <div className="flex-1 pt-1">
                            {item.title && (
                              <h4 className="text-lg sm:text-xl font-bold text-[#3d2817] mb-2 leading-tight">
                                {item.title}
                              </h4>
                            )}
                            <p className="text-sm sm:text-base text-[#78350f]/80 leading-relaxed">
                              {item.description || item.text}
                            </p>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            )}

            {/* CTA Button - More Prominent */}
            {ctaButton?.text && ctaButton?.href && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
                viewport={{ once: true }}
                className="pt-6"
              >
                <Link
                  href={ctaButton.href}
                  className="group inline-flex items-center gap-3 px-10 py-5 text-lg font-semibold text-white bg-gradient-to-r from-[#f59e0b] via-[#d97706] to-[#b45309] hover:from-[#d97706] hover:via-[#b45309] hover:to-[#92400e] rounded-full transition-all duration-500 shadow-2xl hover:shadow-3xl hover:-translate-y-1 relative overflow-hidden"
                >
                  <span className="relative z-10">{ctaButton.text}</span>
                  <svg
                    className="relative z-10 w-6 h-6 transition-transform duration-300 group-hover:translate-x-2"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M13 7l5 5m0 0l-5 5m5-5H6"
                    />
                  </svg>

                  {/* Animated shine effect */}
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />
                </Link>
              </motion.div>
            )}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
