import request from '@/utils/request'

// サービス名
const server = "/business"

// スライド画像リストを検索
export function listChart(query) {
  return request({
    url: `/business/chart/list`,
    method: 'post',
    data: query
  })
}

// スライド画像の詳細を検索
export function getChart(id) {
  return request({
    url: `/business/chart/${id}`,
    method: 'get'
  })
}

// スライド画像を追加
export function addChart(data) {
  return request({
    url: `/business/chart`,
    method: 'post',
    data: data
  })
}

// スライド画像を修正
export function updateChart(data) {
  return request({
    url: `/business/chart`,
    method: 'put',
    data: data
  })
}

// スライド画像を削除
export function delChart(id) {
  return request({
    url: `/business/chart/${id}`,
    method: 'delete'
  })
}