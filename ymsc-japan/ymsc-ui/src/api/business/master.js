import request from '@/utils/request'

// サービス名
const server = "/business"

// 権限通知マスタ詳細を取得
export function getRoleNoticeSetting(id) {
  return request({
    url: `/business/privilnotifmaster/${id}`,
    method: 'get'
  })
}
