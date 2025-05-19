import express from 'express'

import {
  getAllUsers,
  createUser,
  getUserInfoByID,
} from '../controllers/user.controller.js'
import User from '../mongodb/models/user.js'

const router = express.Router()

router.route('/').get(getAllUsers)
router.route('/').post(createUser)

router.get("/getByEmail/:email", async (req, res) => {
  try {
    const user = await User.findOne({ email: req.params.email });
    if (!user) return res.status(404).json({ message: "Не знайдено" });
    res.status(200).json(user);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.get("/search", async (req, res) => {
  try {
    const query = req.query.query;
    const users = await User.find({
      email: { $regex: query, $options: "i" },
    }).limit(5);
    res.status(200).json(users);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.route('/:id').get(getUserInfoByID)


export default router
