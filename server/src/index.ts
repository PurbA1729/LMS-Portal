import dotenv from 'dotenv'
dotenv.config()

import express, { Request, Response } from 'express'
import cors from 'cors'
import bodyParser from 'body-parser'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import multer from 'multer'
import mongoose, { Schema, Document } from 'mongoose'
import { OAuth2Client } from 'google-auth-library'

const app = express()
app.use(cors())
app.use(bodyParser.json())

const upload = multer({ dest: 'uploads/' })
const PORT = process.env.PORT || 4000
const JWT_SECRET = process.env.JWT_SECRET || 'super_secret_jwt_key_pa_lms_2026_enterprise'
const MONGODB_URI = process.env.MONGODB_URI || ''
const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID || ''

const googleClient = new OAuth2Client(GOOGLE_CLIENT_ID)

/* ==========================================================================
   MONGODB DATABASE CONNECTION & USER SCHEMA
   ========================================================================== */

export interface IUser extends Document {
  name: string
  email: string
  passwordHash?: string
  role: 'Learner' | 'Admin'
  authProvider: 'local' | 'google'
  googleId?: string
  avatar?: string
  createdAt: Date
}

const UserSchema = new Schema<IUser>({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  passwordHash: { type: String },
  role: { type: String, enum: ['Learner', 'Admin'], default: 'Learner' },
  authProvider: { type: String, enum: ['local', 'google'], default: 'local' },
  googleId: { type: String },
  avatar: { type: String },
  createdAt: { type: Date, default: Date.now }
})

const User = mongoose.model<IUser>('User', UserSchema)

// Connect to MongoDB Atlas
if (MONGODB_URI) {
  mongoose
    .connect(MONGODB_URI, {
      serverSelectionTimeoutMS: 5000,
      connectTimeoutMS: 10000
    })
    .then(() => {
      console.log('✅ [MongoDB] Successfully connected to MongoDB Atlas database: palms_lms')
    })
    .catch((err) => {
      console.error('❌ [MongoDB] Atlas Connection error:', err.message)
    })
} else {
  console.warn('⚠️ [MongoDB] MONGODB_URI is not set in environment variables.')
}

/* ==========================================================================
   HELPER FUNCTIONS
   ========================================================================== */

function getInitials(name: string): string {
  if (!name) return 'PM'
  return name
    .split(' ')
    .filter(Boolean)
    .map((p) => p[0])
    .join('')
    .substring(0, 2)
    .toUpperCase() || 'PM'
}

function generateToken(user: IUser): string {
  return jwt.sign(
    {
      sub: user._id,
      email: user.email,
      name: user.name,
      role: user.role
    },
    JWT_SECRET,
    { expiresIn: '30d' }
  )
}

/* ==========================================================================
   AUTHENTICATION ROUTES
   ========================================================================== */

// 1. Register with Email, Password, Name, and Role
app.post('/auth/register', async (req: Request, res: Response) => {
  try {
    const { name, email, password, role } = req.body

    if (!email || !password) {
      return res.status(400).json({ ok: false, message: 'Please provide email and password.' })
    }

    const normalizedEmail = email.toLowerCase().trim()
    const userRole = role === 'Admin' ? 'Admin' : 'Learner'
    const displayName = (name && name.trim()) ? name.trim() : normalizedEmail.split('@')[0]

    // Check if user already exists in MongoDB - strictly no duplicate emails allowed
    const existingUser = await User.findOne({ email: normalizedEmail })
    if (existingUser) {
      return res.status(409).json({
        ok: false,
        message: `An account with this email is already registered as ${existingUser.role}. Please log in.`
      })
    }

    // Hash password
    const salt = await bcrypt.genSalt(10)
    const passwordHash = await bcrypt.hash(password, salt)

    // Create & save new user in MongoDB
    const newUser = new User({
      name: displayName,
      email: normalizedEmail,
      passwordHash,
      role: userRole,
      authProvider: 'local'
    })

    await newUser.save()
    console.log(`✨ [MongoDB] New user registered: ${newUser.name} (${newUser.email}) strictly as ${newUser.role}`)

    return res.status(201).json({
      ok: true,
      message: 'Account registered successfully! Please log in with your credentials.',
      email: newUser.email,
      role: newUser.role
    })
  } catch (error: any) {
    console.error('Registration Error:', error)
    return res.status(500).json({ ok: false, message: error.message || 'Internal server error during registration.' })
  }
})

// 2. Log in with Email and Password
app.post('/auth/login', async (req: Request, res: Response) => {
  try {
    const { email, password, role } = req.body

    if (!email || !password) {
      return res.status(400).json({ ok: false, message: 'Please provide both email and password.' })
    }

    const normalizedEmail = email.toLowerCase().trim()
    const selectedRole = role === 'Admin' ? 'Admin' : 'Learner'

    // Find user in MongoDB
    const user = await User.findOne({ email: normalizedEmail })

    // Strict account existence check - no direct login for non-existent users
    if (!user) {
      return res.status(404).json({
        ok: false,
        message: 'Account does not exist. Please go to the Register page to create an account first.'
      })
    }

    // Strict Role check - 1 Email is bound to 1 Role
    if (user.role !== selectedRole) {
      return res.status(403).json({
        ok: false,
        message: `Access denied. This email is registered as an ${user.role}. You cannot enter as a ${selectedRole}. Please select ${user.role} role or register a new email.`
      })
    }

    // Verify password hash
    if (user.passwordHash) {
      const isMatch = await bcrypt.compare(password, user.passwordHash)
      if (!isMatch) {
        return res.status(401).json({ ok: false, message: 'Incorrect password. Please try again.' })
      }
    }

    const token = generateToken(user)
    console.log(`🔐 [MongoDB] User authenticated: ${user.name} (${user.email}) [${user.role}]`)

    return res.json({
      ok: true,
      message: 'Logged in successfully!',
      user: {
        id: user._id.toString(),
        name: user.name,
        email: user.email,
        role: user.role,
        initials: getInitials(user.name)
      },
      token
    })
  } catch (error: any) {
    console.error('Login Error:', error)
    return res.status(500).json({ ok: false, message: error.message || 'Internal server error during login.' })
  }
})

// 3. Google OAuth Sign-in & Register
app.post('/auth/google', async (req: Request, res: Response) => {
  try {
    const { credential, role, userProfile } = req.body
    let email = ''
    let name = ''
    let googleId = ''
    let avatar = ''

    if (credential) {
      try {
        const ticket = await googleClient.verifyIdToken({
          idToken: credential,
          audience: GOOGLE_CLIENT_ID
        })
        const payload = ticket.getPayload()
        if (payload) {
          email = payload.email || ''
          name = payload.name || payload.given_name || 'Google User'
          googleId = payload.sub
          avatar = payload.picture || ''
        }
      } catch (verifyErr) {
        console.warn('Google Token verification fallback:', verifyErr)
        if (userProfile && userProfile.email) {
          email = userProfile.email
          name = userProfile.name || 'Google User'
          googleId = userProfile.sub || `g_${Date.now()}`
        }
      }
    } else if (userProfile && userProfile.email) {
      email = userProfile.email
      name = userProfile.name || 'Google User'
      googleId = userProfile.sub || `g_${Date.now()}`
    }

    if (!email) {
      return res.status(400).json({ ok: false, message: 'Could not retrieve email from Google OAuth.' })
    }

    const normalizedEmail = email.toLowerCase().trim()
    const selectedRole = role === 'Admin' ? 'Admin' : 'Learner'

    // Find in MongoDB
    let user = await User.findOne({ email: normalizedEmail })

    if (user) {
      // Check 1 Email = 1 Role restriction
      if (user.role !== selectedRole) {
        return res.status(403).json({
          ok: false,
          message: `Access denied. This Google account is permanently registered as ${user.role}. You cannot enter as ${selectedRole}.`
        })
      }
      if (googleId && !user.googleId) {
        user.googleId = googleId
        user.authProvider = 'google'
      }
      if (avatar && !user.avatar) {
        user.avatar = avatar
      }
      await user.save()
      console.log(`🔐 [MongoDB] Existing user logged in via Google: ${user.name} (${user.email}) [${user.role}]`)
    } else {
      user = new User({
        name: name || normalizedEmail.split('@')[0],
        email: normalizedEmail,
        role: selectedRole,
        authProvider: 'google',
        googleId,
        avatar
      })
      await user.save()
      console.log(`✨ [MongoDB] New user registered via Google: ${user.name} (${user.email}) as ${user.role}`)
    }

    const token = generateToken(user)

    return res.json({
      ok: true,
      message: 'Google Sign-in successful!',
      user: {
        id: user._id.toString(),
        name: user.name,
        email: user.email,
        role: user.role,
        initials: getInitials(user.name)
      },
      token
    })
  } catch (error: any) {
    console.error('Google Auth Error:', error)
    return res.status(500).json({ ok: false, message: error.message || 'Google authentication failed.' })
  }
})

// 4. Get All Registered Users from MongoDB (for verifying saved data)
app.get('/auth/users', async (_req: Request, res: Response) => {
  try {
    const allUsers = await User.find({}, '-passwordHash').sort({ createdAt: -1 })
    res.json({ ok: true, count: allUsers.length, users: allUsers })
  } catch (error: any) {
    res.status(500).json({ ok: false, message: error.message })
  }
})

/* ==========================================================================
   OTHER ENDPOINTS
   ========================================================================== */

app.get('/health', (_req: Request, res: Response) => {
  res.json({
    status: 'online',
    mongoConnected: mongoose.connection.readyState === 1,
    time: new Date().toISOString()
  })
})

app.listen(PORT, () => {
  console.log(`🚀 [Server] PAlms LMS backend listening on http://localhost:${PORT}`)
})
