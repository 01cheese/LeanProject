import express from 'express'
import * as dotenv from 'dotenv'
import cors from 'cors'
import connectDB from './mongodb/connect.js'
import userRouter from './routes/user.routes.js'
import propertyRouter from './routes/property.routes.js'
import bodyParser from 'body-parser'
import leanRouter from './routes/lean.routes.js'
import notificationRouter from './routes/notification.routes.js'
import kaizenRouter from './routes/kaizen.routes.js'
import aiRouter from './routes/ai.routes.js'

import { fetch, Headers, Request, Response } from 'undici';

global.fetch = fetch;
global.Headers = Headers;
global.Request = Request;
global.Response = Response;


dotenv.config()

const app = express()

// 🔧 Крос-домен
app.use(cors())

app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json({ limit: '10mb' }))

app.get('/', (req, res) => {
  res.send({ message: 'Hello World! ' })
})

app.use('/api/kaizen', kaizenRouter)
app.use('/api/v1/notifications', notificationRouter)
app.use('/api/v1/ai', aiRouter)
app.use('/api/v1/lean', leanRouter)
app.use('/api/v1/users', userRouter)
app.use('/api/v1/properties', propertyRouter)

const startServer = async () => {
  try {
    await connectDB(process.env.MONGODB_URL)
    const PORT = process.env.PORT || 9000
    app.listen(PORT, () => {
      console.log(`✅ Server started on port http://localhost:${PORT} 🚀`)
    })
  } catch (error) {
    console.error('❌ Server failed:', error)
  }
}

startServer()
