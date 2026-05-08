<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" size="small" :inline="true" v-show="showSearch" label-width="68px">
      <el-form-item label="テンプレートコード" prop="bizCode">
        <el-input
          v-model="queryParams.bizCode"
          placeholder="テンプレートコードを入力してください"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="テンプレート名" prop="name">
        <el-input
          v-model="queryParams.name"
          placeholder="テンプレート名を入力してください"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">検索</el-button>
        <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">リセット</el-button>
      </el-form-item>
    </el-form>

    <el-row :gutter="10" class="mb8">
      <el-col :span="1.5">
        <el-button
          type="primary"
          plain
          icon="el-icon-plus"
          size="mini"
          @click="handleAdd()"
          v-hasPermi="['system:tmpl:add']"
        >新規作成
        </el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="danger"
          plain
          icon="el-icon-delete"
          size="mini"
          :disabled="multiple"
          @click="handleDelete"
          v-hasPermi="['system:tmpl:remove']"
        >削除
        </el-button>
      </el-col>

      <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table border v-loading="loading" :height="tableHeight(270)" :data="tmplList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center"/>
      <!--      <el-table-column label="メールテンプレートテーブル主キー" align="center" prop="id" />-->
      <el-table-column type="index" label="NO." align="center" width="50" prop="id">
        <template slot-scope="scope">
          <span>{{ (queryParams.pageNum - 1) * queryParams.pageSize + scope.$index + 1 }}</span>
        </template>
      </el-table-column>
      <el-table-column label="テンプレートコード" align="center" prop="bizCode" show-overflow-tooltip/>
      <el-table-column label="テンプレート名" align="center" prop="name" show-overflow-tooltip/>
<!--      <el-table-column label="ドキュメント名" align="center" prop="originalName"/>-->
      <el-table-column label="元ドキュメント名" align="center" prop="originalName" show-overflow-tooltip/>
      <el-table-column label="暗号化後ドキュメント名" align="center" prop="dummyName" show-overflow-tooltip/>
      <el-table-column label="順序" align="center" prop="tmplSort" show-overflow-tooltip/>
      <!--      <el-table-column label="保存パス" align="center" prop="fileDir" />-->
<!--      <el-table-column label="ドキュメントサイズ(バイト)" align="center" prop="fileSize"/>-->
<!--      <el-table-column label="アップローダー" align="center" prop="uploader"/>-->
      <el-table-column label="アップロード日時" align="center" prop="uploadTime" width="180">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.uploadTime, '{y}-{m}-{d}') }}</span>
        </template>
      </el-table-column>
<!--      <el-table-column label="備考" align="center" prop="remark"/>-->
      <!--      <el-table-column label="バージョン番号" align="center" prop="version" />-->
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="downloadFile(scope.row)"
          >ダウンロード
          </el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row)"
            v-hasPermi="['system:tmpl:edit']"
          >更新
          </el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['system:tmpl:remove']"
          >削除
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination
      v-show="total>0"
      :total="total"
      :page.sync="queryParams.pageNum"
      :limit.sync="queryParams.pageSize"
      @pagination="getList"
    />
    <!-- ポップアップ（新規作成/更新） -->
    <tmpl-upload v-if="tmplUploadVisible"  ref="tmplUpload" @refreshDataList="getList"></tmpl-upload>
  </div>
</template>

<script>
import {listTmpl, delTmpl} from "@/api/file/tmpl";
import TmplUpload from './tmpl-upload'
import {download} from "@/utils/request";
export default {
  name: "Tmpl",
  components:{
    TmplUpload
  },
  data() {
    return {
      // ローディングマスク
      loading: true,
      // 選択配列
      ids: [],
      // 単一選択でない場合無効
      single: true,
      // 複数選択でない場合無効
      multiple: true,
      // 検索条件を表示
      showSearch: true,
      // 総件数
      total: 0,
      // ファイルインポート/エクスポートテンプレートテーブルデータ
      tmplList: [],
      // ポップアップタイトル
      title: "",
      rowNum: 24,
      colNum: 24,
      // ポップアップを表示するかどうか
      open: false,
      addOrUpdateVisible: false,
      tmplUploadVisible: false,
      // 検索パラメータ
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        bizCode: null,
        name: null,
      },
      // フォームパラメータ
      form: {},
      // フォーム検証
      rules: {}
    };
  },
  created() {
    this.getList();
  },
  methods: {
    /** ファイルインポート/エクスポートテンプレートリストを検索 */
    getList() {
      this.loading = true;
      listTmpl(this.queryParams).then(response => {
        this.tmplList = response.rows;
        this.total = response.total;
        this.loading = false;
      });
    },
    // キャンセルボタン
    cancel() {
      this.open = false;
      this.reset();
    },
    // フォームリセット
    reset() {
      this.form = {
        id: null,
        bizCode: null,
        name: null,
        originalName: null,
        dummyName: null,
        fileDir: null,
        fileSize: null,
        uploader: null,
        uploadTime: null,
        remark: null,
        version: null,
        delFlag: null,
        createBy: null,
        createTime: null,
        updateBy: null,
        updateTime: null
      };
      this.resetForm("form");
    },
    /** 検索ボタン操作 */
    handleQuery() {
      this.queryParams.pageNum = 1;
      this.getList();
    },
    /** リセットボタン操作 */
    resetQuery() {
      this.resetForm("queryForm");
      this.handleQuery();
    },
    // チェックボックス選択データ
    handleSelectionChange(selection) {
      this.ids = selection.map(item => item.id)
      this.single = selection.length !== 1
      this.multiple = !selection.length
    },
    // 新規作成/更新
    handleAdd() {
      this.tmplUploadVisible = true
      this.$nextTick(() => {
        this.$refs.tmplUpload.init(null, null, null,null)
      })
    },
    handleUpdate(row) {
      this.tmplUploadVisible = true

      this.$nextTick(() => {
        this.$refs.tmplUpload.init(row.id, row.bizCode, row.name,row.tmplSort)
      })
    },
    downloadFile(row){
      if (row.localUrl){
        let list = row.localUrl.split("/");
        let fileName = list[list.length-1];
        // これはファイルパスパラメータで、download関数には3つのパラメータを渡す必要があるため、これは2番目のパラメータです
        let params = {
          resource:row.localUrl
        }
        // download関数はYMSCに標準搭載されているもので、1番目のパラメータはリクエストURLパスで変更不要で、このパス配下のControllerバックエンドメソッドもRuoYiにより作成・封入されています。
        download("/common/download/resource", params, fileName);
      }else {
        var url = row.fileUrl
        this.$download.downloadAs(url,row.originalName);
      }

    },

    /** 削除ボタン操作 */
    handleDelete(row) {
      const ids = row.id || this.ids;
      this.$modal.confirm('ファイルインポート/エクスポートテンプレートIDが「' + ids + '」のデータを削除してもよろしいですか？').then(function () {
        return delTmpl(ids);
      }).then(() => {
        this.getList();
        this.$modal.msgSuccess("削除しました。");
      }).catch(() => {
      });
    },
    /** エクスポートボタン操作 */
    handleExport() {
      this.download('system/tmpl/export', {
        ...this.queryParams
      }, `tmpl_${new Date().getTime()}.xlsx`)
    },

    /**
     * Excelファイルダウンロード
     *
     * @public
     * @param {Blob} blob ファイルオブジェクト
     * @param {string} fileName ファイル名
     * @returns {void}
     */
     downloadExcel(blob, fileName) {
      const a = document.createElement('a');
      a.download = fileName;
      a.href = URL.createObjectURL(blob);
      a.style.display = 'none';
      document.body.appendChild(a);
      a.click();
      URL.revokeObjectURL(a.href);
      document.body.removeChild(a);
    },
    readAsBinaryString(data) {
      // const name = decodeURI(res.headers['content-disposition'].split('filename=')[1]);
      const blob = new Blob([data], {type: 'application/vnd.ms-excel;charset=utf-8'}); // クラスファイルオブジェクトを作成：Blobオブジェクトは不変の生データのクラスファイルオブジェクトを表す
      // const blob = this.str2Blob(data, 'application/vnd.ms-excel;charset=utf-8'); // クラスファイルオブジェクトを作成：Blobオブジェクトは不変の生データのクラスファイルオブジェクトを表す
      const url = window.URL.createObjectURL(blob); // URL.createObjectURL(object)はFileオブジェクトまたはBlobオブジェクトを生成する
      let dom = document.createElement('a'); // 非表示のaタグを設定し、hrefを出力ストリームに設定し、downloadを設定
      dom.style.display = 'none';
      dom.href = url;
      dom.setAttribute('download', decodeURI("テストエクスポート")); // ブラウザにURLをナビゲートするのではなくダウンロードするよう指示し、ユーザーにローカルファイルとして保存するよう促す
      document.body.appendChild(dom);
      dom.click();
    },
    str2Blob(str, mime) {
      var arr = str.split(',')
      var bstr = atob(arr[0]),
        n = bstr.length,
        u8arr = new Uint8Array(n);
      while (n--) {
        u8arr[n] = bstr.charCodeAt(n);
      }
      return new Blob([u8arr], {
        type: mime
      });
    },
  }
};
</script>
