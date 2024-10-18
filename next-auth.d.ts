import "next-auth";

declare module "next-auth" {
  /**
   * Returned by `useSession`, `getSession` and received as a prop on the `SessionProvider` React Context
   */
  interface Session {
    user: {
      id: number | null;
      role: string | null;
      emailVerified: Date | null;
      lastActive: Date | null;
      phoneNumber: string | null;
      acceptedDate: Date | null;
    } & DefaultSession["user"];
    accessToken: string;
  }

  interface User extends DefaultUser {
    id: number | null;
    role: string | null;
    emailVerified: Date | null;
    lastActive: Date | null;
    phoneNumber: string | null;
    acceptedDate: Date | null;
  }
}
