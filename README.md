# AcademiaLens

![CI](https://github.com/yourusername/academialens/actions/workflows/lint.yml/badge.svg)

> AI-powered academic research assistant | Modular | Open Source

AcademiaLens is an AI-powered web application designed to help researchers manage, analyze, and extract insights from academic documents. Built with Next.js, TypeScript, Prisma, and Cloudinary, it provides a modular, scalable, and user-friendly platform for research workflows.

---

## 🟢 Sprint 4.6 Release Note

- **Project Detail Page Overhaul:** Completely redesigned project view with tabbed interface
- **Enhanced Document Management:** Improved document browsing with folder organization and search
- **Team Collaboration:** Added team member management and activity tracking
- **Performance Optimizations:** Reduced bundle size by removing unused dependencies
- **Type Safety:** Improved TypeScript types and fixed type-related issues
- **UI/UX Refinements:** Polished UI components and interactions

## 🟢 Sprint 4.5 Release Note

- **Complete Dashboard Redesign:** Actionable, insight-driven workspace hub for scholars
- **New Sections:** Personalized snapshot, recent activity, initiate new research, AI insights feed
- **Knowledge Base Growth Metrics:** Value-oriented, growth-focused analytics and progress bars
- **Usage Transparency:** Subtle, clear display of analysis credits and AI usage
- **UI/UX Polish:** Shadcn UI, Tailwind, Lucide icons, micro-interactions, loading/empty states, and mobile responsiveness

---

## 🚀 Latest Updates

- **Major Layout Refactor (May 2025):**

  - Header is now always full-width and fixed at the top, with the "AcademiaLens" app name on the left and a centered search bar.
  - Sidebar now appears below the header (not overlapping), providing clear separation and improved navigation.
  - Main content area is horizontally aligned with the sidebar, ensuring a clean and organized layout.
  - Fixed an issue where dashboard content was duplicated in the main container.
  - All code is linted and up-to-date with the latest UI/UX best practices.

- **Complete Dashboard Navigation** - Seamless routing between dashboard sections
- **Responsive Sidebar** - Toggle sidebar for mobile and desktop
- **User Profile Integration** - Session-aware user navigation
- **Document Management** - Upload, view, and delete documents with feedback
- **Cloud Storage** - Cloudinary integration for uploads
- **AI Analysis** - Summarize and extract insights from documents

---

## Key Features

- Universal document ingestion and upload (PDF, DOCX, TXT)
- AI-driven document analysis and insight extraction
- Modular architecture for extensibility
- Secure authentication and role-based access (NextAuth.js, session-aware dashboard)
- Responsive UI with Tailwind CSS and Shadcn UI
- Cloud storage integration (Cloudinary)
- Session-based document filtering: Each user only sees their own uploaded documents in the dashboard
- Document deletion with confirmation dialog and Cloudinary cleanup
- Upload and deletion success/error feedback

---

## 📊 New Dashboard Experience (Sprint 4.5)

AcademiaLens now features a fully redesigned, actionable dashboard—a true "Research Workspace Hub" for academic scholars:

- **Personalized Research Snapshot:** Welcome greeting, progress metrics, and a prominent "Start New Research" CTA.
- **Recent Activity & Status:** Instantly resume or review in-progress and recently completed work, with status badges and direct actions.
- **Initiate New Research:** Grid of action buttons for uploading papers, analyzing URLs, transcribing videos, starting synthesis projects, and pasting quick text—all grouped for workflow clarity and accessibility.
- **Latest Discoveries & AI Insights:** Dynamic, actionable feed of AI-generated insights, summaries, and discoveries, each with context and direct links.
- **Knowledge Base Growth:** Metrics reframed to show knowledge base expansion, with progress bars, tooltips, and encouraging feedback.
- **Usage Transparency:** Subtle, non-alarming display of AI analysis credits/usage with clear tooltips.
- **Modern UI/UX:** Built with Shadcn UI, Tailwind CSS, and Lucide React icons for a beautiful, responsive, and accessible experience. Includes micro-interactions, loading indicators, and empty/edge states for all sections.

---

## Architecture Overview

AcademiaLens is structured into the following core modules:

- Universal Input & Ingestion Engine
- Insight Extractor
- Deconstruction Toolkit
- Synthesis & Connection Hub
- Application & Foresight Engine

The backend leverages PostgreSQL with Prisma ORM, and authentication is handled via NextAuth.js. The front end is built using Next.js App Router, Zustand for state management, and Tailwind CSS for styling.

---

## Directory Structure

```
academialens/
├── .github/           # GitHub workflows and configuration
├── .husky/            # Git hooks for pre-commit checks
├── components/        # Shared React components
├── config/            # App-wide configuration files
├── hooks/             # Custom React hooks
├── lib/               # Utility libraries and services
├── prisma/            # Prisma schema and migrations
├── public/            # Static assets
├── scripts/           # Build and maintenance scripts
├── src/
│   └── app/           # Next.js App Router pages and layouts
│       ├── auth/      # Authentication pages
│       ├── dashboard/ # Dashboard and feature modules
│       ├── api/       # API routes
│       └── ...
├── styles/            # Global styles and Tailwind config
├── types/             # TypeScript type definitions
├── .env.example       # Example environment variables
├── .prettierrc        # Prettier config
├── eslint.config.mjs  # ESLint config
├── package.json       # Project dependencies and scripts
└── ...
```

---

## Getting Started

### Authentication Setup (NextAuth.js & Google)

1. **Generate a NextAuth secret:**

   ```sh
   openssl rand -base64 32
   ```

   Place it in your `.env` and `.env.example` as `NEXTAUTH_SECRET`.

2. **Google OAuth Credentials:**

   - Go to [Google Cloud Console](https://console.cloud.google.com/apis/credentials)
   - Create an OAuth Client ID for a web application
   - Set Authorized redirect URI to: `http://localhost:3000/api/auth/callback/google`
   - Copy the `Client ID` and `Client Secret` to your `.env` and `.env.example`:
     ```env
     GOOGLE_CLIENT_ID=your_google_client_id
     GOOGLE_CLIENT_SECRET=your_google_client_secret
     ```

3. **Example .env values:**
   ```env
   NEXTAUTH_SECRET=your_nextauth_secret
   GOOGLE_CLIENT_ID=your_google_client_id
   GOOGLE_CLIENT_SECRET=your_google_client_secret
   ```

### Prerequisites

- Node.js 20+
- npm 9+
- PostgreSQL (local or cloud)

### Setup

1. **Clone the repository:**
   ```bash
   git clone https://github.com/yourusername/academialens.git
   cd academialens
   ```
2. **Install dependencies:**
   ```bash
   npm install
   ```
3. **Configure environment variables:**
   - Copy `.env.example` to `.env` and fill in your DB and API keys.
4. **Run the development server:**
   ```bash
   npm run dev
   ```
5. **Lint and format code:**
   ```bash
   npm run lint
   ```
6. **Run tests (coming soon):**
   ```bash
   npm test
   ```

---

## Contributing

Contributions are welcome! Please open issues and pull requests. See `CONTRIBUTING.md` for guidelines (coming soon).

- Fork the repo and create your branch from `main`.
- Ensure all code passes linting and formatting.
- Add/modify tests as needed.
- Submit a PR with a clear description.

---

## License

MIT License. See `LICENSE` for details.

This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

## Authentication Flow & Security

### Login & Registration

- Users can log in or register using email/password or Google OAuth.
- Forms provide real-time validation for email format, password length, and required fields.
- Clear, accessible error and success messages are shown for all actions.

### Callback URL Handling & Infinite Redirect Protection

- All callback URLs are sanitized in both middleware and auth pages.
- Unsafe callback URLs (pointing to `/auth/` or containing nested `callbackUrl` params) are ignored, preventing infinite redirect loops.
- Authenticated users accessing `/auth/login` or `/auth/register` are redirected to the dashboard.

### Middleware Route Protection

- The middleware (in `middleware.ts` at the project root) protects all routes except public ones (`/auth/login`, `/auth/register`, `/`).
- Unauthenticated users are redirected to the login page, with a safe callback URL if applicable.
- Authenticated users are prevented from accessing auth routes.

### How to Test

- Try accessing protected pages as unauthenticated: you should be redirected to login, then to your intended page after login.
- Try accessing `/auth/login` as an authenticated user: you should be redirected to the dashboard.
- Try manipulating `callbackUrl` with `/auth/` or nested parameters: you should never get stuck in a redirect loop.
- All error/success states should be clear and accessible.

### Extending Authentication

- To add new providers (e.g., GitHub), configure them in your NextAuth setup.
- To change redirect logic, update the middleware and auth page logic.
- To further improve UX, enhance form validation, add social logins, or polish UI with Tailwind.

### Security Notes

- Callback URLs are always sanitized to prevent open redirect and loop vulnerabilities.
- Only public routes are accessible without authentication; all others are protected by middleware.

---
