import request from '@/utils/request'

// サービス名
const server = "/business"

// 得意先情報一覧を取得
export function listInfo(query) {
  return request({
    url: `/business/info/list`,
    method: 'post',
    data: query
  })
}

// 得意先情報詳細を取得
export function getInfo(customerNo) {
  return request({
    url: `/business/info/${customerNo}`,
    method: 'get'
  })
}

// 得意先情報を追加
export function addInfo(data) {
  return request({
    url: `/business/info`,
    method: 'post',
    data: data
  })
}

// 得意先情報を更新
export function updateInfo(data) {
  return request({
    url: `/business/info`,
    method: 'put',
    data: data
  })
}

// 得意先情報を削除
export function delInfo(customerNo) {
  return request({
    url: `/business/info/${customerNo}`,
    method: 'delete'
  })
}

// 得意先情報をExcelにエクスポート
export function exportInfo(query) {
  return request({
    url: `/business/info/export`,
    method: 'post',
    data: query
  })
}
