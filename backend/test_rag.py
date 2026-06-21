import sys
sys.path.insert(0, '.')

from src.vectorstore import load_vectorstore, get_retriever
from src.rag_chain import build_rag_chain, ask

vs = load_vectorstore()
retriever = get_retriever(vs)
chain = build_rag_chain(retriever)

result = ask(chain, 'What are the symptoms of malaria?')

print(result['answer'])
print()

for s in result['sources']:
    print(f"Page {s['page']}: {s['preview']}")

    docs = retriever.invoke("What are the symptoms of malaria?")

print("\nRETRIEVED DOCUMENTS\n")

for i, doc in enumerate(docs):
    print(f"\n------ DOC {i+1} ------")
    print(doc.page_content)
    print()
