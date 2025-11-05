# Delice Project - Full Stack Overview

## Project Structure

```
my/
├── backend/          # Strapi CMS (Headless Backend)
└── frontend/         # Next.js 15 (Frontend Application)
```

## Backend - Strapi CMS

**Location**: `backend/`
**URL**: https://cms.delice.my
**Tech**: Strapi 5.x, Node.js, PostgreSQL

### Content Types

1. **Product** (Collection) - Chocolate products catalog
2. **Category** (Collection) - Product categories
3. **Course** (Collection) - Chocolate-making courses/workshops
4. **Post** (Collection) - Blog posts
5. **Page** (Collection) - Dynamic pages with flexible sections
6. **Header** (Single Type) - Site header configuration
7. **Footer** (Single Type) - Site footer configuration

### Features
- Multi-language (i18n): English, Romanian, Russian
- Media library with Cloudflare R2 storage
- Draft & Publish workflow
- SEO components
- Dynamic zones for flexible page layouts

## Frontend - Next.js Application

**Location**: `frontend/`
**Tech**: Next.js 15, TypeScript, Tailwind CSS, shadcn/ui

### Pages Structure

All pages support 3 languages (en, ro, ru):

- `/[locale]` - Homepage
- `/[locale]/about` - About Olesea and the company
- `/[locale]/contact` - Contact page
- `/[locale]/services` - Services page
- `/[locale]/school` - Courses listing
- `/[locale]/school/[slug]` - Individual course details
- `/[locale]/shop` - Product catalog (informational only)
- `/[locale]/shop/[slug]` - Individual product details
- `/[locale]/blog` - Blog posts listing
- `/[locale]/blog/[slug]` - Individual blog post

### Key Features

✅ Server-side rendering (SSR)
✅ Multi-language routing (next-intl)
✅ Type-safe Strapi integration
✅ Image optimization
✅ SEO-friendly
✅ Vercel Analytics
✅ Form validation (Zod)
✅ Feature-based architecture

### Tech Stack

- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Components**: shadcn/ui
- **i18n**: next-intl
- **Validation**: Zod
- **Analytics**: Vercel Analytics

## Development

### Backend (Strapi)

```bash
cd backend
npm run develop    # Development mode
npm run build      # Build
npm start          # Production mode
```

### Frontend (Next.js)

```bash
cd frontend
npm run dev        # Development mode (localhost:3000)
npm run build      # Build for production
npm start          # Production mode
```

## Environment Variables

### Backend (.env)
See `backend/.env`

### Frontend (.env.local)
```env
NEXT_PUBLIC_STRAPI_URL=https://cms.delice.my
STRAPI_API_TOKEN=your_token_here
```

## Deployment

### Backend
- Platform: Currently deployed (cms.delice.my)
- Database: PostgreSQL
- Storage: Cloudflare R2

### Frontend
- Platform: Vercel (recommended)
- Domain: TBD
- Build command: `npm run build`
- Output directory: `.next`

## Notes

- **No E-commerce**: Shop is informational only (no cart/checkout/payments)
- **Content-driven**: All content managed through Strapi CMS
- **Server Components**: Frontend uses Server Components by default
- **Static Generation**: Most pages are pre-rendered at build time

## Next Steps

1. ✅ Backend setup complete
2. ✅ Frontend structure created
3. ⏳ Implement page components
4. ⏳ Design & styling
5. ⏳ Content population in Strapi
6. ⏳ Deploy frontend to Vercel
