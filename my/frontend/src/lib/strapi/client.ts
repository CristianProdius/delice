const STRAPI_URL = process.env.NEXT_PUBLIC_STRAPI_URL || 'https://cms.delice.my';
const STRAPI_API_TOKEN = process.env.STRAPI_API_TOKEN;

interface FetchOptions extends RequestInit {
  locale?: string;
  populateDeep?: boolean;
}

export async function fetchStrapi<T>(
  path: string,
  options: FetchOptions = {}
): Promise<T> {
  const { locale = 'en', populateDeep = false, ...init } = options;

  const url = new URL(`/api${path}`, STRAPI_URL);
  url.searchParams.set('locale', locale);

  // Only add default populate if path doesn't already contain populate parameters
  const pathHasPopulate = path.includes('populate');

  // For pages, use wildcard populate for all sections
  if (populateDeep) {
    // Simpler approach: populate everything 2 levels deep
    url.searchParams.set('populate[0]', 'sections');
    url.searchParams.set('populate[1]', 'sections.header');
    url.searchParams.set('populate[2]', 'sections.background');
    url.searchParams.set('populate[3]', 'sections.background.media');
    url.searchParams.set('populate[4]', 'sections.ctaButton');
    url.searchParams.set('populate[5]', 'sections.ctaButtons');
    url.searchParams.set('populate[6]', 'sections.items');
    url.searchParams.set('populate[7]', 'sections.items.ctaButton');
    url.searchParams.set('populate[8]', 'sections.items.image');
    url.searchParams.set('populate[9]', 'sections.items.icon');
    url.searchParams.set('populate[10]', 'sections.listItem');
    url.searchParams.set('populate[11]', 'sections.stats');
    url.searchParams.set('populate[12]', 'sections.portrait');
    url.searchParams.set('populate[13]', 'sections.portrait.media');
    url.searchParams.set('populate[14]', 'sections.images');
    url.searchParams.set('populate[15]', 'sections.images.media');
    url.searchParams.set('populate[16]', 'sections.questions');
    url.searchParams.set('populate[17]', 'seo');
    url.searchParams.set('populate[18]', 'sections.foregroundImage');
    url.searchParams.set('populate[19]', 'sections.foregroundImage.media');
    url.searchParams.set('populate[20]', 'sections.signature');
  } else if (!pathHasPopulate) {
    // Only set default populate if not already in path
    url.searchParams.set('populate', '*');
  }

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };

  if (STRAPI_API_TOKEN) {
    headers['Authorization'] = `Bearer ${STRAPI_API_TOKEN}`;
  }

  const response = await fetch(url.toString(), {
    ...init,
    headers,
    next: { revalidate: 60 }, // Revalidate every 60 seconds
  });

  if (!response.ok) {
    throw new Error(`Strapi API error: ${response.status} ${response.statusText}`);
  }

  return response.json();
}

export { STRAPI_URL };
