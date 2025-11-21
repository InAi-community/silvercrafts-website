# Silver Crafts - Next.js Website

A modern, responsive website for Silver Crafts, a premium silver articles manufacturer serving retailers across India.

## 🚀 Tech Stack

- **Framework:** Next.js 14 (App Router)
- **Language:** TypeScript 5.5.3
- **Styling:** Tailwind CSS 3.4.1
- **Animations:** GSAP 3.13.0
- **Icons:** Lucide React 0.344.0
- **Backend:** Supabase JS 2.57.4
- **Fonts:** Raleway (brand), Poppins (body)

## 📁 Project Structure

```
silvercrafts-nextjs/
├── app/                      # Next.js App Router
│   ├── layout.tsx           # Root layout with fonts
│   ├── globals.css          # Global styles
│   ├── AppWrapper.tsx       # Client-side navigation wrapper
│   ├── page.tsx             # Home page
│   └── quotation/
│       └── page.tsx         # Quotation request page
├── src/
│   ├── components/          # Reusable UI components
│   │   ├── Navbar.tsx
│   │   ├── StaggeredMenu.tsx
│   │   ├── BackButton.tsx
│   │   └── Footer.tsx
│   ├── config/
│   │   └── constants.ts     # App-wide constants
│   ├── data/
│   │   └── products.ts      # Product catalog data
│   ├── hooks/
│   │   └── useScrollAnimation.ts
│   └── utils/
│       └── animations.ts    # Animation utilities
├── public/                  # Static assets
│   ├── Products/           # Product images (16 categories)
│   ├── logos/              # Brand and retailer logos
│   ├── Certifications/     # Certification badges
│   └── albums/             # Hero and showcase images
└── next.config.js
```

## 🎨 Features

### Landing Page
- **Hero Section:** Full-screen hero with CTA
- **Factory Showcase:** Dual carousel (desktop) / single (mobile) with 14 images
- **Certifications:** Hallmark, MSME, GJIIE, IBJA, IEC badges
- **Product Categories:** Horizontal scrolling carousel
- **Company Story:** Mission and values
- **Features:** 5 key benefits in reverse pyramid layout
- **Trusted Retailers:** Scrolling logos of major clients
- **CTA:** "Build your quote" button

### Quotation Page
- **Hero:** 3-step process visualization
- **Category Selection:** 16 categories with horizontal carousel
  - Vessels, Lamps, Coins & Bars, Bowl, Boxes, Chombu, Cups, Glass, Kamakshi, Kodam, Others, Panchapathram, Plates, Simil, Trays, Vel
- **Product Catalog:** 76+ products in responsive grid
  - Filter by category
  - "Select All" / "Deselect All" (scoped to filtered products)
  - "Add to Quote" per product
- **Quote Builder:**
  - Fixed cart button with product count
  - Sidebar with selected products
  - Remove items functionality
  - Quote form modal with validation
  - Confirmation modal

### Navigation
- **Dynamic Navbar:** Color changes based on scroll position
- **GSAP Staggered Menu:** Smooth slide-in sidebar
- **Menu Items:** Home, Categories, Get Quote, Contact
- **Login Button:** Placeholder for authentication

### Animations
- **Scroll Animations:** Intersection Observer-based fade-in effects
- **GSAP Transitions:** Smooth menu animations
- **Carousel Animations:** Auto-rotating image carousels
- **Hover Effects:** Interactive product cards

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Installation

```bash
# Install dependencies
npm install

# Run development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Build for Production

```bash
# Create production build
npm run build

# Start production server
npm run start
```

### Other Commands

```bash
# Type checking
npm run typecheck

# Linting
npm run lint
```

## 📦 Product Catalog

The website showcases **76+ products** across **16 categories**:

1. **Vessels** - Traditional silver vessels
2. **Lamps** - Decorative and religious lamps
3. **Coins & Bars** - Investment silver
4. **Bowl** - Various bowl designs
5. **Boxes** - Storage and gift boxes
6. **Chombu** - Water vessels
7. **Cups** - Drinking vessels
8. **Glass** - Tumblers and glasses
9. **Kamakshi** - Special vessels
10. **Kodam** - Large vessels
11. **Others** - Miscellaneous items
12. **Panchapathram** - Religious items
13. **Plates** - Dining plates
14. **Simil** - Traditional items
15. **Trays** - Serving trays
16. **Vel** - Religious spears

## 🎯 Key Functionality

### Quote Builder Workflow
1. Browse products by category
2. Add products to quote
3. Review selected items in cart
4. Fill business details form
5. Submit quotation request
6. Receive confirmation

### Form Fields
- Business Name *
- Your Name *
- Designation *
- Phone Number *
- Email *
- GSTIN (optional)

## 🎨 Design System

### Colors
- **Primary:** `#a8bba3` (Sage green)
- **Primary Hover:** `#93a991`
- **Dark:** `#1A1A1A`
- **Text:** `#1C1C1C`, `#5A5A5A`
- **Border:** `#E8E4DA`
- **Background:** `#FAF9F7`, `#FDFBF7`

### Typography
- **Brand Font:** Raleway (400-800)
- **Body Font:** Poppins (300-800)

### Breakpoints
- **sm:** 640px
- **md:** 768px
- **lg:** 1024px
- **xl:** 1280px
- **2xl:** 1536px

## 🔧 Configuration

### Environment Variables
Create a `.env.local` file for environment-specific configuration:

```env
# Supabase (if using)
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_key
```

### Customization

**Colors:** Edit `src/config/constants.ts`
```typescript
export const COLORS = {
  primary: '#a8bba3',
  primaryHover: '#93a991',
  // ...
}
```

**Timings:** Edit `src/config/constants.ts`
```typescript
export const TIMINGS = {
  imageTransition: 5000,
  carouselResume: 3000,
  // ...
}
```

**Products:** Edit `src/data/products.ts`

## 📱 Responsive Design

- **Mobile First:** Optimized for mobile devices
- **Adaptive Layouts:** Different layouts for mobile, tablet, desktop
- **Touch Friendly:** All interactive elements have min 44px touch targets
- **Smooth Scrolling:** Optimized scroll behavior across devices

## ⚡ Performance

- **Code Splitting:** Automatic chunk optimization
- **Font Optimization:** `next/font` for FOUT/FOIT prevention
- **Lazy Loading:** Images load on demand
- **Static Generation:** Pre-rendered pages for fast loads
- **Tree Shaking:** Minimal bundle sizes

## 🔒 Security

- **Input Validation:** Form validation on client side
- **Type Safety:** Full TypeScript coverage
- **Secure Headers:** Next.js security defaults

## 📞 Contact

- **Email:** info@silvercrafts.in
- **Phone:** +91 98765 43210

## 📄 License

Private - All rights reserved © 2025 Silver Crafts

## 🤝 Contributing

This is a private project. For any issues or suggestions, please contact the development team.

---

**Built with ❤️ using Next.js 14**

