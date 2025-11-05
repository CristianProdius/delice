import { notFound } from 'next/navigation';
import { getService } from '@/lib/strapi/api';
import { Hero } from '@/features/home/components/Hero';
import { Services } from '@/features/home/components/Services';
import { Gallery } from '@/features/home/components/Gallery';
import { Testimonials } from '@/features/home/components/Testimonials';
import { Banner } from '@/features/home/components/Banner';
import { FAQ } from '@/features/home/components/FAQ';
import { About } from '@/features/home/components/About';
import { Benefits } from '@/features/home/components/Benefits';
import {
  HeroSection,
  ServicesSection,
  GallerySection,
  TestimonialsSection,
  BannerSection,
  FAQSection,
  AboutSection,
  BenefitsSection
} from '@/types/strapi';

interface ServicePageProps {
  params: Promise<{
    locale: string;
    slug: string;
  }>;
}

export default async function ServicePage({ params }: ServicePageProps) {
  const { locale, slug } = await params;

  let service;
  try {
    service = await getService(slug, locale);
  } catch (error) {
    console.error('Error fetching service:', error);
    notFound();
  }

  if (!service) {
    notFound();
  }

  // If the service has dynamic sections, render them
  const sections = service.sections || [];

  return (
    <main className="min-h-screen">
      {/* Service header - always show */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-primary/5 to-primary/10">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">{service.title}</h1>
          {service.shortDescription && (
            <p className="text-xl text-muted-foreground mb-6">{service.shortDescription}</p>
          )}
        </div>
      </section>

      {/* Main content - render description if no sections */}
      {sections.length === 0 && service.description && (
        <section className="py-16 px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto prose prose-lg">
            {/* Render blocks - you'll need a BlocksRenderer component */}
            <div className="space-y-4">
              {service.description.map((block: any, index: number) => {
                if (block.type === 'paragraph') {
                  return (
                    <p key={index} className="text-lg leading-relaxed">
                      {block.children.map((child: any) => child.text).join('')}
                    </p>
                  );
                }
                if (block.type === 'heading') {
                  const HeadingTag = `h${block.level}` as 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';
                  return (
                    <HeadingTag key={index} className="font-bold mt-8 mb-4">
                      {block.children.map((child: any) => child.text).join('')}
                    </HeadingTag>
                  );
                }
                if (block.type === 'list') {
                  return (
                    <ul key={index} className="list-disc list-inside space-y-2 my-4">
                      {block.children.map((item: any, i: number) => (
                        <li key={i} className="text-lg">
                          {item.children.map((child: any) => child.text).join('')}
                        </li>
                      ))}
                    </ul>
                  );
                }
                return null;
              })}
            </div>
          </div>
        </section>
      )}

      {/* Dynamic sections if they exist */}
      {sections.length > 0 && (
        <>
          {sections.map((section: any, index: number) => {
            switch (section.__component) {
              case 'sections.hero':
                return <Hero key={`hero-${index}`} data={section as HeroSection} />;

              case 'sections.services':
                return <Services key={`services-${index}`} data={section as ServicesSection} locale={locale} />;

              case 'sections.gallery':
                return <Gallery key={`gallery-${index}`} data={section as GallerySection} />;

              case 'sections.testimonials':
                return <Testimonials key={`testimonials-${index}`} data={section as TestimonialsSection} />;

              case 'sections.banner':
                return <Banner key={`banner-${index}`} data={section as BannerSection} />;

              case 'sections.faq':
                return <FAQ key={`faq-${index}`} data={section as FAQSection} />;

              case 'sections.about':
                return <About key={`about-${index}`} data={section as AboutSection} />;

              case 'sections.benefits':
                return <Benefits key={`benefits-${index}`} data={section as BenefitsSection} />;

              default:
                return null;
            }
          })}
        </>
      )}
    </main>
  );
}
