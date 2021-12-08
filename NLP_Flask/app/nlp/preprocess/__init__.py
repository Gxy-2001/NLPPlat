from . import base_methods
from . import vector_models
from . import features_construction
from . import label_encoder
from . import statistics

from app.models.operator import *
from app.utils.codehub_utils import *

from .utils.pre_process_util import *

# 预处理类型与文本列数对应表
preprocessTypeMap = {
    '通用单文本分类': ['text1'],
    '情感分析/意图识别': ['text1'],
    '实体关系抽取': ['text1'],
    '文本关系分析': ['text1', 'text2'],
    '文本匹配': ['text1'],
    '文本摘要': ['text1'],
    '文本排序学习': ['text1']
}


def preprocessManage(preprocessType, preprocessName, data, params, taskType, datasetID=-1, master=-1, pipeline=-1):
    if pipeline != -1:
        for key in pipeline:
            data[key] = pipeline[key]
    else:
        type = preprocessTypeMap[taskType]
        if preprocessType == '基本预处理':
            if preprocessName == '分词':
                data = cut(data, params, type, master=master)
            elif preprocessName == '词性标注':
                data = postagging(data, params, type, master=master)
            elif preprocessName == '去停用词':
                data = stopwords(data, params, type, master=master)
            elif preprocessName == '关键词提取':
                data = base_methods.key_words(data, params, type, master=master)

        elif preprocessType == '向量模型':
            if preprocessName == 'Word2vec':
                if master == -1:
                    data = vector_models.Word2vec(data, params, type)
                else:
                    data = vector_models.Word2vecSpark(data, params, type)
            elif preprocessName == 'TFIDF':
                if master == -1:
                    data = vector_models.myTFIDF(data, params, type)
                else:
                    data = vector_models.myTFIDFSpark(data, params, type)

        elif preprocessType == '特征降维':
            if preprocessName == 'PCA':
                if master == -1:
                    data = vector_models.PCASK(data, params, type)
                else:
                    data = vector_models.PCASpark(data, params, type)
            elif preprocessName == 'LDA':
                if master == -1:
                    data = vector_models.LDASK(data, params, type)
                else:
                    data = vector_models.LDASpark(data, params, type)

        elif preprocessType == '特征缩放':
            if preprocessName=='MaxMin标准化':
                if master != -1:
                    data = vector_models.MinMax(data, params, type)
            if preprocessName=='MaxAbsScaler标准化':
                if master != -1:
                    data = vector_models.MaxAbs(data, params, type)

        elif preprocessType == '特征生成':
            if preprocessName == '序列化':
                data = features_construction.padSequence(data, params, type)

        elif preprocessType == '标签映射':
            if preprocessName == '单标签数值映射':
                data = label_encoder.single_label_encoder(data, params, type)
            elif preprocessName == '序列BIO':
                data = label_encoder.BIO_label_encoder(data, params, type)

        elif preprocessType == '特征选择':
            if preprocessName == '方差选择':
                data = statistics.variance(data, params, type)
            elif preprocessName == '相关系数':
                data = statistics.correlationCoefficient(data, params, type)
            elif preprocessName == '卡方检验':
                data = statistics.ChiSquareTest(data, params, type)
            elif preprocessName == '多元高斯':
                data = statistics.MultivariateGauss(data, params, type)
            elif preprocessName == '多元高斯':
                data = statistics.PearsonCoefficient(data, params, type)

        elif preprocessType == '自定义算子':
            code = Operator.objects(operatorName=preprocessName).first().code
            print(code)
            data = operatorRunUtil(code, datasetID)
            print(data)

    return data


def cut(data, params, type, master=-1):
    if master == -1:
        data = base_methods.cut(data, params, type)
    else:
        data = base_methods.cut_spark(data, params, type, master)
    return data


def postagging(data, params, type, master=-1):
    if master == -1:
        data = base_methods.postagging(data, params, type)
    else:
        data = base_methods.postagging_spark(data, params, type, master)
    return data


def stopwords(data, params, type, master=-1):
    stopwordsFileName = params['list']
    stopwordsList = stopwordsListReader(stopwordsFileName)
    if master == -1:
        data = base_methods.stopwords(data, {'tool': stopwordsList, 'from': '分词'}, type)
    else:
        data = base_methods.stopwords_spark(data, {'tool': stopwordsList, 'from': '分词'}, type, master)
    return data
