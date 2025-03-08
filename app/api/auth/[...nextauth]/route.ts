import NextAuth, { NextAuthOptions, type DefaultSession, type DefaultUser } from "next-auth";
import { DefaultJWT } from "next-auth/jwt";
import CredentialsProvider from "next-auth/providers/credentials";

interface Credentials {
  email: string;
  password: string;
  token: string;
  refreshToken: string;
  permissions?: string;
}

declare module "next-auth" {
  interface Session extends DefaultSession {
    user: {
      id?: any;
      name?: any;
      email?: any;
      token?: any;
      refreshToken?: any;
      permissions?: any;
    } & DefaultSession["user"];
  }

  interface User extends DefaultUser {
    id?: any;
    name?: any;
    email?: any;
    token?: any;
    refreshToken?: any;
    permissions?: any;
  }

  interface JWT extends DefaultJWT {
    id: any;
    role: any;
  }
}
const authOptions: NextAuthOptions = {
  session: {
    strategy: "jwt",
  },
  providers: [
    CredentialsProvider({
      credentials: {},
      async authorize(credentials, req) {
        const { email, password, token, refreshToken, permissions } = credentials as Credentials;
        const user = {
          id: "1",
          name: email,
          password,
          token,
          refreshToken,
          permissions,
        };

        if (user) {
          return user;
        } else {
          return null;
        }
      },
    }),
 
  ],
  pages: {
    signIn: "/login",
    signOut: "/logout",
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.token = user.token;
        token.refreshToken = user.refreshToken;
       }
      return token;
    },
    async session({ session, token }) {
      session.user.token = token.token;
      session.user.refreshToken = token.refreshToken;
 
      return session;
    },
    async redirect({ url, baseUrl }) {
      return url
    },
    
  },
  secret: process.env.NEXTAUTH_SECRET,
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
