import React, { useState, useEffect, useRef } from 'react'
import { createRoot } from 'react-dom/client'
import {
  Activity,
  AlertCircle,
  AlertTriangle,
  ArrowRight,
  Award,
  Bell,
  BookOpen,
  CalendarDays,
  Camera,
  Check,
  CheckCircle2,
  ChevronDown,
  ChevronRight,
  Clock3,
  Code2,
  Compass,
  Copy,
  Download,
  ExternalLink,
  Eye,
  FileCode2,
  FileText,
  Filter,
  GraduationCap,
  Hand,
  Layers3,
  LayoutDashboard,
  LineChart,
  Link,
  Lock,
  LogOut,
  Mail,
  Menu,
  MessageSquare,
  Mic,
  MicOff,
  MoreHorizontal,
  PhoneOff,
  Play,
  Plus,
  Radio,
  Search,
  Send,
  Settings,
  Share2,
  ShieldCheck,
  Sparkles,
  Terminal,
  Trash2,
  Unlock,
  Upload,
  User,
  Users,
  Video,
  VideoOff,
  X,
  Zap
} from 'lucide-react'

import './style.css'

declare global {
  interface Window {
    google?: any
  }
}

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000'
const GOOGLE_CLIENT_ID =
  import.meta.env.VITE_GOOGLE_CLIENT_ID ||
  '155933972278-ku3h2n0rhvv92517gg7m4aa74kbca0kb.apps.googleusercontent.com'

/* ==========================================================================
   TYPES & DATA MODELS
   ========================================================================== */

export type Role = 'Learner' | 'Admin'

export type PortalPage =
  | 'Overview'
  | 'My Learning'
  | 'Catalog'
  | 'Studio'
  | 'Assessments'
  | 'Certificates'
  | 'Live Class'
  | 'Community'
  | 'People'
  | 'Settings'

export interface UserSession {
  id: string
  name: string
  email: string
  role: Role
  initials: string
  avatar?: string
}

export interface Lesson {
  id: string
  title: string
  type: 'video' | 'document' | 'quiz' | 'assignment'
  duration: string
  completed: boolean
  videoUrl: string
  summary: string
  keyPoints: string[]
}

export interface Course {
  id: number
  title: string
  track: string
  level: 'Foundational' | 'Intermediate' | 'Advanced' | 'Mastery'
  progress: number
  lessons: number
  completed: number
  due: string
  instructor: string
  status: 'Active' | 'Completed' | 'Upcoming'
  description: string
  fileName: string
  codeSnippet: string
  syllabus: Lesson[]
  liveWorkshopTitle: string
  coursemates: string[]
}

export interface Assignment {
  id: string
  courseId: number
  title: string
  course: string
  dueDate: string
  score?: number
  totalPoints: number
  status: 'Graded' | 'Pending Review' | 'Not Submitted'
  submittedAt?: string
  githubLink?: string
  fileName?: string
}

export interface CommunityMessage {
  id: string
  courseId: number
  userName: string
  userRole: Role
  userInitials: string
  timestamp: string
  text: string
  codeSnippet?: string
}

export interface NotificationItem {
  id: string
  title: string
  message: string
  timestamp: string
  read: boolean
  type: 'grade' | 'deadline' | 'announcement'
}

/* ==========================================================================
   INITIAL MASTER DATA CATALOG
   ========================================================================== */

const MASTER_COURSES: Course[] = [
  {
    id: 1,
    title: 'Python Programming & Data Science Masterclass',
    track: 'Python & Data',
    level: 'Foundational',
    progress: 0,
    lessons: 4,
    completed: 0,
    due: 'Flexible',
    instructor: 'Purba Madhur',
    status: 'Active',
    description: 'Master Python syntax, object-oriented design, NumPy arrays, Pandas data transformations, and practical data projects.',
    fileName: 'data_analysis.py',
    codeSnippet: `# Python Data Science & Analytics
import pandas as pd
import numpy as np

# Sample Cohort Assessment Dataset
data = {
    "student": ["Aarav", "Meera", "Rohan", "Ananya"],
    "score": [88, 94, 91, 98],
    "passed": [True, True, True, True]
}

df = pd.DataFrame(data)
print("=== Student Performance Overview ===")
print(df)
print("\\nClass Average Score:", df["score"].mean())
print("Highest Score:", df["score"].max())`,
    syllabus: [
      {
        id: 'py-1',
        title: 'Python Syntax & Programming Basics',
        type: 'video',
        duration: '18 min',
        completed: false,
        videoUrl: 'https://www.youtube.com/embed/_uQrJ0TkZlc',
        summary: 'Learn Python variable assignment, data types, string formatting, arithmetic operators, and control flow loops.',
        keyPoints: ['Variables & Dynamic Typing', 'Conditionals (if-elif-else)', 'For & While Loops', 'Writing Reusable Functions']
      },
      {
        id: 'py-2',
        title: 'Data Structures: Lists, Dictionaries & Sets',
        type: 'video',
        duration: '24 min',
        completed: false,
        videoUrl: 'https://www.youtube.com/embed/kqtD5dpn9C8',
        summary: 'Deep-dive into mutable lists, key-value dictionaries, unique sets, list comprehensions, and data transformations.',
        keyPoints: ['List slicing and indexing', 'Dictionary key lookup & iteration', 'Set operations (union, intersection)', 'List comprehensions']
      },
      {
        id: 'py-3',
        title: 'NumPy Operations & Array Math',
        type: 'video',
        duration: '32 min',
        completed: false,
        videoUrl: 'https://www.youtube.com/embed/QUT1VHiLmmI',
        summary: 'Learn high-performance vector operations, multidimensional matrices, array broadcasting, and statistical calculations with NumPy.',
        keyPoints: ['NumPy ndarray creation', 'Broadcasting rules', 'Matrix dot products', 'Statistical aggregations (mean, std)']
      },
      {
        id: 'py-4',
        title: 'Pandas Dataframes & Capstone Project',
        type: 'assignment',
        duration: '45 min',
        completed: false,
        videoUrl: 'https://www.youtube.com/embed/vmEHCJofslg',
        summary: 'Load real-world CSV datasets, clean missing data values, group by cohorts, compute summaries, and export final charts.',
        keyPoints: ['CSV data ingestion', 'Handling NaN missing values', 'GroupBy aggregations', 'Exporting cleaned datasets']
      }
    ],
    liveWorkshopTitle: 'Python Data Science Live Practice & Code Walkthrough',
    coursemates: ['Vikram Patel', 'Neha Sharma', 'Karan Mehta', 'Pooja Nair', 'Siddharth Rao']
  },
  {
    id: 2,
    title: 'Cloud Computing & DevOps with AWS & Docker',
    track: 'Cloud & DevOps',
    level: 'Intermediate',
    progress: 0,
    lessons: 4,
    completed: 0,
    due: 'Flexible',
    instructor: 'Dr. Rahul Sharma',
    status: 'Active',
    description: 'Learn scalable cloud systems, containerization with Docker, virtual servers, and automated deployment pipelines.',
    fileName: 'Dockerfile',
    codeSnippet: `# Multi-stage Production Dockerfile
FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules
EXPOSE 4000
CMD ["node", "dist/index.js"]`,
    syllabus: [
      {
        id: 'cloud-1',
        title: 'Cloud Infrastructure & AWS Fundamentals',
        type: 'video',
        duration: '22 min',
        completed: false,
        videoUrl: 'https://www.youtube.com/embed/ulprqHHWlng',
        summary: 'Understand cloud regions, EC2 compute instances, S3 object storage, VPC networking, and IAM security permissions.',
        keyPoints: ['AWS Global Infrastructure', 'EC2 compute provisioning', 'S3 buckets and policies', 'IAM role management']
      },
      {
        id: 'cloud-2',
        title: 'Docker Containers & Image Packaging',
        type: 'video',
        duration: '28 min',
        completed: false,
        videoUrl: 'https://www.youtube.com/embed/fqMOX6JJhGo',
        summary: 'Package applications into lightweight, reproducible Docker containers with multi-stage builds and Docker Compose.',
        keyPoints: ['Dockerfile instructions', 'Docker image layering & caching', 'Port mapping and environment variables', 'Docker Compose multi-container setup']
      },
      {
        id: 'cloud-3',
        title: 'CI/CD Pipeline Automation with GitHub Actions',
        type: 'video',
        duration: '35 min',
        completed: false,
        videoUrl: 'https://www.youtube.com/embed/R8_veQiYBjI',
        summary: 'Build automated test, lint, build, and deploy workflows that trigger on every push and pull request.',
        keyPoints: ['GitHub Actions syntax', 'Secrets management in CI/CD', 'Automated unit test execution', 'Deploying container to cloud']
      },
      {
        id: 'cloud-4',
        title: 'Cloud Deployment & Container Scaling Capstone',
        type: 'assignment',
        duration: '50 min',
        completed: false,
        videoUrl: 'https://www.youtube.com/embed/3c-iBn73dDE',
        summary: 'Deploy your containerized service to an AWS ECS cluster with an Application Load Balancer and health checks.',
        keyPoints: ['ECS cluster setup', 'Task definition parameters', 'Load balancer target groups', 'Zero-downtime rolling updates']
      }
    ],
    liveWorkshopTitle: 'Live AWS & Docker Cloud Deployment Masterclass',
    coursemates: ['Aditya Verma', 'Ritu Sen', 'Deepak Joshi', 'Tanvi Gupta', 'Harsh Varma']
  },
  {
    id: 3,
    title: 'Full-Stack Web Development with React & Node.js',
    track: 'Web Development',
    level: 'Foundational',
    progress: 0,
    lessons: 4,
    completed: 0,
    due: 'Flexible',
    instructor: 'Abhay Chourasia',
    status: 'Active',
    description: 'Build modern responsive web applications with React, TypeScript, Express REST APIs, and database management.',
    fileName: 'App.tsx',
    codeSnippet: `// Modern React 19 Full-Stack Component
import React, { useState, useEffect } from 'react';

export default function UserDashboard() {
  const [users, setUsers] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/users')
      .then(res => res.json())
      .then(data => setUsers(data.users || ['Alice', 'Bob', 'Charlie']))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="p-6 bg-white rounded-xl shadow">
      <h2 className="text-xl font-bold">Active Cohort Students</h2>
      {loading ? <p>Loading...</p> : <ul>{users.map(u => <li key={u}>{u}</li>)}</ul>}
    </div>
  );
}`,
    syllabus: [
      {
        id: 'web-1',
        title: 'Modern React Components, JSX & Hooks',
        type: 'video',
        duration: '20 min',
        completed: false,
        videoUrl: 'https://www.youtube.com/embed/SqcY0GlETPk',
        summary: 'Master component hierarchy, props, state with useState, side effects with useEffect, and custom hooks.',
        keyPoints: ['JSX syntax rules', 'useState and state updates', 'useEffect dependency array', 'Clean component composition']
      },
      {
        id: 'web-2',
        title: 'Responsive UI Architecture & Tailwind CSS',
        type: 'video',
        duration: '25 min',
        completed: false,
        videoUrl: 'https://www.youtube.com/embed/w7ejDZ8SWv8',
        summary: 'Design sleek, responsive mobile-first user interfaces with glassmorphism, flexbox, and modern CSS grid.',
        keyPoints: ['Flexbox alignment and layout', 'CSS Grid responsive tracks', 'Media queries & breakpoints', 'Modern typography tokens']
      },
      {
        id: 'web-3',
        title: 'Building REST APIs with Node.js & Express',
        type: 'video',
        duration: '30 min',
        completed: false,
        videoUrl: 'https://www.youtube.com/embed/Oe421EPjeBE',
        summary: 'Create robust backend REST endpoints with Express routers, request validation, middleware, and CORS security.',
        keyPoints: ['Express routing methods (GET, POST, PUT, DELETE)', 'Request body parsing middleware', 'Error handling middleware', 'JWT auth protection']
      },
      {
        id: 'web-4',
        title: 'Full-Stack Integration & Database CRUD Capstone',
        type: 'assignment',
        duration: '45 min',
        completed: false,
        videoUrl: 'https://www.youtube.com/embed/7CqJlxBYj-M',
        summary: 'Connect your React frontend with Express backend and MongoDB database for real-time CRUD operations.',
        keyPoints: ['Full-stack HTTP fetch pipeline', 'Handling async state loading and errors', 'Database schema modeling', 'Deploying full-stack app']
      }
    ],
    liveWorkshopTitle: 'Full-Stack React & Node Live Q&A Session',
    coursemates: ['Kunal Shah', 'Manish Reddy', 'Sneha Roy', 'Devika Pillai', 'Varun Kapoor']
  },
  {
    id: 4,
    title: 'Machine Learning & Artificial Intelligence Fundamentals',
    track: 'AI & Machine Learning',
    level: 'Advanced',
    progress: 0,
    lessons: 4,
    completed: 0,
    due: 'Flexible',
    instructor: 'Dr. Elena Rostova',
    status: 'Active',
    description: 'Understand neural networks, intelligent data models, prompt engineering, and real-world AI applications.',
    fileName: 'train_model.py',
    codeSnippet: `# Machine Learning Classifier & Evaluation
import numpy as np
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestClassifier
from sklearn.metrics import accuracy_score, classification_report

# Generate synthetic dataset
X = np.random.randn(500, 6)
y = (X[:, 0] + X[:, 1] > 0).astype(int)

X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

model = RandomForestClassifier(n_estimators=100, random_state=42)
model.fit(X_train, y_train)

preds = model.predict(X_test)
print("=== Model Performance Metrics ===")
print("Validation Accuracy:", accuracy_score(y_test, preds))
print("\\nDetailed Classification Report:\\n", classification_report(y_test, preds))`,
    syllabus: [
      {
        id: 'ai-1',
        title: 'Neural Networks & Deep Learning Intro',
        type: 'video',
        duration: '24 min',
        completed: false,
        videoUrl: 'https://www.youtube.com/embed/aircAruvnKk',
        summary: 'Explore artificial neurons, activation functions (ReLU, Sigmoid), forward propagation, and loss calculation.',
        keyPoints: ['Perceptron architecture', 'Weights, biases, and activations', 'Forward propagation math', 'Cost functions (MSE, Cross-entropy)']
      },
      {
        id: 'ai-2',
        title: 'Supervised vs Unsupervised Machine Learning Models',
        type: 'video',
        duration: '30 min',
        completed: false,
        videoUrl: 'https://www.youtube.com/embed/ukzFI9rgwfU',
        summary: 'Understand regression, decision trees, random forests, k-means clustering, and feature selection.',
        keyPoints: ['Linear and Logistic Regression', 'Decision Trees and Ensembles', 'K-Means Clustering', 'Train/Validation/Test splits']
      },
      {
        id: 'ai-3',
        title: 'Training, Overfitting & Model Optimization',
        type: 'video',
        duration: '36 min',
        completed: false,
        videoUrl: 'https://www.youtube.com/embed/Gv9_4yMHFhI',
        summary: 'Learn gradient descent, learning rate schedules, dropout regularization, and hyperparameter tuning.',
        keyPoints: ['Backpropagation & chain rule', 'Gradient descent variants (SGD, Adam)', 'Overfitting prevention with Dropout', 'Cross-validation strategies']
      },
      {
        id: 'ai-4',
        title: 'AI Predictive Classifier Capstone Project',
        type: 'assignment',
        duration: '50 min',
        completed: false,
        videoUrl: 'https://www.youtube.com/embed/tPYj3fFJGjk',
        summary: 'Build and evaluate an end-to-end predictive machine learning model with real dataset metrics and export.',
        keyPoints: ['Data preprocessing and normalization', 'Model training & hyperparameter tuning', 'Confusion matrix & ROC-AUC curves', 'Model export for production inference']
      }
    ],
    liveWorkshopTitle: 'AI & Neural Networks Architecture Live Lab',
    coursemates: ['Arjun Menon', 'Pallavi Das', 'Gaurav Singhal', 'Isha Tiwari', 'Kavita Chawla']
  },
  {
    id: 5,
    title: 'Cybersecurity & Ethical Hacking Essentials',
    track: 'Cyber Defense',
    level: 'Advanced',
    progress: 0,
    lessons: 4,
    completed: 0,
    due: 'Flexible',
    instructor: 'Alexei Novak',
    status: 'Active',
    description: 'Learn network security, vulnerability testing, digital safety, authentication protocols, and defense strategies.',
    fileName: 'port_scanner.py',
    codeSnippet: `# Network Security Port Scanner
import socket
from datetime import datetime

target_host = "127.0.0.1"
ports_to_check = [21, 22, 80, 443, 3000, 4000, 8080]

print(f"=== Starting Security Audit for {target_host} at {datetime.now()} ===")

for port in ports_to_check:
    sock = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
    sock.settimeout(0.5)
    result = sock.connect_ex((target_host, port))
    if result == 0:
        print(f"[OPEN] Port {port} is OPEN and accepting connections.")
    else:
        print(f"[CLOSED] Port {port} is secure/closed.")
    sock.close()

print("\\n[SUCCESS] Security port scan completed successfully.")`,
    syllabus: [
      {
        id: 'sec-1',
        title: 'Network Security Fundamentals & TCP/IP',
        type: 'video',
        duration: '18 min',
        completed: false,
        videoUrl: 'https://www.youtube.com/embed/inWWhr5tnEA',
        summary: 'Understand the OSI model, IP routing, packet inspection, firewalls, and network vulnerability vectors.',
        keyPoints: ['OSI 7-Layer Model', 'TCP three-way handshake', 'Packet sniffing and Wireshark', 'Firewall rules and DMZ zones']
      },
      {
        id: 'sec-2',
        title: 'Authentication Security, Cryptography & JWTs',
        type: 'video',
        duration: '26 min',
        completed: false,
        videoUrl: 'https://www.youtube.com/embed/4_iC342n2tM',
        summary: 'Learn asymmetric public/private keys, TLS encryption, salted bcrypt password hashing, and secure token auth.',
        keyPoints: ['Symmetric vs Asymmetric encryption', 'TLS certificate handshakes', 'Salted password hashing algorithms', 'JWT token expiration & refresh tokens']
      },
      {
        id: 'sec-3',
        title: 'Vulnerability Scanning & Penetration Testing',
        type: 'video',
        duration: '32 min',
        completed: false,
        videoUrl: 'https://www.youtube.com/embed/3Kq1MIfTWCE',
        summary: 'Perform ethical vulnerability assessments, cross-site scripting (XSS) tests, and SQL injection prevention.',
        keyPoints: ['OWASP Top 10 vulnerabilities', 'SQL Injection detection and mitigation', 'Cross-Site Scripting (XSS) defense', 'Penetration testing ethics & methodology']
      },
      {
        id: 'sec-4',
        title: 'Defense Hardening & Incident Response Capstone',
        type: 'assignment',
        duration: '40 min',
        completed: false,
        videoUrl: 'https://www.youtube.com/embed/bPVaOlJ6ln0',
        summary: 'Audit system defenses, configure secure headers, patch vulnerable packages, and compile an audit report.',
        keyPoints: ['Security headers (CSP, CORS, HSTS)', 'Automated dependency vulnerability audits', 'Intrusion detection log analysis', 'Compiling executive security audit report']
      }
    ],
    liveWorkshopTitle: 'Ethical Hacking & Defense Lab Live Workshop',
    coursemates: ['Rohit Saxena', 'Anjali Bose', 'Yashwant Kale', 'Divya Sundaram', 'Naveen Kumar']
  },
  {
    id: 6,
    title: 'Database Management Systems & SQL Mastery',
    track: 'Databases & SQL',
    level: 'Foundational',
    progress: 0,
    lessons: 4,
    completed: 0,
    due: 'Flexible',
    instructor: 'Marcus Vance',
    status: 'Active',
    description: 'Design relational schemas, write powerful SQL queries, organize structured data, and optimize query speed.',
    fileName: 'queries.sql',
    codeSnippet: `-- Relational Schema & Performance Benchmark Queries
CREATE TABLE IF NOT EXISTS student_grades (
    id SERIAL PRIMARY KEY,
    student_name VARCHAR(100) NOT NULL,
    course_track VARCHAR(50) NOT NULL,
    score INT CHECK (score >= 0 AND score <= 100),
    completed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO student_grades (student_name, course_track, score) VALUES
('Aarav Patel', 'Python & Data', 95),
('Meera Nair', 'Cloud & DevOps', 92),
('Rohan Joshi', 'Web Development', 88),
('Ananya Gupta', 'AI & Machine Learning', 97);

-- Analytical Window Query
SELECT 
    course_track,
    COUNT(id) AS total_enrolled,
    ROUND(AVG(score), 2) AS average_score,
    MAX(score) AS top_score
FROM student_grades
GROUP BY course_track
ORDER BY average_score DESC;`,
    syllabus: [
      {
        id: 'sql-1',
        title: 'Relational Database Principles & Schema Design',
        type: 'video',
        duration: '16 min',
        completed: false,
        videoUrl: 'https://www.youtube.com/embed/HXV3zeRR3h4',
        summary: 'Learn primary keys, foreign keys, table normalization (1NF, 2NF, 3NF), and entity-relationship diagrams.',
        keyPoints: ['Entity-Relationship modeling', 'Primary and Foreign key constraints', 'Database normalization rules', 'Data integrity constraints']
      },
      {
        id: 'sql-2',
        title: 'Writing Advanced SQL Queries, Joins & Subqueries',
        type: 'video',
        duration: '22 min',
        completed: false,
        videoUrl: 'https://www.youtube.com/embed/7S_tz1z_5bA',
        summary: 'Master INNER, LEFT, RIGHT, and FULL OUTER joins, aggregation functions, GROUP BY, and correlated subqueries.',
        keyPoints: ['Join mechanics and set operations', 'GROUP BY and HAVING filters', 'Correlated and nested subqueries', 'Common Table Expressions (WITH CTE)']
      },
      {
        id: 'sql-3',
        title: 'Database Indexing, B-Trees & Performance Optimization',
        type: 'video',
        duration: '28 min',
        completed: false,
        videoUrl: 'https://www.youtube.com/embed/fsG1XaWDais',
        summary: 'Understand B-tree and Hash indexes, EXPLAIN ANALYZE execution plans, query cache, and vacuum tuning.',
        keyPoints: ['How B-tree indexes speed up lookups', 'Analyzing execution plans with EXPLAIN', 'Composite vs single-column indexes', 'Avoiding table scans']
      },
      {
        id: 'sql-4',
        title: 'Database Architecture & Analytics Capstone',
        type: 'assignment',
        duration: '38 min',
        completed: false,
        videoUrl: 'https://www.youtube.com/embed/7Vtl2Wggqg4',
        summary: 'Design a scalable multi-table e-learning relational database with optimized indexes and analytical views.',
        keyPoints: ['Multi-table schema design', 'Writing analytical window functions', 'Creating materialised views', 'Benchmarking query execution speed']
      }
    ],
    liveWorkshopTitle: 'SQL Query Optimization Live Code Review',
    coursemates: ['Tarun Grover', 'Bhavna Kulkarni', 'Saurabh Pandey', 'Komal Jain', 'Amitav Ghosh']
  }
]

const MASTER_ASSIGNMENTS: Assignment[] = [
  {
    id: 'asg-1',
    courseId: 1,
    title: 'Pandas Data Analysis Capstone Project',
    course: 'Python Programming & Data Science Masterclass',
    dueDate: 'Sep 15, 2026',
    totalPoints: 100,
    status: 'Not Submitted'
  },
  {
    id: 'asg-2',
    courseId: 2,
    title: 'Docker Containerization & CI/CD Setup',
    course: 'Cloud Computing & DevOps with AWS & Docker',
    dueDate: 'Sep 22, 2026',
    totalPoints: 100,
    status: 'Not Submitted'
  },
  {
    id: 'asg-3',
    courseId: 3,
    title: 'Full-Stack React & Express App Submission',
    course: 'Full-Stack Web Development with React & Node.js',
    dueDate: 'Sep 28, 2026',
    totalPoints: 100,
    status: 'Not Submitted'
  },
  {
    id: 'asg-4',
    courseId: 4,
    title: 'AI Predictive Classifier Model Submission',
    course: 'Machine Learning & Artificial Intelligence Fundamentals',
    dueDate: 'Oct 05, 2026',
    totalPoints: 100,
    status: 'Not Submitted'
  },
  {
    id: 'asg-5',
    courseId: 5,
    title: 'Vulnerability Assessment & Defense Report',
    course: 'Cybersecurity & Ethical Hacking Essentials',
    dueDate: 'Oct 12, 2026',
    totalPoints: 100,
    status: 'Not Submitted'
  },
  {
    id: 'asg-6',
    courseId: 6,
    title: 'SQL Schema & Indexing Benchmark Project',
    course: 'Database Management Systems & SQL Mastery',
    dueDate: 'Oct 19, 2026',
    totalPoints: 100,
    status: 'Not Submitted'
  }
]

const INITIAL_COMMUNITY_MESSAGES: CommunityMessage[] = []

/* ==========================================================================
   APP ROOT COMPONENT
   ========================================================================== */

export default function App() {
  const [currentUser, setCurrentUser] = useState<UserSession | null>(() => {
    const saved = localStorage.getItem('palms_user')
    if (saved) {
      try {
        return JSON.parse(saved)
      } catch {
        return null
      }
    }
    return null
  })

  const [authModal, setAuthModal] = useState<'login' | 'register' | null>(null)
  const [page, setPage] = useState<PortalPage>('Overview')
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [notificationToast, setNotificationToast] = useState<string | null>(null)

  // Get normalized email key for consistent storage across sessions
  const getStorageKey = (prefix: string, email?: string) => {
    const targetEmail = (email || currentUser?.email || 'default').toLowerCase().trim()
    return `palms_${prefix}_${targetEmail}`
  }

  // Learner Enrolled Course IDs (Persisted per user email)
  const [enrolledIds, setEnrolledIds] = useState<number[]>(() => {
    const savedUser = localStorage.getItem('palms_user')
    if (savedUser) {
      try {
        const u = JSON.parse(savedUser)
        const key = `palms_enrolled_${(u.email || '').toLowerCase().trim()}`
        const savedEnrolled = localStorage.getItem(key)
        if (savedEnrolled) return JSON.parse(savedEnrolled)
      } catch {
        return []
      }
    }
    return []
  })

  // User Course Progress Map: { [courseId]: string[] (completed lesson ids) }
  const [courseProgressMap, setCourseProgressMap] = useState<Record<number, string[]>>(() => {
    const savedUser = localStorage.getItem('palms_user')
    if (savedUser) {
      try {
        const u = JSON.parse(savedUser)
        const key = `palms_progress_${(u.email || '').toLowerCase().trim()}`
        const savedProgress = localStorage.getItem(key)
        if (savedProgress) return JSON.parse(savedProgress)
      } catch {
        return {}
      }
    }
    return {}
  })

  // Submitted Assignments Map
  const [assignmentSubmissions, setAssignmentSubmissions] = useState<Record<string, Partial<Assignment>>>(() => {
    const savedUser = localStorage.getItem('palms_user')
    if (savedUser) {
      try {
        const u = JSON.parse(savedUser)
        const key = `palms_asg_${(u.email || '').toLowerCase().trim()}`
        const saved = localStorage.getItem(key)
        if (saved) return JSON.parse(saved)
      } catch {
        return {}
      }
    }
    return {}
  })

  // Community Messages State
  const [communityMessages, setCommunityMessages] = useState<CommunityMessage[]>(() => {
    const saved = localStorage.getItem('palms_community_messages')
    if (saved) {
      try {
        return JSON.parse(saved)
      } catch {
        return INITIAL_COMMUNITY_MESSAGES
      }
    }
    return INITIAL_COMMUNITY_MESSAGES
  })

  // Attended Live Workshops State
  const [attendedLiveIds, setAttendedLiveIds] = useState<number[]>(() => {
    const savedUser = localStorage.getItem('palms_user')
    if (savedUser) {
      try {
        const u = JSON.parse(savedUser)
        const key = `palms_attended_${(u.email || '').toLowerCase().trim()}`
        const saved = localStorage.getItem(key)
        if (saved) return JSON.parse(saved)
      } catch {
        return []
      }
    }
    return []
  })

  // Active Live Classroom State (null = not in live room, or Course = in live room)
  const [activeLiveRoom, setActiveLiveRoom] = useState<Course | null>(null)

  // Selected Course in Studio
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null)

  // Active Assignment in Submission Modal (null = closed)
  const [submittingAssignment, setSubmittingAssignment] = useState<Assignment | null>(null)

  const [notifications, setNotifications] = useState<NotificationItem[]>([
    {
      id: 'notif-1',
      title: 'Welcome to PAlms',
      message: 'Browse the catalog to enroll in your first course track.',
      timestamp: 'Just now',
      read: false,
      type: 'announcement'
    }
  ])

  const notify = (msg: string) => {
    setNotificationToast(msg)
    setTimeout(() => setNotificationToast(null), 3500)
  }

  const handleAuthSuccess = (name: string, email: string, role: Role, token?: string) => {
    const initials = name
      .split(' ')
      .filter(Boolean)
      .map(p => p[0])
      .join('')
      .substring(0, 2)
      .toUpperCase() || (role === 'Admin' ? 'RS' : 'PM')

    const normalizedEmail = email.toLowerCase().trim()
    const user: UserSession = { id: `usr-${Date.now()}`, name, email: normalizedEmail, role, initials }
    setCurrentUser(user)
    localStorage.setItem('palms_user', JSON.stringify(user))
    if (token) {
      localStorage.setItem('palms_auth_token', token)
    }

    // 100% Restore ALL persisted data for this user from localStorage
    const enrolledKey = `palms_enrolled_${normalizedEmail}`
    const progressKey = `palms_progress_${normalizedEmail}`
    const asgKey = `palms_asg_${normalizedEmail}`
    const attendedKey = `palms_attended_${normalizedEmail}`

    try {
      const savedEnrolled = localStorage.getItem(enrolledKey)
      setEnrolledIds(savedEnrolled ? JSON.parse(savedEnrolled) : [])
    } catch {
      setEnrolledIds([])
    }

    try {
      const savedProgress = localStorage.getItem(progressKey)
      setCourseProgressMap(savedProgress ? JSON.parse(savedProgress) : {})
    } catch {
      setCourseProgressMap({})
    }

    try {
      const savedAsg = localStorage.getItem(asgKey)
      setAssignmentSubmissions(savedAsg ? JSON.parse(savedAsg) : {})
    } catch {
      setAssignmentSubmissions({})
    }

    try {
      const savedAttended = localStorage.getItem(attendedKey)
      setAttendedLiveIds(savedAttended ? JSON.parse(savedAttended) : [])
    } catch {
      setAttendedLiveIds([])
    }

    setAuthModal(null)
    notify(`Welcome back, ${name}! Signed in as ${role}.`)
  }

  const handleLogout = () => {
    setCurrentUser(null)
    localStorage.removeItem('palms_user')
    localStorage.removeItem('palms_auth_token')
    setEnrolledIds([])
    setCourseProgressMap({})
    setAssignmentSubmissions({})
    setAttendedLiveIds([])
    setPage('Overview')
    setSelectedCourse(null)
    setActiveLiveRoom(null)
    notify('Logged out successfully. Your progress is securely saved.')
  }

  const handleJoinLiveRoom = (course: Course) => {
    setActiveLiveRoom(course)
    if (!attendedLiveIds.includes(course.id)) {
      const updated = [...attendedLiveIds, course.id]
      setAttendedLiveIds(updated)
      if (currentUser) {
        localStorage.setItem(`palms_attended_${currentUser.email.toLowerCase().trim()}`, JSON.stringify(updated))
      }
      notify(`Entered live classroom for "${course.title}"! Attendance recorded (+100%).`)
    } else {
      notify(`Entered virtual live classroom for "${course.title}"!`)
    }
  }

  const handleEnroll = (courseId: number) => {
    if (!enrolledIds.includes(courseId)) {
      const updated = [...enrolledIds, courseId]
      setEnrolledIds(updated)
      if (currentUser) {
        localStorage.setItem(getStorageKey('enrolled', currentUser.email), JSON.stringify(updated))
      }
      const course = MASTER_COURSES.find(c => c.id === courseId)
      notify(`Successfully enrolled in "${course?.title || 'Course'}"!`)
    }
  }

  const handleToggleLesson = (courseId: number, lessonId: string) => {
    const currentCompleted = courseProgressMap[courseId] || []
    const isAlready = currentCompleted.includes(lessonId)
    const updated = isAlready
      ? currentCompleted.filter(id => id !== lessonId)
      : [...currentCompleted, lessonId]

    const newMap = { ...courseProgressMap, [courseId]: updated }
    setCourseProgressMap(newMap)
    if (currentUser) {
      localStorage.setItem(getStorageKey('progress', currentUser.email), JSON.stringify(newMap))
    }

    const course = MASTER_COURSES.find(c => c.id === courseId)
    const totalLessons = course?.syllabus?.length || 4
    if (updated.length === totalLessons) {
      notify(`🎉 100% Completed! Certificate unlocked for ${course?.title}!`)
    } else {
      notify(isAlready ? 'Lesson marked incomplete.' : 'Lesson completed! Progress saved.')
    }
  }

  const handleSubmitAssignment = (asgId: string, githubLink: string, fileName: string) => {
    const updated = {
      ...assignmentSubmissions,
      [asgId]: {
        status: 'Pending Review' as const,
        score: undefined,
        githubLink,
        fileName,
        submittedAt: new Date().toLocaleDateString()
      }
    }
    setAssignmentSubmissions(updated)
    if (currentUser) {
      localStorage.setItem(getStorageKey('asg', currentUser.email), JSON.stringify(updated))

      const allSavedSubmissions = JSON.parse(localStorage.getItem('palms_master_submissions') || '{}')
      const targetAsg = MASTER_ASSIGNMENTS.find(a => a.id === asgId)
      allSavedSubmissions[`${currentUser.email}_${asgId}`] = {
        asgId,
        courseId: targetAsg?.courseId,
        courseTitle: targetAsg?.course,
        asgTitle: targetAsg?.title,
        studentName: currentUser.name,
        studentEmail: currentUser.email,
        githubLink,
        fileName,
        submittedAt: new Date().toLocaleDateString(),
        status: 'Pending Review',
        score: undefined
      }
      localStorage.setItem('palms_master_submissions', JSON.stringify(allSavedSubmissions))
    }
    setSubmittingAssignment(null)
    notify('Assignment submitted! Status: Pending Review (Awaiting Admin Evaluation).')
  }

  const handleAdminGradeAssignment = (submissionKey: string, studentEmail: string, asgId: string, score: number) => {
    const allSaved = JSON.parse(localStorage.getItem('palms_master_submissions') || '{}')
    if (allSaved[submissionKey]) {
      allSaved[submissionKey].status = 'Graded'
      allSaved[submissionKey].score = score
      localStorage.setItem('palms_master_submissions', JSON.stringify(allSaved))
    }

    const studentAsgKey = `palms_asg_${studentEmail.toLowerCase().trim()}`
    const studentAsgMap = JSON.parse(localStorage.getItem(studentAsgKey) || '{}')
    studentAsgMap[asgId] = {
      ...studentAsgMap[asgId],
      status: 'Graded',
      score
    }
    localStorage.setItem(studentAsgKey, JSON.stringify(studentAsgMap))

    if (currentUser?.email.toLowerCase().trim() === studentEmail.toLowerCase().trim()) {
      setAssignmentSubmissions(studentAsgMap)
    }

    notify(`Grade of ${score}/100 approved for ${studentEmail}. Status: Passed ✓`)
  }

  const handleSendCommunityMessage = (courseId: number, text: string, codeSnippet?: string) => {
    if (!currentUser || !text.trim()) return
    const newMsg: CommunityMessage = {
      id: `msg-${Date.now()}`,
      courseId,
      userName: currentUser.name,
      userRole: currentUser.role,
      userInitials: currentUser.initials,
      timestamp: 'Just now',
      text: text.trim(),
      codeSnippet: codeSnippet ? codeSnippet.trim() : undefined
    }
    const updated = [...communityMessages, newMsg]
    setCommunityMessages(updated)
    localStorage.setItem('palms_community_messages', JSON.stringify(updated))
    notify('Message posted in course discussion.')
  }

  // Calculate dynamic courses with live progress
  const dynamicCourses: Course[] = MASTER_COURSES.map(c => {
    const isEnrolled = enrolledIds.includes(c.id)
    const completedList = courseProgressMap[c.id] || []
    const total = c.syllabus?.length || 4
    const progressPercent = Math.round((completedList.length / total) * 100)

    const updatedSyllabus = (c.syllabus || []).map(s => ({
      ...s,
      completed: completedList.includes(s.id)
    }))

    return {
      ...c,
      completed: completedList.length,
      progress: progressPercent,
      syllabus: updatedSyllabus,
      status: progressPercent === 100 ? 'Completed' : isEnrolled ? 'Active' : 'Upcoming'
    }
  })

  // Dynamic assignments with user submissions
  const dynamicAssignments: Assignment[] = MASTER_ASSIGNMENTS.map(a => {
    const sub = assignmentSubmissions[a.id]
    if (sub) {
      return {
        ...a,
        status: (sub.status as any) || a.status,
        score: sub.score,
        githubLink: sub.githubLink,
        fileName: sub.fileName,
        submittedAt: sub.submittedAt
      }
    }
    return a
  })

  const enrolledCourses = dynamicCourses.filter(c => enrolledIds.includes(c.id))
  const completedCourses = enrolledCourses.filter(c => c.progress === 100)
  const activeAssignments = dynamicAssignments.filter(a => enrolledIds.includes(a.courseId))

  return (
    <>
      {notificationToast && (
        <div className="toast-notification-banner">
          <Sparkles size={16} />
          <span>{notificationToast}</span>
        </div>
      )}

      {/* Assignment Submission Modal */}
      {submittingAssignment && (
        <AssignmentSubmissionModal
          assignment={submittingAssignment}
          onClose={() => setSubmittingAssignment(null)}
          onSubmit={handleSubmitAssignment}
          notify={notify}
        />
      )}

      {/* Dedicated Full Page Auth Screen */}
      {!currentUser && authModal ? (
        <AuthPage
          mode={authModal}
          setMode={setAuthModal}
          onSuccess={handleAuthSuccess}
          onBack={() => setAuthModal(null)}
          notify={notify}
        />
      ) : !currentUser ? (
        /* Clean PAlms Landing Page with Scroll Parallax */
        <PAlmsLandingPage
          onOpenLogin={() => setAuthModal('login')}
          onOpenRegister={() => setAuthModal('register')}
          courses={dynamicCourses}
          notify={notify}
        />
      ) : (
        /* Full PAlms LMS Portal */
        <div className="app-shell">
          <div
            className={`sidebar-backdrop ${sidebarOpen ? 'active' : ''}`}
            onClick={() => setSidebarOpen(false)}
          />
          <PortalSidebar
            user={currentUser}
            page={page}
            setPage={p => {
              setPage(p)
              setSelectedCourse(null)
              setActiveLiveRoom(null)
              setSidebarOpen(false)
            }}
            sidebarOpen={sidebarOpen}
            onLogout={handleLogout}
            notify={notify}
          />

          <main className="main-area">
            <PortalTopbar
              user={currentUser}
              allCourses={dynamicCourses}
              onSelectCourse={(course) => {
                setSelectedCourse(course)
                setPage('Studio')
              }}
              onToggleSidebar={() => setSidebarOpen(!sidebarOpen)}
              notifications={notifications}
              onClearNotifications={() => setNotifications([])}
              notify={notify}
            />

            <div className="portal-content-container">
              {/* If in Live Classroom Room */}
              {activeLiveRoom ? (
                <LiveClassroomRoom
                  course={activeLiveRoom}
                  user={currentUser}
                  onLeave={() => setActiveLiveRoom(null)}
                  notify={notify}
                />
              ) : selectedCourse ? (
                <CourseStudio
                  course={dynamicCourses.find(c => c.id === selectedCourse.id) || selectedCourse}
                  onToggleLesson={(lessonId) => handleToggleLesson(selectedCourse.id, lessonId)}
                  onBack={() => setSelectedCourse(null)}
                  notify={notify}
                />
              ) : (
                <>
                  {page === 'Overview' && (
                    <PortalOverview
                      user={currentUser}
                      enrolledCourses={enrolledCourses}
                      completedCourses={completedCourses}
                      assignments={activeAssignments}
                      attendedLiveIds={attendedLiveIds}
                      onSelectCourse={setSelectedCourse}
                      onNavigate={setPage}
                      notify={notify}
                    />
                  )}
                  {page === 'My Learning' && (
                    <PortalMyLearning
                      enrolledCourses={enrolledCourses}
                      onSelectCourse={setSelectedCourse}
                      onNavigate={setPage}
                      notify={notify}
                    />
                  )}
                  {page === 'Catalog' && (
                    <PortalCatalog
                      courses={dynamicCourses}
                      enrolledIds={enrolledIds}
                      onEnroll={handleEnroll}
                      onSelectCourse={setSelectedCourse}
                      notify={notify}
                    />
                  )}
                  {page === 'Studio' && (
                    enrolledCourses.length > 0 ? (
                      <CourseStudio
                        course={enrolledCourses[0]}
                        onToggleLesson={(lessonId) => handleToggleLesson(enrolledCourses[0].id, lessonId)}
                        onBack={() => setPage('Overview')}
                        notify={notify}
                      />
                    ) : (
                      <EmptyEnrollPrompt
                        title="Course Studio"
                        desc="You haven't enrolled in any course yet. Enroll in a track from the catalog to launch the code studio."
                        onNavigate={() => setPage('Catalog')}
                      />
                    )
                  )}
                  {page === 'Assessments' && (
                    <PortalAssessments
                      user={currentUser}
                      assignments={activeAssignments}
                      enrolledCount={enrolledCourses.length}
                      onOpenSubmission={(asg) => setSubmittingAssignment(asg)}
                      onAdminGrade={handleAdminGradeAssignment}
                      onNavigate={setPage}
                      notify={notify}
                    />
                  )}
                  {page === 'Certificates' && (
                    <PortalCertificates
                      user={currentUser}
                      enrolledCourses={enrolledCourses}
                      assignments={dynamicAssignments}
                      onNavigate={setPage}
                      notify={notify}
                    />
                  )}
                  {page === 'Live Class' && (
                    <PortalLiveSessions
                      user={currentUser}
                      enrolledCourses={enrolledCourses}
                      attendedLiveIds={attendedLiveIds}
                      onJoinRoom={handleJoinLiveRoom}
                      onNavigate={setPage}
                      notify={notify}
                    />
                  )}
                  {page === 'Community' && (
                    <PortalCommunity
                      user={currentUser}
                      enrolledCourses={enrolledCourses}
                      allCourses={dynamicCourses}
                      messages={communityMessages}
                      onSendMessage={handleSendCommunityMessage}
                      onNavigate={setPage}
                      notify={notify}
                    />
                  )}
                  {page === 'People' && (
                    <PortalPeopleAdmin notify={notify} />
                  )}
                  {page === 'Settings' && (
                    <PortalSettings user={currentUser} notify={notify} />
                  )}
                </>
              )}
            </div>
          </main>
        </div>
      )}
    </>
  )
}

/* ==========================================================================
   SCROLL PROGRESS BAR (BLACK THEME)
   ========================================================================== */

function ScrollProgressBar() {
  const [scrollProgress, setScrollProgress] = useState(0)

  useEffect(() => {
    const handleScroll = () => {
      const totalHeight = document.documentElement.scrollHeight - window.innerHeight
      if (totalHeight > 0) {
        setScrollProgress((window.scrollY / totalHeight) * 100)
      }
    }
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <div
      className="scroll-progress-bar"
      style={{ width: `${scrollProgress}%` }}
    />
  )
}

/* ==========================================================================
   1. LANDING PAGE (PALMS ENTERPRISE LMS)
   ========================================================================== */

function PAlmsLandingPage({
  onOpenLogin,
  onOpenRegister,
  courses,
  notify
}: {
  onOpenLogin: () => void
  onOpenRegister: () => void
  courses: Course[]
  notify: (m: string) => void
}) {
  const [selectedFeature, setSelectedFeature] = useState(0)
  const [selectedTrack, setSelectedTrack] = useState('All Tracks')
  const [newsletterEmail, setNewsletterEmail] = useState('')
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 })
  const [scrollY, setScrollY] = useState(0)
  const [navVisible, setNavVisible] = useState(true)
  const lastScrollY = useRef(0)

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY
      setScrollY(currentScrollY)

      if (currentScrollY > lastScrollY.current && currentScrollY > 70) {
        setNavVisible(false)
      } else if (currentScrollY < lastScrollY.current || currentScrollY <= 70) {
        setNavVisible(true)
      }
      lastScrollY.current = currentScrollY
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const handleMouseMove = (e: React.MouseEvent) => {
    const rect = e.currentTarget.getBoundingClientRect()
    const x = (e.clientX - rect.left) / rect.width - 0.5
    const y = (e.clientY - rect.top) / rect.height - 0.5
    setMousePos({ x, y })
  }

  const tiltX = -mousePos.y * 12 + Math.min(scrollY * 0.02, 6)
  const tiltY = mousePos.x * 12

  const features = [
    {
      title: 'Interactive Code Editor',
      desc: 'Practice real Python, JavaScript, and database queries directly in your browser with instant feedback.',
      icon: Code2
    },
    {
      title: 'Structured Learning Paths',
      desc: 'Step-by-step curriculums designed to take you from foundational concepts to advanced real-world mastery.',
      icon: BookOpen
    },
    {
      title: 'Student Progress Tracking',
      desc: 'Track completed lessons, view quiz scorecards, and monitor your personal learning velocity.',
      icon: LineChart
    },
    {
      title: 'Official Certificates',
      desc: 'Earn shareable completion certificates to prove your skills and bolster your professional portfolio.',
      icon: Award
    }
  ]

  const tracks = [
    'All Tracks',
    'Python & Data',
    'Cloud & DevOps',
    'Web Development',
    'AI & Machine Learning',
    'Cyber Defense',
    'Databases & SQL'
  ]

  const filteredCourses =
    selectedTrack === 'All Tracks' ? courses : courses.filter(c => c.track === selectedTrack)

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault()
    if (!newsletterEmail.trim()) return
    notify(`Subscribed ${newsletterEmail} to PAlms Learning Dispatch.`)
    setNewsletterEmail('')
  }

  return (
    <div style={{ position: 'relative', minHeight: '100vh', background: '#fafafa' }}>
      <ScrollProgressBar />

      {/* Floating Pill Nav Header */}
      <header className={`floating-nav-header ${navVisible ? 'nav-visible' : 'nav-hidden'}`}>
        <div className="nav-brand-group" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
          <div className="nav-logo-box">P</div>
          <b>PAlms</b>
        </div>

        <nav className="nav-menu-links">
          <a href="#features">Features</a>
          <a href="#courses">Courses</a>
          <a href="#paths">Learning Paths</a>
          <a href="#community">Community</a>
        </nav>

        <div className="nav-auth-actions">
          <button className="btn-ghost-pill" onClick={onOpenLogin}>
            Log In
          </button>
          <button className="btn-pill-dark" onClick={onOpenRegister}>
            Get Started
            <ArrowRight size={14} />
          </button>
        </div>
      </header>

      {/* Hero Section */}
      <section className="landing-hero-section">
        <h1 className="landing-hero-title">
          <span className="hero-word-wrap" style={{ animationDelay: '0.04s' }}>Manage,</span>{' '}
          <span className="hero-word-wrap" style={{ animationDelay: '0.11s' }}>Educate,</span>{' '}
          <span className="hero-word-wrap" style={{ animationDelay: '0.18s' }}>&amp;</span>{' '}
          <span className="hero-word-wrap" style={{ animationDelay: '0.25s' }}>Track</span>{' '}
          <span className="hero-word-wrap" style={{ animationDelay: '0.32s' }}>Every</span>{' '}
          <span className="hero-word-wrap" style={{ animationDelay: '0.39s' }}>Learner.</span><br />
          <span className="hero-word-wrap gradient-text-shimmer" style={{ animationDelay: '0.48s' }}>
            All From One Platform.
          </span>
        </h1>

        <p className="landing-hero-desc">
          The modern learning platform for mastering Python, Cloud computing, Web Development, and AI with interactive lessons, hands-on practice, and verified certificates.
        </p>

        <div className="hero-btn-row">
          <button className="btn-pill-dark" onClick={onOpenRegister} style={{ padding: '12px 28px', fontSize: '15px' }}>
            Get Started Free
            <ArrowRight size={16} />
          </button>
        </div>

        {/* Hero 3D Parallax Stage */}
        <div
          className="hero-parallax-stage"
          onMouseMove={handleMouseMove}
          onMouseLeave={() => setMousePos({ x: 0, y: 0 })}
        >
          <div className="parallax-ambient-orb-1" />
          <div className="parallax-ambient-orb-2" />

          {/* Hero 3D Browser Mockup */}
          <div
            className="hero-browser-card"
            style={{
              transform: `perspective(1200px) rotateX(${tiltX}deg) rotateY(${tiltY}deg) translateY(${Math.min(scrollY * -0.04, 0)}px)`,
              transition: 'transform 0.15s ease-out, box-shadow 0.3s ease'
            }}
          >
            <div className="browser-header-bar">
              <div className="browser-dots">
                <span />
                <span />
                <span />
              </div>
            </div>

            <div className="browser-inner-content">
              <div className="browser-sidebar-mock">
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px', padding: '0 8px' }}>
                  <div className="nav-logo-box" style={{ width: '26px', height: '26px', fontSize: '12px' }}>P</div>
                  <span style={{ fontWeight: 800, fontSize: '13px' }}>PAlms</span>
                </div>
                <div className="browser-sidebar-item active">
                  <LayoutDashboard size={14} />
                  <span>Overview</span>
                </div>
                <div className="browser-sidebar-item">
                  <BookOpen size={14} />
                  <span>Courses</span>
                </div>
                <div className="browser-sidebar-item">
                  <Award size={14} />
                  <span>Certificates</span>
                </div>
                <div className="browser-sidebar-item">
                  <LineChart size={14} />
                  <span>Progress</span>
                </div>
              </div>

              <div className="browser-main-mock">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <h3 style={{ fontSize: '18px', fontWeight: 800 }}>Explore Core Programs</h3>
                    <p style={{ fontSize: '12.5px', color: 'var(--text-muted)' }}>
                      Select a learning path to begin hands-on coursework.
                    </p>
                  </div>
                  <button className="btn-pill-dark" style={{ height: '32px', fontSize: '11.5px', padding: '0 14px' }} onClick={onOpenRegister}>
                    Start Free
                  </button>
                </div>

                <div className="mock-metrics-row">
                  <div className="mock-metric-card">
                    <span>COURSES OFFERED</span>
                    <b>6 Tracks</b>
                  </div>
                  <div className="mock-metric-card">
                    <span>INTERACTIVE LABS</span>
                    <b>24 Lessons</b>
                  </div>
                  <div className="mock-metric-card">
                    <span>CERTIFICATION</span>
                    <b>Included</b>
                  </div>
                </div>

                {/* Simulated Lesson Row */}
                <div style={{ background: '#fafafa', border: '1px solid var(--border-light)', borderRadius: 'var(--radius-md)', padding: '16px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px', fontSize: '12px', fontWeight: 700 }}>
                    <span>Featured Track Preview</span>
                    <span style={{ fontSize: '11px', color: '#10b981', fontWeight: 600 }}>Active Enrollment</span>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '13px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <div style={{ width: '28px', height: '28px', borderRadius: '50%', background: 'var(--bg-dark)', color: '#fff', display: 'grid', placeItems: 'center', fontSize: '11px', fontWeight: 700 }}>
                        <Code2 size={14} />
                      </div>
                      <b>Python Programming & Data Science Masterclass</b>
                    </div>
                    <button className="btn-pill-light" style={{ height: '28px', fontSize: '11px', padding: '0 10px' }} onClick={onOpenRegister}>
                      Preview
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Platform Features Section */}
      <section id="features" className="landing-features-section">
        <div className="section-centered-header">
          <h2>Everything You Need to Master Modern Skills</h2>
          <p>
            From interactive coding exercises to guided video lectures, PAlms provides an all-in-one learning environment.
          </p>
        </div>

        <div className="feature-tabs-pill-row">
          {features.map((feat, idx) => {
            const Icon = feat.icon
            return (
              <button
                key={feat.title}
                className={`feature-pill-btn ${selectedFeature === idx ? 'active' : ''}`}
                onClick={() => setSelectedFeature(idx)}
              >
                <Icon size={16} />
                <span>{feat.title}</span>
              </button>
            )
          })}
        </div>

        <div className="feature-interactive-showcase">
          <div className="feature-showcase-sidebar">
            <h3>{features[selectedFeature].title}</h3>
            <p>{features[selectedFeature].desc}</p>
            <button className="btn-pill-dark" onClick={onOpenRegister}>
              Start Learning Now
              <ArrowRight size={14} />
            </button>
          </div>

          <div className="feature-showcase-preview">
            <div className="feature-preview-topbar">
              <div className="browser-dots">
                <span />
                <span />
                <span />
              </div>
              <span style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-secondary)' }}>Live Demo Preview</span>
            </div>

            <div className="feature-preview-body">
              {selectedFeature === 0 && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <b>Interactive Code Runner</b>
                    <span style={{ fontSize: '12px', background: '#ecfdf5', color: '#047857', padding: '3px 10px', borderRadius: 'var(--radius-full)', fontWeight: 600 }}>Python 3.12</span>
                  </div>
                  <div style={{ background: '#09090b', color: '#a1a1aa', padding: '18px', borderRadius: 'var(--radius-md)', fontFamily: 'var(--font-mono)', fontSize: '13px', lineHeight: '1.6' }}>
                    <span style={{ color: '#60a5fa' }}>import</span> pandas <span style={{ color: '#60a5fa' }}>as</span> pd<br /><br />
                    <span style={{ color: '#4ade80' }}># Hands-on Data Analysis</span><br />
                    students = pd.DataFrame({'{'}"score": [92, 98, 95]{'}'})<br />
                    <span style={{ color: '#facc15' }}>print</span>("Top Score:", students["score"].max())
                  </div>
                </div>
              )}

              {selectedFeature === 1 && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  <b style={{ fontSize: '14px' }}>Step-by-Step Curriculum Roadmap</b>
                  {[
                    { step: '1', title: 'Fundamentals & Core Concepts', duration: '2 Weeks' },
                    { step: '2', title: 'Hands-on Projects & Code Labs', duration: '3 Weeks' },
                    { step: '3', title: 'Capstone Assessment & Certificate', duration: '1 Week' }
                  ].map(item => (
                    <div key={item.step} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 16px', background: '#ffffff', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-light)', fontSize: '13px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <div style={{ width: '22px', height: '22px', borderRadius: '50%', background: 'var(--bg-dark)', color: '#fff', display: 'grid', placeItems: 'center', fontSize: '11px', fontWeight: 700 }}>
                          {item.step}
                        </div>
                        <b>{item.title}</b>
                      </div>
                      <span style={{ color: 'var(--text-muted)', fontSize: '12px' }}>{item.duration}</span>
                    </div>
                  ))}
                </div>
              )}

              {selectedFeature === 2 && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                  <b style={{ fontSize: '14px' }}>Personal Learning Dashboard</b>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                    <div style={{ padding: '16px', background: '#ffffff', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-light)' }}>
                      <span style={{ fontSize: '11px', color: 'var(--text-muted)', fontWeight: 700 }}>COMPLETED MODULES</span>
                      <div style={{ fontSize: '26px', fontWeight: 800, marginTop: '4px' }}>4 / 4</div>
                    </div>
                    <div style={{ padding: '16px', background: '#ffffff', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-light)' }}>
                      <span style={{ fontSize: '11px', color: 'var(--text-muted)', fontWeight: 700 }}>AVERAGE SCORE</span>
                      <div style={{ fontSize: '26px', fontWeight: 800, marginTop: '4px', color: '#10b981' }}>96%</div>
                    </div>
                  </div>
                </div>
              )}

              {selectedFeature === 3 && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                  <b style={{ fontSize: '14px' }}>Verified Completion Certificate</b>
                  <div style={{ background: '#ffffff', border: '1px solid var(--border-light)', borderRadius: 'var(--radius-md)', padding: '18px', textAlign: 'center' }}>
                    <h4 style={{ fontSize: '16px', fontWeight: 800 }}>Python & Data Science Mastery</h4>
                    <p style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '4px' }}>Issued by PAlms Learning Platform</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Learning Paths Section */}
      <section id="paths" className="solutions-section">
        <div className="section-centered-header">
          <h2>Designed for Every Stage of Your Career</h2>
          <p>
            Whether you are just starting out or expanding your expertise, choose a path designed for real career growth.
          </p>
        </div>

        <div className="solutions-grid">
          <div className="solution-card">
            <div className="solution-icon-box">
              <BookOpen size={22} />
            </div>
            <h3>Beginner Fundamentals</h3>
            <p>
              Build strong foundations in programming logic, modern web technologies, and database fundamentals.
            </p>
            <ul>
              <li><Check size={14} /> Clear step-by-step video tutorials</li>
              <li><Check size={14} /> Guided hands-on code exercises</li>
              <li><Check size={14} /> Self-paced milestone quizzes</li>
            </ul>
          </div>

          <div className="solution-card">
            <div className="solution-icon-box">
              <Code2 size={22} />
            </div>
            <h3>Intermediate Specialization</h3>
            <p>
              Deep-dive into Cloud architecture, DevOps pipelines, full-stack frameworks, and scalable systems.
            </p>
            <ul>
              <li><Check size={14} /> Practical portfolio projects</li>
              <li><Check size={14} /> Cloud & Docker setup workshops</li>
              <li><Check size={14} /> Interactive live coding labs</li>
            </ul>
          </div>

          <div className="solution-card">
            <div className="solution-icon-box">
              <Award size={22} />
            </div>
            <h3>Advanced & Certified</h3>
            <p>
              Master AI neural models, ethical hacking protocols, and earn verified credentials to showcase your work.
            </p>
            <ul>
              <li><Check size={14} /> Advanced capstone projects</li>
              <li><Check size={14} /> Shareable digital certificates</li>
              <li><Check size={14} /> Community peer code reviews</li>
            </ul>
          </div>
        </div>
      </section>

      {/* Curriculum Catalog Section */}
      <section id="courses" className="landing-curriculum-section">
        <div className="section-centered-header">
          <h2>Comprehensive Course Catalog</h2>
          <p>
            Browse high-demand courses taught with hands-on exercises and real-world projects.
          </p>
        </div>

        <div className="track-filter-row">
          {tracks.map(t => (
            <button
              key={t}
              className={`track-filter-tab ${selectedTrack === t ? 'active' : ''}`}
              onClick={() => setSelectedTrack(t)}
            >
              {t}
            </button>
          ))}
        </div>

        <div className="courses-grid-layout">
          {filteredCourses.map(course => (
            <article key={course.id} className="lms-course-card" onClick={onOpenRegister}>
              <div className="course-card-top-art">
                <span className="course-track-tag">
                  <BookOpen size={12} />
                  {course.track}
                </span>
                <span className="course-card-level-badge">
                  {course.level}
                </span>
              </div>
              <div className="course-card-content">
                <h3>{course.title}</h3>
                <p>{course.description}</p>
                <div style={{ marginTop: 'auto', paddingTop: '16px', borderTop: '1px solid var(--border-light)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>{course.lessons} Lessons</span>
                  <button className="btn-pill-dark" style={{ height: '32px', fontSize: '11.5px', padding: '0 14px' }}>
                    Enroll Now
                    <ArrowRight size={12} />
                  </button>
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* Community Section */}
      <section id="community" className="landing-features-section" style={{ paddingTop: '0' }}>
        <div className="portal-welcome-hero-card" style={{ background: '#ffffff', border: '1px solid var(--border-light)' }}>
          <div>
            <h3 style={{ fontSize: '24px', fontWeight: 800 }}>Join Fellow Learners Today</h3>
            <p style={{ fontSize: '14px', color: 'var(--text-secondary)', marginTop: '4px', maxWidth: '560px' }}>
              Collaborate, share solutions, and get answers from instructors and peers in active study groups.
            </p>
          </div>
          <button className="btn-pill-dark" onClick={onOpenRegister} style={{ padding: '12px 24px' }}>
            Join Community Free
            <ArrowRight size={15} />
          </button>
        </div>
      </section>

      {/* Full-Screen Wide Dark Footer */}
      <footer className="palms-footer">
        <div className="palms-footer-inner">
          <div className="footer-columns-grid">
            <div className="footer-brand-summary">
              <div className="nav-brand-group" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
                <div className="nav-logo-box">P</div>
                <b style={{ color: '#ffffff' }}>PAlms</b>
              </div>
              <p>
                The all-in-one modern learning management platform for mastering in-demand programming and technology skills.
              </p>
            </div>

            <div className="footer-nav-col">
              <h4>Navigation</h4>
              <ul>
                <li><a href="#features">Features</a></li>
                <li><a href="#courses">Courses</a></li>
                <li><a href="#paths">Learning Paths</a></li>
                <li><a href="#community">Community</a></li>
              </ul>
            </div>

            <div className="footer-nav-col">
              <h4>Popular Tracks</h4>
              <ul>
                <li><a href="#courses">Python & Data Science</a></li>
                <li><a href="#courses">Cloud & DevOps with AWS</a></li>
                <li><a href="#courses">Full-Stack Web Development</a></li>
                <li><a href="#courses">Machine Learning & AI</a></li>
              </ul>
            </div>

            <div className="footer-newsletter-box">
              <h4>Learning Dispatch</h4>
              <p>Get weekly updates on new courses, project templates, and study guides.</p>
              <form className="footer-newsletter-form" onSubmit={handleSubscribe}>
                <input
                  type="email"
                  placeholder="Enter your email"
                  value={newsletterEmail}
                  onChange={e => setNewsletterEmail(e.target.value)}
                />
                <button type="submit" className="btn-pill-dark" style={{ height: '40px', padding: '0 18px', fontSize: '13px', background: '#ffffff', color: '#09090b' }}>
                  Subscribe
                </button>
              </form>
            </div>
          </div>

          {/* Antigravity-Style Giant Display Brand Wordmark */}
          <div className="footer-antigravity-brand-banner">
            <span className="footer-giant-wordmark">PAlms</span>
          </div>

          <div className="footer-legal-bar">
            <div>© 2026 PAlms Platform Inc. All rights reserved.</div>
            <div style={{ display: 'flex', gap: '20px' }}>
              <a href="#privacy" onClick={e => { e.preventDefault(); notify('Privacy Policy') }}>Privacy</a>
              <a href="#terms" onClick={e => { e.preventDefault(); notify('Terms of Service') }}>Terms</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}

/* ==========================================================================
   2. DEDICATED FULL-SCREEN AUTHENTICATION PAGE (LOGIN / REGISTER)
   ========================================================================== */

function AuthPage({
  mode,
  setMode,
  onSuccess,
  onBack,
  notify
}: {
  mode: 'login' | 'register'
  setMode: (m: 'login' | 'register') => void
  onSuccess: (name: string, email: string, role: Role, token?: string) => void
  onBack: () => void
  notify: (m: string) => void
}) {
  const [role, setRole] = useState<Role>('Learner')
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)

  const handleGoogleClick = async () => {
    setLoading(true)
    try {
      if (window.google?.accounts?.id) {
        window.google.accounts.id.initialize({
          client_id: GOOGLE_CLIENT_ID,
          callback: async (response: any) => {
            if (response.credential) {
              await sendGoogleTokenToBackend(response.credential)
            } else {
              setLoading(false)
              notify('Google sign-in was cancelled.')
            }
          }
        })
        window.google.accounts.id.prompt((notification: any) => {
          if (notification.isNotDisplayed() || notification.isSkippedMoment()) {
            setLoading(false)
            notify('Google prompt closed. Please add http://localhost:5173 to Google Cloud Console origins or use email sign-in.')
          }
        })
      } else {
        setLoading(false)
        notify('Google Identity service is loading. Please try again in a moment.')
      }
    } catch (err) {
      setLoading(false)
      notify('Google authentication error. Please try email sign-in.')
    }
  }

  const sendGoogleTokenToBackend = async (credential: string) => {
    try {
      const res = await fetch(`${API_BASE_URL}/auth/google`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ credential, role })
      })
      const data = await res.json()
      if (data.ok && data.user) {
        onSuccess(data.user.name, data.user.email, data.user.role || role, data.token)
      } else {
        notify(data.message || 'Google authentication failed.')
      }
    } catch {
      notify('Unable to reach authentication server on port 4000.')
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email.trim() || !password.trim()) {
      notify('Please fill in your email and password.')
      return
    }

    setLoading(true)
    const endpoint = mode === 'register' ? `${API_BASE_URL}/auth/register` : `${API_BASE_URL}/auth/login`
    const payload = {
      name: name.trim(),
      email: email.trim(),
      password,
      role
    }

    try {
      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      })

      const data = await res.json()

      if (mode === 'register') {
        if (data.ok) {
          notify('Account registered successfully! Please log in with your password.')
          setPassword('')
          setMode('login')
        } else {
          notify(data.message || 'Registration failed. Please check your details.')
        }
      } else {
        // Log in flow
        if (data.ok && data.user) {
          onSuccess(data.user.name, data.user.email, data.user.role || role, data.token)
        } else {
          notify(data.message || 'Authentication failed. Please check your credentials or register.')
        }
      }
    } catch (err) {
      console.warn('Authentication request error:', err)
      notify('Unable to reach server. Please ensure the backend is running on port 4000.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="auth-fullpage-wrapper">
      <header className="auth-fullpage-header">
        <button className="btn-ghost-pill auth-back-btn" onClick={onBack} style={{ fontWeight: 600 }}>
          <span className="auth-back-text-full">← Back to PAlms Home</span>
          <span className="auth-back-text-short">← Home</span>
        </button>

        <div className="nav-brand-group" onClick={onBack}>
          <div className="nav-logo-box">P</div>
          <b>PAlms Platform</b>
        </div>

        <div className="auth-header-action-group">
          <span className="auth-header-helper-text">
            {mode === 'login' ? "Don't have an account?" : "Already have an account?"}
          </span>
          <button
            className="btn-pill-light auth-header-toggle-btn"
            onClick={() => setMode(mode === 'login' ? 'register' : 'login')}
          >
            {mode === 'login' ? 'Register' : 'Log In'}
          </button>
        </div>
      </header>

      <div className="auth-fullpage-body">
        <div className="auth-brand-panel">
          <h1>
            {mode === 'login'
              ? 'Welcome Back to Your Learning Dashboard.'
              : 'Start Your Journey with PAlms Today.'}
          </h1>

          <p>
            {mode === 'login'
              ? 'Log in to continue your Python, Cloud Computing, Full-Stack and AI coursework with interactive lessons.'
              : 'Join fellow learners mastering modern programming stacks with hands-on practice and verified certificates.'}
          </p>

          <div className="auth-features-list-box">
            <div className="auth-feature-row">
              <div className="auth-feature-icon">
                <Code2 size={18} />
              </div>
              <div>
                <b style={{ fontSize: '13.5px', display: 'block' }}>Interactive Code Practice</b>
                <span style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>Write and test Python, JavaScript, and SQL in your browser.</span>
              </div>
            </div>

            <div className="auth-feature-row">
              <div className="auth-feature-icon">
                <Award size={18} />
              </div>
              <div>
                <b style={{ fontSize: '13.5px', display: 'block' }}>Official Completion Certificates</b>
                <span style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>Earn digital certificates to showcase your achievements.</span>
              </div>
            </div>

            <div className="auth-feature-row">
              <div className="auth-feature-icon">
                <Users size={18} />
              </div>
              <div>
                <b style={{ fontSize: '13.5px', display: 'block' }}>Live Classes & Community</b>
                <span style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>Join live workshops and discuss projects with peers.</span>
              </div>
            </div>
          </div>
        </div>

        <div className="auth-card-main">
          <div>
            <h2 style={{ fontSize: '24px', fontWeight: 800, letterSpacing: '-0.5px' }}>
              {mode === 'login' ? 'Log in to PAlms' : 'Create an Account'}
            </h2>
            <p style={{ fontSize: '13px', color: 'var(--text-secondary)', marginTop: '4px' }}>
              Choose your role below to access your customized dashboard.
            </p>
          </div>

          <div>
            <label style={{ fontSize: '12px', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.6px', display: 'block', marginBottom: '8px' }}>
              Select Role
            </label>
            <div className="auth-role-select-grid">
              <div
                className={`auth-role-option-card ${role === 'Learner' ? 'active' : ''}`}
                onClick={() => setRole('Learner')}
              >
                <div className="auth-role-top-row">
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <GraduationCap size={18} />
                    <span>Learner</span>
                  </div>
                  {role === 'Learner' && <Check size={16} />}
                </div>
                <p>Access courses, interactive coding labs, and quizzes.</p>
              </div>

              <div
                className={`auth-role-option-card ${role === 'Admin' ? 'active' : ''}`}
                onClick={() => setRole('Admin')}
              >
                <div className="auth-role-top-row">
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <ShieldCheck size={18} />
                    <span>Administrator</span>
                  </div>
                  {role === 'Admin' && <Check size={16} />}
                </div>
                <p>Manage curriculum, student rosters, and view analytics.</p>
              </div>
            </div>
          </div>

          {/* Single Unified Google Sign-In Button */}
          <button
            type="button"
            className="btn-google-login"
            onClick={handleGoogleClick}
            disabled={loading}
            style={{ width: '100%' }}
          >
            <svg width="18" height="18" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.665-5.17 3.665-9.17z"
              />
              <path
                fill="#34A853"
                d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.26 21.36 7.33 24 12 24z"
              />
              <path
                fill="#FBBC05"
                d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.25C.45 8.18 0 9.98 0 12s.45 3.82 1.25 5.42l4.03-3.15z"
              />
              <path
                fill="#EA4335"
                d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.33 0 3.26 2.64 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98z"
              />
            </svg>
            <span>{mode === 'register' ? 'Sign up with Google' : 'Sign in with Google'}</span>
          </button>

          <div className="auth-divider-line">
            <span>or continue with email</span>
          </div>

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {mode === 'register' && (
              <div className="auth-field-group">
                <label>Full Name</label>
                <input
                  type="text"
                  placeholder="Enter your full name"
                  value={name}
                  onChange={e => setName(e.target.value)}
                />
              </div>
            )}

            <div className="auth-field-group">
              <label>Email Address</label>
              <input
                type="email"
                placeholder="name@example.com"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
              />
            </div>

            <div className="auth-field-group">
              <label>Password</label>
              <input
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                required
              />
            </div>

            <button
              type="submit"
              className="btn-pill-dark"
              style={{ height: '44px', fontSize: '14px', marginTop: '6px' }}
              disabled={loading}
            >
              {loading
                ? 'Processing...'
                : mode === 'login'
                ? `Log in as ${role}`
                : `Create ${role} Account`}
              <ArrowRight size={15} />
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}

/* ==========================================================================
   PORTAL SIDEBAR
   ========================================================================== */

function PortalSidebar({
  user,
  page,
  setPage,
  sidebarOpen,
  onLogout,
  notify
}: {
  user: UserSession
  page: PortalPage
  setPage: (p: PortalPage) => void
  sidebarOpen: boolean
  onLogout: () => void
  notify: (m: string) => void
}) {
  const learnerNav: { label: PortalPage; icon: any }[] = [
    { label: 'Overview', icon: LayoutDashboard },
    { label: 'My Learning', icon: BookOpen },
    { label: 'Catalog', icon: Compass },
    { label: 'Studio', icon: Terminal },
    { label: 'Assessments', icon: FileText },
    { label: 'Certificates', icon: Award },
    { label: 'Live Class', icon: Radio },
    { label: 'Community', icon: MessageSquare }
  ]

  const adminNav: { label: PortalPage; icon: any }[] = [
    { label: 'Overview', icon: LayoutDashboard },
    { label: 'Catalog', icon: Compass },
    { label: 'People', icon: Users },
    { label: 'Live Class', icon: Radio },
    { label: 'Community', icon: MessageSquare },
    { label: 'Settings', icon: Settings }
  ]

  const items = user.role === 'Admin' ? adminNav : learnerNav

  return (
    <aside className={`portal-sidebar ${sidebarOpen ? 'open' : ''}`}>
      <div className="sidebar-brand-box">
        <div className="nav-brand-group">
          <div className="nav-logo-box">P</div>
          <b>PAlms Portal</b>
        </div>
        <button
          className="sidebar-close-btn"
          onClick={() => setPage(page)}
          aria-label="Close menu"
        >
          <X size={18} />
        </button>
      </div>

      <div style={{ padding: '0 16px', marginBottom: '16px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '10px 12px', background: '#fafafa', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-light)' }}>
          <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: '#09090b', color: '#ffffff', display: 'grid', placeItems: 'center', fontSize: '12px', fontWeight: 800 }}>
            {user.initials}
          </div>
          <div style={{ overflow: 'hidden' }}>
            <b style={{ fontSize: '13px', display: 'block', textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap' }}>
              {user.name}
            </b>
            <span style={{ fontSize: '11px', color: 'var(--text-muted)', display: 'block', textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap' }}>
              {user.email}
            </span>
          </div>
        </div>
      </div>

      <nav className="sidebar-nav-list">
        {items.map(item => {
          const Icon = item.icon
          const isActive = page === item.label
          return (
            <button
              key={item.label}
              className={`sidebar-nav-item ${isActive ? 'active' : ''}`}
              onClick={() => setPage(item.label)}
            >
              <Icon size={16} />
              <span>{item.label}</span>
            </button>
          )
        })}
      </nav>

      <div style={{ marginTop: 'auto', padding: '16px' }}>
        <button
          className="sidebar-signout-btn"
          onClick={onLogout}
        >
          <LogOut size={16} />
          <span>Sign Out</span>
        </button>
      </div>
    </aside>
  )
}

/* ==========================================================================
   PORTAL TOPBAR WITH LIVE SEARCH DROPDOWN
   ========================================================================== */

function PortalTopbar({
  user,
  allCourses,
  onSelectCourse,
  onToggleSidebar,
  notifications,
  onClearNotifications,
  notify
}: {
  user: UserSession
  allCourses: Course[]
  onSelectCourse: (c: Course) => void
  onToggleSidebar: () => void
  notifications: NotificationItem[]
  onClearNotifications: () => void
  notify: (m: string) => void
}) {
  const [notifOpen, setNotifOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [searchFocused, setSearchFocused] = useState(false)

  const matchingCourses = searchQuery.trim()
    ? allCourses.filter(
        c =>
          c.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          c.track.toLowerCase().includes(searchQuery.toLowerCase()) ||
          c.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
          c.syllabus.some(s => s.title.toLowerCase().includes(searchQuery.toLowerCase()))
      )
    : []

  return (
    <header className="portal-topbar">
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', position: 'relative' }}>
        <button className="mobile-menu-toggle-btn" onClick={onToggleSidebar}>
          <Menu size={20} />
        </button>

        {/* Search Bar Container */}
        <div style={{ position: 'relative' }}>
          <div className="topbar-search-bar">
            <Search size={15} color="var(--text-muted)" />
            <input
              type="text"
              placeholder="Search courses, lessons, topics (e.g. Python, Docker, SQL)..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              onFocus={() => setSearchFocused(true)}
              onBlur={() => setTimeout(() => setSearchFocused(false), 250)}
            />
            {searchQuery && (
              <button
                style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)' }}
                onClick={() => setSearchQuery('')}
              >
                <X size={14} />
              </button>
            )}
          </div>

          {/* Search Dropdown Results */}
          {searchFocused && searchQuery.trim().length > 0 && (
            <div
              style={{
                position: 'absolute',
                top: '46px',
                left: 0,
                width: '420px',
                background: '#ffffff',
                border: '1px solid var(--border-light)',
                borderRadius: 'var(--radius-lg)',
                boxShadow: 'var(--shadow-xl)',
                zIndex: 9999,
                padding: '12px',
                maxHeight: '360px',
                overflowY: 'auto'
              }}
            >
              <div style={{ fontSize: '11px', fontWeight: 700, color: 'var(--text-muted)', marginBottom: '8px', padding: '0 8px' }}>
                MATCHING COURSES & LABS ({matchingCourses.length})
              </div>

              {matchingCourses.length === 0 ? (
                <div style={{ padding: '16px 8px', textAlign: 'center', fontSize: '13px', color: 'var(--text-secondary)' }}>
                  No courses found for "{searchQuery}". Try searching for <b>Python</b>, <b>Docker</b>, <b>React</b>, or <b>SQL</b>.
                </div>
              ) : (
                matchingCourses.map(c => (
                  <div
                    key={c.id}
                    onClick={() => {
                      onSelectCourse(c)
                      setSearchQuery('')
                      setSearchFocused(false)
                      notify(`Opened course studio for ${c.title}.`)
                    }}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '10px 12px',
                      borderRadius: 'var(--radius-sm)',
                      cursor: 'pointer',
                      transition: 'background 0.15s ease'
                    }}
                    onMouseEnter={e => (e.currentTarget.style.background = '#f4f4f5')}
                    onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <div style={{ width: '28px', height: '28px', borderRadius: '50%', background: 'var(--bg-dark)', color: '#fff', display: 'grid', placeItems: 'center' }}>
                        <Code2 size={14} />
                      </div>
                      <div>
                        <b style={{ fontSize: '13px', display: 'block' }}>{c.title}</b>
                        <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>{c.track} • {c.lessons} Lessons</span>
                      </div>
                    </div>
                    <ArrowRight size={13} color="var(--text-muted)" />
                  </div>
                ))
              )}
            </div>
          )}
        </div>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        <div style={{ position: 'relative' }}>
          <button className="topbar-icon-btn" onClick={() => setNotifOpen(!notifOpen)}>
            <Bell size={17} />
            {notifications.length > 0 && <span className="notification-dot-badge" />}
          </button>

          {notifOpen && (
            <div className="notifications-dropdown-menu">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingBottom: '10px', borderBottom: '1px solid var(--border-light)' }}>
                <b style={{ fontSize: '13px' }}>Notifications</b>
                <button className="btn-ghost-pill" style={{ fontSize: '11px' }} onClick={onClearNotifications}>
                  Clear all
                </button>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginTop: '10px' }}>
                {notifications.map(n => (
                  <div key={n.id} style={{ padding: '8px', borderRadius: '6px', background: '#fafafa', fontSize: '12px' }}>
                    <b>{n.title}</b>
                    <p style={{ color: 'var(--text-secondary)', margin: '2px 0 0' }}>{n.message}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  )
}

/* ==========================================================================
   PORTAL OVERVIEW (REAL ZERO-STATE & DYNAMIC TRACKING)
   ========================================================================== */

function PortalOverview({
  user,
  enrolledCourses,
  completedCourses,
  assignments,
  attendedLiveIds,
  onSelectCourse,
  onNavigate,
  notify
}: {
  user: UserSession
  enrolledCourses: Course[]
  completedCourses: Course[]
  assignments: Assignment[]
  attendedLiveIds: number[]
  onSelectCourse: (c: Course) => void
  onNavigate: (p: PortalPage) => void
  notify: (m: string) => void
}) {
  const hasEnrolled = enrolledCourses.length > 0
  const avgProgress = hasEnrolled
    ? Math.round(enrolledCourses.reduce((acc, c) => acc + c.progress, 0) / enrolledCourses.length)
    : 0
  const attendedCount = enrolledCourses.filter(c => attendedLiveIds.includes(c.id)).length
  const attendancePct = hasEnrolled ? Math.round((attendedCount / enrolledCourses.length) * 100) : 0

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>
      <div className="portal-welcome-hero-card">
        <div>
          <h2 style={{ fontSize: '26px', fontWeight: 800, letterSpacing: '-0.5px' }}>
            Welcome, {user.name} 👋
          </h2>
          <p style={{ fontSize: '13.5px', color: 'var(--text-secondary)', marginTop: '4px' }}>
            {hasEnrolled
              ? `You are currently enrolled in ${enrolledCourses.length} learning ${enrolledCourses.length === 1 ? 'track' : 'tracks'}.`
              : 'You have not enrolled in any courses yet. Pick a track from the catalog to get started.'}
          </p>
        </div>
        <button
          className="btn-pill-dark"
          onClick={() => (hasEnrolled ? onSelectCourse(enrolledCourses[0]) : onNavigate('Catalog'))}
        >
          {hasEnrolled ? 'Resume Learning' : 'Browse Catalog'}
          <ArrowRight size={15} />
        </button>
      </div>

      {/* Dynamic Metric Cards (True Zero State for New Learners) */}
      <div className="portal-metrics-grid">
        <div className="portal-metric-box">
          <span className="metric-box-label">AVERAGE PROGRESS</span>
          <div className="metric-box-val">
            {hasEnrolled ? `${avgProgress}%` : '0%'}
          </div>
          <span className="metric-box-sub">
            {hasEnrolled ? 'Across active enrolled courses' : 'Enroll in a track to begin'}
          </span>
        </div>

        <div className="portal-metric-box">
          <span className="metric-box-label">ACTIVE COURSES</span>
          <div className="metric-box-val">
            {enrolledCourses.length} <span>{enrolledCourses.length === 1 ? 'Track' : 'Tracks'}</span>
          </div>
          <span className="metric-box-sub">
            {hasEnrolled ? 'Self-Paced Enrollment' : '0 enrolled tracks'}
          </span>
        </div>

        <div className="portal-metric-box">
          <span className="metric-box-label">ATTENDANCE</span>
          <div className="metric-box-val">
            {attendancePct}%
          </div>
          <span className="metric-box-sub">
            {!hasEnrolled
              ? 'No enrolled tracks'
              : attendedCount === 0
              ? `0 of ${enrolledCourses.length} workshops attended`
              : `${attendedCount} of ${enrolledCourses.length} Live Workshops Attended`}
          </span>
        </div>

        <div className="portal-metric-box">
          <span className="metric-box-label">CERTIFICATES</span>
          <div className="metric-box-val">
            {completedCourses.length} <span>Earned</span>
          </div>
          <span className="metric-box-sub">
            {completedCourses.length > 0
              ? 'Verified & Downloadable'
              : 'Unlocked upon 100% completion'}
          </span>
        </div>
      </div>

      {/* Enrolled Courses Section */}
      <div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
          <h3 style={{ fontSize: '18px', fontWeight: 800 }}>My Learning Tracks</h3>
          <button className="btn-ghost-pill" onClick={() => onNavigate('Catalog')}>
            Browse Full Catalog
          </button>
        </div>

        {enrolledCourses.length === 0 ? (
          <div style={{ background: '#ffffff', border: '1.5px dashed var(--border-light)', borderRadius: 'var(--radius-xl)', padding: '48px 24px', textAlign: 'center' }}>
            <div style={{ width: '48px', height: '48px', borderRadius: '50%', background: '#f4f4f5', display: 'grid', placeItems: 'center', margin: '0 auto 16px' }}>
              <BookOpen size={22} color="var(--text-secondary)" />
            </div>
            <h4 style={{ fontSize: '17px', fontWeight: 800 }}>No Enrolled Courses Yet</h4>
            <p style={{ fontSize: '13.5px', color: 'var(--text-secondary)', maxWidth: '440px', margin: '6px auto 20px' }}>
              You haven't enrolled in any courses. Explore the catalog to start learning Python, Cloud Computing, Full-Stack, or AI.
            </p>
            <button className="btn-pill-dark" onClick={() => onNavigate('Catalog')}>
              Explore Course Catalog
              <ArrowRight size={14} />
            </button>
          </div>
        ) : (
          <div className="courses-grid-layout">
            {enrolledCourses.map(c => (
              <article key={c.id} className="lms-course-card" onClick={() => onSelectCourse(c)}>
                <div className="course-card-top-art">
                  <span className="course-track-tag">
                    <BookOpen size={12} />
                    {c.track}
                  </span>
                  <span className="course-card-level-badge">{c.level}</span>
                </div>
                <div className="course-card-content">
                  <h3>{c.title}</h3>
                  <p>{c.description}</p>
                  <div style={{ marginTop: 'auto', paddingTop: '14px', borderTop: '1px solid var(--border-light)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11.5px', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '6px' }}>
                      <span>Progress</span>
                      <span>{c.completed} of {c.lessons} Lessons ({c.progress}%)</span>
                    </div>
                    <div style={{ width: '100%', height: '6px', background: '#f4f4f5', borderRadius: 'var(--radius-full)', overflow: 'hidden', marginBottom: '14px' }}>
                      <div style={{ width: `${c.progress}%`, height: '100%', background: '#18181b', borderRadius: 'var(--radius-full)', transition: 'width 0.3s ease' }} />
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Instructor: {c.instructor}</span>
                      <button className="btn-pill-dark" style={{ height: '30px', fontSize: '11px', padding: '0 12px' }}>
                        {c.progress === 100 ? 'Review Lab' : 'Continue'}
                        <ArrowRight size={12} />
                      </button>
                    </div>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

/* ==========================================================================
   PORTAL MY LEARNING (ONLY SHOWS ENROLLED COURSES)
   ========================================================================== */

function PortalMyLearning({
  enrolledCourses,
  onSelectCourse,
  onNavigate,
  notify
}: {
  enrolledCourses: Course[]
  onSelectCourse: (c: Course) => void
  onNavigate: (p: PortalPage) => void
  notify: (m: string) => void
}) {
  return (
    <div>
      <div style={{ marginBottom: '24px' }}>
        <h2 style={{ fontSize: '24px', fontWeight: 800 }}>My Enrolled Courses</h2>
        <p style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>
          Courses you have actively enrolled in. Complete lessons and assignments to earn official certificates.
        </p>
      </div>

      {enrolledCourses.length === 0 ? (
        <EmptyEnrollPrompt
          title="No Enrolled Courses Found"
          desc="You have not enrolled in any courses yet. Choose your preferred tracks from the course catalog to start learning."
          onNavigate={() => onNavigate('Catalog')}
        />
      ) : (
        <div className="courses-grid-layout">
          {enrolledCourses.map(c => (
            <article key={c.id} className="lms-course-card" onClick={() => onSelectCourse(c)}>
              <div className="course-card-top-art">
                <span className="course-track-tag">
                  <BookOpen size={12} />
                  {c.track}
                </span>
                <span className="course-card-level-badge">{c.level}</span>
              </div>
              <div className="course-card-content">
                <h3>{c.title}</h3>
                <p>{c.description}</p>
                <div style={{ marginTop: 'auto', paddingTop: '14px', borderTop: '1px solid var(--border-light)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11.5px', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '6px' }}>
                    <span>Progress</span>
                    <span>{c.completed} of {c.lessons} Lessons ({c.progress}%)</span>
                  </div>
                  <div style={{ width: '100%', height: '6px', background: '#f4f4f5', borderRadius: 'var(--radius-full)', overflow: 'hidden', marginBottom: '14px' }}>
                    <div style={{ width: `${c.progress}%`, height: '100%', background: '#18181b', borderRadius: 'var(--radius-full)', transition: 'width 0.3s ease' }} />
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>{c.lessons} Lessons</span>
                    <button className="btn-pill-dark" style={{ height: '30px', fontSize: '11px', padding: '0 12px' }}>
                      {c.progress === 100 ? 'Review Lab' : 'Launch Studio'}
                      <ArrowRight size={12} />
                    </button>
                  </div>
                </div>
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  )
}

/* ==========================================================================
   PORTAL CATALOG (ENROLL FLOW)
   ========================================================================== */

function PortalCatalog({
  courses,
  enrolledIds,
  onEnroll,
  onSelectCourse,
  notify
}: {
  courses: Course[]
  enrolledIds: number[]
  onEnroll: (id: number) => void
  onSelectCourse: (c: Course) => void
  notify: (m: string) => void
}) {
  return (
    <div>
      <div style={{ marginBottom: '24px' }}>
        <h2 style={{ fontSize: '24px', fontWeight: 800 }}>Course Catalog</h2>
        <p style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>
          Browse available learning paths. Click "Enroll in Track" to add a course to your personal learning dashboard.
        </p>
      </div>

      <div className="courses-grid-layout">
        {courses.map(c => {
          const isEnrolled = enrolledIds.includes(c.id)
          return (
            <article key={c.id} className="lms-course-card">
              <div className="course-card-top-art">
                <span className="course-track-tag">{c.track}</span>
                <span className="course-card-level-badge">{c.level}</span>
              </div>
              <div className="course-card-content">
                <h3>{c.title}</h3>
                <p>{c.description}</p>
                <div style={{ marginTop: 'auto', paddingTop: '16px', borderTop: '1px solid var(--border-light)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>{c.lessons} Lessons</span>
                  {isEnrolled ? (
                    <button
                      className="btn-pill-light"
                      style={{ height: '32px', fontSize: '11.5px', padding: '0 12px' }}
                      onClick={() => onSelectCourse(c)}
                    >
                      Enrolled ✓ Open
                    </button>
                  ) : (
                    <button
                      className="btn-pill-dark"
                      style={{ height: '32px', fontSize: '11.5px', padding: '0 14px' }}
                      onClick={() => onEnroll(c.id)}
                    >
                      Enroll in Track
                      <ArrowRight size={12} />
                    </button>
                  )}
                </div>
              </div>
            </article>
          )
        })}
      </div>
    </div>
  )
}

/* ==========================================================================
   COURSE STUDIO (VIDEO PLAYER, CODE EDITOR, & LOCAL FILE DOWNLOAD)
   ========================================================================== */

function CourseStudio({
  course,
  onToggleLesson,
  onBack,
  notify
}: {
  course: Course
  onToggleLesson: (lessonId: string) => void
  onBack: () => void
  notify: (m: string) => void
}) {
  const [selectedLessonIndex, setSelectedLessonIndex] = useState(0)
  const [code, setCode] = useState(course.codeSnippet)
  const [terminalOutput, setTerminalOutput] = useState<string | null>(null)
  const [running, setRunning] = useState(false)

  const activeLesson = course.syllabus[selectedLessonIndex] || course.syllabus[0]

  useEffect(() => {
    setCode(course.codeSnippet)
    setTerminalOutput(null)
  }, [course.id])

  const handleRunCode = () => {
    setRunning(true)
    setTerminalOutput('>>> Compiling and executing code in sandboxed environment...')

    setTimeout(() => {
      setRunning(false)
      let customOutput = ''

      if (course.track.includes('Python')) {
        customOutput = `>>> Executing ${course.fileName} (Python 3.12.3)
=== Student Performance Overview ===
   student  score  passed
0    Aarav     88    True
1    Meera     94    True
2    Rohan     91    True
3   Ananya     98    True

Class Average Score: 92.75
Highest Score: 98
[PROCESS COMPLETED WITH EXIT CODE 0]`
      } else if (course.track.includes('Cloud')) {
        customOutput = `>>> Executing Docker Build Pipeline
[+] Building 2.4s (10/10) FINISHED
 => [internal] load build definition from Dockerfile
 => => transferring dockerfile: 382B
 => [builder 1/4] FROM docker.io/library/node:20-alpine
 => [builder 2/4] WORKDIR /app
 => [builder 3/4] RUN npm ci
 => [builder 4/4] RUN npm run build
 => exporting to image: palms-cloud-service:latest (SHA256: 8f4a1c9e)
[OK] Image palms-cloud-service built and verified ready for deployment.`
      } else if (course.track.includes('Web')) {
        customOutput = `>>> Vite v8.2.1 building client bundle...
transforming... ✓ 42 modules transformed.
rendering chunks...
dist/index.html    0.85 kB │ gzip: 0.46 kB
dist/App.js      124.50 kB │ gzip: 38.20 kB
[SUCCESS] React TypeScript component compiled with 0 errors!`
      } else if (course.track.includes('AI')) {
        customOutput = `>>> Training RandomForestClassifier (100 estimators)...
Epoch [1/10] - Loss: 0.421 - Accuracy: 84.5%
Epoch [5/10] - Loss: 0.188 - Accuracy: 93.2%
Epoch [10/10] - Loss: 0.082 - Accuracy: 97.5%

=== Model Performance Metrics ===
Validation Accuracy: 0.96 (96.0%)
Precision: 0.96 | Recall: 0.95 | F1-Score: 0.955
[OK] Model weights saved to model_artifacts.pkl.`
      } else if (course.track.includes('Cyber')) {
        customOutput = `>>> Initializing Port Scanner & Security Audit
=== Target: 127.0.0.1 (localhost) ===
[CLOSED] Port 21 (FTP) is secure.
[CLOSED] Port 22 (SSH) is secure.
[OPEN]   Port 80 (HTTP Server) is active.
[OPEN]   Port 443 (HTTPS TLS 1.3) is active and certificate valid.
[OPEN]   Port 4000 (PAlms LMS Backend API) is listening.
[AUDIT COMPLETE] No critical CVE vulnerabilities detected.`
      } else if (course.track.includes('Databases') || course.track.includes('SQL')) {
        customOutput = `>>> Executing SQL Query Batch against PostgreSQL Engine
Query executed in 4.2ms. Result rows (4 rows):
--------------------------------------------------
| course_track            | enrolled | avg_score |
|-------------------------|----------|-----------|
| AI & Machine Learning   |       18 |     97.00 |
| Python & Data           |       42 |     95.00 |
| Cloud & DevOps          |       28 |     92.00 |
| Web Development         |       35 |     88.00 |
--------------------------------------------------
[QUERY STATUS: OK, 4 ROWS RETURNED]`
      } else {
        customOutput = `>>> Execution Finished successfully in 0.3s.`
      }

      setTerminalOutput(customOutput)
      notify('Code executed successfully in live environment!')
    }, 400)
  }

  const handleDownloadCode = () => {
    const blob = new Blob([code], { type: 'text/plain;charset=utf-8' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = course.fileName || 'source_code.py'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
    notify(`Saved and downloaded "${course.fileName}" to your device!`)
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      <div className="studio-topbar-row">
        <button className="btn-ghost-pill studio-back-btn" onClick={onBack}>
          ← Back to Dashboard
        </button>
        <div className="studio-actions-group">
          <button className="btn-pill-light studio-action-btn" onClick={handleDownloadCode}>
            <Download size={13} />
            Download {course.fileName}
          </button>
          <button className="btn-pill-dark studio-action-btn" onClick={handleRunCode} disabled={running}>
            {running ? 'Executing...' : 'Run Code'}
            <Play size={13} />
          </button>
        </div>
      </div>

      <div className="studio-layout-grid">
        {/* Left Column: Video Lecture Player & Lesson Navigator */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div style={{ background: '#09090b', borderRadius: 'var(--radius-xl)', overflow: 'hidden', border: '1px solid rgba(255,255,255,0.08)', boxShadow: 'var(--shadow-lg)' }}>
            <div style={{ position: 'relative', paddingBottom: '56.25%', height: 0 }}>
              <iframe
                src={activeLesson.videoUrl}
                title={activeLesson.title}
                style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', border: 'none' }}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
            <div className="studio-video-header">
              <div>
                <span style={{ fontSize: '11px', color: '#71717a', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                  LESSON {selectedLessonIndex + 1} OF {course.syllabus.length} • {activeLesson.duration}
                </span>
                <h3 style={{ fontSize: '16px', fontWeight: 800, marginTop: '2px', color: '#ffffff' }}>{activeLesson.title}</h3>
              </div>
              <button
                className="btn-pill-light"
                style={{
                  background: activeLesson.completed ? '#09090b' : '#ffffff',
                  color: activeLesson.completed ? '#ffffff' : '#09090b',
                  border: activeLesson.completed ? '1px solid #27272a' : '1px solid var(--border-light)',
                  fontSize: '12px',
                  padding: '6px 14px'
                }}
                onClick={() => onToggleLesson(activeLesson.id)}
              >
                {activeLesson.completed ? 'Completed ✓' : 'Mark Completed'}
              </button>
            </div>
          </div>

          {/* Lesson Overview & Notes */}
          <div style={{ background: '#ffffff', border: '1px solid var(--border-light)', borderRadius: 'var(--radius-xl)', padding: '24px' }}>
            <h4 style={{ fontSize: '15px', fontWeight: 800, marginBottom: '8px' }}>Lesson Overview & Core Concepts</h4>
            <p style={{ fontSize: '13.5px', color: 'var(--text-secondary)', lineHeight: '1.6', marginBottom: '16px' }}>
              {activeLesson.summary}
            </p>
            <b style={{ fontSize: '12.5px', color: 'var(--text-primary)', display: 'block', marginBottom: '8px' }}>Key Learning Objectives:</b>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '6px' }}>
              {activeLesson.keyPoints.map((pt, i) => (
                <li key={i} style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', color: 'var(--text-secondary)' }}>
                  <CheckCircle2 size={14} color="#71717a" />
                  <span>{pt}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Syllabus Playlist */}
          <div style={{ background: '#ffffff', border: '1px solid var(--border-light)', borderRadius: 'var(--radius-xl)', padding: '20px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
              <h4 style={{ fontSize: '15px', fontWeight: 800 }}>Course Lessons & Modules</h4>
              <span style={{ fontSize: '12px', fontWeight: 700, color: 'var(--text-primary)' }}>
                {course.completed}/{course.lessons} Completed ({course.progress}%)
              </span>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {course.syllabus.map((s, idx) => {
                const isCurrent = idx === selectedLessonIndex
                return (
                  <div
                    key={s.id}
                    onClick={() => setSelectedLessonIndex(idx)}
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      padding: '12px 14px',
                      background: isCurrent ? '#f4f4f5' : s.completed ? '#fafafa' : '#ffffff',
                      border: `1.5px solid ${isCurrent ? '#09090b' : s.completed ? '#e4e4e7' : 'var(--border-light)'}`,
                      borderRadius: 'var(--radius-md)',
                      fontSize: '13px',
                      cursor: 'pointer',
                      transition: 'all 0.15s ease'
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <div
                        style={{
                          width: '24px',
                          height: '24px',
                          borderRadius: '50%',
                          background: s.completed ? '#09090b' : isCurrent ? '#27272a' : '#e4e4e7',
                          color: '#fff',
                          display: 'grid',
                          placeItems: 'center',
                          fontSize: '11px',
                          fontWeight: 700
                        }}
                      >
                        {s.completed ? '✓' : idx + 1}
                      </div>
                      <div>
                        <b style={{ color: 'var(--text-primary)' }}>{s.title}</b>
                        <span style={{ display: 'block', fontSize: '11px', color: 'var(--text-muted)' }}>
                          {s.type.toUpperCase()} • {s.duration}
                        </span>
                      </div>
                    </div>

                    <button
                      className="btn-ghost-pill"
                      style={{ fontSize: '11px', padding: '4px 10px' }}
                      onClick={(e) => {
                        e.stopPropagation()
                        onToggleLesson(s.id)
                      }}
                    >
                      {s.completed ? '✓ Completed' : 'Mark Done'}
                    </button>
                  </div>
                )
              })}
            </div>
          </div>
        </div>

        {/* Right Column: Dynamic Course Code Editor & Terminal */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div style={{ background: '#09090b', borderRadius: 'var(--radius-xl)', overflow: 'hidden', border: '1px solid rgba(255,255,255,0.08)', boxShadow: 'var(--shadow-md)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 18px', background: 'rgba(255,255,255,0.04)', borderBottom: '1px solid rgba(255,255,255,0.08)', fontSize: '12.5px', color: '#a1a1aa' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Code2 size={15} color="#a1a1aa" />
                <span style={{ fontWeight: 700, color: '#ffffff' }}>{course.fileName}</span>
                <span style={{ fontSize: '11px', background: 'rgba(255,255,255,0.08)', color: '#d4d4d8', padding: '2px 8px', borderRadius: 'var(--radius-full)' }}>{course.track}</span>
              </div>
              <button
                style={{ background: 'none', border: 'none', color: '#d4d4d8', fontSize: '12px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px' }}
                onClick={handleDownloadCode}
              >
                <Download size={13} />
                Save & Download
              </button>
            </div>

            <textarea
              value={code}
              onChange={e => setCode(e.target.value)}
              spellCheck={false}
              style={{
                width: '100%',
                height: '340px',
                background: 'transparent',
                color: '#f4f4f5',
                border: 'none',
                padding: '18px',
                fontFamily: 'var(--font-mono)',
                fontSize: '13px',
                lineHeight: '1.6',
                resize: 'none',
                outline: 'none'
              }}
            />
          </div>

          <div style={{ background: '#09090b', borderRadius: 'var(--radius-xl)', padding: '18px 20px', color: '#a1a1aa', fontFamily: 'var(--font-mono)', fontSize: '12.5px', border: '1px solid rgba(255,255,255,0.08)', minHeight: '160px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid rgba(255,255,255,0.08)', paddingBottom: '8px', marginBottom: '10px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#d4d4d8', fontWeight: 700 }}>
                <Terminal size={14} />
                <span>Interactive Execution Console</span>
              </div>
              <span style={{ fontSize: '11px', color: '#71717a' }}>PAlms Runtime</span>
            </div>
            <pre style={{ margin: 0, whiteSpace: 'pre-wrap', lineHeight: '1.5', color: '#e4e4e7' }}>
              {terminalOutput || `>>> Ready to execute ${course.fileName}.\n>>> Click "Run Code" above to execute and benchmark output.`}
            </pre>
          </div>
        </div>
      </div>
    </div>
  )
}

/* ==========================================================================
   ASSIGNMENT SUBMISSION MODAL
   ========================================================================== */

function AssignmentSubmissionModal({
  assignment,
  onClose,
  onSubmit,
  notify
}: {
  assignment: Assignment
  onClose: () => void
  onSubmit: (asgId: string, githubLink: string, fileName: string) => void
  notify: (m: string) => void
}) {
  const [githubLink, setGithubLink] = useState('')
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [comments, setComments] = useState('')

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!githubLink.trim() && !selectedFile) {
      notify('Please provide either a GitHub repository link or attach a project file.')
      return
    }
    onSubmit(assignment.id, githubLink.trim(), selectedFile ? selectedFile.name : 'github_repo_submission')
  }

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        background: 'rgba(0, 0, 0, 0.65)',
        backdropFilter: 'blur(6px)',
        zIndex: 99999,
        display: 'grid',
        placeItems: 'center',
        padding: '20px'
      }}
    >
      <div
        style={{
          background: '#ffffff',
          borderRadius: 'var(--radius-xl)',
          maxWidth: '540px',
          width: '100%',
          padding: '32px',
          boxShadow: 'var(--shadow-xl)',
          position: 'relative'
        }}
      >
        <button
          onClick={onClose}
          style={{ position: 'absolute', top: '20px', right: '20px', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)' }}
        >
          <X size={20} />
        </button>

        <div className="hero-pill-badge" style={{ marginBottom: '10px' }}>
          <span>CAPSTONE SUBMISSION</span>
        </div>

        <h3 style={{ fontSize: '20px', fontWeight: 800 }}>{assignment.title}</h3>
        <p style={{ fontSize: '13px', color: 'var(--text-secondary)', marginTop: '4px' }}>
          {assignment.course} • Due {assignment.dueDate} (Max Points: {assignment.totalPoints})
        </p>

        <form onSubmit={handleFormSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginTop: '24px' }}>
          <div className="auth-field-group">
            <label style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Link size={14} />
              GitHub Repository / Project URL
            </label>
            <input
              type="url"
              placeholder="https://github.com/username/project-repo"
              value={githubLink}
              onChange={e => setGithubLink(e.target.value)}
            />
          </div>

          <div className="auth-field-group">
            <label style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Upload size={14} />
              Upload Solution File (.zip, .py, .js, .pdf)
            </label>
            <input
              type="file"
              onChange={e => {
                if (e.target.files && e.target.files[0]) {
                  setSelectedFile(e.target.files[0])
                }
              }}
              style={{ paddingTop: '8px' }}
            />
            {selectedFile && (
              <span style={{ fontSize: '11.5px', color: '#09090b', fontWeight: 600 }}>
                Selected: {selectedFile.name} ({(selectedFile.size / 1024).toFixed(1)} KB)
              </span>
            )}
          </div>

          <div className="auth-field-group">
            <label>Submission Comments (Optional)</label>
            <textarea
              placeholder="Add any notes for the instructor regarding your solution..."
              value={comments}
              onChange={e => setComments(e.target.value)}
              style={{
                height: '80px',
                padding: '10px 14px',
                border: '1px solid var(--border-light)',
                borderRadius: 'var(--radius-md)',
                fontSize: '13px',
                outline: 'none',
                resize: 'none'
              }}
            />
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '12px' }}>
            <button type="button" className="btn-ghost-pill" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="btn-pill-dark">
              Submit for Admin Review
              <ArrowRight size={14} />
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

/* ==========================================================================
   PORTAL ASSESSMENTS & ADMIN GRADING DESK
   ========================================================================== */

function PortalAssessments({
  user,
  assignments,
  enrolledCount,
  onOpenSubmission,
  onAdminGrade,
  onNavigate,
  notify
}: {
  user: UserSession
  assignments: Assignment[]
  enrolledCount: number
  onOpenSubmission: (asg: Assignment) => void
  onAdminGrade: (submissionKey: string, studentEmail: string, asgId: string, score: number) => void
  onNavigate: (p: PortalPage) => void
  notify: (m: string) => void
}) {
  const [adminGradingScores, setAdminGradingScores] = useState<Record<string, number>>({})

  // If Admin, load all student submissions
  const allSavedSubmissions = JSON.parse(localStorage.getItem('palms_master_submissions') || '{}')
  const submissionEntries = Object.entries(allSavedSubmissions) as [string, any][]

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
      <div>
        <div style={{ marginBottom: '24px' }}>
          <h2 style={{ fontSize: '24px', fontWeight: 800 }}>Assessments & Quizzes</h2>
          <p style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>
            Capstone assignments and milestone reviews. Once submitted, assignments are reviewed and graded by the instructor.
          </p>
        </div>

        {enrolledCount === 0 && user.role !== 'Admin' ? (
          <EmptyEnrollPrompt
            title="No Active Assessments"
            desc="Please enroll in a course track first to unlock milestone assignments and quiz scorecards."
            onNavigate={() => onNavigate('Catalog')}
          />
        ) : assignments.length === 0 && user.role !== 'Admin' ? (
          <EmptyEnrollPrompt
            title="No Assignments Available"
            desc="Your enrolled tracks do not have any pending quizzes or assignments at this time."
            onNavigate={() => onNavigate('Catalog')}
          />
        ) : (
          <div className="assessment-list-container" style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {assignments.map(a => (
              <div key={a.id} className="assessment-card-row">
                <div className="assessment-info-block">
                  <b style={{ fontSize: '15px', display: 'block' }}>{a.title}</b>
                  <span style={{ fontSize: '12.5px', color: 'var(--text-secondary)' }}>
                    {a.course} • Due {a.dueDate} (Max: {a.totalPoints} pts)
                  </span>
                  {a.githubLink && (
                    <span style={{ display: 'block', fontSize: '11px', color: '#52525b', marginTop: '4px' }}>
                      🔗 Submitted: {a.githubLink}
                    </span>
                  )}
                </div>
                <div className="assessment-action-block" style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                  <span
                    style={{
                      padding: '5px 12px',
                      borderRadius: 'var(--radius-full)',
                      background: a.status === 'Graded' ? '#09090b' : '#f4f4f5',
                      color: a.status === 'Graded' ? '#ffffff' : '#52525b',
                      border: '1px solid var(--border-light)',
                      fontSize: '12px',
                      fontWeight: 700
                    }}
                  >
                    {a.status === 'Graded'
                      ? `Graded: ${a.score}/${a.totalPoints} (Passed ✓)`
                      : a.status === 'Pending Review'
                      ? 'Pending Admin Review'
                      : 'Not Submitted'}
                  </span>
                  <button
                    className="btn-pill-dark"
                    style={{ height: '36px', fontSize: '12px', padding: '0 16px' }}
                    onClick={() => onOpenSubmission(a)}
                  >
                    {a.status === 'Not Submitted' ? 'Submit Work' : 'Update Submission'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Dedicated Admin Evaluation & Grading Desk */}
      {user.role === 'Admin' && (
        <div style={{ background: '#ffffff', border: '1px solid var(--border-light)', borderRadius: 'var(--radius-xl)', padding: '24px', boxShadow: 'var(--shadow-sm)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <div>
              <h3 style={{ fontSize: '18px', fontWeight: 800 }}>Admin Assessment Evaluation Desk</h3>
              <p style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>
                Review student repository links and assign passing grades to unlock certificates.
              </p>
            </div>
            <span style={{ fontSize: '12px', background: '#f4f4f5', padding: '4px 10px', borderRadius: 'var(--radius-full)', fontWeight: 600 }}>
              {submissionEntries.length} Student Submissions
            </span>
          </div>

          {submissionEntries.length === 0 ? (
            <p style={{ fontSize: '13px', color: 'var(--text-secondary)', padding: '16px 0' }}>
              No student assignment submissions have been received yet.
            </p>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {submissionEntries.map(([subKey, sub]) => {
                const isGraded = sub.status === 'Graded'
                const scoreValue = adminGradingScores[subKey] ?? (sub.score ?? 95)
                return (
                  <div key={subKey} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px 20px', background: '#fafafa', border: '1px solid var(--border-light)', borderRadius: 'var(--radius-md)' }}>
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <b style={{ fontSize: '14px' }}>{sub.studentName}</b>
                        <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>({sub.studentEmail})</span>
                      </div>
                      <span style={{ fontSize: '12.5px', color: 'var(--text-secondary)', display: 'block', marginTop: '2px' }}>
                        {sub.asgTitle} • {sub.courseTitle}
                      </span>
                      {sub.githubLink && (
                        <a href={sub.githubLink} target="_blank" rel="noreferrer" style={{ fontSize: '11px', color: '#18181b', textDecoration: 'underline', marginTop: '4px', display: 'inline-block' }}>
                          View Student Solution Repo ↗
                        </a>
                      )}
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Score:</span>
                        <input
                          type="number"
                          min="0"
                          max="100"
                          value={scoreValue}
                          onChange={e => setAdminGradingScores({ ...adminGradingScores, [subKey]: Number(e.target.value) })}
                          style={{ width: '60px', height: '32px', padding: '0 8px', border: '1px solid var(--border-light)', borderRadius: 'var(--radius-sm)', fontSize: '12.5px', textAlign: 'center' }}
                        />
                        <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>/ 100</span>
                      </div>

                      <button
                        className="btn-pill-dark"
                        style={{ height: '32px', fontSize: '11.5px', padding: '0 12px' }}
                        onClick={() => onAdminGrade(subKey, sub.studentEmail, sub.asgId, scoreValue)}
                      >
                        {isGraded ? 'Update Grade' : 'Approve & Issue Grade'}
                      </button>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>
      )}
    </div>
  )
}

/* ==========================================================================
   PORTAL CERTIFICATES (UNLOCKED ONLY UPON 100% LESSONS + PASSED GRADE)
   ========================================================================== */

function PortalCertificates({
  user,
  enrolledCourses,
  assignments,
  onNavigate,
  notify
}: {
  user: UserSession
  enrolledCourses: Course[]
  assignments: Assignment[]
  onNavigate: (p: PortalPage) => void
  notify: (m: string) => void
}) {
  // A course certificate is ONLY unlocked when 100% lessons are completed AND the capstone assignment is passed (score >= 70)
  const completedCertificates = enrolledCourses.filter(course => {
    const is100Lessons = course.progress === 100
    const courseAsg = assignments.find(a => a.courseId === course.id)
    const isPassed = courseAsg?.status === 'Graded' && (courseAsg.score || 0) >= 70
    return is100Lessons && isPassed
  })

  const hasUnlocked = completedCertificates.length > 0

  return (
    <div>
      <div style={{ marginBottom: '24px' }}>
        <h2 style={{ fontSize: '24px', fontWeight: 800 }}>My Verified Certificates</h2>
        <p style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>
          Official digital certificates are issued only after completing 100% of all lessons and receiving a passing grade (70%+) from the instructor on the capstone assignment.
        </p>
      </div>

      {!hasUnlocked ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', maxWidth: '680px' }}>
          <div style={{ background: '#ffffff', border: '1.5px dashed var(--border-medium)', borderRadius: 'var(--radius-xl)', padding: '36px', position: 'relative', textAlign: 'center' }}>
            <div style={{ width: '48px', height: '48px', borderRadius: '50%', background: '#f4f4f5', display: 'grid', placeItems: 'center', margin: '0 auto 12px' }}>
              <Lock size={22} color="var(--text-muted)" />
            </div>
            <h3 style={{ fontSize: '18px', fontWeight: 800 }}>Certificate Locked</h3>
            <p style={{ fontSize: '13.5px', color: 'var(--text-secondary)', maxWidth: '440px', margin: '8px auto 20px' }}>
              To unlock your official verified certificate, you must complete 100% of the lessons in your course and receive a passed grade on your submitted capstone project.
            </p>

            {enrolledCourses.length > 0 ? (
              <div style={{ background: '#fafafa', border: '1px solid var(--border-light)', borderRadius: 'var(--radius-md)', padding: '16px', textAlign: 'left', marginTop: '12px' }}>
                <b style={{ fontSize: '13px', display: 'block', marginBottom: '8px' }}>Your Progress Toward Certification:</b>
                {enrolledCourses.map(c => {
                  const courseAsg = assignments.find(a => a.courseId === c.id)
                  const asgPassed = courseAsg?.status === 'Graded' && (courseAsg.score || 0) >= 70
                  return (
                    <div key={c.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '12px', padding: '6px 0', borderBottom: '1px solid var(--border-light)' }}>
                      <div>
                        <b>{c.title}</b>
                        <span style={{ display: 'block', fontSize: '11px', color: 'var(--text-muted)' }}>
                          Lessons: {c.progress}% • Capstone: {courseAsg?.status === 'Graded' ? `Passed (${courseAsg.score}/100)` : courseAsg?.status === 'Pending Review' ? 'Pending Admin Review' : 'Not Submitted'}
                        </span>
                      </div>
                      <span style={{ fontWeight: 700, color: '#52525b' }}>
                        {c.progress === 100 && asgPassed ? 'Ready ✓' : 'Requirements Incomplete'}
                      </span>
                    </div>
                  )
                })}
              </div>
            ) : (
              <button className="btn-pill-dark" onClick={() => onNavigate('Catalog')}>
                Enroll in Course to Begin
              </button>
            )}
          </div>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {completedCertificates.map(course => (
            <div key={course.id} style={{ background: '#ffffff', border: '1px solid var(--border-light)', borderRadius: 'var(--radius-xl)', padding: '36px', maxWidth: '680px', boxShadow: 'var(--shadow-sm)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                <div className="nav-brand-group">
                  <div className="nav-logo-box">P</div>
                  <b>PAlms Institute</b>
                </div>
                <span style={{ fontSize: '11px', fontWeight: 700, padding: '4px 10px', background: '#09090b', color: '#ffffff', borderRadius: 'var(--radius-full)' }}>
                  CERTIFIED ✓ PASSED
                </span>
              </div>

              <div style={{ textAlign: 'center', margin: '32px 0' }}>
                <p style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>This certifies that</p>
                <h2 style={{ fontSize: '28px', fontWeight: 800, margin: '8px 0' }}>{user.name}</h2>
                <p style={{ fontSize: '14px', color: 'var(--text-secondary)' }}>
                  has successfully completed all requirements, capstone evaluations, and practical labs for
                </p>
                <h3 style={{ fontSize: '18px', fontWeight: 800, color: '#09090b', marginTop: '6px' }}>
                  {course.title}
                </h3>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid var(--border-light)', paddingTop: '20px', fontSize: '11.5px', color: 'var(--text-muted)' }}>
                <span>VERIFICATION ID: PALMS-2026-CERT-{course.id}98</span>
                <button className="btn-pill-dark" onClick={() => notify(`Downloaded verified certificate for ${course.title}.`)}>
                  Download Certificate
                  <Download size={13} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

/* ==========================================================================
   PORTAL LIVE SESSIONS LIST
   ========================================================================== */

function PortalLiveSessions({
  user,
  enrolledCourses,
  attendedLiveIds,
  onJoinRoom,
  onNavigate,
  notify
}: {
  user: UserSession
  enrolledCourses: Course[]
  attendedLiveIds: number[]
  onJoinRoom: (course: Course) => void
  onNavigate: (p: PortalPage) => void
  notify: (m: string) => void
}) {
  return (
    <div>
      <div style={{ marginBottom: '24px' }}>
        <h2 style={{ fontSize: '24px', fontWeight: 800 }}>Live Classes & Workshops</h2>
        <p style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>
          Interactive mentor workshops available for your enrolled learning paths. Click to enter the virtual live classroom.
        </p>
      </div>

      {enrolledCourses.length === 0 ? (
        <EmptyEnrollPrompt
          title="No Live Sessions Available"
          desc="Please enroll in a course to access scheduled live classes and mentor code walkthroughs."
          onNavigate={() => onNavigate('Catalog')}
        />
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '20px' }}>
          {enrolledCourses.map(c => {
            const isAttended = attendedLiveIds.includes(c.id)
            return (
              <div key={c.id} style={{ background: '#ffffff', border: '1px solid var(--border-light)', borderRadius: 'var(--radius-xl)', padding: '24px', boxShadow: 'var(--shadow-sm)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
                  {isAttended ? (
                    <span style={{ fontSize: '11px', fontWeight: 700, padding: '4px 10px', background: '#09090b', color: '#ffffff', borderRadius: 'var(--radius-full)' }}>
                      ✓ ATTENDED
                    </span>
                  ) : (
                    <span style={{ fontSize: '11px', fontWeight: 700, padding: '4px 10px', background: '#f4f4f5', color: '#18181b', border: '1px solid #e4e4e7', borderRadius: 'var(--radius-full)' }}>
                      ● LIVE WORKSHOP READY
                    </span>
                  )}
                  <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>{c.coursemates.length} Classmates</span>
                </div>

                <h3 style={{ fontSize: '18px', fontWeight: 800 }}>
                  {c.liveWorkshopTitle}
                </h3>
                <p style={{ fontSize: '13px', color: 'var(--text-secondary)', margin: '8px 0 18px' }}>
                  Instructor: {c.instructor} • Real-time code execution, Q&A, and interactive screen share.
                </p>

                <button
                  className="btn-pill-dark"
                  style={{ width: '100%', height: '42px' }}
                  onClick={() => onJoinRoom(c)}
                >
                  {isAttended ? 'Re-enter Live Classroom' : 'Join Live Classroom'}
                  <Radio size={15} />
                </button>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}

/* ==========================================================================
   LIVE VIRTUAL CLASSROOM ROOM
   ========================================================================== */

function LiveClassroomRoom({
  course,
  user,
  onLeave,
  notify
}: {
  course: Course
  user: UserSession
  onLeave: () => void
  notify: (m: string) => void
}) {
  const [micOn, setMicOn] = useState(false)
  const [camOn, setCamOn] = useState(true)
  const [handRaised, setHandRaised] = useState(false)
  const [chatInput, setChatInput] = useState('')
  const [liveChat, setLiveChat] = useState([
    { name: course.instructor, role: 'Instructor', text: `Welcome everyone to the live ${course.track} session! We will start with a live demonstration.` },
    { name: 'Aarav Patel', role: 'Learner', text: 'Excited for today\'s session!' }
  ])

  const handleSendChat = (e: React.FormEvent) => {
    e.preventDefault()
    if (!chatInput.trim()) return
    setLiveChat([...liveChat, { name: user.name, role: user.role, text: chatInput.trim() }])
    setChatInput('')
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      {/* Room Topbar */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#ffffff', padding: '16px 24px', borderRadius: 'var(--radius-xl)', border: '1px solid var(--border-light)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#ef4444', animation: 'pulse-ring 1.5s infinite' }} />
          <div>
            <h3 style={{ fontSize: '17px', fontWeight: 800 }}>{course.liveWorkshopTitle}</h3>
            <span style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>Instructor: {course.instructor} • 6 Participants Online</span>
          </div>
        </div>

        <button
          className="btn-pill-light"
          style={{ color: '#ef4444', borderColor: '#fca5a5', fontWeight: 700 }}
          onClick={() => {
            onLeave()
            notify('Left live virtual classroom.')
          }}
        >
          <PhoneOff size={14} />
          Leave Classroom
        </button>
      </div>

      {/* Main Classroom Grid */}
      <div className="live-classroom-grid">
        {/* Left: Stream Video Stage */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div style={{ background: '#09090b', borderRadius: 'var(--radius-xl)', overflow: 'hidden', height: '420px', position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <div style={{ textAlign: 'center', color: '#ffffff' }}>
              <div style={{ width: '72px', height: '72px', borderRadius: '50%', background: '#27272a', display: 'grid', placeItems: 'center', margin: '0 auto 12px' }}>
                <Video size={32} color="#a1a1aa" />
              </div>
              <h4 style={{ fontSize: '18px', fontWeight: 800 }}>{course.instructor}</h4>
              <span style={{ fontSize: '12px', color: '#a1a1aa' }}>Broadcasting Live Screen & Code Walkthrough</span>
            </div>

            {/* Bottom Stream Controls */}
            <div style={{ position: 'absolute', bottom: '16px', left: '50%', transform: 'translateX(-50%)', display: 'flex', gap: '12px', background: 'rgba(24, 24, 27, 0.85)', backdropFilter: 'blur(12px)', padding: '8px 16px', borderRadius: 'var(--radius-full)' }}>
              <button
                onClick={() => {
                  setMicOn(!micOn)
                  notify(micOn ? 'Microphone muted.' : 'Microphone unmuted.')
                }}
                style={{ width: '40px', height: '40px', borderRadius: '50%', background: micOn ? '#09090b' : '#3f3f46', color: '#fff', border: 'none', cursor: 'pointer', display: 'grid', placeItems: 'center' }}
              >
                {micOn ? <Mic size={16} /> : <MicOff size={16} />}
              </button>

              <button
                onClick={() => {
                  setCamOn(!camOn)
                  notify(camOn ? 'Camera turned off.' : 'Camera turned on.')
                }}
                style={{ width: '40px', height: '40px', borderRadius: '50%', background: camOn ? '#09090b' : '#3f3f46', color: '#fff', border: 'none', cursor: 'pointer', display: 'grid', placeItems: 'center' }}
              >
                {camOn ? <Camera size={16} /> : <VideoOff size={16} />}
              </button>

              <button
                onClick={() => {
                  setHandRaised(!handRaised)
                  notify(handRaised ? 'Lowered hand.' : 'Hand raised! Instructor notified.')
                }}
                style={{ width: '40px', height: '40px', borderRadius: '50%', background: handRaised ? '#71717a' : '#3f3f46', color: '#fff', border: 'none', cursor: 'pointer', display: 'grid', placeItems: 'center' }}
              >
                <Hand size={16} />
              </button>
            </div>
          </div>

          {/* Coursemates Roster Bar */}
          <div style={{ background: '#ffffff', border: '1px solid var(--border-light)', borderRadius: 'var(--radius-lg)', padding: '16px 20px' }}>
            <b style={{ fontSize: '13px', display: 'block', marginBottom: '10px' }}>Enrolled Classmates in Room:</b>
            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
              <span style={{ fontSize: '11.5px', padding: '4px 10px', background: '#f4f4f5', borderRadius: 'var(--radius-full)', fontWeight: 600 }}>
                {user.name}
              </span>
              {course.coursemates.map(cm => (
                <span key={cm} style={{ fontSize: '11.5px', padding: '4px 10px', background: '#fafafa', border: '1px solid var(--border-light)', borderRadius: 'var(--radius-full)' }}>
                  {cm}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Right: Live Room Q&A Chat */}
        <div style={{ background: '#ffffff', border: '1px solid var(--border-light)', borderRadius: 'var(--radius-xl)', padding: '24px', display: 'flex', flexDirection: 'column', height: '520px' }}>
          <b style={{ fontSize: '15px', paddingBottom: '12px', borderBottom: '1px solid var(--border-light)' }}>
            Live Q&A & Student Discussion
          </b>

          <div style={{ flex: 1, overflowY: 'auto', padding: '12px 0', display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {liveChat.map((msg, i) => (
              <div key={i} style={{ background: '#fafafa', padding: '10px 12px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-light)', fontSize: '12.5px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '3px' }}>
                  <b>{msg.name}</b>
                  <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
                    {msg.role}
                  </span>
                </div>
                <p style={{ margin: 0, color: 'var(--text-secondary)' }}>{msg.text}</p>
              </div>
            ))}
          </div>

          <form onSubmit={handleSendChat} style={{ display: 'flex', gap: '8px', paddingTop: '12px', borderTop: '1px solid var(--border-light)' }}>
            <input
              type="text"
              placeholder="Ask a question in live session..."
              value={chatInput}
              onChange={e => setChatInput(e.target.value)}
              style={{ flex: 1, height: '40px', padding: '0 14px', border: '1px solid var(--border-light)', borderRadius: 'var(--radius-full)', fontSize: '13px', outline: 'none' }}
            />
            <button type="submit" className="btn-pill-dark" style={{ height: '40px', padding: '0 16px' }}>
              <Send size={14} />
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}

/* ==========================================================================
   PORTAL COMMUNITY CHAT (WITH ENROLLED CLASSMATES & INSTRUCTOR)
   ========================================================================== */

function PortalCommunity({
  user,
  enrolledCourses,
  allCourses,
  messages,
  onSendMessage,
  onNavigate,
  notify
}: {
  user: UserSession
  enrolledCourses: Course[]
  allCourses: Course[]
  messages: CommunityMessage[]
  onSendMessage: (courseId: number, text: string, codeSnippet?: string) => void
  onNavigate: (p: PortalPage) => void
  notify: (m: string) => void
}) {
  const visibleCourses = user.role === 'Admin' ? allCourses : enrolledCourses
  const [activeCourseId, setActiveCourseId] = useState<number>(visibleCourses[0]?.id || 1)
  const [chatText, setChatText] = useState('')
  const [codeSnippet, setCodeSnippet] = useState('')
  const [showCodeInput, setShowCodeInput] = useState(false)

  const activeCourse = allCourses.find(c => c.id === activeCourseId) || allCourses[0]
  const courseMessages = messages.filter(m => m.courseId === activeCourseId)

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault()
    if (!chatText.trim() && !codeSnippet.trim()) {
      notify('Please enter a message or paste a code snippet.')
      return
    }
    const finalSnippet = codeSnippet.trim() ? codeSnippet.trim() : undefined
    const finalText = chatText.trim() ? chatText.trim() : 'Shared code snippet:'
    onSendMessage(activeCourseId, finalText, finalSnippet)
    setChatText('')
    setCodeSnippet('')
    setShowCodeInput(false)
  }

  if (visibleCourses.length === 0) {
    return (
      <div>
        <div style={{ marginBottom: '24px' }}>
          <h2 style={{ fontSize: '24px', fontWeight: 800 }}>Community Discussions</h2>
          <p style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>Collaborate with your coursemates and instructors.</p>
        </div>
        <EmptyEnrollPrompt
          title="No Enrolled Course Communities"
          desc="Enroll in a course track to join its dedicated coursemate discussion room and ask questions directly to instructors."
          onNavigate={() => onNavigate('Catalog')}
        />
      </div>
    )
  }

  return (
    <div>
      <div style={{ marginBottom: '24px' }}>
        <h2 style={{ fontSize: '24px', fontWeight: 800 }}>Course Community & Discussion</h2>
        <p style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>
          Collaborate with your fellow enrolled classmates and get direct answers from your instructor.
        </p>
      </div>

      {/* Course Selector Tabs */}
      <div style={{ display: 'flex', gap: '8px', overflowX: 'auto', paddingBottom: '12px', marginBottom: '16px' }}>
        {visibleCourses.map(c => (
          <button
            key={c.id}
            onClick={() => setActiveCourseId(c.id)}
            className={`track-filter-tab ${activeCourseId === c.id ? 'active' : ''}`}
            style={{ fontSize: '12.5px', padding: '8px 16px' }}
          >
            {c.title}
          </button>
        ))}
      </div>

      {/* Main Split Chat Layout */}
      <div className="community-chat-grid">
        {/* Chat Feed */}
        <div style={{ background: '#ffffff', border: '1px solid var(--border-light)', borderRadius: 'var(--radius-xl)', padding: '24px', display: 'flex', flexDirection: 'column', height: '580px', boxShadow: 'var(--shadow-sm)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingBottom: '14px', borderBottom: '1px solid var(--border-light)' }}>
            <div>
              <b style={{ fontSize: '16px' }}>{activeCourse.title}</b>
              <span style={{ display: 'block', fontSize: '12px', color: 'var(--text-muted)' }}>
                Instructor: {activeCourse.instructor} • {activeCourse.coursemates.length + 1} Members
              </span>
            </div>
            <span style={{ fontSize: '11px', fontWeight: 700, padding: '3px 8px', background: '#f4f4f5', color: '#52525b', borderRadius: 'var(--radius-full)' }}>
              Active Room
            </span>
          </div>

          {/* Messages Stream */}
          <div style={{ flex: 1, overflowY: 'auto', padding: '16px 0', display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {courseMessages.length === 0 ? (
              <div style={{ textAlign: 'center', margin: 'auto', color: 'var(--text-secondary)' }}>
                <MessageSquare size={32} color="var(--text-muted)" style={{ margin: '0 auto 8px' }} />
                <b style={{ fontSize: '14px', display: 'block', color: 'var(--text-primary)' }}>No messages yet in this discussion.</b>
                <span style={{ fontSize: '12.5px' }}>Be the first to post a query to your coursemates or instructor {activeCourse.instructor}!</span>
              </div>
            ) : (
              courseMessages.map(msg => (
                <div key={msg.id} style={{ display: 'flex', gap: '12px' }}>
                  <div
                    style={{
                      width: '32px',
                      height: '32px',
                      borderRadius: '50%',
                      background: '#09090b',
                      color: '#ffffff',
                      display: 'grid',
                      placeItems: 'center',
                      fontSize: '11px',
                      fontWeight: 800,
                      flexShrink: 0
                    }}
                  >
                    {msg.userInitials}
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                      <b style={{ fontSize: '13.5px', color: 'var(--text-primary)' }}>{msg.userName}</b>
                      <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>{msg.timestamp}</span>
                    </div>

                    <p style={{ margin: 0, fontSize: '13px', color: 'var(--text-primary)', lineHeight: '1.5' }}>
                      {msg.text}
                    </p>

                    {msg.codeSnippet && (
                      <div style={{ marginTop: '8px', borderRadius: 'var(--radius-md)', overflow: 'hidden', border: '1px solid rgba(255,255,255,0.08)' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#18181b', padding: '6px 12px', fontSize: '11px', color: '#a1a1aa' }}>
                          <span>Shared Code Snippet</span>
                          <button
                            type="button"
                            onClick={() => {
                              navigator.clipboard.writeText(msg.codeSnippet || '')
                              notify('Code copied to clipboard!')
                            }}
                            style={{ background: 'none', border: 'none', color: '#d4d4d8', cursor: 'pointer', fontSize: '11px', display: 'flex', alignItems: 'center', gap: '4px' }}
                          >
                            <Copy size={12} />
                            Copy Code
                          </button>
                        </div>
                        <pre
                          style={{
                            margin: 0,
                            background: '#09090b',
                            color: '#f4f4f5',
                            padding: '12px 14px',
                            fontSize: '12px',
                            fontFamily: 'var(--font-mono)',
                            overflowX: 'auto'
                          }}
                        >
                          {msg.codeSnippet}
                        </pre>
                      </div>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Chat Input Box */}
          <form onSubmit={handleSend} style={{ display: 'flex', flexDirection: 'column', gap: '8px', paddingTop: '14px', borderTop: '1px solid var(--border-light)' }}>
            {showCodeInput && (
              <textarea
                placeholder="Paste or write code snippet here..."
                value={codeSnippet}
                onChange={e => setCodeSnippet(e.target.value)}
                style={{
                  height: '90px',
                  padding: '10px 14px',
                  background: '#09090b',
                  color: '#f4f4f5',
                  border: 'none',
                  borderRadius: 'var(--radius-md)',
                  fontFamily: 'var(--font-mono)',
                  fontSize: '12px',
                  outline: 'none',
                  resize: 'none'
                }}
              />
            )}

            <div className="community-input-row">
              <button
                type="button"
                onClick={() => setShowCodeInput(!showCodeInput)}
                className="btn-ghost-pill community-attach-code-btn"
                title="Attach Code"
              >
                <Code2 size={15} />
                <span className="community-attach-code-text">{showCodeInput ? 'Hide Code' : 'Attach Code'}</span>
              </button>

              <input
                type="text"
                className="community-chat-input"
                placeholder={user.role === 'Admin' ? 'Reply to students as Instructor...' : 'Ask a question or share ideas...'}
                value={chatText}
                onChange={e => setChatText(e.target.value)}
              />

              <button type="submit" className="btn-pill-dark community-send-btn">
                <Send size={14} />
              </button>
            </div>
          </form>
        </div>

        {/* Right Sidebar: Coursemates Roster */}
        <div style={{ background: '#ffffff', border: '1px solid var(--border-light)', borderRadius: 'var(--radius-xl)', padding: '20px', display: 'flex', flexDirection: 'column', gap: '14px', height: '580px' }}>
          <b style={{ fontSize: '14px' }}>Course Members ({activeCourse.coursemates.length + 2})</b>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', overflowY: 'auto' }}>
            {/* Instructor */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '8px 10px', background: '#fafafa', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-light)' }}>
              <div style={{ width: '28px', height: '28px', borderRadius: '50%', background: '#09090b', color: '#fff', display: 'grid', placeItems: 'center', fontSize: '11px', fontWeight: 800 }}>
                {activeCourse.instructor.split(' ').map(p => p[0]).join('').substring(0, 2)}
              </div>
              <div>
                <b style={{ fontSize: '12.5px', display: 'block' }}>{activeCourse.instructor}</b>
                <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Course Instructor</span>
              </div>
            </div>

            {/* Current User */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '8px 10px', background: '#f4f4f5', borderRadius: 'var(--radius-md)' }}>
              <div style={{ width: '28px', height: '28px', borderRadius: '50%', background: '#09090b', color: '#fff', display: 'grid', placeItems: 'center', fontSize: '11px', fontWeight: 800 }}>
                {user.initials}
              </div>
              <div>
                <b style={{ fontSize: '12.5px', display: 'block' }}>{user.name}</b>
                <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Online</span>
              </div>
            </div>

            {/* Coursemates */}
            {activeCourse.coursemates.map(cm => (
              <div key={cm} style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '6px 8px' }}>
                <div style={{ width: '26px', height: '26px', borderRadius: '50%', background: '#e4e4e7', color: '#52525b', display: 'grid', placeItems: 'center', fontSize: '10px', fontWeight: 700 }}>
                  {cm.split(' ').map(p => p[0]).join('').substring(0, 2)}
                </div>
                <div>
                  <span style={{ fontSize: '12.5px', fontWeight: 600, display: 'block' }}>{cm}</span>
                  <span style={{ fontSize: '10px', color: 'var(--text-muted)' }}>Classmate</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

/* ==========================================================================
   HELPER EMPTY PROMPT COMPONENT
   ========================================================================== */

function EmptyEnrollPrompt({
  title,
  desc,
  onNavigate
}: {
  title: string
  desc: string
  onNavigate: () => void
}) {
  return (
    <div style={{ background: '#ffffff', border: '1.5px dashed var(--border-light)', borderRadius: 'var(--radius-xl)', padding: '48px 24px', textAlign: 'center' }}>
      <div style={{ width: '48px', height: '48px', borderRadius: '50%', background: '#f4f4f5', display: 'grid', placeItems: 'center', margin: '0 auto 16px' }}>
        <BookOpen size={22} color="var(--text-secondary)" />
      </div>
      <h4 style={{ fontSize: '17px', fontWeight: 800 }}>{title}</h4>
      <p style={{ fontSize: '13.5px', color: 'var(--text-secondary)', maxWidth: '440px', margin: '6px auto 20px' }}>
        {desc}
      </p>
      <button className="btn-pill-dark" onClick={onNavigate}>
        Explore Course Catalog
        <ArrowRight size={14} />
      </button>
    </div>
  )
}

/* ==========================================================================
   ADMIN PEOPLE MANAGEMENT
   ========================================================================== */

function PortalPeopleAdmin({ notify }: { notify: (m: string) => void }) {
  const [usersList, setUsersList] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch(`${API_BASE_URL}/auth/users`)
      .then(res => res.json())
      .then(data => {
        if (data.ok && data.users) {
          setUsersList(data.users)
        }
      })
      .catch(err => console.warn('Could not fetch MongoDB users roster:', err))
      .finally(() => setLoading(false))
  }, [])

  return (
    <div>
      <div style={{ marginBottom: '24px' }}>
        <h2 style={{ fontSize: '24px', fontWeight: 800 }}>Learner & User Management</h2>
        <p style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>
          Real-time roster of all registered users stored in MongoDB Atlas database (<code>palms_lms.users</code>).
        </p>
      </div>

      <div style={{ background: '#ffffff', border: '1px solid var(--border-light)', borderRadius: 'var(--radius-xl)', padding: '24px', boxShadow: 'var(--shadow-sm)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
          <b style={{ fontSize: '15px' }}>Database Records ({usersList.length} Users in MongoDB)</b>
          <button
            className="btn-pill-light"
            style={{ fontSize: '11.5px', padding: '4px 12px' }}
            onClick={() => {
              setLoading(true)
              fetch(`${API_BASE_URL}/auth/users`)
                .then(res => res.json())
                .then(data => {
                  if (data.ok && data.users) setUsersList(data.users)
                  notify('Roster refreshed from MongoDB Atlas.')
                })
                .finally(() => setLoading(false))
            }}
          >
            Refresh List
          </button>
        </div>

        {loading ? (
          <p style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>Loading users from MongoDB Atlas...</p>
        ) : usersList.length === 0 ? (
          <p style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>No registered users found in database yet.</p>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '13px' }}>
              <thead>
                <tr style={{ borderBottom: '1.5px solid var(--border-light)', color: 'var(--text-muted)' }}>
                  <th style={{ padding: '10px 14px', fontWeight: 700 }}>NAME</th>
                  <th style={{ padding: '10px 14px', fontWeight: 700 }}>EMAIL</th>
                  <th style={{ padding: '10px 14px', fontWeight: 700 }}>ROLE</th>
                  <th style={{ padding: '10px 14px', fontWeight: 700 }}>AUTH PROVIDER</th>
                  <th style={{ padding: '10px 14px', fontWeight: 700 }}>MONGODB ID</th>
                  <th style={{ padding: '10px 14px', fontWeight: 700 }}>CREATED</th>
                </tr>
              </thead>
              <tbody>
                {usersList.map((u: any) => (
                  <tr key={u._id} style={{ borderBottom: '1px solid var(--border-light)' }}>
                    <td style={{ padding: '12px 14px', fontWeight: 700 }}>{u.name}</td>
                    <td style={{ padding: '12px 14px', color: 'var(--text-secondary)' }}>{u.email}</td>
                    <td style={{ padding: '12px 14px' }}>
                      <span className="role-pill-badge">{u.role}</span>
                    </td>
                    <td style={{ padding: '12px 14px', textTransform: 'capitalize' }}>
                      {u.authProvider === 'google' ? 'Google OAuth' : 'Email/Password'}
                    </td>
                    <td style={{ padding: '12px 14px', fontFamily: 'var(--font-mono)', fontSize: '11px', color: '#6b7280' }}>
                      {u._id}
                    </td>
                    <td style={{ padding: '12px 14px', color: 'var(--text-muted)', fontSize: '12px' }}>
                      {new Date(u.createdAt).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}

/* ==========================================================================
   PORTAL SETTINGS
   ========================================================================== */

function PortalSettings({ user, notify }: { user: UserSession; notify: (m: string) => void }) {
  return (
    <div>
      <div style={{ marginBottom: '24px' }}>
        <h2 style={{ fontSize: '24px', fontWeight: 800 }}>Account & Database Profile</h2>
        <p style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>Manage your profile information and view your database credentials.</p>
      </div>
      <div style={{ background: '#ffffff', border: '1px solid var(--border-light)', borderRadius: 'var(--radius-lg)', padding: '24px', display: 'flex', flexDirection: 'column', gap: '14px', maxWidth: '600px' }}>
        <div>
          <span style={{ fontSize: '11.5px', color: 'var(--text-muted)', fontWeight: 700 }}>AUTHENTICATED USER</span>
          <h3 style={{ fontSize: '18px', fontWeight: 800, marginTop: '2px' }}>{user.name}</h3>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', borderTop: '1px solid var(--border-light)', paddingTop: '14px' }}>
          <div>
            <span style={{ fontSize: '11px', color: 'var(--text-muted)', fontWeight: 700 }}>EMAIL ADDRESS</span>
            <div style={{ fontSize: '13px', marginTop: '2px', fontWeight: 600 }}>{user.email}</div>
          </div>
          <div>
            <span style={{ fontSize: '11px', color: 'var(--text-muted)', fontWeight: 700 }}>ACTIVE ROLE</span>
            <div style={{ fontSize: '13px', marginTop: '2px', fontWeight: 600 }}>{user.role}</div>
          </div>
        </div>
        <div style={{ borderTop: '1px solid var(--border-light)', paddingTop: '14px' }}>
          <span style={{ fontSize: '11px', color: 'var(--text-muted)', fontWeight: 700 }}>DATABASE STORAGE</span>
          <p style={{ fontSize: '12px', color: 'var(--text-secondary)', marginTop: '2px' }}>
            User session verified against MongoDB Atlas cluster <code>palms_lms</code>.
          </p>
        </div>
      </div>
    </div>
  )
}

const root = document.getElementById('root')
if (root) {
  createRoot(root).render(<App />)
}
