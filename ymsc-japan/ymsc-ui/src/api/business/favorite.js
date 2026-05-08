import request from '@/utils/request'

// サービス名
const server = "/business"

// 案件お気に入り一覧を取得
export function listFavorite(query) {
  return request({
    url: `/business/favorite/list`,
    method: 'post',
    data: query
  })
}

// 案件お気に入り詳細を取得
export function getFavorite(negotiationNo) {
  return request({
    url: `/business/favorite/${negotiationNo}`,
    method: 'get'
  })
}

// 案件お気に入りを追加
export function addFavorite(data) {
  return request({
    url: `/business/favorite`,
    method: 'post',
    data: data
  })
}

// 案件お気に入りを更新
export function updateFavorite(data) {
  return request({
    url: `/business/favorite`,
    method: 'put',
    data: data
  })
}

// 一括追加お気に入り
export function addFavoriteBatch(data) {
  return request({
    url: '/business/favorite/batch',
    method: 'post',
    data: data
  })
}

// 案件お気に入りを削除
export function delFavorite(data) {
  return request({
    url: `/business/favorite/delete`,
    method: 'post',
    data: data
  })
}
