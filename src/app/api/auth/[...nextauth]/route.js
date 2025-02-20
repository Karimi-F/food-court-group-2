import { login } from "@/app/lib/utils";
import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

export const authOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text", placeholder: "jsmith@example.com" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Email and password are required");
        }

        const user = await login(credentials.email, credentials.password);

        if (!user) {
          console.log("Invalid credentials");
          throw new Error("Invalid credentials");
        }

        return user; // Ensure this object contains `id`, `name`, `email`, etc.
      },
    }),
  ],
  secret: process.env.NEXTAUTH_SECRET, // Ensure this is set in .env.local
  session: {
    strategy: "jwt", // Use JWT-based sessions
  },
  callbacks: {
    async jwt({ token, user }) {
      // If user exists (during login), store data in JWT
      if (user) {
        token.id = user.id;
        token.name = user.name;
        token.email = user.email;
        token.role = user.role || "user"; // Add any other user fields
      }
      return token;
    },
    async session({ session, token }) {
      // Pass token data to session
      if (token) {
        session.user.id = token.id;
        session.user.name = token.name;
        session.user.email = token.email;
        session.user.role = token.role;
      }
      return session;
    },
  },
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
