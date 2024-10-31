import NextAuth from "next-auth";
import { encode } from "next-auth/jwt";
import Credentials from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";

export default NextAuth({
  pages: {
    signIn: "/sign-in",
    error: "/sign-in",
  },
  secret: process.env.NEXTAUTH_SECRET,
  session: { strategy: "jwt", maxAge: 30 * 24 * 60 * 60 },
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    }),
    Credentials({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
        remember: { label: "Remember for 30 days", type: "checkbox" },
      },
      async authorize(credentials) {
        if (!credentials || !credentials.email || !credentials.password) {
          return null;
        }
        try {
          const userCredentials = {
            email: credentials.email,
            password: credentials.password,
            remember: credentials.remember,
          };
          const res = await fetch(
            `${process.env.NEXTAUTH_URL}/api/auth/sign-in`,
            {
              method: "POST",
              body: JSON.stringify(userCredentials),
              headers: {
                "Content-Type": "application/json",
              },
            },
          );

          if (!res.ok) {
            throw new Error("Failed to authenticate");
          }

          const data = await res.json();

          if (data?.data) {
            return data.data;
          } else {
            return null;
          }
        } catch (error) {
          console.error("Error during authentication:", error);
          throw new Error("Authentication failed");
        }
      },
    }),
  ],
  callbacks: {
    async signIn({ user, account, profile }) {
      if (account?.provider === "google") {
        const res = await fetch(
          `${process.env.NEXTAUTH_URL}/api/auth/provider-login`,
          {
            method: "POST",
            body: JSON.stringify({
              account,
              user,
              profile,
            }),
            headers: {
              "Content-Type": "application/json",
            },
          },
        );

        if (!res.ok) {
          throw new Error("Failed to authenticate");
        }

        const data = await res.json();

        if (data?.data) {
          const dataUser = data.data;
          user.email = dataUser.email;
          user.name = dataUser.name;
          user.image = dataUser.image;
          user.role = dataUser.role;
          user.emailVerified = dataUser.emailVerified;
          user.id = dataUser.id;
          user.lastActive = dataUser.lastActive;
          user.phoneNumber = dataUser.phoneNumber;
          user.acceptedDate = dataUser.acceptedDate;

          return true;
        } else {
          return false;
        }
      }

      return true;
    },
    async jwt({ token, user }: { token: any; user: any }) {
      if (user) {
        token.id = user.id;
        token.email = user.email;
        token.name = user.name;
        token.image = user.image;
        token.emailVerified = user.emailVerified;
        token.role = user.role;
        token.phoneNumber = user.phoneNumber;
        token.lastActive = user.lastActive;
        token.acceptedDate = user.acceptedDate;
        token.exp = user.remember
          ? Math.floor(Date.now() / 1000) + 60 * 60 * 24 * 30
          : Math.floor(Date.now() / 1000) + 60 * 60 * 24;
      }

      return token;
    },
    async session({ session, token }: { session: any; token: any }) {
      session.user.id = token.id;
      session.user.email = token.email;
      session.user.name = token.name;
      session.user.image = token.image;
      session.user.role = token.role;
      session.user.emailVerified = token.emailVerified;
      session.user.phoneNumber = token.phoneNumber;
      session.user.lastActive = token.lastActive;
      session.user.acceptedDate = token.acceptedDate;

      const tokenJwt = await encode({
        secret: process.env.NEXTAUTH_SECRET as string,
        token: {
          id: token.id,
          email: token.email,
          name: token.name,
          role: token.role,
        },
        maxAge: token.remember ? 30 * 24 * 60 * 60 : 24 * 60 * 60,
      });
      session.accessToken = tokenJwt;
      session.expires = token.remember ? 30 * 24 * 60 * 60 : 24 * 60 * 60;

      return session;
    },
  },
});
