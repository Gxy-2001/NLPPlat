import request from '@/utils/request'
import store from '@/store'

// 模型列表获取
export function modelsFetch(query) {
  return request({
    url: '/common/model/models',
    method: 'get',
    params: query,
    headers: { 'Authorization': 'Bearer ' + store.state.user.token }
  })
}

// 训练模型列表获取
export function trainedmodelsFetch(query) {
  return request({
    url: '/common/model/trainedmodels',
    method: 'get',
    params: query,
    headers: { 'Authorization': 'Bearer ' + store.state.user.token }
  })
}

// 某个模型信息获取
export function modelFetch(query) {
  return request({
    url: '/common/model/models/ID',
    method: 'get',
    params: query,
    headers: { 'Authorization': 'Bearer ' + store.state.user.token }
  })
}

// 某个训练模型信息获取
export function trainedmodelFetch(query) {
  return request({
    url: '/common/model/trainedmodels/ID',
    method: 'get',
    params: query,
    headers: { 'Authorization': 'Bearer ' + store.state.user.token }
  })
}
