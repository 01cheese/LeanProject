import express from 'express'
import Notification from '../mongodb/models/notification.js'
import LeanProject from '../mongodb/models/leanProject.js'

const router = express.Router()

// Отримати всі запрошення
router.get('/:userId', async (req, res) => {
  const invites = await Notification.find({ to: req.params.userId, status: 'pending' })
  res.json(invites)
})

// Прийняти
router.put('/:id/accept', async (req, res) => {
  const notif = await Notification.findById(req.params.id);
  if (!notif) return res.status(404).json({ message: 'Не знайдено' });

  const project = await LeanProject.findById(notif.projectId);
  if (!project) {
    await Notification.findByIdAndDelete(notif._id);
    return res.status(404).json({ message: "Проєкт не знайдено. Запрошення видалено." });
  }

  notif.status = 'accepted';
  await notif.save();

  const alreadyInProject = project.participants.some((p) => p.user.toString() === notif.to.toString());
  if (!alreadyInProject) {
    project.participants.push({ user: notif.to, role: 'user' });
    await project.save();
  }

  res.json({ message: 'Успішно приєднано до проєкту' });
});

// Відхилити
router.put('/:id/decline', async (req, res) => {
  const notif = await Notification.findById(req.params.id)
  if (!notif) return res.status(404).json({ message: 'Не знайдено' })

  notif.status = 'declined'
  await notif.save()

  res.json({ message: 'Запрошення відхилено' })
})

export default router
