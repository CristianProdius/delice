import { fetchStrapi } from './client';
import type {
  StrapiResponse,
  Product,
  Category,
  Course,
  Service,
  Post,
  Page,
  Header,
  Footer,
} from '@/types/strapi';

// Products
export async function getProducts(locale: string = 'en') {
  return fetchStrapi<StrapiResponse<Product[]>>('/products', { locale });
}

export async function getProduct(slug: string, locale: string = 'en') {
  const response = await fetchStrapi<StrapiResponse<Product[]>>(
    `/products?filters[slug][$eq]=${slug}`,
    { locale }
  );
  return response.data[0];
}

export async function getFeaturedProducts(locale: string = 'en') {
  return fetchStrapi<StrapiResponse<Product[]>>(
    '/products?filters[featured][$eq]=true',
    { locale }
  );
}

// Categories
export async function getCategories(locale: string = 'en') {
  return fetchStrapi<StrapiResponse<Category[]>>('/categories', { locale });
}

export async function getCategory(slug: string, locale: string = 'en') {
  const response = await fetchStrapi<StrapiResponse<Category[]>>(
    `/categories?filters[slug][$eq]=${slug}`,
    { locale }
  );
  return response.data[0];
}

// Courses
export async function getCourses(locale: string = 'en') {
  return fetchStrapi<StrapiResponse<Course[]>>('/courses', { locale });
}

export async function getCourse(slug: string, locale: string = 'en') {
  const response = await fetchStrapi<StrapiResponse<Course[]>>(
    `/courses?filters[slug][$eq]=${slug}`,
    { locale }
  );
  return response.data[0];
}

// Services
export async function getServices(locale: string = 'en') {
  return fetchStrapi<StrapiResponse<Service[]>>('/services?sort=order:asc', { locale });
}

export async function getService(slug: string, locale: string = 'en') {
  const response = await fetchStrapi<StrapiResponse<Service[]>>(
    `/services?filters[slug][$eq]=${slug}`,
    { locale, populateDeep: true }
  );
  return response.data[0];
}

export async function getFeaturedServices(locale: string = 'en') {
  return fetchStrapi<StrapiResponse<Service[]>>(
    '/services?filters[featured][$eq]=true&sort=order:asc',
    { locale }
  );
}

// Blog Posts
export async function getPosts(locale: string = 'en') {
  return fetchStrapi<StrapiResponse<Post[]>>('/posts', { locale });
}

export async function getPost(slug: string, locale: string = 'en') {
  const response = await fetchStrapi<StrapiResponse<Post[]>>(
    `/posts?filters[slug][$eq]=${slug}`,
    { locale }
  );
  return response.data[0];
}

export async function getFeaturedPosts(locale: string = 'en') {
  return fetchStrapi<StrapiResponse<Post[]>>(
    '/posts?filters[featured][$eq]=true',
    { locale }
  );
}

export async function getLatestPost(locale: string = 'en') {
  const response = await fetchStrapi<StrapiResponse<Post[]>>(
    '/posts?sort=publishedAt:desc&pagination[limit]=1&populate[coverImage][populate]=media',
    { locale }
  );
  return response.data[0];
}

// Pages
export async function getPage(slug: string, locale: string = 'en') {
  const response = await fetchStrapi<StrapiResponse<Page[]>>(
    `/pages?filters[slug][$eq]=${slug}`,
    { locale, populateDeep: true }
  );
  return response.data[0];
}

// Header & Footer (Single Types)
export async function getHeader(locale: string = 'en') {
  return fetchStrapi<StrapiResponse<Header>>('/header?populate=*', { locale });
}

export async function getFooter(locale: string = 'en') {
  // Strapi v5 explicit populate for all nested components
  const query = [
    'populate[0]=logo',
    'populate[1]=servicesSection.links',
    'populate[2]=learnSection.links',
    'populate[3]=exploreSection.links',
    'populate[4]=connectSection.links',
    'populate[5]=contactInfo',
    'populate[6]=socialLinks',
    'populate[7]=newsletter',
    'populate[8]=copyright',
  ].join('&');

  return fetchStrapi<StrapiResponse<Footer>>(`/footer?${query}`, { locale });
}
