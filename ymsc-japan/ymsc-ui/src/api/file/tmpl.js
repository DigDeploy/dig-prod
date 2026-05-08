import request from '@/utils/request'

// ファイルインポート・エクスポートテンプレートリストを検索
export function listTmpl(query) {
  return request({
    url: '/oss/tmpl/list',
    method: 'get',
    params: query
  })
}

// ファイルインポート・エクスポートテンプレートの詳細を検索
export function getTmpl(id) {
  return request({
    url: '/oss/tmpl/' + id,
    method: 'get'
  })
}

// ファイルインポート・エクスポートテンプレートを追加
export function addTmpl(data) {
  return request({
    url: '/oss/tmpl',
    method: 'post',
    data: data
  })
}

// ファイルインポート・エクスポートテンプレートを修正
export function updateTmpl(data) {
  return request({
    url: '/oss/tmpl',
    method: 'put',
    data: data
  })
}

// ファイルインポート・エクスポートテンプレートを削除
export function delTmpl(id) {
  return request({
    url: '/oss/tmpl/' + id,
    method: 'delete'
  })
}
// ファイルをアップロード
export function uploadFileTemplate(query) {
  return request({
    url: '/oss/tmpl/uploadFile',
    method: 'post',
    data: query
  })
}