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

  const textAlign = header.alignment === 'center'
    ? 'text-center'
    : header.alignment === 'right'
    ? 'text-right'
    : 'text-left';

  return (
    <section className="py-16 md:py-24 bg-muted/30">
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

        {/* Benefits Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {items.map((item, index) => (
            <div
              key={item.id}
              className="flex flex-col items-center text-center group"
            >
              {/* Icon Circle with Number */}
              <div className="w-16 h-16 rounded-full bg-primary/10 text-primary flex items-center justify-center mb-4 group-hover:bg-primary group-hover:text-primary-foreground transition-all duration-300">
                <span className="text-2xl font-bold">{index + 1}</span>
              </div>

              {/* Badge if exists */}
              {item.badge && (
                <span className="mb-2 px-3 py-1 text-xs font-semibold bg-primary/10 text-primary rounded-full">
                  {item.badge}
                </span>
              )}

              {/* Title */}
              <h3 className="text-xl font-semibold mb-3">
                {item.title}
              </h3>

              {/* Description */}
              <p className="text-muted-foreground">
                {extractTextFromBlocks(item.description)}
              </p>

              {/* Price if exists */}
              {item.price && (
                <p className="mt-4 text-lg font-bold text-primary">
                  {item.price}
                </p>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
