import request from '@/utils/request'
import store from '@/store'

// 算子列表获取
export function operatorsFetch(query) {
  return request({
    url: '/common/operator/operators',
    method: 'get',
    params: query,
    headers: { 'Authorization': 'Bearer ' + store.state.user.token }
  })
}

