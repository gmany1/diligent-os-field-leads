# 🚀 DiligentOS Field Leads Management System

Enterprise-grade Progressive Web App (PWA) for managing field sales leads, built with Next.js 16, Prisma, and Hono.

## ✨ Features

- 🔐 **Secure Authentication** - NextAuth.js with Microsoft Entra ID integration
- 👥 **Role-Based Access Control (RBAC)** - Multi-branch support with granular permissions
- 📊 **Advanced Analytics** - Executive dashboards with visual insights
- 🎯 **Lead Management** - Kanban boards, activity timeline, duplicate detection
- 💰 **Quote Generator** - AI-powered quote creation and management
- 📝 **Audit Logging** - Comprehensive tracking for compliance
- 📱 **PWA Support** - Install as native app on any device
- 🌙 **Dark Mode** - Beautiful UI with theme support

## 🛠️ Tech Stack

- **Framework:** Next.js 16 (App Router + Turbopack)
- **Database:** PostgreSQL with Prisma ORM
- **API:** Hono.js for high-performance endpoints
- **Auth:** NextAuth.js v5
- **UI:** React 19, TailwindCSS 4, Recharts
- **State:** TanStack Query (React Query)

## 📋 Prerequisites

- Node.js 18+ 
- npm or yarn
- PostgreSQL database (or SQLite for development)

## 🚀 Quick Start

### 1. Clone and Install

```bash
git clone <repository-url>
cd diligent-os-field-leads
npm install
```

### 2. Configure Environment

Copy the example environment file and update with your values:

```bash
cp env.example .env
```

Required environment variables:
```env
DATABASE_URL="file:./dev.db"  # or PostgreSQL connection string
AUTH_SECRET="your-secret-key-here"
NEXTAUTH_URL="http://localhost:3000"
```

### 3. Setup Database

```bash
npm run db:setup
```

This will:
- Run Prisma migrations
- Seed the database with initial data

### 4. Start Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### 5. Default Login Credentials

After seeding, you can login with:
- **Email:** `jesus.ramos@diligentos.com`
- **Password:** `password123`

## 📦 Available Scripts

```bash
npm run dev          # Start development server
npm run build        # Create production build
npm run start        # Start production server
npm run lint         # Run ESLint
npm run db:setup     # Setup and seed database
node verify-system.js # Verify system configuration
```

## 🏗️ Project Structure

```
diligent-os-field-leads/
├── src/
│   ├── app/              # Next.js App Router pages
│   │   ├── api/          # API routes (Hono)
│   │   ├── dashboard/    # Dashboard pages
│   │   ├── leads/        # Lead management
│   │   ├── quotes/       # Quote management
│   │   └── ...
│   ├── components/       # React components
│   ├── lib/              # Utilities and helpers
│   └── middleware.ts     # Auth middleware
├── prisma/
│   ├── schema.prisma     # Database schema
│   └── seed*.ts          # Database seeders
├── public/               # Static assets
└── ...
```

## 🔧 Configuration

### Database

**SQLite (Development):**
```env
DATABASE_URL="file:./dev.db"
```

**PostgreSQL (Production):**
```env
DATABASE_URL="postgresql://user:password@localhost:5432/dbname"
```

### Authentication

Generate a secure AUTH_SECRET:
```bash
openssl rand -base64 32
```

### Deployment

The project is configured for standalone deployment:

```bash
npm run build
npm run start
```

For Docker deployment, see `Dockerfile` and `DEPLOYMENT.md`.

## 📚 Documentation

- [Implementation Plan](IMPLEMENTATION_PLAN.md)
- [Deployment Guide](DEPLOYMENT.md)
- [Fixes Applied](FIXES_APPLIED.md)
- [Access Control Policy](access_control_policy.md)
- [Audit Procedure](audit_procedure.md)

## 🐛 Troubleshooting

### Build Errors

If you encounter build errors:

1. Clear Next.js cache:
   ```bash
   rm -rf .next
   npm run build
   ```

2. Verify TypeScript:
   ```bash
   npx tsc --noEmit
   ```

3. Check system configuration:
   ```bash
   node verify-system.js
   ```

### Database Issues

Reset the database:
```bash
rm dev.db
npm run db:setup
```

### Port Already in Use

Change the port:
```bash
PORT=3001 npm run dev
```

## 🤝 Contributing

1. Create a feature branch
2. Make your changes
3. Run tests and linting
4. Submit a pull request

## 📄 License

Proprietary - DiligentOS

## 🆘 Support

For issues and questions, please contact the development team.

---

**Built with ❤️ by the DiligentOS Team**
