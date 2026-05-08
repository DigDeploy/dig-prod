import { Message, MessageBox, Notification, Loading } from 'element-ui'
import { getDicts } from '@/api/system/dict/data'

let loadingInstance;
let messageKeepTime = 10 * 1000; // デフォルト10秒

// 辞書データをロード（ログイン成功後に呼び出す）
export async function loadDictData() {
  try {
    const response = await getDicts('message_keep_time');
    if (response.code === 200 && response.data && response.data.length > 0) {
      const dictValue = response.data[0].dictValue;
      messageKeepTime = parseInt(dictValue) * 1000;
    }
  } catch (error) {
    console.error('メッセージ保持時間の辞書データのロードに失敗しました:', error);
  }
}

// メッセージ保持時間を取得
export function getMessageKeepTime() {
  return messageKeepTime;
}

loadDictData();

export default {
  messageKeepTime: messageKeepTime,
  // メッセージ通知
  msg(content) {
    Message.info({ message: content, duration: messageKeepTime })
  },
  // エラーメッセージ
  msgError(content) {
    Message.error({ message: content, duration: messageKeepTime })
  },
  // 成功メッセージ
  msgSuccess(content) {
    Message.success({ message: content, duration: messageKeepTime })
  },
  // 警告メッセージ
  msgWarning(content) {
    Message.warning({ message: content, duration: messageKeepTime })
  },
  // ポップアップ通知
  alert(content) {
    MessageBox.alert(content, "システム通知")
  },
  // エラーポップアップ
  alertError(content) {
    MessageBox.alert(content, "システム通知", { type: 'error' })
  },
  // 成功ポップアップ
  alertSuccess(content) {
    MessageBox.alert(content, "システム通知", { type: 'success' })
  },
  // 警告ポップアップ
  alertWarning(content) {
    MessageBox.alert(content, "システム通知", { type: 'warning' })
  },
  // 通知表示
  notify(content) {
    Notification.info(content)
  },
  // エラー通知
  notifyError(content) {
    Notification.error(content);
  },
  // 成功通知
  notifySuccess(content) {
    Notification.success(content)
  },
  // 警告通知
  notifyWarning(content) {
    Notification.warning(content)
  },
  // 確認ウィンドウ
  confirm(content) {
    return MessageBox.confirm(content, "確認", {
      confirmButtonText: '確定',
      cancelButtonText: 'キャンセル',
      type: "warning",
    })
  },
  // 内容を提交
  prompt(content) {
    return MessageBox.prompt(content, "確認", {
      confirmButtonText: '確定',
      cancelButtonText: 'キャンセル',
      type: "warning",
    })
  },
  // マスクレイヤーを開く
  loading(content) {
    loadingInstance = Loading.service({
      lock: true,
      text: content || "データを読み込んでいます。しばらくお待ちください！",
      spinner: "el-icon-loading",
      background: "rgba(0, 0, 0, 0.7)",
    })
  },
  // マスクレイヤーを閉じる
  closeLoading() {
    loadingInstance.close();
  }
}
