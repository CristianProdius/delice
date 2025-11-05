// populate-strapi.v5.js
// Strapi v5 content seed for DeliceMy - Production-ready version

const axios = require('axios');

// ====== CONFIG ======
const STRAPI_URL = process.env.STRAPI_URL || 'http://localhost:1337';
const API_TOKEN  = process.env.API_TOKEN;
const LOCALE     = process.env.LOCALE || 'en';        // <-- this run = English
const AUTO_PUBLISH = process.env.AUTO_PUBLISH !== 'false'; // <-- set to false if you want drafts

// ====== AXIOS ======
const headers = {
  'Content-Type': 'application/json'
};

// Only add authorization if API_TOKEN is provided
if (API_TOKEN) {
  headers.Authorization = `Bearer ${API_TOKEN}`;
}

const api = axios.create({
  baseURL: `${STRAPI_URL}/api`,
  headers,
  timeout: 30000, // 30 second timeout
});

// Add retry logic for resilience
api.interceptors.response.use(
  response => response,
  async error => {
    const { config, response } = error;
    if (!config || !config.retry) {
      config.retry = 0;
    }
    
    // Retry on 429 (rate limit) or 5xx errors
    if (config.retry < 3 && response && (response.status === 429 || response.status >= 500)) {
      config.retry++;
      console.log(`⚠️ Retrying request (attempt ${config.retry})...`);
      await new Promise(resolve => setTimeout(resolve, 1000 * config.retry)); // exponential backoff
      return api(config);
    }
    
    return Promise.reject(error);
  }
);

// ====== HELPERS ======
// Blocks: paragraph node - Strapi v5 requires proper inline nodes
const p = (text) => ({
  type: 'paragraph',
  children: [{ type: 'text', text }]
});

// Blocks: heading node
const h = (level, text) => ({
  type: 'heading',
  level,
  children: [{ type: 'text', text }]
});

// Blocks: list node
const ul = (items) => ({
  type: 'list',
  format: 'unordered',
  children: items.map(item => ({
    type: 'list-item',
    children: [{ type: 'text', text: item }]
  }))
});

// Section header component
const sectionHeader = (kicker='', title='', subtitle='', alignment='center') => ({
  kicker, title, subtitle, alignment,
});

// CTA button component
const cta = (text, href) => ({ text, href });

// elements.image component (requires existing media ID)
const imageRef = (mediaId, alt, title = '', caption = '', lazyLoad = true, link = '') => ({
  media: mediaId, alt, title, caption, lazyLoad, link
});

// Test connection function
async function testConnection() {
  try {
    const response = await api.get('/pages');
    console.log(`✅ Connection successful to ${STRAPI_URL}`);
    return true;
  } catch (error) {
    console.log(`❌ Connection failed:`, error.response?.status || error.message);
    if (error.response?.status === 401) {
      console.log(`🔑 Check your API_TOKEN is valid`);
    }
    return false;
  }
}

// Upsert utility (find by slug+locale; create or update)
async function upsertPage({ title, slug, sections, seo }) {
  try {
    // Safer query with explicit ordering
    const q = `/pages?locale=${encodeURIComponent(LOCALE)}&filters[slug][$eq]=${encodeURIComponent(slug)}`;
    const found = await api.get(q).then(r => r.data?.data ?? []).catch(() => []);

    const payload = {
      data: { 
        title, 
        slug, 
        locale: LOCALE, 
        sections, 
        seo,
        ...(AUTO_PUBLISH ? { publishedAt: new Date().toISOString() } : {})
      }
    };

    if (found.length > 0) {
      const id = found[0].id;
      const res = await api.put(`/pages/${id}`, payload);
      return { action: 'updated', id: res.data.data.id, title };
    } else {
      const res = await api.post('/pages', payload);
      return { action: 'created', id: res.data.data.id, title };
    }
  } catch (error) {
    console.error(`❌ Failed to upsert page "${title}":`, error.response?.data?.error || error.message);
    
    // Show detailed validation errors
    if (error.response?.data?.error?.details?.errors) {
      console.log('\n📋 Validation errors detail:');
      error.response.data.error.details.errors.forEach((err, i) => {
        console.log(`   ${i + 1}. Field: ${err.path ? err.path.join('.') : 'unknown'}`);
        console.log(`      Error: ${err.message}`);
        console.log(`      Name: ${err.name || 'N/A'}`);
      });
      console.log('');
    }
    
    throw error;
  }
}

// ====== MEDIA IDS ======
// Using your uploaded image (ID: 1) for all images temporarily
const IMAGE_ID = 1;  // Your uploaded image in Strapi

const MEDIA = {
  hero_home: IMAGE_ID,
  hero_services: IMAGE_ID,
  hero_about: IMAGE_ID,
  hero_school: IMAGE_ID,
  hero_shop: IMAGE_ID,
  hero_contact: IMAGE_ID,

  // gallery images - using same image for now
  g1: IMAGE_ID,
  g2: IMAGE_ID,
  g3: IMAGE_ID,
  g4: IMAGE_ID,
  g5: IMAGE_ID,
  g6: IMAGE_ID,
  g7: IMAGE_ID,
  g8: IMAGE_ID,
  g9: IMAGE_ID,

  // about / atelier etc.
  portrait_olesea: IMAGE_ID,
  
  // backgrounds for banners
  banner_bg1: IMAGE_ID,
  banner_bg2: IMAGE_ID,
  
  // signature
  signature: IMAGE_ID,
};

// ====== PAGES ======

// 1) HOME
async function createOrUpdateHome() {
  const sections = [
    // sections.hero
    {
      __component: 'sections.hero',
      header: sectionHeader(`Premium Chocolate Atelier in Chisinau`, `Handcrafted Chocolates by Olesea`, `Personalized gifts, workshops, and unforgettable experiences`),
      personName: `Olesea`,
      role: `Master Chocolatier`,
      background: imageRef(MEDIA.hero_home, `Olesea at the atelier`),
      ctaButton: cta(`Discover Our World`, `/services`),
    },

    // sections.services
    {
      __component: 'sections.services',
      header: sectionHeader(``, `Our Services`, ``),
      items: [
        { 
          title: `Custom Chocolate Gifts`, 
          description: [p(`Personalized boxes, chocolate postcards, and edible art for every occasion.`)], 
          variant: `service`, 
          ctaButton: cta(`Learn more`, `/services#custom-gifts`) 
        },
        { 
          title: `Corporate Packages`, 
          description: [p(`Elegant branded gifts that delight clients and partners.`)], 
          variant: `service`, 
          ctaButton: cta(`Learn more`, `/services#corporate`) 
        },
        { 
          title: `Wedding & Events`, 
          description: [p(`Bombonieres, candy bars, and exclusive creations for your special day.`)], 
          variant: `service`, 
          ctaButton: cta(`Learn more`, `/services#events`) 
        },
        { 
          title: `Chocolate School`, 
          description: [p(`Learn tempering, bonbons, and artistry—from beginner to pro.`)], 
          variant: `service`, 
          ctaButton: cta(`Learn more`, `/school`) 
        },
      ],
    },

    // sections.benefits
    {
      __component: 'sections.benefits',
      header: sectionHeader(``, `Why DeliceMy`, ``),
      items: [
        { title: `Artisanal Craftsmanship`, description: [p(`Every piece is handmade with care.`)], variant: `benefit` },
        { title: `Premium Ingredients`, description: [p(`Only the finest cocoa and fillings.`)], variant: `benefit` },
        { title: `Personal Touch`, description: [p(`Direct collaboration with Olesea.`)], variant: `benefit` },
        { title: `Memorable Experiences`, description: [p(`Gifts and workshops designed to be remembered.`)], variant: `benefit` },
      ],
    },

    // sections.about
    {
      __component: 'sections.about',
      header: sectionHeader(``, `Meet Olesea`, ``),
      intro: [
        p(`"For me, chocolate is not just a product—it's a way to create joy, beauty, and unforgettable memories."`),
      ],
      listItem: [
        { text: `10+ years of experience in fine chocolate` },
        { text: `Guided dozens of aspiring chocolatiers in Moldova` },
        { text: `Passionate about design, taste, and emotion` },
      ],
      portrait: imageRef(MEDIA.portrait_olesea, `Portrait of Olesea`),
      ctaButton: cta(`Read My Story`, `/about`),
    },

    // sections.gallery
    {
      __component: 'sections.gallery',
      header: sectionHeader(``, `Signature Work`, ``),
      layout: `grid`,
      columns: 3,
      images: [
        imageRef(MEDIA.g1, `Bonbons`),
        imageRef(MEDIA.g2, `Gift set`),
        imageRef(MEDIA.g3, `Wedding candy bar`),
      ],
    },

    // sections.testimonials
    {
      __component: 'sections.testimonials',
      header: sectionHeader(``, `What Clients Say`, ``),
      items: [
        { title: `Ana & Mihai`, description: [p(`"The chocolates were a showstopper at our wedding."`)], variant: `testimonial` },
        { title: `Irina`, description: [p(`"The workshop was magical—learned to temper and make bars."`)], variant: `testimonial` },
        { title: `Dumitru`, description: [p(`"Corporate gifts: premium quality and beautiful presentation."`)], variant: `testimonial` },
      ],
    },

    // sections.banner with variant: 'cta'
    {
      __component: 'sections.banner',
      header: sectionHeader(``, `Bring Joy Through Chocolate`, `From a single truffle to a full candy bar—we make it special.`),
      description: [p(`Contact us to create your perfect chocolate experience.`)],
      variant: `cta`,
      layout: `center`,
      theme: `primary`,
      ctaButtons: [
        cta(`Get in Touch`, `/contact`),
        cta(`View Services`, `/services`)
      ],
    },

    // sections.faq
    {
      __component: 'sections.faq',
      header: sectionHeader(``, `FAQ`, ``),
      questions: [
        { question: `Do you make custom orders?`, answer: [p(`Yes—tell us your idea, occasion, and budget.`)] },
        { question: `Do you deliver in Chisinau?`, answer: [p(`Yes, we offer local delivery and pickup.`)] },
        { question: `Are workshops beginner-friendly?`, answer: [p(`Absolutely—no prior experience required.`)] },
      ],
    },
  ];

  const seo = {
    metaTitle: `DeliceMy — Premium Chocolate Atelier`,
    metaDescription: `Custom gifts, corporate packages, wedding chocolates, and chocolate workshops in Chisinau.`,
    robots: `index, follow`,
  };

  return upsertPage({ title: `Home`, slug: `home`, sections, seo });
}

// 2) SERVICES
async function createOrUpdateServices() {
  const sections = [
    {
      __component: 'sections.hero',
      header: sectionHeader(`Our Services`, `Crafting Chocolate Experiences for Every Occasion`, `From intimate gifts to grand celebrations`),
      background: imageRef(MEDIA.hero_services, `Assorted chocolates`),
      ctaButton: cta(`Get Custom Quote`, `/contact`),
    },

    {
      __component: 'sections.services',
      header: sectionHeader(``, `What We Offer`, ``),
      items: [
        {
          title: `Chocolate School for Adults`,
          description: [
            p(`Individual and group sessions for hobbyists and professional pastry chefs. Learn tempering, bars, dragees, bonbons, and show-stopping décor.`),
            p(`Special program: "Chocolate Startup: From Idea to Sales" — we guide you from concept to market.`),
          ],
          features: [
            { text: `Beginner to professional levels` },
            { text: `Hands-on practical training` },
            { text: `Author kits and guides included` },
          ],
          price: `From 800 MDL per session`,
          variant: `service`,
          badge: `Most Popular`,
          ctaButton: cta(`Learn More`, `/services/chocolate-school-adults`),
        },
        {
          title: `Children's Chocolate School`,
          description: [
            p(`Fun, hands-on classes introduce kids to the world of chocolate through creativity and play.`),
            p(`Perfect for birthdays, school events, or weekend activities.`),
          ],
          features: [
            { text: `Age-appropriate activities (6–14 years)` },
            { text: `All materials provided` },
            { text: `Take-home creations` },
          ],
          price: `From 400 MDL per child`,
          variant: `service`,
          ctaButton: cta(`Learn More`, `/services/childrens-chocolate-school`),
        },
        {
          title: `HoReCa Consulting`,
          description: [
            p(`Boost revenue and attract guests by adding signature chocolate items to your menu.`),
            p(`From menu development to staff training, we provide comprehensive support.`),
          ],
          features: [
            { text: `Custom dessert menu development` },
            { text: `Chocolate bar setup & design` },
            { text: `Staff training & standardization` },
          ],
          price: `Custom pricing`,
          variant: `service`,
          badge: `For Business`,
          ctaButton: cta(`Learn More`, `/services/horeca-consulting`),
        },
        {
          title: `Tastings & Events`,
          description: [
            p(`Themed experiences for private parties and corporate gatherings—premium chocolate tastings and master classes.`),
            p(`Mobile setups for offices, venues, or private homes.`),
          ],
          features: [
            { text: `Guided tastings & pairings` },
            { text: `Interactive demos` },
            { text: `Custom event themes` },
          ],
          price: `From 5000 MDL per event`,
          variant: `service`,
          ctaButton: cta(`Learn More`, `/services/tastings-events`),
        },
        {
          title: `Dessert & Mold Design`,
          description: [
            p(`Bespoke chocolate décor and custom molds for your menu.`),
            p(`Concept, 3D modeling, mold production, and usage training.`),
          ],
          features: [
            { text: `Custom molds & prototypes` },
            { text: `Logo/brand integration` },
            { text: `Production documentation` },
          ],
          price: `Project-based pricing`,
          variant: `service`,
          ctaButton: cta(`Learn More`, `/services/dessert-mold-design`),
        },
        {
          title: `Custom Chocolate Gifts`,
          description: [
            p(`Hand-crafted gift sets, chocolate postcards and business cards, plus décor for your desserts.`),
            p(`Personalization and corporate branding available.`),
          ],
          features: [
            { text: `Personalized packaging` },
            { text: `Custom flavors & fillings` },
            { text: `Gift wrapping service` },
          ],
          price: `From 200 MDL`,
          variant: `service`,
          badge: `Best Seller`,
          ctaButton: cta(`Learn More`, `/services/custom-chocolate-gifts`),
        },
      ],
    },

    // Process gallery
    {
      __component: 'sections.gallery',
      header: sectionHeader(``, `Process & Portfolio`, ``),
      layout: `grid`,
      columns: 3,
      images: [ 
        imageRef(MEDIA.g1, `Tempering`), 
        imageRef(MEDIA.g2, `Bonbon shells`), 
        imageRef(MEDIA.g3, `Gift setup`) 
      ],
    },

    // FAQs
    {
      __component: 'sections.faq',
      header: sectionHeader(``, `Policies & Timelines`, ``),
      questions: [
        { question: `How far in advance should I order?`, answer: [p(`For custom work, we recommend 7–14 days. Large events: 1–2 months.`)] },
        { question: `Do you offer consultations?`, answer: [p(`Yes! Free 30-minute consultations for orders over 2000 MDL.`)] },
        { question: `What about allergens?`, answer: [p(`Our facility processes nuts, milk, soy, and gluten. Please inform us of any allergies.`)] },
      ],
    },

    // sections.banner with variant: 'cta'
    {
      __component: 'sections.banner',
      header: sectionHeader(``, `Ready to Create Something Sweet?`, `Book a consultation`),
      variant: `cta`,
      layout: `center`,
      theme: `primary`,
      ctaButtons: [
        cta(`Book Consultation`, `/contact`),
        cta(`Call Now`, `tel:+373123456789`) // TODO: Replace with real phone
      ],
    },
  ];

  const seo = {
    metaTitle: `Chocolate Services & Custom Gifts | DeliceMy`,
    metaDescription: `Professional chocolate services in Chisinau: courses, HoReCa consulting, events, custom gifts, mold design.`,
    robots: `index, follow`,
  };

  return upsertPage({ title: `Services`, slug: `services`, sections, seo });
}

// 3) ABOUT
async function createOrUpdateAbout() {
  const sections = [
    {
      __component: 'sections.hero',
      header: sectionHeader(`Our Story`, `Where Tradition Meets Innovation`, `The journey of DeliceMy`),
      background: imageRef(MEDIA.hero_about, `Atelier ambience`),
      ctaButton: cta(`Our Services`, `/services`),
    },
    
    {
      __component: 'sections.about',
      header: sectionHeader(``, `Meet Olesea — Master Chocolatier`, ``),
      intro: [
        p(`Chocolate is my medium for joy, beauty, and memory. Trained in Europe, I combine traditional methods with innovative design.`),
        p(`What started as a love for sweets transformed into a mission: to create moments of joy through exceptional chocolate experiences.`),
      ],
      listItem: [
        { text: `Founded DeliceMy with a vision for artisan excellence` },
        { text: `Trained hundreds of students in chocolate making` },
        { text: `Pioneered custom corporate chocolate in Chisinau` },
        { text: `Member of International Association of Chocolatiers` },
      ],
      portrait: imageRef(MEDIA.portrait_olesea, `Olesea portrait`),
      ctaButton: cta(`Start Your Chocolate Journey`, `/contact`),
    },
    
    // sections.banner with variant: 'mission'
    {
      __component: 'sections.banner',
      header: sectionHeader(`Our Philosophy`, `Excellence is Not an Act, But a Habit`, ``),
      description: [
        p(`We believe chocolate is a medium for expression and connection. We source premium Belgian and Swiss chocolate and craft in small batches.`),
        p(`Our mission extends beyond creating exceptional chocolates. Through education, we nurture the next generation of chocolatiers.`),
      ],
      variant: `mission`,
      layout: `center`,
      theme: `secondary`,
      background: imageRef(MEDIA.banner_bg1, `Texture background`),
    },
    
    // Gallery
    {
      __component: 'sections.gallery',
      header: sectionHeader(``, `Behind the Scenes`, `Inside our chocolate atelier`),
      layout: `masonry`,
      columns: 3,
      images: [
        imageRef(MEDIA.g4, `Tempering chocolate`),
        imageRef(MEDIA.g5, `Hand-painting bonbons`),
        imageRef(MEDIA.g6, `Creating custom molds`),
        imageRef(MEDIA.g7, `Students learning`),
        imageRef(MEDIA.g8, `Quality testing`),
        imageRef(MEDIA.g9, `Packaging gifts`),
      ],
    },
    
    // Testimonials
    {
      __component: 'sections.testimonials',
      header: sectionHeader(``, `What People Say`, ``),
      items: [
        { title: `Elena`, description: [p(`"A true artisan—each piece is a miniature artwork."`)], variant: `testimonial` },
        { title: `Grand Hotel`, description: [p(`"DeliceMy elevated our dessert offerings significantly."`)], variant: `testimonial` },
        { title: `Belgian Academy`, description: [p(`"Exceptional skill and commitment to quality."`)], variant: `testimonial` },
      ],
    },
    
    // sections.banner with variant: 'cta'
    {
      __component: 'sections.banner',
      header: sectionHeader(``, `Join Our Chocolate Journey`, ``),
      description: [p(`Experience the DeliceMy difference.`)],
      variant: `cta`,
      layout: `center`,
      theme: `primary`,
      ctaButtons: [
        cta(`Explore Services`, `/services`),
        cta(`Contact Us`, `/contact`)
      ],
    },
  ];

  const seo = {
    metaTitle: `About DeliceMy - Master Chocolatier Olesea | Chisinau`,
    metaDescription: `Meet Olesea, master chocolatier. Learn about DeliceMy's philosophy and story.`,
    robots: `index, follow`,
  };

  return upsertPage({ title: `About`, slug: `about`, sections, seo });
}

// 4) SCHOOL
async function createOrUpdateSchool() {
  const sections = [
    {
      __component: 'sections.hero',
      header: sectionHeader(`DeliceMy Chocolate School`, `Master the Art of Chocolate Making`, `Beginners to professionals`),
      background: imageRef(MEDIA.hero_school, `Workshop scene`),
      ctaButton: cta(`Enroll Now`, `/contact`),
    },
    
    {
      __component: 'sections.benefits',
      header: sectionHeader(``, `Who It's For`, ``),
      items: [
        { title: `Hobbyists`, description: [p(`Learn fundamentals and create professional-quality chocolates at home.`)], variant: `benefit` },
        { title: `Professional Pastry Chefs`, description: [p(`Elevate your dessert menu with advanced techniques.`)], variant: `benefit` },
        { title: `Entrepreneurs`, description: [p(`Turn your chocolate passion into a profitable business.`)], variant: `benefit` },
        { title: `Children & Teens`, description: [p(`Fun, safe, and memorable workshops for young minds.`)], variant: `benefit` },
      ],
    },
    
    {
      __component: 'sections.services',
      header: sectionHeader(``, `Course Types`, ``),
      items: [
        { 
          title: `Introduction to Chocolate Making`, 
          description: [p(`Perfect for beginners! Learn fundamentals from cocoa origins to creating your first bonbons.`)],
          features: [
            { text: `4 sessions × 3 hours` },
            { text: `Tempering techniques` },
            { text: `Basic molding and dipping` },
            { text: `Certificate included` },
          ],
          price: `3,200 MDL`,
          variant: `service`,
          badge: `Beginner`,
          ctaButton: cta(`Learn More`, `/contact`),
        },
        { 
          title: `Advanced Chocolate Artistry`, 
          description: [p(`Take your skills to the next level with complex techniques and artistic presentation.`)],
          features: [
            { text: `8 sessions × 3 hours` },
            { text: `Advanced tempering` },
            { text: `Sculpture and showpieces` },
            { text: `Professional certification` },
          ],
          price: `7,500 MDL`,
          variant: `service`,
          badge: `Advanced`,
          ctaButton: cta(`Learn More`, `/contact`),
        },
        { 
          title: `Chocolate Business Startup`, 
          description: [p(`Complete program for launching your chocolate business.`)],
          features: [
            { text: `20 hours over 2 weeks` },
            { text: `Recipe standardization` },
            { text: `Costing and pricing` },
            { text: `3 months mentorship` },
          ],
          price: `12,000 MDL`,
          variant: `service`,
          badge: `Entrepreneur`,
          ctaButton: cta(`Learn More`, `/contact`),
        },
      ],
    },
    
    // Gallery
    {
      __component: 'sections.gallery',
      header: sectionHeader(``, `School in Action`, ``),
      layout: `carousel`,
      columns: 3,
      images: [
        imageRef(MEDIA.g1, `Students tempering`),
        imageRef(MEDIA.g2, `Kids workshop`),
        imageRef(MEDIA.g3, `Professional training`),
      ],
    },
    
    {
      __component: 'sections.faq',
      header: sectionHeader(``, `Enrollment & Requirements`, ``),
      questions: [
        { question: `Do I need experience?`, answer: [p(`No—beginners welcome! We start with basics and build step by step.`)] },
        { question: `What should I bring?`, answer: [p(`We provide all tools, ingredients, and aprons. Just bring your enthusiasm!`)] },
        { question: `What is the schedule?`, answer: [p(`Weekend mornings or weekday evenings. Private sessions scheduled at your convenience.`)] },
        { question: `What's included in the fee?`, answer: [p(`Everything! Materials, recipe guides, certificate, and take-home creations.`)] },
      ],
    },
    
    {
      __component: 'sections.contact-form',
      header: sectionHeader(``, `Apply / Register Interest`, `We'll contact you with dates`),
      fields: [
        { label: `Name`, name: `name`, type: `text`, required: true },
        { label: `Email`, name: `email`, type: `email`, required: true },
        { label: `Phone`, name: `phone`, type: `tel` },
        { label: `Course Interest`, name: `course`, type: `select`, required: true, options: [`Introduction`, `Advanced`, `Business Startup`, `Kids Workshop`] },
        { label: `Message`, name: `message`, type: `textarea`, placeholder: `Tell us about your goals...` },
      ],
      submitButton: cta(`Send`, `#`),
      successMessage: `Thank you! We'll contact you within 24 hours.`,
      recipientEmail: `school@delicemy.md`, // TODO: Replace with real email
      consentText: `I agree to be contacted about course enrollment`,
      enableHoneypot: true,
    },
  ];

  const seo = {
    metaTitle: `Chocolate School - Learn Making | DeliceMy`,
    metaDescription: `Courses for beginners, professionals, entrepreneurs, and children.`,
    robots: `index, follow`,
  };

  return upsertPage({ title: `School`, slug: `school`, sections, seo });
}

// 5) SHOP
async function createOrUpdateShop() {
  const sections = [
    {
      __component: 'sections.hero',
      header: sectionHeader(`Shop DeliceMy`, `Premium Handcrafted Chocolates`, `Custom orders & curated selections`),
      background: imageRef(MEDIA.hero_shop, `Gift boxes`),
      ctaButton: cta(`Request a custom order`, `/contact`),
    },
    
    // sections.banner with variant: 'announcement'
    {
      __component: 'sections.banner',
      header: sectionHeader(`Our Collections`, `Curated Chocolate Experiences`, ``),
      description: [
        p(`Each collection is carefully crafted using premium Belgian chocolate and the finest ingredients.`),
        p(`Browse our signature collections below or contact us for custom creations.`),
      ],
      variant: `announcement`,
      layout: `center`,
      theme: `light`,
    },
    
    // Gallery of products
    {
      __component: 'sections.gallery',
      header: sectionHeader(``, `Best Sellers`, `Customer favorites available for immediate order`),
      layout: `lightbox`,
      columns: 4,
      images: [
        imageRef(MEDIA.g1, `Signature Collection`),
        imageRef(MEDIA.g2, `Dark Truffle Selection`),
        imageRef(MEDIA.g3, `Wedding Favors`),
        imageRef(MEDIA.g4, `Corporate Gifts`),
        imageRef(MEDIA.g5, `Holiday Specials`),
        imageRef(MEDIA.g6, `Gift Baskets`),
        imageRef(MEDIA.g7, `Chocolate Postcards`),
        imageRef(MEDIA.g8, `Kids Party Packs`),
      ],
    },
    
    {
      __component: 'sections.faq',
      header: sectionHeader(``, `Delivery & Storage`, ``),
      questions: [
        { question: `Where do you deliver?`, answer: [p(`Free delivery in Chisinau for orders over 500 MDL. Pickup available by appointment.`)] },
        { question: `How to store chocolates?`, answer: [p(`Cool, dry place (15–18°C), away from sunlight. Avoid refrigeration unless necessary.`)] },
        { question: `What about allergens?`, answer: [p(`Our facility processes nuts, milk, soy, and gluten. Vegan and sugar-free options available.`)] },
        { question: `Can I customize packaging?`, answer: [p(`Yes! Custom packaging with your branding, ribbons, or personalized messages available.`)] },
      ],
    },
    
    // sections.banner with variant: 'cta'
    {
      __component: 'sections.banner',
      header: sectionHeader(``, `Order Your Custom Creation`, ``),
      description: [p(`Let us create something extraordinary for your special occasion.`)],
      variant: `cta`,
      layout: `center`,
      theme: `primary`,
      ctaButtons: [
        cta(`Start Your Order`, `/contact`),
        cta(`View Services`, `/services`)
      ],
    },
  ];

  const seo = {
    metaTitle: `Shop Premium Chocolates - DeliceMy Chisinau`,
    metaDescription: `Order handcrafted luxury chocolates in Chisinau. Gift boxes, wedding favors, corporate gifts.`,
    robots: `index, follow`,
  };

  return upsertPage({ title: `Shop`, slug: `shop`, sections, seo });
}

// 6) CONTACT
async function createOrUpdateContact() {
  const sections = [
    {
      __component: 'sections.hero',
      header: sectionHeader(`Get in Touch`, `Let's Create Something Sweet Together`, ``),
      background: imageRef(MEDIA.hero_contact, `Atelier counter`),
      ctaButton: cta(`Call: +373 12 345 678`, `tel:+37312345678`), // TODO: Replace with real phone
    },
    
    {
      __component: 'sections.contact-form',
      header: sectionHeader(``, `Send a Message`, `We'll respond within 24 hours`),
      fields: [
        { label: `Name`, name: `name`, type: `text`, required: true },
        { label: `Email`, name: `email`, type: `email`, required: true },
        { label: `Phone`, name: `phone`, type: `tel` },
        { 
          label: `Subject`, 
          name: `subject`, 
          type: `select`, 
          required: true, 
          options: [`Custom Order`, `Course Registration`, `Corporate Services`, `Wedding/Event`, `HoReCa Consulting`, `General`] 
        },
        { label: `Event Date`, name: `event_date`, type: `text`, placeholder: `DD/MM/YYYY (if applicable)` },
        { label: `Number of Pieces`, name: `quantity`, type: `text`, placeholder: `e.g., 50 pieces` },
        { label: `Message`, name: `message`, type: `textarea`, placeholder: `Tell us about your needs...`, required: true },
      ],
      submitButton: cta(`Send Message`, `#`),
      successMessage: `Thank you! We'll get back to you within 24 hours.`,
      recipientEmail: `info@delicemy.md`, // TODO: Replace with real email
      consentText: `I agree to the processing of my personal data`,
      privacyPolicyLink: `/privacy-policy`,
      enableHoneypot: true,
    },
    
    {
      __component: 'sections.faq',
      header: sectionHeader(``, `Quick Info`, ``),
      questions: [
        { question: `Business hours?`, answer: [p(`Mon–Fri 10:00–18:00, Sat 10:00–16:00. Visits by appointment only.`)] },
        { question: `Where are you located?`, answer: [p(`Central Chisinau. Exact address provided when you schedule a visit.`)] },
        { question: `Response time for custom orders?`, answer: [p(`Standard: 7-10 days. Large orders: 2-3 weeks. Rush orders possible with fees.`)] },
        { question: `Payment methods?`, answer: [p(`Bank transfer, cash, cards. 50% deposit for custom orders.`)] },
      ],
    },
    
    // Gallery - atelier
    {
      __component: 'sections.gallery',
      header: sectionHeader(``, `Visit Our Atelier`, ``),
      layout: `grid`,
      columns: 3,
      images: [
        imageRef(MEDIA.g1, `Atelier entrance`),
        imageRef(MEDIA.g2, `Display case`),
        imageRef(MEDIA.g3, `Consultation area`),
        imageRef(MEDIA.g4, `Working kitchen`),
        imageRef(MEDIA.g5, `Packaging station`),
        imageRef(MEDIA.g6, `Tasting corner`),
      ],
    },
  ];

  const seo = {
    metaTitle: `Contact DeliceMy - Chocolate Atelier in Chisinau`,
    metaDescription: `Contact DeliceMy for custom chocolates, courses, and events in Chisinau.`,
    robots: `index, follow`,
  };

  return upsertPage({ title: `Contact`, slug: `contact`, sections, seo });
}

// 7) BLOG
async function createOrUpdateBlog() {
  const sections = [
    {
      __component: 'sections.hero',
      header: sectionHeader(`Our Blog`, `Chocolate Stories & Tips`, `Discover recipes, techniques, and behind-the-scenes stories from our chocolate atelier`),
      background: imageRef(MEDIA.hero_about, `Chocolate making`),
      ctaButton: cta(`Explore Articles`, `#posts`),
    },

    // Note: The actual blog posts list is rendered by the frontend component
    // This page just provides the hero section and any additional sections you want

    {
      __component: 'sections.banner',
      header: sectionHeader(``, `Want to Learn More?`, ``),
      description: [p(`Join our chocolate school classes and master these techniques in person!`)],
      variant: `cta`,
      layout: `center`,
      theme: `primary`,
      ctaButtons: [
        cta(`View Classes`, `/school`),
        cta(`Contact Us`, `/contact`)
      ],
    },
  ];

  const seo = {
    metaTitle: `Blog - Chocolate Tips & Stories | DeliceMy`,
    metaDescription: `Discover chocolate-making techniques, recipes, and stories from our atelier in Chisinau.`,
    robots: `index, follow`,
  };

  return upsertPage({ title: `Blog`, slug: `blog`, sections, seo });
}

// ====== SERVICES (Individual Service Entries) ======

// Upsert utility for Services
async function upsertService({ title, slug, shortDescription, description, icon, featured, order }) {
  try {
    const q = `/services?locale=${encodeURIComponent(LOCALE)}&filters[slug][$eq]=${encodeURIComponent(slug)}`;
    const found = await api.get(q).then(r => r.data?.data ?? []).catch(() => []);

    const payload = {
      data: {
        title,
        slug,
        locale: LOCALE,
        shortDescription,
        description,
        icon,
        featured,
        order,
        ...(AUTO_PUBLISH ? { publishedAt: new Date().toISOString() } : {})
      }
    };

    if (found.length > 0) {
      const id = found[0].id;
      const res = await api.put(`/services/${id}`, payload);
      return { action: 'updated', id: res.data.data.id, title };
    } else {
      const res = await api.post('/services', payload);
      return { action: 'created', id: res.data.data.id, title };
    }
  } catch (error) {
    console.error(`❌ Failed to upsert service "${title}":`, error.response?.data?.error || error.message);
    if (error.response?.data?.error?.details?.errors) {
      console.log('\n📋 Validation errors detail:');
      error.response.data.error.details.errors.forEach((err, i) => {
        console.log(`   ${i + 1}. Field: ${err.path ? err.path.join('.') : 'unknown'}`);
        console.log(`      Error: ${err.message}`);
      });
      console.log('');
    }
    throw error;
  }
}

// 1) Chocolate School for Adults
async function createOrUpdateAdultSchoolService() {
  const description = [
    h(2, 'Master the Art of Chocolate'),
    p('Whether you\'re a passionate hobbyist or a seasoned professional pastry chef, our chocolate school offers comprehensive training tailored to your skill level.'),
    h(3, 'What You\'ll Learn'),
    ul([
      'Tempering secrets for perfect chocolate shine and snap',
      'Craft artisanal chocolate bars from bean to bar',
      'Create elegant dragees with various coatings',
      'Master bonbon filling techniques and flavor combinations',
      'Design show-stopping chocolate décor for cakes and desserts'
    ]),
    h(3, 'Chocolate Startup Program'),
    p('Launch your own chocolate business with our \'Chocolate Startup: From Idea to Sales\' program. We guide you through every step—from concept development and recipe creation to branding, production setup, and market entry.'),
    p('Author kits and step-by-step guides help you create true chocolate masterpieces and build a successful chocolate enterprise.')
  ];

  return upsertService({
    title: 'Chocolate School for Adults (Beginners & Pros)',
    slug: 'chocolate-school-adults',
    shortDescription: 'Individual and group sessions for hobbyists and professional pastry chefs. Learn tempering secrets, craft bars, dragees, bonbons, and show-stopping chocolate décor.',
    description,
    icon: 'graduation-cap',
    featured: true,
    order: 1
  });
}

// 2) Children's Chocolate School
async function createOrUpdateChildrensSchoolService() {
  const description = [
    h(2, 'Sweet Adventures for Young Chocolatiers'),
    p('Our children\'s chocolate school offers a magical journey into the world of chocolate, where kids learn through hands-on creativity and play in a completely safe environment.'),
    h(3, 'What Makes Our Kids\' Classes Special'),
    ul([
      'Age-appropriate activities designed for different skill levels',
      'Safe, supervised workshops with professional chocolatiers',
      'Creative projects that spark imagination and curiosity',
      'Take-home creations to share with family and friends',
      'Birthday party packages and group events available'
    ]),
    p('Each workshop is designed to create lasting memories while teaching children about the fascinating world of chocolate making. Perfect for birthday parties, school groups, or just a fun afternoon!')
  ];

  return upsertService({
    title: 'Children\'s Chocolate School',
    slug: 'childrens-chocolate-school',
    shortDescription: 'Fun, hands-on classes introduce kids to the world of chocolate through creativity and play. Safe workshops that leave lasting memories!',
    description,
    icon: 'sparkles',
    featured: true,
    order: 2
  });
}

// 3) HoReCa Consulting
async function createOrUpdateHoRecaService() {
  const description = [
    h(2, 'Elevate Your Restaurant\'s Dessert Menu'),
    p('Our HoReCa (Hotel/Restaurant/Café) consulting services help you boost revenue and attract more guests by adding signature chocolate items to your menu.'),
    h(3, 'Our Consulting Services Include'),
    ul([
      'Custom dessert menu development with signature chocolate items',
      'Complete chocolate bar setup and management',
      'Detailed production charts and standardized recipes',
      'Staff training on chocolate preparation and presentation',
      'Cost optimization and profit margin analysis',
      'Seasonal menu updates and special event planning'
    ]),
    p('We make your desserts unforgettable, helping you stand out in a competitive market and create memorable experiences that keep guests coming back.')
  ];

  return upsertService({
    title: 'HoReCa Consulting',
    slug: 'horeca-consulting',
    shortDescription: 'Boost revenue and attract guests by adding signature chocolate items to your menu. We make your desserts unforgettable, set up chocolate bars, and create detailed production charts.',
    description,
    icon: 'briefcase',
    featured: true,
    order: 3
  });
}

// 4) Tastings & Events
async function createOrUpdateTastingsEventsService() {
  const description = [
    h(2, 'Unforgettable Chocolate Experiences'),
    p('Transform your private parties, corporate gatherings, and special events into unforgettable celebrations with our premium chocolate tastings and interactive master classes.'),
    h(3, 'Event Options'),
    ul([
      'Private chocolate tasting sessions with curated selections',
      'Corporate team-building workshops and master classes',
      'Themed chocolate experiences (wine & chocolate, chocolate & coffee, etc.)',
      'Hands-on bonbon making sessions for groups',
      'Celebration packages for birthdays, anniversaries, and special occasions',
      'On-site or in-venue event planning and execution'
    ]),
    p('Each event is customized to your preferences, group size, and occasion. We bring the magic of premium chocolate to create memorable moments your guests will cherish.')
  ];

  return upsertService({
    title: 'Tastings & Events',
    slug: 'tastings-events',
    shortDescription: 'Themed experiences for private parties and corporate gatherings—turn any occasion into an unforgettable celebration with premium chocolate tastings and master classes.',
    description,
    icon: 'calendar',
    featured: true,
    order: 4
  });
}

// 5) Dessert & Mold Design
async function createOrUpdateDessertMoldDesignService() {
  const description = [
    h(2, 'Custom Chocolate Creations'),
    p('Elevate your dessert presentations with bespoke chocolate décor and custom-designed molds that perfectly reflect your brand\'s unique style and vision.'),
    h(3, 'Our Design Services'),
    ul([
      'Custom chocolate mold design and production',
      'Bespoke chocolate décor for cakes and desserts',
      'Brand logo and signature design integration',
      'Exclusive dessert concept development',
      '3D chocolate sculptures and centerpieces',
      'Seasonal and themed chocolate decorations'
    ]),
    p('From concept to creation, we work closely with you to design and produce exclusive chocolate elements that make your desserts truly one-of-a-kind and showcase your brand\'s distinctive style.')
  ];

  return upsertService({
    title: 'Dessert & Mold Design',
    slug: 'dessert-mold-design',
    shortDescription: 'Bespoke chocolate décor and custom molds for your menu. Create exclusive desserts that showcase your brand\'s style.',
    description,
    icon: 'palette',
    featured: false,
    order: 5
  });
}

// 6) Custom Chocolate Gifts
async function createOrUpdateCustomGiftsService() {
  const description = [
    h(2, 'Personalized Chocolate Delights'),
    p('Delight your recipients with hand-crafted chocolate gifts that are as beautiful as they are delicious. Perfect for corporate gifting, special occasions, or simply making any moment memorable.'),
    h(3, 'Our Gift Collection'),
    ul([
      'Hand-crafted chocolate gift sets for any occasion',
      'Edible chocolate postcards with custom messages',
      'Chocolate business cards for memorable networking',
      'Corporate branding and logo integration',
      'Custom packaging and presentation options',
      'Chocolate décor elements for cakes and desserts',
      'Bulk orders for events and celebrations'
    ]),
    p('Each piece is lovingly crafted by hand using premium ingredients, ensuring that your personalized chocolate creations leave a lasting impression.')
  ];

  return upsertService({
    title: 'Custom Chocolate Gifts',
    slug: 'custom-chocolate-gifts',
    shortDescription: 'Hand-crafted gift sets, chocolate postcards and business cards, plus décor for your desserts—perfect for making any moment special.',
    description,
    icon: 'gift',
    featured: false,
    order: 6
  });
}

// ====== BLOG POSTS ======
// Upsert function for blog posts
async function upsertPost(postData) {
  try {
    // Check if post exists by slug
    const { data: existing } = await api.get(`/posts?filters[slug][$eq]=${postData.slug}&locale=${LOCALE}`);

    const payload = {
      data: {
        ...postData,
        locale: LOCALE,
        publishedAt: AUTO_PUBLISH ? new Date().toISOString() : null
      }
    };

    if (existing && existing.length > 0) {
      const id = existing[0].id;
      const res = await api.put(`/posts/${id}`, payload);
      return { id, action: 'updated', data: res.data.data };
    } else {
      const res = await api.post('/posts', payload);
      return { id: res.data.data.id, action: 'created', data: res.data.data };
    }
  } catch (err) {
    console.error(`Error upserting post "${postData.title}":`, err?.response?.data || err.message);
    throw err;
  }
}

// Blog Post 1: The Art of Tempering Chocolate
async function createOrUpdateTemperingPost() {
  return upsertPost({
    title: 'The Art of Tempering Chocolate: A Complete Guide',
    slug: 'art-of-tempering-chocolate',
    excerpt: 'Master the technique of tempering chocolate to achieve that perfect glossy finish and satisfying snap. Learn the science and methods behind this essential skill.',
    category: 'techniques',
    tags: ['tempering', 'chocolate making', 'techniques', 'professional'],
    author: 'Olesea',
    featured: true,
    content: [
      h(2, 'What is Chocolate Tempering?'),
      p('Tempering is the process of heating and cooling chocolate to stabilize it for making candies and confections. Properly tempered chocolate has a smooth, glossy finish and breaks with a crisp snap.'),
      h(2, 'Why Temper Chocolate?'),
      ul([
        'Creates a glossy, professional appearance',
        'Provides a satisfying snap when broken',
        'Prevents chocolate bloom (white streaks)',
        'Allows chocolate to release easily from molds',
        'Extends shelf life of chocolate products'
      ]),
      h(2, 'The Science Behind Tempering'),
      p('Chocolate contains cocoa butter, which can crystallize in several forms. Tempering encourages the formation of stable crystals (Form V), which give chocolate its desirable properties. When you melt chocolate, you break down these crystals, and tempering helps reform them in the correct structure.'),
      h(2, 'Three Methods of Tempering'),
      h(3, '1. Seeding Method (Recommended for Beginners)'),
      p('This is the easiest method for home chocolatiers. Melt 2/3 of your chocolate to 45-50°C (113-122°F), then add the remaining 1/3 as "seed" chocolate to cool it down to working temperature (31-32°C for dark chocolate).'),
      h(3, '2. Tabling Method'),
      p('Pour 2/3 of melted chocolate onto a marble slab, spread it with a spatula to cool it, then return it to the bowl. This method requires practice but gives excellent results.'),
      h(3, '3. Microwave Method'),
      p('Heat chocolate in short bursts, stirring frequently. This method works well for small amounts but requires careful attention to avoid overheating.'),
      h(2, 'Temperature Guidelines'),
      ul([
        'Dark chocolate: Melt to 50°C, cool to 27°C, reheat to 31-32°C',
        'Milk chocolate: Melt to 45°C, cool to 26°C, reheat to 29-30°C',
        'White chocolate: Melt to 40°C, cool to 25°C, reheat to 28-29°C'
      ]),
      h(2, 'Testing Your Temper'),
      p('Dip the tip of a knife into the tempered chocolate and let it set at room temperature (18-20°C). It should harden within 3-5 minutes with a glossy finish and no streaks. If it takes longer or looks dull, the chocolate is not properly tempered.'),
      h(2, 'Common Mistakes to Avoid'),
      ul([
        'Overheating the chocolate (destroys the cocoa butter structure)',
        'Getting water in the chocolate (causes seizing)',
        'Working in a hot or humid environment',
        'Not stirring enough during the process',
        'Using old or bloom-affected chocolate as seed'
      ]),
      h(2, 'Join Our Chocolate School'),
      p('Want to master tempering in person? Our chocolate school offers hands-on classes where you\'ll learn professional techniques from experienced chocolatiers. We cover everything from basic tempering to advanced molding techniques.')
    ]
  });
}

// Blog Post 2: 5 Easy Chocolate Desserts
async function createOrUpdateEasyDessertsPost() {
  return upsertPost({
    title: '5 Easy Chocolate Desserts Anyone Can Make',
    slug: '5-easy-chocolate-desserts',
    excerpt: 'Impress your friends and family with these simple yet delicious chocolate desserts. No advanced skills required—just quality chocolate and a love for sweet treats!',
    category: 'recipes',
    tags: ['recipes', 'desserts', 'easy', 'beginner-friendly'],
    author: 'Olesea',
    featured: true,
    content: [
      h(2, 'Introduction'),
      p('You don\'t need to be a pastry chef to create stunning chocolate desserts. These five recipes use simple techniques and readily available ingredients to deliver impressive results every time.'),
      h(2, '1. Classic Chocolate Mousse'),
      p('Light, airy, and intensely chocolatey, this mousse requires just four ingredients: dark chocolate, eggs, sugar, and cream. The key is to fold everything gently to maintain those delicate air bubbles.'),
      ul([
        'Prep time: 15 minutes',
        'Chill time: 2 hours',
        'Difficulty: Easy',
        'Serves: 4-6'
      ]),
      h(2, '2. No-Bake Chocolate Tart'),
      p('A buttery cookie crust filled with silky chocolate ganache—and you don\'t even need to turn on the oven. This elegant dessert looks like it came from a fancy bakery but takes minimal effort.'),
      h(2, '3. Chocolate-Covered Strawberries'),
      p('The ultimate romantic dessert that\'s surprisingly simple. The secret is properly tempered chocolate (or use our chocolate melts designed specifically for dipping). Fresh, ripe strawberries make all the difference.'),
      h(2, '4. Flourless Chocolate Cake'),
      p('Rich, fudgy, and naturally gluten-free. This cake has a crispy exterior and a molten center. It\'s the perfect showcase for high-quality dark chocolate.'),
      h(2, '5. Chocolate Truffles'),
      p('These bite-sized indulgences are easier than you think. The basic recipe is just chocolate and cream, rolled into balls and dusted with cocoa powder. Once you master the basic technique, you can experiment with endless flavor variations.'),
      h(2, 'Tips for Success'),
      ul([
        'Always use quality chocolate—it\'s the star of these recipes',
        'Bring ingredients to room temperature before starting',
        'Don\'t rush the chilling/setting times',
        'Taste and adjust sweetness to your preference',
        'Make extra—these desserts disappear quickly!'
      ]),
      h(2, 'Want to Learn More?'),
      p('Join our chocolate school classes to master these recipes and many more. We provide all the ingredients and expert guidance to help you become a confident chocolate dessert maker.')
    ]
  });
}

// Blog Post 3: Choosing the Right Chocolate
async function createOrUpdateChoosingChocolatePost() {
  return upsertPost({
    title: 'How to Choose the Right Chocolate for Your Recipes',
    slug: 'choosing-right-chocolate',
    excerpt: 'Not all chocolate is created equal. Learn how to select the perfect chocolate for baking, tempering, and eating, and understand what those percentages really mean.',
    category: 'tips',
    tags: ['chocolate selection', 'quality', 'baking', 'tips'],
    author: 'Olesea',
    featured: false,
    content: [
      h(2, 'Understanding Chocolate Types'),
      p('The world of chocolate can be confusing, with terms like couverture, compound, and percentages thrown around. Let\'s break it down so you can make informed choices for your projects.'),
      h(2, 'The Percentage Game'),
      p('When you see "70% dark chocolate," that percentage refers to the cocoa content (cocoa solids + cocoa butter). The rest is primarily sugar. Higher percentage doesn\'t automatically mean better—it depends on your use case.'),
      ul([
        '50-60%: Mild, sweet, great for beginners',
        '60-70%: Balanced, versatile for most recipes',
        '70-85%: Intense, less sweet, preferred by purists',
        '85%+: Very bitter, specialty applications'
      ]),
      h(2, 'Couverture vs. Regular Chocolate'),
      p('Couverture chocolate has a higher cocoa butter content (minimum 31%), which makes it ideal for tempering and coating. It\'s what professionals use for molded chocolates and enrobing. Regular chocolate has less cocoa butter and is better suited for baking where texture is less critical.'),
      h(2, 'Single-Origin vs. Blends'),
      p('Single-origin chocolate comes from cocoa beans grown in one region, offering unique flavor profiles—fruity, nutty, floral, or earthy. Blended chocolates combine beans from different regions for consistent, balanced flavor. Neither is "better"—it depends on whether you want consistency or adventure.'),
      h(2, 'What to Look For on the Label'),
      ul([
        'Cocoa percentage and type (dark, milk, white)',
        'Ingredients list (shorter is usually better)',
        'Cocoa butter vs. other fats (avoid "chocolate-flavored coating")',
        'Origin information if you\'re interested in terroir',
        'Certifications (Fair Trade, organic, etc.)'
      ]),
      h(2, 'Matching Chocolate to Purpose'),
      h(3, 'For Tempering & Molding'),
      p('Use couverture chocolate with high cocoa butter content. Our shop carries professional-grade couverture in dark, milk, and white varieties.'),
      h(3, 'For Baking'),
      p('Regular chocolate chips or bars work great. The extra fat in recipes compensates for lower cocoa butter content.'),
      h(3, 'For Eating'),
      p('This is purely personal preference! Experiment with different percentages and origins to find your favorites.'),
      h(2, 'Storage Tips'),
      p('Store chocolate in a cool (15-18°C), dry place away from strong odors. Avoid refrigeration unless absolutely necessary, as condensation can cause sugar bloom. Properly stored chocolate can last for years.'),
      h(2, 'Visit Our Shop'),
      p('We carry a curated selection of high-quality chocolate from around the world, perfect for any project. Our staff can help you choose the right chocolate for your needs.')
    ]
  });
}

// Blog Post 4: Behind the Scenes at Our Chocolate School
async function createOrUpdateSchoolBehindScenesPost() {
  return upsertPost({
    title: 'Behind the Scenes: A Day at Our Chocolate School',
    slug: 'behind-scenes-chocolate-school',
    excerpt: 'Ever wondered what happens in our chocolate school classes? Join us for a virtual tour of a typical class day and discover what makes our hands-on approach special.',
    category: 'events',
    tags: ['chocolate school', 'classes', 'education', 'behind the scenes'],
    author: 'Olesea',
    featured: false,
    content: [
      h(2, 'Welcome to Class'),
      p('Our chocolate school isn\'t just about following recipes—it\'s about understanding the craft of chocolate making. Let me take you through a typical day in one of our adult chocolate school classes.'),
      h(2, '9:00 AM - Arrival & Setup'),
      p('Students arrive to find their workstations already set up with all the tools they\'ll need: marble slab, thermometer, spatulas, molds, and of course, premium chocolate. We start with coffee and pastries while everyone settles in and gets to know each other.'),
      h(2, '9:30 AM - Theory & Demonstration'),
      p('Every great chocolatier needs to understand the "why" behind the techniques. We spend the first hour covering the science of chocolate, discussing cocoa percentages, and demonstrating the day\'s techniques. Students are encouraged to ask questions—lots of them!'),
      h(2, '10:30 AM - Hands-On Practice'),
      p('Now the real fun begins. Today\'s class is focusing on tempering and molding. Each student gets to work with their own batch of chocolate, learning to recognize the subtle signs of proper temper. I walk around, offering guidance and troubleshooting.'),
      h(2, '12:00 PM - Lunch Break'),
      p('We break for a light lunch (with chocolate tasting, naturally). This is when the group really bonds, sharing their experiences and chocolate aspirations. Some students dream of starting their own business, others just want to make better gifts for friends.'),
      h(2, '1:00 PM - Creative Work'),
      p('The afternoon is dedicated to creativity. Students design and fill their own chocolate molds, experimenting with flavors and decorations. This is where personalities shine through—some create elegant minimalist pieces, others go bold with colors and patterns.'),
      h(2, '3:00 PM - Finishing & Packaging'),
      p('We learn proper unmolding techniques and how to polish chocolates for a professional finish. Then students package their creations in beautiful boxes to take home. There\'s always a sense of pride when they see their finished products.'),
      h(2, '4:00 PM - Cleanup & Goodbye'),
      p('We clean up together (chocolate cleanup is strangely satisfying), and students leave with their chocolates, detailed notes, and usually a plan to return for the next level class.'),
      h(2, 'What Makes Our School Special'),
      ul([
        'Small class sizes (max 8 students) for personalized attention',
        'Professional-grade equipment and ingredients',
        'Experienced instructors with industry backgrounds',
        'Hands-on practice, not just watching demonstrations',
        'Supportive community of chocolate lovers',
        'All materials included—just bring your enthusiasm'
      ]),
      h(2, 'Different Classes for Different Goals'),
      p('We offer classes for complete beginners, advanced techniques for aspiring professionals, and special kids\' classes that make learning fun. Every class is designed to be informative, practical, and enjoyable.'),
      h(2, 'Ready to Join Us?'),
      p('Browse our upcoming classes and reserve your spot. Whether you want to learn the basics or master advanced techniques, we have a class for you.')
    ]
  });
}

// Blog Post 5: Seasonal Chocolate Gift Ideas
async function createOrUpdateGiftIdeasPost() {
  return upsertPost({
    title: 'Creative Chocolate Gift Ideas for Every Occasion',
    slug: 'chocolate-gift-ideas',
    excerpt: 'Move beyond the basic box of chocolates. Discover unique, personalized chocolate gift ideas that will delight recipients and showcase your thoughtfulness.',
    category: 'news',
    tags: ['gifts', 'occasions', 'custom', 'chocolate art'],
    author: 'Olesea',
    featured: false,
    content: [
      h(2, 'Beyond the Standard Gift Box'),
      p('Chocolate gifts are always appreciated, but with a little creativity, you can transform them from ordinary to extraordinary. Here are our favorite ideas for different occasions.'),
      h(2, 'For Birthdays'),
      h(3, 'Chocolate Portrait'),
      p('Commission a custom chocolate portrait of the birthday person. We can create realistic chocolate art based on a photo—it\'s edible and impressive!'),
      h(3, 'Number Molded Chocolates'),
      p('Create large chocolate numbers representing their age, filled with their favorite treats. It\'s festive and fun for milestone birthdays.'),
      h(2, 'For Weddings & Anniversaries'),
      h(3, 'Chocolate Postcards'),
      p('Send your love in chocolate form! Our chocolate postcards can be customized with dates, names, or sweet messages. They\'re beautiful keepsakes (until they\'re eaten).'),
      h(3, 'Matching Chocolate Sets'),
      p('Create "his and hers" sets with complementary flavors—dark chocolate for one, milk for the other, elegantly packaged together.'),
      h(2, 'For Corporate Gifts'),
      h(3, 'Logo Chocolates'),
      p('Impress clients and employees with custom chocolates featuring your company logo. We handle everything from design to packaging.'),
      h(3, 'Chocolate Business Cards'),
      p('Yes, really! Edible business cards made from premium chocolate leave a lasting (and delicious) impression.'),
      h(2, 'For Holidays'),
      h(3, 'Themed Advent Calendars'),
      p('Skip the commercial calendars and create a custom chocolate advent calendar with handpicked favorites.'),
      h(3, 'Chocolate Ornaments'),
      p('Decorate trees with edible chocolate ornaments that double as gifts or treats for guests.'),
      h(2, 'For "Just Because"'),
      h(3, 'Chocolate Tasting Set'),
      p('Curate a selection of single-origin chocolates from around the world, complete with tasting notes. It\'s like a wine tasting, but sweeter.'),
      h(3, 'Dessert Decoration Kit'),
      p('Put together a kit with chocolate shavings, curls, and decorative elements for the home baker in your life.'),
      h(2, 'Personalization Makes the Difference'),
      p('What transforms a good chocolate gift into a great one is personalization. Consider the recipient\'s favorite flavors, dietary restrictions, color preferences, and the message you want to convey.'),
      h(2, 'Our Custom Gift Services'),
      ul([
        'Custom molding and shaping',
        'Personalized messages in chocolate',
        'Logo and image reproduction',
        'Elegant gift packaging',
        'Delivery coordination for special dates',
        'Consultation to match gifts to recipients'
      ]),
      h(2, 'Quality Matters'),
      p('The difference between forgettable and memorable chocolate gifts often comes down to quality. We use premium chocolate and artisanal techniques to ensure every gift makes the right impression.'),
      h(2, 'Start Planning Your Gift'),
      p('Browse our custom gift options or contact us to discuss a completely bespoke creation. We love bringing creative chocolate gift ideas to life!')
    ]
  });
}

// Blog Post 6: Chocolate and Wine Pairing
async function createOrUpdatePairingPost() {
  return upsertPost({
    title: 'Chocolate and Wine Pairing: A Sophisticated Guide',
    slug: 'chocolate-wine-pairing',
    excerpt: 'Elevate your tasting experience by pairing chocolate with wine. Learn which combinations work beautifully and why, from our sommeliers and chocolatiers.',
    category: 'tips',
    tags: ['pairing', 'wine', 'tasting', 'sophisticated'],
    author: 'Olesea',
    featured: true,
    content: [
      h(2, 'The Art of Pairing'),
      p('Chocolate and wine pairing is a sophisticated pleasure that, when done right, elevates both elements. The key is understanding how flavors interact and finding combinations that enhance rather than overwhelm.'),
      h(2, 'Basic Pairing Principles'),
      ul([
        'Match intensity: Delicate chocolates with lighter wines, robust chocolates with fuller wines',
        'Complement or contrast: Pair similar flavor notes, or use contrasting profiles for interest',
        'Consider sweetness: The wine should be as sweet or sweeter than the chocolate',
        'Don\'t forget tannins: High-tannin wines can clash with milk chocolate',
        'Temperature matters: Serve wine at proper temperature, chocolate at room temp'
      ]),
      h(2, 'Dark Chocolate Pairings'),
      h(3, '70-75% Dark Chocolate'),
      p('Pairs beautifully with Cabernet Sauvignon, Zinfandel, or Port. The wine\'s tannins complement the chocolate\'s complexity without overwhelming it.'),
      h(3, '80-85% Dark Chocolate'),
      p('Try with fortified wines like Madeira or sweet Sherry. The wine\'s sweetness balances the chocolate\'s intensity.'),
      h(2, 'Milk Chocolate Pairings'),
      p('Milk chocolate\'s creaminess pairs wonderfully with dessert wines like Moscato d\'Asti, Riesling, or even a light Pinot Noir. The key is avoiding high-tannin wines that will taste bitter against the milk.'),
      h(2, 'White Chocolate Pairings'),
      p('Though technically not chocolate (no cocoa solids), white chocolate pairs well with crisp white wines, Champagne, or sweet ice wines. The effervescence cuts through the richness.'),
      h(2, 'Flavored Chocolate Pairings'),
      h(3, 'Fruit-Infused Chocolates'),
      p('Match the fruit notes: raspberry chocolate with Pinot Noir, orange chocolate with Grand Marnier, strawberry chocolate with rosé.'),
      h(3, 'Spiced Chocolates'),
      p('Chili or ginger-infused chocolates pair surprisingly well with Syrah or Shiraz, which have their own peppery notes.'),
      h(3, 'Salted Caramel Chocolates'),
      p('The sweet-salty combination works beautifully with bourbon or Scotch whisky, or try a sweet Riesling.'),
      h(2, 'Creating a Pairing Experience'),
      p('For a proper tasting, start with lighter chocolates and wines, progressing to richer, more intense combinations. Cleanse your palate with water between pairings. Take small bites and sips, letting the chocolate melt on your tongue before sipping the wine.'),
      h(2, 'Our Pairing Events'),
      p('We host regular chocolate and wine pairing events where you can explore these combinations under expert guidance. Each event features 5-6 carefully selected pairings with detailed notes on why they work.'),
      h(2, 'Common Pairing Mistakes'),
      ul([
        'Pairing tannic red wine with milk chocolate',
        'Serving wine too cold or too warm',
        'Using low-quality chocolate with premium wine (or vice versa)',
        'Eating chocolate too quickly without letting it melt',
        'Overwhelming your palate by not cleansing between tastings'
      ]),
      h(2, 'Build Your Own Pairing'),
      p('Visit our shop to select artisan chocolates, and we\'ll provide pairing recommendations. We also offer curated pairing sets that take the guesswork out of creating your own tasting experience.')
    ]
  });
}

// ====== HEADER & FOOTER ======

// Header Single Type
async function createOrUpdateHeader() {
  try {
    const headerData = {
      ownerName: 'Olesea',
      menuItems: [
        { label: 'Home', href: '/', isActive: false },
        { label: 'Services', href: '/services', isActive: false },
        { label: 'School', href: '/school', isActive: false },
        { label: 'Shop', href: '/shop', isActive: false },
        { label: 'Blog', href: '/blog', isActive: false },
        { label: 'About', href: '/about', isActive: false },
        { label: 'Contact', href: '/contact', isActive: false },
      ],
      ctaButton: cta('Book a Class', '/school')
    };

    const payload = {
      data: {
        ...headerData,
        locale: LOCALE,
        publishedAt: AUTO_PUBLISH ? new Date().toISOString() : null
      }
    };

    // For single types, just PUT without checking if exists
    const res = await api.put('/header', payload);
    return { id: res.data.data.id || res.data.data.documentId, action: 'updated' };
  } catch (err) {
    console.error(`Error updating header:`, err?.response?.data || err.message);
    throw err;
  }
}

// Footer Single Type
async function createOrUpdateFooter() {
  try {
    const footerData = {
      address: 'Chisinau, Moldova\nStr. Example 123',
      contactItem: [
        { label: 'Phone', value: '+373 12 345 678' },
        { label: 'Email', value: 'info@delicemy.md' },
        { label: 'WhatsApp', value: '+373 12 345 678' }
      ],
      socialLink: [
        { platform: 'Facebook', url: 'https://facebook.com/delicemy' },
        { platform: 'Instagram', url: 'https://instagram.com/delicemy' },
        { platform: 'TikTok', url: 'https://tiktok.com/@delicemy' }
      ],
      bottomNote: '© 2025 DeliceMy. Handcrafted with love in Chisinau.',
      legalLinks: [
        { label: 'Privacy Policy', url: '/privacy-policy', newTab: false },
        { label: 'Terms of Service', url: '/terms', newTab: false }
      ]
    };

    const payload = {
      data: {
        ...footerData,
        publishedAt: AUTO_PUBLISH ? new Date().toISOString() : null
      }
    };

    // For single types, just PUT without checking if exists
    const res = await api.put('/footer', payload);
    return { id: res.data.data.id || res.data.data.documentId, action: 'updated' };
  } catch (err) {
    console.error(`Error updating footer:`, err?.response?.data || err.message);
    throw err;
  }
}

// ====== RUN ======
(async () => {
  try {
    console.log(`🍫 Seeding DeliceMy content (locale: ${LOCALE})…`);
    console.log(`📌 Using Strapi URL: ${STRAPI_URL}`);
    console.log(`📝 Auto-publish: ${AUTO_PUBLISH ? 'Yes' : 'No (drafts)'}`);
    console.log(``);

    // Test connection first
    const connected = await testConnection();
    if (!connected) {
      console.log(`\n⚠️  Aborting: Cannot connect to Strapi. Please check:`);
      console.log(`   1. Strapi is running at ${STRAPI_URL}`);
      console.log(`   2. API_TOKEN is valid`);
      console.log(`   3. Token has proper permissions`);
      process.exit(1);
    }

    console.log(`\n📄 Creating/updating pages...`);

    // Run each page separately with error handling
    const pages = [
      { name: `Home`, fn: createOrUpdateHome },
      { name: `Services`, fn: createOrUpdateServices },
      { name: `About`, fn: createOrUpdateAbout },
      { name: `School`, fn: createOrUpdateSchool },
      { name: `Shop`, fn: createOrUpdateShop },
      { name: `Blog`, fn: createOrUpdateBlog },
      { name: `Contact`, fn: createOrUpdateContact },
    ];

    let successCount = 0;
    let failedPages = [];

    for (const page of pages) {
      try {
        const result = await page.fn();
        console.log(`✅ ${page.name}: ${result.action} (ID: ${result.id})`);
        successCount++;
      } catch (error) {
        console.log(`❌ ${page.name}: Failed`);
        failedPages.push(page.name);
      }
    }

    console.log(``);
    console.log(`📊 Pages: ${successCount}/${pages.length} successful`);

    // Create individual Service entries
    console.log(`\n🎯 Creating/updating individual services...`);

    const services = [
      { name: `Chocolate School for Adults`, fn: createOrUpdateAdultSchoolService },
      { name: `Children's Chocolate School`, fn: createOrUpdateChildrensSchoolService },
      { name: `HoReCa Consulting`, fn: createOrUpdateHoRecaService },
      { name: `Tastings & Events`, fn: createOrUpdateTastingsEventsService },
      { name: `Dessert & Mold Design`, fn: createOrUpdateDessertMoldDesignService },
      { name: `Custom Chocolate Gifts`, fn: createOrUpdateCustomGiftsService },
    ];

    let serviceSuccessCount = 0;
    let failedServices = [];

    for (const service of services) {
      try {
        const result = await service.fn();
        console.log(`✅ ${service.name}: ${result.action} (ID: ${result.id})`);
        serviceSuccessCount++;
      } catch (error) {
        console.log(`❌ ${service.name}: Failed`);
        failedServices.push(service.name);
      }
    }

    console.log(``);
    console.log(`📊 Services: ${serviceSuccessCount}/${services.length} successful`);

    // Create Blog Posts
    console.log(`\n📝 Creating/updating blog posts...`);

    const posts = [
      { name: `The Art of Tempering Chocolate`, fn: createOrUpdateTemperingPost },
      { name: `5 Easy Chocolate Desserts`, fn: createOrUpdateEasyDessertsPost },
      { name: `Choosing the Right Chocolate`, fn: createOrUpdateChoosingChocolatePost },
      { name: `Behind the Scenes at Our Chocolate School`, fn: createOrUpdateSchoolBehindScenesPost },
      { name: `Creative Chocolate Gift Ideas`, fn: createOrUpdateGiftIdeasPost },
      { name: `Chocolate and Wine Pairing`, fn: createOrUpdatePairingPost },
    ];

    let postSuccessCount = 0;
    let failedPosts = [];

    for (const post of posts) {
      try {
        const result = await post.fn();
        console.log(`✅ ${post.name}: ${result.action} (ID: ${result.id})`);
        postSuccessCount++;
      } catch (error) {
        console.log(`❌ ${post.name}: Failed`);
        failedPosts.push(post.name);
      }
    }

    console.log(``);
    console.log(`📊 Blog Posts: ${postSuccessCount}/${posts.length} successful`);

    // Create/Update Header and Footer
    console.log(`\n🎨 Creating/updating Header & Footer...`);

    try {
      const headerResult = await createOrUpdateHeader();
      console.log(`✅ Header: ${headerResult.action}`);
    } catch (error) {
      console.log(`❌ Header: Failed`);
    }

    try {
      const footerResult = await createOrUpdateFooter();
      console.log(`✅ Footer: ${footerResult.action}`);
    } catch (error) {
      console.log(`❌ Footer: Failed`);
    }

    if (failedPages.length > 0 || failedServices.length > 0 || failedPosts.length > 0) {
      if (failedPages.length > 0) {
        console.log(`⚠️  Failed pages: ${failedPages.join(', ')}`);
      }
      if (failedServices.length > 0) {
        console.log(`⚠️  Failed services: ${failedServices.join(', ')}`);
      }
      if (failedPosts.length > 0) {
        console.log(`⚠️  Failed blog posts: ${failedPosts.join(', ')}`);
      }
      console.log(`   Check the errors above and ensure:`);
      console.log(`   - All required media IDs exist`);
      console.log(`   - Schema components match exactly`);
      console.log(`   - Service and Post content types are properly created`);
    } else {
      console.log(`🎉 All pages, services, and blog posts created/updated successfully!`);
    }

    console.log(``);
    console.log(`📝 IMPORTANT NEXT STEPS:`);
    console.log(`1. Upload images to Media Library and replace MEDIA IDs (lines 82-99)`);
    console.log(`2. Update contact info:`);
    console.log(`   - Replace phone numbers (search for: +37312345678)`);
    console.log(`   - Replace emails (search for: @delicemy.md)`);
    console.log(`3. Configure Header and Footer single types in Strapi Admin`);
    console.log(`4. Create Product entries if using product grid`);
    console.log(`5. Test all forms and adjust field configurations`);
    
    if (AUTO_PUBLISH) {
      console.log(`\n✨ Pages are published and live!`);
    } else {
      console.log(`\n📋 Pages created as drafts. Publish them in Strapi Admin when ready.`);
    }
    
  } catch (err) {
    console.error(`\n❌ Unexpected error:`, err?.response?.data || err.message);
    if (err?.response?.data?.error?.details) {
      console.error(`Details:`, JSON.stringify(err.response.data.error.details, null, 2));
    }
  }
})();
