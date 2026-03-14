import NextAuth from "next-auth";
import type { AppUserRole } from "@/lib/auth";

// Edge-safe auth helper for proxy/middleware:
// - No providers or adapters (avoids Node-only modules like nodemailer/stream)
// - Only verifies JWT produced by the main NextAuth config
export const auth = NextAuth({
  session: { strategy: "jwt" },
  secret: process.env.NEXTAUTH_SECRET ?? "dev-secret-change-me",
  providers: [],
  callbacks: {
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.sub as string;
        session.user.role = (token.role as AppUserRole | undefined) ?? "customer";
      }
      return session;
    },
  },
}).auth;
