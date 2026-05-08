import request from '@/utils/request'

// サービス名
const server = "/business"

// 活動情報一覧を取得
export function listActivity(query) {
  return request({
    url: `/business/activity/list`,
    method: 'post',
    data: query
  })
}

// 活動情報詳細を取得
export function getActivity(activityNo) {
  return request({
    url: `/business/activity/${activityNo}`,
    method: 'get'
  })
}

// 活動情報を追加
export function addActivity(data) {
  return request({
    url: `/business/activity`,
    method: 'post',
    data: data
  })
}

// 活動情報を更新
export function updateActivity(data) {
  return request({
    url: `/business/activity`,
    method: 'put',
    data: data
  })
}

// 活動情報を削除
export function delActivity(activityNo) {
  return request({
    url: `/business/activity/${activityNo}`,
    method: 'delete'
  })
}
