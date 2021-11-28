import request from '@/utils/request'
import store from '@/store'

// 训练模型列表获取
export function trainedmodelsFetch(query) {
  return request({
    url: '/data-manage/trainedmodel/trainedmodels',
    method: 'get',
    params: query,
    headers: { 'Authorization': 'Bearer ' + store.state.user.token }
  })
}

