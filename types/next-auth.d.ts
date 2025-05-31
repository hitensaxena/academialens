// TypeScript type declarations for NextAuth.js
import 'next-auth';

declare module 'next-auth' {
  interface Session {
    user?: {
      id?: string;
      role?: string;
    } & import('next-auth').DefaultSession['user'];
  }

  interface User extends import('next-auth').DefaultUser {
    role?: string;
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    role?: string;
  }
}
