const messages = {
  IN00001: '登録しました。',
  IN00002: '修正しました。',
  IN00003: '削除しました。',
  IN00004: 'リフレッシュ成功',
  IN00005: 'インポート成功',
  IN00006: '実行成功',
  IN00007: '「?」のデータ項目を削除してもよろしいですか？',
}
export function getMessage(id, params) {
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
