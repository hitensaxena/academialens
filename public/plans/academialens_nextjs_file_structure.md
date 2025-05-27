# AcademiaLens Next.js File Structure

This document outlines the recommended file structure for the AcademiaLens Next.js application, following best practices for organization, scalability, and maintainability.

## Root Directory Structure

```
academialens/
├── .github/                    # GitHub workflows and configuration
├── .husky/                     # Git hooks for pre-commit checks
├── app/                        # Next.js App Router pages and layouts
├── components/                 # React components
├── config/                     # Application configuration
├── hooks/                      # Custom React hooks
├── lib/                        # Utility libraries and services
├── prisma/                     # Prisma schema and migrations
├── public/                     # Static assets
├── scripts/                    # Build and maintenance scripts
├── styles/                     # Global styles and Tailwind configuration
├── types/                      # TypeScript type definitions
├── .env.example                # Example environment variables
├── .eslintrc.js                # ESLint configuration
├── .gitignore                  # Git ignore rules
├── docker-compose.yml          # Docker configuration for local development
├── jest.config.js              # Jest testing configuration
├── next.config.js              # Next.js configuration
├── package.json                # Project dependencies and scripts
├── postcss.config.js           # PostCSS configuration for Tailwind
├── README.md                   # Project documentation
├── tailwind.config.js          # Tailwind CSS configuration
└── tsconfig.json               # TypeScript configuration
```

## Detailed Structure

### App Directory (App Router)

```
app/
├── (auth)/                     # Authentication routes group
│   ├── login/                  # Login page
│   │   └── page.tsx
│   ├── register/               # Registration page
│   │   └── page.tsx
│   ├── forgot-password/        # Password recovery
│   │   └── page.tsx
│   └── layout.tsx              # Auth layout
├── (dashboard)/                # Dashboard routes group
│   ├── dashboard/              # Main dashboard
│   │   └── page.tsx
│   ├── documents/              # Document management
│   │   ├── [id]/               # Single document view
│   │   │   ├── page.tsx
│   │   │   └── loading.tsx
│   │   └── page.tsx
│   ├── projects/               # Project management
│   │   ├── [id]/               # Single project view
│   │   │   ├── page.tsx
│   │   │   └── loading.tsx
│   │   └── page.tsx
│   ├── analysis/               # Analysis results
│   │   ├── [id]/               # Single analysis view
│   │   │   ├── page.tsx
│   │   │   └── loading.tsx
│   │   └── page.tsx
│   ├── settings/               # User settings
│   │   └── page.tsx
│   └── layout.tsx              # Dashboard layout
├── api/                        # API routes
│   ├── auth/                   # Authentication endpoints
│   │   └── [...nextauth]/
│   │       └── route.ts
│   ├── documents/              # Document management endpoints
│   │   ├── [id]/
│   │   │   └── route.ts
│   │   └── route.ts
│   ├── projects/               # Project management endpoints
│   │   ├── [id]/
│   │   │   └── route.ts
│   │   └── route.ts
│   ├── analysis/               # Analysis endpoints
│   │   ├── [id]/
│   │   │   └── route.ts
│   │   └── route.ts
│   ├── ai/                     # AI processing endpoints
│   │   ├── summarize/
│   │   │   └── route.ts
│   │   ├── extract/
│   │   │   └── route.ts
│   │   ├── compare/
│   │   │   └── route.ts
│   │   └── qa/
│   │       └── route.ts
│   └── webhooks/               # External service webhooks
│       ├── stripe/
│       │   └── route.ts
│       └── storage/
│           └── route.ts
├── error.tsx                   # Global error component
├── favicon.ico                 # Site favicon
```
