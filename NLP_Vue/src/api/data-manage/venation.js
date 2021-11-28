import request from '@/utils/request'
import store from '@/store'

export function venationFetch(query) {
  return request({
    url: '/data-manage/venation',
    method: 'get',
    params: query,
    headers: { 'Authorization': 'Bearer ' + store.state.user.token }
  })
}
