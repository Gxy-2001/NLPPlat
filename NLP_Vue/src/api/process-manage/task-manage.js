import request from '@/utils/request'
import store from '@/store'

// 某个数据集预处理列表获取
export function tasksFetch(query) {
  return request({
    url: '/process-manage/task/tasks',
    method: 'get',
    params: query,
    headers: { 'Authorization': 'Bearer ' + store.state.user.token }
  })
}
