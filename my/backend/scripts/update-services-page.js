const axios = require('axios');

const api = axios.create({
  baseURL: 'http://localhost:1337/api',
  headers: { 'Content-Type': 'application/json' },
  timeout: 30000,
});

const p = (text) => ({ type: 'paragraph', children: [{ type: 'text', text }] });
const sectionHeader = (kicker='', title='', subtitle='', alignment='center') => ({ kicker, title, subtitle, alignment });
const cta = (text, href) => ({ text, href });
const imageRef = (mediaId) => ({ media: mediaId, alt: '', title: '', caption: '', lazyLoad: true, link: '' });

async function updateServicesPage() {
  try {
    const response = await api.get('/pages?filters[slug][$eq]=services&locale=en');
    const page = response.data.data[0];

    if (!page) {
      console.log('❌ Services page not found');
      return;
    }

    console.log(`Found Services page with ID: ${page.id}`);

    const sections = [
      {
        __component: 'sections.hero',
        header: sectionHeader('Our Services', 'Crafting Chocolate Experiences for Every Occasion', 'From intimate gifts to grand celebrations'),
        background: imageRef(1),
        ctaButton: cta('Get Custom Quote', '/contact'),
      },
      {
        __component: 'sections.services',
        header: sectionHeader('', 'What We Offer', ''),
        items: [
          {
            title: 'Chocolate School for Adults',
            description: [p('Individual and group sessions for hobbyists and professional pastry chefs. Learn tempering, bars, dragees, bonbons, and show-stopping décor.')],
            price: 'From 800 MDL per session',
            variant: 'service',
            badge: 'Most Popular',
            ctaButton: cta('Learn More', '/services/chocolate-school-adults'),
          },
          {
            title: "Children's Chocolate School",
            description: [p('Fun, hands-on classes introduce kids to the world of chocolate through creativity and play.')],
            price: 'From 400 MDL per child',
            variant: 'service',
            ctaButton: cta('Learn More', '/services/childrens-chocolate-school'),
          },
          {
            title: 'HoReCa Consulting',
            description: [p('Boost revenue and attract guests by adding signature chocolate items to your menu.')],
            price: 'Custom pricing',
            variant: 'service',
            badge: 'For Business',
            ctaButton: cta('Learn More', '/services/horeca-consulting'),
          },
          {
            title: 'Tastings & Events',
            description: [p('Themed experiences for private parties and corporate gatherings—premium chocolate tastings and master classes.')],
            price: 'From 5000 MDL per event',
            variant: 'service',
            ctaButton: cta('Learn More', '/services/tastings-events'),
          },
          {
            title: 'Dessert & Mold Design',
            description: [p('Bespoke chocolate décor and custom molds for your menu.')],
            price: 'Project-based pricing',
            variant: 'service',
            ctaButton: cta('Learn More', '/services/dessert-mold-design'),
          },
          {
            title: 'Custom Chocolate Gifts',
            description: [p('Hand-crafted gift sets, chocolate postcards and business cards, plus décor for your desserts.')],
            price: 'From 200 MDL',
            variant: 'service',
            badge: 'Best Seller',
            ctaButton: cta('Learn More', '/services/custom-chocolate-gifts'),
          },
        ],
      },
    ];

    await api.put(`/pages/${page.id}`, {
      data: {
        sections,
        publishedAt: new Date().toISOString()
      }
    });

    console.log('✅ Services page updated successfully with clickable service links!');
  } catch (error) {
    console.error('❌ Failed:', error.response?.data || error.message);
  }
}

updateServicesPage();
