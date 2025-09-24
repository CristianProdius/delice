#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

// Color codes for console output
const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  red: '\x1b[31m'
};

// Helper function to create directories recursively
const ensureDirectoryExists = (filePath) => {
  const dirname = path.dirname(filePath);
  if (fs.existsSync(dirname)) {
    return true;
  }
  ensureDirectoryExists(dirname);
  fs.mkdirSync(dirname);
};

// Helper function to write JSON files
const writeJsonFile = (filePath, content) => {
  ensureDirectoryExists(filePath);
  fs.writeFileSync(filePath, JSON.stringify(content, null, 2));
  console.log(`${colors.green}✓${colors.reset} Created: ${filePath}`);
};

// Helper function to backup existing files
const backupFile = (filePath) => {
  if (fs.existsSync(filePath)) {
    const backupPath = `${filePath}.backup.${Date.now()}`;
    fs.copyFileSync(filePath, backupPath);
    console.log(`${colors.yellow}⚠${colors.reset} Backed up: ${filePath} -> ${backupPath}`);
    return true;
  }
  return false;
};

// Component definitions
const components = {
  // New Elements Components
  'src/components/elements/section-header.json': {
    collectionName: "components_elements_section_headers",
    info: {
      displayName: "sectionHeader",
      description: "Reusable section header with kicker, title, and subtitle"
    },
    options: {},
    attributes: {
      kicker: {
        type: "string"
      },
      title: {
        type: "string",
        required: true
      },
      subtitle: {
        type: "string"
      },
      alignment: {
        type: "enumeration",
        enum: ["left", "center", "right"],
        default: "center"
      }
    }
  },

  'src/components/elements/card-item.json': {
    collectionName: "components_elements_card_items",
    info: {
      displayName: "cardItem",
      description: "Versatile card component for services, testimonials, pricing"
    },
    options: {},
    attributes: {
      title: {
        type: "string",
        required: true
      },
      description: {
        type: "blocks"
      },
      image: {
        type: "media",
        multiple: false,
        allowedTypes: ["images"]
      },
      icon: {
        type: "media",
        multiple: false,
        allowedTypes: ["images", "files"]
      },
      price: {
        type: "string"
      },
      badge: {
        type: "string"
      },
      features: {
        type: "component",
        component: "elements.highlights",
        repeatable: true
      },
      ctaButton: {
        type: "component",
        component: "elements.cta-button"
      },
      variant: {
        type: "enumeration",
        enum: ["service", "testimonial", "pricing", "benefit"],
        default: "service"
      }
    }
  },

  'src/components/elements/image.json': {
    collectionName: "components_elements_images",
    info: {
      displayName: "image",
      description: "Image with alt text and caption support"
    },
    options: {},
    attributes: {
      media: {
        type: "media",
        multiple: false,
        allowedTypes: ["images"],
        required: true
      },
      alt: {
        type: "string",
        required: true,
        description: "Alternative text for accessibility"
      },
      title: {
        type: "string",
        description: "Image title attribute"
      },
      caption: {
        type: "string",
        description: "Image caption to display"
      },
      lazyLoad: {
        type: "boolean",
        default: true
      },
      link: {
        type: "string",
        description: "Optional link URL"
      }
    }
  },

  'src/components/elements/product-image.json': {
    collectionName: "components_elements_product_images",
    info: {
      displayName: "productImage",
      description: "Specialized image component for chocolate products"
    },
    options: {},
    attributes: {
      image: {
        type: "media",
        allowedTypes: ["images"],
        required: true
      },
      alt: {
        type: "string",
        required: true,
        default: "Handcrafted chocolate by DeliceMy"
      },
      angle: {
        type: "enumeration",
        enum: ["front", "side", "detail", "packaging", "ingredient"],
        default: "front"
      },
      isPrimary: {
        type: "boolean",
        default: false
      }
    }
  },

  'src/components/elements/faq-item.json': {
    collectionName: "components_elements_faq_items",
    info: {
      displayName: "faqItem",
      description: "Single FAQ question and answer"
    },
    options: {},
    attributes: {
      question: {
        type: "string",
        required: true
      },
      answer: {
        type: "blocks",
        required: true
      }
    }
  },

  'src/components/elements/form-field.json': {
    collectionName: "components_elements_form_fields",
    info: {
      displayName: "formField",
      description: "Dynamic form field configuration"
    },
    options: {},
    attributes: {
      label: {
        type: "string",
        required: true
      },
      name: {
        type: "string",
        required: true
      },
      type: {
        type: "enumeration",
        enum: ["text", "email", "tel", "textarea", "select", "checkbox"],
        default: "text"
      },
      placeholder: {
        type: "string"
      },
      required: {
        type: "boolean",
        default: false
      },
      options: {
        type: "json",
        description: "Options for select fields"
      }
    }
  },

  // SEO Component
  'src/components/seo/meta-data.json': {
    collectionName: "components_seo_meta_data",
    info: {
      displayName: "metaData",
      description: "SEO metadata for pages"
    },
    options: {},
    attributes: {
      metaTitle: {
        type: "string",
        required: true,
        maxLength: 60
      },
      metaDescription: {
        type: "text",
        maxLength: 160
      },
      metaImage: {
        type: "media",
        multiple: false,
        allowedTypes: ["images"]
      },
      keywords: {
        type: "text"
      },
      structuredData: {
        type: "json"
      },
      canonicalURL: {
        type: "string"
      },
      robots: {
        type: "string",
        default: "index, follow"
      }
    }
  },

  // New Section Components
  'src/components/sections/gallery.json': {
    collectionName: "components_sections_galleries",
    info: {
      displayName: "gallery",
      description: "Image gallery section"
    },
    options: {},
    attributes: {
      header: {
        type: "component",
        component: "elements.section-header"
      },
      images: {
        type: "component",
        component: "elements.image",
        repeatable: true,
        max: 12
      },
      layout: {
        type: "enumeration",
        enum: ["grid", "masonry", "carousel", "lightbox"],
        default: "grid"
      },
      columns: {
        type: "integer",
        default: 3,
        min: 1,
        max: 6
      }
    }
  },

  'src/components/sections/faq.json': {
    collectionName: "components_sections_faqs",
    info: {
      displayName: "faq",
      description: "Frequently asked questions section"
    },
    options: {},
    attributes: {
      header: {
        type: "component",
        component: "elements.section-header"
      },
      questions: {
        type: "component",
        component: "elements.faq-item",
        repeatable: true
      }
    }
  },

  'src/components/sections/contact-form.json': {
    collectionName: "components_sections_contact_forms",
    info: {
      displayName: "contactForm",
      description: "Contact form section with customizable fields"
    },
    options: {},
    attributes: {
      header: {
        type: "component",
        component: "elements.section-header"
      },
      fields: {
        type: "component",
        component: "elements.form-field",
        repeatable: true
      },
      submitButton: {
        type: "component",
        component: "elements.cta-button"
      },
      successMessage: {
        type: "string",
        default: "Thank you for your message! We'll get back to you soon."
      },
      recipientEmail: {
        type: "email"
      }
    }
  }
};

// Updated section components (using new section-header)
const updatedSections = {
  'src/components/sections/hero.json': {
    collectionName: "components_sections_heroes",
    info: {
      displayName: "hero"
    },
    options: {},
    attributes: {
      header: {
        type: "component",
        component: "elements.section-header",
        required: true
      },
      personName: {
        type: "string"
      },
      role: {
        type: "string"
      },
      background: {
        type: "component",
        component: "elements.image",
        required: true
      },
      ctaButton: {
        type: "component",
        component: "elements.cta-button",
        repeatable: false,
        required: true
      }
    }
  },

  'src/components/sections/services.json': {
    collectionName: "components_sections_services",
    info: {
      displayName: "services"
    },
    options: {},
    attributes: {
      header: {
        type: "component",
        component: "elements.section-header",
        required: true
      },
      cardItem: {
        type: "component",
        component: "elements.card-item",
        repeatable: true,
        required: true
      }
    }
  },

  'src/components/sections/benefits.json': {
    collectionName: "components_sections_benefits",
    info: {
      displayName: "benefits"
    },
    options: {},
    attributes: {
      header: {
        type: "component",
        component: "elements.section-header"
      },
      cardItem: {
        type: "component",
        component: "elements.card-item",
        repeatable: true
      }
    }
  },

  'src/components/sections/testimonials.json': {
    collectionName: "components_sections_testimonials",
    info: {
      displayName: "testimonials"
    },
    options: {},
    attributes: {
      header: {
        type: "component",
        component: "elements.section-header"
      },
      cardItem: {
        type: "component",
        component: "elements.card-item",
        repeatable: true
      }
    }
  },

  'src/components/sections/about.json': {
    collectionName: "components_sections_abouts",
    info: {
      displayName: "about"
    },
    options: {},
    attributes: {
      header: {
        type: "component",
        component: "elements.section-header"
      },
      intro: {
        type: "blocks"
      },
      listItem: {
        type: "component",
        component: "elements.highlights",
        repeatable: true
      },
      portrait: {
        type: "component",
        component: "elements.image"
      },
      ctaButton: {
        type: "component",
        component: "elements.cta-button",
        repeatable: false
      }
    }
  },

  'src/components/sections/mission.json': {
    collectionName: "components_sections_missions",
    info: {
      displayName: "mission"
    },
    options: {},
    attributes: {
      header: {
        type: "component",
        component: "elements.section-header"
      },
      description: {
        type: "blocks"
      },
      background: {
        type: "component",
        component: "elements.image",
        required: true
      },
      ctaButton: {
        type: "component",
        component: "elements.cta-button",
        repeatable: false
      }
    }
  },

  'src/components/sections/cta-banner.json': {
    collectionName: "components_sections_cta_banners",
    info: {
      displayName: "ctaBanner"
    },
    options: {},
    attributes: {
      header: {
        type: "component",
        component: "elements.section-header"
      },
      portrait: {
        type: "component",
        component: "elements.image"
      },
      signature: {
        type: "media",
        multiple: false,
        allowedTypes: ["images"]
      },
      background: {
        type: "component",
        component: "elements.image"
      },
      ctaButton: {
        type: "component",
        component: "elements.cta-button",
        repeatable: false
      }
    }
  },

  'src/components/sections/tariffs.json': {
    collectionName: "components_sections_tariffs",
    info: {
      displayName: "tariffs"
    },
    options: {},
    attributes: {
      header: {
        type: "component",
        component: "elements.section-header"
      },
      items: {
        type: "component",
        component: "elements.card-item",
        repeatable: true
      }
    }
  }
};

// New Content Types
const contentTypes = {
  'src/api/product/content-types/product/schema.json': {
    kind: "collectionType",
    collectionName: "products",
    info: {
      singularName: "product",
      pluralName: "products",
      displayName: "Product",
      description: "Chocolate products catalog"
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
      name: {
        type: "string",
        required: true,
        pluginOptions: {
          i18n: {
            localized: true
          }
        }
      },
      slug: {
        type: "uid",
        targetField: "name"
      },
      description: {
        type: "blocks",
        pluginOptions: {
          i18n: {
            localized: true
          }
        }
      },
      images: {
        type: "component",
        component: "elements.product-image",
        repeatable: true,
        max: 5
      },
      price: {
        type: "decimal",
        required: true
      },
      currency: {
        type: "string",
        default: "MDL"
      },
      category: {
        type: "relation",
        relation: "manyToOne",
        target: "api::category.category"
      },
      ingredients: {
        type: "json",
        pluginOptions: {
          i18n: {
            localized: true
          }
        }
      },
      allergens: {
        type: "text",
        pluginOptions: {
          i18n: {
            localized: true
          }
        }
      },
      weight: {
        type: "string"
      },
      availability: {
        type: "boolean",
        default: true
      },
      featured: {
        type: "boolean",
        default: false
      },
      seo: {
        type: "component",
        component: "seo.meta-data",
        pluginOptions: {
          i18n: {
            localized: true
          }
        }
      }
    }
  },

  'src/api/category/content-types/category/schema.json': {
    kind: "collectionType",
    collectionName: "categories",
    info: {
      singularName: "category",
      pluralName: "categories",
      displayName: "Category",
      description: "Product categories"
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
      name: {
        type: "string",
        required: true,
        pluginOptions: {
          i18n: {
            localized: true
          }
        }
      },
      slug: {
        type: "uid",
        targetField: "name"
      },
      description: {
        type: "text",
        pluginOptions: {
          i18n: {
            localized: true
          }
        }
      },
      image: {
        type: "component",
        component: "elements.image"
      },
      products: {
        type: "relation",
        relation: "oneToMany",
        target: "api::product.product",
        mappedBy: "category"
      },
      order: {
        type: "integer",
        default: 0
      }
    }
  },

  'src/api/course/content-types/course/schema.json': {
    kind: "collectionType",
    collectionName: "courses",
    info: {
      singularName: "course",
      pluralName: "courses",
      displayName: "Course",
      description: "Chocolate making courses and workshops"
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
          i18n: {
            localized: true
          }
        }
      },
      slug: {
        type: "uid",
        targetField: "title"
      },
      description: {
        type: "blocks",
        pluginOptions: {
          i18n: {
            localized: true
          }
        }
      },
      duration: {
        type: "string"
      },
      price: {
        type: "decimal",
        required: true
      },
      maxParticipants: {
        type: "integer",
        default: 10
      },
      schedule: {
        type: "json"
      },
      skillLevel: {
        type: "enumeration",
        enum: ["beginner", "intermediate", "advanced"],
        default: "beginner"
      },
      whatYouWillLearn: {
        type: "component",
        component: "elements.highlights",
        repeatable: true
      },
      image: {
        type: "component",
        component: "elements.image"
      },
      gallery: {
        type: "component",
        component: "elements.image",
        repeatable: true,
        max: 6
      },
      seo: {
        type: "component",
        component: "seo.meta-data",
        pluginOptions: {
          i18n: {
            localized: true
          }
        }
      }
    }
  },

  'src/api/page/content-types/page/schema.json': {
    kind: "collectionType",
    collectionName: "pages",
    info: {
      singularName: "page",
      pluralName: "pages",
      displayName: "Page",
      description: "Dynamic pages with flexible sections"
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
          i18n: {
            localized: true
          }
        }
      },
      slug: {
        type: "uid",
        targetField: "title"
      },
      sections: {
        type: "dynamiczone",
        components: [
          "sections.hero",
          "sections.about",
          "sections.services",
          "sections.gallery",
          "sections.testimonials",
          "sections.faq",
          "sections.contact-form",
          "sections.cta-banner",
          "sections.mission",
          "sections.benefits",
          "sections.tariffs"
        ]
      },
      seo: {
        type: "component",
        component: "seo.meta-data",
        pluginOptions: {
          i18n: {
            localized: true
          }
        }
      }
    }
  }
};

// Main execution function
const updateStrapiStructure = async () => {
  console.log(`${colors.blue}🚀 Starting Strapi Structure Update${colors.reset}\n`);

  // Create new components
  console.log(`${colors.blue}📁 Creating new components...${colors.reset}`);
  for (const [filePath, content] of Object.entries(components)) {
    writeJsonFile(filePath, content);
  }

  // Update existing sections
  console.log(`\n${colors.blue}🔄 Updating existing sections...${colors.reset}`);
  for (const [filePath, content] of Object.entries(updatedSections)) {
    backupFile(filePath);
    writeJsonFile(filePath, content);
  }

  // Create content types
  console.log(`\n${colors.blue}📝 Creating content types...${colors.reset}`);
  for (const [filePath, content] of Object.entries(contentTypes)) {
    // Create controller file
    const apiPath = filePath.replace('/schema.json', '');
    const apiName = apiPath.split('/').slice(-2)[0];
    const controllerPath = `${apiPath.replace('/content-types/', '/controllers/')}/${apiName}.js`;
    const routesPath = `${apiPath.replace('/content-types/', '/routes/')}/${apiName}.js`;
    const servicesPath = `${apiPath.replace('/content-types/', '/services/')}/${apiName}.js`;

    // Create content type schema
    writeJsonFile(filePath, content);

    // Create controller
    const controllerContent = `'use strict';

/**
 * ${apiName} controller
 */

const { createCoreController } = require('@strapi/strapi').factories;

module.exports = createCoreController('api::${apiName}.${apiName}');
`;
    ensureDirectoryExists(controllerPath);
    fs.writeFileSync(controllerPath, controllerContent);
    console.log(`${colors.green}✓${colors.reset} Created controller: ${controllerPath}`);

    // Create routes
    const routesContent = `'use strict';

/**
 * ${apiName} router
 */

const { createCoreRouter } = require('@strapi/strapi').factories;

module.exports = createCoreRouter('api::${apiName}.${apiName}');
`;
    ensureDirectoryExists(routesPath);
    fs.writeFileSync(routesPath, routesContent);
    console.log(`${colors.green}✓${colors.reset} Created routes: ${routesPath}`);

    // Create services
    const servicesContent = `'use strict';

/**
 * ${apiName} service
 */

const { createCoreService } = require('@strapi/strapi').factories;

module.exports = createCoreService('api::${apiName}.${apiName}');
`;
    ensureDirectoryExists(servicesPath);
    fs.writeFileSync(servicesPath, servicesContent);
    console.log(`${colors.green}✓${colors.reset} Created service: ${servicesPath}`);
  }

  console.log(`\n${colors.green}✅ Strapi structure update complete!${colors.reset}`);
  console.log(`\n${colors.yellow}⚠️  Next steps:${colors.reset}`);
  console.log('1. Review the changes and backups created');
  console.log('2. Run: npm run build');
  console.log('3. Run: npm run develop');
  console.log('4. Update permissions in Admin Panel for new content types');
  console.log('5. Configure i18n locales if needed');
  console.log(`\n${colors.blue}💡 Remember to commit these changes to git!${colors.reset}`);
};

// Run the script
updateStrapiStructure().catch(error => {
  console.error(`${colors.red}❌ Error:${colors.reset}`, error);
  process.exit(1);
});
