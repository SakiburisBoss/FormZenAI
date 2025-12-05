import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { nextCookies } from "better-auth/next-js";
import { anonymous } from "better-auth/plugins";
import prisma from "./prisma";

export enum SubscriptionPlan {
  FREE = "FREE",
  PRO = "PRO",
  ENTERPRISE = "ENTERPRISE",
}

export const auth = betterAuth({
  database: prismaAdapter(prisma, {
    provider: "postgresql",
  }),
  emailAndPassword: {
    enabled: true,
  },
  socialProviders: {
    github: {
      clientId: process.env.GITHUB_CLIENT_ID!,
      clientSecret: process.env.GITHUB_CLIENT_SECRET!,
      mapProfileToUser: (profile) => {
        return {
          name: profile.name || profile.login,
          email: profile.email,
          image: profile.avatar_url,
          emailVerified: true,
        };
      },
    },
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      mapProfileToUser: (profile) => {
        return {
          name: profile.name,
          email: profile.email,
          image: profile.picture,
          emailVerified: profile.email_verified || false,
        };
      },
    },
  },
  anonymous: {
    enabled: true,
    autoSignIn: true,
    session: {
      maxAge: 30 * 24 * 60 * 60, // 7 days
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
      subscription: {
        type: "string",
        defaultValue: "FREE",
        required: false,
        input: false, // Only system can set subscription, not users
      },
      isAnonymous: {
        type: "boolean",
        defaultValue: false,
        required: false,
        input: false, // Only system can set isAnonymous, not users
      },
    },
  },
  plugins: [
    nextCookies(),
    anonymous({
      onLinkAccount: async ({ anonymousUser, newUser }) => {
        console.log(
          `🔄 Transferring forms from ${anonymousUser.user.id} to ${newUser.user.id}`,
        );

        try {
          const transferredForms = await prisma.form.updateMany({
            where: {
              ownerId: anonymousUser.user.id,
            },
            data: {
              ownerId: newUser.user.id,
            },
          });

          console.log(`✅ Transferred ${transferredForms.count} forms`);
        } catch (error) {
          console.error("❌ Error transferring forms:", error);
        }
      },
    }),
  ],
});

// Export inferred types for use throughout the application
export type Session = typeof auth.$Infer.Session;
export type User = typeof auth.$Infer.Session.user;
