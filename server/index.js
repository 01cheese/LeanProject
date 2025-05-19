import express from 'express';
import * as dotenv from 'dotenv';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';

import connectDB from './mongodb/connect.js';
import userRouter from './routes/user.routes.js';
import propertyRouter from './routes/property.routes.js';
import bodyParser from 'body-parser';
import leanRouter from './routes/lean.routes.js';
import notificationRouter from './routes/notification.routes.js';
import kaizenRouter from './routes/kaizen.routes.js';
import aiRouter from './routes/ai.routes.js';

dotenv.config();

const app = express();
app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json({ limit: '10mb' }));

// API Routes
app.use('/api/kaizen', kaizenRouter);
app.use('/api/v1/notifications', notificationRouter);
app.use('/api/v1/ai', aiRouter);
app.use('/api/v1/lean', leanRouter);
app.use('/api/v1/users', userRouter);
app.use('/api/v1/properties', propertyRouter);

// Health check route
app.get('/api/health', (req, res) => {
  res.send({ status: 'ok' });
});

// =========== 🔥 Fallback для SPA React =============

// __dirname в ES-модулях
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Раздаём статические файлы из React
app.use(express.static(path.join(__dirname, '../client/build')));

// Все остальные маршруты → index.html
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../client/build/index.html'));
});

// ===================================================

const startServer = async () => {
  try {
    await connectDB(process.env.MONGODB_URL);

    const PORT = process.env.PORT || 9000;
    app.listen(PORT, () =>
      console.log(`🚀 Server started on http://localhost:${PORT}`)
    );
  } catch (error) {
    console.log('❌ Server Error:', error);
  }
};

startServer();
