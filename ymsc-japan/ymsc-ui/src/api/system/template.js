import request from '@/utils/request'

// サービス名
const server = "/system"

// システムメールテンプレートリストを検索
export function listTemplate(query) {
  return request({
    url: `/system/template/list`,
    method: 'post',
    data: query
  })
}

// システムメールテンプレートの詳細を検索
export function getTemplate(templateId) {
  return request({
    url: `/system/template/${templateId}`,
    method: 'get'
  })
}

// システムメールテンプレートを追加
export function addTemplate(data) {
  return request({
    url: `/system/template`,
    method: 'post',
    data: data
  })
}

// システムメールテンプレートを修正
export function updateTemplate(data) {
  return request({
    url: `/system/template`,
    method: 'put',
    data: data
  })
}

// システムメールテンプレートを削除
export function delTemplate(templateId) {
  return request({
    url: `/system/template/${templateId}`,
    method: 'delete'
  })
}