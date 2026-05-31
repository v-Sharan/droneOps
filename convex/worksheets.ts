import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

export const getByUserAndDate = query({
  args: { userId: v.id("users"), date: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("worksheets")
      .withIndex("by_user_date", (q) =>
        q.eq("userId", args.userId).eq("date", args.date),
      )
      .unique();
  },
});

export const getByUser = query({
  args: { id: v.id("users") },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("worksheets")
      .withIndex("by_user", (q) => q.eq("userId", args.id))
      .order("desc")
      .take(30);
  },
});

export const getPendingReview = query({
  args: {},
  handler: async (ctx) => {
    const sheets = await ctx.db
      .query("worksheets")
      .withIndex("by_status", (q) => q.eq("status", "submitted"))
      .order("desc")
      .take(50);

    return await Promise.all(
      sheets.map(async (sheet) => {
        const user = await ctx.db.get(sheet.userId);
        return { ...sheet, user };
      }),
    );
  },
});

export const saveDraft = mutation({
  args: {
    userId: v.id("users"),
    date: v.string(),
    tasks: v.string(),
    siteLocation: v.string(),
    hoursWorked: v.number(),
    remarks: v.optional(v.string()),
    equipmentUsed: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const existing = await ctx.db
      .query("worksheets")
      .withIndex("by_user_date", (q) =>
        q.eq("userId", args.userId).eq("date", args.date),
      )
      .unique();

    if (existing) {
      if (existing.status === "submitted" || existing.status === "reviewed") {
        throw new Error("Worksheet already submitted");
      }
      await ctx.db.patch(existing._id, { ...args, status: "draft" });
      return existing._id;
    }

    return await ctx.db.insert("worksheets", { ...args, status: "draft" });
  },
});

export const submitWorksheet = mutation({
  args: { worksheetId: v.id("worksheets") },
  handler: async (ctx, args) => {
    const sheet = await ctx.db.get(args.worksheetId);
    if (!sheet) throw new Error("Worksheet not found");
    if (sheet.status === "submitted") throw new Error("Already submitted");
    await ctx.db.patch(args.worksheetId, {
      status: "submitted",
      submittedAt: Date.now(),
    });
  },
});

// export const reviewWorksheet = mutation({
//   args: {
//     worksheetId: v.id("worksheets"),
//     hrRemark: v.string(),
//     reviewedBy: v.id("users"),
//   },
//   handler: async (ctx, args) => {
//     await ctx.db.patch(args.worksheetId, {
//       status: "reviewed",
//       reviewedBy: args.reviewedBy,
//       reviewedAt: Date.now(),
//     });
//   },
// });
