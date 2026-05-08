module.exports = {
  /**
   * サイドバーテーマ ダークテーマはtheme-dark、ライトテーマはtheme-light
   */
  sideTheme: 'theme-light',

  /**
   * システムレイアウト設定を表示するかどうか
   */
  showSettings: false,

  /**
   * トップナビゲーションを表示するかどうか
   */
  topNav: false,

  /**
   * tagsViewを表示するかどうか
   */
  tagsView: false,

  /**
   * ヘッダーを固定するかどうか
   */
  fixedHeader: false,

  /**
   * ロゴを表示するかどうか
   */
  sidebarLogo: true,

  /**
   * 動的タイトルを表示するかどうか
   */
  dynamicTitle: false,

  /**
   * @type {string | array} 'production' | ['production', 'development']
   * @description エラーログコンポーネントを表示するかどうか。
   * デフォルトは本番環境でのみ使用され、開発環境でも使用したい場合は['production', 'development']を渡すことができます
   */
  errorLog: 'production'
}
