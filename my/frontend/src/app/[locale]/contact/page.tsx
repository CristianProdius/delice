import { getPage } from '@/lib/strapi/api';
import { Hero } from '@/features/home/components/Hero';
import { ContactForm } from '@/features/home/components/ContactForm';
import { Gallery } from '@/features/home/components/Gallery';
import { FAQ } from '@/features/home/components/FAQ';
import {
  HeroSection,
  ContactFormSection,
  GallerySection,
  FAQSection
} from '@/types/strapi';

export default async function ContactPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  try {
    // Fetch the contact page from Strapi
    const page = await getPage('contact', locale);

    if (!page) {
      return (
        <main className="min-h-screen p-8">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-4xl font-bold mb-4">Contact Page Not Found</h1>
            <p className="text-muted-foreground">
              Please create a page with slug &quot;contact&quot; in Strapi CMS
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

            case 'sections.contact-form':
              return <ContactForm key={`contact-${index}`} data={section as ContactFormSection} />;

            case 'sections.gallery':
              return <Gallery key={`gallery-${index}`} data={section as GallerySection} />;

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
    console.error('Error fetching contact page:', error);
    return (
      <main className="min-h-screen p-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold mb-4">Error Loading Contact Page</h1>
          <p className="text-muted-foreground">
            Could not connect to Strapi CMS. Please check your environment variables.
          </p>
        </div>
      </main>
    );
  }
}
