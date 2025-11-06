"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { Sparkles } from 'lucide-react';
import { BenefitsSection } from '@/types/strapi';

interface BenefitsProps {
  data: BenefitsSection;
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

export function Benefits({ data }: BenefitsProps) {
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
          {header.kicker && (
            <p className="text-sm sm:text-base font-medium text-[#92400e] uppercase tracking-wider mb-3">
              {header.kicker}
            </p>
          )}
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-serif text-[#3d2817]">
            {header.title}
          </h2>
          {header.subtitle && (
            <p className="mt-4 text-base sm:text-lg text-[#78350f]/70 max-w-2xl">
              {header.subtitle}
            </p>
          )}
        </motion.div>

        {/* Benefits Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
          {items.map((item, index) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="group"
            >
              <div className="relative h-full bg-white/80 backdrop-blur-sm rounded-2xl sm:rounded-3xl p-6 sm:p-8 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border border-[#d97706]/10">
                {/* Decorative corner accent */}
                <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-[#fbbf24]/10 to-transparent rounded-bl-full" />

                {/* Number Badge */}
                <div className="relative mb-4">
                  <div className="w-14 h-14 rounded-full bg-gradient-to-br from-[#fbbf24]/20 to-[#d97706]/20 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                    <span className="text-2xl font-bold text-[#92400e]">{index + 1}</span>
                  </div>
                  {item.badge && (
                    <span className="absolute -top-1 -right-1">
                      <Sparkles className="w-5 h-5 text-[#fbbf24]" />
                    </span>
                  )}
                </div>

                {/* Content */}
                <div className="relative">
                  <h3 className="text-xl sm:text-2xl font-bold text-[#3d2817] mb-3 leading-tight">
                    {item.title}
                  </h3>

                  <p className="text-sm sm:text-base text-[#78350f]/80 leading-relaxed">
                    {extractTextFromBlocks(item.description)}
                  </p>

                  {item.price && (
                    <p className="mt-4 text-lg font-bold text-[#d97706]">
                      {item.price}
                    </p>
                  )}
                </div>

                {/* Hover accent line */}
                <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-[#fbbf24] via-[#f59e0b] to-[#d97706] transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left rounded-b-2xl sm:rounded-b-3xl" />
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
