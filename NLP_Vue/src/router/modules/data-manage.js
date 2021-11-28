/** When your routing table is too long, you can split it into small modules **/

import Layout from '@/layout'

const componentsRouter = {
  path: '/data-manage',
  component: Layout,
  redirect: 'noRedirect',
  name: 'DataManage',
  meta: {
    title: '数据管理',
    icon: 'documentation'
  },
  children: [
    {
      path: 'data-venation/:type/:nodeid',
      component: () => import('@/views/data-manage/data-venation/index'),
      name: 'data-venation',
      meta: { title: '数据脉络' }
    }, {
      path: 'operator-manage',
      component: () => import('@/views/data-manage/operator-manage/operator-manage/index'),
      name: 'operator-manage',
      meta: { title: '算子管理' }
    }, {
      path: 'operator-manage/codehub/:operatorid',
      component: () => import('@/views/data-manage/operator-manage/codehub/index'),
      name: 'operator-manage-codehub',
      hidden: true,
      meta: { title: '算子编辑' }
    }, {
      path: 'model-manage',
      component: () => import('@/views/data-manage/model-manage/model-manage/index'),
      name: 'model-manage',
      meta: { title: '模型管理' }
    }, {
      path: 'model-manage/codehub/:modelid',
      component: () => import('@/views/data-manage/model-manage/codehub/index'),
      name: 'model-manage-codehub',
      hidden: true,
      meta: { title: '模型编辑' }
    }, {
      path: 'resource-manage',
      component: () => import('@/views/data-manage/resource-manage/resource-manage/index'),
      name: 'resource-manage',
      meta: { title: '资源管理' }
    }, {
      path: 'pipeline-manage',
      component: () => import('@/views/data-manage/pipeline-manage/pipeline-manage/index'),
      name: 'pipeline-manage',
      meta: { title: '管道管理' }
    }, {
      path: 'pipeline-manage/pipeline-detail/:pipelineid',
      component: () => import('@/views/data-manage/pipeline-manage/pipeline-detail/index'),
      name: 'pipeline-detail',
      hidden: true,
      meta: { title: '管道详情' }
    }, {
      path: 'trainedmodel-manage',
      component: () => import('@/views/data-manage/trainedmodel-manage/trainedmodel-manage/index'),
      name: 'trainedmodel-manage',
      meta: { title: '训练模型管理' }
    }
  ]
}

export default componentsRouter
