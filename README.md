# Admission Consulting Chatbot Backend

_Last updated: 2025-04-19_

## 1. Purpose & Goals
This project provides the backend infrastructure for an AI-powered admission consulting platform designed to guide prospective students through the college admission process. The system combines a conversational chatbot interface with comprehensive data APIs to deliver personalized admission guidance, program recommendations, and scholarship information.

## 2. Technology Stack
- **Language:** TypeScript (strict mode enabled)
- **Framework:** Express.js
- **ORM:** Drizzle ORM (PostgreSQL)
- **Other Libraries:** body-parser, dotenv, morgan, swagger-jsdoc, swagger-ui-express, uuid

## 3. Directory Structure
```
src/
├── api/           # Routes and controllers
├── config/        # Application configuration
├── db/            # Database connection and schema
├── docs/          # API documentation (OpenAPI/Swagger)
├── middlewares/   # Common middlewares (error, session)
├── services/      # Business logic (planned)
├── utils/         # Utilities (logger, helpers)
├── app.ts         # App initialization
└── server.ts      # Server bootstrap
```

## 4. Key Features

### Conversational AI
- **Intelligent Chatbot Interface** that understands natural language queries about admissions
- **Contextual Session Management** to maintain conversation history and user preferences
- **Personalized Recommendations** based on student interests, academic background, and career goals

### Data Services
- **Comprehensive Program Information** for all majors and specializations
- **Campus Details** including facilities, location, and student life
- **Financial Planning Tools** with tuition information and scholarship matching
- **Admission Requirements** and application guidance for different entry methods
- **Dormitory Information** to help with accommodation planning

### Technical Features
- **RESTful API Architecture** with TypeScript type safety
- **Interactive API Documentation** using Swagger/OpenAPI
- **Robust Validation** for all inputs using Zod
- **Centralized Error Handling** with consistent response formats
- **Type-safe Database Access** using Drizzle ORM
- **Configurable Environment** via environment variables
- **Comprehensive Logging** for monitoring and debugging

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

## 7. Getting Started

### Prerequisites
- Node.js 18+ and pnpm
- PostgreSQL database

### Installation
```bash
# Clone the repository
git clone https://github.com/your-org/admission-chatbot-backend.git
cd admission-chatbot-backend

# Install dependencies
pnpm install

# Set up environment variables
cp .env.example .env
# Edit .env with your database credentials and other settings

# Run database migrations
pnpm run migrate

# Start development server
pnpm run dev
```

### Interactive API Documentation
The project includes interactive API documentation using Swagger/OpenAPI.

When the server is running, you can access the documentation at:
```
http://localhost:4000/docs
```

This provides a complete, interactive documentation of all API endpoints with the ability to try them directly from the browser.

### Testing the Chatbot
You can test the Zalo webhook endpoint using:
```bash
# Verify webhook
curl -X GET "http://localhost:3000/api/chatbot/zalo/webhook"

# Send a message
curl -X POST "http://localhost:3000/api/chatbot/zalo/webhook" \
  -H "Content-Type: application/json" \
  -d '{
    "app_id": "your_app_id",
    "event_name": "user_send_text",
    "sender": {
      "id": "user_id"
    },
    "message": {
      "text": "Tell me about Computer Science programs"
    }
  }'
```

## 8. Contribution Guidelines

### Development Workflow
1. Create a feature branch following naming convention: `feat/feature-name`
2. Implement changes following project coding standards
3. Write or update tests as needed
4. Submit a pull request with a clear description of changes
5. Address review feedback

### Commit Messages
Follow the conventional commits format (see `.commitrules` for details):
```
type(scope): subject

[optional body]

[optional footer(s)]
```

### Code Review Checklist
- Does the code follow TypeScript best practices?
- Are types properly defined and used?
- Is validation properly implemented?
- Are error cases handled appropriately?
- Is the code well-documented?
- Do changes maintain backward compatibility?

---

## 9. License
This project is proprietary and confidential. Unauthorized copying, transfer, or reproduction of the contents is strictly prohibited.

---

© 2025 SWP391 Team. All Rights Reserved.
