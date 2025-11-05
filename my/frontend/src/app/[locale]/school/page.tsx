import { getPage } from '@/lib/strapi/api';
import { Hero } from '@/features/home/components/Hero';
import { Services } from '@/features/home/components/Services';
import { Gallery } from '@/features/home/components/Gallery';
import { Testimonials } from '@/features/home/components/Testimonials';
import { Banner } from '@/features/home/components/Banner';
import { FAQ } from '@/features/home/components/FAQ';
import {
  HeroSection,
  ServicesSection,
  GallerySection,
  TestimonialsSection,
  BannerSection,
  FAQSection
} from '@/types/strapi';

export default async function SchoolPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  try {
    // Fetch the school page from Strapi
    const page = await getPage('school', locale);

    if (!page) {
      return (
        <main className="min-h-screen p-8">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-4xl font-bold mb-4">School Page Not Found</h1>
            <p className="text-muted-foreground">
              Please create a page with slug &quot;school&quot; in Strapi CMS
            </p>
          </div>
        </main>
      );
    }

    // Extract sections from page
    const sections = page.sections || [];

    return (
      <main className="min-h-screen">
        {/* Render all sections in order they appear in Strapi */}
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

            default:
              return null;
          }
        })}

        {/* Fallback if no sections */}
        {sections.length === 0 && (
          <div className="p-8">
            <div className="max-w-4xl mx-auto">
              <h1 className="text-4xl font-bold mb-4">{page.title}</h1>
              <p className="text-muted-foreground">
                No sections found. Please add sections to this page in Strapi.
              </p>
            </div>
          </div>
        )}
      </main>
    );
  } catch (error) {
    console.error('Error fetching school page:', error);
    return (
      <main className="min-h-screen p-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold mb-4">Error Loading School Page</h1>
          <p className="text-muted-foreground">
            Could not connect to Strapi CMS. Please check your environment variables.
          </p>
        </div>
      </main>
    );
  }
}
