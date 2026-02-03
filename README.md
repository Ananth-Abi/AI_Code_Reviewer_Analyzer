# 🤖 AI Code Reviewer

**AI Code Reviewer** is an intelligent code analysis tool powered by **Google’s Gemini AI**. It allows developers to analyze their code for **bugs, security vulnerabilities, performance issues**, and **best-practice improvements**. The tool supports multiple programming languages and provides structured, actionable insights to improve code quality and maintainability.

---

## 🌟 Features

- 🤖 **AI-powered code analysis** using Google Gemini
- 🐞 Bug detection and improvement suggestions
- 🔐 Security vulnerability detection
- ⚡ Performance optimization guidance
- 📚 Best practices and clean code suggestions
- 💾 Smart caching system for faster repeated analysis
- 📊 Comprehensive reports and analytics
- 🕒 Review history tracking
- 🎨 Modern black & red themed UI
- 🌐 Supports 8 programming languages: JavaScript, TypeScript, Python, Java, C++, C#, Go, PHP

---

## 🛠 Tech Stack

### Backend
- Node.js  
- Express  
- TypeScript  
- MongoDB  
- Google Gemini AI

### Frontend
- React  
- TypeScript  
- Vite  
- Tailwind CSS  
- Monaco Editor (code editor)

---

## ✅ Prerequisites

Before starting, make sure you have:

- **Node.js** v16 or higher installed  
- **MongoDB** installed and running  
- **Gemini API Key** from [Google AI Studio](https://aistudio.google.com/app/apikey)  

---

## 📦 Installation

### 1. Clone the repository
```bash
git clone <repository-url>
cd ai-code-reviewer

# Backend
cd backend
npm install

# Frontend
cd ../frontend
npm install

GEMINI_API_KEY=your_api_key_here
MONGODB_URI=mongodb://localhost:27017/code-reviewer
PORT=5000

# Backend
cd backend
npm run dev

# Frontend
cd frontend
npm run dev

http://localhost:5173
