import request from '@/utils/request'

// サービス名
const server = "/business"

// 出張報告書情報一覧を取得
export function listBusinessTripReport(query) {
  return request({
    url: `/business/businessTripReport/list`,
    method: 'post',
    data: query
  })
}

// 出張報告書情報詳細を取得
export function getBusinessTripReport(reportNo) {
  return request({
    url: `/business/businessTripReport/${reportNo}`,
    method: 'get'
  })
}

// 出張報告書情報を追加
export function addBusinessTripReport(data) {
  return request({
    url: `/business/businessTripReport`,
    method: 'post',
    data: data
  })
}

// 出張報告書情報を更新
export function updateBusinessTripReport(data) {
  return request({
    url: `/business/businessTripReport`,
    method: 'put',
    data: data
  })
}

// 出張報告書情報を削除
export function delBusinessTripReport(reportNo) {
  return request({
    url: `/business/businessTripReport/${reportNo}`,
    method: 'delete'
  })
}
