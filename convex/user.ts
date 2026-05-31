import { v } from "convex/values";
import { mutation, MutationCtx, query, QueryCtx } from "./_generated/server";

export const createUsers = mutation({
  args: {
    username: v.string(),
    email: v.string(),
    image: v.string(),
    clerkId: v.string(),
  },
  handler: async (ctx, args) => {
    const existingUser = await ctx.db
      .query("users")
      .withIndex("by_clerk", (q) => q.eq("clerkId", args.clerkId))
      .first();

    if (existingUser) return;

    await ctx.db.insert("users", {
      clerkId: args.clerkId,
      email: args.email,
      name: args.username,
      avatarUrl: args.image,
      role: "employee",
      isActive: true,
      joinedAt: Date.now(),
      employeeId: `EMP${Math.floor(10000 + Math.random() * 90000)}`,
    });
  },
});

export const getUserByClerkId = query({
  args: {
    clerkId: v.string(),
  },
  handler: async (ctx, args) => {
    const user = await ctx.db
      .query("users")
      .withIndex("by_clerk", (q) => q.eq("clerkId", args.clerkId))
      .unique();
    if (!user) throw new Error("User not found");

    return user;
  },
});

export const getAuthendicatedUser = async (ctx: QueryCtx | MutationCtx) => {
  const identity = await ctx.auth.getUserIdentity();
  console.log("Authenticated user identity:", identity);
  if (!identity) throw new Error("Unauthorized");

  const currentUser = await ctx.db
    .query("users")
    .withIndex("by_clerk", (q) => q.eq("clerkId", identity.subject))
    .first();

  if (!currentUser) throw new Error("User not Found");

  return currentUser;
};

export const updateProfile = mutation({
  args: {
    name: v.optional(v.string()),
    role: v.optional(
      v.union(
        v.literal("hr_admin"),
        v.literal("dept_head"),
        v.literal("employee"),
      ),
    ),
    departmentId: v.optional(v.id("departments")),
    reportingTo: v.optional(v.id("users")),
    expoPushToken: v.optional(v.string()),
    phone: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const currentUser = await getAuthendicatedUser(ctx);

    await ctx.db.patch(currentUser._id, {
      name: args.name || currentUser.name,
      role: args.role || currentUser.role,
      departmentId: args.departmentId || currentUser.departmentId,
      reportingTo: args.reportingTo || currentUser.reportingTo,
      expoPushToken: args.expoPushToken || currentUser.expoPushToken,
      phone: args.phone || currentUser.phone,
    });
  },
});
