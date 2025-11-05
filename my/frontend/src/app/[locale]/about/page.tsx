import { getPage } from '@/lib/strapi/api';
import { Hero } from '@/features/home/components/Hero';
import { About } from '@/features/home/components/About';
import { Gallery } from '@/features/home/components/Gallery';
import { Testimonials } from '@/features/home/components/Testimonials';
import { Banner } from '@/features/home/components/Banner';
import {
  HeroSection,
  AboutSection,
  GallerySection,
  TestimonialsSection,
  BannerSection
} from '@/types/strapi';

export default async function AboutPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  try {
    // Fetch the about page from Strapi
    const page = await getPage('about', locale);

    if (!page) {
      return (
        <main className="min-h-screen p-8">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-4xl font-bold mb-4">About Page Not Found</h1>
            <p className="text-muted-foreground">
              Please create a page with slug &quot;about&quot; in Strapi CMS
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

            case 'sections.about':
              return <About key={`about-${index}`} data={section as AboutSection} />;

            case 'sections.gallery':
              return <Gallery key={`gallery-${index}`} data={section as GallerySection} />;

            case 'sections.testimonials':
              return <Testimonials key={`testimonials-${index}`} data={section as TestimonialsSection} />;

            case 'sections.banner':
              return <Banner key={`banner-${index}`} data={section as BannerSection} />;

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
    console.error('Error fetching about page:', error);
    return (
      <main className="min-h-screen p-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold mb-4">Error Loading About Page</h1>
          <p className="text-muted-foreground">
            Could not connect to Strapi CMS. Please check your environment variables.
          </p>
        </div>
      </main>
    );
  }
}
