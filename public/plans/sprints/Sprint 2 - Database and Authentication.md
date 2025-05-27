# Sprint 2: Database & Authentication

## Sprint Goal

Implement the core database schema and user authentication system.

## Key Deliverables

- PostgreSQL installed and running locally.
- Prisma ORM initialized with complete schema.
- Environment variables for DB connection.
- Initial migration applied.
- NextAuth.js authentication with Google and credentials providers.
- Authentication API routes and middleware.

## Detailed Tasks

1. Install PostgreSQL locally (Docker or native).
2. Install and initialize Prisma:
   - `npm install prisma @prisma/client`
   - `npx prisma init`
3. Implement full Prisma schema (User, Project, Document, Analysis, etc.).
4. Set up `.env` with `DATABASE_URL`.
5. Run `npx prisma migrate dev --name init`.
6. Create Prisma client utility.
7. Install NextAuth.js and Prisma adapter:
   - `npm install next-auth`
8. Configure NextAuth with Google and credentials providers.
9. Create authentication API routes and middleware.
10. Implement sign-in, sign-up, and password reset pages.

## Acceptance Criteria

- Database is seeded and accessible.
- Authentication works for both Google and email/password.
- Protected routes redirect unauthorized users.
