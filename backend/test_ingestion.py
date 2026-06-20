import sys
import time

sys.path.insert(0, '.')
from src.ingestion import load_and_chunk


PDF_PATH = 'data/The-Gale-Encyclopedia-of-Medicine-3rd-Edition-staibabussalamsula.ac_.id_.pdf'

start = time.time()
chunks = load_and_chunk(PDF_PATH)
end = time.time()

# average chunk size
avg_chars = sum(len(chunk.page_content) for chunk in chunks) / len(chunks)

print("\n" + "="*60)
print("INGESTION PIPELINE TEST RESULTS")
print("="*60)
print(f"Total chunks        : {len(chunks)}")
print(f"Execution time      : {end - start:.2f} sec")
print(f"Average chunk chars : {avg_chars:.2f}")
print(f"Sample page         : {chunks[50].metadata.get('page')}")
print(f"Sample chunk        :")
print(chunks[50].page_content[:300])
print("="*60)