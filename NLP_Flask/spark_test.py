import pyspark
from pyspark.ml.feature import Word2Vec
from pyspark.sql import SparkSession

spark = SparkSession.builder \
    .appName("dbscan") \
    .config("master", "local[4]") \
    .enableHiveSupport() \
    .getOrCreate()
v1 = ['Hi', 'I', "Heard"]
t1 = (v1,)
v2 = ['I', 'Wish', "Java"]
t2 = (v2,)
v = [t1, t2]
df_document_1 = spark.createDataFrame(v, ["text"])
v3 = [
    ("Hi I heard about Spark".split(" "),),
    ("I wish Java could use case classes".split(" "),),
    ("Logistic regression models are neat".split(" "),)
]
df_document = spark.createDataFrame([
    ("Hi I heard about Spark".split(" "),),
    ("I wish Java could use case classes".split(" "),),
    ("Logistic regression models are neat".split(" "),)
], ["text"])
word2Vec = Word2Vec(vectorSize=3, minCount=0, inputCol="text", outputCol="result")
model = word2Vec.fit(df_document_1)

df_vector = model.transform(df_document_1)
for row in df_vector.collect():
    text, vector = row
    print("text: [%s] => \nvector: %s\n" % (", ".join(text), str(vector)))
