from app.dataAPI.data_cleaning import getCleaningData


class Operator():
    def operator(self):
        vectors = getCleaningData()
        for vector in vectors[:]:
            if len(vector['text1']) < 50:
                vectors.remove(vector)
        return vectors
