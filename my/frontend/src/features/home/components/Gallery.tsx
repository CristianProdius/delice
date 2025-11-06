"use client";

import { useState, useMemo } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { GallerySection } from '@/types/strapi';
import { STRAPI_URL } from '@/lib/strapi/client';

interface GalleryProps {
  data: GallerySection;
}

export function Gallery({ data }: GalleryProps) {
  const { header, images } = data;
  const [activeCategory, setActiveCategory] = useState<string>('all');

  // Extract unique categories from images
  const categories = useMemo(() => {
    const uniqueCategories = new Set<string>();
    images.forEach(image => {
      if (image.category) {
        uniqueCategories.add(image.category);
      }
    });
    return ['all', ...Array.from(uniqueCategories)];
  }, [images]);

  // Filter images based on active category
  const filteredImages = useMemo(() => {
    if (activeCategory === 'all') return images;
    return images.filter(image => image.category === activeCategory);
  }, [images, activeCategory]);

  // Format category name for display
  const formatCategoryName = (category: string) => {
    if (category === 'all') return 'All Creations';
    return category.charAt(0).toUpperCase() + category.slice(1);
  };

  // Bento grid layout pattern - optimized for 6 images with no gaps
  const getBentoClass = (index: number) => {
    const patterns = [
      'lg:col-span-2 lg:row-span-2', // Large square (fills 2x2)
      'lg:col-span-1 lg:row-span-2', // Tall (fills 1x2)
      'lg:col-span-1 lg:row-span-2', // Tall (fills 1x2)
      'lg:col-span-2 lg:row-span-1', // Wide (fills 2x1)
      'lg:col-span-1 lg:row-span-1', // Regular (fills 1x1)
      'lg:col-span-1 lg:row-span-1', // Regular (fills 1x1)
    ];
    return patterns[index % patterns.length];
  };

  return (
    <section className="relative py-20 sm:py-24 lg:py-32 overflow-hidden bg-[#f5f1ed]">
      {/* Decorative elements */}
      <div className="absolute top-20 right-10 w-72 h-72 bg-[#fbbf24]/5 rounded-full blur-3xl" />
      <div className="absolute bottom-20 left-10 w-96 h-96 bg-[#d97706]/5 rounded-full blur-3xl" />

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

        {/* Category Filter Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          viewport={{ once: true }}
          className="flex flex-wrap justify-center gap-3 sm:gap-4 mb-12 sm:mb-16"
        >
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setActiveCategory(category)}
              className={`relative px-6 sm:px-8 py-2.5 sm:py-3 rounded-full text-sm sm:text-base font-medium transition-all duration-300 ${
                activeCategory === category
                  ? 'text-white shadow-lg'
                  : 'text-[#78350f] bg-white/80 hover:bg-white border border-[#d97706]/20 hover:border-[#d97706]/40 shadow-sm hover:shadow-md'
              }`}
            >
              {activeCategory === category && (
                <motion.div
                  layoutId="activeCategory"
                  className="absolute inset-0 bg-gradient-to-r from-[#f59e0b] to-[#d97706] rounded-full"
                  transition={{ type: "spring", duration: 0.6 }}
                />
              )}
              <span className="relative z-10">{formatCategoryName(category)}</span>
            </button>
          ))}
        </motion.div>

        {/* Bento Grid with Animation */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeCategory}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5 }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 auto-rows-[280px] gap-4 lg:gap-6"
          >
            {filteredImages.map((image, index) => {
              const media = Array.isArray(image.media) ? image.media[0] : image.media;
              const isAbsoluteUrl = media?.url?.startsWith('http://') || media?.url?.startsWith('https://');
              const imageUrl = media?.url
                ? (isAbsoluteUrl ? media.url : `${STRAPI_URL}${media.url}`)
                : '/placeholder.jpg';

              const bentoClass = getBentoClass(index);

              return (
                <motion.div
                  key={`${image.id}-${activeCategory}`}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5, delay: index * 0.08 }}
                  className={`group relative overflow-hidden rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-500 ${bentoClass}`}
                >
                  {/* Image */}
                  <div className="absolute inset-0">
                    <Image
                      src={imageUrl}
                      alt={image.alt}
                      fill
                      className="object-cover transition-transform duration-700 group-hover:scale-110"
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    />
                  </div>

                  {/* Gradient Overlay - More dramatic */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent opacity-70 group-hover:opacity-90 transition-opacity duration-500" />

                  {/* Category Badge - Top Right with amber gradient */}
                  {image.category && (
                    <div className="absolute top-5 right-5 z-10">
                      <motion.span
                        initial={{ x: 20, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        transition={{ delay: index * 0.1 + 0.3 }}
                        className="inline-block px-4 py-2 text-xs sm:text-sm font-bold bg-gradient-to-r from-[#fbbf24] to-[#f59e0b] text-[#3d2817] rounded-full shadow-xl backdrop-blur-sm"
                      >
                        {formatCategoryName(image.category)}
                      </motion.span>
                    </div>
                  )}

                  {/* Content - Bottom with better spacing */}
                  <div className="absolute inset-0 p-6 sm:p-8 flex flex-col justify-end">
                    <motion.div
                      initial={{ y: 20, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      transition={{ delay: index * 0.1 + 0.4 }}
                      className="transform translate-y-2 group-hover:translate-y-0 transition-transform duration-500"
                    >
                      {image.caption && (
                        <h3 className="text-xl sm:text-2xl lg:text-3xl font-bold text-white mb-2 leading-tight drop-shadow-lg">
                          {image.caption}
                        </h3>
                      )}
                      {image.title && (
                        <p className="text-sm sm:text-base text-white/95 leading-relaxed max-w-md drop-shadow-md">
                          {image.title}
                        </p>
                      )}

                      {/* Decorative line */}
                      <div className="w-16 h-1 bg-gradient-to-r from-[#fbbf24] to-transparent mt-4 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                    </motion.div>
                  </div>

                  {/* Hover Accent Border with gradient */}
                  <div className="absolute inset-0 border-2 border-[#fbbf24] opacity-0 group-hover:opacity-100 rounded-3xl transition-opacity duration-500 pointer-events-none" />

                  {/* Corner accent */}
                  <div className="absolute top-0 left-0 w-20 h-20 bg-gradient-to-br from-[#fbbf24]/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-tl-3xl" />
                </motion.div>
              );
            })}
          </motion.div>
        </AnimatePresence>

        {/* No Results Message */}
        {filteredImages.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-16"
          >
            <p className="text-xl text-[#78350f]/60">No items found in this category.</p>
          </motion.div>
        )}
      </div>
    </section>
  );
}
