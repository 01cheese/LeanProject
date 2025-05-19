import express from 'express'
import * as dotenv from 'dotenv'
import cors from 'cors'
import connectDB from './mongodb/connect.js'
import userRouter from './routes/user.routes.js'
import propertyRouter from './routes/property.routes.js'
import bodyParser from 'body-parser'
import leanRouter from './routes/lean.routes.js'
import notificationRouter from './routes/notification.routes.js';
import kaizenRouter from './routes/kaizen.routes.js';

dotenv.config()

const app = express()
app.use(cors())
// app.use(express.json({ limit: '10mb ' }))

// Parse requests with the urlencoded payload
app.use(bodyParser.urlencoded({ extended: true }))


// Parse requests with the JSON payload
app.use(bodyParser.json({ limit: '10mb' }))

app.get('/', (req, res) => {
  res.send({ message: 'Hello World! ' })
})
app.use('/api/kaizen', kaizenRouter);
app.use("/api/v1/notifications", notificationRouter);
import aiRouter from './routes/ai.routes.js';
app.use('/api/v1/ai', aiRouter);


app.use('/api/v1/lean', leanRouter)
app.use('/api/v1/users', userRouter)
app.use('/api/v1/properties', propertyRouter)

const startServer = async () => {
  try {
    // connect to the database...
    connectDB(process.env.MONGODB_URL)

    app.listen(9000, () =>
      console.log('Server started on port http://localhost:9000 🚀'),
    )
  } catch (error) {
    console.log(error)
  }
}

startServer()
