// import request from '@/utils/request'
//
// // サービス名
// const server = "/noticeBusiness"
//
// // 業務メッセージリストを検索
// export function listNoticeBusiness(query) {
//   return request({
//     url: `/noticeBusiness/noticeBusiness/list`,
//     method: 'post',
//     data: query
//   })
// }
//
// // 業務メッセージリストを検索（未読）
// export function listRead() {
//   return request({
//     url: `/noticeBusiness/noticeBusiness/listRead`,
//     method: 'post',
//     data: {}
//   })
// }
//
// // 業務メッセージの詳細を検索
// export function getNoticeBusiness(id) {
//   return request({
//     url: `/noticeBusiness/noticeBusiness/${id}`,
//     method: 'get'
//   })
// }
//
// // 業務メッセージを追加
// export function addNoticeBusiness(data) {
//   return request({
//     url: `/noticeBusiness/noticeBusiness`,
//     method: 'post',
//     data: data
//   })
// }
//
// // 業務メッセージを修正
// export function updateNoticeBusiness(data) {
//   return request({
//     url: `/noticeBusiness/noticeBusiness`,
//     method: 'put',
//     data: data
//   })
// }
//
// // 業務メッセージを削除
// export function delNoticeBusiness(id) {
//   return request({
//     url: `/noticeBusiness/noticeBusiness/${id}`,
//     method: 'delete'
//   })
// }
