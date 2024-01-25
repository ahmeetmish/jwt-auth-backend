import 'dotenv/config'
import express from 'express'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { check, validationResult } from 'express-validator'

import { User } from '../models/user.js'

const router = express.Router()

router.post('/login', [
  check('email', 'Email is required!').isEmail(),
  check('password', 'Password must be at least 6 characters!').isLength({ min: 6 }),
], async(req, res) => {
  const errors = validationResult(req)

  if(!errors.isEmpty()) {
    return res.status(400).json({ message: errors.array() })
  }

  const { email, password } = req.body

  try {
    const user = await User.findOne({ email })

    if(!user) {
      return res.stauts(400).json({ message: 'Invalid credentials!' })
    }

    const isMatch = await bcrypt.compare(password, user.password)

    if(!isMatch) {
      return res.stauts(400).json({ message: 'Invalid credentials!' })
    }

    const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET_KEY, {
      expiresIn: '1d'
    })

    res.cookie('auth_token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 864000
    })

    return res.status(200).json({ userId: user._id })

  } catch(error) {
    console.log(error)
    res.status(500).send({ message: 'Something went wrong!' })
  }
})

export default router