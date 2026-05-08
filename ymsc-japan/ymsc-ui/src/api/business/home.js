import request from '@/utils/request'

// サービス名
const server = "/business"

export function newNotice(query) {
  return request({
    url: `/business/home/newNotice`,
    method: 'post',
    data: query
  })
}

export function delNewNotice(query) {
  return request({
    url: `/business/home/delNewNotice`,
    method: 'post',
    data: query
  })
}

export function alertList(query) {
  return request({
    url: `/business/home/alertList`,
    method: 'post',
    data: query
  })
}

export function dailyReportList(query) {
  return request({
    url: `/business/home/dailyReportList`,
    method: 'post',
    data: query
  })
}

export function favoriteList(query) {
  return request({
    url: `/business/home/favoriteList`,
    method: 'post',
    data: query
  })
}

export function negotiationsList(query) {
  return request({
    url: `/business/home/negotiationsList`,
    method: 'post',
    data: query
  })
}

export function listNotice(query) {
  return request({
    url: `/business/home/listNotice`,
    method: 'post',
    data: query
  })
}

// ホーム画面件数統計を取得
export function getHomeCounts(userId, year) {
  return request({
    url: '/business/home/homeCounts',
    method: 'get',
    params: { userId,year}
  })
}

// 命令書新着通知一覧
export function instructionNoticeList(query) {
  return request({
    url: `/business/home/instructionNoticeList`,
    method: 'post',
    data: query
  })
}

// 命令書新着通知削除
export function delInstructionNotice(query) {
  return request({
    url: `/business/home/delInstructionNotice`,
    method: 'post',
    data: query
  })
}
