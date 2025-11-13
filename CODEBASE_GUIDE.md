# Silver Crafts Website - Codebase Guide

## 📁 Project Structure

```
project/
├── src/
│   ├── config/
│   │   └── constants.ts          # Application-wide constants and configuration
│   ├── hooks/
│   │   └── useScrollAnimation.ts  # Custom hook for scroll animations
│   ├── utils/
│   │   └── animations.ts          # Animation utility functions
│   ├── components/
│   │   ├── Navbar.tsx             # Main navigation component
│   │   ├── StaggeredMenu.tsx      # Sidebar menu component (GSAP powered)
│   │   ├── BackButton.tsx         # Back navigation button
│   │   └── Footer.tsx             # Footer component
│   ├── pages/
│   │   ├── LandingPage.tsx        # Home page
│   │   └── QuotationPage.tsx      # Quote request page
│   ├── data/
│   │   └── products.ts            # Product and category data
│   ├── App.tsx                    # Main app component with routing
│   ├── main.tsx                   # Application entry point
│   └── index.css                  # Global styles
├── public/
│   ├── Products/                  # Product category images (16 folders)
│   ├── Factory images/            # Factory showcase images
│   ├── Home page carousel/        # Landing page carousel images
│   ├── logos/                     # Brand and retailer logos
│   ├── Certifications/            # Certification badges
│   └── albums/                    # Additional images
└── package.json
```

## 🎨 Design System

### Color Palette
All colors are centralized in `src/config/constants.ts`:

```typescript
{
  primary: '#C06014',      // Beige/Brown - Main brand color
  primaryHover: '#a95311', // Darker beige - Hover states
  dark: '#1A1A1A',         // Dark text
  darkGray: '#1C1C1C',     // Section headings
  mediumGray: '#5A5A5A',   // Body text
  lightGray: '#86837D',    // Muted text
  border: '#E8E4DA',       // Borders
  bgLight: '#FAF9F7',      // Light background
  bgLighter: '#FDFBF7',    // Lighter background
  white: '#FFFFFF'
}
```

### Typography
- **Primary Font**: System default
- **Brand Font**: Raleway (Google Fonts) - Used only for "Silver Crafts" brand name

## 🔧 Key Features

### 1. Dynamic Navigation
- **File**: `src/components/Navbar.tsx`
- Changes color based on scroll position and page
- White logo on dark sections, beige on light sections
- Smooth scroll animations

### 2. Product Catalog
- **File**: `src/pages/QuotationPage.tsx`
- 16 categories with 76+ products
- Category carousel with auto-scroll
- Product filtering by category
- Interactive quote builder

### 3. Scroll Animations
- **Hook**: `src/hooks/useScrollAnimation.ts`
- **Utilities**: `src/utils/animations.ts`
- Intersection Observer based
- Elements animate when entering viewport
- Staggered child animations

### 4. Factory Showcase
- **Component**: `LandingPage.tsx` (second section)
- Split-screen alternating image carousel
- 15 factory images cycling every 3 seconds
- Smooth fade transitions

## 📝 Configuration Files

### `src/config/constants.ts`
Central configuration for:
- **COLORS**: Brand color palette
- **TIMINGS**: Animation and transition durations
- **CAROUSEL_CONFIG**: Carousel scroll behavior
- **ANIMATION_CONFIG**: Intersection Observer settings
- **RETAILER_LOGOS**: Client logo data
- **FACTORY_IMAGES**: Factory image paths
- **HOME_CAROUSEL_IMAGES**: Landing page carousel
- **CERTIFICATIONS**: Certification badge data
- **FEATURES**: "Why Choose Us" features
- **QUOTE_STEPS**: Quote process steps

### Benefits of Centralized Config
1. **Easy Updates**: Change timings/colors in one place
2. **Consistency**: Reuse across components
3. **Type Safety**: TypeScript const assertions
4. **Documentation**: Single source of truth

## 🔄 State Management

### Landing Page State
```typescript
- leftImageIndex: number    // Factory carousel left image
- rightImageIndex: number   // Factory carousel right image
```

### Quotation Page State
```typescript
- selectedCategory: string        // Currently selected category
- isCarouselPaused: boolean      // Category carousel pause state
- quoteItems: QuoteItem[]        // Items in quote basket
- showSidebar: boolean           // Quote summary sidebar visibility
- showQuoteForm: boolean         // Quote form modal visibility
- showConfirmation: boolean      // Confirmation modal visibility
- formData: FormData             // Quote request form data
```

## 🎯 Data Structure

### Product Interface
```typescript
interface Product {
  id: string;           // Unique identifier (e.g., 'v1', 'l2')
  name: string;         // Product name
  category: string;     // Category ID
  image: string;        // Path to product image
  weightRange: string;  // Weight range (e.g., '150-300g')
}
```

### Category Interface
```typescript
interface Category {
  id: string;      // Unique identifier (e.g., 'vessels', 'lamps')
  name: string;    // Display name
  image: string;   // Representative category image
}
```

## 🛠️ Common Tasks

### Adding a New Product
1. Add product image to `public/Products/[CategoryFolder]/`
2. Add product entry in `src/data/products.ts`:
   ```typescript
   {
     id: 'unique_id',
     name: 'Product Name',
     category: 'category_id',
     image: '/Products/Category/image.jpg',
     weightRange: '100-200g'
   }
   ```

### Adding a New Category
1. Create folder in `public/Products/[NewCategory]/`
2. Add category in `src/data/products.ts`:
   ```typescript
   {
     id: 'new_category',
     name: 'Display Name',
     image: '/Products/NewCategory/representative.jpg'
   }
   ```
3. Add products with `category: 'new_category'`

### Changing Brand Colors
Edit `src/config/constants.ts`:
```typescript
export const COLORS = {
  primary: '#YourColor',
  primaryHover: '#YourHoverColor',
  // ... rest
}
```

### Adjusting Timing
Edit `src/config/constants.ts`:
```typescript
export const TIMINGS = {
  imageTransition: 3000,  // Factory image change duration
  carouselResume: 3000,   // Category carousel resume after interaction
  // ... rest
}
```

## 🎨 Styling Conventions

### Tailwind Classes
- Use semantic color classes: `bg-[#C06014]` for custom colors
- Responsive: `md:text-xl lg:text-2xl`
- Spacing: Follow 4px grid (`p-4`, `m-6`, etc.)

### Animation Classes
- `.animate-on-scroll`: Elements that animate on scroll
- `.animate-fade-in-up`: Fade in from bottom animation
- `.animate-scroll-left`: Horizontal carousel scroll

## 🔍 Debugging

### Development Mode
```bash
npm run dev
```

### Build for Production
```bash
npm run build
```

### Preview Production Build
```bash
npm run preview
```

## 📦 Dependencies

### Core
- **React 18**: UI library
- **TypeScript**: Type safety
- **Vite**: Build tool

### UI & Animation
- **Tailwind CSS**: Utility-first CSS
- **GSAP**: Animation library (for StaggeredMenu)
- **Lucide React**: Icon library

## 🚀 Performance Tips

1. **Images**: All images use lazy loading where appropriate
2. **Memoization**: `useMemo` and `useCallback` prevent unnecessary re-renders
3. **Code Splitting**: React lazy loading ready
4. **Intersection Observer**: Efficient scroll animation detection
5. **RequestAnimationFrame**: Smooth scroll animations

## 📱 Responsive Breakpoints

- **sm**: 640px
- **md**: 768px
- **lg**: 1024px
- **xl**: 1280px
- **2xl**: 1536px

## 🔐 Best Practices

1. **Constants**: Never hardcode colors, timings, or repeated data
2. **Types**: Always define TypeScript interfaces for data structures
3. **Hooks**: Extract reusable logic into custom hooks
4. **Utils**: Shared functions go in `src/utils/`
5. **Comments**: Document complex logic and business requirements
6. **Naming**: Use descriptive, self-documenting names

## 🐛 Common Issues & Solutions

### Issue: Products not showing in "All Categories"
**Solution**: Check `filteredProducts` returns new array reference
```typescript
if (selectedCategory === 'all') {
  return [...products]; // NEW array reference!
}
```

### Issue: Carousel not scrolling
**Solution**: Check z-index and pointer-events
```typescript
// Buttons need higher z-index than carousel
z-50 for buttons, z-1 for carousel container
```

### Issue: Animations not triggering
**Solution**: Ensure elements have `.animate-on-scroll` class and `useScrollAnimation` hook is called

## 📚 Resources

- [React Documentation](https://react.dev/)
- [Tailwind CSS](https://tailwindcss.com/)
- [GSAP](https://greensock.com/gsap/)
- [Lucide Icons](https://lucide.dev/)
- [Vite](https://vitejs.dev/)

## 🤝 Contributing

When making changes:
1. Test on multiple screen sizes
2. Check console for errors
3. Run build before committing
4. Update this guide if adding new patterns
5. Keep constants file updated

---

**Last Updated**: November 2024
**Version**: 1.0.0

