# Intelligent Resume Screening System 🚀

An AI-powered recruitment platform designed to streamline the hiring process. This application automates resume parsing, scoring, and classification using a Python ML engine, providing recruiters with instant insights and candidates with gap analysis comparisons.

## ✨ Key Features

- **Role-Based Access Control**:
  - **Admin**: Approve recruiters, manage users, and oversee the platform.
  - **Recruiter**: Post jobs, view applicants, and get AI-driven insights on resumes.
  - **Candidate**: Browse jobs, apply with one click, and view "Gap Analysis" reports.

- **AI-Powered Analysis**:
  - **Resume Parsing**: Automatically extracts text and skills from PDF/DOCX resumes.
  - **Relevance Scoring**: Assigns a match score (0-100%) based on job requirements.
  - **Smart Classification**: Categorizes applicants as *Highly Suitable*, *Moderately Suitable*, or *Not Suitable*.

- **Candidate Gap Analysis**:
  - Provides transparency to applicants by showing which skills matched and highlighting potential gaps against job descriptions.

## 🛠️ Tech Stack

- **Frontend**: React.js (Vite), Context API, Vanilla CSS (Premium Design).
- **Backend**: Node.js, Express.js, MongoDB (Mongoose).
- **ML Engine**: Python, Flask, NLTK/Spacy (for parsing logic).

## 🚀 Getting Started

### Prerequisites

- Node.js (v14+)
- Python (v3.8+)
- MongoDB (Running locally or Atlas URI)

### 1. Setup Backend (Server)

```bash
cd server
npm install
# Create a .env file with:
# PORT=5000
# MONGO_URI=your_mongo_connection_string
# JWT_SECRET=your_jwt_secret
npm run dev
```

### 2. Setup Frontend (Client)

```bash
cd client
npm install
npm run dev
```

### 3. Setup ML Engine (AI)

```bash
cd ml_engine
# Create a virtual environment (optional but recommended)
python -m venv venv
source venv/bin/activate # or venv\Scripts\activate on Windows

pip install -r requirements.txt
python app.py
```

## 🧪 Usage Flow

1.  **Register/Login**: Users sign up. Recruiters require Admin approval.
2.  **Post Job**: Recruiters create detailed job postings.
3.  **Apply**: Candidates upload resumes.
4.  **AI Processing**: System parses the resume and calculates a score against the job description.
5.  **Review**: Recruiters see a ranked list. Candidates see their personal gap analysis.
