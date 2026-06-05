# 🛍️ Cosmatics Store - eCommerce Platform

A complete production-ready ecommerce website built for a local cosmetics business using modern web technologies.

## ✨ Features

### Public Website ✅

- 🏠 Beautiful home page with hero section and featured products
- 📦 Complete product catalog with search, filter, and sort
- 🛒 Shopping cart with persistent storage
- 💳 Checkout system with Cash on Delivery
- 📧 Order confirmation and tracking
- 📱 Fully responsive mobile-first design

### Admin Dashboard ✅

- 📊 Analytics dashboard with sales metrics
- 🛍️ Product management with image uploads
- 🏷️ Category management
- 📋 Order management with status tracking
- 👥 Customer view
- ⚙️ Settings management

## 🔧 Tech Stack

Next.js 16, TypeScript, MongoDB, Mongoose, Tailwind CSS, Zustand, React Hook Form, Zod

## 🚀 Quick Start

### Setup

```bash
npm install
cp .env.example .env.local
# Edit .env.local with your MongoDB URI and ImgBB API key
npm run seed
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

### Admin Dashboard

Access at [http://localhost:3000/admin](http://localhost:3000/admin)

## 📚 Documentation

- **[SETUP.md](./SETUP.md)** - Detailed setup instructions
- **[DEPLOYMENT.md](./DEPLOYMENT.md)** - Deployment guides (Vercel, Self-hosted)
- **[AUTHENTICATION.md](./AUTHENTICATION.md)** - Adding authentication before production

## 📝 Available Scripts

```bash
npm run dev              # Start dev server
npm run build            # Build for production
npm start                # Start production server
npm run seed             # Seed with demo data
npm run lint             # Run linter
```

## 🔐 Security Notice

⚠️ **Admin dashboard is currently unprotected!** Add authentication before production deployment.
See [AUTHENTICATION.md](./AUTHENTICATION.md) for implementation guide.

## 📄 License

MIT

---

**Built with ❤️ for modern ecommerce**
