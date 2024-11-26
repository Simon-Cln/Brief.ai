from docx import Document

def process_txt_file(file_path):
    with open(file_path, 'r', encoding='utf-8') as file:
        return file.read()

def process_docx_file(file_path):
    doc = Document(file_path)
    return '\n'.join([p.text for p in doc.paragraphs])

def process_file(file_path, filename):
    if filename.endswith('.txt'):
        return process_txt_file(file_path)
    elif filename.endswith('.docx'):
        return process_docx_file(file_path)
    else:
        raise ValueError("Unsupported file format")
