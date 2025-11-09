import { getPage, getLatestPost } from '@/lib/strapi/api';
import { Hero } from '@/features/home/components/Hero';
import { Services } from '@/features/home/components/Services';
import { Benefits } from '@/features/home/components/Benefits';
import { About } from '@/features/home/components/About';
import { Gallery } from '@/features/home/components/Gallery';
import { Testimonials } from '@/features/home/components/Testimonials';
import { Banner } from '@/features/home/components/Banner';
import { FAQ } from '@/features/home/components/FAQ';
import {
  HeroSection,
  ServicesSection,
  BenefitsSection,
  AboutSection,
  GallerySection,
  TestimonialsSection,
  BannerSection,
  FAQSection
} from '@/types/strapi';

export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  try {
    // Fetch the homepage from Strapi and the latest blog post
    const [page, latestPost] = await Promise.all([
      getPage('home', locale),
      getLatestPost(locale).catch(() => null), // Handle case where no posts exist
    ]);

    if (!page) {
      return (
        <main className="min-h-screen p-8">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-4xl font-bold mb-4">Homepage not found</h1>
            <p className="text-muted-foreground">
              Please create a page with slug &quot;home&quot; in Strapi CMS
            </p>
          </div>
        </main>
      );
    }

    // Extract sections from page (Strapi 5 has flat structure, no attributes wrapper)
    const heroSection = page.sections?.find(
      (section: any) => section.__component === 'sections.hero'
    ) as HeroSection | undefined;

    const servicesSection = page.sections?.find(
      (section: any) => section.__component === 'sections.services'
    ) as ServicesSection | undefined;

    const benefitsSection = page.sections?.find(
      (section: any) => section.__component === 'sections.benefits'
    ) as BenefitsSection | undefined;

    const aboutSection = page.sections?.find(
      (section: any) => section.__component === 'sections.about'
    ) as AboutSection | undefined;

    const gallerySection = page.sections?.find(
      (section: any) => section.__component === 'sections.gallery'
    ) as GallerySection | undefined;

    const testimonialsSection = page.sections?.find(
      (section: any) => section.__component === 'sections.testimonials'
    ) as TestimonialsSection | undefined;

    const bannerSection = page.sections?.find(
      (section: any) => section.__component === 'sections.banner'
    ) as BannerSection | undefined;

    const faqSection = page.sections?.find(
      (section: any) => section.__component === 'sections.faq'
    ) as FAQSection | undefined;

    return (
      <main className="min-h-screen">
        {/* Hero Section */}
        {heroSection && <Hero data={heroSection} latestPost={latestPost || undefined} />}

        {/* Services Section */}
        {servicesSection && <Services data={servicesSection} locale={locale} />}

        {/* Benefits Section */}
        {benefitsSection && <Benefits data={benefitsSection} />}

        {/* About Section */}
        {aboutSection && <About data={aboutSection} />}

        {/* Gallery Section */}
        {gallerySection && <Gallery data={gallerySection} />}

        {/* Testimonials Section */}
        {testimonialsSection && <Testimonials data={testimonialsSection} />}

        {/* Banner Section */}
        {bannerSection && <Banner data={bannerSection} />}

        {/* FAQ Section */}
        {faqSection && <FAQ data={faqSection} />}

        {/* Fallback if no sections */}
        {!page.sections?.length && (
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
    console.error('Error fetching homepage:', error);
    return (
      <main className="min-h-screen p-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold mb-4">Error loading homepage</h1>
          <p className="text-muted-foreground">
            Could not connect to Strapi CMS. Please check your environment variables.
          </p>
        </div>
      </main>
    );
  }
}
