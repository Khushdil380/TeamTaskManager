import mongoose from "mongoose";

const projectSchema = new mongoose.Schema(
  {
    adminId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    title: {
      type: String,
      required: [true, "Project title is required"],
      trim: true,
    },
    description: {
      type: String,
      required: [true, "Description is required"],
      minlength: [120, "Description must be at least 120 characters"],
      maxlength: [200, "Description cannot exceed 200 characters"],
      trim: true,
    },
    priority: {
      type: String,
      enum: ["low", "medium", "high"],
      default: "medium",
    },
    dueDate: {
      type: Date,
      default: null,
    },
    status: {
      type: String,
      enum: ["in-progress", "completed", "on-hold", "cancelled"],
      default: "in-progress",
    },
    color: {
      type: Number,
      default: 1,
      min: 1,
      max: 8,
    },
    members: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
  },
  { timestamps: true },
);

const Project = mongoose.model("Project", projectSchema);
export default Project;
