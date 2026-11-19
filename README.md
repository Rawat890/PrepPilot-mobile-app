# PrepPilot Mobile – AI Exam Preparation App

A full-stack, cross-platform AI Exam Preparation mobile application built with **Expo (React Native)**, **JavaScript**, **Redux Toolkit**, **React Navigation**, **Express (ES Modules)**, **MongoDB**, **Redis**, **Swagger**, and **Groq AI**.

---

## Key Features

- **AI-Generated Mock Tests**: Generate custom timed mock tests on any topic and difficulty level using **Groq LLM (`llama-3.3-70b-versatile`)**.
- **Timed Examinations**: Real-time countdown exam hall with auto-submission, progress tracking, and competitive marking (`+4 / -1`).
- **AI-Powered Explanations**: Step-by-step personalized question breakdowns powered by Groq AI Tutor.
- **Performance Analytics**: Visual accuracy KPIs, subject-wise mastery progress bars, and full attempt history.
- **Bookmarks & Question Review**: Save tricky questions during exams and review solutions anytime.
- **Offline Question Caching**: Sync mock tests locally via `AsyncStorage` to attempt exams without an internet connection.
- **Authentication & Profile Management**: JWT authentication, profile editing, and permanent cascade account deletion.
- **Test Series Store & Cart**: Browse exam bundles, add/remove items in Redux-backed cart, and reserve orders (Payment Gateway integration reserved for final release phase).
- **Swagger API Documentation**: Interactive OpenAPI docs available at `/api-docs`.

---

## Project Structure

```text
PrepPilot-Mobile/
├── backend/
│   ├── .env.example
│   ├── package.json
│   └── src/
│       ├── config/          # MongoDB, Redis (with memory fallback), Swagger config
│       ├── controllers/     # Auth, Tests, AI, Bookmarks, Store & Cart controllers
│       ├── middleware/      # JWT protection & centralized error handling
│       ├── models/          # Mongoose schemas (User, Question, MockTest, TestAttempt, Bookmark, TestPack, Cart)
│       ├── routes/          # Express routes with Swagger JSDoc annotations
│       ├── seed/            # Database seeder (demo user, questions, mock tests, store packs)
│       ├── services/        # Groq AI SDK integration
│       └── server.js        # Express application entry point
├── mobile/
│   ├── App.js
│   ├── app.json
│   ├── babel.config.js
│   ├── index.js
│   ├── package.json
│   └── src/
│       ├── api/             # Axios client with automatic JWT interceptor
│       ├── components/      # Responsive animated cards & buttons (react-native-size-matters)
│       ├── constants/       # Theme colors & shadows
│       ├── navigation/      # React Navigation Stack & Bottom Tabs
│       ├── screens/         # Login, Register, Home, AI Generator, Exam, Result, Analytics, Bookmarks, Store, Cart, Profile
│       └── store/           # Redux Toolkit store & async slices
└── README.md
```

---

## Setup & Installation

### 1. Backend Setup
```bash
cd backend
npm install
cp .env.example .env
# Add your GROQ_API_KEY and MONGO_URI in .env
npm run seed
npm run dev
```
- **API Base URL**: `http://localhost:5000`
- **Swagger Documentation**: `http://localhost:5000/api-docs`
- **Demo Account**: `demo@preppilot.ai` / `password123`

### 2. Mobile App Setup (Expo)
```bash
cd mobile
npm install
npx expo start
```
> **Note for Physical Devices**: Update `DEFAULT_BASE_URL` in `mobile/src/api/client.js` to your computer's local Wi-Fi IP address (e.g., `http://192.168.1.10:5000/api`).
