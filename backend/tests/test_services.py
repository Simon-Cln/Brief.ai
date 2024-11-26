import unittest
from src.services.file_processing import process_txt_file
from src.services.summarization import calculate_compression

class TestServices(unittest.TestCase):
    def test_process_txt_file(self):
        with open('test.txt', 'w') as f:
            f.write("test pour voir si ca marche.")
        content = process_txt_file('test.txt')
        self.assertEqual(content, "test pour voir si ca marche.")

    def test_calculate_compression(self):
        compression = calculate_compression(100, 50)
        self.assertEqual(compression, 50.0)

if __name__ == '__main__':
    unittest.main()
