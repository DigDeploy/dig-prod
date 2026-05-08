import Vue from 'vue'

import Cookies from 'js-cookie'

import Element from 'element-ui'
import './assets/styles/element-variables.scss'

import '@/assets/styles/index.scss' // グローバルCSS
import '@/assets/styles/ymsc.scss' // ymsc CSS
import App from './App'
import store from './store'
import router from './router'
import directive from './directive' // ディレクティブ
import plugins from './plugins' // プラグイン
import {download} from '@/utils/request'

import './assets/icons' // アイコン
import './permission' // アクセス制御
import {getDicts} from "@/api/system/dict/data";
import {getConfigKey} from "@/api/system/config";
import {
  addRedStar,
  parseTime,
  resetForm,
  addDateRange,
  selectDictLabel,
  selectDictLabels,
  handleTree,
  transLineNo,
  generateUuid,
  tableHeight
} from "@/utils/ymsc";
import {checkPermi} from "@/utils/permission";
import {alignTableConfig} from "@/utils/ymConfig";
// ページネーションコンポーネント
import Pagination from "@/components/Pagination";
// カスタムテーブルツールコンポーネント
import RightToolbar from "@/components/RightToolbar"
// リッチテキストコンポーネント
import Editor from "@/components/Editor"
// ファイルアップロードコンポーネント
import FileUpload from "@/components/FileUpload"
// ファイルアップロードコンポーネント
import FileUploadMinio from "@/components/FileUploadMinio"
// 画像アップロードコンポーネント
import ImageUpload from "@/components/ImageUpload"
// 画像プレビューコンポーネント
import ImagePreview from "@/components/ImagePreview"
// 辞書タグコンポーネント
import DictTag from '@/components/DictTag'
// ヘッダータグコンポーネント
import VueMeta from 'vue-meta'
// 辞書データコンポーネント
import DictData from '@/components/DictData'
// ページタイトルバー
import TitleBar from '@/components/TitleBar'
// メールプレビューコンポーネント
import EmailPreview from '@/components/EmailPreview'
// グローバルにディープコピーを導入
import _ from 'lodash'
import FileTable from "@/components/FileTable";
import jaLocale from 'element-ui/lib/locale/lang/ja'
import locale from 'element-ui/lib/locale'
locale.use(jaLocale)

// グローバルデフォルト設定の修正：空白箇所をクリックしてもモーダルを閉じない
Element.Dialog.props.closeOnClickModal.default = false;
// グローバルデフォルト設定の修正：ESCキーを押してもモーダルを閉じない
Element.Dialog.props.closeOnPressEscape.default = true;
Element.TableColumn.props.resizable.default = false;

// グローバルメソッドのマウント
Vue.prototype._ = _
Vue.prototype.getDicts = getDicts
Vue.prototype.getConfigKey = getConfigKey
Vue.prototype.parseTime = parseTime
Vue.prototype.resetForm = resetForm
Vue.prototype.addDateRange = addDateRange
Vue.prototype.selectDictLabel = selectDictLabel
Vue.prototype.selectDictLabels = selectDictLabels
Vue.prototype.download = download
Vue.prototype.handleTree = handleTree
Vue.prototype.checkPermi = checkPermi
Vue.prototype.alignTableConfig = alignTableConfig
Vue.prototype.generateUuid = generateUuid
Vue.prototype.transLineNo = transLineNo
Vue.prototype.tableHeight = tableHeight
Vue.prototype.addRedStar = addRedStar

// オンライン共同作業を使用するかどうか
Vue.prototype.onlineCollaborationEnable = false

// グローバルコンポーネントのマウント
Vue.component('DictTag', DictTag)
Vue.component('Pagination', Pagination)
Vue.component('RightToolbar', RightToolbar)
Vue.component('Editor', Editor)
Vue.component('FileUpload', FileUpload)
Vue.component('FileUploadMinio', FileUploadMinio)
Vue.component('ImageUpload', ImageUpload)
Vue.component('ImagePreview', ImagePreview)
Vue.component('TitleBar', TitleBar)
Vue.component('FileTable', FileTable)
Vue.component('EmailPreview', EmailPreview)

Vue.use(directive)
Vue.use(plugins)
Vue.use(VueMeta)
DictData.install()

/**
 * If you don't want to use mock-server
 * you want to use MockJs for mock api
 * you can execute: mockXHR()
 *
 * Currently MockJs will be used in the production environment,
 * please remove it before going online! ! !
 */

Vue.use(Element, {
  size: Cookies.get('size') || 'medium' // set element-ui default size
})

Vue.config.productionTip = false

new Vue({
  el: '#app',
  router,
  store,
  render: h => h(App),
  data: function () {
    return {
      noticeNum: 0,   // 定義された変数
      notifications: []
    }
  },
})
