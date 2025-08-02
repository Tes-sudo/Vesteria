import { convexAuth } from "@convex-dev/auth/server";
import { ResendMagicLink } from "./ResendMagicLink";

export const { auth, signIn, signOut, store, isAuthenticated } = convexAuth({
  providers: [ResendMagicLink],
});