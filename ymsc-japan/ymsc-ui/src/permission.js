import router from './router'
import store from './store'
import { Message } from 'element-ui'
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'
import { getToken } from '@/utils/auth'
import { isRelogin } from '@/utils/request'

NProgress.configure({ showSpinner: false })

const whiteList = ['/login','/business/main/cms/list', '/auth-redirect', '/bind', '/register','/cms','/cms/index','/resetPassword']

router.beforeEach((to, from, next) => {
  NProgress.start()
  if (getToken()) {
    to.meta.title && store.dispatch('settings/setTitle', to.meta.title)
    /* トークンを持っている場合 */
    if (to.path === '/login') {
      next({ path: '/' })
      NProgress.done()
    } else {
      if (store.getters.roles.length === 0) {
        isRelogin.show = true
        // 現在のユーザーがuser_info情報をすでに取得したかどうかを判断
        store.dispatch('GetInfo').then(() => {
          isRelogin.show = false
          store.dispatch('GenerateRoutes').then(accessRoutes => {
            // roles権限に基づいてアクセス可能なルートテーブルを生成
            router.addRoutes(accessRoutes) // 動的にアクセス可能なルートテーブルを追加
            next({ ...to, replace: true }) // hack方法でaddRoutesが完了したことを保証
          })
        }).catch(err => {
            store.dispatch('LogOut').then(() => {
              Message.error(err)
              next({ path: '/' })
            })
          })
      } else {
        next()
      }
    }
  } else {
    // トークンを持っていない場合
    if (whiteList.indexOf(to.path) !== -1) {
      // ログイン不要のホワイトリストにある場合、直接進入
      next()
    } else {
      next(`/login?redirect=${to.fullPath}`) // それ以外はすべてログインページにリダイレクト
      NProgress.done()
    }
  }
})

router.afterEach(() => {
  NProgress.done()
})
