from gensim.models import word2vec as wc
from gensim.models import doc2vec as dc

from manage import app
from app.utils.file_utils import getFileURL


def Word2vec(data, params, type):
    sentences = []
    for vector in data['vectors']:
        if 'text1' in type:
            sentences.append(vector['text1'])
        if 'text2' in type:
            sentences.append(vector['text2'])
    if (params['max_vocab_size'] == 'None'):
        params['max_vocab_size'] = None
    else:
        params['max_vocab_size'] = int(params['max_vocab_size'])
    if (params['trim_rule'] == 'None'):
        params['trim_rule'] = None
    else:
        params['trim_rule'] = int(params['trim_rule'])
    model = wc.Word2Vec(sentences, size=int(params['size']), alpha=int(params['alpha']), window=int(params['window']),
                        min_count=int(params['min_count']), max_vocab_size=params['max_vocab_size'],
                        sample=int(params['sample']), seed=int(params['seed']), workers=int(params['workers']),
                        min_alpha=int(params['min_alpha']), sg=int(params['sg']), hs=int(params['hs']),
                        negative=int(params['negative']), cbow_mean=int(params['cbow_mean']),
                        hashfxn=hash, iter=int(params['iter']),
                        trim_rule=params['trim_rule'], sorted_vocab=int(params['sorted_vocab']),
                        batch_words=int(params['batch_words']))
    modelURL = getFileURL('word2vec.txt', app)
    model.wv.save_word2vec_format(modelURL, binary=False)
    data['embedding'] = modelURL
    return data


from pyspark.ml.feature import Word2Vec
from pyspark.sql import SparkSession


def Word2vecSpark(data, params, type):
    spark = SparkSession.builder.appName("word2vec").config("master", "local[*]").enableHiveSupport().getOrCreate()
    sentences = []
    for vector in data['vectors']:
        if 'text1' in type:
            sentences.append((vector['text1'],))
        if 'text2' in type:
            sentences.append((vector['text2'],))
    df_document = spark.createDataFrame(sentences, ["text"])
    if (params['max_vocab_size'] == 'None'):
        params['max_vocab_size'] = None
    else:
        params['max_vocab_size'] = int(params['max_vocab_size'])
    word2Vec = Word2Vec(vectorSize=int(params['size']), minCount=int(params['min_count']),
                        maxIter=int(params['iter']), seed=int(params['seed']),
                        windowSize=int(params['window']), maxSentenceLength=params['max_vocab_size'])
    model = word2Vec.fit(df_document)
    df_vector = model.transform(df_document)
    embedding = []
    for row in df_vector.collect():
        embedding.append(row[1].array)
    data['embedding'] = embedding


def Doc2vec(data, params, type):
    sentences = []
    for vector in data['vectors']:
        if 'text1' in type:
            sentences.append(vector['text1'])
        if 'text2' in type:
            sentences.append(vector['text2'])
    if (params['max_vocab_size'] == 'None'):
        params['max_vocab_size'] = None
    else:
        params['max_vocab_size'] = int(params['max_vocab_size'])
    document = []
    for i, sentence in enumerate(sentences):
        document.append(dc.TaggedDocument(sentence, [i]))
    model = dc.Doc2Vec(document, size=int(params['size']), alpha=int(params['alpha']), window=int(params['window']),
                       min_count=int(params['min_count']), max_vocab_size=params['max_vocab_size'],
                       sample=int(params['sample']), seed=int(params['seed']), workers=int(params['workers']))
    modelURL = getFileURL('doc2vec.txt', app)
    model.wv.save_word2vec_format(modelURL, binary=False)
    data['embedding'] = modelURL
    return data


from sklearn.feature_extraction.text import TfidfVectorizer


def myTFIDF(data, params, type):
    sentences = []
    for vector in data['vectors']:
        if 'text1' in type:
            sentences.append(vector['text1'])
        if 'text2' in type:
            sentences.append(vector['text2'])
    tv = TfidfVectorizer(use_idf=True, smooth_idf=True, norm=None)
    tv_fit = tv.fit_transform(sentences)
    data['embedding'] = tv_fit.toarray()
    return data


from pyspark.ml.feature import CountVectorizer
from pyspark.ml.feature import CountVectorizerModel
from pyspark.ml.feature import IDF
from pyspark.ml.feature import IDFModel


def myTFIDFSpark(data, params, type):
    spark = SparkSession.builder.appName("word2vec").config("master", "local[*]").enableHiveSupport().getOrCreate()
    sentences = []
    for vector in data['vectors']:
        if 'text1' in type:
            sentences.append((vector['text1'],))
        if 'text2' in type:
            sentences.append((vector['text2'],))
    df_document = spark.createDataFrame(sentences, ["text"])
    cv = CountVectorizer(inputCol="words", outputCol="countFeatures", vocabSize=200 * 10000, minDF=1.0)
    # 训练词频统计模型
    cv_model = cv.fit(df_document)
    cv_model.write().overwrite().save("app/models/MLmodel/CV.model")

    cv_model = CountVectorizerModel.load("app/models/MLmodel/CV.model")
    # 得出词频向量结果
    cv_result = cv_model.transform(df_document)
    idf = IDF(inputCol="countFeatures", outputCol="idfFeatures")
    idf_model = idf.fit(cv_result)
    idf_model.write().overwrite().save("app/models/MLmodel/IDF.model")

    idf_model = IDFModel.load("app/models/MLmodel/IDF.model")
    tfidf_result = idf_model.transform(cv_result)
    data['embedding'] = tfidf_result.toarray()
    return data


from pyspark.ml.feature import MaxAbsScaler


def MaxAbs(data, params, type):
    spark = SparkSession.builder.appName("MaxMin").config("master", "local[*]").enableHiveSupport().getOrCreate()
    sentences = []
    for vector in data['vectors']:
        if 'text1' in type:
            sentences.append((vector['text1'],))
        if 'text2' in type:
            sentences.append((vector['text2'],))
    df_document = spark.createDataFrame(sentences, ["text"])
    scaler = MaxAbsScaler(inputCol="feature", outputCol="scaledFeatures")
    scalerModel = scaler.fit(df_document)
    df_rescaled = scalerModel.transform(df_document)
    data['vectors'] = df_rescaled.data
    return data


from pyspark.ml.feature import MinMaxScaler


def MinMax(data, params, type):
    spark = SparkSession.builder.appName("MaxMin").config("master", "local[*]").enableHiveSupport().getOrCreate()
    sentences = []
    for vector in data['vectors']:
        if 'text1' in type:
            sentences.append((vector['text1'],))
        if 'text2' in type:
            sentences.append((vector['text2'],))
    df_document = spark.createDataFrame(sentences, ["text"])
    scaler = MinMaxScaler(inputCol="feature", outputCol="scaledFeatures")
    scalerModel = scaler.fit(df_document)
    df_rescaled = scalerModel.transform(df_document)
    data['vectors'] = df_rescaled.data
    return data


from sklearn.decomposition import PCA


def PCASK(data, params, type):
    sentences = []
    for vector in data['vectors']:
        if 'text1' in type:
            sentences.append((vector['text1'],))
        if 'text2' in type:
            sentences.append((vector['text2'],))
    pca = PCA(0.5)
    pca.fit(sentences)
    data['vectors'] = pca.transform(sentences)
    return data


from sklearn.decomposition import LatentDirichletAllocation


def LDASK(data, params, type):
    sentences = []
    for vector in data['vectors']:
        if 'text1' in type:
            sentences.append((vector['text1'],))
        if 'text2' in type:
            sentences.append((vector['text2'],))
    lda = LatentDirichletAllocation(0.5)
    lda.fit(sentences)
    data['vectors'] = lda.transform(sentences)
    return data


from pyspark.ml.feature import PCA


def PCASpark(data, params, type):
    spark = SparkSession.builder.appName("PCA").config("master", "local[*]").enableHiveSupport().getOrCreate()
    sentences = []
    for vector in data['vectors']:
        if 'text1' in type:
            sentences.append((vector['text1'],))
        if 'text2' in type:
            sentences.append((vector['text2'],))
    df_document = spark.createDataFrame(sentences, ["text"])
    pca = PCA(k=3, inputCol="features", outputCol="pcaFeatures")
    model = pca.fit(df_document)
    dfresult = model.transform(df_document).select("pcaFeatures")
    data['vectors'] = dfresult
    return data




def LDASpark(data, params, type):
    spark = SparkSession.builder.appName("PCA").config("master", "local[*]").enableHiveSupport().getOrCreate()
    sentences = []
    for vector in data['vectors']:
        if 'text1' in type:
            sentences.append((vector['text1'],))
        if 'text2' in type:
            sentences.append((vector['text2'],))
    df_document = spark.createDataFrame(sentences, ["text"])
    pca = PCA(k=3, inputCol="features", outputCol="pcaFeatures")
    model = pca.fit(df_document)
    dfresult = model.transform(df_document).select("pcaFeatures")
    data['vectors'] = dfresult
    return data
