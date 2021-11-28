import request from '@/utils/request'
import store from '@/store'

// 某个数据集某条向量更改
export function featuresSplit(data) {
  return request({
    url: '/process-manage/model-train/datasets/ID/features',
    method: 'patch',
    data: data,
    headers: { 'Authorization': 'Bearer ' + store.state.user.token }
  })
}

// 某个数据集模型修改
export function modelUpdate(data) {
  return request({
    url: '/process-manage/model-train/datasets/ID/model',
    method: 'put',
    data: data,
    headers: { 'Authorization': 'Bearer ' + store.state.user.token }
  })
}

// 某个数据集模型运行
export function modelRun(data) {
  return request({
    url: '/process-manage/model-train/datasets/ID/model',
    method: 'patch',
    data: data,
    headers: { 'Authorization': 'Bearer ' + store.state.user.token }
  })
}

// 某个训练模型代码修改
export function codeUpdate(data) {
  return request({
    url: '/process-manage/model-train/trainedmodels/ID/code',
    method: 'put',
    data: data,
    headers: { 'Authorization': 'Bearer ' + store.state.user.token }
  })
}

// 某个数据集模型下载
export function trainedModelDownload(query) {
  return request({
    url: '/process-manage/model-train/trainedmodels/ID/model',
    method: 'get',
    params: query,
    headers: { 'Authorization': 'Bearer ' + store.state.user.token }
  })
}

// 某个数据集模型运行
export function trainedModelRun(data) {
  return request({
    url: '/process-manage/model-train/trainedmodels/ID/model',
    method: 'put',
    data: data,
    headers: { 'Authorization': 'Bearer ' + store.state.user.token }
  })
}
