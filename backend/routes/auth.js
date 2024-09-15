import express from 'express'
import { login, register, verify, sendOtpForLogin } from '../Controllers/authController.js'
// import bcrypt from 'bcryptjs'
// import jwt from 'jsonwebtoken'

const router = express.Router()

router.post('/register', register)
router.post('/login', login)
router.post('/verify', verify)
router.post('/sendOtp', sendOtpForLogin)


export default router