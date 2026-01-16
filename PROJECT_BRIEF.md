# 📖 PROJECT BRIEFING - DEEXEN FRONTEND

**Project Name:** Deexen Frontend (AI Learning IDE)  
**Role:** Frontend Lead  
**Status:** In Progress  

## 🎯 PROJECT OVERVIEW

### What is Deexen?
Deexen is an AI-powered web-based IDE designed to help developers learn coding through personalized AI feedback.  
**Think of it as:** VS Code in your browser + AI teacher.

### What Does It Do?
Users can:
*   Login to their account
*   View their profile and projects
*   Open an IDE workspace with 4 panels
*   Write code in the code editor
*   Run commands in the terminal
*   Get AI feedback through 5 different modes

### The 5 AI Learning Modes
1.  **Debug Mode**: "Find the bug in my code"
2.  **Teaching Mode**: "Explain this step-by-step"
3.  **Enhancement Mode**: "Improve my code quality"
4.  **Expansion Mode**: "Add new features"
5.  **Live Fix Mode**: "Fix my errors instantly"

---

## 🏗️ ARCHITECTURE

### Frontend Structure
```
React App (single-page application)
├── Login Page
├── Profile Page
├── Workspace (4 panels)
│   ├── File Explorer (left)
│   ├── Code Editor (center)
│   ├── Terminal (bottom)
│   └── AI Panel (right)
└── State Management (Zustand)
```

### Tech Stack
| Layer | Technology | Purpose |
| :--- | :--- | :--- |
| **Framework** | React 18 + TypeScript | UI building |
| **Styling** | Tailwind CSS | Fast, responsive design |
| **State** | Zustand | Simple state management |
| **Routing** | React Router | Page navigation |
| **HTTP** | Axios | API calls |
| **Editor** | Monaco Editor | Code editing |
| **Icons** | Lucide React | UI icons |
| **IDE** | Deexen | AI-powered development |

### Backend (Separate Repo)
The backend team builds:
*   Authentication APIs
*   User management
*   Project storage
*   AI endpoints (mocked initially)
*   File storage

---

## 📅 THE 14-DAY PLAN

### WEEK 1: BUILD BEAUTIFUL UI (Completed)
*   **Day 1: Setup + Login** ✅
    *   Initialize React project, Tailwind CSS
    *   Create login page with form validation
*   **Day 2: Profile Page** ✅
    *   Create profile page, user info, projects list
*   **Day 3: Workspace Layout** ✅
    *   VS Code style 4-panel layout (Explorer, Editor, Terminal, AI Panel)
*   **Day 4: File Operations** ✅
    *   Create, Delete, Rename files
*   **Day 5: Editor + Terminal** ✅
    *   Monaco editor setup, mocked Terminal
*   **Day 6: Styling + Polish** ✅
    *   Dark/Light theme polish, responsive design
*   **Day 7: Documentation + Review** 🔄
    *   Update README, Code review, Prepare for Week 2

### WEEK 2: ADD AI INTELLIGENCE (Upcoming)
*   **Day 8: AI Architecture**
    *   Create AI store (Zustand), AI service, Mock AI responses
*   **Day 9: Debug + Enhance Modes**
    *   Build Debug & Enhancement mode UIs, connect to mock service
*   **Day 10: All AI Modes**
    *   Teaching, Expansion, Live Fix modes
*   **Day 11: Backend Integration**
    *   Connect to real backend APIs, replace mock data
*   **Day 12: UI Polish**
    *   Animations, loading states, mobile view
*   **Day 13: Testing + Bug Fixes**
    *   Zero critical bugs, cross-browser testing
*   **Day 14: DEMO DAY** 🚀
    *   Demo Video & Presentation

---

## 🔌 API ENDPOINTS (Draft)

### Authentication
*   `POST /auth/login` - `{ email, password }` -> `{ token, user }`

### Profile & Projects
*   `GET /user/profile` - Headers: `{ Authorization: Bearer {token} }`
*   `GET /projects`

### AI Endpoints
*   `POST /ai/debug`
*   `POST /ai/teaching`
*   `POST /ai/enhance`
*   `POST /ai/expand`
*   `POST /ai/livefix`
*   Request: `{ code, context }`
*   Response: `{ response: "AI feedback here" }`

---

## 🎯 KEY PRINCIPLES

### Code Quality
*   Use TypeScript (no `any` types)
*   No console.log in production
*   Components under 200 lines
*   Meaningful variable names

### Git Workflow
*   Feature branches for every task
*   Commit frequently
*   Never push to main directly

### Testing
*   Test after every change
*   Verify TypeScript compiles
*   Check browser console
