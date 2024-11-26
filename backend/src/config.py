import os
import yaml

def load_config(config_file='config.yaml'):
    with open(config_file, 'r') as file:
        return yaml.safe_load(file)

default_config = {
    'UPLOAD_FOLDER': './uploads',
    'MODEL_NAME': 'philschmid/bart-large-cnn-samsum',
    'ALLOWED_EXTENSIONS': {'txt', 'docx'}
}

# cacréé le dossier upload au démarrage
os.makedirs(default_config['UPLOAD_FOLDER'], exist_ok=True)
