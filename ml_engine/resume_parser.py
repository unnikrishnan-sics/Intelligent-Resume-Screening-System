import sys
import json
import os
import re
import spacy
# from pdfminer.high_level import extract_text as extract_pdf_text
import docx2txt

# Check if spacy model is loaded, otherwise handle gracefully or download
try:
    nlp = spacy.load("en_core_web_sm")
except OSError:
    # Just print error and continue or exit? User wants previous behavior.
    # Previous behavior had this check.
    # We will assume it's installed or user will run download command.
    pass

def extract_text_from_pdf(file_path):
    from pdfminer.high_level import extract_text
    try:
        text = extract_text(file_path)
        return text
    except Exception as e:
        return ""

def extract_text_from_docx(file_path):
    try:
        text = docx2txt.process(file_path)
        return text
    except Exception as e:
        return ""

def extract_text_from_txt(file_path):
    try:
        with open(file_path, 'r', encoding='utf-8') as f:
            return f.read()
    except Exception as e:
        return ""

def clean_text(text):
    text = text.lower()
    text = re.sub(r'http\S+', '', text)  # remove URLs
    text = re.sub(r'\s+', ' ', text)  # remove extra whitespace
    text = re.sub(r'[^\w\s]', '', text)  # remove special chars
    return text


# Common tech skills database (expanded)
COMMON_SKILLS_DB = {
    "python", "java", "c++", "c", "c#", "javascript", "typescript", "html", "css", "sql", "nosql",
    "react", "angular", "vue", "node.js", "express", "django", "flask", "springboot", "dotnet",
    "aws", "azure", "gcp", "docker", "kubernetes", "jenkins", "git", "github", "gitlab",
    "machine learning", "deep learning", "nlp", "computer vision", "tensorflow", "pytorch",
    "pandas", "numpy", "scikit-learn", "matplotlib", "seaborn",
    "communication", "teamwork", "leadership", "problem solving", "agile", "scrum",
    "mongodb", "postgresql", "mysql", "redis", "elasticsearch",
    "linux", "unix", "bash", "shell scripting",
    "rest api", "graphql", "devops", "ci/cd",
    "data analysis", "data science", "big data", "hadoop", "spark",
    "figma", "adobe xd", "ui/ux", "terraform", "ansible"
}

def extract_skills(text, required_skills=None):
    # This function extracts skills based on a required list AND a common database.
    
    found_skills = set()
    cleaned_doc = clean_text(text) # Use the cleaned text helper
    text_set = set(cleaned_doc.split())
    
    # 1. Check against required skills (Priority)
    if required_skills:
        for skill in required_skills:
            skill_cleaned = clean_text(skill)
            if ' ' in skill_cleaned:
                if skill_cleaned in cleaned_doc:
                    found_skills.add(skill) # Add original casing for display if preferred, or title case
            else:
                if skill_cleaned in text_set:
                    found_skills.add(skill)

    # 2. Check against common skills DB
    for skill in COMMON_SKILLS_DB:
        # DB skills are already lower case in our set definition
        if ' ' in skill:
             if skill in cleaned_doc:
                 found_skills.add(skill.title()) 
        else:
             if skill in text_set:
                 found_skills.add(skill.title())
                 
    return list(found_skills)

def calculate_score(text, required_skills):
    # Extract all skills first
    all_found_skills = extract_skills(text, required_skills)
    
    # Calculate score ONLY based on required_skills matches
    if not required_skills or len(required_skills) == 0:
        # If no requirements, heuristic: 5 points per skill found
        score = len(all_found_skills) * 5
        score = min(score, 100.0) # Cap at 100
    else:
        # Intersection
        found_normalized = {clean_text(s) for s in all_found_skills}
        req_normalized = {clean_text(s) for s in required_skills}
        
        matches = found_normalized.intersection(req_normalized)
        
        if len(req_normalized) == 0:
            score = 0
        else:
            score = (len(matches) / len(req_normalized)) * 100
            
    # Final Safety Cap
    score = min(score, 100.0)
        
    return round(score, 2), all_found_skills

def classify_role(score):
    if score >= 80:
        return "Highly Suitable"
    elif score >= 50:
        return "Moderately Suitable"
    else:
        return "Not Suitable"

def main():
    if len(sys.argv) < 3:
        # If called directly from command line (spawn)
        # But we are using Flask now, so this main() might not be used by app.py imports
        # However, app.py calls functions from here.
        # Let's double check app.py.
        # app.py imports resume_parser. 
        # resume_parser.calculate_score is called.
        pass

    # app.py calls:
    # score, found_skills = resume_parser.calculate_score(text, job_requirements)
    # classification = resume_parser.classify_role(score)
    # This file is used as a module.
    pass

if __name__ == "__main__":
    main()
