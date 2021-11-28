import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

/* Layout */
import Layout from '@/layout'
import ProcessManage from './modules/process-manage'
import DataManage from './modules/data-manage'
import Expand from './modules/expand'

/**
 * Note: sub-menu only appear when route children.length >= 1
 * Detail see: https://panjiachen.github.io/vue-element-admin-site/guide/essentials/router-and-nav.html
 *
 * hidden: true                   if set true, item will not show in the sidebar(default is false)
 * alwaysShow: true               if set true, will always show the root menu
 *                                if not set alwaysShow, when item has more than one children route,
 *                                it will becomes nested mode, otherwise not show the root menu
 * redirect: noRedirect           if set noRedirect will no redirect in the breadcrumb
 * name:'router-name'             the name is used by <keep-alive> (must set!!!)
 * meta : {
    roles: ['admin','editor']    control the page roles (you can set multiple roles)
    title: 'title'               the name show in sidebar and breadcrumb (recommend set)
    icon: 'svg-name'/'el-icon-x' the icon show in the sidebar
    noCache: true                if set true, the page will no be cached(default is false)
    affix: true                  if set true, the tag will affix in the tags-view
    breadcrumb: false            if set false, the item will hidden in breadcrumb(default is true)
    activeMenu: '/example/list'  if set path, the sidebar will highlight the path you set
  }
 */

/**
 * constantRoutes
 * a base page that does not have permission requirements
 * all roles can be accessed
 */
export const constantRoutes = [
  {
    path: '/redirect',
    component: Layout,
    hidden: true,
    children: [
      {
        path: '/redirect/:path(.*)',
        component: () => import('@/views/redirect/index')
      }
    ]
  },
  {
    path: '/login',
    component: () => import('@/views/login/index'),
    hidden: true
  },
  {
    path: '/auth-redirect',
    component: () => import('@/views/login/auth-redirect'),
    hidden: true
  },
  {
    path: '/404',
    component: () => import('@/views/error-page/404'),
    hidden: true
  },
  {
    path: '/401',
    component: () => import('@/views/error-page/401'),
    hidden: true
  },
  {
    path: '/',
    component: Layout,
    redirect: '/home',
    children: [
      {
        path: 'home',
        component: () => import('@/views/home/index'),
        name: 'Home',
        meta: {title: '主页', icon: 'dashboard', affix: true}
      }
    ]
  },
  ProcessManage,
  DataManage,
  Expand,

  {
    path: '/service',
    component: Layout,
    redirect: 'noRedirect',
    name: 'Serivce',
    children: [
      {
        path: 'user-center',
        component: () => import('@/views/service/user-center/index'),
        name: 'user-center',
        meta: {title: '个人中心', icon: 'people'}
      }
    ]
  },
  {
    path: '/community',
    component: Layout,
    redirect: '/community/index',
    meta: {
      title: '共享社区',
      icon: 'peoples'
    },
    children: [
      {
        path: 'community',
        component: () => import('@/views/community/list'),
        name: 'Community',
        meta: {title: '文章列表'}
      },
      {
        path: 'index',
        component: () => import('@/views/community/create'),
        name: 'Community',
        meta: {title: '发布文章'}
      }
    ]
  },
  {
    path: '/guide',
    component: Layout,
    redirect: '/guide/index',
    children: [
      {
        path: 'index',
        component: () => import('@/views/guide/index'),
        name: 'Guide',
        meta: {title: '使用指南', icon: 'guide', noCache: true}
      }
    ]
  }
]

/**
 * asyncRoutes
 * the routes that need to be dynamically loaded based on user roles
 */
export const asyncRoutes = [
  {
    path: '/admin',
    component: Layout,
    name: 'Admin',
    redirect: 'noRedirect',
    meta: {
      title: '系统管理',
      icon: 'lock',
      roles: ['admin']
    },
    children: [
      {
        path: 'user-manage',
        component: () => import('@/views/admin/user-manage/user-manage/index'),
        name: 'user-manage',
        meta: {title: '用户管理', icon: 'lock', noCache: true}
      }
    ]
  },

  // 404 page must be placed at the end !!!
  {path: '*', redirect: '/404', hidden: true}
]

const createRouter = () => new Router({
  // mode: 'history', // require service support
  scrollBehavior: () => ({y: 0}),
  routes: constantRoutes
})

const router = createRouter()

// Detail see: https://github.com/vuejs/vue-router/issues/1234#issuecomment-357941465
export function resetRouter() {
  const newRouter = createRouter()
  router.matcher = newRouter.matcher // reset router
}

export default router
