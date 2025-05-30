import NextAuth from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';
import CredentialsProvider from 'next-auth/providers/credentials';
import { PrismaAdapter } from '@next-auth/prisma-adapter';
import { PrismaClient } from '@prisma/client';
import { compare } from 'bcryptjs';
import type { NextAuthOptions, User as NextAuthUser } from 'next-auth';

// Import our custom type declarations
import 'next-auth';

// Initialize Prisma Client
const prisma = new PrismaClient();

// Configure NextAuth
export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  secret: process.env.NEXTAUTH_SECRET,
  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        try {
          if (!credentials?.email || !credentials?.password) {
            throw new Error('Email and password are required');
          }

          console.log('Attempting login for:', credentials.email);

          const user = await prisma.user.findUnique({
            where: { email: credentials.email },
          });

          if (!user || !user.password) {
            console.error('Login failed: User not found or no password set');
            throw new Error('Invalid credentials');
          }

          console.log('User found, verifying password...');
          const isPasswordValid = await compare(credentials.password, user.password);

          if (!isPasswordValid) {
            console.error('Login failed: Invalid password for user', user.email);
            throw new Error('Invalid credentials');
          }

          // Return only the necessary user data for the session
          // eslint-disable-next-line @typescript-eslint/no-unused-vars
          const { password, ...userWithoutPassword } = user;
          return userWithoutPassword;
        } catch (error) {
          console.error('Authorization error:', error);
          return null;
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = (user as NextAuthUser & { role?: string }).role || 'user';
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id;
        session.user.role = token.role;
      }
      return session;
    },
  },
  pages: {
    signIn: '/auth/login',
    error: '/auth/error',
  },
  secret: process.env.NEXTAUTH_SECRET || 'your-secret-key',
  debug: process.env.NODE_ENV === 'development',
};

// Create the NextAuth handler
const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
