import express from 'express'
import LeanProject from '../mongodb/models/leanProject.js'
import Notification from '../mongodb/models/notification.js'
import { ai, cleanData, formatPrompt } from "../utils/geminiUtils.js";


const router = express.Router()

// Створити проєкт
router.post('/', async (req, res) => {
  try {
    const { author, authorName, name, ...rest } = req.body;

    // Перевірка на дубль
    const existing = await LeanProject.findOne({ author, name });
    if (existing) {
      return res.status(400).json({ message: 'Проєкт з такою назвою вже існує' });
    }

    const newProject = new LeanProject({
      ...rest,
      name,
      author,
      authorName,
      participants: [{ user: author, role: 'admin' }],
    });

    const saved = await newProject.save();
    res.status(200).json(saved);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Отримати всі проєкти, де користувач — учасник
router.get('/shared/:userId', async (req, res) => {
  try {
    const userId = req.params.userId

    const projects = await LeanProject.find({
      participants: {
        $elemMatch: { user: userId },
      },
    })

    res.status(200).json(projects)
  } catch (error) {
    res.status(500).json({ message: 'Помилка при завантаженні проєктів', error })
  }
})

// Отримати всі проєкти користувача (автора)
router.get('/user/:userId', async (req, res) => {
  try {
    const projects = await LeanProject.find({ author: req.params.userId })
    res.status(200).json(projects)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})

// Оновити проєкт
router.put('/:id', async (req, res) => {
  try {
    console.log("ВХІДНІ ДАНІ:", req.body); // 💥 ДОДАЙ ЦЕ

    const updated = await LeanProject.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true },
    );

    res.status(200).json(updated);
  } catch (err) {
    console.error("❌ ПОМИЛКА ОНОВЛЕННЯ:", err); // 💥 І ЦЕ
    res.status(500).json({ message: 'Помилка при оновленні', error: err.message });
  }
});

// Получить список агентов (участников) для данного userId
router.get('/agents/:userId', async (req, res) => {
  try {
    const userId = req.params.userId

    // 1) Найти все проекты, где userId в participants
    const projects = await LeanProject.find({
      'participants.user': userId
    }).populate('participants.user', 'name email avatar') // подтягиваем профиль пользователя

    // 2) Собрать всех участников, кроме самого userId
    const allAgents = []
    projects.forEach(proj => {
      proj.participants.forEach(p => {
        const uid = p.user._id.toString()
        if (uid !== userId) {
          allAgents.push(p.user)
        }
      })
    })

    // 3) Убрать дубликаты по _id
    const uniqueMap = new Map()
    allAgents.forEach(u => uniqueMap.set(u._id.toString(), u))
    const uniqueAgents = Array.from(uniqueMap.values())

    res.json(uniqueAgents)
  } catch (err) {
    console.error('Error fetching agents:', err)
    res.status(500).json({ message: err.message })
  }
})

// Додати учасника до проєкту
router.put('/:id/add-user', async (req, res) => {
  const { userId } = req.body

  try {
    const project = await LeanProject.findById(req.params.id)
    if (!project) return res.status(404).json({ message: 'Проєкт не знайдено' })

    // Перевірка: вже є в participants?
    const alreadyParticipant = project.participants.some((p) => p.user.toString() === userId)
    if (alreadyParticipant) {
      return res.status(400).json({ message: 'Користувач вже учасник проєкту' })
    }

    // Перевірка: вже є запрошення?
    const existingInvite = await Notification.findOne({
      to: userId,
      projectId: req.params.id,
      status: 'pending',
    })
    if (existingInvite) {
      return res.status(400).json({ message: 'Запрошення вже надіслано' })
    }

    // Якщо все ок — створити запрошення
    await Notification.create({
      to: userId,
      projectId: req.params.id,
      projectName: project.name,
    })

    res.status(200).json({ message: 'Запрошення надіслано' })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

// Видалити учасника з проєкту
router.delete('/:projectId/remove-user/:userId', async (req, res) => {
  try {
    const { projectId, userId } = req.params;

    const project = await LeanProject.findById(projectId);
    if (!project) return res.status(404).json({ message: 'Проєкт не знайдено' });

    const user = project.participants.find(p => p.user.toString() === userId);
    if (user?.role === 'admin') {
      return res.status(400).json({ message: 'Неможливо видалити адміністратора' });
    }

    const updated = await LeanProject.findByIdAndUpdate(
      projectId,
      { $pull: { participants: { user: userId } } },
      { new: true }
    );

    res.status(200).json(updated);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Отримати один проєкт за ID
router.get('/:id', async (req, res) => {
  try {
    const project = await LeanProject.findById(req.params.id).populate('participants.user')
    if (!project) {
      return res.status(404).json({ message: 'Проєкт не знайдено' })
    }
    res.status(200).json(project)
  } catch (error) {
    res.status(500).json({ message: 'Помилка при отриманні проєкту', error })
  }
})

// Видалити весь проєкт
router.delete('/:id', async (req, res) => {
  try {
    await LeanProject.findByIdAndDelete(req.params.id)
    res.status(200).json({ message: 'Проєкт видалено' })
  } catch (err) {
    res.status(500).json({ message: 'Помилка при видаленні проєкту', error: err })
  }
})


// POST /lean/:id/analyze
router.post('/:id/analyze', async (req, res) => {
  try {
    const project = await LeanProject.findById(req.params.id).lean();
    if (!project) return res.status(404).json({ message: 'Проєкт не знайдено' });

    const cleaned = cleanData(project);
    const prompt = formatPrompt(cleaned);

    const result = await ai.models.generateContent({
      model: "gemini-2.0-flash", // або gemini-1.5-pro якщо доступно
      contents: [{ parts: [{ text: prompt }] }]
    });
    console.log("🧠 FULL Gemini RESULT:", JSON.stringify(result, null, 2));


    const text = result?.candidates?.[0]?.content?.parts?.[0]?.text || "🤖 Gemini не надав відповіді.";

    // Зберігаємо відповідь у БД
    await LeanProject.findByIdAndUpdate(req.params.id, { $set: { aiAnalysis: text } });

    console.log("✅ AI-відповідь:", text);
    res.status(200).json({ result: text });

  } catch (err) {
    console.error("❌ Lean Analyze Error:", err.message);
    res.status(500).json({ message: "Не вдалося виконати аналіз проєкту" });
  }
});

export default router
