# 🧾 EVAL.md — Mini AI Studio

This file lists all implemented features, their status, and file locations for automated evaluation.

| Feature/Test | Implemented | File/Path |
|---------------|--------------|-----------|
| JWT Auth (signup/login) | ✅ | /backend/src/routes/auth.ts |
| Password hashing (bcrypt) | ✅ | /backend/src/services/authService.ts |
| Token-protected routes | ✅ | /backend/src/middleware/authMiddleware.ts |
| Image upload preview | ✅ | /frontend/src/components/Upload.tsx |
| Prompt & Style input | ✅ | /frontend/src/components/PromptForm.tsx |
| Abort in-flight request | ✅ | /frontend/src/hooks/useGenerate.ts |
| Exponential retry logic | ✅ | /frontend/src/hooks/useRetry.ts |
| 20% simulated overload | ✅ | /backend/src/routes/generations.ts |
| GET last 5 generations | ✅ | /backend/src/controllers/generations.ts |
| Input validation (Zod) | ✅ | /backend/src/validators/generationSchema.ts |
| Unit tests - backend (Auth, Generations) | ✅ | /backend/tests/auth.test.ts |
| Unit tests - frontend (Generate flow) | ✅ | /frontend/tests/Generate.test.tsx |
| E2E flow (Signup → Login → Generate → History → Restore) | ✅ | /tests/e2e.spec.ts |
| ESLint + Prettier configured | ✅ | /.eslintrc.js |
| OpenAPI spec provided | ✅ | /OPENAPI.yaml |
| CI + Coverage report | ✅ | /.github/workflows/ci.yml |
| Docker support | ✅ | /docker-compose.yml |
| Dark mode toggle | ✅ | /frontend/src/components/ThemeToggle.tsx |
| Image resizing before upload | ✅ | /frontend/src/utils/imageUtils.ts |
| AI usage documentation | ✅ | /AI_USAGE.md |

---

### 🧠 Notes
- All features are implemented and verified locally.
- Backend uses **Express + Prisma + SQLite**.
- Frontend built with **React + TypeScript + TailwindCSS**.
- Tests use **Jest**, **React Testing Library**, and **Cypress**.
- CI/CD workflow configured via **GitHub Actions** (`ci.yml`).
- Any remaining TODOs are documented in `README.md`.

---

✅ **Status:** Project fully functional, tested, and ready for submission to Modelia.
