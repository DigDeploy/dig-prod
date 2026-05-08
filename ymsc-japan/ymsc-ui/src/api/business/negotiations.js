import request from '@/utils/request'

// サービス名
const server = "/business"

// 案件管理一覧を取得
export function listNegotiations(query) {
  return request({
    url: `/business/negotiations/list`,
    method: 'post',
    data: query
  })
}

export function businessTripList(query) {
  return request({
    url: `/business/negotiations/businessTripList`,
    method: 'post',
    data: query
  })
}

export function businessTripListByNegotiationNos(negotiationNos) {
  return request({
    url: `/business/negotiations/businessTripListByNegotiationNos/${negotiationNos}`,
    method: 'get',
  })
}

export function getNegotiationAndActivityList(query) {
  return request({
    url: `/business/negotiations/getNegotiationAndActivityList`,
    method: 'post',
    data: query
  })
}

// 案件管理詳細を取得
export function getNegotiations(negotiationNo, subNumber) {
  return request({
    url: `/business/negotiations/${negotiationNo}/${subNumber}`,
    method: 'get'
  })
}

// 案件管理を追加
export function addNegotiations(data) {
  return request({
    url: `/business/negotiations`,
    method: 'post',
    data: data
  })
}

// 案件管理を更新
export function updateNegotiations(data) {
  return request({
    url: `/business/negotiations`,
    method: 'put',
    data: data
  })
}

export function updateKari(data) {
  return request({
    url: `/business/negotiations/updateKari`,
    method: 'post',
    data: data
  })
}

// 案件管理を削除
export function delNegotiations(negotiationNo) {
  return request({
    url: `/business/negotiations/${negotiationNo}`,
    method: 'delete'
  })
}

// 获取最新子番
export function getLatestSubNumber(negotiationNo) {
  return request({
    url: `/business/negotiations/getLatestSubNumber/${negotiationNo}`,
    method: 'get'
  })
}

// 最新改定番号取得
export function getKaiteiNumber(kaiteiNo) {
  return request({
    url: `/business/negotiations/getKaiteiNumber/${kaiteiNo}`,
    method: 'get'
  })
}

// 案件管理をExcelにエクスポート
export function exportNegotiations(query) {
  return request({
    url: `/business/negotiations/export`,
    method: 'post',
    data: query
  })
}
