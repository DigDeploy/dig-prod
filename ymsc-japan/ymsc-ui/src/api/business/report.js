import request from '@/utils/request'

// サービス名
const server = "/business"

// 日報情報一覧を取得
export function listReport(query) {
  return request({
    url: `/business/report/list`,
    method: 'post',
    data: query
  })
}

// 日報情報詳細を取得
export function getReport(dailyReportId) {
  return request({
    url: `/business/report/${dailyReportId}`,
    method: 'get'
  })
}

// 日報情報を追加
export function addReport(data) {
  return request({
    url: `/business/report`,
    method: 'post',
    data: data
  })
}

// 日報情報を更新
export function updateReport(data) {
  return request({
    url: `/business/report`,
    method: 'put',
    data: data
  })
}

// 日報情報を削除
export function delReport(dailyReportId) {
  return request({
    url: `/business/report/${dailyReportId}`,
    method: 'delete'
  })
}
