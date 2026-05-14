import mongoose from "mongoose";

const teamMemberSchema = new mongoose.Schema(
  {
    adminId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    memberId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    priority: {
      type: String,
      enum: ["low", "medium", "high"],
      default: "medium",
    },
  },
  { timestamps: true },
);

// Prevent duplicate admin–member pairs
teamMemberSchema.index({ adminId: 1, memberId: 1 }, { unique: true });

const TeamMember = mongoose.model("TeamMember", teamMemberSchema);

export default TeamMember;
