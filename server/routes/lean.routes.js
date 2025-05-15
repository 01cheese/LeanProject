import express from 'express'
import LeanProject from '../mongodb/models/leanProject.js'
import Notification from '../mongodb/models/notification.js'

const router = express.Router()

// Створити проєкт
router.post('/', async (req, res) => {
  try {
    const newProject = new LeanProject({
      ...req.body,
      participants: [{ user: req.body.author, role: 'admin' }],
    })

    const saved = await newProject.save()
    res.status(200).json(saved)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})

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
    const updated = await LeanProject.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true },
    )
    res.status(200).json(updated)
  } catch (err) {
    res.status(500).json({ message: 'Помилка при оновленні', error: err })
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
    const { projectId, userId } = req.params

    const updated = await LeanProject.findByIdAndUpdate(projectId, {
      $pull: { participants: { user: userId } },
    }, { new: true })

    res.status(200).json(updated)
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

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

export default router
