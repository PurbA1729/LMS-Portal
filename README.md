# PAlms — Next-Generation Enterprise LMS Platform

A full-stack, enterprise-grade Learning Management System built with **React**, **TypeScript**, **Vite**, **Express**, and **MongoDB Atlas**, featuring Google OAuth authentication, interactive coding studios, live mentor classrooms, assessment evaluation workflows, and verified certificate generation.

---

## 🚀 Features

- **Interactive Code Studio**: Sandboxed code execution runner for Python, Cloud Dockerfiles, React Web, AI Classifiers, Cyber Security Audits, and SQL queries with local file downloading.
- **Dynamic Course Enrollment & Progress Tracking**: Real-time progress tracking, video lecture players, lesson completion checkpoints, and automated attendance metrics.
- **Capstone Assessments & Admin Evaluation Desk**:
  - Learners submit project repositories and solution files.
  - Submissions enter **Pending Admin Review**.
  - Instructors/Admins evaluate submissions and approve grades ($\ge 70\%$ to pass).
- **Verified Certificates**: Unlocks only when a learner completes **100% of lessons** AND obtains a **passing grade ($\ge 70\%$)** on the capstone assignment. Includes downloadable certificate.
- **Virtual Live Classroom**: Real-time mock audio/video controls, instructor broadcast feed, hand-raise alerts, and classmate roster.
- **Community Discussions**: Channel-based discussion boards with code snippet sharing and instant copy-to-clipboard.
- **Authentication & Security**:
  - Google OAuth Sign-In & Registration.
  - Email/Password authentication with MongoDB Atlas persistence.
  - Strict role segregation (Learner vs Admin).

---

## 🛠️ Tech Stack

- **Frontend**: React 18, TypeScript, Vite, Lucide Icons, Vanilla CSS Design System
- **Backend**: Node.js, Express, Mongoose, Google Auth Library, CORS, Dotenv
- **Database**: MongoDB Atlas (Cloud)
- **Deployment**: Vercel (Frontend) / Render / Railway / Node VPS (Backend)

---

## 📦 Getting Started Locally

### 1. Clone the Repository
```bash
git clone https://github.com/PurbA1729/LMS-Portal.git
cd LMS-Portal
```

### 2. Frontend Setup
```bash
npm install
npm run dev
```
The frontend will start at `http://localhost:5173`.

### 3. Backend Setup
```bash
cd server
npm install
npm run dev
```
The backend API server will start at `http://localhost:4000`.

---

## 🌐 Environment Variables

### Frontend (`.env`)
```env
VITE_API_URL=http://localhost:4000/api
VITE_GOOGLE_CLIENT_ID=your-google-client-id.apps.googleusercontent.com
```

### Backend (`server/.env`)
```env
PORT=4000
MONGODB_URI=your-mongodb-atlas-connection-string
GOOGLE_CLIENT_ID=your-google-client-id.apps.googleusercontent.com
JWT_SECRET=your-secure-jwt-secret
```

---

## 🚢 Deployment Guide

### Deploying Frontend to Vercel
1. Import your GitHub repository to [Vercel](https://vercel.com).
2. Set Framework Preset to **Vite**.
3. Add Environment Variables:
   - `VITE_API_URL`: URL of your deployed backend API (e.g. `https://your-backend.onrender.com/api`).
   - `VITE_GOOGLE_CLIENT_ID`: Your Google OAuth Client ID.
4. Click **Deploy**.

### Deploying Backend to Render / Railway
1. Create a **Web Service** pointing to the `server` directory.
2. Build Command: `npm install && npm run build`
3. Start Command: `npm start`
4. Add Environment Variables (`MONGODB_URI`, `GOOGLE_CLIENT_ID`, `JWT_SECRET`, `PORT`).
