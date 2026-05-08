import { mergeRecursive } from "@/utils/ymsc";
import DictOptions from './DictOptions'

/**
 * @classdesc 辞書メタデータ
 * @property {String} type タイプ
 * @property {Function} request リクエスト
 * @property {String} label ラベルフィールド
 * @property {String} value 値フィールド
 */
export default class DictMeta {
  constructor(options) {
    this.type = options.type
    this.request = options.request
    this.responseConverter = options.responseConverter
    this.labelField = options.labelField
    this.valueField = options.valueField
    this.lazy = options.lazy === true
  }
}


/**
 * 辞書メタデータを解析する
 * @param {Object} options
 * @returns {DictMeta}
 */
DictMeta.parse = function(options) {
  let opts = null
  if (typeof options === 'string') {
    opts = DictOptions.metas[options] || {}
    opts.type = options
  } else if (typeof options === 'object') {
    opts = options
  }
  opts = mergeRecursive(DictOptions.metas['*'], opts)
  return new DictMeta(opts)
}