import request from '@/utils/request'
import store from '@/store'

// 某个算子信息获取
export function operatorFetch(query) {
  return request({
    url: '/data-manage/operator/operators/ID',
    method: 'get',
    params: query,
    headers: { 'Authorization': 'Bearer ' + store.state.user.token }
  })
}

// 某个算子信息修改
export function operatorUpload(data) {
  return request({
    url: '/data-manage/operator/operators/ID',
    method: 'post',
    data: data,
    headers: { 'Authorization': 'Bearer ' + store.state.user.token }
  })
}

// 某个算子代码在线调试
export function codeRun(query) {
  return request({
    url: '/data-manage/operator/operators/ID/code',
    method: 'get',
    params: query,
    headers: { 'Authorization': 'Bearer ' + store.state.user.token }
  })
}

// 某个算子类别API文档获取
export function apiFetch(query) {
  return request({
    url: '/data-manage/operator/operatorTypes/ID/API',
    method: 'get',
    params: query,
    headers: { 'Authorization': 'Bearer ' + store.state.user.token }
  })
}
