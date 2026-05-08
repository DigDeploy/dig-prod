/**
 * フレームワーク・システム関連ルーティング
 */
import Layout from '@/layout';

export const systemRelatedRoutes = [
  // システム管理 system
  {
    path: '/system/user-auth',
    component: Layout,
    hidden: true,
    permissions: ['system:user:edit'],
    children: [
      {
        path: 'role/:userId(\\d+)',
        component: (resolve) => require(['@/views/system/user/authRole'], resolve),
        name: 'AuthRole',
        meta: {title: 'ロールの割り当て', activeMenu: '/system/user'}
      }
    ]
  },
  {
    path: '/system/user-joushi',
    component: Layout,
    hidden: true,
    permissions: ['system:user:edit'],
    children: [
      {
        path: 'user/:userId(\\d+)',
        component: (resolve) => require(['@/views/system/user/joushiUser'], resolve),
        name: 'JoushiUser',
        meta: {title: '上司設定', activeMenu: '/system/user'}
      }
    ]
  },
  {
    path: '/system/role-auth',
    component: Layout,
    hidden: true,
    permissions: ['system:role:edit'],
    children: [
      {
        path: 'user/:roleId(\\d+)',
        component: (resolve) => require(['@/views/system/role/authUser'], resolve),
        name: 'AuthUser',
        meta: {title: 'ユーザー割当', activeMenu: '/system/role'}
      }
    ]
  },
  {
    path: '/system/dict-data',
    component: Layout,
    hidden: true,
    permissions: ['system:dict:list'],
    children: [
      {
        path: 'index/:dictId(\\d+)',
        component: (resolve) => require(['@/views/system/dict/data'], resolve),
        name: 'Data',
        meta: {title: '辞書データ', activeMenu: '/system/dict'}
      }
    ]
  },
  // 定期タスク monitor
  {
    path: '/monitor/job-log',
    component: Layout,
    hidden: true,
    permissions: ['monitor:job:list'],
    children: [
      {
        path: 'index/:jobId(\\d+)',
        component: (resolve) => require(['@/views/monitor/job/log'], resolve),
        name: 'JobLog',
        meta: {title: 'スケジューリングログ', activeMenu: '/monitor/job'}
      }
    ]
  },
  // コード生成 tool
  {
    path: '/tool/gen-edit',
    component: Layout,
    hidden: true,
    permissions: ['tool:gen:edit'],
    children: [
      {
        path: 'index/:tableId(\\d+)',
        component: (resolve) => require(['@/views/tool/gen/editTable'], resolve),
        name: 'GenEdit',
        meta: {title: '生成設定の修正', activeMenu: '/tool/gen'}
      }
    ]
  },
  {
    path: '/instruction/gen-edit',
    component: Layout,
    hidden: true,
    permissions: ['tool:gen:edit'],
    children: [
      {
        path: 'index/:tableId(\\d+)',
        component: (resolve) => require(['@/views/tool/gen/editTable'], resolve),
        name: 'GenEdit',
        meta: {title: '生成設定の修正', activeMenu: '/tool/gen'}
      }
    ]
  },
  {
    path: '/instruction/InstructionAddHome',
    component: Layout,
    hidden: true,
    permissions: ['business:instruction:add'],
    children: [
      {
        path: 'home/:negotiationNo/:subNumber/:activityNo?/:route?',
        component: (resolve) => require(['@/views/business/instruction/add'], resolve),
        name: 'InstructionAddHome',
        meta: {title: '命令書登録', activeMenu: '/instruction/instructionAdd'}
      }
    ]
  }
];
