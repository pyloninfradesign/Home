import NextAuth from "next-auth";
import type { JWT } from "next-auth/jwt";
import EmailProvider from "next-auth/providers/email";
import ResendProvider from "next-auth/providers/resend";
import CredentialsProvider from "next-auth/providers/credentials";
import { SupabaseAdapter } from "@auth/supabase-adapter";
import { createClient } from "@supabase/supabase-js";
import { logAuditEvent } from "@/lib/audit";

// Role shape used across the app
export type AppUserRole = "admin" | "manager" | "employee" | "customer";

const authSecret = process.env.NEXTAUTH_SECRET ?? "dev-secret-change-me";
const requiredEnv = ["NEXTAUTH_SECRET"];

requiredEnv.forEach((key) => {
  if (!process.env[key]) {
    console.warn(`Missing env var ${key} — Auth.js may be partially disabled until set.`);
  }
});

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceRoleKey) {
  console.warn("Supabase env missing; auth adapter disabled.");
} else {
  console.log("Supabase env present; enabling adapter.");
}

const useSupabaseAdapter = !!(supabaseUrl && supabaseServiceRoleKey && !process.env.AUTH_DISABLE_ADAPTER);

const supabase =
  useSupabaseAdapter
    ? createClient(supabaseUrl, supabaseServiceRoleKey, {
        auth: { autoRefreshToken: false, persistSession: false },
      })
    : null;

// Choose email provider: prefer Resend, fallback to SMTP if configured
const emailProviders = [];
if (process.env.RESEND_API_KEY && process.env.EMAIL_FROM) {
  emailProviders.push(
    ResendProvider({
      apiKey: process.env.RESEND_API_KEY,
      from: process.env.EMAIL_FROM,
    }),
  );
} else if (process.env.EMAIL_SERVER && process.env.EMAIL_FROM) {
  emailProviders.push(
    EmailProvider({
      server: process.env.EMAIL_SERVER,
      from: process.env.EMAIL_FROM,
    }),
  );
}

const devEmail = process.env.AUTH_DEV_EMAIL ?? "admin@example.com";
const devPassword = process.env.AUTH_DEV_PASSWORD ?? "password";

const providers = [];

// Only enable email providers when an adapter is available (required by Auth.js)
if (useSupabaseAdapter) {
  providers.push(...emailProviders);
} else {
  console.warn("Auth adapter disabled or unreachable; falling back to dev Credentials provider.");
}

// Always add a dev-only credentials provider for local/unreliable network use
providers.push(
  CredentialsProvider({
    name: "Developer Login",
    credentials: {
      email: { label: "Email", type: "text", placeholder: devEmail },
      password: { label: "Password", type: "password" },
    },
    async authorize(credentials) {
      if (!credentials) return null;
      if (credentials.email === devEmail && credentials.password === devPassword) {
        return {
          id: "dev-user",
          email: devEmail,
          role: "admin",
          name: "Dev Admin",
        };
      }
      await logAuditEvent({
        action: "AUTH_SIGN_IN_FAILED",
        actor: {
          email: typeof credentials.email === "string" ? credentials.email : null,
        },
        target: {
          type: "auth",
          label: "Developer Login",
        },
        details: {
          provider: "credentials",
        },
      });
      return null;
    },
  }),
);

export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: useSupabaseAdapter
    ? SupabaseAdapter({
        url: supabaseUrl!,
        secret: supabaseServiceRoleKey!,
      })
    : undefined,
  session: { strategy: "jwt", maxAge: 60 * 60 * 8 }, // 8 hours
  jwt: { maxAge: 60 * 60 * 8 },
  secret: authSecret,
  providers,
  callbacks: {
    async signIn({ user }) {
      // Block disabled users
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const disabled = (user as any)?.user_metadata?.disabled ?? (user as any)?.disabled;
      if (disabled) return false;
      await logAuditEvent({
        action: "AUTH_SIGN_IN",
        actor: {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          id: (user as any)?.id,
          email: user.email,
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          role: (user as any)?.role ?? (user as any)?.user_metadata?.role ?? null,
          name: user.name,
        },
        target: {
          type: "auth",
          label: "User session",
        },
      });
      return true;
    },
    async jwt({ token, user }) {
      // On first sign-in, map role from Supabase user metadata or DB column
      if (user) {
        const roleFromUser =
          // Supabase auth user metadata
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          ((user as any).user_metadata?.role as AppUserRole | undefined) ??
          // Adapter may return role directly if added to users table
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          ((user as any).role as AppUserRole | undefined);

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const disabledFromUser = (user as any).user_metadata?.disabled ?? (user as any).disabled;

        token.role = roleFromUser ?? (token.role as AppUserRole | undefined) ?? "customer";
        if (typeof disabledFromUser === "boolean") {
          (token as JWT & { disabled?: boolean }).disabled = disabledFromUser;
        }
      }

      // Ensure we always keep sub/id for session.user.id
      if (!token.sub && user?.id) {
        token.sub = user.id;
      }

      return token as JWT;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.sub as string;
        session.user.role = (token.role as AppUserRole | undefined) ?? "customer";
        session.user.disabled = (token as JWT & { disabled?: boolean }).disabled ?? false;
      }
      return session;
    },
  },
  events: {
    async signOut(message) {
      const token = "token" in message ? message.token : null;
      await logAuditEvent({
        action: "AUTH_SIGN_OUT",
        actor: {
          email: token?.email ?? null,
          role: (token?.role as AppUserRole | undefined) ?? null,
        },
        target: {
          type: "auth",
          label: "User session",
        },
      });
    },
  },
});

// Helper to gate server actions / route handlers
export function assertRole(userRole: AppUserRole | undefined, allowed: AppUserRole[]) {
  if (!userRole) return false;
  return allowed.includes(userRole);
}
