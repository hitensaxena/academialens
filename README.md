# AcademiaLens

![CI](https://github.com/yourusername/academialens/actions/workflows/lint.yml/badge.svg)

> AI-powered academic research assistant | Modular | Open Source

AcademiaLens is an AI-powered web application designed to help researchers manage, analyze, and extract insights from academic documents. Built with Next.js, TypeScript, Prisma, and Gemini AI, it provides a modular, scalable, and user-friendly platform for research workflows.

---

## Key Features

- Universal document ingestion and upload
- AI-driven document analysis and insight extraction
- Modular architecture for extensibility
- Secure authentication and role-based access
- Responsive UI with Tailwind CSS and Shadcn UI
- Cloud storage integration (Cloudinary)

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
