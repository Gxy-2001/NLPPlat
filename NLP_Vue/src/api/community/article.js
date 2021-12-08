import request from '@/utils/request'
import store from "@/store";

export function fetchList(query) {
  return request({
    url: '/service/article/list',
    method: 'get',
    params: query,
    headers: {'Authorization': 'Bearer ' + store.state.user.token}
  })
}

export function fetchArticle(id) {
  return request({
    url: '/service/article/detail',
    method: 'get',
    params: {id}
  })
}


export function createArticle(data) {
  return request({
    url: '/service/article/create',
    method: 'post',
    data
  })
}

