import Vue from 'vue'
import Router from 'vue-router'
/* Layout */
import Layout from '@/layout'
// モジュールルートを読み込む
import {modulesDynamicRoutes} from './modules';

Vue.use(Router)

/**
 * Note: ルート設定項目
 *
 * hidden: true                     // trueに設定すると、このルートはサイドバーに表示されません（例：401、loginページや編集ページ/edit/1など）
 * alwaysShow: true                 // ルートの下に宣言されたchildrenのルートが1つ以上の場合、自動的にネストされたモードになります--コンポーネントページなどの場合
 *                                  // 子ルートが1つの場合、その子ルートがルートルートとしてサイドバーに表示されます--ガイドページなどの場合
 *                                  // ルートの下のchildrenの宣言数に関係なくルートルートを表示したい場合は
 *                                  // alwaysShow: trueを設定すると、以前定義したルールが無視され、常にルートルートが表示されます
 * redirect: noRedirect             // noRedirectに設定すると、このルートはパンくずリストでクリックできなくなります
 * name:'router-name'               // ルートの名前を設定する必要があります。そうしないと、<keep-alive>を使用するときにさまざまな問題が発生します
 * query: '{"id": 1, "name": "ry"}' // ルートにアクセスするときのデフォルトのパラメータ
 * roles: ['admin', 'common']       // ルートにアクセスするためのロール権限
 * permissions: ['a:a:a', 'b:b:b']  // ルートにアクセスするためのメニュー権限
 * meta : {
    noCache: true                   // trueに設定すると、<keep-alive>にキャッシュされません（デフォルトはfalse）
    title: 'title'                  // サイドバーとパンくずリストに表示されるルートの名前を設定
    icon: 'svg-name'                // ルートのアイコンを設定し、対応するパスはsrc/assets/icons/svgです
    breadcrumb: false               // falseに設定すると、パンくずリストに表示されません
    activeMenu: '/system/user'      // ルートにこの属性を設定すると、対応するサイドバーが強調表示されます。
  }
 */

// 共通ルート
export const constantRoutes = [
  {
    path: '/redirect',
    component: Layout,
    hidden: true,
    children: [
      {
        path: '/redirect/:path(.*)',
        component: (resolve) => require(['@/views/redirect'], resolve),
      }
    ]
  },
  {
    path: '/login',
    component: (resolve) => require(['@/views/login'], resolve),
    hidden: true
  },
  {
    path: '/resetPassword',
    component: (resolve) => require(['@/views/resetPassword'], resolve),
    hidden: true
  },

  {
    path: '/register',
    component: (resolve) => require(['@/views/register'], resolve),
    hidden: true
  },
  {
    path: '/404',
    component: (resolve) => require(['@/views/error/404'], resolve),
    hidden: true
  },
  {
    path: '/401',
    component: (resolve) => require(['@/views/error/401'], resolve),
    hidden: true
  },
  {
    path: '',
    component: Layout,
    redirect: 'index',
    children: [
      {
        path: 'index',
        component: (resolve) => require(['@/views/index'], resolve),
        name: 'Index',
        meta: {title: 'ホーム', icon: 'dashboard', affix: true}
      }
    ]
  },
  {
    path: '/user',
    component: Layout,
    hidden: true,
    redirect: 'noredirect',
    children: [
      {
        path: 'profile',
        component: (resolve) => require(['@/views/system/user/profile/index'], resolve),
        name: 'Profile',
        meta: {title: 'パーソナルセンター', icon: 'user'}
      }
    ]
  }
];

// 動的ルート、ユーザー権限に基づいて動的に読み込まれます
export const dynamicRoutes = modulesDynamicRoutes;

// 連続して複数回ルートをクリックしたときのエラーを防止する
let routerPush = Router.prototype.push;
Router.prototype.push = function push(location) {
  return routerPush.call(this, location).catch(err => err)
}

export default new Router({
  mode: 'hash', // urlから#を削除
  scrollBehavior: () => ({y: 0}),
  routes: constantRoutes
})
