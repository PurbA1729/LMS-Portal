import express from 'express'
import cors from 'cors'
import bodyParser from 'body-parser'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import multer from 'multer'

const app = express()
app.use(cors())
app.use(bodyParser.json())

// In-memory store (for demo only)
const users: any[] = []
const upload = multer({ dest: 'uploads/' })
const JWT_SECRET = process.env.JWT_SECRET || 'dev_secret_change'

app.post('/auth/register', async (req, res) => {
  const { name, email, password } = req.body
  if (!email || !password) return res.status(400).json({ message: 'Missing fields' })
  if (users.find(u => u.email === email)) return res.status(409).json({ message: 'User exists' })
  const hash = await bcrypt.hash(password, 8)
  const u = { id: users.length+1, name, email, passwordHash: hash }
  users.push(u)
  res.json({ ok: true, id: u.id })
})

app.post('/auth/login', async (req, res) => {
  const { email, password } = req.body
  const u = users.find(u => u.email === email)
  if (!u) return res.status(401).json({ message: 'Invalid credentials' })
  const match = await bcrypt.compare(password, u.passwordHash)
  if (!match) return res.status(401).json({ message: 'Invalid credentials' })
  const token = jwt.sign({ sub: u.id, email: u.email }, JWT_SECRET, { expiresIn: '7d' })
  res.json({ token })
})

// SCORM/xAPI upload placeholder
app.post('/scorm/upload', upload.single('package'), (req, res) => {
  if (!req.file) return res.status(400).json({ message: 'No file' })
  // In production: parse SCORM package, store in LRS, return package id
  res.json({ ok: true, filename: req.file.originalname, path: req.file.path })
})

// certificate generation placeholder
app.post('/certificate/generate', (req, res) => {
  // Generate a PDF or signed certificate on server; return URL or attach to email
  res.json({ ok: true, url: 'https://example.com/sample-certificate.pdf' })
})

// simple SSO placeholder redirect (real SSO requires provider integration)
app.get('/auth/sso/:provider', (req, res) => {
  res.json({ message: `SSO placeholder for ${req.params.provider}` })
})

app.post('/auth/google', (req, res) => {
  const token = jwt.sign({ sub: 'google-user', email: 'google-user@example.com' }, JWT_SECRET, { expiresIn: '7d' })
  res.json({ ok: true, token })
})

app.listen(4000, () => console.log('LMS server listening on http://localhost:4000'))
