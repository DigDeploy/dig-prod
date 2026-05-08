<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" size="small" :inline="true" v-show="showSearch" label-width="108px">
      <el-form-item label="画像URL" prop="picture">
        <el-input
          v-model="queryParams.picture"
          placeholder="画像URLを入力してください"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="ルート" prop="picctureRoute">
        <el-input
          v-model="queryParams.picctureRoute"
          placeholder="ルートを入力してください"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="ソート" prop="sortId">
        <el-input
          v-model="queryParams.sortId"
          placeholder="ソート番号を入力してください"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="トップページ紹介" prop="text">
        <el-input
          v-model="queryParams.text"
          placeholder="トップページ紹介文を入力してください"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
    </el-form>

    <el-row :gutter="10" class="mb8">
      <el-col :span="1.5">
        <el-button
          type="primary"
          plain
          icon="el-icon-plus"
          size="mini"
          @click="handleAdd"
          v-hasPermi="['business:chart:add']"
        >新規作成</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="warning"
          plain
          icon="el-icon-download"
          size="mini"
          @click="handleExport"
          v-hasPermi="['business:chart:export']"
        >エクスポート</el-button>
      </el-col>
        <div style="float: right !important;">
            <el-button
                    type="primary"
                    icon="el-icon-search"
                    size="mini"
                    @click="handleQuery"
            >検索
            </el-button>
            <el-button icon="el-icon-refresh" size="mini" style="margin-right: 5px" @click="resetQuery">リセット
            </el-button>
        </div>
    </el-row>

    <el-table v-loading="loading" :data="chartList" border @selection-change="handleSelectionChange" ref="dataTable">
        <el-table-column label="No." type="index" width="55" :header-align="alignTableConfig.header" :align="alignTableConfig.lineNo" >
            <template slot-scope="scope">
                <span>{{(queryParams.pageNum - 1) * queryParams.pageSize + scope.$index + 1}}</span>
            </template>
        </el-table-column>
      <el-table-column label="画像URL" :header-align="alignTableConfig.header" :align="alignTableConfig.text" prop="picture" />
      <el-table-column label="ルート" :header-align="alignTableConfig.header" :align="alignTableConfig.text" prop="picctureRoute" />
      <el-table-column label="ソート" :header-align="alignTableConfig.header" :align="alignTableConfig.text" prop="sortId" />
      <el-table-column label="トップページ紹介" :header-align="alignTableConfig.header" :align="alignTableConfig.text" prop="text" />
      <el-table-column label="0スライド 1トップページ画像" :header-align="alignTableConfig.header" :align="alignTableConfig.text" prop="chartType" />
      <el-table-column label="備考" :header-align="alignTableConfig.header" :align="alignTableConfig.text" prop="remark" />
      <el-table-column label="操作" :header-align="alignTableConfig.header" :align="alignTableConfig.action" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row)"
            v-hasPermi="['business:chart:edit']"
          >編集</el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['business:chart:remove']"
          >削除</el-button>
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
  </div>
</template>

<script>
import { listChart, delChart, } from "@/api/business/chart";

export default {
  name: "Chart",
  data() {
    return {
      // 初回検索フラグ
      isFirstSearch: true,
      // ローディングマスク
      loading: true,
      // 選択ID配列
      ids: [],
      // 単一選択不可フラグ
      single: true,
      // 複数選択不可フラグ
      multiple: true,
      // 検索条件表示フラグ
      showSearch: true,
      // 総件数
      total: 0,
      // スライドテーブルデータ
      chartList: [],
      // 検索パラメータ
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        id: null,
        picture: null,
        picctureRoute: null,
        sortId: null,
        text: null,
        chartType: null,
      }
    };
  },

  /* コンポーネント活性化時 */
  activated() {
    // 削除しないでください
    if (!this.isFirstSearch) {
      this.reload();
    }
    this.isFirstSearch = false;
  },

  created() {
    this.getList();
  },

  methods: {
    // 再読み込み
    reload() {
        this.clearSelection();
        this.queryParams.pageNum = 1;
        this.getList();
    },

    // テーブル選択データクリア
    clearSelection() {
        this.$refs["dataTable"] && this.$refs["dataTable"].clearSelection();
    },

    /** スライドリスト検索 */
    getList() {
      this.loading = true;
      listChart(this.queryParams).then(response => {
        this.chartList = response.rows;
        this.total = response.total;
        this.loading = false;
      });
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

    // チェックボックス選択データ変更
    handleSelectionChange(selection) {
      this.ids = selection.map(item => item.id)
      this.single = selection.length!==1
      this.multiple = !selection.length
    },

    /** 詳細ボタン操作 */
    handleDetail() {
        // TODO ディレクトリルートを手動追加
        const router = "/chart/chartDetail/index/"+row.id;
        this.$router.push(router);
    },

    /** 新規作成ボタン操作 */
    handleAdd() {
        // TODO ディレクトリルートを手動追加
        const router = "/chart/chartAdd/index";
        this.$router.push(router);
    },

    /** 編集ボタン操作 */
    handleUpdate(row) {
      // TODO ディレクトリルートを手動追加
      const router = "/chart/chartEdit/index/"+row.id;
      this.$router.push(router);
    },

    /** 削除ボタン操作 */
    handleDelete(row) {
      const ids = row.id || this.ids;
      let that = this;
      that.$modal.confirm('スライドID「' + ids + '」のデータを削除してもよろしいですか？').then(function() {
      that.$modal.loading();
      delChart(ids).then(response => {
          that.getList();
          that.$modal.msgSuccess("削除成功");
        }).catch((err) => console.log(err))
                .finally(() => that.$modal.closeLoading());
      }).catch(() => {});
    },

    /** エクスポートボタン操作 */
    handleExport() {
      this.download('business/chart/export', {
        ...this.queryParams
      }, `chart_${new Date().getTime()}.xlsx`)
    }
  }
};
</script>