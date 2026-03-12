import { createClient, type AuthFunctions, type GenericCtx } from "@convex-dev/better-auth";
import { convex, crossDomain } from "@convex-dev/better-auth/plugins";
import { betterAuth } from "better-auth/minimal";
import { components, internal } from "./_generated/api";
import type { DataModel, Id } from "./_generated/dataModel";
import authConfig from "./auth.config";
import { normalizeEmail } from "./lib/bookings";

const siteUrl = process.env.SITE_URL ?? "http://127.0.0.1:4173";
const trustedOrigins = [
  siteUrl,
  "http://127.0.0.1:4173",
  "http://127.0.0.1:5173",
  "http://localhost:4173",
  "http://localhost:5173",
].filter((v, i, a) => a.indexOf(v) === i);
const authFunctions: AuthFunctions = internal.auth;

async function syncAppUserFromAuthUser(
  ctx: GenericCtx<DataModel>,
  authUser: {
    _id: string;
    email: string;
    name: string;
  },
) {
  const email = normalizeEmail(authUser.email);
  const existingLinkedUser = await ctx.db
    .query("users")
    .withIndex("by_authUserId", (q) => q.eq("authUserId", authUser._id))
    .unique();

  if (existingLinkedUser) {
    await ctx.db.patch(existingLinkedUser._id, {
      email,
      name: authUser.name,
      updatedAt: Date.now(),
    });
    await authComponent.setUserId(ctx, authUser._id, existingLinkedUser._id);
    return existingLinkedUser._id;
  }

  const matchingUsers = await ctx.db
    .query("users")
    .withIndex("email", (q) => q.eq("email", email))
    .collect();
  const legacyUser = matchingUsers.find((user) => !user.authUserId);
  const hasLinkedAdmin = (await ctx.db.query("users").collect()).some((user) => Boolean(user.authUserId && user.role));
  const role = legacyUser?.role ?? (hasLinkedAdmin ? undefined : "superAdmin");

  let userId: Id<"users">;
  if (legacyUser) {
    await ctx.db.patch(legacyUser._id, {
      authUserId: authUser._id,
      email,
      name: authUser.name,
      role: legacyUser.role ?? role,
      updatedAt: Date.now(),
    });
    userId = legacyUser._id;
  } else {
    userId = await ctx.db.insert("users", {
      authUserId: authUser._id,
      email,
      name: authUser.name,
      role,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    });
  }

  await authComponent.setUserId(ctx, authUser._id, userId);
  return userId;
}

export const authComponent = createClient<DataModel>(components.betterAuth, {
  authFunctions,
  triggers: {
    user: {
      onCreate: async (ctx, doc) => {
        await syncAppUserFromAuthUser(ctx, {
          _id: doc._id,
          email: doc.email,
          name: doc.name,
        });
      },
      onUpdate: async (ctx, newDoc) => {
        await syncAppUserFromAuthUser(ctx, {
          _id: newDoc._id,
          email: newDoc.email,
          name: newDoc.name,
        });
      },
      onDelete: async (ctx, doc) => {
        const existingLinkedUser = await ctx.db
          .query("users")
          .withIndex("by_authUserId", (q) => q.eq("authUserId", doc._id))
          .unique();

        if (!existingLinkedUser) {
          return;
        }

        await ctx.db.patch(existingLinkedUser._id, {
          authUserId: undefined,
          updatedAt: Date.now(),
        });
      },
    },
  },
});

const authSecret =
  process.env.BETTER_AUTH_SECRET ||
  (process.env.NODE_ENV !== "production"
    ? "dev-placeholder-set-BETTER_AUTH_SECRET-in-convex-dashboard"
    : undefined);
if (!process.env.BETTER_AUTH_SECRET && process.env.NODE_ENV !== "production") {
  console.warn(
    "[Better Auth] BETTER_AUTH_SECRET is not set. Set it with: npx convex env set BETTER_AUTH_SECRET=$(openssl rand -base64 32)",
  );
}

export const createAuth = (ctx: GenericCtx<DataModel>) => {
  return betterAuth({
    database: authComponent.adapter(ctx),
    secret: authSecret,
    trustedOrigins,
    emailAndPassword: {
      enabled: true,
      requireEmailVerification: false,
    },
    plugins: [crossDomain({ siteUrl }), convex({ authConfig })],
  });
};

export const { getAuthUser } = authComponent.clientApi();
export const { onCreate, onUpdate, onDelete } = authComponent.triggersApi();
