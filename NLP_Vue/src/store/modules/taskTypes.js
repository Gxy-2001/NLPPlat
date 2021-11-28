const state = {
  taskType: ['通用单文本分类', '情感分析/意图识别', '实体关系抽取', '文本关系分析', '文本摘要', '文本配对', '文本排序学习'],
  taskTypeFilter: [
    { text: '通用单文本分类', value: '通用单文本分类' },
    { text: '情感分析/意图识别', value: '情感分析/意图识别' },
    { text: '实体关系抽取', value: '实体关系抽取' },
    { text: '文本关系分析', value: '文本关系分析' },
    { text: '文本配对', value: '文本配对' },
    { text: '文本摘要', value: '文本摘要' },
    { text: '文本排序学习', value: '文本排序学习' }
  ]
}

const mutations = {

}

export default {
  namespaced: true,
  state,
  mutations
}
