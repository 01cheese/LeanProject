import express from 'express';
import * as dotenv from 'dotenv';
import cors from 'cors';
import bodyParser from 'body-parser';
import connectDB from './mongodb/connect.js';

import userRouter from './routes/user.routes.js';
import propertyRouter from './routes/property.routes.js';
import leanRouter from './routes/lean.routes.js';
import notificationRouter from './routes/notification.routes.js';
import kaizenRouter from './routes/kaizen.routes.js';
import aiRouter from './routes/ai.routes.js';

dotenv.config();

const app = express();

// ✅ CORS для Vercel или других клиентов
app.use(cors({
  origin: ['https://lean-project.vercel.app'], // <--- замени на свой frontend
  credentials: true,
}));

// ✅ Body-parser
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json({ limit: '10mb' }));

// ✅ Проверка сервера
app.get('/', (req, res) => {
  res.send({ message: 'Lean backend is live! 💡' });
});

// ✅ Роуты
app.use('/api/kaizen', kaizenRouter);
app.use('/api/v1/notifications', notificationRouter);
app.use('/api/v1/ai', aiRouter);
app.use('/api/v1/lean', leanRouter);
app.use('/api/v1/users', userRouter);
app.use('/api/v1/properties', propertyRouter);

// ✅ Запуск
const startServer = async () => {
  try {
    await connectDB(process.env.MONGODB_URL);
    const PORT = process.env.PORT || 9000;
    app.listen(PORT, () =>
      console.log(`✅ Server running on port https://lean-backend.onrender.com (${PORT})`)
    );
  } catch (error) {
    console.error('❌ Error starting server:', error);
  }
};

startServer();
