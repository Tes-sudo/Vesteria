import { convexAuth } from "@convex-dev/auth/server";
import Resend from "@auth/core/providers/resend";
import { query } from "./_generated/server";

export const { auth, signIn, signOut, store, isAuthenticated } = convexAuth({
  providers: [Resend],
});

// Get the current authenticated user
export const viewer = query({
  args: {},
  handler: async (ctx) => {
    const userId = await ctx.auth.getUserIdentity();
    if (!userId) return null;
    
    // Get user from database
    const user = await ctx.db.query("users").filter(q => q.eq(q.field("email"), userId.email)).first();
    return user;
  },
});