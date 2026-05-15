import mongoose from "mongoose";

const { Schema } = mongoose;
const ObjectId = Schema.Types.ObjectId;

const messageSchema = new Schema(
  {
    projectId: { type: ObjectId, ref: "Project", required: true },
    sender: { type: ObjectId, ref: "User", required: true },
    content: { type: String, required: true, trim: true, maxlength: 1000 },
  },
  { timestamps: true },
);

messageSchema.index({ projectId: 1, createdAt: 1 });

const Message = mongoose.model("Message", messageSchema);
export default Message;
