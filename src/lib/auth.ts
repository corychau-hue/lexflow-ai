import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { authConfig } from "./auth.config";

async function authorize(
  credentials: Partial<Record<string, unknown>>
): Promise<{ id: string; email: string; name: string; role: string } | null> {
  if (!credentials?.email || !credentials?.password) return null;

  const { prisma } = await import("@/lib/prisma");

  const user = await prisma.user.findUnique({
    where: { email: credentials.email as string },
  });

  if (!user) return null;
  if (!user.isActive) return null;

  const { compare } = await import("bcryptjs");
  const isValid = await compare(
    credentials.password as string,
    user.passwordHash
  );
  if (!isValid) return null;

  return {
    id: user.id,
    email: user.email,
    name: user.name,
    role: user.role,
  };
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
