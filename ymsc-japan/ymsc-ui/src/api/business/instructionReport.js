import request from '@/utils/request'

// サービス名
const server = "/business"

// 出張報告書情報一覧を取得
export function listInstructionReport(query) {
  return request({
    url: `/business/instructionReport/list`,
    method: 'post',
    data: query
  })
}

// 出張報告書情報詳細を取得
export function getInstructionReport(reportNo) {
  return request({
    url: `/business/instructionReport/${reportNo}`,
    method: 'get'
  })
}

// 出張報告書情報を追加
export function addInstructionReport(data) {
  return request({
    url: `/business/instructionReport`,
    method: 'post',
    data: data
  })
}

// 出張報告書情報を更新
export function updateInstructionReport(data) {
  return request({
    url: `/business/instructionReport`,
    method: 'put',
    data: data
  })
}

// 出張報告書情報を削除
export function delInstructionReport(reportNo) {
  return request({
    url: `/business/instructionReport/${reportNo}`,
    method: 'delete'
  })
}
