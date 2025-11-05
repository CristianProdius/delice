import Image from 'next/image';
import { GallerySection } from '@/types/strapi';
import { STRAPI_URL } from '@/lib/strapi/client';

interface GalleryProps {
  data: GallerySection;
}

export function Gallery({ data }: GalleryProps) {
  const { header, images, columns, layout } = data;

  const textAlign = header.alignment === 'center'
    ? 'text-center'
    : header.alignment === 'right'
    ? 'text-right'
    : 'text-left';

  // Grid column classes based on columns prop
  const gridCols = {
    2: 'md:grid-cols-2',
    3: 'md:grid-cols-2 lg:grid-cols-3',
    4: 'md:grid-cols-2 lg:grid-cols-4',
  }[columns] || 'md:grid-cols-3';

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

        {/* Gallery Grid */}
        <div className={`grid grid-cols-1 ${gridCols} gap-4 md:gap-6`}>
          {images.map((image) => {
            const media = Array.isArray(image.media) ? image.media[0] : image.media;
            const isAbsoluteUrl = media?.url?.startsWith('http://') || media?.url?.startsWith('https://');
            const imageUrl = media?.url
              ? (isAbsoluteUrl ? media.url : `${STRAPI_URL}${media.url}`)
              : '/placeholder.jpg';

            return (
              <div
                key={image.id}
                className="group relative aspect-square overflow-hidden rounded-lg bg-muted"
              >
                <Image
                  src={imageUrl}
                  alt={image.alt}
                  fill
                  className="object-cover transition-transform duration-300 group-hover:scale-110"
                  sizes={`(max-width: 768px) 100vw, (max-width: 1024px) 50vw, ${100 / columns}vw`}
                />

                {/* Overlay with caption on hover */}
                {(image.caption || image.alt) && (
                  <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end">
                    <div className="p-4 text-white">
                      {image.caption && (
                        <p className="font-semibold">{image.caption}</p>
                      )}
                      {!image.caption && image.alt && (
                        <p className="font-semibold">{image.alt}</p>
                      )}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
