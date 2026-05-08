/**
 * @classdesc 辞書データ
 * @property {String} label ラベル
 * @property {*} value ラベル
 * @property {Object} raw 生データ
 */
export default class DictData {
  constructor(label, value, raw) {
    this.label = label
    this.value = value
    this.raw = raw
  }
}