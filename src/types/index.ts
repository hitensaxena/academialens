import { DefaultSession } from 'next-auth';

declare module 'next-auth' {
  interface Session {
    user: {
      id: string;
      role: string;
    } & DefaultSession['user'];
  }

  interface User {
    role: string;
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    id: string;
    role: string;
  }
}

export interface Document {
  id: string;
  userId: string;
  title: string;
  description?: string | null;
  url: string;
  publicId: string;
  fileType: string;
  fileSize: number;
  createdAt: Date;
  updatedAt: Date;
}
