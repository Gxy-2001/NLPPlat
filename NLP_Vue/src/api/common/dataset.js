import request from '@/utils/request'
import store from '@/store'

// 数据集列表获取
export function datasetListFetch(query) {
  return request({
    url: '/common/dataset/datasets',
    method: 'get',
    params: query,
    headers: { 'Authorization': 'Bearer ' + store.state.user.token }
  })
}

// 数据集生成（拷贝）
export function datasetCopy(data) {
  return request({
    url: '/common/dataset/datasets',
    method: 'post',
    data: data,
    headers: { 'Authorization': 'Bearer ' + store.state.user.token }
  })
}

// 某个数据集信息获取
export function datasetInfoFetch(params) {
  return request({
    url: '/common/dataset/datasets/ID',
    method: 'get',
    params: params,
    headers: { 'Authorization': 'Bearer ' + store.state.user.token }
  })
}

// 某个数据集信息更新
export function datasetInfoUpdate(data) {
  return request({
    url: '/common/dataset/datasets/ID',
    method: 'put',
    data: data,
    headers: { 'Authorization': 'Bearer ' + store.state.user.token }
  })
}

// 某个数据集名称、描述信息更新
export function datasetInfoVerify(data) {
  return request({
    url: '/common/dataset/datasets/ID',
    method: 'patch',
    data: data,
    headers: { 'Authorization': 'Bearer ' + store.state.user.token }
  })
}

// 某个数据集删除
export function datasetDelete(data) {
  return request({
    url: '/common/dataset/datasets/ID',
    method: 'delete',
    data: data,
    headers: { 'Authorization': 'Bearer ' + store.state.user.token }
  })
}

// 某个数据集文本向量获取
export function datasetVectorsFetch(query) {
  return request({
    url: '/common/dataset/datasets/ID/vectors',
    method: 'get',
    params: query,
    headers: { 'Authorization': 'Bearer ' + store.state.user.token }
  })
}

// 某个数据集单个文本向量获取
export function datasetVectorFetch(query) {
  return request({
    url: '/common/dataset/datasets/ID/vector/ID',
    method: 'get',
    params: query,
    headers: { 'Authorization': 'Bearer ' + store.state.user.token }
  })
}

// 某个数据集某条向量更新
export function datasetVectorUpdate(query) {
  return request({
    url: '/common/dataset/datasets/ID/vectors/ID',
    method: 'put',
    params: query,
    headers: { 'Authorization': 'Bearer ' + store.state.user.token }
  })
}

// 某个数据集总量信息获取
export function datasetTotalInfoFetch(query) {
  return request({
    url: '/common/dataset/datasets/ID/totalInfo',
    method: 'get',
    params: query,
    headers: { 'Authorization': 'Bearer ' + store.state.user.token }
  })
}

// 部分数据集信息获取
export function datasetIDListFetch(query) {
  return request({
    url: '/common/dataset/datasets/IDs/info',
    method: 'get',
    params: query,
    headers: { 'Authorization': 'Bearer ' + store.state.user.token }
  })
}

// 某个数据集某个group的vectors
export function groupVectorsFetch(query) {
  return request({
    url: '/common/dataset/datasets/ID/group/vectors',
    method: 'get',
    params: query,
    headers: { 'Authorization': 'Bearer ' + store.state.user.token }
  })
}

// 某个数据集某个group的vectors更新
export function groupVectorsUpdate(data) {
  return request({
    url: '/common/dataset/datasets/ID/group/vectors',
    method: 'put',
    data: data,
    headers: { 'Authorization': 'Bearer ' + store.state.user.token }
  })
}
