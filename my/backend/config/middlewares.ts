// config/middlewares.ts
export default [
  'strapi::logger',
  'strapi::errors',

  // Keep only the configured security middleware (remove the plain 'strapi::security' string)
  {
    name: 'strapi::security',
    config: {
      contentSecurityPolicy: {
        useDefaults: true,
        directives: {
          // Allow API/AJAX calls to your own origin + HTTPS endpoints (GraphQL, admin, etc.)
          'connect-src': ["'self'", 'https:', 'wss:'],

          // Allow images & media from your CDN (Cloudflare R2 via CDN) + data/blob URIs
          'img-src': ["'self'", 'data:', 'blob:', 'https://cdn.delice.my'],
          'media-src': ["'self'", 'data:', 'blob:', 'https://cdn.delice.my'],

          // If you embed fonts from CDN(s), add 'font-src' similarly
          // 'font-src': ["'self'", 'https:'],

          // Disable auto-upgrade to HTTPS (kept as null to not inject)
          upgradeInsecureRequests: null,
        },
      },
      // Optionally tighten other security headers here
      // crossOriginEmbedderPolicy: true,
      // crossOriginResourcePolicy: { policy: 'same-site' },
    },
  },

  // CORS after security is fine; configure origins via env if needed
  {
  name: 'strapi::cors',
  config: {
    origin: [
      'https://your-vercel-app.vercel.app',
      'https://www.delice.my',
      'https://cms.delice.my'
    ],
    methods: ['GET','POST','PUT','PATCH','DELETE','OPTIONS'],
    headers: '*',
    credentials: true,
  },
},

  'strapi::poweredBy',
  'strapi::query',
  'strapi::body',
  'strapi::session',
  'strapi::favicon',
  'strapi::public',
];

