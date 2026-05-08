import request from '@/utils/request'

// ヘッダーメニュー情報を取得
export function cmsList(data) {
  return request({
    url: '/business/main/cms/list',
    headers: {
      isToken: false
    },
    method: 'post',
    data: data
  })
}

// 登録処理
export function register(data) {
  return request({
    url: '/register',
    headers: {
      isToken: false
    },
    method: 'post',
    data: data
  })
}

// ユーザーの詳細情報を検索
export function getInfo() {
  return request({
    url: '/getInfo',
    method: 'get'
  })
}

// ログアウト処理
export function logout() {
  return request({
    url: '/logout',
    method: 'post'
  })
}

// 認証コードを取得
export function getCodeImg() {
  return request({
    url: '/captchaImage',
    headers: {
      isToken: false
    },
    method: 'get',
    timeout: 20000
  })
}