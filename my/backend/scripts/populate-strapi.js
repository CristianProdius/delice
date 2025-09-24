// populate-strapi.v5.js
// Strapi v5 content seed for DeliceMy - Production-ready version

const axios = require('axios');

// ====== CONFIG ======
const STRAPI_URL = 'http://localhost:1337';           // <-- change if needed
const API_TOKEN  = process.env.API_TOKEN;
const LOCALE     = 'en';                              // <-- this run = English
const AUTO_PUBLISH = true;                            // <-- set to false if you want drafts

// ====== AXIOS ======
const api = axios.create({
  baseURL: `${STRAPI_URL}/api`,
  headers: { 
    Authorization: `Bearer ${API_TOKEN}`,
    'Content-Type': 'application/json'
  },
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
          ctaButton: cta(`View Schedule`, `/school`),
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
          ctaButton: cta(`Book Kids Workshop`, `/contact`),
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
          ctaButton: cta(`Schedule Consultation`, `/contact`),
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
          ctaButton: cta(`Plan Your Event`, `/contact`),
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
          ctaButton: cta(`Start Design Project`, `/contact`),
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
          ctaButton: cta(`Order Custom Gift`, `/contact`),
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
    console.log(`📊 Results: ${successCount}/${pages.length} pages successful`);
    
    if (failedPages.length > 0) {
      console.log(`⚠️  Failed pages: ${failedPages.join(', ')}`);
      console.log(`   Check the errors above and ensure:`);
      console.log(`   - All required media IDs exist`);
      console.log(`   - Schema components match exactly`);
    } else {
      console.log(`🎉 All pages created/updated successfully!`);
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
