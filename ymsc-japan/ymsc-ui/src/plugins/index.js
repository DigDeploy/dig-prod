import tab from './tab'
import auth from './auth'
import cache from './cache'
import modal from './modal'
import download from './download'
import message from './message'

export default {
  install(Vue) {
    // タブ操作
    Vue.prototype.$tab = tab
    // 認証オブジェクト
    Vue.prototype.$auth = auth
    // キャッシュオブジェクト
    Vue.prototype.$cache = cache
    // モーダルオブジェクト
    Vue.prototype.$modal = modal
    // ファイルダウンロード
    Vue.prototype.$download = download
    // メッセージ
    Vue.prototype.$YmMessage = message
  }
}