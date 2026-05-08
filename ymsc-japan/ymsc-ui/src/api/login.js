import request from '@/utils/request'

// ログイン処理
export function login(username, password, code, uuid) {
  const data = {
    username,
    password,
    code,
    uuid
  }
  return request({
    url: '/login',
    headers: {
      isToken: false
    },
    method: 'post',
    data: data
  })
}

export function checkLogin(data) {
  return request({
    url: '/checkLogin',
    headers: {
      isToken: false
    },
    method: 'post',
    data: data
  })
}
// 通知メール
export function sendEmail(data) {
  return request({
    url: '/sendEmail',
    headers: {
      isToken: false
    },
    method: 'post',
    data: data
  })
}

// パスワード設定メール
export function sendPassword(username) {
  const data = {
    username
  }
  return request({
    url: '/sendPassword',
    headers: {
      isToken: false
    },
    method: 'post',
    data: data
  })
}

// 初回ログインチェック
export function checkIsFirstLogin(loginUsername) {
  return request({
    url: '/checkIsFirstLogin/' + loginUsername,
    headers: {
      isToken: false
    },
    method: 'get'
  })
}

// ユーザーの詳細情報を取得
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

// パスワードをリセットする
export function updatePassword(username, password) {
  const data = {
    username,
    password
  }
  return request({
    url: '/updatePassWord',
    headers: {
      isToken: false
    },
    method: 'put',
    params: data
  })
}

// パスワードリセットユーザー確認
export function updatePwdUserBoo(username) {
  const data = {
    username
  }
  return request({
    url: '/updatePwdUserBoo',
    headers: {
      isToken: false
    },
    method: 'post',
    params: data
  })
}
