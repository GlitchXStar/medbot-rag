from sentence_transformers import CrossEncoder


class DocumentReranker:

    def __init__(self):
        self.model = CrossEncoder(
            "cross-encoder/ms-marco-MiniLM-L-6-v2"
        )

    def rerank(self, query, docs, top_k=5):

        if not docs:
            return []

        pairs = []

        for doc in docs:
            pairs.append(
                (query, doc.page_content)
            )

        scores = self.model.predict(pairs)

        ranked = sorted(
            zip(docs, scores),
            key=lambda x: x[1],
            reverse=True
        )

        return [
            doc for doc, score in ranked[:top_k]
        ]