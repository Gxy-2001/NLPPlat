import request from '@/utils/request'
import store from '@/store'

export function getMoney(query) {
  return request({
    url: '/service/wallet/users/ID/money',
    method: 'get',
    params: query,
    headers: { 'Authorization': 'Bearer ' + store.state.user.token }
  })
}
