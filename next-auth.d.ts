import NextAuth, { DefaultSession } from "next-auth"

export enum Role {
  1 = "1",
  2 = "2",
  3 = "3",
  4 = "4"
}

declare module "next-auth" {
  interface User {
    role?: Role,
    hashedPassword?: string,
    surname?: string,
    lastname?: string,
    gender?: string
  }
  

  interface Session extends DefaultSession {
    user: User;
  }
}

declare module "next-auth/jwt" {
    interface JWT {
        role?: Role,
        hashedPassword?: string,
        surname?: string,
        lastname?: string,
        gender?: string
    }
}