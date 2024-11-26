from flask import Flask
from flask_cors import CORS
from src.config import load_config
from src.routes.file_upload import file_upload_bp

def create_app():
    app = Flask(__name__)
    CORS(app, resources={r"/*": {"origins": ["http://localhost:3000", "http://192.168.x.x"]}})

    # load la config
    config = load_config()
    app.config.update(config)

    # enregsitre les blueprints
    app.register_blueprint(file_upload_bp)

    return app

if __name__ == '__main__':
    app = create_app()
    app.run(host='0.0.0.0', port=5000, debug=True)
