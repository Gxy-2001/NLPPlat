import request from '@/utils/request'
import store from '@/store'

// 某个数据集执行批处理
export function batchRun(data) {
  return request({
    url: '/process-manage/batch-process/batch-datasets/ID/code',
    method: 'put',
    data: data,
    headers: { 'Authorization': 'Bearer ' + store.state.user.token }
  })
}
