import request from '@/utils/request'
import store from '@/store'

// 用户列表获取
export function usersFetch(query) {
  return request({
    url: '/admin/user/users',
    method: 'get',
    params: query,
    headers: { 'Authorization': 'Bearer ' + store.state.user.token }
  })
}
