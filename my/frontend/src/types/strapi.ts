// Base Strapi types
export interface StrapiResponse<T> {
  data: T;
  meta: StrapiMeta;
}

export interface StrapiMeta {
  pagination?: {
    page: number;
    pageSize: number;
    pageCount: number;
    total: number;
  };
}

// Strapi 5 returns flat data (no attributes wrapper)
export interface StrapiData {
  id: number;
  documentId: string;
}

// For backwards compatibility and type safety
export type StrapiEntity<T> = StrapiData & T;

export interface StrapiImage {
  id: number;
  documentId: string;
  name: string;
  alternativeText: string | null;
  caption: string | null;
  width: number;
  height: number;
  formats: {
    thumbnail?: ImageFormat;
    small?: ImageFormat;
    medium?: ImageFormat;
    large?: ImageFormat;
  };
  url: string;
}

export interface ImageFormat {
  name: string;
  hash: string;
  ext: string;
  mime: string;
  width: number;
  height: number;
  size: number;
  url: string;
}

// Component types based on your Strapi schema
export interface SectionHeader {
  id: number;
  kicker?: string;
  title: string;
  subtitle?: string;
  alignment: 'left' | 'center' | 'right';
}

export interface CTAButton {
  id: number;
  text?: string;
  subtext?: string;
  href?: string;
}

export interface ImageComponent {
  id: number;
  media?: StrapiImage | StrapiImage[]; // Strapi 5 flat structure - can be single or array
  alt: string;
  title?: string;
  caption?: string;
  lazyLoad: boolean;
  link?: string;
  category?: string;
}

export interface HeroSection {
  id: number;
  __component: 'sections.hero';
  header: SectionHeader;
  personName?: string;
  role?: string;
  background: ImageComponent;
  ctaButton: CTAButton;
}

export interface ServiceItem {
  id: number;
  title: string;
  description: any[]; // Rich text blocks
  image?: StrapiImage | null;
  icon?: StrapiImage | null;
  price?: string | null;
  badge?: string | null;
  variant: string;
  ctaButton?: CTAButton;
  iconName?: string | null;
  accentColor?: string | null;
  gridClass?: string | null;
}

export interface ServicesSection {
  id: number;
  __component: 'sections.services';
  header: SectionHeader;
  items: ServiceItem[];
}

export interface BenefitsSection {
  id: number;
  __component: 'sections.benefits';
  header: SectionHeader;
  items: ServiceItem[]; // Same structure as services
}

export interface ListItem {
  id: number;
  text: string;
  title?: string;
  description?: string;
  iconName?: string;
}

export interface Stat {
  id: number;
  number: string;
  label: string;
}

export interface AboutSection {
  id: number;
  __component: 'sections.about';
  header: SectionHeader;
  personName?: string;
  role?: string;
  roleSubtitle?: string;
  highlight?: string;
  intro: any[]; // Rich text blocks
  stats?: Stat[];
  listItem: ListItem[];
  portrait: ImageComponent;
  ctaButton: CTAButton;
}

export interface GallerySection {
  id: number;
  __component: 'sections.gallery';
  header: SectionHeader;
  layout: 'grid' | 'masonry' | 'carousel';
  columns: number;
  images: ImageComponent[];
}

export interface TestimonialsSection {
  id: number;
  __component: 'sections.testimonials';
  header: SectionHeader;
  items: ServiceItem[]; // Same structure as services/benefits
}

export interface FAQItem {
  id: number;
  question: string;
  answer: any[]; // Rich text blocks
}

export interface FAQSection {
  id: number;
  __component: 'sections.faq';
  header: SectionHeader;
  questions: FAQItem[];
}

export interface BannerSection {
  id: number;
  __component: 'sections.banner';
  header: SectionHeader;
  description: any[]; // Rich text blocks
  variant: 'cta' | 'info' | 'announcement';
  layout: 'center' | 'left' | 'right';
  theme: 'primary' | 'secondary' | 'accent';
  background?: ImageComponent | null;
  foregroundImage?: ImageComponent | null;
  signature?: StrapiImage | null;
  ctaButtons: CTAButton[];
  contactEmail?: string;
  contactPhone?: string;
  contactAddress?: string;
  mascotQuote?: string;
}

export interface ContactFormSection {
  id: number;
  __component: 'sections.contact-form';
  header: SectionHeader;
  successMessage: string;
  recipientEmail: string;
  consentText: string;
  enableHoneypot: boolean;
  privacyPolicyLink?: string;
}

export interface ProductImageComponent {
  id: number;
  image: {
    data: StrapiData;
  };
  alt?: string;
  isPrimary?: boolean;
}

export interface SEOComponent {
  id: number;
  metaTitle?: string;
  metaDescription?: string;
  keywords?: string;
  metaImage?: {
    data: StrapiData;
  };
  canonicalURL?: string;
}

// Content type attributes
export interface ProductAttributes {
  name: string;
  slug: string;
  description: any; // Blocks type
  images?: ProductImageComponent[];
  price: number;
  currency: string;
  category?: {
    data: StrapiData;
  };
  ingredients?: any;
  allergens?: string;
  weight?: string;
  availability: boolean;
  featured: boolean;
  seo?: SEOComponent;
  locale: string;
  createdAt: string;
  updatedAt: string;
  publishedAt: string;
}

export interface CategoryAttributes {
  name: string;
  slug: string;
  description?: string;
  image?: ImageComponent;
  order: number;
  locale: string;
  createdAt: string;
  updatedAt: string;
  publishedAt: string;
}

export interface CourseAttributes {
  title: string;
  slug: string;
  description: any; // Blocks type
  duration?: string;
  price: number;
  maxParticipants: number;
  schedule?: any;
  skillLevel: 'beginner' | 'intermediate' | 'advanced';
  whatYouWillLearn?: any[];
  image?: ImageComponent;
  gallery?: ImageComponent[];
  seo?: SEOComponent;
  locale: string;
  createdAt: string;
  updatedAt: string;
  publishedAt: string;
}

export interface ServiceAttributes {
  title: string;
  slug: string;
  shortDescription?: string;
  description: any; // Blocks type
  image?: ImageComponent;
  icon?: string;
  featured: boolean;
  order: number;
  sections?: (HeroSection | ServicesSection | GallerySection | TestimonialsSection | FAQSection | BannerSection | BenefitsSection | AboutSection)[];
  seo?: SEOComponent;
  locale: string;
  createdAt: string;
  updatedAt: string;
  publishedAt: string;
}

export interface PostAttributes {
  title: string;
  slug: string;
  excerpt?: string;
  coverImage?: ImageComponent;
  content: any; // Blocks type
  author: string;
  publishedAt: string;
  category?: 'recipes' | 'techniques' | 'events' | 'news' | 'tips';
  tags?: any;
  featured: boolean;
  relatedProducts?: {
    data: StrapiData[];
  };
  relatedCourses?: {
    data: StrapiData[];
  };
  seo?: SEOComponent;
  locale: string;
  createdAt: string;
  updatedAt: string;
}

export interface PageAttributes {
  title: string;
  slug: string;
  sections: (HeroSection | any)[]; // Dynamic zone - add other section types as needed
  seo?: SEOComponent;
  locale: string;
  createdAt: string;
  updatedAt: string;
  publishedAt: string;
}

export interface HeaderAttributes {
  ownerName: string;
  menuItems?: any[];
  ctaButton?: any;
  locale: string;
}

interface NavigationSection {
  id: number;
  title: string;
  links: Array<{
    id: number;
    label: string;
    href: string;
  }>;
}

interface ContactInfo {
  id: number;
  title: string;
  email: string;
  phone: string;
  address: string;
  hours: string;
}

interface SocialLink {
  id: number;
  iconName: string;
  label: string;
  href: string;
}

interface Newsletter {
  id: number;
  title: string;
  description: string;
  placeholder: string;
  buttonText: string;
  successMessage: string;
}

interface Copyright {
  id: number;
  companyName: string;
  rightsText: string;
  madeWithText: string;
  locationText: string;
}

export interface FooterAttributes {
  logo?: {
    data: StrapiData;
  };
  tagline?: string;
  description?: string;
  servicesSection?: NavigationSection;
  learnSection?: NavigationSection;
  exploreSection?: NavigationSection;
  connectSection?: NavigationSection;
  contactInfo?: ContactInfo;
  socialTitle?: string;
  socialLinks?: SocialLink[];
  newsletter?: Newsletter;
  certifications?: string;
  copyright?: Copyright;
  address?: string;
  contactItem?: any[];
  socialLink?: any[];
  bottomNote?: string;
  legalLinks?: any[];
}

// Type aliases for easier use (Strapi 5 flat structure)
export type Product = StrapiEntity<ProductAttributes>;
export type Category = StrapiEntity<CategoryAttributes>;
export type Course = StrapiEntity<CourseAttributes>;
export type Service = StrapiEntity<ServiceAttributes>;
export type Post = StrapiEntity<PostAttributes>;
export type Page = StrapiEntity<PageAttributes>;
export type Header = StrapiEntity<HeaderAttributes>;
export type Footer = StrapiEntity<FooterAttributes>;
