import request from '@/utils/request'

// サービス名
const server = "/emailPreview"

// メールプレビューリストを検索
export function listPreview(query) {
  return request({
    url: `/emailPreview/preview/list`,
    method: 'post',
    data: query
  })
}

// メールプレビューの詳細を検索
export function getPreview(id) {
  return request({
    url: `/emailPreview/preview/${id}`,
    method: 'get'
  })
}

// メールプレビューを追加
export function addPreview(data) {
  return request({
    url: `/emailPreview/preview`,
    method: 'post',
    data: data
  })
}

// メールプレビューを修正
export function updatePreview(data) {
  return request({
    url: `/emailPreview/preview`,
    method: 'put',
    data: data
  })
}

// メールプレビューを削除
export function delPreview(id) {
  return request({
    url: `/emailPreview/preview/${id}`,
    method: 'delete'
  })
}
// 一括でメールプレビューを追加
export function saveBatchEmailPreview(data) {
  return request({
    url: `/emailPreview/preview/addEmailPreview`,
    method: 'post',
    data:data
  })
}
// 一括でメールプレビューを検索
export function getEmailList(ids) {
  return request({
    url: `/emailPreview/preview/emailList`,
    method: 'post',
    data:ids
  })
}
// メールを送信
export function sendEmail(id) {
  return request({
    url: `/emailPreview/preview/sendEmail/${id}`,
    method: 'get'
  })
}
// メールプレビューリストを初期化
export function initEmailPreviewList(data) {
  return request({
    url: `${server}/preview/initEmailPreviewList`,
    method: 'post',
    data: data
  })
}