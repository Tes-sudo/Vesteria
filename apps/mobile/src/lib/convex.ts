import { Env } from '@env';
import { ConvexReactClient } from 'convex/react';

// Initialize Convex client with the URL from environment
export const convex = new ConvexReactClient(Env.EXPO_PUBLIC_CONVEX_URL);
