// backend/routes/message.routes.ts
import express from 'express'
import Message from '../mongodb/models/message.model.js'

const router = express.Router()

// Отримати всі повідомлення користувача
router.get('/:userId', async (req, res) => {
  try {
    const messages = await Message.find({ to: req.params.userId })
    res.status(200).json(messages)
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

// Створити повідомлення (admin use)
router.post('/', async (req, res) => {
  try {
    const { to, title, content } = req.body
    const newMsg = await Message.create({ to, title, content })
    res.status(201).json(newMsg)
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

export default router
