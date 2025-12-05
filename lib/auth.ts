import {
  checkout,
  polar,
  portal,
  usage,
  webhooks,
} from "@polar-sh/better-auth";
import { Polar } from "@polar-sh/sdk";
import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { nextCookies } from "better-auth/next-js";
import { anonymous } from "better-auth/plugins";
import prisma from "./prisma";

const polarClient = new Polar({
  accessToken: process.env.POLAR_ACCESS_TOKEN!,
  server: "sandbox",
});

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
          `🔄 Transferring data from ${anonymousUser.user.id} to ${newUser.user.id}`,
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

          const anonymousUserData = await prisma.user.findUnique({
            where: { id: anonymousUser.user.id },
            select: { subscription: true },
          });

          if (
            anonymousUserData?.subscription &&
            anonymousUserData.subscription !== "FREE"
          ) {
            await prisma.user.update({
              where: { id: newUser.user.id },
              data: {
                subscription: anonymousUserData.subscription,
                updatedAt: new Date(),
              },
            });

            console.log(
              `✅ Transferred ${anonymousUserData.subscription} subscription to authenticated user`,
            );
          }
        } catch (error) {
          console.error("❌ Error transferring data:", error);
        }
      },
    }),
    polar({
      client: polarClient,
      createCustomerOnSignUp: true,
      use: [
        checkout({
          products: [
            {
              productId: "c24ea16e-2ac8-42b4-945c-86ec7df65357",
              slug: "PRO",
            },
            {
              productId: "6181ba61-ba3d-473b-9334-c32a9a68438f",
              slug: "ENTERPRISE",
            },
          ],
          successUrl: "/success?checkout_id={CHECKOUT_ID}",
          authenticatedUsersOnly: true,
        }),
        portal(),
        usage(),
        webhooks({
          secret: process.env.POLAR_WEBHOOK_SECRET!,
          onCustomerStateChanged: async (payload) => {
            console.log("Customer state changed:", payload);
          },
          onOrderPaid: async (payload: any) => {
            console.log("📦 Order paid:", payload);

            try {
              const event = payload;
              const userId =
                event.userId || event.user_id || event.data?.user_id;
              const productId = event.data?.product_id || event.productId;

              let plan: SubscriptionPlan = SubscriptionPlan.PRO;
              if (productId === "f8cf99ba-d481-40a2-9605-d97192640cb8") {
                plan = SubscriptionPlan.ENTERPRISE;
              }

              if (!userId) {
                console.error("❌ No user ID found in payload");
                return;
              }

              await prisma.user.update({
                where: { id: userId },
                data: {
                  subscription: plan,
                  updatedAt: new Date(),
                },
              });

              console.log(
                `✅ Subscription upgraded to ${plan} for user:`,
                userId,
              );
            } catch (error) {
              console.error("❌ Error saving subscription:", error);
            }
          },
          onSubscriptionCreated: async (payload: any) => {
            console.log("🎉 Subscription created:", payload);

            try {
              const event = payload;
              const userId =
                event.userId || event.user_id || event.data?.user_id;
              const productId = event.data?.product_id || event.productId;

              let plan: SubscriptionPlan = SubscriptionPlan.PRO;
              if (productId === "f8cf99ba-d481-40a2-9605-d97192640cb8") {
                plan = SubscriptionPlan.ENTERPRISE;
              }

              if (!userId) {
                console.error(
                  "❌ No user ID found in subscription created payload",
                );
                return;
              }

              await prisma.user.update({
                where: { id: userId },
                data: {
                  subscription: plan,
                  updatedAt: new Date(),
                },
              });

              console.log(
                `✅ Subscription ${plan} activated for user:`,
                userId,
              );
            } catch (error) {
              console.error("❌ Error activating subscription:", error);
            }
          },
          onSubscriptionUpdated: async (payload: any) => {
            console.log("🔄 Subscription updated:", payload);

            try {
              const event = payload;
              const userId =
                event.userId || event.user_id || event.data?.user_id;
              const productId = event.data?.product_id || event.productId;

              let plan: SubscriptionPlan = SubscriptionPlan.PRO;
              if (productId === "f8cf99ba-d481-40a2-9605-d97192640cb8") {
                plan = SubscriptionPlan.ENTERPRISE;
              }

              if (!userId) {
                console.error(
                  "❌ No user ID found in subscription updated payload",
                );
                return;
              }

              await prisma.user.update({
                where: { id: userId },
                data: {
                  subscription: plan,
                  updatedAt: new Date(),
                },
              });

              console.log(
                `✅ Subscription updated to ${plan} for user:`,
                userId,
              );
            } catch (error) {
              console.error("❌ Error updating subscription:", error);
            }
          },
          onSubscriptionCanceled: async (payload: any) => {
            console.log("❌ Subscription canceled:", payload);

            try {
              const event = payload;
              const userId =
                event.userId || event.user_id || event.data?.user_id;

              if (!userId) {
                console.error(
                  "❌ No user ID found in subscription canceled payload",
                );
                return;
              }

              // Downgrade user to FREE plan
              await prisma.user.update({
                where: { id: userId },
                data: {
                  subscription: SubscriptionPlan.FREE,
                  updatedAt: new Date(),
                },
              });

              console.log("✅ User downgraded to FREE plan:", userId);
            } catch (error) {
              console.error("❌ Error cancelling subscription:", error);
            }
          },
          onSubscriptionRevoked: async (payload: any) => {
            console.log("⛔ Subscription revoked:", payload);

            try {
              const event = payload;
              const userId =
                event.userId || event.user_id || event.data?.user_id;

              if (!userId) {
                console.error(
                  "❌ No user ID found in subscription revoked payload",
                );
                return;
              }

              // Downgrade user to FREE plan (payment failed or chargeback)
              await prisma.user.update({
                where: { id: userId },
                data: {
                  subscription: SubscriptionPlan.FREE,
                  updatedAt: new Date(),
                },
              });

              console.log("✅ User downgraded to FREE plan (revoked):", userId);
            } catch (error) {
              console.error("❌ Error revoking subscription:", error);
            }
          },
          onSubscriptionActive: async (payload: any) => {
            console.log("✅ Subscription active:", payload);
            // Optional: You can add additional logic here if needed
          },
          onPayload: async (payload) => {
            console.log("📨 Webhook payload received:", payload);
          },
        }),
      ],
    }),
  ],
});

export type Session = typeof auth.$Infer.Session;
export type User = typeof auth.$Infer.Session.user;
