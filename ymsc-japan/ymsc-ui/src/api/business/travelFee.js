import request from '@/utils/request'

// サービス名
const server = "/busTravelFee"

// 旅費精算請求書情報一覧を取得
export function listFee(query) {
  return request({
    url: `/busTravelFee/fee/list`,
    method: 'post',
    data: query
  })
}

// 旅費精算請求書情報詳細を取得
export function getFee(travelFeeId) {
  return request({
    url: `/busTravelFee/fee/${travelFeeId}`,
    method: 'get'
  })
}

// 旅費精算請求書情報詳細を取得
export function getDialogFee(travelFeeId) {
  return request({
    url: `/busTravelFee/fee/dialog/${travelFeeId}`,
    method: 'get'
  })
}

// 旅費精算請求書情報を追加
export function addFee(data) {
  return request({
    url: `/busTravelFee/fee`,
    method: 'post',
    data: data
  })
}

// 旅費精算請求書情報を更新
export function updateFee(data) {
  return request({
    url: `/busTravelFee/fee`,
    method: 'put',
    data: data
  })
}

// 旅費精算請求書情報を削除
export function delFee(travelFeeId) {
  return request({
    url: `/busTravelFee/fee/${travelFeeId}`,
    method: 'delete'
  })
}

