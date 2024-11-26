import time

def calculate_compression(original_length, summary_length):
    return (original_length - summary_length) / original_length * 100

def generate_summary_with_enhancements(model, tokenizer, text, target_compression=None, min_length=50, max_length=150, max_retries=5):
    original_length = len(text.split())
    if target_compression is not None:
        min_length = int(original_length * (1 - target_compression / 100))
        max_length = original_length

    retries = 0
    while retries < max_retries:
        inputs = tokenizer(text, return_tensors="pt", truncation=True, padding="longest")
        start_time = time.time()

        summary_ids = model.generate(
            inputs["input_ids"],
            min_length=min_length,
            max_length=max_length,
            length_penalty=2.0,
            num_beams=4,
            early_stopping=True
        )
        end_time = time.time()

        summary = tokenizer.decode(summary_ids[0], skip_special_tokens=True)
        summary_length = len(summary.split())
        compression = calculate_compression(original_length, summary_length)

        if target_compression is None or abs(compression - target_compression) <= 5:
            return summary, compression, end_time - start_time

        if compression < target_compression:
            min_length -= 1
        else:
            max_length -= 1

        retries += 1

    return summary, compression, end_time - start_time
