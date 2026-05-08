import request from '@/utils/request'
import { parseStrEmpty } from "@/utils/ymsc";

// ユーザーリストを検索
export function listUser(query) {
  return request({
    url: '/system/user/list',
    method: 'get',
    params: query
  })
}

// ユーザーの詳細を検索
export function getUser(userId) {
  return request({
    url: '/system/user/' + parseStrEmpty(userId),
    method: 'get'
  })
}

// ユーザーを追加
export function addUser(data) {
  return request({
    url: '/system/user',
    method: 'post',
    data: data
  })
}

// ユーザーを修正
export function updateUser(data) {
  return request({
    url: '/system/user',
    method: 'put',
    data: data
  })
}

// ユーザーを削除
export function delUser(userId) {
  return request({
    url: '/system/user/' + userId,
    method: 'delete'
  })
}

// ユーザーパスワードをリセット
export function resetUserPwd(userId, password) {
  const data = {
    userId,
    password
  }
  return request({
    url: '/system/user/resetPwd',
    method: 'put',
    data: data
  })
}

// ユーザー状態を変更
export function changeUserStatus(userId, status) {
  const data = {
    userId,
    status
  }
  return request({
    url: '/system/user/changeStatus',
    method: 'put',
    data: data
  })
}

// ユーザー個人情報を検索
export function getUserProfile() {
  return request({
    url: '/system/user/profile',
    method: 'get'
  })
}

// ユーザー個人情報を修正
export function updateUserProfile(data) {
  return request({
    url: '/system/user/profile',
    method: 'put',
    data: data
  })
}

// ユーザーパスワードをリセット
export function updateUserPwd(oldPassword, newPassword) {
  const data = {
    oldPassword,
    newPassword
  }
  return request({
    url: '/system/user/profile/updatePwd',
    method: 'put',
    params: data
  })
}

// ユーザーアバターをアップロード
export function uploadAvatar(data) {
  return request({
    url: '/system/user/profile/avatar',
    method: 'post',
    data: data
  })
}

// 付与済みロールを検索
export function getAuthRole(userId) {
  return request({
    url: '/system/user/authRole/' + userId,
    method: 'get'
  })
}

// ロール権限を保存
export function updateAuthRole(data) {
  return request({
    url: '/system/user/authRole',
    method: 'put',
    params: data
  })
}

// 部署ツリー構造を検索
export function deptTreeSelect() {
  return request({
    url: '/system/user/deptTree',
    method: 'get'
  })
}

// ユーザーID集合に基づいてユーザーリストを検索
export function echoList(userId) {
  return request({
    url: `/system/user/echoList/${userId}`,
    method: 'get'
  })
}

export function allocatedUserList(query) {
  return request({
    url: '/system/user/joushiUser/allocatedList',
    method: 'get',
    params: query
  })
}

export function unallocatedUserList(query) {
  return request({
    url: '/system/user/joushiUser/unallocatedList',
    method: 'get',
    params: query
  })
}

export function joushiUserCancel(data) {
  return request({
    url: '/system/user/joushiUser/cancel',
    method: 'put',
    data: data
  })
}

export function joushiUserCancelAll(data) {
  return request({
    url: '/system/user/joushiUser/cancelAll',
    method: 'put',
    params: data
  })
}
export function joushiUserSelectAll(data) {
  return request({
    url: '/system/user/joushiUser/selectAll',
    method: 'put',
    params: data
  })
}

// ログイン中のユーザーの部下を取り出す
export function selectBukaList(query) {
  return request({
    url: '/system/user/selectBukaList',
    method: 'get',
    params: query
  })
}

// ログイン中ユーザーの上司、ログイン中のユーザーと同じロールのユーザーを取得する
export function selectJoshiAndDeptUser(query) {
  return request({
    url: '/system/user/selectJoshiAndDeptUser',
    method: 'get',
    params: query
  })
}