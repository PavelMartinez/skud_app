import type { NextAuthConfig } from "next-auth"

export default {
    providers: [],
    session: {
        strategy: "jwt"
    },
    callbacks: {
        authorized({ auth }) {
            const isAuthenticated = !!auth?.user;

            return isAuthenticated;
        },
        async jwt({ token, account, user }) {
            /* Step 1: update the token based on the user object */
            if (user) {
                token.surname = user.surname;
                token.lastname = user.lastname;
                token.role = user.role;
                token.id = user.id;
            }
            return Promise.resolve(token)
        },
        // @ts-ignore
        async session({ session, token, user }) {
            /* Step 2: update the session.user based on the token object */
            if(token.sub && session.user)
            {
                return {
                    ...session,
                    user: {
                        ...session.user,
                        role: token.role,
                        surname: token.surname,
                        lastname: token.lastname,
                        gender: token.gender,
                        id: token.id
                    },
                }
            }
            return session;   
        }
    },
    theme: {
        colorScheme: "light"
    }
} satisfies NextAuthConfig