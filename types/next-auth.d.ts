import NextAuth, { DefaultSession } from 'next-auth';
import { DefaultUser } from 'next-auth';

declare module 'next-auth' {
  interface Session {
    user: {
      role: string;
      detail: any;
    } & DefaultSession['user'];
    jwtToken: string;
  }

  interface User extends DefaultUser {
    jwtToken: string;
    role: string;
    detail: any;
  }
}
