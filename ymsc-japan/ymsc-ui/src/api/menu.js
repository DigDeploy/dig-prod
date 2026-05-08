import request from '@/utils/request'

// ルートを取得
export const getRouters = () => {
  return request({
    url: '/getRouters',
    method: 'get'
  })
}