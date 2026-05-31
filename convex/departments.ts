import { v } from "convex/values";
import { query } from "./_generated/server";

export const getDepartmentById = query({
  args: { id: v.id("departments") },
  handler: async (ctx, args) => {
    const department = await ctx.db.get(args.id);
    if (!department) throw new Error("Department not found");

    return department;
  },
});
