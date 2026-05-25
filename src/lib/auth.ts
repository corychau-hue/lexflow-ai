import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { compare } from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { authConfig } from "./auth.config";

async function authorize(
  credentials: Partial<Record<string, unknown>>
): Promise<{ id: string; email: string; name: string; role: string } | null> {
  if (!credentials?.email || !credentials?.password) {
    console.log("[auth:authorize] Missing email or password");
    return null;
  }

  try {
    console.log("[auth:authorize] Looking up user:", credentials.email);
    const user = await prisma.user.findUnique({
      where: { email: credentials.email as string },
    });

    if (!user) {
      console.log("[auth:authorize] User not found:", credentials.email);
      return null;
    }
    if (!user.isActive) {
      console.log("[auth:authorize] User is inactive:", credentials.email);
      return null;
    }

    console.log("[auth:authorize] User found, comparing password");
    const isValid = await compare(
      credentials.password as string,
      user.passwordHash
    );
    if (!isValid) {
      console.log("[auth:authorize] Password mismatch for:", credentials.email);
      return null;
    }

    console.log("[auth:authorize] Login successful:", credentials.email);
    return {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
    };
  } catch (error) {
    console.error("[auth:authorize] Error during login:", error);
    return null;
  }
}

export const { handlers, auth, signIn, signOut } = NextAuth({
  ...authConfig,
  providers: [
    Credentials({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      authorize,
    }),
  ],
});
