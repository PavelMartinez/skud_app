import database from "@/database/database";
import SequelizeAdapter from "@auth/sequelize-adapter";
import NextAuth, { NextAuthConfig } from "next-auth"
import { Adapter } from "next-auth/adapters";
import Credentials from "next-auth/providers/credentials"
import authConfig from "./auth.config";

const authOptions = {
    ...authConfig,
    providers: [
        Credentials({
            credentials: {
                username: { label: "Username", type: "text" },
                password: { label: "Password", type: "password" }
            },
            // @ts-ignore
            async authorize(credentials, _req) {
                if(!credentials?.username || !credentials?.password)
                {
                    return null;
                }

                const user = await database.models.Users.findOne({ where: { username: credentials.username } });

                console.log(credentials)
                if (user && credentials) {
                    const bcrypt = require("bcrypt");
                    const passwordsMatch = await bcrypt.compare(credentials.password, user.hashedPassword || "");
                    console.log(passwordsMatch)
                    if(!passwordsMatch) return null;

                    return user;
                } else {
                    return null;
                }
            }
        })
    ],
    adapter: SequelizeAdapter(database.sequelize, {
        models: {
            // @ts-ignore
            User: database.models.Users,
        }
    }) as Adapter,
}
 
// @ts-ignore
export const { auth, handlers, signIn, signOut } = NextAuth(authOptions) as never