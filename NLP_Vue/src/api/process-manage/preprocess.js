import request from '@/utils/request'
import store from '@/store'

// 某个数据集预处理列表获取
export function preprocessStatusFetch(query) {
  return request({
    url: '/process-manage/pre-process/datasets/ID/preprocesses',
    method: 'get',
    params: query,
    headers: { 'Authorization': 'Bearer ' + store.state.user.token }
  })
}

// 某个数据集新增预处理步骤
export function preprocessAdd(data) {
  return request({
    url: '/process-manage/pre-process/datasets/ID/preprocesses',
    method: 'post',
    data: data,
    headers: { 'Authorization': 'Bearer ' + store.state.user.token }
  })
}

// 某个数据集预处理向量获取
export function preprocessVectorsFetch(query) {
  return request({
    url: '/process-manage/pre-process/datasets/ID/preprocesses/ID/vectors',
    method: 'get',
    params: query,
    headers: { 'Authorization': 'Bearer ' + store.state.user.token }
  })
}

// 某个数据集预处理数据获取
export function preprocessDataFetch(query) {
  return request({
    url: '/process-manage/pre-process/datasets/ID/preprocesses/ID/data',
    method: 'get',
    params: query,
    headers: { 'Authorization': 'Bearer ' + store.state.user.token }
  })
}

// 某个数据集预处理数据修改
export function preprocessUpload(query) {
  return request({
    url: '/process-manage/pre-process/datasets/ID/preprocesses/ID/data',
    method: 'post',
    params: query,
    headers: { 'Authorization': 'Bearer ' + store.state.user.token }
  })
}

// 某个数据集导出某个预处理步骤数据
export function preprocessDownload(query) {
  return request({
    url: '/process-manage/pre-process/datasets/ID/preprocesses/ID/download',
    method: 'get',
    params: query,
    headers: { 'Authorization': 'Bearer ' + store.state.user.token }
  })
}

// 某个数据集执行某个预处理步骤
export function preprocessDeal(data) {
  return request({
    url: '/process-manage/pre-process/datasets/ID/preprocesses/ID/status',
    method: 'put',
    data: data,
    headers: { 'Authorization': 'Bearer ' + store.state.user.token }
  })
}

