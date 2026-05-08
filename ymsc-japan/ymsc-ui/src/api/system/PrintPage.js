import request from '@/utils/request'

// 上传并打印图片
export function printImage(query) {
  return request({
    url: '/system/PrintPage',
    method: 'get',
    params: query
  })
}

// // 打印指定路径的图片
// export function getRole(roleId) {
//   return request({
//     url: '/system/role/' + roleId,
//     method: 'get'
//   })
// }