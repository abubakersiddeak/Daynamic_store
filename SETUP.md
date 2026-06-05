# Cosmatics Store - Production-Ready Ecommerce Website

A complete, production-ready ecommerce platform built for a local cosmetics business.

## ✨ Features

### Public Website

- 🏠 Beautiful home page with hero section, featured products, and newsletter signup
- 📦 Full product catalog with search, filtering, and sorting
- 🛒 Shopping cart with persistent storage (Zustand + localStorage)
- 💳 Checkout system with Cash on Delivery (COD) payment
- 📧 Order confirmation and tracking
- 📱 Fully responsive mobile-first design
- ⚡ Server-side rendering for optimal SEO and performance

### Admin Dashboard

- 📊 Analytics dashboard with sales metrics
- 🛍️ Product management (Create, Read, Update, Delete)
- 📸 Image upload to ImgBB with preview
- 🏷️ Category management
- 📋 Order management with status tracking
- 👥 Customer view
- ⚙️ Settings and configuration
- 🎨 Modern responsive UI with shadcn/ui

## 🔧 Tech Stack

- **Framework**: Next.js 16.2.6 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS 4
- **UI Components**: shadcn/ui style custom components
- **Database**: MongoDB with Mongoose ORM
- **State Management**: Zustand
- **Forms**: React Hook Form + Zod validation
- **Image Upload**: ImgBB API
- **HTTP Client**: Axios
- **Notifications**: React Hot Toast

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ and npm/yarn
- MongoDB instance (local or Atlas)
- ImgBB API key (get free at https://imgbb.com/api/signup)

### Installation

1. **Clone and install dependencies**

```bash
npm install
```

2. **Set up environment variables**

```bash
cp .env.example .env.local
```

Edit `.env.local`:

```env
MONGODB_URI=mongodb://localhost:27017/cosmatics-store
NEXT_PUBLIC_IMGBB_API_KEY=your_imgbb_api_key_here
NEXT_PUBLIC_SITE_NAME=Cosmatics Store
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

3. **Seed the database with demo data**

```bash
npm run seed
```

4. **Run the development server**

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## 📦 Project Structure

```
src/
├── app/                          # Next.js app router
│   ├── (public)/                # Public website routes
│   │   ├── page.tsx             # Home page
│   │   ├── products/            # Product listing & details
│   │   ├── cart/                # Shopping cart
│   │   ├── checkout/            # Checkout page
│   │   └── order-confirmation/  # Order confirmation
│   ├── admin/                   # Admin dashboard routes
│   │   ├── page.tsx             # Dashboard overview
│   │   ├── products/            # Product management
│   │   ├── categories/          # Category management
│   │   └── orders/              # Order management
│   └── layout.tsx               # Root layout
├── components/                  # Reusable React components
│   ├── ui/                      # UI components (Button, Input, Card, etc.)
│   ├── Navbar.tsx               # Navigation bar
│   ├── Footer.tsx               # Footer
│   └── ProductCard.tsx          # Product card component
├── models/                      # Mongoose schemas
│   ├── Product.ts
│   ├── Category.ts
│   ├── Order.ts
│   └── StoreSettings.ts
├── actions/                     # Server actions
│   ├── product.ts               # Product CRUD
│   ├── order.ts                 # Order handling
│   └── category.ts              # Category CRUD
├── lib/                         # Utilities
│   ├── db.ts                    # Database connection
│   ├── imgbb.ts                 # Image upload service
│   └── helpers.ts               # Helper functions
├── store/                       # Zustand stores
│   └── cart.ts                  # Shopping cart state
├── types/                       # TypeScript type definitions
├── validations/                 # Zod validation schemas
└── utils/                       # Utility functions
```

## 📝 Available Scripts

```bash
# Development
npm run dev              # Start development server

# Production
npm run build            # Build for production
npm start                # Start production server

# Database
npm run seed             # Seed database with demo data

# Code Quality
npm run lint             # Run ESLint
```

## 🎯 Key Features Explained

### Shopping Cart (Client-Side)

- Uses Zustand for state management
- Persisted to localStorage automatically
- Real-time quantity updates
- Persistent across browser sessions

### Image Upload

- Upload images directly to ImgBB
- Multiple image support
- Drag & drop interface
- Image preview before upload
- Error handling and loading states

### Database Connection

- Connection pooling for optimal performance
- Prevents model overwrite in Next.js (common issue)
- Reusable connection utility

### Validation

- Zod schemas for type-safe validation
- Server-side validation for security
- React Hook Form integration for forms
- Detailed error messages

### Server Actions

- Secure server-side data mutations
- Automatic revalidation of cache
- Error handling
- Type-safe requests/responses

## 🔐 Security Considerations

- ✅ Server-side validation for all inputs
- ✅ Sanitized database queries
- ✅ User input validation with Zod
- ✅ No sensitive data in client state
- ✅ Environment variables for API keys
- ✅ CORS-safe API calls

## 📱 Responsive Design

- Mobile-first design approach
- Breakpoints: sm (640px), md (768px), lg (1024px), xl (1280px)
- Touch-friendly navigation
- Responsive sidebar in admin dashboard
- Mobile drawer menu in public navbar

## 🚀 Deployment

### Vercel (Recommended)

```bash
# Push to GitHub and connect to Vercel
# Set environment variables in Vercel dashboard
```

### Other Platforms

1. Build the project: `npm run build`
2. Set environment variables
3. Run: `npm start`

### MongoDB Atlas Setup

1. Create cluster at https://www.mongodb.com/cloud/atlas
2. Get connection string
3. Add to `.env.local` as `MONGODB_URI`

## 📊 Admin Dashboard

### Access

- URL: `http://localhost:3000/admin`
- Note: Currently unprotected. Add authentication before production!

### Available Features

- Dashboard with sales metrics
- Product management with image uploads
- Category management
- Order management with status updates
- Customer overview

## 🎨 Customization

### Branding

- Edit store name in `.env.local`
- Customize colors in `globals.css`
- Update logo in `Navbar.tsx`

### Shipping Cost

- Default: 200 PKR (fixed)
- Edit in `useCartStore` (cart.ts)
- Edit in checkout pages

### Product Fields

- Add fields to Product model in `models/Product.ts`
- Update Zod schema in `validations/index.ts`
- Update admin form

## 🐛 Common Issues

### MongoDB Connection Error

```
Solution: Ensure MongoDB is running and URI is correct in .env.local
```

### ImgBB Upload Failed

```
Solution: Check API key in .env.local and ensure it's valid
```

### Port 3000 Already in Use

```bash
# Use different port
npm run dev -- -p 3001
```

## 📚 Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [MongoDB Mongoose](https://mongoosejs.com/)
- [Tailwind CSS](https://tailwindcss.com/)
- [React Hook Form](https://react-hook-form.com/)
- [Zod Validation](https://zod.dev/)
- [Zustand](https://github.com/pmndrs/zustand)

## 📄 License

This project is open source and available under the MIT License.

## 🤝 Support

For issues or questions:

1. Check the troubleshooting section above
2. Review the code comments
3. Consult the documentation links

---

**Built with ❤️ for modern ecommerce**
