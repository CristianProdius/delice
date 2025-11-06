"use client";

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { ServicesSection } from '@/types/strapi';
import { STRAPI_URL } from '@/lib/strapi/client';

interface ServicesProps {
  data: ServicesSection;
  locale?: string;
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

// Helper to get media URL from Strapi
function getMediaUrl(media?: any): string | null {
  if (!media?.url) return null;
  const isAbsoluteUrl = media.url.startsWith('http://') || media.url.startsWith('https://');
  return isAbsoluteUrl ? media.url : `${STRAPI_URL}${media.url}`;
}

export function Services({ data, locale = 'en' }: ServicesProps) {
  const { header, items } = data;

  return (
    <section className="relative py-16 sm:py-20 lg:py-24 overflow-hidden bg-[#f5f1ed]">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
        {/* Section Header - Simple left-aligned */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="mb-10 sm:mb-12 lg:mb-14"
        >
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-serif text-[#3d2817]">
            {header.title}
          </h2>
        </motion.div>

        {/* Services Grid - Bento layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 auto-rows-[300px] sm:auto-rows-[320px] gap-4 lg:gap-6">
          {items.map((item, index) => {
            const backgroundImage = getMediaUrl(item.image);
            const hasLink = item.ctaButton?.href;

            // Determine grid class
            const gridClass = item.gridClass === 'col-span-3'
              ? 'md:col-span-2 lg:col-span-3'
              : item.gridClass === 'col-span-2'
              ? 'md:col-span-2'
              : item.gridClass === 'row-span-2'
              ? 'md:row-span-2'
              : '';

            const cardContent = (
              <div className="relative h-full w-full rounded-2xl sm:rounded-3xl overflow-hidden group">
                {/* Background Image */}
                {backgroundImage && (
                  <div
                    className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-105"
                    style={{ backgroundImage: `url(${backgroundImage})` }}
                  />
                )}

                {/* Dark Overlay */}
                <div className="absolute inset-0 bg-gradient-to-br from-black/60 via-black/50 to-black/70" />

                {/* Content */}
                <div className="relative h-full flex flex-col justify-end p-5 sm:p-6 lg:p-8">
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.05 }}
                    viewport={{ once: true }}
                  >
                    <h3 className="text-xl sm:text-2xl lg:text-3xl font-bold text-white mb-2 sm:mb-3 leading-tight line-clamp-1">
                      {item.title}
                    </h3>
                    <p className="text-xs sm:text-sm lg:text-base text-white/90 mb-3 sm:mb-4 leading-relaxed line-clamp-3 max-w-lg">
                      {extractTextFromBlocks(item.description)}
                    </p>

                    {/* CTA Button */}
                    {item.ctaButton?.text && (
                      <button className="inline-flex items-center gap-1.5 sm:gap-2 px-4 py-2 sm:px-5 sm:py-2.5 text-xs sm:text-sm font-medium text-white bg-white/10 hover:bg-white/20 backdrop-blur-sm border border-white/30 rounded-full transition-all duration-300 group-hover:gap-3">
                        <span>{item.ctaButton.text}</span>
                        <ArrowRight className="w-3.5 h-3.5 sm:w-4 sm:h-4 transition-transform duration-300 group-hover:translate-x-1" />
                      </button>
                    )}
                  </motion.div>
                </div>

                {/* Hover Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              </div>
            );

            return (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.08 }}
                viewport={{ once: true }}
                className={`${gridClass}`}
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
      </div>
    </section>
  );
}
