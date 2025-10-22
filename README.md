# Mini AI Studio

Mini AI Studio is a full-stack web application simulating a fashion image generation experience. Users can securely log in, upload images, add text prompts, and generate AI-style results with a fully interactive frontend and backend.


---

## 🎯 Objective

Build a complete web app (frontend, backend, database) focusing on:

- Clean code and architecture
- Testing and CI/CD
- User experience and accessibility
- Handling API errors gracefully
- Simulating AI image generation workflow

---

## 🚀 Features

### Frontend (React + TypeScript + Tailwind)

- **User Authentication**
  - Signup and Login with JWT
  - Persist session locally (localStorage)
  - Logout functionality

- **Image Generation Studio**
  - Upload JPEG/PNG images (max 10MB) with live preview
  - Input prompt and choose from multiple styles
  - Generate simulated AI results
  - Show loading spinner during generation
  - 20% chance to simulate “Model overloaded” errors
  - Retry generation (up to 3 times) or abort mid-generation
  - Display last 5 generations with thumbnails and timestamps
  - Restore past generations to the workspace

- **Accessibility & UX**
  - Keyboard-friendly navigation and focus states
  - ARIA roles for accessibility
  - Responsive design for desktop and mobile
  - Clear error messages and disabled states during network calls


### Backend (Node.js + TypeScript + Express + SQLite/PostgreSQL)

- **Authentication**
  - JWT-based signup/login
  - Password hashing with bcrypt
  - Token-protected routes

- **Generations API**
  - `POST /generations` → simulate image generation
    - 1–2 second delay
    - 20% chance of returning `"Model overloaded"` error
    - On success: return `{ id, imageUrl, prompt, style, createdAt, status }`
  - `GET /generations?limit=5` → return last 5 generations for authenticated users
  - Input validation with Zod
  - Persist users and generations in database

- **Architecture & Quality**
  - Clear folder structure: `controllers`, `routes`, `models`, `services`
  - TypeScript strict mode
  - ESLint + Prettier configured
  - Optional Docker support for API + DB + Frontend

---

## 🧩 Project Structure

mini-ai-studio/
├── backend/
│ ├── src/
│ │ ├── controllers/
│ │ ├── routes/
│ │ ├── models/
│ │ └── services/
│ └── tests/
├── frontend/
│ ├── src/
│ │ ├── components/
│ │ ├── hooks/
│ │ └── pages/
│ └── tests/
├── .github/workflows/ci.yml
├── AI_USAGE.md
├── EVAL.md
├── OPENAPI.yaml
└── README.md


---

## 🧪 Getting Started

### Prerequisites

- Node.js v14+
- npm or yarn
- SQLite or PostgreSQL
- Docker (optional)


### Installation

1. Clone the repository:

```bash
git clone https://github.com/ikrammirza/mini-ai-studio.git
cd mini-ai-studio
cd backend
npm install
cd ../frontend
npm install
cp .env.example .env

Running the Application

With Docker (recommended)
docker-compose up --build

Without Docker
Backend: cd backend
npm start

cd frontend
npm start


📄 API Documentation

See OPENAPI.yaml for full backend specification:

/auth/signup → user registration

/auth/login → user login

/generations → create generation

/generations?limit=5 → fetch last 5 generations



🧪 Testing

Backend: Jest + Supertest
Frontend: React Testing Library
E2E: Cypress / Playwright

Run all tests:# Backend tests
cd backend
npm test

# Frontend tests
cd ../frontend
npm test

Coverage report is generated and uploaded via GitHub Actions CI.



⚡ Bonuses Implemented

Image resizing before upload

Code splitting and lazy loading

Dark mode toggle

Small UI animations with Framer Motion



📋 Contribution

Fork the repository
Create a branch (git checkout -b feature/your-feature)
Commit changes (git commit -am 'Add feature')
Push branch (git push origin feature/your-feature)
Open a Pull Request



📧 Contact

GitHub: https://github.com/ikrammirza

LinkedIn: https://www.linkedin.com/in/mirzaikram129/

Email: mirzaikram129@gmail.com


📄 License

MIT License