import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  users: defineTable({
    clerkId: v.string(), // from Clerk
    email: v.string(),
    name: v.string(),
    phone: v.optional(v.string()),
    avatarUrl: v.optional(v.string()),
    role: v.union(
      v.literal("hr_admin"),
      v.literal("dept_head"),
      v.literal("employee"),
    ),
    employeeId: v.string(), // for display, not auth
    departmentId: v.optional(v.id("departments")),
    reportingTo: v.optional(v.id("users")), // dept head's ID
    isActive: v.boolean(),
    joinedAt: v.number(), // timestamp
    expoPushToken: v.optional(v.string()), // for mobile push
    worksheets: v.optional(v.array(v.id("worksheets"))), // for quick access to user's sheets
  })
    .index("by_clerk", ["clerkId"])
    .index("by_department", ["departmentId"]),

  departments: defineTable({
    name: v.string(), // "Flight Ops", "Engineering"
    headId: v.optional(v.id("users")),
    description: v.optional(v.string()),
    createdAt: v.string(),
  }),

  attendance: defineTable({
    userId: v.id("users"),
    date: v.string(), // "2025-05-26" ISO date key
    checkInTime: v.optional(v.number()),
    checkOutTime: v.optional(v.number()),
    status: v.union(
      v.literal("present"),
      v.literal("absent"),
      v.literal("late"),
      v.literal("half_day"),
      v.literal("on_leave"),
      v.literal("wfh"),
      v.literal("holiday"),
    ),
    checkInLocation: v.optional(
      v.object({
        lat: v.number(),
        lng: v.number(), // GPS for field ops
      }),
    ),
    checkOutLocation: v.optional(
      v.object({
        lat: v.number(),
        lng: v.number(),
      }),
    ),
    overrideBy: v.optional(v.id("users")), // HR manual override
    notes: v.optional(v.string()),
    hoursWorked: v.optional(v.number()), // computed
  })
    .index("by_user_date", ["userId", "date"])
    .index("by_date", ["date"]),

  leaveRequests: defineTable({
    userId: v.id("users"),
    type: v.union(
      v.literal("annual"),
      v.literal("sick"),
      v.literal("casual"),
      v.literal("emergency"),
      v.literal("maternity"),
      v.literal("paternity"),
      v.literal("unpaid"),
      v.literal("compensatory"), // drone ops often do comp-off
    ),
    fromDate: v.string(),
    toDate: v.string(),
    totalDays: v.number(),
    reason: v.string(),
    attachmentUrl: v.optional(v.string()), // Cloudinary doc
    status: v.union(
      v.literal("pending_head"), // waiting on dept head
      v.literal("pending_hr"), // head approved, waiting HR
      v.literal("approved"),
      v.literal("rejected"),
      v.literal("cancelled"),
    ),
    deptHeadApproval: v.optional(
      v.object({
        approvedBy: v.id("users"),
        approvedAt: v.number(),
        comment: v.optional(v.string()),
      }),
    ),
    hrApproval: v.optional(
      v.object({
        approvedBy: v.id("users"),
        approvedAt: v.number(),
        comment: v.optional(v.string()),
      }),
    ),
    createdAt: v.number(),
  })
    .index("by_user", ["userId"])
    .index("by_status", ["status"])
    .index("by_dept_head", ["userId", "status"]),

  leaveBalances: defineTable({
    userId: v.id("users"),
    year: v.number(),
    annual: v.object({
      total: v.number(),
      used: v.number(),
      pending: v.number(),
    }),
    sick: v.object({
      total: v.number(),
      used: v.number(),
      pending: v.number(),
    }),
    casual: v.object({
      total: v.number(),
      used: v.number(),
      pending: v.number(),
    }),
    compensatory: v.object({ earned: v.number(), used: v.number() }),
  }).index("by_user_year", ["userId", "year"]),

  announcements: defineTable({
    title: v.string(),
    body: v.string(),
    priority: v.union(v.literal("normal"), v.literal("urgent")),
    targetRole: v.optional(
      v.union(
        v.literal("all"),
        v.literal("hr_admin"),
        v.literal("dept_head"),
        v.literal("employee"),
      ),
    ),
    targetDeptId: v.optional(v.id("departments")),
    createdBy: v.id("users"),
    expiresAt: v.optional(v.number()),
    createdAt: v.number(),
  }),

  worksheets: defineTable({
    userId: v.id("users"),
    date: v.string(),
    tasks: v.string(),
    siteLocation: v.string(),
    hoursWorked: v.number(),
    status: v.union(
      v.literal("draft"),
      v.literal("submitted"),
      v.literal("reviewed"),
    ),
    reviewedBy: v.optional(v.id("users")),
    reviewedAt: v.optional(v.number()),
    submittedAt: v.optional(v.number()),
  })
    .index("by_user", ["userId"])
    .index("by_date", ["date"])
    .index("by_user_date", ["userId", "date"])
    .index("by_status", ["status"]),
});
