import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { nextCookies } from "better-auth/next-js";
import { anonymous } from "better-auth/plugins";
import prisma from "./prisma";

export const auth = betterAuth({
  database: prismaAdapter(prisma, {
    provider: "postgresql",
  }),
  emailAndPassword: {
    enabled: true,
  },
  socialProviders: {
    github: {
      clientId: process.env.GITHUB_CLIENT_ID as string,
      clientSecret: process.env.GITHUB_CLIENT_SECRET as string,
    },
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    },
  },
  anonymous: {
    enabled: true,
    autoSignIn: true,
    session: {
      maxAge: 30 * 24 * 60 * 60, // 30 days
    },
  },
  account: {
    accountLinking: {
      enabled: true,
      updateUserInfoOnLink: true,
    },
  },
  user: {
    additionalFields: {
      isAnonymous: {
        type: "boolean",
        defaultValue: false,
        required: false,
        input: false,
      },
    },
  },
  plugins: [
    nextCookies(),
    anonymous({
      onLinkAccount: async ({ anonymousUser, newUser }) => {
        console.log(
          `🔄 Transferring data from ${anonymousUser.user.id} to ${newUser.user.id}`,
        );
        await prisma.user.update({
          where: { id: anonymousUser.user.id },
          data: {
            id: newUser.user.id,
            createdAt: newUser.user.createdAt,
            updatedAt: newUser.user.updatedAt,
            email: newUser.user.email,
            name: newUser.user.name,
            emailVerified: newUser.user.emailVerified,
            image: newUser.user.image,
            isAnonymous: false,
          },
        });
      },
    }),
  ],
});
export type Session = typeof auth.$Infer.Session;
export type User = typeof auth.$Infer.Session.user;
