const state = {
  groupAnnotationMode: {
    '情感分析/意图识别': ['句子级'],
    '文本排序学习': ['单点标注', '列表标注'],
    '文本摘要': ['抽取式']
  },
  twoGroupAnnotationMode: {
    '文本配对': ''
  }
}

const mutations = {

}

export default {
  namespaced: true,
  state,
  mutations
}

