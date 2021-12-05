# -*- coding: utf-8 -*-

from app.nlp.preprocess.service.pre_process_service import PreProcessService


class CommonPreProcessService(PreProcessService):
    def cut(self, data, type, master=''):
        for data_item in data['vectors']:
            data_item = self.cut_item(data_item=data_item, type=type)
        return data

    def postagging(self, data, type, master=''):
        for data_item in data['vectors']:
            data_item = self.postagging_item(data_item=data_item, type=type)
        return data

    def stopwords(self, data, params, type, master=''):
        for data_item in data['vectors']:
            data_item = self.stopwords_item(data_item=data_item, params=params, type=type)
        return data

    def keywords(self, data, params, type, master=''):
        for data_item in data['vectors']:
            data_item = self.keywords_item(data_item=data_item, params=params, type=type)
        return data

