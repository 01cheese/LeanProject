import mongoose from "mongoose";

const NotificationSchema = new mongoose.Schema({
  to: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  projectId: { type: mongoose.Schema.Types.ObjectId, ref: "LeanProject", required: true },
  projectName: String,
  type: { type: String, enum: ["invite"], default: "invite" },
  status: { type: String, enum: ["pending", "accepted", "declined"], default: "pending" },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model("Notification", NotificationSchema);
