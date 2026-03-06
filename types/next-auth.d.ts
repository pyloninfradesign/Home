import type { DefaultSession } from "next-auth";
import type { JWT } from "next-auth/jwt";
import type { AppUserRole } from "@/lib/auth";

declare module "next-auth" {
  interface Session {
    user: DefaultSession["user"] & {
      id: string;
      role?: AppUserRole;
      disabled?: boolean;
    };
  }

  interface User {
    id: string;
    role?: AppUserRole;
    // Supabase user metadata passthrough
    user_metadata?: Record<string, unknown> & { role?: AppUserRole; disabled?: boolean };
    disabled?: boolean;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    role?: AppUserRole;
    disabled?: boolean;
  }
}
