import 'dotenv/config'
import cors from 'cors'
import express from 'express'
import mongoose from 'mongoose'

import authRoutes from '../routes/auth.js'
import userRoutes from '../routes/users.js'

const app  = express()
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(cors())

// app.get('/', async(req, res) => {
//   res.json({ message: 'Connected to endpoint!' })
// })

app.use('/auth', authRoutes)
app.use('/users', userRoutes)

mongoose
  .connect(process.env.MONGO_DATABASE_URL)
  .then(() => {
    console.log('Connected to database!')

    app.listen(3000, () => {
      console.log('Connected to backend!')
    })
  }).catch((error) => {
    console.log(error)
  })