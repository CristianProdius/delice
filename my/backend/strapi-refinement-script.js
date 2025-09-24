#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

// Color codes for console output
const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  red: '\x1b[31m',
  cyan: '\x1b[36m'
};

// Helper function to read JSON file
const readJsonFile = (filePath) => {
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    return JSON.parse(content);
  } catch (error) {
    console.log(`${colors.yellow}⚠${colors.reset} Could not read ${filePath}: ${error.message}`);
    return null;
  }
};

// Helper function to write JSON file
const writeJsonFile = (filePath, content) => {
  const dirname = path.dirname(filePath);
  if (!fs.existsSync(dirname)) {
    fs.mkdirSync(dirname, { recursive: true });
  }
  fs.writeFileSync(filePath, JSON.stringify(content, null, 2));
  console.log(`${colors.green}✓${colors.reset} Updated: ${filePath}`);
};

// Helper function to backup file
const backupFile = (filePath) => {
  if (fs.existsSync(filePath)) {
    const backupPath = `${filePath}.backup.${Date.now()}`;
    fs.copyFileSync(filePath, backupPath);
    console.log(`${colors.yellow}⚠${colors.reset} Backed up: ${filePath} -> ${backupPath}`);
    return true;
  }
  return false;
};

// ============================================
// REFINEMENT 1: Rename cardItem to items
// ============================================
const renameCardItemToItems = () => {
  console.log(`\n${colors.blue}📝 Renaming cardItem to items in sections...${colors.reset}`);
  
  const sectionsToUpdate = [
    'src/components/sections/services.json',
    'src/components/sections/benefits.json',
    'src/components/sections/testimonials.json'
  ];

  sectionsToUpdate.forEach(filePath => {
    const content = readJsonFile(filePath);
    if (content && content.attributes && content.attributes.cardItem) {
      backupFile(filePath);
      
      // Rename cardItem to items
      content.attributes.items = content.attributes.cardItem;
      delete content.attributes.cardItem;
      
      writeJsonFile(filePath, content);
    }
  });
};

// ============================================
// REFINEMENT 2: Delete service-item.json
// ============================================
const deleteServiceItem = () => {
  console.log(`\n${colors.blue}🗑️  Removing duplicate service-item component...${colors.reset}`);
  
  const serviceItemPath = 'src/components/elements/service-item.json';
  if (fs.existsSync(serviceItemPath)) {
    backupFile(serviceItemPath);
    fs.unlinkSync(serviceItemPath);
    console.log(`${colors.green}✓${colors.reset} Deleted: ${serviceItemPath}`);
  } else {
    console.log(`${colors.yellow}ℹ${colors.reset} service-item.json already removed or doesn't exist`);
  }
};

// ============================================
// REFINEMENT 3: Add i18n localization
// ============================================
const addI18nLocalization = () => {
  console.log(`\n${colors.blue}🌍 Adding i18n localization to component fields...${colors.reset}`);
  
  const updates = {
    'src/components/elements/section-header.json': ['kicker', 'title', 'subtitle'],
    'src/components/elements/card-item.json': ['title', 'description', 'badge', 'price'],
    'src/components/elements/cta-button.json': ['text'],
    'src/components/elements/highlights.json': ['text'],
    'src/components/elements/faq-item.json': ['question', 'answer'],
    'src/components/elements/image.json': ['alt', 'caption', 'title'],
    'src/components/elements/form-field.json': ['label', 'placeholder'],
    'src/components/sections/contact-form.json': ['successMessage']
  };

  Object.entries(updates).forEach(([filePath, fields]) => {
    const content = readJsonFile(filePath);
    if (content && content.attributes) {
      let updated = false;
      
      fields.forEach(field => {
        if (content.attributes[field]) {
          // Add i18n localization
          if (!content.attributes[field].pluginOptions) {
            content.attributes[field].pluginOptions = {};
          }
          content.attributes[field].pluginOptions.i18n = { localized: true };
          updated = true;
        }
      });
      
      if (updated) {
        backupFile(filePath);
        writeJsonFile(filePath, content);
      }
    }
  });
};

// ============================================
// REFINEMENT 4: Add consent & honeypot to contact form
// ============================================
const enhanceContactForm = () => {
  console.log(`\n${colors.blue}🔒 Adding consent and honeypot to contact form...${colors.reset}`);
  
  const contactFormPath = 'src/components/sections/contact-form.json';
  const content = readJsonFile(contactFormPath);
  
  if (content && content.attributes) {
    backupFile(contactFormPath);
    
    // Add consent field
    content.attributes.consentText = {
      type: "string",
      default: "I agree to the processing of my personal data",
      pluginOptions: {
        i18n: { localized: true }
      }
    };
    
    // Add honeypot field configuration
    content.attributes.enableHoneypot = {
      type: "boolean",
      default: true,
      description: "Enable honeypot spam protection"
    };
    
    // Add GDPR compliance text
    content.attributes.privacyPolicyLink = {
      type: "string",
      description: "Link to privacy policy page"
    };
    
    writeJsonFile(contactFormPath, content);
  }
};

// ============================================
// REFINEMENT 5: Create unified banner section (optional)
// ============================================
const createUnifiedBanner = () => {
  console.log(`\n${colors.blue}🎯 Creating unified banner section (combines mission + cta-banner)...${colors.reset}`);
  
  const bannerPath = 'src/components/sections/banner.json';
  
  const bannerSection = {
    collectionName: "components_sections_banners",
    info: {
      displayName: "banner",
      description: "Flexible banner section for CTAs and mission statements"
    },
    options: {},
    attributes: {
      header: {
        type: "component",
        component: "elements.section-header",
        pluginOptions: {
          i18n: { localized: true }
        }
      },
      description: {
        type: "blocks",
        pluginOptions: {
          i18n: { localized: true }
        }
      },
      variant: {
        type: "enumeration",
        enum: ["cta", "mission", "hero", "announcement"],
        default: "cta"
      },
      layout: {
        type: "enumeration",
        enum: ["left", "center", "right", "split"],
        default: "center"
      },
      background: {
        type: "component",
        component: "elements.image"
      },
      foregroundImage: {
        type: "component",
        component: "elements.image",
        description: "Portrait or product image"
      },
      signature: {
        type: "media",
        multiple: false,
        allowedTypes: ["images"],
        description: "Signature image for personal touch"
      },
      ctaButtons: {
        type: "component",
        component: "elements.cta-button",
        repeatable: true,
        max: 2
      },
      theme: {
        type: "enumeration",
        enum: ["light", "dark", "primary", "secondary"],
        default: "light"
      }
    }
  };
  
  writeJsonFile(bannerPath, bannerSection);
};

// ============================================
// REFINEMENT 6: Update Page content type to include banner
// ============================================
const updatePageContentType = () => {
  console.log(`\n${colors.blue}📄 Updating Page content type to include banner section...${colors.reset}`);
  
  const pagePath = 'src/api/page/content-types/page/schema.json';
  const content = readJsonFile(pagePath);
  
  if (content && content.attributes && content.attributes.sections) {
    const components = content.attributes.sections.components;
    
    // Add banner if not already present
    if (!components.includes("sections.banner")) {
      backupFile(pagePath);
      components.push("sections.banner");
      writeJsonFile(pagePath, content);
    } else {
      console.log(`${colors.yellow}ℹ${colors.reset} Banner section already included in Page content type`);
    }
  }
};

// ============================================
// REFINEMENT 7: Add Blog/Post content type
// ============================================
const createBlogContentType = () => {
  console.log(`\n${colors.blue}📰 Creating Blog Post content type...${colors.reset}`);
  
  const postSchema = {
    kind: "collectionType",
    collectionName: "posts",
    info: {
      singularName: "post",
      pluralName: "posts",
      displayName: "Blog Post",
      description: "Blog posts and articles"
    },
    options: {
      draftAndPublish: true
    },
    pluginOptions: {
      i18n: {
        localized: true
      }
    },
    attributes: {
      title: {
        type: "string",
        required: true,
        pluginOptions: {
          i18n: { localized: true }
        }
      },
      slug: {
        type: "uid",
        targetField: "title"
      },
      excerpt: {
        type: "text",
        maxLength: 300,
        pluginOptions: {
          i18n: { localized: true }
        }
      },
      coverImage: {
        type: "component",
        component: "elements.image"
      },
      content: {
        type: "blocks",
        pluginOptions: {
          i18n: { localized: true }
        }
      },
      author: {
        type: "string",
        default: "Olesea"
      },
      publishedAt: {
        type: "datetime"
      },
      category: {
        type: "enumeration",
        enum: ["recipes", "techniques", "events", "news", "tips"],
        pluginOptions: {
          i18n: { localized: true }
        }
      },
      tags: {
        type: "json",
        pluginOptions: {
          i18n: { localized: true }
        }
      },
      featured: {
        type: "boolean",
        default: false
      },
      relatedProducts: {
        type: "relation",
        relation: "manyToMany",
        target: "api::product.product"
      },
      relatedCourses: {
        type: "relation",
        relation: "manyToMany",
        target: "api::course.course"
      },
      seo: {
        type: "component",
        component: "seo.meta-data",
        pluginOptions: {
          i18n: { localized: true }
        }
      }
    }
  };
  
  const postPath = 'src/api/post/content-types/post/schema.json';
  writeJsonFile(postPath, postSchema);
  
  // Create controller
  const controllerContent = `'use strict';

/**
 * post controller
 */

const { createCoreController } = require('@strapi/strapi').factories;

module.exports = createCoreController('api::post.post');
`;
  
  const controllerPath = 'src/api/post/controllers/post.js';
  const controllerDir = path.dirname(controllerPath);
  if (!fs.existsSync(controllerDir)) {
    fs.mkdirSync(controllerDir, { recursive: true });
  }
  fs.writeFileSync(controllerPath, controllerContent);
  console.log(`${colors.green}✓${colors.reset} Created controller: ${controllerPath}`);
  
  // Create routes
  const routesContent = `'use strict';

/**
 * post router
 */

const { createCoreRouter } = require('@strapi/strapi').factories;

module.exports = createCoreRouter('api::post.post');
`;
  
  const routesPath = 'src/api/post/routes/post.js';
  const routesDir = path.dirname(routesPath);
  if (!fs.existsSync(routesDir)) {
    fs.mkdirSync(routesDir, { recursive: true });
  }
  fs.writeFileSync(routesPath, routesContent);
  console.log(`${colors.green}✓${colors.reset} Created routes: ${routesPath}`);
  
  // Create services
  const servicesContent = `'use strict';

/**
 * post service
 */

const { createCoreService } = require('@strapi/strapi').factories;

module.exports = createCoreService('api::post.post');
`;
  
  const servicesPath = 'src/api/post/services/post.js';
  const servicesDir = path.dirname(servicesPath);
  if (!fs.existsSync(servicesDir)) {
    fs.mkdirSync(servicesDir, { recursive: true });
  }
  fs.writeFileSync(servicesPath, servicesContent);
  console.log(`${colors.green}✓${colors.reset} Created service: ${servicesPath}`);
};

// ============================================
// Main execution
// ============================================
const runRefinements = async () => {
  console.log(`${colors.cyan}🚀 Starting Strapi Structure Refinements${colors.reset}`);
  console.log(`${colors.cyan}=====================================\n${colors.reset}`);
  
  try {
    // Run all refinements
    renameCardItemToItems();
    deleteServiceItem();
    addI18nLocalization();
    enhanceContactForm();
    createUnifiedBanner();
    updatePageContentType();
    createBlogContentType();
    
    console.log(`\n${colors.green}✅ All refinements complete!${colors.reset}`);
    console.log(`\n${colors.yellow}📋 Next steps:${colors.reset}`);
    console.log('1. Review the changes and backups created');
    console.log('2. Clear Strapi cache: rm -rf .cache build');
    console.log('3. Rebuild: npm run build');
    console.log('4. Start Strapi: npm run develop');
    console.log('5. Update permissions in Admin Panel for new content types');
    console.log('6. Configure i18n locales (RO, RU, EN) in Settings → Internationalization');
    console.log('7. Test creating content with the new localized fields');
    
    console.log(`\n${colors.cyan}📄 Available pages to build:${colors.reset}`);
    console.log('- Homepage (hero → services → benefits → about → gallery → testimonials → cta)');
    console.log('- Services (hero → services → gallery → testimonials → faq → cta)');
    console.log('- About (hero → about → gallery → mission/banner → testimonials)');
    console.log('- School (hero → benefits → services → gallery → faq → contact-form)');
    console.log('- Shop (hero → gallery → products grid → faq → cta)');
    console.log('- Blog (post listings + banner for newsletter)');
    console.log('- Contact (hero → contact-form → faq → gallery)');
    
    console.log(`\n${colors.blue}💡 Pro tip: The new unified banner section can replace both mission and cta-banner sections!${colors.reset}`);
    
  } catch (error) {
    console.error(`${colors.red}❌ Error during refinements:${colors.reset}`, error);
    process.exit(1);
  }
};

// Run the refinements
runRefinements();
