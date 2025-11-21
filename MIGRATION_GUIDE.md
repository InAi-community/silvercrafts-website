# Vite to Next.js Migration Guide

## Overview

This document outlines the successful migration of the Silver Crafts website from **Vite + React + TypeScript** to **Next.js 14 with App Router**.

## What Changed

### Project Structure

**Before (Vite):**
```
├── src/
│   ├── App.tsx
│   ├── main.tsx
│   ├── index.css
│   ├── pages/
│   │   ├── LandingPage.tsx
│   │   └── QuotationPage.tsx
│   ├── components/
│   ├── config/
│   ├── data/
│   ├── hooks/
│   └── utils/
├── public/
├── index.html
└── vite.config.ts
```

**After (Next.js):**
```
├── app/
│   ├── layout.tsx          # Root layout with fonts
│   ├── globals.css         # Global styles
│   ├── AppWrapper.tsx      # Client-side routing wrapper
│   ├── page.tsx            # Home page (was LandingPage)
│   └── quotation/
│       └── page.tsx        # Quotation page
├── src/
│   ├── components/         # All components (now client components)
│   ├── config/             # Constants (unchanged)
│   ├── data/               # Product data (unchanged)
│   ├── hooks/              # Custom hooks (unchanged)
│   └── utils/              # Utilities (unchanged)
├── public/                 # Static assets (unchanged)
└── next.config.js
```

## Key Changes

### 1. Routing

- **Before:** Client-side state management with `useState` for page switching
- **After:** Next.js App Router with file-based routing
  - `/` → `app/page.tsx` (Landing Page)
  - `/quotation` → `app/quotation/page.tsx` (Quotation Page)

### 2. Components

All components that use browser APIs or React hooks are now **client components** with `'use client'` directive:

- `src/components/Navbar.tsx`
- `src/components/StaggeredMenu.tsx`
- `src/components/BackButton.tsx`
- `src/components/Footer.tsx`
- `app/page.tsx`
- `app/quotation/page.tsx`
- `app/AppWrapper.tsx`

### 3. Fonts

**Before:** Google Fonts loaded via `<link>` in `index.html`

**After:** Next.js `next/font` optimization in `app/layout.tsx`:
```typescript
import { Raleway, Poppins } from 'next/font/google'

const raleway = Raleway({
  subsets: ['latin'],
  variable: '--font-raleway',
  display: 'swap',
  weight: ['400', '500', '600', '700', '800'],
})

const poppins = Poppins({
  subsets: ['latin'],
  variable: '--font-poppins',
  display: 'swap',
  weight: ['300', '400', '500', '600', '700', '800'],
})
```

### 4. Navigation

**Before:** Direct function calls with `onNavigate('home')` or `onNavigate('quote')`

**After:** Next.js `useRouter` from `next/navigation`:
```typescript
import { useRouter } from 'next/navigation';

const router = useRouter();
router.push('/');          // Navigate to home
router.push('/quotation'); // Navigate to quotation
```

### 5. TypeScript Configuration

- Updated `tsconfig.json` for Next.js
- Added path aliases: `@/*` → `./src/*`
- Removed Vite-specific configs (`tsconfig.app.json`, `tsconfig.node.json`)

### 6. Build Configuration

**Before:**
```json
{
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview"
  }
}
```

**After:**
```json
{
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "next lint"
  }
}
```

### 7. ESLint

- Removed old `eslint.config.js`
- Added `.eslintrc.json` with Next.js config:
```json
{
  "extends": ["next/core-web-vitals", "next/typescript"]
}
```

### 8. Tailwind CSS

Updated `tailwind.config.js` for Next.js:
```javascript
module.exports = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './src/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        raleway: ['var(--font-raleway)', 'Raleway', 'sans-serif'],
        poppins: ['var(--font-poppins)', 'Poppins', 'sans-serif'],
      },
    },
  },
}
```

## What Stayed the Same

✅ **All functionality preserved:**
- Product catalog with 76+ products across 16 categories
- Quote builder with cart functionality
- Form submissions and confirmation modals
- Category filtering and "Select All" / "Deselect All"
- Factory image carousels (dual on desktop, single on mobile)
- Scroll animations using Intersection Observer
- GSAP animations for the staggered menu
- All styling, spacing, colors, and responsive behavior

✅ **No changes to:**
- `src/config/constants.ts` - All constants
- `src/data/products.ts` - Product and category data
- `src/hooks/useScrollAnimation.ts` - Custom hooks
- `src/utils/animations.ts` - Animation utilities
- `public/` - All static assets (images, logos, etc.)
- Supabase configuration

## Running the Application

### Development
```bash
npm run dev
```
Visit http://localhost:3000

### Production Build
```bash
npm run build
npm run start
```

### Type Checking
```bash
npm run typecheck
```

### Linting
```bash
npm run lint
```

## Verification Checklist

✅ **Build Success:** `npm run build` completes without errors
✅ **Dev Server:** `npm run dev` runs successfully
✅ **Home Page:** All sections render correctly
✅ **Quotation Page:** Category selection and product grid work
✅ **Navigation:** Routing between pages works
✅ **Animations:** Scroll animations and GSAP menu animations work
✅ **Responsive:** Mobile, tablet, and desktop layouts intact
✅ **Quote Builder:** Cart, form, and confirmation modal functional
✅ **Fonts:** Raleway and Poppins load correctly
✅ **Images:** All static assets load properly

## Performance Improvements

With Next.js, you now get:
- ⚡ **Automatic code splitting** - Smaller initial bundle sizes
- 🖼️ **Optimized font loading** - FOUT/FOIT prevention with `next/font`
- 📦 **Better tree shaking** - Smaller production bundles
- 🚀 **Static generation** - Pre-rendered pages for faster loads
- 🔄 **Incremental Static Regeneration** - Ready for dynamic content
- 🎯 **Built-in optimization** - Automatic image optimization available

## Next Steps (Optional Enhancements)

While the migration is complete and fully functional, you could consider:

1. **Image Optimization:** Replace `<img>` tags with Next.js `<Image>` component for automatic optimization
2. **API Routes:** Move any backend logic to `app/api/` routes
3. **Metadata:** Add dynamic metadata for SEO
4. **Server Components:** Convert non-interactive components to Server Components for better performance
5. **Middleware:** Add authentication or redirects using Next.js middleware

## Troubleshooting

### Issue: GSAP animations not working
**Solution:** Ensure GSAP code runs only on client side (inside `useEffect` or client components with `'use client'`)

### Issue: Fonts not loading
**Solution:** Check that font variables are properly set in `app/layout.tsx` and referenced in `tailwind.config.js`

### Issue: Images not loading
**Solution:** Verify all image paths start with `/` and files exist in `public/` directory

### Issue: Navigation not working
**Solution:** Ensure `useRouter` is imported from `next/navigation` (not `next/router`)

## Migration Summary

- ✅ **Zero functionality loss** - All features work exactly as before
- ✅ **Zero visual changes** - Pixel-perfect design preservation
- ✅ **Improved performance** - Next.js optimizations
- ✅ **Better developer experience** - File-based routing, better TypeScript support
- ✅ **Production ready** - Build succeeds, all pages render correctly

## Files Removed (Vite-specific)

- `vite.config.ts`
- `index.html`
- `src/main.tsx`
- `src/App.tsx`
- `src/index.css`
- `src/pages/LandingPage.tsx`
- `src/pages/QuotationPage.tsx`
- `tsconfig.app.json`
- `tsconfig.node.json`
- `src/vite-env.d.ts`
- `eslint.config.js`

## Files Added (Next.js-specific)

- `next.config.js`
- `next-env.d.ts`
- `.eslintrc.json`
- `app/layout.tsx`
- `app/globals.css`
- `app/AppWrapper.tsx`
- `app/page.tsx`
- `app/quotation/page.tsx`

---

**Migration completed successfully on:** November 21, 2025
**Next.js version:** 14.2.33
**React version:** 18.3.1

