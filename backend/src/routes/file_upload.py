from flask import Blueprint, request, jsonify
import os
from werkzeug.utils import secure_filename
from src.services.file_processing import process_file
from src.services.summarization import generate_summary_with_enhancements
from src.models.nlp_model import model, tokenizer

file_upload_bp = Blueprint('file_upload', __name__)

@file_upload_bp.route('/upload', methods=['POST'])
def upload_file():
    if 'file' not in request.files:
        return jsonify({"error": "No file part in the request"}), 400

    file = request.files['file']
    if file.filename == '':
        return jsonify({"error": "No file selected"}), 400

    if '.' in file.filename and file.filename.rsplit('.', 1)[1].lower() in {'txt', 'docx'}:
        filename = secure_filename(file.filename)
        file_path = os.path.join('./uploads', filename)
        file.save(file_path)

        # Traiter le fichier
        content = process_file(file_path, file.filename)

        # Générer le résumé
        summary, compression, time_taken = generate_summary_with_enhancements(
            model, tokenizer, content, target_compression=50
        )

        return jsonify({
            "original_text": content[:500] + "...",
            "summary": summary,
            "original_length": len(content.split()),
            "summary_length": len(summary.split()),
            "compression": f"{compression:.2f}%",
            "generation_time": f"{time_taken:.2f} seconds"
        }), 200

    else:
        return jsonify({"error": "Invalid file type"}), 400
