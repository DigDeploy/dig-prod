<template>
  <div>
    <!-- 添付ファイル操作バー -->
    <el-row :gutter="10" class="mb8">
      <el-col :span="1.5" v-if="!readOnly">
        <el-button
          type="primary"
          plain
          icon="el-icon-upload"
          size="mini"
          @click="openUploadFile"
        >アップロード
        </el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="warning"
          plain
          icon="el-icon-download"
          size="mini"
          @click="downloadFile"
          :disabled="multiple"
        >ダウンロード
        </el-button>
      </el-col>
      <el-col :span="1.5" v-if="!readOnly">
        <el-button
          type="danger"
          plain
          icon="el-icon-delete"
          size="mini"
          @click="handleRemoveFile"
          :disabled="multiple"
        >削除
        </el-button>
      </el-col>
    </el-row>
    <!-- 添付ファイル -->
    <el-table
      :ref="refNodes.fileTable"
      :row-key="fileRowKey"
      :data="dataList"
      @selection-change="handleFileSelectionChange"
      :max-height="maxTableHeight"
      border
    >
      <!-- チェックボックス列 -->
      <el-table-column
        type="selection"
        width="55"
        header-align="center"
        align="center"
        :reserve-selection="true"
      />

      <!-- 行番号 -->
      <el-table-column
        label="No."
        type="index"
        align="center"
        width="55"
      />

      <el-table-column
        label="名前"
        :header-align="alignTableConfig.header"
        :align="alignTableConfig.text"
        min-width="140"
        prop="name"
        show-overflow-tooltip
      />
      <el-table-column
        label="説明"
        :header-align="alignTableConfig.header"
        :align="alignTableConfig.text"
        min-width="200"
        prop="description"
        show-overflow-tooltip
      >
        <template slot-scope="scope">
          <span v-if="readOnly">
            {{scope.row.description}}
          </span>
          <el-input
            v-else
            v-model="scope.row.description"
            placeholder=""
            maxlength="500"
          />
        </template>
      </el-table-column>

      <el-table-column
        label="サイズ"
        :header-align="alignTableConfig.header"
        :align="alignTableConfig.number"
        width="130"
        prop="size"
        show-overflow-tooltip
      />

      <el-table-column
        label="アップロード者"
        :header-align="alignTableConfig.header"
        :align="alignTableConfig.text"
        width="150"
        prop="userName"
        show-overflow-tooltip
      />
    </el-table>
    <!-- ファイルアップロードコンポーネント -->
    <upload-file
      :ref="refNodes.uploadFile"
      :visible.sync="uploadVisible"
      @callback="uploadFileCallback"
    />
    <!-- ファイルオンライン編集コンポーネント -->
    <el-dialog :title="title" :visible.sync="show" width="70%"  append-to-body>
      <vab-only-office :option='option' />
    </el-dialog>
  </div>
</template>

<script>
  import UploadFile from "./uploadFile";

  export default {
    name: "FileTable",
    components: {UploadFile},
    model: {
      prop: "dataList",
      event: "input"
    },
    props: {
      // 添付ファイルデータ
      dataList: {
        type: Array,
        required: true,
      },
      // 削除レコード
      removeRecords: {
        type: Array,
        default: () => []
      },
      // 読み取り専用
      readOnly: {
        type: Boolean,
        default: false
      },
      // テーブル高さ制限
      maxTableHeight: {
        type: Number,
        default: () => {
          // 高さ計算
          let height = document.body.clientHeight / 2;
          // テーブルの高さ（最小300px）
          return height < 300 ? 300 : height;
        }
      }
    },
    data() {
      return {
        // refノード
        refNodes: {
          fileTable: "fileTable_" + this.generateUuid,
          uploadFile: "uploadFile_" + this.generateUuid
        },

        // ファイルアップロード表示状態
        uploadVisible: false,

        // ID集合
        ids: [],
        // 選択配列
        multipleSelections: [],
        // 多肢選択無効
        multiple: true,
        // vabOnlyOfficeコンポーネントパラメータ設定参考
        option: {
          isEdit: true,
          lang: 'zh-CN',
          url: 'http://192.168.2.145:8500/example/download?fileName=new.docx',
          title: 'new.docx',
          fileType: 'docx',
          isPrint: false,
          user: {id: 'uid-1', name: 'John Smith'}
        },
        show: false,
      };
    },

    /* 作成 */
    created() {
    },

    /* 計算プロパティ */
    computed: {},

    /* メソッド関数 */
    methods: {
      getFile() {
        this.show = true
        // getAction('/file/selectById', { id: this.id }).then(res => {
        this.option.isEdit = true
        this.option.lang = 'zh-CN'
        this.option.url = 'http://47.109.54.18:9000/obm/2023/10/13/23464200武漢_20231013091045A024.pdf'
        this.option.title = '23464200武漢_20231013091045A024.pdf'
        this.option.key = '55555555'
        this.option.fileType = 'pdf'
        this.option.isPrint = false
        this.option.model = 'view'
        this.option.user = {id: 'uid-1', name: 'John Smith'}
        // })
      },
      close() {
        this.show = false
      },
      /* ------------- ファイル関連処理 ------------- */
      // 添付ファイルアップロードを開く
      openUploadFile() {
        this.uploadVisible = true;
      },

      // ファイルアップロードコールバック  [{uniqueKey：一意識別子, id: null, name: text, url: text, size: number, description: text, userName: text}]
      uploadFileCallback(callback) {
        // ファイルリストに追加
        this.dataList.push(...callback);
      },

      // ダウンロード処理
      downloadFile() {
        // ファイル未選択
        if (this.multiple) {
          this.$modal.msgWarning("ファイルを選択してください！");
        }
        // ダウンロード実行
        this.multipleSelections.forEach(el => {
          if (el.localUrl){
            let list = el.localUrl.split("/");
            let fileName = list[list.length-1];
            // ファイルパスパラメータ（download関数は3つのパラメータを必要とするため、これは2番目のパラメータ）
            let params = {
              resource:el.localUrl
            }
            // download関数は（YMSC）標準機能で、1番目のパラメータはリクエストURL（変更不要）、対応するControllerメソッドは若依で事前に封装されている
            download("/common/download/resource", params, fileName);
          }else {
            var url = el.url
            this.$download.downloadAs(url, el.name);
          }
        })
      },

      // ファイル削除
      handleRemoveFile() {
        // ファイル未選択
        if (this.multiple) {
          this.$modal.msgWarning("ファイルを選択してください！");
        }
        // 確認ダイアログ
        this.$modal
          .confirm("選択したファイルを削除してもよろしいですか？")
          .then(() => {
            this.$nextTick(() => {
              // 選択項目の削除
              this.selectionsRemove(
                this.multipleSelections,
                this.dataList,
                this.removeRecords,
                'uniqueKey'
              );
              // テーブルチェックボックスをクリア
              this.$refs[this.refNodes.fileTable].clearSelection();
            });
          })
          .then(() => {
            this.$modal.msgSuccess("削除しました。");
          })
          .catch((err) => console.log("ファイル削除エラー ", err));
      },

      /* ------------- テーブルチェックボックス ------------- */
      // ファイル多肢選択データ
      handleFileSelectionChange(selection) {
        this.ids = selection.map((item) => item.id);
        this.multipleSelections = selection;
        this.multiple = !selection.length;
      },

      /**
       * 選択項目の削除
       *
       * @param selections 選択項目
       * @param dataList 操作対象データ
       * @param removeRecord 削除レコード
       * @param judgeKey 判定フィールド
       */
      selectionsRemove(selections, dataList, removeRecord, judgeKey) {
        // 選択項目をループ（データ配列をループしないこと！）
        selections.forEach((item) => {
          // 検索対象フィールド
          let findField = item.id ? "id" : judgeKey;
          // インデックス検索
          let index = dataList.findIndex(
            (el) => el[findField] + "" === item[findField] + ""
          );
          // データ存在時
          if (index !== -1) {
            // プライマリキー判定（存在する場合はデータベースデータ、削除用にレコード）
            item.id && removeRecord.push(item.id);
            // ファイルデータを削除
            dataList.splice(index, 1);
          }
        });
      },

      /* ------------- 基本メソッド ------------- */
      // ファイルリストrowKey
      fileRowKey(row) {
        return row.id || '' + "_" + row.uniqueKey || '' + "_" + row.name;
      },

    },
  };
</script>

<style lang="scss" scoped>
</style>
