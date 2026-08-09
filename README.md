# ⚙️ AmarGPT - Backend Service

Express.js REST API service for AmarGPT, powering authentication, thread storage, and Google Gemini LLM API integration.

## 🚀 Technologies Used
- **Node.js & Express.js 5**
- **MongoDB & Mongoose ORM**
- **Google Gemini 2.5 Flash API** (`@google/genai` / REST integration)
- **bcrypt** & **crypto** for Authentication

## 📁 Directory Overview
- `model/`: Mongoose schemas for User (`user.js`) and Thread/Message (`Thrade.js`).
- `routes/`: Express router modules for Auth (`userRoute.js`) and Chat (`chat.js`).
- `utils/`: Generative AI wrapper calling Gemini 2.5 Flash endpoint (`openAi.js`).
- `index.js`: Main Express application entry point.

## 🛠️ Environment Configuration (`.env`)
```env
PORT=3000
MONGO_URI=your_mongodb_connection_string
GEMINI_API_KEY=your_gemini_api_key
```

## ⚡ Quick Start
```bash
npm install
npm start
```

For full documentation, architecture diagrams, and API specifications, see the [Main Project README](../README.md).