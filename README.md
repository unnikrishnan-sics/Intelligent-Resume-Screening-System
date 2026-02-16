# Intelligent Resume Screening System 🚀

An AI-powered recruitment platform designed to streamline the hiring process. This application automates resume parsing, scoring, and classification using a Python ML engine, providing recruiters with instant insights and candidates with gap analysis comparisons.

## 👤 User Functions

### Admin
- **Manage Users**: Approve or decline new recruiter registrations.
- **Platform Oversight**: View system-wide statistics including total candidates, recruiters, and job applications.
- **Candidate Management**: View detailed candidate profiles and their application history.

### Recruiter
- **Job Management**: Create, update, and delete job postings with detailed requirements.
- **Applicant Tracking**: View a ranked list of applicants for each job based on AI scores.
- **Resume Analysis**: Access detailed AI-driven reports on candidate suitability.

### Candidate
- **Job Search**: Browse active job listings.
- **Easy Apply**: Upload resumes to apply for jobs directly.
- **Gap Analysis**: Receive instant feedback on how well your resume matches the job description and identify missing skills.

## 🔄 Project Flow

1.  **Registration**: Users sign up. Recruiters are placed in a pending state until approved by an Admin.
2.  **Job Posting**: Approved Recruiters post jobs with specific skill requirements.
3.  **Application**: Candidates browse jobs and upload their resumes.
4.  **AI Processing**: The system parses the resume, compares it against the job description, and calculates a match score.
5.  **Review**: 
    - Recruiters see a sorted list of best-fit candidates.
    - Candidates see a "Gap Analysis" report highlighting their strengths and missing skills.

## 🚀 Installation & Setup

### Prerequisites
- Node.js (v14+)
- Python (v3.8+)
- MongoDB (Running locally or via Atlas URI)

### 1. Backend Setup (Server)
```bash
cd server
npm install
# Create a .env file with:
# PORT=5000
# MONGO_URI=your_mongo_connection_string
# JWT_SECRET=your_jwt_secret
npm run dev
```

### 2. Frontend Setup (Client)
```bash
cd client
npm install
npm run dev
```

### 3. ML Engine Setup (AI Service)
```bash
cd ml_engine
# Create a virtual environment (optional but recommended)
python -m venv venv
source venv/bin/activate # or venv\Scripts\activate on Windows

pip install -r requirements.txt
python app.py
```
