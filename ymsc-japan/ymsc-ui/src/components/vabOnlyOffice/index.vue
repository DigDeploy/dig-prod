<!--OnlyOffice エディター-->
<template>
  <div id='vabOnlyOffice'></div>
</template>

<script>
  export default {
    name: 'VabOnlyOffice',
    props: {
      option: {
        type: Object,
        default: () => {
          return {}
        },
      },
    },
    data() {
      return {
        doctype: '', // ドキュメントタイプ（word/spreadsheet/presentation）
        docEditor: null, // OnlyOfficeエディターインスタンス
      }
    },
    beforeDestroy() {
      console.log("beforeDestroy  onlyoffice")
      // エディターインスタンスが存在する場合は破棄
      if (this.docEditor !== null) {
        this.docEditor.destroyEditor();
        this.docEditor = null;
      }
    },
    watch: {
      option: {
        handler: function (n) {
          // エディター設定を更新
          this.setEditor(n)
          // ファイルタイプからドキュメントタイプを取得
          this.doctype = this.getFileType(n.fileType)
        },
        deep: true, // オブジェクトのネストされたプロパティ変更を監視
      },
    },
    mounted() {
      // option.urlが存在する場合はエディターを初期化
      if (this.option.url) {
        this.setEditor(this.option)
      }
    },
    methods: {
      beforeDestroy() {
        // エディターインスタンスが存在する場合は破棄
        if (this.docEditor !== null) {
          this.docEditor.destroyEditor();
          this.docEditor = null;
        }
      },
      async setEditor(option) {
        // 既存のエディターインスタンスを破棄
        if (this.docEditor !== null) {
          this.docEditor.destroyEditor();
          this.docEditor = null;
        }
        // ファイルタイプからドキュメントタイプを取得
        this.doctype = this.getFileType(option.fileType)
        
        // OnlyOfficeエディター設定コンフィグ
        let config = {
          document: {
            fileType: option.fileType, // ファイル拡張子
            key: option.key || '', // ドキュメント識別キー（省略可）
            title: option.title, // ドキュメント名
            permissions: {
              edit: option.isEdit, // 編集可不可：閲覧のみの場合はfalseを渡す
              print: option.isPrint, // 印刷可不可
              download: true, // ダウンロード可不可（固定で有効）
              // "fillForms": true,//フォーム記入可不可。modeをeditに設定した場合、ドキュメントエディターでのみ使用可能。デフォルトはedit/reviewパラメータの値と一致
              // "review": true //変更追跡可不可
            },
            url: option.url, // ファイル取得URL
          },
          documentType: this.doctype, // ドキュメントタイプ（word/spreadsheet/presentation）
          editorConfig: {
            callbackUrl: option.callbackUrl, // Word編集後保存時のコールバックURL。このAPIは自作が必要で、編集後のファイルを任意の場所に保存するために使用
            lang: option.lang, // 言語設定
            // カスタマイズ設定
            customization: {
              autosave: false, // 自動保存可不可
              chat: true, // チャット機能可不可
              comments: true, // コメント機能可不可
              help: false, // ヘルプ機能可不可
              // "hideRightMenu": false,//初回ロード時の右側メニュー表示/非表示。デフォルトはfalse（表示）
              plugins: true, // プラグイン機能可不可
            },
            // ユーザー情報
            user: {
              id: option.user.id, // ユーザーID
              name: option.user.name // ユーザー名
            },
            mode: option.model ? option.model : 'edit', // エディターモード（edit/review/viewなど）。デフォルトはedit
          },
          width: '100%', // エディター幅
          height: '800px', // エディター高さ
          token: option.token || '' // 認証トークン（省略可）
        }

        // eslint-disable-next-line no-undef,no-unused-vars
        // OnlyOfficeエディターインスタンスを生成（DOM要素ID: vabOnlyOffice）
        this.docEditor = new DocsAPI.DocEditor('vabOnlyOffice', config)

      },
      // ファイル拡張子からドキュメントタイプを判定
      getFileType(fileType) {
        let docType = ''
        // Word系ファイル拡張子リスト
        let fileTypesDoc = [
          'doc', 'docm', 'docx', 'dot', 'dotm', 'dotx', 'epub', 'fodt', 'htm', 'html', 'mht', 'odt', 'ott', 'pdf', 'rtf', 'txt', 'djvu', 'xps',
        ]
        // スプレッドシート系ファイル拡張子リスト
        let fileTypesCsv = [
          'csv', 'fods', 'ods', 'ots', 'xls', 'xlsm', 'xlsx', 'xlt', 'xltm', 'xltx',
        ]
        // プレゼンテーション系ファイル拡張子リスト
        let fileTypesPPt = [
          'fodp', 'odp', 'otp', 'pot', 'potm', 'potx', 'pps', 'ppsm', 'ppsx', 'ppt', 'pptm', 'pptx',
        ]
        
        // 拡張子に応じてドキュメントタイプを設定
        if (fileTypesDoc.includes(fileType)) {
          docType = 'word'
        }
        if (fileTypesCsv.includes(fileType)) {
          docType = 'spreadsheet'
        }
        if (fileTypesPPt.includes(fileType)) {
          docType = 'presentation'
        }
        return docType
      }
    },
  }
</script>