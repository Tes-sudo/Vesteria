import { ConvexReactClient } from "convex/react";
import { Env } from "@env";

// Initialize Convex client with the URL from environment
export const convex = new ConvexReactClient(Env.EXPO_PUBLIC_CONVEX_URL);