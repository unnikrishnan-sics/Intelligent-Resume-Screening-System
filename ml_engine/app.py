from flask import Flask, request, jsonify
from flask_cors import CORS
import os

app = Flask(__name__)
CORS(app)

import resume_parser

@app.route('/', methods=['GET'])
def home():
    return jsonify({"message": "UPDATED"})

@app.route('/parse', methods=['POST'])
def parse_resume():
    data = request.get_json()
    
    if not data:
        return jsonify({"error": "No data provided"}), 400
        
    file_path = data.get('filePath')
    job_requirements = data.get('requirements', [])
    
    if not file_path:
        return jsonify({"error": "No file path provided"}), 400
        
    if not os.path.exists(file_path):
        return jsonify({"error": "File not found"}), 404

    # 1. Extract Text
    text = ""
    try:
        if file_path.lower().endswith('.pdf'):
            text = resume_parser.extract_text_from_pdf(file_path)
        elif file_path.lower().endswith('.docx') or file_path.lower().endswith('.doc'):
            text = resume_parser.extract_text_from_docx(file_path)
        elif file_path.lower().endswith('.txt'):
            text = resume_parser.extract_text_from_txt(file_path)
        else:
            return jsonify({"error": "Unsupported file format"}), 400
            
        if not text:
             return jsonify({"error": "Could not extract text from file"}), 422

        # 2. Process & Score
        score, found_skills = resume_parser.calculate_score(text, job_requirements)
        classification = resume_parser.classify_role(score)

        result = {
            "parsedData": {
                "text_preview": text[:200] + "...",
                "skills": found_skills
            },
            "score": score,
            "classification": classification
        }
        
        return jsonify(result), 200

    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    print(app.url_map)
    app.run(debug=True, port=5001, host='0.0.0.0')
