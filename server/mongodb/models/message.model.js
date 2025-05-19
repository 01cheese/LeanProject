// backend/models/message.model.ts
import mongoose from 'mongoose'

const MessageSchema = new mongoose.Schema({
  to: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  title: { type: String, default: 'Нове повідомлення' },
  content: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
})

export default mongoose.model('Message', MessageSchema)
