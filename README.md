# SPW391 Backend Project Overview

_Last updated: 2025-04-16_

## 1. Purpose & Goals
This project provides the backend for an admission consulting platform, helping students explore majors, campuses, tuition, scholarships, dormitories, and admission methods. It offers a chatbot interface and RESTful APIs to support user queries and data retrieval.

## 2. Technology Stack
- **Language:** TypeScript (strict mode enabled)
- **Framework:** Express.js
- **ORM:** Drizzle ORM (PostgreSQL)
- **Other Libraries:** body-parser, dotenv, morgan, uuid

## 3. Directory Structure
```
src/
├── api/           # Routes and controllers
├── config/        # Application configuration
├── db/            # Database connection and schema
├── middlewares/   # Common middlewares (error, session)
├── services/      # Business logic (planned)
├── utils/         # Utilities (logger, helpers)
├── app.ts         # App initialization
└── server.ts      # Server bootstrap
```

## 4. Key Features
- **RESTful API** for:
  - Majors, campuses, tuition, sessions, scholarships, dormitories, admission methods
  - Chatbot endpoint for interactive queries
- **Session management** via middleware
- **Centralized error handling**
- **Type-safe database schema** using Drizzle ORM
- **Configuration via environment variables**
- **Logging utility**

## 5. Coding & Project Rules
- TypeScript strict mode, no `any` (unless justified)
- Clear type declarations for all variables/functions
- One export per file, clear naming conventions
- Controllers: handle request/response only
- Services: business logic (planned)
- Middlewares: reusable logic (auth, error, session)
- No hardcoded values—use env/config
- Use logger (not console.log)
- Follows commit and branch naming conventions (see `.commitrules`)

## 6. Database
- **PostgreSQL** via Drizzle ORM
- Tables: academic_years, majors, curriculums, careers, campuses, major_campus_admission, scholarships, sessions, dormitories, admission_methods
- All table names in `snake_case`

## 7. How to Run
1. Install dependencies: `npm install`
2. Set up `.env` with `DATABASE_URL` and `PORT`
3. Start server: `npm run dev` or `ts-node-dev src/server.ts`

## 8. Contribution & Review
- All code must be reviewed before merging
- Follow code style, structure, and commit rules
- Use PRs for all changes

---

For detailed rules, see `.commitrules` and project memories.
