import request from '@/utils/request'
import store from '@/store'

// 部署生成
export function arrangeCreate(data) {
  return request({
    url: '/expand/arrange/arranges',
    method: 'post',
    data: data,
    headers: { 'Authorization': 'Bearer ' + store.state.user.token }
  })
}

// 某个部署信息获取
export function arrangeFetch(query) {
  return request({
    url: '/expand/arrange/arranges/ID',
    method: 'get',
    params: query,
    headers: { 'Authorization': 'Bearer ' + store.state.user.token }
  })
}

// 某个部署监控信息获取
export function arrangeMonitorFetch(query) {
  return request({
    url: '/expand/arrange/arrangeMonitors/ID',
    method: 'get',
    params: query,
    headers: { 'Authorization': 'Bearer ' + store.state.user.token }
  })
}
