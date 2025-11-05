import Image from 'next/image';
import { HeroSection } from '@/types/strapi';
import { STRAPI_URL } from '@/lib/strapi/client';
import { Link } from '@/i18n/routing';

interface HeroProps {
  data: HeroSection;
}

export function Hero({ data }: HeroProps) {
  const { header, personName, role, background, ctaButton } = data;

  // Handle Strapi 5 flat media structure
  const media = Array.isArray(background.media) ? background.media[0] : background.media;

  // Check if URL is already absolute (starts with http:// or https://)
  const isAbsoluteUrl = media?.url?.startsWith('http://') || media?.url?.startsWith('https://');
  const backgroundImageUrl = media?.url
    ? (isAbsoluteUrl ? media.url : `${STRAPI_URL}${media.url}`)
    : '/placeholder.jpg';

  const textAlign = header.alignment === 'center'
    ? 'text-center'
    : header.alignment === 'right'
    ? 'text-right'
    : 'text-left';

  const alignItems = header.alignment === 'center'
    ? 'items-center'
    : header.alignment === 'right'
    ? 'items-end'
    : 'items-start';

  return (
    <section className="relative min-h-[80vh] flex items-center justify-center overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <Image
          src={backgroundImageUrl}
          alt={background.alt}
          fill
          className="object-cover"
          priority
          quality={90}
        />
        {/* Overlay */}
        <div className="absolute inset-0 bg-black/40" />
      </div>

      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 py-20">
        <div className={`max-w-4xl mx-auto flex flex-col ${alignItems} ${textAlign}`}>
          {/* Kicker */}
          {header.kicker && (
            <p className="text-sm md:text-base font-medium text-white/90 uppercase tracking-wider mb-4">
              {header.kicker}
            </p>
          )}

          {/* Title */}
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-white mb-6 leading-tight">
            {header.title}
          </h1>

          {/* Subtitle */}
          {header.subtitle && (
            <p className="text-lg md:text-xl text-white/90 mb-8 max-w-2xl">
              {header.subtitle}
            </p>
          )}

          {/* Person Info */}
          {(personName || role) && (
            <div className="mb-8">
              {personName && (
                <p className="text-2xl md:text-3xl font-semibold text-white mb-2">
                  {personName}
                </p>
              )}
              {role && (
                <p className="text-lg md:text-xl text-white/80">
                  {role}
                </p>
              )}
            </div>
          )}

          {/* CTA Button */}
          {ctaButton?.text && ctaButton?.href && (
            <Link
              href={ctaButton.href}
              className="inline-flex items-center justify-center px-8 py-4 text-lg font-semibold text-white bg-primary hover:bg-primary/90 rounded-lg transition-colors duration-200 shadow-lg hover:shadow-xl"
            >
              {ctaButton.text}
            </Link>
          )}
        </div>
      </div>
    </section>
  );
}
