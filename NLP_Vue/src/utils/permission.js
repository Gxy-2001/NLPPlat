import store from '@/store'

// 写权限判断
export function writePermission(username) {
  var roles = store.state.user.roles
  var loginUsername = store.state.user.username
  if ((roles.indexOf('admin') !== -1) || (loginUsername === username)) {
    return true
  }
  return false
}
