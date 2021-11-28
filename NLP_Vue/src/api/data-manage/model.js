import request from '@/utils/request'
import store from '@/store'

// 模型列表获取
export function modelsFetch(query) {
  return request({
    url: '/data-manage/model/models',
    method: 'get',
    params: query,
    headers: { 'Authorization': 'Bearer ' + store.state.user.token }
  })
}

// 某个模型信息修改
export function modelUpload(data) {
  return request({
    url: '/data-manage/model/models/ID',
    method: 'post',
    data: data,
    headers: { 'Authorization': 'Bearer ' + store.state.user.token }
  })
}

