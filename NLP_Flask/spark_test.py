import pyspark
from pyspark.ml.feature import Word2Vec
from pyspark.sql import SparkSession

spark = SparkSession.builder \
    .appName("dbscan") \
    .config("master", "local[4]") \
    .enableHiveSupport() \
    .getOrCreate()
df_document = spark.createDataFrame([
    ("Hi I heard about Spark".split(" "),),
    ("I wish Java could use case classes".split(" "),),
    ("Logistic regression models are neat".split(" "),)
], ["text"])

word2Vec = Word2Vec(vectorSize=3, minCount=0, inputCol="text", outputCol="result")
model = word2Vec.fit(df_document)

df_vector = model.transform(df_document)
for row in df_vector.collect():
    text, vector = row
    print("text: [%s] => \nvector: %s\n" % (", ".join(text), str(vector)))
