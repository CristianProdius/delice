import type { Core } from '@strapi/strapi';

export default {
  /**
   * An asynchronous register function that runs before
   * your application is initialized.
   *
   * This gives you an opportunity to extend code.
   */
  register(/* { strapi }: { strapi: Core.Strapi } */) {},

  /**
   * An asynchronous bootstrap function that runs before
   * your application gets started.
   *
   * This gives you an opportunity to set up your data model,
   * run jobs, or perform some special logic.
   */
  bootstrap({ strapi }: { strapi: Core.Strapi }) {
    // Override email send function to add logging
    const originalSend = strapi.plugin('email').service('email').send;

    strapi.plugin('email').service('email').send = async (options: any) => {
      console.log('📧 Sending email:', {
        to: options.to,
        subject: options.subject,
        timestamp: new Date().toISOString(),
      });

      try {
        const result = await originalSend(options);
        console.log('✅ Email sent successfully');
        return result;
      } catch (error) {
        console.error('❌ Email failed:', error);
        throw error;
      }
    };
  },
};
