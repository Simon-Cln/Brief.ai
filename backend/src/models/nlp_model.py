from transformers import AutoTokenizer, AutoModelForSeq2SeqLM
from src.config import load_config

config = load_config()
model_name = config['MODEL_NAME']

tokenizer = AutoTokenizer.from_pretrained(model_name)
model = AutoModelForSeq2SeqLM.from_pretrained(model_name)
