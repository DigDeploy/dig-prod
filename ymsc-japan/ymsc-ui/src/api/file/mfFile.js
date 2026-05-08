import request from '@/utils/request'

// ファイルを検索
export function getFile(id) {
  return request({
    url: '/mfFile/get/' + id,
    method: 'get'
  })
}
