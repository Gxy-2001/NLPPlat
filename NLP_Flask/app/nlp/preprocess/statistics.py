from pyspark.sql import SparkSession
from pyspark.ml.linalg import Vectors
from pyspark.sql.functions import mean, stddev


def variance(data, params, type):
    spark = SparkSession.builder.appName("correlationCoefficient").config("master",
                                                                          "local[*]").enableHiveSupport().getOrCreate()
    sentences = []
    for vector in data['vectors']:
        if 'text1' in type:
            sentences.append((vector['text1'],))
        if 'text2' in type:
            sentences.append((vector['text2'],))
    df_document = spark.createDataFrame(sentences, ["text"])
    data['stat'] = df_document.select(mean('language').alias('language_mean'),
                                      stddev('math').alias('math_stddev'))
    return data


from pyspark.ml.stat import Correlation


def correlationCoefficient(data, params, type):
    spark = SparkSession.builder.appName("correlationCoefficient").config("master",
                                                                          "local[*]").enableHiveSupport().getOrCreate()
    sentences = []
    for vector in data['vectors']:
        if 'text1' in type:
            sentences.append((vector['text1'],))
        if 'text2' in type:
            sentences.append((vector['text2'],))
    df_document = spark.createDataFrame(sentences, ["text"])
    r1 = Correlation.corr(df_document, "features").head()
    data['stat'] = r1[0]
    return data


from pyspark.ml.stat import ChiSquareTest


def ChiSquareTest(data, params, type):
    spark = SparkSession.builder.appName("ChiSquareTest").config("master",
                                                                 "local[*]").enableHiveSupport().getOrCreate()
    sentences = []
    for vector in data['vectors']:
        if 'text1' in type:
            sentences.append((vector['text1'],))
        if 'text2' in type:
            sentences.append((vector['text2'],))
    df_document = spark.createDataFrame(sentences, ["text"])
    r = ChiSquareTest.test(df_document, "features", "label").head()
    list = [r.pValues, r.degreesOfFreedom, r.statistics]
    data['stat'] = list
    return data


from pyspark.ml.stat import MultivariateGaussian


def MultivariateGauss(data, params, type):
    spark = SparkSession.builder.appName("MultivariateGauss").config("master",
                                                                     "local[*]").enableHiveSupport().getOrCreate()
    sentences = []
    for vector in data['vectors']:
        if 'text1' in type:
            sentences.append((vector['text1'],))
        if 'text2' in type:
            sentences.append((vector['text2'],))
    df_document = spark.createDataFrame(sentences, ["text"])
    r1 = MultivariateGaussian(df_document)
    data['stat'] = r1
    return data


def PearsonCoefficient(data, params, type):
    pass
