"use client";

import React, { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import Image from "next/image";
import { BannerSection } from '@/types/strapi';
import { Link } from '@/i18n/routing';
import { Sparkles, Mail, Phone, MapPin, ArrowRight } from 'lucide-react';
import { STRAPI_URL } from '@/lib/strapi/client';

interface BannerProps {
  data: BannerSection;
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

export function Banner({ data }: BannerProps) {
  const {
    header,
    description,
    ctaButtons,
    contactEmail,
    contactPhone,
    contactAddress,
    foregroundImage,
    mascotQuote
  } = data;

  // React hooks for parallax effects
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  });

  const mascotY = useTransform(scrollYProgress, [0, 1], [30, -30]);
  const mascotRotate = useTransform(scrollYProgress, [0, 1], [-3, 3]);
  const floatY = useTransform(scrollYProgress, [0, 0.5, 1], [0, -20, 0]);

  // Get mascot image URL - handle both direct media and ImageComponent
  let mascotImageUrl = null;
  if (foregroundImage) {
    // foregroundImage is an ImageComponent, so access its media property
    const mediaData = foregroundImage.media;
    const media = Array.isArray(mediaData) ? mediaData[0] : mediaData;

    if (media?.url) {
      const isAbsoluteUrl = media.url.startsWith('http://') || media.url.startsWith('https://');
      mascotImageUrl = isAbsoluteUrl ? media.url : `${STRAPI_URL}${media.url}`;
    }
  }

  return (
    <section
      ref={containerRef}
      className="relative w-full py-12 sm:py-16 lg:py-20 overflow-hidden bg-[#f5f1ed]"
    >
      {/* Premium layered background - matching other sections */}
      <div className="absolute inset-0">
        {/* Base with subtle patterns */}
        <div className="absolute inset-0 bg-[#f5f1ed]" />

        {/* Decorative blur elements */}
        <div className="absolute top-10 right-10 w-64 h-64 bg-[#fbbf24]/5 rounded-full blur-3xl" />
        <div className="absolute bottom-10 left-10 w-80 h-80 bg-[#d97706]/5 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
          {/* Left Content */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: [0.43, 0.13, 0.23, 0.96] }}
            viewport={{ once: true }}
            className="text-center lg:text-left"
          >
            {/* Premium sparkle decoration */}
            {header.kicker && (
              <motion.div
                initial={{ opacity: 0, scale: 0 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6, type: "spring", stiffness: 100 }}
                viewport={{ once: true }}
                className="inline-flex items-center gap-2 mb-6"
              >
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
                >
                  <Sparkles className="w-3 h-3 sm:w-4 sm:h-4 text-[#d97706]" />
                </motion.div>
                <span className="text-[#92400e] text-xs sm:text-sm font-medium tracking-[0.2em] uppercase">
                  {header.kicker}
                </span>
                <motion.div
                  animate={{ rotate: -360 }}
                  transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
                >
                  <Sparkles className="w-3 h-3 sm:w-4 sm:h-4 text-[#d97706]" />
                </motion.div>
              </motion.div>
            )}

            {/* Premium heading */}
            <motion.h2
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              viewport={{ once: true }}
              className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-light text-[#3d2817] mb-4 leading-tight font-serif"
            >
              <span className="relative inline-block">
                <span className="relative z-10 italic">{header.title}</span>
                <motion.div
                  className="absolute -bottom-1 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-[#d97706] to-transparent"
                  initial={{ scaleX: 0 }}
                  whileInView={{ scaleX: 1 }}
                  transition={{ delay: 0.8, duration: 0.8 }}
                  viewport={{ once: true }}
                />
              </span>
            </motion.h2>

            {/* Enhanced description */}
            {description && description.length > 0 && (
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.3 }}
                viewport={{ once: true }}
                className="text-[#3d2817]/70 text-sm sm:text-base mb-8 font-light leading-relaxed max-w-xl mx-auto lg:mx-0"
              >
                {extractTextFromBlocks(description)}
              </motion.p>
            )}

            {/* Premium CTA Buttons */}
            {ctaButtons && ctaButtons.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.4 }}
                viewport={{ once: true }}
                className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center lg:justify-start mb-8"
              >
                {ctaButtons.map((button, index) => (
                  <motion.div
                    key={button.id || index}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="relative group"
                  >
                    {index === 0 ? (
                      // Primary CTA - Dark background
                      <>
                        <div className="absolute inset-0 bg-gradient-to-r from-[#d97706] to-[#f59e0b] rounded-full blur-lg opacity-20 group-hover:opacity-30 transition-opacity duration-500" />
                        <Link
                          href={button.href || '#'}
                          className="relative bg-gradient-to-r from-[#3d2817] to-[#5A241C] text-white hover:from-[#5A241C] hover:to-[#3d2817] px-6 sm:px-8 py-3 sm:py-4 rounded-full overflow-hidden shadow-lg w-full sm:w-auto flex items-center justify-center"
                        >
                          <div className="relative z-10 flex items-center justify-center gap-2">
                            <div className="text-left">
                              <span className="block text-sm sm:text-base font-medium">
                                {button.text}
                              </span>
                              {button.subtext && (
                                <span className="block text-xs opacity-80 font-light">
                                  {button.subtext}
                                </span>
                              )}
                            </div>
                            <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform duration-300" />
                          </div>
                        </Link>
                      </>
                    ) : (
                      // Secondary CTA - Outlined
                      <Link
                        href={button.href || '#'}
                        className="group relative border-2 border-[#3d2817]/20 text-[#3d2817] hover:bg-[#3d2817]/5 backdrop-blur-sm px-6 sm:px-8 py-3 sm:py-4 rounded-full w-full sm:w-auto transition-all duration-300 flex items-center justify-center"
                      >
                        <div className="relative z-10">
                          <span className="block text-sm sm:text-base font-medium">
                            {button.text}
                          </span>
                          {button.subtext && (
                            <span className="block text-xs opacity-70 font-light">
                              {button.subtext}
                            </span>
                          )}
                        </div>
                        <div className="absolute inset-0 rounded-full bg-gradient-to-r from-[#3d2817]/0 via-[#3d2817]/5 to-[#3d2817]/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                      </Link>
                    )}
                  </motion.div>
                ))}
              </motion.div>
            )}

            {/* Premium Contact Info */}
            {(contactEmail || contactPhone || contactAddress) && (
              <motion.div
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                transition={{ duration: 0.8, delay: 0.5 }}
                viewport={{ once: true }}
                className="space-y-3"
              >
                {[
                  { icon: Mail, text: contactEmail, href: `mailto:${contactEmail}` },
                  { icon: Phone, text: contactPhone, href: `tel:${contactPhone}` },
                  { icon: MapPin, text: contactAddress, href: undefined },
                ].filter(item => item.text).map((item, index) => (
                  <motion.div
                    key={`${item.text}-${index}`}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.6 + index * 0.1, duration: 0.5 }}
                    viewport={{ once: true }}
                    className="group flex items-center gap-2 text-[#78350f]/70 hover:text-[#3d2817] transition-colors duration-300 justify-center lg:justify-start"
                  >
                    {item.href ? (
                      <a href={item.href} className="flex items-center gap-2">
                        <div className="p-1.5 rounded-full bg-[#3d2817]/5 group-hover:bg-[#3d2817]/10 transition-colors duration-300">
                          <item.icon className="w-3.5 h-3.5" />
                        </div>
                        <span className="text-xs sm:text-sm font-light">
                          {item.text}
                        </span>
                      </a>
                    ) : (
                      <>
                        <div className="p-1.5 rounded-full bg-[#3d2817]/5 group-hover:bg-[#3d2817]/10 transition-colors duration-300">
                          <item.icon className="w-3.5 h-3.5" />
                        </div>
                        <span className="text-xs sm:text-sm font-light">
                          {item.text}
                        </span>
                      </>
                    )}
                  </motion.div>
                ))}
              </motion.div>
            )}
          </motion.div>

          {/* Right: Enhanced Cat Mascot with premium effects - extends beyond container */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="relative flex items-center justify-center lg:justify-end mt-8 lg:mt-0 lg:-mr-12 xl:-mr-20"
          >
            {/* Multi-layer glow effect */}
            <div className="absolute inset-0 flex items-center justify-center">
              <motion.div
                className="absolute w-[200px] h-[200px] sm:w-[300px] sm:h-[300px] rounded-full"
                style={{
                  background:
                    "radial-gradient(circle, rgba(251, 191, 36, 0.08) 0%, transparent 70%)",
                  filter: "blur(60px)",
                }}
                animate={{
                  scale: [1, 1.1, 1],
                }}
                transition={{
                  duration: 4,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              />
            </div>

            {/* Mascot container with parallax */}
            <motion.div
              style={{
                y: mascotY,
                rotate: mascotRotate,
              }}
              className="relative z-10"
            >
              <motion.div
                style={{ y: floatY }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  repeatType: "reverse",
                  ease: "easeInOut",
                }}
                className="relative"
              >
                {/* Premium quote bubble */}
                {mascotQuote && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0, rotate: -10 }}
                    whileInView={{ opacity: 1, scale: 1, rotate: 0 }}
                    transition={{
                      delay: 0.6,
                      duration: 0.5,
                      type: "spring",
                      stiffness: 120,
                    }}
                    viewport={{ once: true }}
                    className="absolute -top-12 sm:-top-16 -left-4 sm:-left-8 lg:-left-12 z-20"
                  >
                    <div className="relative bg-gradient-to-br from-[#3d2817] to-[#5A241C] backdrop-blur-xl rounded-2xl p-3 sm:p-4 shadow-xl max-w-[160px] sm:max-w-[200px] border border-[#3d2817]/10">
                      <p className="text-white text-xs sm:text-sm italic font-light font-serif leading-snug">
                        &quot;{mascotQuote}&quot;
                      </p>
                      <div className="absolute -bottom-2 left-8 sm:left-12 w-4 h-4 bg-gradient-to-br from-[#3d2817] to-[#5A241C] rotate-45 border-r border-b border-[#3d2817]/10" />
                    </div>
                  </motion.div>
                )}

                {/* Cat illustration container */}
                <div className="relative w-48 h-64 sm:w-64 sm:h-80 lg:w-80 lg:h-96">
                  {mascotImageUrl ? (
                    <Image
                      src={mascotImageUrl}
                      alt={foregroundImage?.alt || "Mascot"}
                      fill
                      className="object-contain drop-shadow-2xl"
                      priority
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-[#3d2817]/20">
                      <p className="text-sm">No mascot image</p>
                    </div>
                  )}

                  {/* Animated sparkles with premium styling */}
                  <motion.div
                    className="absolute -top-4 -right-4 lg:-top-6 lg:-right-6"
                    animate={{
                      rotate: [0, 360],
                      scale: [1, 1.2, 1],
                    }}
                    transition={{
                      duration: 3,
                      repeat: Infinity,
                      ease: "linear",
                    }}
                  >
                    <Sparkles className="w-5 h-5 sm:w-6 sm:h-6 text-[#fbbf24] drop-shadow-lg" />
                  </motion.div>

                  <motion.div
                    className="absolute bottom-6 -left-4 lg:bottom-8 lg:-left-6"
                    animate={{
                      rotate: [0, -360],
                      scale: [0.8, 1, 0.8],
                    }}
                    transition={{
                      duration: 4,
                      repeat: Infinity,
                      ease: "linear",
                    }}
                  >
                    <Sparkles className="w-4 h-4 sm:w-5 sm:h-5 text-[#f59e0b] drop-shadow-lg" />
                  </motion.div>
                </div>
              </motion.div>
            </motion.div>
          </motion.div>
        </div>

        {/* Premium bottom decorative element */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.8, duration: 0.8 }}
          viewport={{ once: true }}
          className="mt-12 sm:mt-16 flex justify-center"
        >
          <svg
            viewBox="0 0 600 80"
            className="w-32 sm:w-48 lg:w-64 h-6 sm:h-8 fill-none"
          >
            {/* Animated path */}
            <motion.path
              d="M50,40 Q150,10 250,40 T450,40 T550,40"
              stroke="url(#cta-gradient-path-light)"
              strokeWidth="2"
              strokeLinecap="round"
              initial={{ pathLength: 0 }}
              whileInView={{ pathLength: 1 }}
              transition={{ duration: 2, ease: "easeInOut" }}
              viewport={{ once: true }}
            />

            {/* Animated dots */}
            {[50, 150, 250, 350, 450, 550].map((x, i) => (
              <motion.circle
                key={i}
                cx={x}
                cy="40"
                r="4"
                fill="#3d2817"
                initial={{ scale: 0, opacity: 0 }}
                whileInView={{ scale: 1, opacity: 0.4 }}
                transition={{ delay: 0.2 * i, duration: 0.5, type: "spring" }}
                viewport={{ once: true }}
              />
            ))}

            <defs>
              <linearGradient
                id="cta-gradient-path-light"
                x1="0%"
                y1="0%"
                x2="100%"
                y2="0%"
              >
                <stop offset="0%" stopColor="#3d2817" stopOpacity="0" />
                <stop offset="20%" stopColor="#d97706" stopOpacity="0.6" />
                <stop offset="50%" stopColor="#3d2817" stopOpacity="0.8" />
                <stop offset="80%" stopColor="#d97706" stopOpacity="0.6" />
                <stop offset="100%" stopColor="#3d2817" stopOpacity="0" />
              </linearGradient>
            </defs>
          </svg>
        </motion.div>
      </div>
    </section>
  );
}
