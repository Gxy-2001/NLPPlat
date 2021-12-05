# -*- coding: utf-8 -*-
import jieba.posseg as posseg
from jieba import analyse

tfidf = analyse.extract_tags
import jieba
from app.nlp.preprocess.utils.pre_process_util import PreProcessUtil


class JiebaUtil(PreProcessUtil):
    def cut(self, text):
        list = []
        seg_list = jieba.cut(text)
        for word in seg_list:
            list.append(word)
        return list

    def postagging(self, text):
        dic_list = []
        seg_list = posseg.cut(text)
        for word, flag in seg_list:
            dic = {
                'word': word,
                'flag': flag
            }
            dic_list.append(dic)
        return dic_list

    def keywords(self, text):
        keywords = tfidf(text)
        return keywords
