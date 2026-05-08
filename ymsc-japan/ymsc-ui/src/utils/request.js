import axios from 'axios'
import { Notification, MessageBox, Message, Loading } from 'element-ui'
import store from '@/store'
import { getToken } from '@/utils/auth'
import errorCode from '@/utils/errorCode'
import { tansParams, blobValidate } from "@/utils/ymsc";
import cache from '@/plugins/cache'
import { saveAs } from 'file-saver'
import { getMessageKeepTime } from '@/plugins/modal'

let downloadLoadingInstance;
// 再ログインを表示するかどうか
export let isRelogin = { show: false };

axios.defaults.headers['Content-Type'] = 'application/json;charset=utf-8'
// axiosインスタンスを作成
const service = axios.create({
  // axiosのリクエスト設定にbaseURLオプションがあり、リクエストURLの共通部分を表します
  baseURL: process.env.VUE_APP_BASE_API,
  // タイムアウト時間
  timeout: 300000
})

// requestインターセプター
service.interceptors.request.use(config => {
  // トークンを設定する必要があるかどうか
  const isToken = (config.headers || {}).isToken === false
  // データの重複送信を防止する必要があるかどうか
  const isRepeatSubmit = (config.headers || {}).repeatSubmit === false
  if (getToken() && !isToken) {
    config.headers['Authorization'] = 'Bearer ' + getToken() // 各リクエストにカスタムトークンを付与する、実際の状況に応じて適宜修正してください
  }
  // getリクエストのparamsパラメータをマッピング
  if (config.method === 'get' && config.params) {
    let url = config.url + '?' + tansParams(config.params);
    url = url.slice(0, -1);
    config.params = {};
    config.url = url;
  }
  if (!isRepeatSubmit && (config.method === 'post' || config.method === 'put')) {
    const requestObj = {
      url: config.url,
      data: typeof config.data === 'object' ? JSON.stringify(config.data) : config.data,
      time: new Date().getTime()
    }
    const sessionObj = cache.session.getJSON('sessionObj')
    if (sessionObj === undefined || sessionObj === null || sessionObj === '') {
      cache.session.setJSON('sessionObj', requestObj)
    } else {
      const s_url = sessionObj.url;                  // リクエストURL
      const s_data = sessionObj.data;                // リクエストデータ
      const s_time = sessionObj.time;                // リクエスト時間
      const interval = 100;                          // 間隔時間(ms)、この時間より短い場合は重複送信とみなします
      if (s_data === requestObj.data && requestObj.time - s_time < interval && s_url === requestObj.url) {
        const message = 'データは処理中です。重複して送信しないでください。';
        console.warn(`[${s_url}]: ` + message)
        return Promise.reject(new Error(message))
      } else {
        cache.session.setJSON('sessionObj', requestObj)
      }
    }
  }
  return config
}, error => {
    console.log(error)
    Promise.reject(error)
})

// レスポンスインターセプター
service.interceptors.response.use(res => {
    // ステータスコードが設定されていない場合は、デフォルトで成功状態とみなします
    const code = res.data.code || 200;
    // エラーメッセージを取得
    const msg = errorCode[code] || res.data.msg || errorCode['default']
    // バイナリデータの場合は直接返却します
    if(res.request.responseType ===  'blob' || res.request.responseType ===  'arraybuffer'){
      return res.data
    }
    if (code === 401) {
      if (!isRelogin.show) {
        isRelogin.show = true;
        MessageBox.confirm('ログインの有効期限が切れました。再ログインしますか？', 'システム通知', { confirmButtonText: '再ログイン', cancelButtonText: 'キャンセル', type: 'warning' }).then(() => {
          isRelogin.show = false;
          store.dispatch('LogOut').then(() => {
            location.href = '/index';
          })
      }).catch(() => {
        isRelogin.show = false;
      });
    }
      return Promise.reject('無効なセッション、またはセッションの期限が切れています。再ログインしてください。')
    } else if (code === 500) {
      Message({ message: msg, type: 'error' , duration: getMessageKeepTime() })
      return Promise.reject(new Error(msg))
    } else if (code === 601) {
      Message({ message: msg, type: 'warning' , duration: getMessageKeepTime() })
      return Promise.reject('error')
    } else if (code !== 200) {
      Notification.error({ title: msg , duration: getMessageKeepTime() })
      return Promise.reject('error')
    } else {
      return res.data
    }
  },
  error => {
    console.log('err' + error)
    let { message } = error;
    if (message == "Network Error") {
      message = "バックエンドインターフェースの接続に異常が発生しました";
    } else if (message.includes("timeout")) {
      message = "システムインターフェースのリクエストがタイムアウトしました";
    } else if (message.includes("Request failed with status code")) {
      message = "システムインターフェース" + message.substr(message.length - 3) + "に異常が発生しました";
    }
    Message({ message: message, type: 'error', duration: getMessageKeepTime() })
    return Promise.reject(error)
  }
)

// 汎用ダウンロード方法
export function download(url, params, filename, config) {
  downloadLoadingInstance = Loading.service({ text: "データをダウンロード中です。しばらくお待ちください", spinner: "el-icon-loading", background: "rgba(0, 0, 0, 0.7)", })
  return service.post(url, params, {
    transformRequest: [(params) => { return tansParams(params) }],
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    responseType: 'blob',
    ...config
  }).then(async (data) => {
    const isLogin = await blobValidate(data);
    if (isLogin) {
      const blob = new Blob([data])
      saveAs(blob, filename)
    } else {
      const resText = await data.text();
      const rspObj = JSON.parse(resText);
      const errMsg = errorCode[rspObj.code] || rspObj.msg || errorCode['default']
      Message.error({ message: errMsg, duration: getMessageKeepTime() });
    }
    downloadLoadingInstance.close();
  }).catch((r) => {
    console.error(r)
    Message.error({ message: 'ファイルのダウンロード中にエラーが発生しました。管理者に連絡してください！', duration: getMessageKeepTime() })
    downloadLoadingInstance.close();
  })
}

export default service
