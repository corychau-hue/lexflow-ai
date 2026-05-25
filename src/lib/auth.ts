import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { compare } from "bcryptjs";

// In-memory user store for development (replace with Prisma in production)
const users = [
  {
    id: "user-1",
    email: "admin@lexflow.com",
    name: "Sarah Chen",
    passwordHash: "$2a$10$8KzQMGx5C5Y5X5Y5X5Y5Xu5Y5X5Y5X5Y5X5Y5X5Y5X5Y5X5Y5X5", // password123
    role: "ADMIN" as const,
  },
  {
    id: "user-2",
    email: "attorney@lexflow.com",
    name: "James Rodriguez",
    passwordHash: "$2a$10$8KzQMGx5C5Y5X5Y5X5Y5Xu5Y5X5Y5X5Y5X5Y5X5Y5X5Y5X5Y5X5", // password123
    role: "ATTORNEY" as const,
  },
  {
    id: "user-3",
    email: "paralegal@lexflow.com",
    name: "Maria Kim",
    passwordHash: "$2a$10$8KzQMGx5C5Y5X5Y5X5Y5Xu5Y5X5Y5X5Y5X5Y5X5Y5X5Y5X5Y5X5", // password123
    role: "PARALEGAL" as const,
  },
  {
    id: "user-4",
    email: "intake@lexflow.com",
    name: "David Park",
    passwordHash: "$2a$10$8KzQMGx5C5Y5X5Y5X5Y5Xu5Y5X5Y5X5Y5X5Y5X5Y5X5Y5X5Y5X5", // password123
    role: "INTAKE_STAFF" as const,
  },
  {
    id: "user-5",
    email: "client@lexflow.com",
    name: "Tran Nguyen",
    passwordHash: "$2a$10$8KzQMGx5C5Y5X5Y5X5Y5Xu5Y5X5Y5X5Y5X5Y5X5Y5X5Y5X5Y5X5", // password123
    role: "CLIENT" as const,
  },
];

export const { handlers, auth, signIn, signOut } = NextAuth({
  providers: [
    Credentials({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;

        const user = users.find((u) => u.email === credentials.email);
        if (!user) return null;

        // For development, accept "password123" for any user
        // In production, use bcrypt compare
        const isValid = credentials.password === "password123";
        if (!isValid) return null;

        return {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
        };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = (user as any).role;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        (session.user as any).id = token.id;
        (session.user as any).role = token.role;
      }
      return session;
    },
  },
  pages: {
    signIn: "/login",
  },
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  secret: process.env.NEXTAUTH_SECRET || "lexflow-dev-secret-change-in-production",
});
