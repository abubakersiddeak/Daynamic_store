# Authentication Integration Guide

This guide explains how to add authentication to your Cosmatics Store ecommerce application.

## Current State

The application is built with **authentication-ready architecture**, meaning:

- ✅ Admin routes exist but are unprotected
- ✅ Server actions validate inputs
- ✅ Database has user-friendly structure
- ✅ No authentication code blocks development
- ⚠️ **IMPORTANT**: Add authentication before production deployment!

## 🔐 Adding Authentication

### Option 1: NextAuth.js (Recommended)

**Installation:**

```bash
npm install next-auth argon2 @next-auth/prisma-adapter
```

**Create middleware.ts:**

```typescript
// src/middleware.ts
import { withAuth } from "next-auth/middleware";

export const middleware = withAuth({
  callbacks: {
    authorized({ req, token }) {
      // Protect admin routes
      if (req.nextUrl.pathname.startsWith("/admin")) {
        return token?.role === "admin";
      }
      return true;
    },
  },
});

export const config = {
  matcher: ["/admin/:path*", "/checkout"],
};
```

**Create API route:**

```typescript
// src/app/api/auth/[...nextauth]/route.ts
import NextAuth, { type NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        // Verify user in database
        // Hash and compare passwords
        // Return user object or null
      },
    }),
  ],
  pages: {
    signIn: "/login",
    error: "/login",
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) token.role = user.role;
      return token;
    },
    async session({ session, token }) {
      if (session.user) session.user.role = token.role;
      return session;
    },
  },
};

export const handler = NextAuth(authOptions);
```

### Option 2: Firebase Authentication

**Installation:**

```bash
npm install firebase next-firebase-auth-edge
```

**Set up Firebase project**, then create authentication components.

### Option 3: Clerk (Easiest)

**Installation & Setup:**

```bash
npm install @clerk/nextjs
```

Visit [clerk.com](https://clerk.com) for detailed setup.

## 🛡️ Protected Routes Structure

### Current Admin Routes (Unprotected)

```
/admin/              - Dashboard
/admin/products      - Product management
/admin/categories    - Category management
/admin/orders        - Order management
/admin/customers     - Customer list
/admin/settings      - Settings
```

### To Protect These Routes:

**Create admin/layout.tsx with auth check:**

```typescript
import { auth } from "@/lib/auth" // Your auth library
import { redirect } from "next/navigation"

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await auth()

  if (!session?.user?.role === "admin") {
    redirect("/login?callbackUrl=/admin")
  }

  return <AdminSidebar>{children}</AdminSidebar>
}
```

## 📦 User Model for Database

Add to your MongoDB schema:

```typescript
// src/models/User.ts
import mongoose, { Schema, Document } from "mongoose";

export interface IUserDocument extends Document {
  name: string;
  email: string;
  password: string;
  role: "admin" | "customer";
  createdAt: Date;
  updatedAt: Date;
}

const userSchema = new Schema<IUserDocument>(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: {
      type: String,
      enum: ["admin", "customer"],
      default: "customer",
    },
  },
  { timestamps: true },
);

export const User =
  mongoose.models.User || mongoose.model<IUserDocument>("User", userSchema);
```

## 🚀 Implementation Timeline

### Phase 1: Basic Setup (Day 1)

- [ ] Choose auth library
- [ ] Set up authentication endpoints
- [ ] Create login page
- [ ] Test user registration

### Phase 2: Route Protection (Day 2)

- [ ] Add middleware for protected routes
- [ ] Create "unauthorized" error page
- [ ] Protect admin routes
- [ ] Add logout functionality

### Phase 3: User Management (Day 3)

- [ ] Create user management admin page
- [ ] Add password reset
- [ ] Implement session management
- [ ] Add user activity logging

## 🔑 Key Implementation Points

1. **Password Security**
   - Never store plain passwords
   - Use bcrypt or argon2 for hashing
   - Implement password strength requirements

2. **Session Management**
   - Use secure, httpOnly cookies
   - Set appropriate expiration times
   - Implement CSRF protection

3. **Admin Verification**
   - Mark specific users as admin
   - Verify admin status on protected routes
   - Log all admin actions

4. **Error Handling**
   - Don't reveal if email exists
   - Generic error messages for failed login
   - Rate limit login attempts

## 📚 Resources

- [NextAuth.js Documentation](https://next-auth.js.org/)
- [MongoDB User Authentication](https://docs.mongodb.com/manual/security/authentication/)
- [Bcrypt Password Hashing](https://www.npmjs.com/package/bcrypt)
- [OWASP Authentication Guide](https://owasp.org/www-project-web-security-testing-guide/)

## ⚠️ Before Going Live

**DO NOT deploy without authentication!**

Checklist:

- [ ] All admin routes are protected
- [ ] Users must log in to access admin
- [ ] Passwords are properly hashed
- [ ] Sessions expire appropriately
- [ ] HTTPS is enabled
- [ ] Security headers are set
- [ ] Rate limiting is implemented
- [ ] Audit logging is enabled

---

**Next Step**: After implementing authentication, add it to the SETUP.md file so other developers know about the requirement.
