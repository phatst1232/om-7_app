import CredentialsProvider from 'next-auth/providers/credentials';
import type { NextAuthOptions } from 'next-auth';
import GitHubProvider from 'next-auth/providers/github';
import axios, { AxiosError } from 'axios';
import { LOGIN_ROUTE } from '@/shared/common/api-route';

export const options: NextAuthOptions = {
  providers: [
    GitHubProvider({
      clientId: process.env.GITHUB_ID as string,
      clientSecret: process.env.GITHUB_SECRET as string,
    }),
    CredentialsProvider({
      name: 'credentials',
      type: 'credentials',
      credentials: {
        username: { label: 'Username', type: 'text', placeholder: 'jsmith' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        try {
          const response = await axios.post(LOGIN_ROUTE, {
            username: credentials?.username,
            password: credentials?.password,
          });
          // localStorage.setItem('token', response.data.access_token);

          return response.data;
        } catch (error) {
          console.log('Catched error: ' + error);
          if (error instanceof AxiosError) {
            throw new Error(error.response?.data?.message);
          }
          return null;
        }
      },
    }),
  ],
  pages: {
    signIn: '/login',
    signOut: '/login',
  },
  callbacks: {
    async signIn({ user }) {
      console.log('User: ', user);
      // return true;
      if (user.accessToken) {
        return true;
      }
      return false;
    },

    async jwt({ token, account, user }) {
      // Persist the OAuth access_token and or the user id to the token right after signin
      if (user) {
        token.accessToken = user.accessToken;
      }
      return token;
    },

    async session({ session, user, token }) {
      session.user.accessToken = token.accessToken;
      return session;
    },
  },
};
