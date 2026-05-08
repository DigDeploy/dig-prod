import request from '@/utils/request'

// サービス名
const server = "/business"

// 見積情報一覧を取得
export function listQuotation(query) {
  return request({
    url: `/business/quotation/list`,
    method: 'post',
    data: query
  })
}

// 見積情報詳細を取得
export function getQuotation(quotationNo) {
  return request({
    url: `/business/quotation/${quotationNo}`,
    method: 'get'
  })
}

// 見積情報を追加
export function addQuotation(data) {
  return request({
    url: `/business/quotation`,
    method: 'post',
    data: data
  })
}

// 見積情報を更新
export function updateQuotation(data) {
  return request({
    url: `/business/quotation`,
    method: 'put',
    data: data
  })
}

// 見積情報を削除
export function delQuotation(quotationNo) {
  return request({
    url: `/business/quotation/${quotationNo}`,
    method: 'delete'
  })
}
