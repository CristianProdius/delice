import Image from 'next/image';
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

export function About({ data }: AboutProps) {
  const { header, intro, listItem, portrait, ctaButton } = data;

  // Handle portrait image
  const media = Array.isArray(portrait.media) ? portrait.media[0] : portrait.media;
  const isAbsoluteUrl = media?.url?.startsWith('http://') || media?.url?.startsWith('https://');
  const portraitImageUrl = media?.url
    ? (isAbsoluteUrl ? media.url : `${STRAPI_URL}${media.url}`)
    : '/placeholder.jpg';

  const textAlign = header.alignment === 'center'
    ? 'text-center'
    : header.alignment === 'right'
    ? 'text-right'
    : 'text-left';

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

        {/* Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left: Portrait Image */}
          <div className="relative h-[500px] rounded-lg overflow-hidden shadow-xl">
            <Image
              src={portraitImageUrl}
              alt={portrait.alt}
              fill
              className="object-cover"
              sizes="(max-width: 1024px) 100vw, 50vw"
            />
          </div>

          {/* Right: Content */}
          <div className="space-y-6">
            {/* Intro Quote */}
            {intro && intro.length > 0 && (
              <blockquote className="text-xl md:text-2xl font-medium italic text-foreground border-l-4 border-primary pl-6">
                {extractTextFromBlocks(intro)}
              </blockquote>
            )}

            {/* List Items */}
            {listItem && listItem.length > 0 && (
              <ul className="space-y-3">
                {listItem.map((item) => (
                  <li key={item.id} className="flex items-start">
                    <svg
                      className="w-6 h-6 text-primary mr-3 mt-0.5 flex-shrink-0"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                    <span className="text-lg text-foreground">{item.text}</span>
                  </li>
                ))}
              </ul>
            )}

            {/* CTA Button */}
            {ctaButton?.text && ctaButton?.href && (
              <div className="pt-4">
                <Link
                  href={ctaButton.href}
                  className="inline-flex items-center justify-center px-6 py-3 text-base font-semibold text-white bg-primary hover:bg-primary/90 rounded-lg transition-colors duration-200 shadow-md hover:shadow-lg"
                >
                  {ctaButton.text}
                  <svg
                    className="ml-2 w-5 h-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
