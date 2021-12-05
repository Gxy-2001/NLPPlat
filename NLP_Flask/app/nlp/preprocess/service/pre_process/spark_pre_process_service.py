# -*- coding: utf-8 -*-
from app.nlp.preprocess.service.pre_process_service import PreProcessService
from pyspark import SparkConf, SparkContext


class SparkPreProcessService(PreProcessService):
    def cut(self, data, type, master='local[4]'):
        sparkConf = SparkConf().setAppName('cut').setMaster(master)
        sc = SparkContext(conf=sparkConf)
        rdd = sc.parallelize(data['vectors'])
        data['vectors'] = rdd.map(lambda x: self.cut_item(data_item=x, type=type)).collect()
        sc.stop()
        return data

    def postagging(self, data, type, master='local[4]'):
        sparkConf = SparkConf().setAppName('postagging').setMaster(master)
        sc = SparkContext(conf=sparkConf)
        rdd = sc.parallelize(data['vectors'])
        data['vectors'] = rdd.map(lambda x: self.postagging_item(data_item=x, type=type)).collect()
        sc.stop()
        return data

    def stopwords(self, data, params, type, master='local[4]'):
        sparkConf = SparkConf().setAppName('stopwords').setMaster(master)
        sc = SparkContext(conf=sparkConf)
        rdd = sc.parallelize(data['vectors'])
        data['vectors'] = rdd.map(lambda x: self.stopwords_item(data_item=x, params=params, type=type)).collect()
        sc.stop()
        return data
