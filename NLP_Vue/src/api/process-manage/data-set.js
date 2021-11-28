import request from '@/utils/request'
import store from '@/store'

// 数据清洗
export function dataCleaning(data) {
  return request({
    url: '/process-manage/dataset/datasets/ID/vectors',
    method: 'post',
    data: data,
    headers: { 'Authorization': 'Bearer ' + store.state.user.token }
  })
}

// 数据集拆分
export function dataCut(data) {
  return request({
    url: '/process-manage/dataset/datasets/ID/vectors',
    method: 'patch',
    data: data,
    headers: { 'Authorization': 'Bearer ' + store.state.user.token }
  })
}
