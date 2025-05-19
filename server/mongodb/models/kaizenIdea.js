import mongoose from 'mongoose';

const kaizenIdeaSchema = new mongoose.Schema({
  idea: String,
  author: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  criticality: Number,
  status: String,
  date: String,
  comment: String,
  likes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  dislikes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }]
});

const KaizenIdea = mongoose.model('KaizenIdea', kaizenIdeaSchema);
export default KaizenIdea;
