import request from '@/utils/request'
import store from '@/store'

// 管道生成
export function pipelineUpload(data) {
  return request({
    url: '/data-manage/pipeline/pipelines',
    method: 'post',
    data: data,
    headers: { 'Authorization': 'Bearer ' + store.state.user.token }
  })
}

// 某个管道预处理列表获取
export function preprocessForPipelineFetch(query) {
  return request({
    url: '/data-manage/pipeline/pipelines/ID/preprocesses',
    method: 'get',
    params: query,
    headers: { 'Authorization': 'Bearer ' + store.state.user.token }
  })
}
