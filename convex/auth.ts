import ConvexCredentials from "@convex-dev/auth/providers/ConvexCredentials";
import { convexAuth, createAccount, retrieveAccount } from "@convex-dev/auth/server";
import { ConvexError } from "convex/values";
import type { DataModel } from "./_generated/dataModel";

const credentialsProvider = ConvexCredentials<DataModel>({
  id: "admin-credentials",
  authorize: async (credentials, ctx) => {
    const email = String(credentials.email ?? "").trim().toLowerCase();
    const password = String(credentials.password ?? "");
    const flow = credentials.flow === "signUp" ? "signUp" : "signIn";
    const name = String(credentials.name ?? "").trim();

    if (!email) {
      throw new ConvexError("Email is required.");
    }

    if (password.length < 8) {
      throw new ConvexError("Password must be at least 8 characters.");
    }

    if (flow === "signUp") {
      const existingUsers = await ctx.db.query("users").collect();
      if (existingUsers.length > 0) {
        throw new ConvexError("The initial admin account has already been created.");
      }

      const { user } = await createAccount(ctx, {
        provider: "admin-credentials",
        account: {
          id: email,
          secret: password,
        },
        profile: {
          email,
          name: name || "Peter Car Rental Admin",
          role: "superAdmin",
          createdAt: Date.now(),
          updatedAt: Date.now(),
        },
        shouldLinkViaEmail: true,
      });

      return { userId: user._id };
    }

    const result = await retrieveAccount(ctx, {
      provider: "admin-credentials",
      account: {
        id: email,
        secret: password,
      },
    });

    if (!result) {
      throw new ConvexError("Invalid email or password.");
    }

    return { userId: result.user._id };
  },
});

export const { auth, signIn, signOut, store, isAuthenticated } = convexAuth({
  providers: [credentialsProvider],
});
