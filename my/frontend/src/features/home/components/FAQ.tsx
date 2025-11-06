'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FAQSection } from '@/types/strapi';
import { ChevronDown } from 'lucide-react';

interface FAQProps {
  data: FAQSection;
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

export function FAQ({ data }: FAQProps) {
  const { header, questions } = data;
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const toggleQuestion = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section className="py-20 sm:py-24 lg:py-32 bg-[#f5f1ed]">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          {header.kicker && (
            <p className="text-[#92400e] text-sm font-medium tracking-wider uppercase mb-4">
              {header.kicker}
            </p>
          )}
          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-serif text-[#3d2817] mb-4">
            {header.title}
          </h2>
          {header.subtitle && (
            <p className="text-lg text-[#78350f]/70 max-w-2xl mx-auto mt-6">
              {header.subtitle}
            </p>
          )}
        </motion.div>

        {/* Simple FAQ List */}
        <div className="space-y-3">
          {questions.map((item, index) => {
            const isOpen = openIndex === index;

            return (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: index * 0.05 }}
                viewport={{ once: true }}
              >
                <div className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow duration-300 overflow-hidden">
                  {/* Question */}
                  <button
                    onClick={() => toggleQuestion(index)}
                    className="w-full px-6 py-5 flex items-center justify-between text-left group"
                  >
                    <div className="flex items-center gap-4 flex-1">
                      {/* Number */}
                      <span className="text-[#d97706] font-serif text-lg font-medium">
                        {String(index + 1).padStart(2, '0')}
                      </span>

                      {/* Question Text */}
                      <span className="text-[#3d2817] text-base sm:text-lg font-medium">
                        {item.question}
                      </span>
                    </div>

                    {/* Chevron */}
                    <ChevronDown
                      className={`w-5 h-5 text-[#d97706] transition-transform duration-300 flex-shrink-0 ${
                        isOpen ? 'rotate-180' : ''
                      }`}
                    />
                  </button>

                  {/* Answer */}
                  <AnimatePresence initial={false}>
                    {isOpen && (
                      <motion.div
                        initial={{ height: 0 }}
                        animate={{ height: 'auto' }}
                        exit={{ height: 0 }}
                        transition={{ duration: 0.3, ease: [0.04, 0.62, 0.23, 0.98] }}
                        className="overflow-hidden"
                      >
                        <div className="px-6 pb-6 pl-[4.5rem]">
                          <div className="pt-2 border-t border-[#d97706]/10">
                            <p className="text-[#3d2817]/70 text-sm sm:text-base leading-relaxed mt-4">
                              {extractTextFromBlocks(item.answer)}
                            </p>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
