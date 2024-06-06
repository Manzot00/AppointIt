import CredentialsProvider from "next-auth/providers/credentials"
import { PrismaAdapter } from "@next-auth/prisma-adapter"
import { NextAuthOptions } from "next-auth"
import db from "./db"
import bcrypt from "bcrypt"

export const authOptions: NextAuthOptions = {
    adapter: PrismaAdapter(db),
    secret: process.env.NEXTAUTH_SECRET,
    session: {
        strategy: 'jwt'
    },
    pages: {
        signIn: '/login',
    },
    providers: [
        CredentialsProvider({
          // The name to display on the sign in form (e.g. 'Sign in with...')
          name: 'Credentials',
          // The credentials is used to generate a suitable form on the sign in page.
          // You can specify whatever fields you are expecting to be submitted.
          // e.g. domain, username, password, 2FA token, etc.
          // You can pass any HTML attribute to the <input> tag through the object.
          credentials: {
            email: { label: "Email", type: "email", placeholder: "example@mail.com" },
            password: { label: "Password", type: "password" }
          },
          async authorize(credentials) {
            //console.log('Authorize called with credentials:', credentials);

            if (!credentials?.email || !credentials?.password) {
                console.error('Missing email or password');
                return null
            }
            const existingUser = await db.user.findUnique({
                where: { email: credentials.email }
            })
            if (!existingUser) {
                console.error('No user found with email:', credentials.email);
                return null
            }

            const passwordMatch = await bcrypt.compare(credentials.password, existingUser.password)
            if (!passwordMatch) {
                console.error('Password does not match for user:', credentials.email);
                return null
            }

            console.log('User authenticated:', {
                id: existingUser.id,
                username: existingUser.username,
                email: existingUser.email
              });

            return {
                id: existingUser.id,
                username: existingUser.username,
                email: existingUser.email
            }
          }
        })
      ],

      callbacks: {
        async session({ session, token }) {
            //console.log('Session callback called with session:', session, 'and token:', token);
            return {
                ...session,
                user: {
                    ...session.user,
                    username: token.username,
                    id: token.id
                }
            }
          },
        async jwt({ token, user }) {
            //console.log('JWT callback called with token:', token, 'and user:', user);
            if(user){
                return{
                    ...token,
                    username: user.username,
                    id: user.id
                }
            }
            return token
        }
      }
}