import request from '@/utils/request'

export function print() {
  return request({
    url: '/system/print/print-blank-invoice',
    method: 'get',
    responseType: 'blob' // 关键：告诉 axios 这是二进制数据
  })
}
// 旅費精算請求書PDF生成（新規）
export function printRyohiSeisan() {
  return request({
    url: '/system/print/print-ryohi-seisan',
    method: 'get',
    responseType: 'blob'
  })
}
// 出張報告書PDF生成（新規）
export function printShucchoHokokusho() {
  return request({
    url: '/system/print/print-shuccho-hokokusho',
    method: 'get',
    responseType: 'blob'
  })
}