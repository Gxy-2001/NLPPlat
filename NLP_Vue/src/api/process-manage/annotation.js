import request from '@/utils/request'
import store from '@/store'

// 某个数据集标注任务配置获取
export function fetchTags(query) {
  return request({
    url: '/process-manage/annotation/datasets/ID/annotation/config',
    method: 'get',
    params: query,
    headers: { 'Authorization': 'Bearer ' + store.state.user.token }
  })
}

// 某个数据集标注任务配置创建
export function annotationConfig(data) {
  return request({
    url: '/process-manage/annotation/datasets/ID/annotation/config',
    method: 'post',
    data: data,
    headers: { 'Authorization': 'Bearer ' + store.state.user.token }
  })
}

// 某个数据集标注状态更新
export function completeAnnotationStatus(data) {
  return request({
    url: '/process-manage/annotation/datasets/ID/annotation/status',
    method: 'put',
    data: data,
    headers: { 'Authorization': 'Bearer ' + store.state.user.token }
  })
}

// 某个数据集标注进度获取
export function fetchAnnotationProgress(query) {
  return request({
    url: '/process-manage/annotation/datasets/ID/annotation/progress',
    method: 'get',
    params: query,
    headers: { 'Authorization': 'Bearer ' + store.state.user.token }
  })
}
