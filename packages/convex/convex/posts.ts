import { v } from "convex/values";
import { query, mutation } from "./_generated/server";
import { getAuthUserId } from "@convex-dev/auth/server";

// List all posts with author information
export const list = query({
  args: {},
  handler: async (ctx) => {
    const posts = await ctx.db.query("posts").order("desc").collect();
    
    // Enrich with author data
    const enrichedPosts = await Promise.all(
      posts.map(async (post) => {
        const author = await ctx.db.get(post.authorId);
        return {
          ...post,
          author: author ? {
            id: author._id,
            name: author.name || "Anonymous",
            email: author.email,
          } : null,
        };
      })
    );
    
    return enrichedPosts;
  },
});

// Get single post by ID
export const get = query({
  args: { postId: v.id("posts") },
  handler: async (ctx, { postId }) => {
    const post = await ctx.db.get(postId);
    if (!post) return null;
    
    const author = await ctx.db.get(post.authorId);
    return {
      ...post,
      author: author ? {
        id: author._id,
        name: author.name || "Anonymous",
        email: author.email,
      } : null,
    };
  },
});

// Create a new post
export const create = mutation({
  args: {
    title: v.string(),
    content: v.string(),
  },
  handler: async (ctx, { title, content }) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Not authenticated");
    
    const postId = await ctx.db.insert("posts", {
      title,
      content,
      authorId: userId,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    });
    
    return postId;
  },
});

// Update an existing post
export const update = mutation({
  args: {
    postId: v.id("posts"),
    title: v.optional(v.string()),
    content: v.optional(v.string()),
  },
  handler: async (ctx, { postId, title, content }) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Not authenticated");
    
    const post = await ctx.db.get(postId);
    if (!post) throw new Error("Post not found");
    if (post.authorId !== userId) throw new Error("Not authorized");
    
    await ctx.db.patch(postId, {
      ...(title !== undefined && { title }),
      ...(content !== undefined && { content }),
      updatedAt: Date.now(),
    });
  },
});

// Delete a post
export const remove = mutation({
  args: { postId: v.id("posts") },
  handler: async (ctx, { postId }) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Not authenticated");
    
    const post = await ctx.db.get(postId);
    if (!post) throw new Error("Post not found");
    if (post.authorId !== userId) throw new Error("Not authorized");
    
    await ctx.db.delete(postId);
  },
});