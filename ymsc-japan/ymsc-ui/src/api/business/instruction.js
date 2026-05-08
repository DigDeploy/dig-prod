import request from '@/utils/request'

// サービス名
const server = "/business"

// 出張（伺）命令情報一覧を取得
export function listInstruction(query) {
  return request({
    url: `/business/instruction/list`,
    method: 'post',
    data: query
  })
}

// 出張（伺）命令情報詳細を取得
export function getInstruction(instructionNo) {
  return request({
    url: `/business/instruction/${instructionNo}`,
    method: 'get'
  })
}

// 出張（伺）命令情報を追加
export function addInstruction(data) {
  return request({
    url: `/business/instruction`,
    method: 'post',
    data: data
  })
}

// 出張（伺）命令情報を更新
export function updateInstruction(data) {
  return request({
    url: `/business/instruction`,
    method: 'put',
    data: data
  })
}

// 出張（伺）命令情報を削除
export function delInstruction(instructionNo) {
  return request({
    url: `/business/instruction/${instructionNo}`,
    method: 'delete'
  })
}

export function getNegotiationNo() {
  return request({
    url: `/business/instruction/getNegotiationNo`,
    method: 'get'
  })
}

export function getDict(key) {
  return request({
    url: `/business/instruction/getDict?key=`+key,
    method: 'get'
  })
}

export function getRoleMain(instructionNo) {
  return request({
    url: `/business/instruction/getRoleMain?instructionNo=${instructionNo}`,
    method: 'get'
  })
}

export function instructionPrint(instructionNo) {
  return request({
    url: '/business/instruction/instructionPrint?id='+instructionNo,
    method: 'get',
    responseType: 'blob' 
  })
}

export function reportPrint(instructionNo) {
  return request({
    url: '/business/instruction/reportPrint?id='+instructionNo,
    method: 'get',
    responseType: 'blob' 
  })
}

export function travelFeePrint(instructionNo) {
  return request({
    url: '/business/instruction/travelFeePrint?id='+instructionNo,
    method: 'get',
    responseType: 'blob' 
  })
}

// 出張（伺）命令情報をExcelにエクスポート
export function exportInstruction(query) {
  return request({
    url: '/business/instruction/export',
    method: 'post',
    data: query
  })
}