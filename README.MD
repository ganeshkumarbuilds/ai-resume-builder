# ResumeAI - AI Powered Resume Builder

## Overview

ResumeAI is a full-stack AI-powered resume builder that helps users create professional resumes, improve ATS scores, analyze job matches, generate cover letters, and prepare for interviews.

## Features

### Resume Management
- Create Resume
- Edit Resume
- Delete Resume
- Multiple Resume Templates
- Live Resume Preview
- Public/Private Resume Sharing
- PDF Download

### AI Features
- AI Professional Summary Generator
- AI Job Description Enhancer
- ATS Score Analyzer
- Job Match Analyzer
- AI Cover Letter Generator
- AI Interview Questions Generator

### Authentication
- User Registration
- User Login
- Protected Routes
- JWT Authentication

## Tech Stack

### Frontend
- React.js
- Tailwind CSS
- Axios
- React Router

### Backend
- Node.js
- Express.js
- MongoDB
- Mongoose
- JWT

### AI Integration
- Groq API
- Llama 3.3 70B Model

## Project Structure

client/
server/

## Installation

### Clone Repository

```bash
git clone <your-repository-url>
cd ai-resume-builder
```

### Backend Setup

```bash
cd server
npm install
npm run dev
```

### Frontend Setup

```bash
cd client
npm install
npm run dev
```

## Environment Variables

### Backend (.env)

```env
MONGODB_URI=
JWT_SECRET=
OPENAI_API_KEY=
OPENAI_MODEL=
IMAGEKIT_PUBLIC_KEY=
IMAGEKIT_PRIVATE_KEY=
IMAGEKIT_URL_ENDPOINT=
```

### Frontend (.env)

```env
VITE_BASE_URL=http://localhost:3000
```

## AI Modules

### ATS Score Analyzer
Evaluates resume quality and provides improvement suggestions.

### Job Match Analyzer
Compares resume content against job descriptions and provides a match score.

### Cover Letter Generator
Generates personalized cover letters for specific companies and job roles.

### Interview Questions Generator
Creates technical, project-based, and HR interview questions based on resume content.

## Future Improvements

- Skill Gap Analysis
- Resume Version History
- Portfolio Generator
- Resume Analytics Dashboard

## Author

Ganesh Kumar Chavala