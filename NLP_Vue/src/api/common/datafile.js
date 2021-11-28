import request from '@/utils/request'
import store from '@/store'

// 某个数据文件信息更新
export function datafileInfoUpdate(data) {
  return request({
    url: '/common/datafile/datafiles/ID',
    method: 'put',
    data: data,
    headers: { 'Authorization': 'Bearer ' + store.state.user.token }
  })
}

// 数据文件生成（拷贝）
export function datafileCopy(data) {
  return request({
    url: '/common/datafile/datafiles',
    method: 'post',
    data: data,
    headers: { 'Authorization': 'Bearer ' + store.state.user.token }
  })
}
