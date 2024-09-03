import { Schema } from "mongoose";

export const taskSchema = new Schema(
  {
    title: {
      type: String,
      default: "Untitled Task",
      required: [true, "A task should have a title"],
    },
    description: {
      type: String,
      required: [true, "A task should have content"],
    },
    comments: [String],
    status: {
      type: String,
      enum: ["pending", "in progress", "completed"],
      default: "pending",
    },
    priority: {
      type: String,
      enum: ["low", "medium", "high"],
      default: "medium",
    },
  },
  { timestamps: true }
);

taskSchema.virtual("lastSession").get(function () {
  const update = new Date(this.updatedAt);
  const now = Date.now();
  const diff = now - update;
  return `${diff} ms ago`;
});
