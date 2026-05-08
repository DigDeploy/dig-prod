import request from '@/utils/request'

// サービス名
const server = "/business"

// 案件履歴一覧を取得
export function listNegotiationsHistory(query) {
  return request({
    url: `/business/negotiationsHistory/list`,
    method: 'post',
    data: query
  })
}

// 案件履歴詳細を取得
export function getNegotiationsHistory(negotiationNo, subNumber, revisionNumber) {
  return request({
    url: `/business/negotiationsHistory/${negotiationNo}/${subNumber}/${revisionNumber}`,
    method: 'get'
  })
}

// 案件履歴を追加
export function addNegotiationsHistory(data) {
  return request({
    url: `/business/negotiationsHistory`,
    method: 'post',
    data: data
  })
}

// 案件履歴を更新
export function updateNegotiationsHistory(data) {
  return request({
    url: `/business/negotiationsHistory`,
    method: 'put',
    data: data
  })
}

// 案件履歴を削除
export function delNegotiationsHistory(negotiationNo) {
  return request({
    url: `/business/negotiationsHistory/${negotiationNo}`,
    method: 'delete'
  })
}

// 案件履歴をExcelにエクスポート
export function exportNegotiationsHistory(query) {
  return request({
    url: `/business/negotiationsHistory/export`,
    method: 'post',
    data: query
  })
}
