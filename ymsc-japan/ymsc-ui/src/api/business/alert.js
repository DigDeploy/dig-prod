import request from '@/utils/request'

// サービス名
const server = "/business"

// アラート一覧を取得
export function listAlert(query) {
  return request({
    url: `/business/alert/list`,
    method: 'post',
    data: query
  })
}

// アラート詳細を取得
export function getAlert(alertId) {
  return request({
    url: `/business/alert/${alertId}`,
    method: 'get'
  })
}

// アラートを追加
export function addAlert(data) {
  return request({
    url: `/business/alert`,
    method: 'post',
    data: data
  })
}

// アラートを更新
export function updateAlert(data) {
  return request({
    url: `/business/alert`,
    method: 'put',
    data: data
  })
}

// アラートを削除
export function delAlert(alertId) {
  return request({
    url: `/business/alert/${alertId}`,
    method: 'delete'
  })
}
