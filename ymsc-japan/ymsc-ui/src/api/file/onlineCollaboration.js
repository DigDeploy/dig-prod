import request from '@/utils/request'

// 一時的オンライン協力ファイル
export function tempOnlineCollaboration(params) {
  console.log(params)
  return request({
    url: '/onlineCollaboration/file/tempUrl',
    method: 'get',
    params: params
  })
}
