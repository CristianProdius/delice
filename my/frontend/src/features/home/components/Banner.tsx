import { BannerSection } from '@/types/strapi';
import { Link } from '@/i18n/routing';

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
  const { header, description, ctaButtons, layout, theme } = data;

  const textAlign = layout === 'center'
    ? 'text-center'
    : layout === 'right'
    ? 'text-right'
    : 'text-left';

  const alignItems = layout === 'center'
    ? 'items-center'
    : layout === 'right'
    ? 'items-end'
    : 'items-start';

  // Theme background colors
  const bgColor = theme === 'primary'
    ? 'bg-primary text-primary-foreground'
    : theme === 'secondary'
    ? 'bg-secondary text-secondary-foreground'
    : 'bg-accent text-accent-foreground';

  return (
    <section className={`py-16 md:py-24 ${bgColor}`}>
      <div className="container mx-auto px-4">
        <div className={`max-w-4xl mx-auto flex flex-col ${alignItems} ${textAlign}`}>
          {/* Header */}
          {header.kicker && (
            <p className="text-sm md:text-base font-medium opacity-90 uppercase tracking-wider mb-2">
              {header.kicker}
            </p>
          )}
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4">
            {header.title}
          </h2>
          {header.subtitle && (
            <p className="text-lg md:text-xl opacity-90 mb-6 max-w-2xl">
              {header.subtitle}
            </p>
          )}

          {/* Description */}
          {description && description.length > 0 && (
            <p className="text-lg opacity-90 mb-8 max-w-2xl">
              {extractTextFromBlocks(description)}
            </p>
          )}

          {/* CTA Buttons */}
          {ctaButtons && ctaButtons.length > 0 && (
            <div className="flex flex-wrap gap-4 justify-center">
              {ctaButtons.map((button, index) => (
                <Link
                  key={button.id || index}
                  href={button.href || '#'}
                  className={`inline-flex items-center justify-center px-8 py-4 text-lg font-semibold rounded-lg transition-all duration-200 shadow-lg hover:shadow-xl ${
                    index === 0
                      ? 'bg-background text-foreground hover:bg-background/90'
                      : 'bg-transparent border-2 border-current hover:bg-background/10'
                  }`}
                >
                  {button.text}
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
