import Link from 'next/link';
import { ServicesSection } from '@/types/strapi';

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

export function Services({ data, locale = 'en' }: ServicesProps) {
  const { header, items } = data;

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

        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
          {items.map((item) => {
            const hasLink = item.ctaButton?.href;
            const cardContent = (
              <>
                {/* Badge if exists */}
                {item.badge && (
                  <span className="absolute top-4 right-4 px-2 py-1 text-xs font-semibold bg-primary/10 text-primary rounded">
                    {item.badge}
                  </span>
                )}

                {/* Title */}
                <h3 className="text-xl font-semibold mb-3 group-hover:text-primary transition-colors">
                  {item.title}
                </h3>

                {/* Description */}
                <p className="text-muted-foreground mb-4">
                  {extractTextFromBlocks(item.description)}
                </p>

                {/* Price if exists */}
                {item.price && (
                  <p className="text-lg font-bold text-primary mb-4">
                    {item.price}
                  </p>
                )}

                {/* CTA Button */}
                {item.ctaButton?.text && (
                  <div className="mt-4 text-primary font-medium group-hover:underline">
                    {item.ctaButton.text} →
                  </div>
                )}
              </>
            );

            return hasLink && item.ctaButton?.href ? (
              <Link
                key={item.id}
                href={item.ctaButton.href.startsWith('/') && !item.ctaButton.href.startsWith(`/${locale}`)
                  ? `/${locale}${item.ctaButton.href}`
                  : item.ctaButton.href}
                className="group relative bg-card p-6 rounded-lg border border-border hover:border-primary transition-all duration-300 hover:shadow-lg block"
              >
                {cardContent}
              </Link>
            ) : (
              <div
                key={item.id}
                className="group relative bg-card p-6 rounded-lg border border-border hover:border-primary transition-all duration-300 hover:shadow-lg"
              >
                {cardContent}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
