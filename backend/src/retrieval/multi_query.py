# backend/src/retrieval/multi_query.py

from langchain.retrievers.multi_query import MultiQueryRetriever


def create_multi_query_retriever(vectorstore, llm):

    # retrieve more chunks
    base_retriever = vectorstore.as_retriever(
        search_type="similarity",
        search_kwargs={
            "k": 5
        }
    )

    # create multiple alternative queries
    multi_query = MultiQueryRetriever.from_llm(
        retriever=base_retriever,
        llm=llm
    )

    return multi_query