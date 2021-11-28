import Layout from '@/layout'

const componentsRouter = {
  path: '/expand',
  component: Layout,
  redirect: 'noRedirect',
  name: 'Expand',
  meta: {
    title: '拓展应用',
    icon: 'component'
  },
  children: [
    {
      path: 'arrange',
      component: () => import('@/views/expand/arrange/arrange/index'),
      name: 'arrange',
      meta: { title: '部署上线' }
    }, {
      path: 'arrange/arrange-manage/:arrangeid',
      component: () => import('@/views/expand/arrange/arrange-manage/index'),
      name: 'arrange-manage',
      hidden: true,
      meta: { title: '部署管理' }
    }
  ]
}

export default componentsRouter
