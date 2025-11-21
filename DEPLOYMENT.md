# Deployment Guide - Silver Crafts Next.js

## 🚀 Quick Deploy Options

### Option 1: Vercel (Recommended)

Vercel is the creators of Next.js and provides the best deployment experience.

#### Steps:
1. Push your code to GitHub/GitLab/Bitbucket
2. Visit [vercel.com](https://vercel.com)
3. Click "Import Project"
4. Select your repository
5. Vercel auto-detects Next.js and configures everything
6. Click "Deploy"

**That's it!** Your site will be live in ~2 minutes.

#### Configuration:
- Build Command: `npm run build` (auto-detected)
- Output Directory: `.next` (auto-detected)
- Install Command: `npm install` (auto-detected)

#### Environment Variables (if using Supabase):
```
NEXT_PUBLIC_SUPABASE_URL=your_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_key
```

### Option 2: Netlify

#### Steps:
1. Push code to Git repository
2. Visit [netlify.com](https://netlify.com)
3. Click "New site from Git"
4. Select your repository
5. Configure build settings:
   - Build command: `npm run build`
   - Publish directory: `.next`
6. Click "Deploy site"

#### netlify.toml (optional):
```toml
[build]
  command = "npm run build"
  publish = ".next"

[[plugins]]
  package = "@netlify/plugin-nextjs"
```

### Option 3: Self-Hosted (VPS/Cloud)

#### Requirements:
- Node.js 18+
- PM2 or similar process manager
- Nginx or Apache (optional, for reverse proxy)

#### Steps:

1. **Build the application:**
```bash
npm run build
```

2. **Start with PM2:**
```bash
npm install -g pm2
pm2 start npm --name "silvercrafts" -- start
pm2 save
pm2 startup
```

3. **Nginx configuration (optional):**
```nginx
server {
    listen 80;
    server_name yourdomain.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

### Option 4: Docker

#### Dockerfile:
```dockerfile
FROM node:18-alpine AS deps
WORKDIR /app
COPY package*.json ./
RUN npm ci

FROM node:18-alpine AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npm run build

FROM node:18-alpine AS runner
WORKDIR /app
ENV NODE_ENV production
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static

EXPOSE 3000
ENV PORT 3000
CMD ["node", "server.js"]
```

#### Build and run:
```bash
docker build -t silvercrafts .
docker run -p 3000:3000 silvercrafts
```

### Option 5: AWS (Amplify)

1. Push code to Git
2. Go to AWS Amplify Console
3. Connect your repository
4. Amplify auto-detects Next.js
5. Deploy

### Option 6: DigitalOcean App Platform

1. Push code to Git
2. Create new app in DigitalOcean
3. Connect repository
4. Select "Next.js" as framework
5. Deploy

## 🔧 Pre-Deployment Checklist

### Code Quality
- [ ] Run `npm run build` successfully
- [ ] Run `npm run lint` with no errors
- [ ] Run `npm run typecheck` with no errors
- [ ] Test all pages in production build (`npm run start`)

### Configuration
- [ ] Update contact information in Footer
- [ ] Set correct email in `src/components/Footer.tsx`
- [ ] Set correct phone in `src/components/Footer.tsx`
- [ ] Configure environment variables (if using Supabase)
- [ ] Update metadata in `app/layout.tsx`

### Assets
- [ ] All images optimized and compressed
- [ ] Favicon added to `public/`
- [ ] Social media preview images added
- [ ] All product images loading correctly

### SEO
- [ ] Meta descriptions added
- [ ] Page titles configured
- [ ] Open Graph tags added (optional)
- [ ] Sitemap generated (optional)

### Performance
- [ ] Lighthouse score > 90
- [ ] Core Web Vitals passing
- [ ] Images lazy loading
- [ ] Fonts optimized

### Security
- [ ] Environment variables secured
- [ ] No sensitive data in code
- [ ] HTTPS configured
- [ ] Security headers configured

## 🌍 Environment Variables

### Required (if using Supabase):
```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

### Optional:
```env
# Analytics
NEXT_PUBLIC_GA_ID=G-XXXXXXXXXX

# Contact Form
NEXT_PUBLIC_CONTACT_EMAIL=info@silvercrafts.in

# Environment
NODE_ENV=production
```

## 📊 Performance Optimization

### Before Deployment:

1. **Optimize Images:**
```bash
# Install image optimization tool
npm install -g sharp-cli

# Optimize all images
sharp -i public/Products/**/*.jpg -o public/Products/**/*.webp
```

2. **Analyze Bundle:**
```bash
npm install @next/bundle-analyzer
```

Add to `next.config.js`:
```javascript
const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
})

module.exports = withBundleAnalyzer({
  // your config
})
```

Run:
```bash
ANALYZE=true npm run build
```

3. **Enable Compression:**
Already enabled by default in Next.js.

## 🔒 Security Headers

Add to `next.config.js`:
```javascript
module.exports = {
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'X-DNS-Prefetch-Control',
            value: 'on'
          },
          {
            key: 'Strict-Transport-Security',
            value: 'max-age=63072000; includeSubDomains; preload'
          },
          {
            key: 'X-Frame-Options',
            value: 'SAMEORIGIN'
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff'
          },
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block'
          },
          {
            key: 'Referrer-Policy',
            value: 'origin-when-cross-origin'
          }
        ]
      }
    ]
  }
}
```

## 📈 Monitoring

### Vercel Analytics (if using Vercel):
```bash
npm install @vercel/analytics
```

Add to `app/layout.tsx`:
```typescript
import { Analytics } from '@vercel/analytics/react'

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        {children}
        <Analytics />
      </body>
    </html>
  )
}
```

### Google Analytics:
Add to `app/layout.tsx`:
```typescript
import Script from 'next/script'

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        {children}
        <Script
          src={`https://www.googletagmanager.com/gtag/js?id=${process.env.NEXT_PUBLIC_GA_ID}`}
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '${process.env.NEXT_PUBLIC_GA_ID}');
          `}
        </Script>
      </body>
    </html>
  )
}
```

## 🐛 Troubleshooting

### Build Fails
```bash
# Clear cache and rebuild
rm -rf .next
npm run build
```

### Images Not Loading
- Ensure images are in `public/` directory
- Check paths start with `/`
- Verify file names match exactly (case-sensitive)

### Fonts Not Loading
- Check `app/layout.tsx` font configuration
- Verify font variables in `tailwind.config.js`

### Animations Not Working
- Ensure GSAP is in dependencies
- Check client components have `'use client'`
- Verify animations run inside `useEffect`

## 📞 Support

For deployment issues:
- Next.js Docs: https://nextjs.org/docs
- Vercel Support: https://vercel.com/support
- Community: https://github.com/vercel/next.js/discussions

---

**Ready to deploy!** 🚀

Choose your preferred platform and follow the steps above.

