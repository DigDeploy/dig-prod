/**
 * テンプレートフィールドのフォーマット - 文字列value中の${xxx}をデータ内の対応するフィールド値に置換（例：${name}をdata内のnameの値に置換）
 * @param {*} value データを置換する必要がある文字列
 * @param {*} data 置換内容に対応するJSONデータ
 */
export const formatTemplateField = (value, data) => {
  debugger
  // テンプレート内容が空
  if (value === null || value === undefined) {
    return value;
  }

  // JSONデータdataからキー名とキー値をそれぞれ取り出して保存
  const keys = Object.keys(data);
  const dataList = keys.map(function (key) {
    return data[key];
  });
  // キー名をループ：文字列valueに対応するキー名が含まれているか判断。含まれていれば、対応するキー値に置換。
  for (let i = 0; i < keys.length; i++) {
    // 対応するキー値
    let text = dataList[i];
    // 空でない
    if (text !== null && text !== undefined && text.toString().length > 0) {
      // 置換
      value = value.replace(new RegExp("\\$\\{" + keys[i] + "\\}", "gm"), text);
    }
  }
  return value;
}