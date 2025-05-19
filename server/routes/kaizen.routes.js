import express from 'express';
import KaizenIdea from '../mongodb/models/kaizenIdea.js';
import User from '../mongodb/models/user.js';
import LeanProject from '../mongodb/models/leanProject.js'

const router = express.Router();

// ЗБЕРЕЖЕННЯ
router.post('/', async (req, res) => {
  try {
    // read the posted array directly
    const ideas = Array.isArray(req.body) ? req.body : [];

    console.log("Ідеї до збереження:", ideas);

    await KaizenIdea.deleteMany();

    const transformed = await Promise.all(ideas.map(async idea => {
      let authorId = null;
      if (idea.author?.email) {
        const u = await User.findOne({ email: idea.author.email });
        authorId = u?._id || null;
      }
      return {
        idea: idea.idea,
        author: authorId,
        criticality: idea.criticality,
        status: idea.status,
        date: idea.date,
        comment: idea.comment,
        likes: [],
        dislikes: []
      };
    }));

    const saved = await KaizenIdea.insertMany(transformed);
    res.json(saved);
  } catch (e) {
    console.error('❌ ПОМИЛКА ЗБЕРЕЖЕННЯ:', e);
    res.status(500).json({ error: 'Помилка при збереженні' });
  }
});
// ОТРИМАННЯ
router.get('/', async (req, res) => {
  try {
    const ideas = await KaizenIdea.find().populate('author', 'email');
    res.json(ideas);
  } catch (e) {
    res.status(500).json({ error: 'Помилка при отриманні' });
  }
});

// ГОЛОСУВАННЯ
router.post("/vote/:id", async (req, res) => {
  const { id } = req.params;
  const { type, userEmail } = req.body;

  const project = await LeanProject.findOne({ "leanTemplates.kaizen.ideas._id": id });
  if (!project) return res.status(404).json({ error: "Project not found" });

  const idea = project.leanTemplates.kaizen.ideas.id(id);
  if (!idea) return res.status(404).json({ error: "Idea not found" });

  const user = await User.findOne({ email: userEmail });
  if (!user) return res.status(404).json({ error: "User not found" });

  const userId = user._id.toString();

  // Зняти лайк або дизлайк, якщо вже є
  if (type === "like") {
    if (idea.likes.map(id => id.toString()).includes(userId)) {
      idea.likes = idea.likes.filter(id => id.toString() !== userId);
    } else {
      idea.likes.push(user._id);
      idea.dislikes = idea.dislikes.filter(id => id.toString() !== userId);
    }
  } else if (type === "dislike") {
    if (idea.dislikes.map(id => id.toString()).includes(userId)) {
      idea.dislikes = idea.dislikes.filter(id => id.toString() !== userId);
    } else {
      idea.dislikes.push(user._id);
      idea.likes = idea.likes.filter(id => id.toString() !== userId);
    }
  }

  await project.save();
  res.json(project.leanTemplates.kaizen.ideas); // масив
});


export default router;
