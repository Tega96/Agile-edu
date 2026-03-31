import NextAuth, { AuthOptions, Session, User } from 'next-auth';
import GoogleProvider from "next-auth/providers/google";
import FacebookProvider from "next-auth/providers/facebook";
import AppleProvider from "next-auth/providers/apple";
import CredentialsProvider from "next-auth/providers/credentials";
import { SupabaseAdapter } from "@auth/supabase-adapter";
import { createClient, SupabaseClient } from "@supabase/supabase-js";
// import { adapter } from 'next/dist/server/web/adapter';

const supabaseUrl = process.env.SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

const supabase: SupabaseClient = createClient(supabaseUrl, supabaseKey)

export const authOptions: AuthOptions = {
    providers: [
        GoogleProvider({ clientId: process.env.GOOGLE_ID!, clientSecret: process.env.GOOGLE_SECRET! }),
        FacebookProvider({ clientId: process.env.FACEBOOK_ID!, clientSecret: process.env.FACEBOOK_SECRET! }),
        AppleProvider({ clientId: process.env.APPLE_ID!, clientSecret: process.env.APPLE_SECRET! }),
        CredentialsProvider({ 
            name: "Credentials",
            credentials: {
                username: { label: "Username/Email/Phone", type: "text" },
                password: { label: "Password", type: "password" }
            },
            async authorize(credentials) {
                // Check Supabase auth
                if (!credentials?.username || !credentials?.password) return null;
                const { data, error } = await supabase.auth.signInWithPassword({
                    email: credentials.username, // allow phone later
                    password: credentials.password
                });

                if (error || !data.user) return null;
                return {
                    id: data.user.id,
                    email: data.user.email,
                    name: data.user.user_metadata?.full_name
                } as User;
            }
        })
    ],
    adapter: SupabaseAdapter({
        url: supabaseUrl,
        secret: supabaseKey,
    }),
    callbacks: {
        async session({ session, user }) {
            // Add custom fileds to session
            const {data: profile } = await supabase.from("profiles").select("*").eq("id", user.id).single();
            session.user = { ...session.user, profile };
            return session as Session;
        }
    },
    session: { strategy: "jwt"},
    pages: { signIn: "/auth/signin"}
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };