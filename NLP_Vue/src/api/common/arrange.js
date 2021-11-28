import request from '@/utils/request'
import store from '@/store'

// 管道列表获取
export function arrangeFetch(query) {
  return request({
    url: '/common/arrange/arranges',
    method: 'get',
    params: query,
    headers: { 'Authorization': 'Bearer ' + store.state.user.token }
  })
}
