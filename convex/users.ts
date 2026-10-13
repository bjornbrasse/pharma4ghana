import { ConvexError, v } from "convex/values";
import { internalAction } from "./_generated/server";
import { createAuth } from "./auth";

// Run from the Convex dashboard. Only enabled while ALLOW_CREATE_USER=true is set
// on the deployment; remove the variable again once the account exists.
export const create = internalAction({
  args: {
    email: v.string(),
    password: v.string(),
    name: v.string(),
  },
  returns: v.string(),
  handler: async (ctx, args) => {
    if (process.env.ALLOW_CREATE_USER !== "true") {
      throw new ConvexError("User creation is disabled. Set ALLOW_CREATE_USER=true to enable it.");
    }

    const { user } = await createAuth(ctx, { allowSignUp: true }).api.signUpEmail({
      body: {
        email: args.email.trim().toLowerCase(),
        password: args.password,
        name: args.name,
      },
    });

    return user.id;
  },
});
