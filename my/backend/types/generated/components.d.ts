import type { Schema, Struct } from '@strapi/strapi';

export interface ElementsCardItem extends Struct.ComponentSchema {
  collectionName: 'components_elements_card_items';
  info: {
    description: 'Versatile card component for services, testimonials, pricing';
    displayName: 'cardItem';
  };
  attributes: {
    accentColor: Schema.Attribute.String &
      Schema.Attribute.SetPluginOptions<{
        i18n: {
          localized: false;
        };
      }>;
    badge: Schema.Attribute.String &
      Schema.Attribute.SetPluginOptions<{
        i18n: {
          localized: true;
        };
      }>;
    ctaButton: Schema.Attribute.Component<'elements.cta-button', false>;
    description: Schema.Attribute.Blocks &
      Schema.Attribute.SetPluginOptions<{
        i18n: {
          localized: true;
        };
      }>;
    features: Schema.Attribute.Component<'elements.highlights', true>;
    gridClass: Schema.Attribute.String &
      Schema.Attribute.SetPluginOptions<{
        i18n: {
          localized: false;
        };
      }>;
    icon: Schema.Attribute.Media<'images' | 'files'>;
    iconName: Schema.Attribute.String &
      Schema.Attribute.SetPluginOptions<{
        i18n: {
          localized: false;
        };
      }>;
    image: Schema.Attribute.Media<'images'>;
    price: Schema.Attribute.String &
      Schema.Attribute.SetPluginOptions<{
        i18n: {
          localized: true;
        };
      }>;
    title: Schema.Attribute.String &
      Schema.Attribute.Required &
      Schema.Attribute.SetPluginOptions<{
        i18n: {
          localized: true;
        };
      }>;
    variant: Schema.Attribute.Enumeration<
      ['service', 'testimonial', 'pricing', 'benefit']
    > &
      Schema.Attribute.DefaultTo<'service'>;
  };
}

export interface ElementsContacts extends Struct.ComponentSchema {
  collectionName: 'components_elements_contacts';
  info: {
    displayName: 'contacts';
  };
  attributes: {
    label: Schema.Attribute.String;
    value: Schema.Attribute.String;
  };
}

export interface ElementsCtaButton extends Struct.ComponentSchema {
  collectionName: 'components_elements_cta_buttons';
  info: {
    description: 'Call-to-action button with optional subtext';
    displayName: 'ctaButton';
  };
  attributes: {
    href: Schema.Attribute.String & Schema.Attribute.Required;
    subtext: Schema.Attribute.String &
      Schema.Attribute.SetPluginOptions<{
        i18n: {
          localized: true;
        };
      }>;
    text: Schema.Attribute.String &
      Schema.Attribute.Required &
      Schema.Attribute.SetPluginOptions<{
        i18n: {
          localized: true;
        };
      }>;
  };
}

export interface ElementsFaqItem extends Struct.ComponentSchema {
  collectionName: 'components_elements_faq_items';
  info: {
    description: 'Single FAQ question and answer';
    displayName: 'faqItem';
  };
  attributes: {
    answer: Schema.Attribute.Blocks &
      Schema.Attribute.Required &
      Schema.Attribute.SetPluginOptions<{
        i18n: {
          localized: true;
        };
      }>;
    question: Schema.Attribute.String &
      Schema.Attribute.Required &
      Schema.Attribute.SetPluginOptions<{
        i18n: {
          localized: true;
        };
      }>;
  };
}

export interface ElementsFormField extends Struct.ComponentSchema {
  collectionName: 'components_elements_form_fields';
  info: {
    description: 'Dynamic form field configuration';
    displayName: 'formField';
  };
  attributes: {
    label: Schema.Attribute.String &
      Schema.Attribute.Required &
      Schema.Attribute.SetPluginOptions<{
        i18n: {
          localized: true;
        };
      }>;
    name: Schema.Attribute.String & Schema.Attribute.Required;
    options: Schema.Attribute.JSON;
    placeholder: Schema.Attribute.String &
      Schema.Attribute.SetPluginOptions<{
        i18n: {
          localized: true;
        };
      }>;
    required: Schema.Attribute.Boolean & Schema.Attribute.DefaultTo<false>;
    type: Schema.Attribute.Enumeration<
      ['text', 'email', 'tel', 'textarea', 'select', 'checkbox']
    > &
      Schema.Attribute.DefaultTo<'text'>;
  };
}

export interface ElementsHighlights extends Struct.ComponentSchema {
  collectionName: 'components_elements_highlights';
  info: {
    description: 'Reusable highlight item with optional title, description, and icon';
    displayName: 'highlights';
  };
  attributes: {
    description: Schema.Attribute.Text &
      Schema.Attribute.SetPluginOptions<{
        i18n: {
          localized: true;
        };
      }>;
    iconName: Schema.Attribute.String;
    text: Schema.Attribute.String &
      Schema.Attribute.SetPluginOptions<{
        i18n: {
          localized: true;
        };
      }>;
    title: Schema.Attribute.String &
      Schema.Attribute.SetPluginOptions<{
        i18n: {
          localized: true;
        };
      }>;
  };
}

export interface ElementsImage extends Struct.ComponentSchema {
  collectionName: 'components_elements_images';
  info: {
    description: 'Image with alt text and caption support';
    displayName: 'image';
  };
  attributes: {
    alt: Schema.Attribute.String &
      Schema.Attribute.Required &
      Schema.Attribute.SetPluginOptions<{
        i18n: {
          localized: true;
        };
      }>;
    caption: Schema.Attribute.String &
      Schema.Attribute.SetPluginOptions<{
        i18n: {
          localized: true;
        };
      }>;
    category: Schema.Attribute.String &
      Schema.Attribute.SetPluginOptions<{
        i18n: {
          localized: true;
        };
      }>;
    lazyLoad: Schema.Attribute.Boolean & Schema.Attribute.DefaultTo<true>;
    link: Schema.Attribute.String;
    media: Schema.Attribute.Media<'images'> & Schema.Attribute.Required;
    title: Schema.Attribute.String &
      Schema.Attribute.SetPluginOptions<{
        i18n: {
          localized: true;
        };
      }>;
  };
}

export interface ElementsLegalLinks extends Struct.ComponentSchema {
  collectionName: 'components_elements_legal_links';
  info: {
    displayName: 'legalLinks';
  };
  attributes: {
    label: Schema.Attribute.String;
    newTab: Schema.Attribute.Boolean & Schema.Attribute.DefaultTo<true>;
    url: Schema.Attribute.String;
  };
}

export interface ElementsLink extends Struct.ComponentSchema {
  collectionName: 'components_elements_links';
  info: {
    description: 'Simple link with label and href';
    displayName: 'link';
  };
  attributes: {
    href: Schema.Attribute.String & Schema.Attribute.Required;
    label: Schema.Attribute.String &
      Schema.Attribute.Required &
      Schema.Attribute.SetPluginOptions<{
        i18n: {
          localized: true;
        };
      }>;
  };
}

export interface ElementsProductImage extends Struct.ComponentSchema {
  collectionName: 'components_elements_product_images';
  info: {
    description: 'Specialized image component for chocolate products';
    displayName: 'productImage';
  };
  attributes: {
    alt: Schema.Attribute.String &
      Schema.Attribute.Required &
      Schema.Attribute.DefaultTo<'Handcrafted chocolate by DeliceMy'>;
    angle: Schema.Attribute.Enumeration<
      ['front', 'side', 'detail', 'packaging', 'ingredient']
    > &
      Schema.Attribute.DefaultTo<'front'>;
    image: Schema.Attribute.Media<'images'> & Schema.Attribute.Required;
    isPrimary: Schema.Attribute.Boolean & Schema.Attribute.DefaultTo<false>;
  };
}

export interface ElementsSectionHeader extends Struct.ComponentSchema {
  collectionName: 'components_elements_section_headers';
  info: {
    description: 'Reusable section header with kicker, title, and subtitle';
    displayName: 'sectionHeader';
  };
  attributes: {
    alignment: Schema.Attribute.Enumeration<['left', 'center', 'right']> &
      Schema.Attribute.DefaultTo<'center'>;
    kicker: Schema.Attribute.String &
      Schema.Attribute.SetPluginOptions<{
        i18n: {
          localized: true;
        };
      }>;
    subtitle: Schema.Attribute.String &
      Schema.Attribute.SetPluginOptions<{
        i18n: {
          localized: true;
        };
      }>;
    title: Schema.Attribute.String &
      Schema.Attribute.Required &
      Schema.Attribute.SetPluginOptions<{
        i18n: {
          localized: true;
        };
      }>;
  };
}

export interface ElementsSocialLink extends Struct.ComponentSchema {
  collectionName: 'components_elements_social_links';
  info: {
    displayName: 'socialLink';
  };
  attributes: {
    icon: Schema.Attribute.Media<'images'>;
    platform: Schema.Attribute.String;
    url: Schema.Attribute.String;
  };
}

export interface ElementsStat extends Struct.ComponentSchema {
  collectionName: 'components_elements_stats';
  info: {
    description: 'Statistics display with number and label';
    displayName: 'stat';
  };
  attributes: {
    label: Schema.Attribute.String &
      Schema.Attribute.Required &
      Schema.Attribute.SetPluginOptions<{
        i18n: {
          localized: true;
        };
      }>;
    number: Schema.Attribute.String &
      Schema.Attribute.Required &
      Schema.Attribute.SetPluginOptions<{
        i18n: {
          localized: true;
        };
      }>;
  };
}

export interface FooterContactInfo extends Struct.ComponentSchema {
  collectionName: 'components_footer_contact_infos';
  info: {
    description: 'Contact information section';
    displayName: 'contactInfo';
  };
  attributes: {
    address: Schema.Attribute.Text &
      Schema.Attribute.SetPluginOptions<{
        i18n: {
          localized: true;
        };
      }>;
    email: Schema.Attribute.Email;
    hours: Schema.Attribute.String &
      Schema.Attribute.SetPluginOptions<{
        i18n: {
          localized: true;
        };
      }>;
    phone: Schema.Attribute.String;
    title: Schema.Attribute.String &
      Schema.Attribute.SetPluginOptions<{
        i18n: {
          localized: true;
        };
      }>;
  };
}

export interface FooterCopyright extends Struct.ComponentSchema {
  collectionName: 'components_footer_copyrights';
  info: {
    description: 'Copyright information';
    displayName: 'copyright';
  };
  attributes: {
    companyName: Schema.Attribute.String &
      Schema.Attribute.SetPluginOptions<{
        i18n: {
          localized: true;
        };
      }>;
    locationText: Schema.Attribute.String &
      Schema.Attribute.SetPluginOptions<{
        i18n: {
          localized: true;
        };
      }>;
    madeWithText: Schema.Attribute.String &
      Schema.Attribute.SetPluginOptions<{
        i18n: {
          localized: true;
        };
      }>;
    rightsText: Schema.Attribute.String &
      Schema.Attribute.SetPluginOptions<{
        i18n: {
          localized: true;
        };
      }>;
  };
}

export interface FooterNavigationSection extends Struct.ComponentSchema {
  collectionName: 'components_footer_navigation_sections';
  info: {
    description: 'Navigation section with title and links';
    displayName: 'navigationSection';
  };
  attributes: {
    links: Schema.Attribute.Component<'elements.link', true>;
    title: Schema.Attribute.String &
      Schema.Attribute.SetPluginOptions<{
        i18n: {
          localized: true;
        };
      }>;
  };
}

export interface FooterNewsletter extends Struct.ComponentSchema {
  collectionName: 'components_footer_newsletters';
  info: {
    description: 'Newsletter subscription section';
    displayName: 'newsletter';
  };
  attributes: {
    buttonText: Schema.Attribute.String &
      Schema.Attribute.SetPluginOptions<{
        i18n: {
          localized: true;
        };
      }>;
    description: Schema.Attribute.Text &
      Schema.Attribute.SetPluginOptions<{
        i18n: {
          localized: true;
        };
      }>;
    placeholder: Schema.Attribute.String &
      Schema.Attribute.SetPluginOptions<{
        i18n: {
          localized: true;
        };
      }>;
    successMessage: Schema.Attribute.String &
      Schema.Attribute.SetPluginOptions<{
        i18n: {
          localized: true;
        };
      }>;
    title: Schema.Attribute.String &
      Schema.Attribute.SetPluginOptions<{
        i18n: {
          localized: true;
        };
      }>;
  };
}

export interface FooterSocialLink extends Struct.ComponentSchema {
  collectionName: 'components_footer_social_links';
  info: {
    description: 'Social media link with icon';
    displayName: 'socialLink';
  };
  attributes: {
    href: Schema.Attribute.String & Schema.Attribute.Required;
    iconName: Schema.Attribute.String & Schema.Attribute.Required;
    label: Schema.Attribute.String & Schema.Attribute.Required;
  };
}

export interface NavigationMenuItems extends Struct.ComponentSchema {
  collectionName: 'components_navigation_menu_items';
  info: {
    displayName: 'menuItems';
  };
  attributes: {
    href: Schema.Attribute.String;
    isActive: Schema.Attribute.Boolean & Schema.Attribute.DefaultTo<false>;
    label: Schema.Attribute.String;
  };
}

export interface SectionsAbout extends Struct.ComponentSchema {
  collectionName: 'components_sections_abouts';
  info: {
    description: 'About section with person details, stats, and highlights';
    displayName: 'about';
  };
  attributes: {
    ctaButton: Schema.Attribute.Component<'elements.cta-button', false>;
    header: Schema.Attribute.Component<'elements.section-header', false>;
    highlight: Schema.Attribute.Text &
      Schema.Attribute.SetPluginOptions<{
        i18n: {
          localized: true;
        };
      }>;
    intro: Schema.Attribute.Blocks;
    listItem: Schema.Attribute.Component<'elements.highlights', true>;
    personName: Schema.Attribute.String &
      Schema.Attribute.SetPluginOptions<{
        i18n: {
          localized: true;
        };
      }>;
    portrait: Schema.Attribute.Component<'elements.image', false>;
    role: Schema.Attribute.String &
      Schema.Attribute.SetPluginOptions<{
        i18n: {
          localized: true;
        };
      }>;
    roleSubtitle: Schema.Attribute.String &
      Schema.Attribute.SetPluginOptions<{
        i18n: {
          localized: true;
        };
      }>;
    stats: Schema.Attribute.Component<'elements.stat', true>;
  };
}

export interface SectionsBanner extends Struct.ComponentSchema {
  collectionName: 'components_sections_banners';
  info: {
    description: 'Flexible banner section for CTAs and mission statements';
    displayName: 'banner';
  };
  attributes: {
    background: Schema.Attribute.Component<'elements.image', false>;
    contactAddress: Schema.Attribute.String &
      Schema.Attribute.SetPluginOptions<{
        i18n: {
          localized: true;
        };
      }>;
    contactEmail: Schema.Attribute.Email;
    contactPhone: Schema.Attribute.String;
    ctaButtons: Schema.Attribute.Component<'elements.cta-button', true> &
      Schema.Attribute.SetMinMax<
        {
          max: 2;
        },
        number
      >;
    description: Schema.Attribute.Blocks &
      Schema.Attribute.SetPluginOptions<{
        i18n: {
          localized: true;
        };
      }>;
    foregroundImage: Schema.Attribute.Component<'elements.image', false>;
    header: Schema.Attribute.Component<'elements.section-header', false> &
      Schema.Attribute.SetPluginOptions<{
        i18n: {
          localized: true;
        };
      }>;
    layout: Schema.Attribute.Enumeration<['left', 'center', 'right', 'split']> &
      Schema.Attribute.DefaultTo<'center'>;
    mascotQuote: Schema.Attribute.Text &
      Schema.Attribute.SetPluginOptions<{
        i18n: {
          localized: true;
        };
      }>;
    signature: Schema.Attribute.Media<'images'>;
    theme: Schema.Attribute.Enumeration<
      ['light', 'dark', 'primary', 'secondary']
    > &
      Schema.Attribute.DefaultTo<'light'>;
    variant: Schema.Attribute.Enumeration<
      ['cta', 'mission', 'hero', 'announcement']
    > &
      Schema.Attribute.DefaultTo<'cta'>;
  };
}

export interface SectionsBenefits extends Struct.ComponentSchema {
  collectionName: 'components_sections_benefits';
  info: {
    displayName: 'benefits';
  };
  attributes: {
    header: Schema.Attribute.Component<'elements.section-header', false>;
    items: Schema.Attribute.Component<'elements.card-item', true>;
  };
}

export interface SectionsContactForm extends Struct.ComponentSchema {
  collectionName: 'components_sections_contact_forms';
  info: {
    description: 'Contact form section with customizable fields';
    displayName: 'contactForm';
  };
  attributes: {
    consentText: Schema.Attribute.String &
      Schema.Attribute.SetPluginOptions<{
        i18n: {
          localized: true;
        };
      }> &
      Schema.Attribute.DefaultTo<'I agree to the processing of my personal data'>;
    enableHoneypot: Schema.Attribute.Boolean & Schema.Attribute.DefaultTo<true>;
    fields: Schema.Attribute.Component<'elements.form-field', true>;
    header: Schema.Attribute.Component<'elements.section-header', false>;
    privacyPolicyLink: Schema.Attribute.String;
    recipientEmail: Schema.Attribute.Email;
    submitButton: Schema.Attribute.Component<'elements.cta-button', false>;
    successMessage: Schema.Attribute.String &
      Schema.Attribute.SetPluginOptions<{
        i18n: {
          localized: true;
        };
      }> &
      Schema.Attribute.DefaultTo<"Thank you for your message! We'll get back to you soon.">;
  };
}

export interface SectionsFaq extends Struct.ComponentSchema {
  collectionName: 'components_sections_faqs';
  info: {
    description: 'Frequently asked questions section';
    displayName: 'faq';
  };
  attributes: {
    header: Schema.Attribute.Component<'elements.section-header', false>;
    questions: Schema.Attribute.Component<'elements.faq-item', true>;
  };
}

export interface SectionsGallery extends Struct.ComponentSchema {
  collectionName: 'components_sections_galleries';
  info: {
    description: 'Image gallery section';
    displayName: 'gallery';
  };
  attributes: {
    columns: Schema.Attribute.Integer &
      Schema.Attribute.SetMinMax<
        {
          max: 6;
          min: 1;
        },
        number
      > &
      Schema.Attribute.DefaultTo<3>;
    header: Schema.Attribute.Component<'elements.section-header', false>;
    images: Schema.Attribute.Component<'elements.image', true> &
      Schema.Attribute.SetMinMax<
        {
          max: 12;
        },
        number
      >;
    layout: Schema.Attribute.Enumeration<
      ['grid', 'masonry', 'carousel', 'lightbox']
    > &
      Schema.Attribute.DefaultTo<'grid'>;
  };
}

export interface SectionsHero extends Struct.ComponentSchema {
  collectionName: 'components_sections_heroes';
  info: {
    displayName: 'hero';
  };
  attributes: {
    background: Schema.Attribute.Component<'elements.image', false> &
      Schema.Attribute.Required;
    ctaButton: Schema.Attribute.Component<'elements.cta-button', false> &
      Schema.Attribute.Required;
    header: Schema.Attribute.Component<'elements.section-header', false> &
      Schema.Attribute.Required;
    personName: Schema.Attribute.String;
    role: Schema.Attribute.String;
  };
}

export interface SectionsServices extends Struct.ComponentSchema {
  collectionName: 'components_sections_services';
  info: {
    displayName: 'services';
  };
  attributes: {
    header: Schema.Attribute.Component<'elements.section-header', false> &
      Schema.Attribute.Required;
    items: Schema.Attribute.Component<'elements.card-item', true> &
      Schema.Attribute.Required;
  };
}

export interface SectionsTariffs extends Struct.ComponentSchema {
  collectionName: 'components_sections_tariffs';
  info: {
    displayName: 'tariffs';
  };
  attributes: {
    header: Schema.Attribute.Component<'elements.section-header', false>;
    items: Schema.Attribute.Component<'elements.card-item', true>;
  };
}

export interface SectionsTestimonials extends Struct.ComponentSchema {
  collectionName: 'components_sections_testimonials';
  info: {
    displayName: 'testimonials';
  };
  attributes: {
    header: Schema.Attribute.Component<'elements.section-header', false>;
    items: Schema.Attribute.Component<'elements.card-item', true>;
  };
}

export interface SeoMetaData extends Struct.ComponentSchema {
  collectionName: 'components_seo_meta_data';
  info: {
    description: 'SEO metadata for pages';
    displayName: 'metaData';
  };
  attributes: {
    canonicalURL: Schema.Attribute.String;
    keywords: Schema.Attribute.Text;
    metaDescription: Schema.Attribute.Text &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 160;
      }>;
    metaImage: Schema.Attribute.Media<'images'>;
    metaTitle: Schema.Attribute.String &
      Schema.Attribute.Required &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 60;
      }>;
    robots: Schema.Attribute.String &
      Schema.Attribute.DefaultTo<'index, follow'>;
    structuredData: Schema.Attribute.JSON;
  };
}

declare module '@strapi/strapi' {
  export module Public {
    export interface ComponentSchemas {
      'elements.card-item': ElementsCardItem;
      'elements.contacts': ElementsContacts;
      'elements.cta-button': ElementsCtaButton;
      'elements.faq-item': ElementsFaqItem;
      'elements.form-field': ElementsFormField;
      'elements.highlights': ElementsHighlights;
      'elements.image': ElementsImage;
      'elements.legal-links': ElementsLegalLinks;
      'elements.link': ElementsLink;
      'elements.product-image': ElementsProductImage;
      'elements.section-header': ElementsSectionHeader;
      'elements.social-link': ElementsSocialLink;
      'elements.stat': ElementsStat;
      'footer.contact-info': FooterContactInfo;
      'footer.copyright': FooterCopyright;
      'footer.navigation-section': FooterNavigationSection;
      'footer.newsletter': FooterNewsletter;
      'footer.social-link': FooterSocialLink;
      'navigation.menu-items': NavigationMenuItems;
      'sections.about': SectionsAbout;
      'sections.banner': SectionsBanner;
      'sections.benefits': SectionsBenefits;
      'sections.contact-form': SectionsContactForm;
      'sections.faq': SectionsFaq;
      'sections.gallery': SectionsGallery;
      'sections.hero': SectionsHero;
      'sections.services': SectionsServices;
      'sections.tariffs': SectionsTariffs;
      'sections.testimonials': SectionsTestimonials;
      'seo.meta-data': SeoMetaData;
    }
  }
}
