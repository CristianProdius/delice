import { getPage, getPosts } from '@/lib/strapi/api';
import { BlogList } from '@/features/blog/components/BlogList';
import { Hero } from '@/features/home/components/Hero';
import { Banner } from '@/features/home/components/Banner';
import { HeroSection, BannerSection } from '@/types/strapi';

export default async function BlogPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  try {
    // Fetch blog page and posts from Strapi
    const page = await getPage('blog', locale);
    const response = await getPosts(locale);
    const posts = response.data || [];

    // Extract sections from page
    const heroSection = page?.sections?.find(
      (section: any) => section.__component === 'sections.hero'
    ) as HeroSection | undefined;

    const bannerSection = page?.sections?.find(
      (section: any) => section.__component === 'sections.banner'
    ) as BannerSection | undefined;

    return (
      <main className="min-h-screen">
        {/* Hero Section from Strapi */}
        {heroSection && <Hero data={heroSection} />}

        {/* Blog Posts Grid */}
        <section className="py-16" id="posts">
          <div className="container mx-auto px-4">
            <BlogList posts={posts} locale={locale} />
          </div>
        </section>

        {/* Banner Section from Strapi */}
        {bannerSection && <Banner data={bannerSection} />}
      </main>
    );
  } catch (error) {
    console.error('Error fetching blog page or posts:', error);
    return (
      <main className="min-h-screen p-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold mb-4">Error Loading Blog</h1>
          <p className="text-muted-foreground">
            Could not connect to Strapi CMS. Please check your environment variables.
          </p>
        </div>
      </main>
    );
  }
}
