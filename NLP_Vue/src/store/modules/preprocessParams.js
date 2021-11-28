const state = {
  preprocessList: [{
    value: '基本预处理',
    label: '基本预处理',
    children: [{
      value: '分词',
      label: '分词'
    }, {
      value: '词性标注',
      label: '词性标注'
    }, {
      value: '去停用词',
      label: '去停用词'
    }, {
      value: '关键词提取',
      label: '关键词提取'
    }]
  }, {
    value: '向量模型',
    label: '向量模型',
    children: [{
      value: 'TFIDF',
      label: 'TFIDF'
    }, {
      value: 'Word2vec',
      label: 'Word2vec'
    }, {
      value: 'Doc2vec',
      label: 'Doc2vec'
    }, {
      value: 'GloVe',
      label: 'GloVe'
    }, {
      value: 'ELMo',
      label: 'ELMo'
    }, {
      value: 'BERT',
      label: 'BERT'
    }]
  }, {
    value: '特征生成',
    label: '特征生成',
    children: [{
      value: '序列化',
      label: '序列化'
    }]
  }, {
    value: '特征降维',
    label: '特征降维',
    children: [{
      value: 'PCA',
      label: 'PCA'
    }, {
      value: 'LDA',
      label: 'LDA'
    }]
  }, {
    value: '特征选择',
    label: '特征选择',
    children: [{
      value: '方差选择',
      label: '方差选择'
    }, {
      value: '相关系数',
      label: '相关系数'
    }, {
      value: '卡方检验',
      label: '卡方检验'
    }, {
      value: '互信息法',
      label: '互信息法'
    }, {
      value: '递归特征消除',
      label: '递归特征消除'
    }, {
      value: '惩罚项',
      label: '惩罚项'
    }, {
      value: '树模型',
      label: '树模型'
    }]
  }, {
    value: '标签映射',
    label: '标签映射',
    children: [{
      value: '单标签数值映射',
      label: '单标签数值映射'
    }, {
      value: '多标签数值映射',
      label: '多标签数值映射'
    }, {
      value: '序列BIO',
      label: '序列BIO'
    }, {
      value: '序列BIOES',
      label: '序列BIOES'
    }]
  }, {
    value: '自定义算子',
    label: '自定义算子'
  }],
  分词: {
    tool: 'jieba'
  },
  分词描述: '使用vectors属性的数据生成分词结果，并覆盖vectors属性',
  分词选项: {
    tool: ['jieba', 'SnowNLP', 'THULAC', 'HanLP']
  },
  分词参数说明: {
    tool: '分词工具'
  },
  去停用词: {
    list: ''
  },
  去停用词描述: '使用vectors属性的数据生成去停用词结果，并覆盖vectors属性',
  去停用词选项: {
    list: []
  },
  去停用词参数说明: {
    list: '停用词表'
  },
  词性标注: {
    tool: 'jieba'
  },
  词性标注描述: '使用vectors属性的数据生成去词性标注结果，并覆盖vectors属性',
  词性标注选项: {
    tool: ['jieba', 'SnowNLP', 'THULAC', 'HanLP']
  },
  词性标注参数说明: {
    tool: '词性标注工具'
  },
  关键词提取: {},
  关键词提取描述: '使用vectors属性的数据生成关键词提取结果，并覆盖vectors属性',
  TFIDF: {},
  Word2vec: {
    size: 100,
    alpha: 0.025,
    window: 5,
    min_count: 5,
    max_vocab_size: 'None',
    sample: 1e-3,
    seed: 1,
    workers: 3,
    min_alpha: 0,
    sg: 0,
    hs: 0,
    negative: 5,
    cbow_mean: 1,
    hashfxn: 'hash',
    iter: 5,
    trim_rule: 'None',
    sorted_vocab: 1,
    batch_words: 10000
  },
  Word2vec描述: '使用vectors属性的数据训练向量，向量文件存储至vectors属性',
  Word2vec参数说明: {
    size: '特征向量的维度',
    alpha: '学习速率',
    window: '当前词与预测词在一个句子中的最大距离',
    min_count: '最小词频，低于该词频的词语将被舍弃',
    max_vocab_size: '词向量构建期间的RAM限制',
    sample: '高频词汇的随机降采样的配置阈值',
    seed: '随机数发生器',
    workers: '训练的并行数',
    min_alpha: 0,
    sg: '设置训练算法，默认为0，对应CBOW算法,sg=1则采用skip-gram算法',
    hs: '如果为1则会采用hierarchica·softmax技巧。如果设置为0（defaut），则negative sampling会被使用',
    negative: '如果>0,则会采用negativesamping，用于设置多少个noise words',
    cbow_mean: '如果为0，则采用上下文词向量的和，如果为1（defau·t）则采用均值。只有使用CBOW的时候才起作用',
    hashfxn: '初始化权重。默认使用python的hash函数',
    iter: '迭代次数',
    trim_rule: '设置词汇表的整理规则，指定那些单词要留下，哪些要被删除',
    sorted_vocab: '如果为1（defaut），则在分配word index 的时候会先对单词基于频率降序排序',
    batch_words: '每一批的传递给线程的单词的数量，默认为10000'
  },
  Doc2vec: {
    dm: 1,
    dm_mean: 0,
    dm_concat: 0,
    dbow_words: 0,
    size: 100,
    alpha: 0.025,
    window: 5,
    min_count: 5,
    max_vocab_size: 'None',
    sample: 1e-3,
    seed: 1,
    workers: 3,
    min_alpha: 0,
    sg: 0,
    hs: 0,
    negative: 5,
    cbow_mean: 1,
    hashfxn: 'hash',
    iter: 5,
    trim_rule: 'None',
    sorted_vocab: 1,
    batch_words: 10000
  },
  Doc2vec参数说明: {
    dm: 1,
    dm_mean: 0,
    dm_concat: 0,
    dbow_words: 0,
    size: 100,
    alpha: 0.025,
    window: 5,
    min_count: 5,
    max_vocab_size: 'None',
    sample: 1e-3,
    seed: 1,
    workers: 3,
    min_alpha: 0,
    sg: 0,
    hs: 0,
    negative: 5,
    cbow_mean: 1,
    hashfxn: 'hash',
    iter: 5,
    trim_rule: 'None',
    sorted_vocab: 1,
    batch_words: 10000
  },
  GloVe: {
    MEMORY: 4.0,
    VOCAB_MIN_COUNT: 5,
    VECTOR_SIZE: 50,
    MAX_ITER: 15,
    WINDOW_SIZE: 15,
    NUM_THREADS: 8
  },
  序列化: {
    maxlen: 20
  },
  序列化描述: '使用embedding属性的向量文件对vectors属性的数据进行序列化，序列化后的id序列保存至feature属性，对应的向量矩阵保存至embedding_matrix',
  序列化参数说明: {
    maxlen: '每个文本向量最大长度'
  },
  单标签数值映射描述: '对vectors属性中的label按照分类任务将标签值映射为离散自然数，结果存储至label_id属性中'
}

const mutations = {
  SET_WORD2VEC_PARAMS: (state, params) => {
    state.Word2vec = params
  }
}

export default {
  namespaced: true,
  state,
  mutations
}
