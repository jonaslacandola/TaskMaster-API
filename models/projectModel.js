import { model, Schema } from "mongoose";

import { taskSchema } from "./taskModel.js";

const projectSchema = Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: [true, "A project should have a user"],
    },
    title: {
      type: String,
      default: "Untitled Project",
    },
    description: String,
    status: {
      type: String,
      default: "not started",
      enum: ["not started", "inactive", "in progress", "completed"],
      required: [true, "A project should have a status"],
    },
    priority: {
      type: String,
      enum: ["low", "medium", "high"],
      default: "medium",
    },
    tasks: [taskSchema],
    endDate: Date,
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
    timestamps: true,
  }
);

projectSchema.virtual("tasksCompleted").get(function () {
  return this.tasks.filter((task) => task.status === "completed").length;
});

const Project = model("Project", projectSchema);

export default Project;
