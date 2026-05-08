const messages = {
  IN00001: '新規追加が成功しました',
  IN00002: '修正が成功しました',
  IN00003: '削除が成功しました',
  IN00004: 'リフレッシュが成功しました',
  IN00005: 'インポートが成功しました',
  IN00006: '実行が成功しました',
  IN00007: '「?」のデータ項目を削除してもよろしいですか？',
}
export default {
  messages,
  getMessage(id, params) {
    if (params && params.length > 0) {
      let msg = messages[id];
      params.forEach(e => {
        msg = msg.replace('?', e);
      });
      return msg;
    } else {
      return messages[id];
    }
  }
}