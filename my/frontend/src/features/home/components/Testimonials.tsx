"use client";

import { motion } from 'framer-motion';
import Image from 'next/image';
import { TestimonialsSection } from '@/types/strapi';
import { STRAPI_URL } from '@/lib/strapi/client';
import { Star, Quote } from 'lucide-react';

interface TestimonialsProps {
  data: TestimonialsSection;
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

export function Testimonials({ data }: TestimonialsProps) {
  const { header, items } = data;

  return (
    <section className="relative py-20 sm:py-24 lg:py-32 overflow-hidden bg-[#f5f1ed]">
      {/* Decorative elements */}
      <div className="absolute top-0 left-20 w-96 h-96 bg-[#fbbf24]/5 rounded-full blur-3xl" />
      <div className="absolute bottom-0 right-20 w-80 h-80 bg-[#d97706]/5 rounded-full blur-3xl" />

      <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-12 sm:mb-16"
        >
          {header.kicker && (
            <p className="text-xs sm:text-sm font-medium text-[#92400e] uppercase tracking-[0.2em] mb-4">
              {header.kicker}
            </p>
          )}
          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-serif text-[#3d2817] mb-6 leading-tight">
            {header.title}
          </h2>
          {header.subtitle && (
            <p className="text-base sm:text-lg text-[#78350f]/70 max-w-3xl mx-auto leading-relaxed">
              {header.subtitle}
            </p>
          )}
        </motion.div>

        {/* Symmetric Testimonials Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {items.map((item, index) => {
            // Get image URL if available
            const image = item.image;
            const media = Array.isArray(image) ? image[0] : image;
            const isAbsoluteUrl = media?.url?.startsWith('http://') || media?.url?.startsWith('https://');
            const imageUrl = media?.url
              ? (isAbsoluteUrl ? media.url : `${STRAPI_URL}${media.url}`)
              : null;

            return (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="group"
              >
                <div className="relative h-full bg-white rounded-3xl p-8 shadow-lg hover:shadow-2xl transition-all duration-500 border border-[#d97706]/10 hover:border-[#d97706]/30 flex flex-col">
                  {/* Quote Icon */}
                  <div className="mb-6">
                    <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#fbbf24] to-[#f59e0b] flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                      <Quote className="w-6 h-6 text-white" />
                    </div>
                  </div>

                  {/* 5-Star Rating */}
                  <div className="flex gap-1 mb-6">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className="w-4 h-4 fill-[#fbbf24] text-[#fbbf24]"
                      />
                    ))}
                  </div>

                  {/* Testimonial Text */}
                  <blockquote className="text-[#3d2817] leading-relaxed mb-8 flex-grow text-base">
                    &quot;{extractTextFromBlocks(item.description)}&quot;
                  </blockquote>

                  {/* Decorative Divider */}
                  <div className="w-16 h-1 bg-gradient-to-r from-[#fbbf24] to-[#f59e0b] rounded-full mb-6 group-hover:w-24 transition-all duration-500" />

                  {/* Author Info with Image */}
                  <div className="flex items-center gap-4">
                    {/* Profile Image or Initial */}
                    <div className="relative flex-shrink-0">
                      {imageUrl ? (
                        <div className="relative w-14 h-14 sm:w-16 sm:h-16 rounded-full overflow-hidden border-2 border-[#fbbf24] group-hover:scale-110 transition-transform duration-300">
                          <Image
                            src={imageUrl}
                            alt={item.title}
                            fill
                            className="object-cover"
                          />
                        </div>
                      ) : (
                        <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-gradient-to-br from-[#fbbf24] to-[#f59e0b] flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                          <span className="text-xl sm:text-2xl font-bold text-white">
                            {item.title.charAt(0)}
                          </span>
                        </div>
                      )}
                    </div>

                    <div className="flex-grow">
                      <p className="font-bold text-[#3d2817] text-base sm:text-lg">
                        {item.title}
                      </p>
                      {item.badge && (
                        <p className="text-sm text-[#78350f]/70">
                          {item.badge}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Hover Accent Border */}
                  <div className="absolute inset-0 border-2 border-[#fbbf24] opacity-0 group-hover:opacity-100 rounded-3xl transition-opacity duration-500 pointer-events-none" />
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Bottom Social Proof */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          viewport={{ once: true }}
          className="mt-16 text-center"
        >
          <p className="text-[#78350f]/70 text-sm sm:text-base">
            Trusted by <span className="font-bold text-[#d97706]">1000+</span> chocolate lovers worldwide
          </p>
        </motion.div>
      </div>
    </section>
  );
}
