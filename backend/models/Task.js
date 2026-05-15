import mongoose from "mongoose";

const { Schema } = mongoose;
const ObjectId = Schema.Types.ObjectId;

const taskSchema = new Schema(
  {
    projectId: { type: ObjectId, ref: "Project", required: true },
    title: { type: String, required: true, trim: true, maxlength: 150 },
    description: { type: String, default: "", trim: true, maxlength: 2000 },
    assignedTo: [{ type: ObjectId, ref: "User" }],
    assignedBy: { type: ObjectId, ref: "User", required: true },
    deadline: { type: Date, default: null },
    status: {
      type: String,
      enum: ["todo", "in-progress", "completed"],
      default: "todo",
    },
    priority: {
      type: String,
      enum: ["low", "medium", "high"],
      default: "medium",
    },
    completedBy: { type: ObjectId, ref: "User", default: null },
  },
  { timestamps: true },
);

taskSchema.index({ projectId: 1, createdAt: -1 });

const Task = mongoose.model("Task", taskSchema);
export default Task;
