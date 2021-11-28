import request from '@/utils/request'
import store from '@/store'

export function login(data) {
  return request({
    url: '/service/token',
    method: 'post',
    data: data
  })
}

export function register(data) {
  return request({
    url: '/service/user',
    method: 'post',
    data: data
  })
}

export function getInfo() {
  return request({
    url: '/service/user',
    method: 'get',
    headers: { 'Authorization': 'Bearer ' + store.state.user.token }
  })
}

export function getAllInfo() {
  return request({
    url: '/service/user/infos',
    method: 'get',
    headers: { 'Authorization': 'Bearer ' + store.state.user.token }
  })
}

export function modifyInfo(data) {
  return request({
    url: '/service/user/infos',
    method: 'patch',
    data: data,
    headers: { 'Authorization': 'Bearer ' + store.state.user.token }
  })
}

export function logout() {
  return request({
    url: '/service/token',
    method: 'delete',
    headers: { 'Authorization': 'Bearer ' + store.state.user.token }
  })
}
