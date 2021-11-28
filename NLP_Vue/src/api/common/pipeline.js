import request from '@/utils/request'
import store from '@/store'

// 管道列表获取
export function pipelinesFetch(query) {
  return request({
    url: '/common/pipeline/pipelines',
    method: 'get',
    params: query,
    headers: { 'Authorization': 'Bearer ' + store.state.user.token }
  })
}
