import { mergeRecursive } from "@/utils/ymsc";
import dictConverter from './DictConverter'

export const options = {
  metas: {
    '*': {
      /**
       * 辞書リクエスト、メソッドシグネチャはfunction(dictMeta: DictMeta): Promiseです
       */
      request: (dictMeta) => {
        console.log(`load dict ${dictMeta.type}`)
        return Promise.resolve([])
      },
      /**
       * 辞書レスポンスデータコンバーター、メソッドシグネチャはfunction(response: Object, dictMeta: DictMeta): DictDataです
       */
      responseConverter,
      labelField: 'label',
      valueField: 'value',
    },
  },
  /**
   * デフォルトのラベルフィールド
   */
  DEFAULT_LABEL_FIELDS: ['label', 'name', 'title'],
  /**
   * デフォルトの値フィールド
   */
  DEFAULT_VALUE_FIELDS: ['value', 'id', 'uid', 'key'],
}

/**
 * 辞書をマッピングする
 * @param {Object} response 辞書データ
 * @param {DictMeta} dictMeta 辞書メタデータ
 * @returns {DictData}
 */
function responseConverter(response, dictMeta) {
  const dicts = response.content instanceof Array ? response.content : response
  if (dicts === undefined) {
    console.warn(`no dict data of "${dictMeta.type}" found in the response`)
    return []
  }
  return dicts.map(d => dictConverter(d, dictMeta))
}

export function mergeOptions(src) {
  mergeRecursive(options, src)
}

export default options