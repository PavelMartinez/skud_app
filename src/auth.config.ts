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
    },
    theme: {
        colorScheme: "light"
    }
} satisfies NextAuthConfig