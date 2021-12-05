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
            sentences.append(vector['text1'])
        if 'text2' in type:
            sentences.append(vector['text2'])
    df_document = spark.createDataFrame(sentences, ["text"])
    word2Vec = Word2Vec(vectorSize=3, minCount=0, inputCol="text", outputCol="result")
    model = word2Vec.fit(df_document)
    df_vector = model.transform(df_document)
    for row in df_vector.collect():
        text, vector = row
        print("text: [%s] => \nvector: %s\n" % (", ".join(text), str(vector)))

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
