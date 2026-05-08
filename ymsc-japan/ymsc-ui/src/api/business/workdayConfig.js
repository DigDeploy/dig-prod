import request from '@/utils/request'

// サービス名
const server = "/business"

// 日付管理一覧を取得
export function listWorkdayConfig(query) {
  return request({
    url: `/business/workdayConfig/list`,
    method: 'post',
    data: query
  })
}

// 日付管理詳細を取得
export function getWorkdayConfig(date) {
  return request({
    url: `/business/workdayConfig/${date}`,
    method: 'get'
  })
}

// 日付管理を追加
export function addWorkdayConfig(data) {
  return request({
    url: `/business/workdayConfig`,
    method: 'post',
    data: data
  })
}

// 日付管理を更新
export function updateWorkdayConfig(data) {
  return request({
    url: `/business/workdayConfig`,
    method: 'put',
    data: data
  })
}

// 日付管理を削除
export function delWorkdayConfig(date) {
  return request({
    url: `/business/workdayConfig/${date}`,
    method: 'delete'
  })
}
