'use client';

import { useState } from 'react';
import { FAQSection } from '@/types/strapi';

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
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const textAlign = header.alignment === 'center'
    ? 'text-center'
    : header.alignment === 'right'
    ? 'text-right'
    : 'text-left';

  const toggleQuestion = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section className="py-16 md:py-24 bg-background">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className={`mb-12 ${textAlign}`}>
          {header.kicker && (
            <p className="text-sm md:text-base font-medium text-muted-foreground uppercase tracking-wider mb-2">
              {header.kicker}
            </p>
          )}
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4">
            {header.title}
          </h2>
          {header.subtitle && (
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              {header.subtitle}
            </p>
          )}
        </div>

        {/* FAQ Accordion */}
        <div className="max-w-3xl mx-auto space-y-4">
          {questions.map((item, index) => (
            <div
              key={item.id}
              className="border border-border rounded-lg overflow-hidden bg-card"
            >
              {/* Question Button */}
              <button
                onClick={() => toggleQuestion(index)}
                className="w-full px-6 py-4 flex items-center justify-between text-left hover:bg-muted/50 transition-colors duration-200"
              >
                <span className="text-lg font-semibold text-foreground pr-4">
                  {item.question}
                </span>
                <svg
                  className={`w-6 h-6 text-muted-foreground flex-shrink-0 transition-transform duration-200 ${
                    openIndex === index ? 'rotate-180' : ''
                  }`}
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </button>

              {/* Answer */}
              <div
                className={`overflow-hidden transition-all duration-200 ${
                  openIndex === index ? 'max-h-96' : 'max-h-0'
                }`}
              >
                <div className="px-6 py-4 border-t border-border bg-muted/20">
                  <p className="text-foreground">
                    {extractTextFromBlocks(item.answer)}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
