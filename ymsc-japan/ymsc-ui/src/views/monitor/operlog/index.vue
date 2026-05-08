<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" size="small" :inline="true" v-show="showSearch" label-width="108px">
      <el-form-item label="機能名" prop="title">
        <el-input
          v-model="queryParams.title"
          placeholder=""
          clearable
          style="width: 240px;"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="ログインID" prop="operName">
        <el-input
          v-model="queryParams.operName"
          placeholder=""
          clearable
          style="width: 240px;"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="タイプ" prop="businessType">
        <el-select
          v-model="queryParams.businessType"
          placeholder="タイプ"
          clearable
          style="width: 240px"
        >
          <el-option
            v-for="dict in dict.type.sys_oper_type"
            :key="dict.value"
            :label="dict.label"
            :value="dict.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="ステータス" prop="status">
        <el-select
          v-model="queryParams.status"
          placeholder="操作ステータス"
          clearable
          style="width: 240px"
        >
          <el-option
            v-for="dict in dict.type.sys_common_status"
            :key="dict.value"
            :label="dict.label"
            :value="dict.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="操作時間">
        <el-date-picker
          v-model="dateRange"
          style="width: 240px"
          value-format="yyyy-MM-dd"
          type="daterange"
          range-separator="-"
          start-placeholder="開始日"
          end-placeholder="終了日"
        ></el-date-picker>
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
          icon="el-icon-delete"
          size="mini"
          :disabled="multiple"
          @click="handleDelete"
          v-hasPermi="['monitor:operlog:remove']"
        >削除</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="primary"
          plain
          icon="el-icon-download"
          size="mini"
          @click="handleExport"
          :disabled="list.length === 0"
          v-hasPermi="['monitor:operlog:export']"
        >EXCEL出力</el-button>
      </el-col>
      <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table border ref="tables" v-loading="loading" :data="list" @selection-change="handleSelectionChange" :default-sort="defaultSort" @sort-change="handleSortChange">
      <el-table-column type="selection" width="70" align="center" />
      <el-table-column label="No." width="70" align="center" prop="operId" />
      <el-table-column label="ログインID" align="center" prop="operName" width="150" :show-overflow-tooltip="true" sortable="custom" :sort-orders="['descending', 'ascending']" />
      <el-table-column label="IPアドレス" align="center" prop="operIp" width="150" :show-overflow-tooltip="true" />
      <el-table-column label="機能名" align="center" prop="title" />
      <el-table-column label="タイプ" align="center" prop="businessType" width="150">
        <template slot-scope="scope">
          <dict-tag :options="dict.type.sys_oper_type" :value="scope.row.businessType"/>
        </template>
      </el-table-column>
      <el-table-column label="ステータス" align="center" prop="status" width="130">
        <template slot-scope="scope">
          <dict-tag :options="dict.type.sys_common_status" :value="scope.row.status"/>
        </template>
      </el-table-column>
      <el-table-column label="操作時間" align="center" prop="operTime" sortable="custom" :sort-orders="['descending', 'ascending']" width="180">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.operTime) }}</span>
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

    <!-- 操作ログ参照 -->
    <el-dialog title="操作ログ詳細" :visible.sync="open" width="700px" append-to-body>
      <el-form ref="form" :model="form" label-width="100px" size="mini">
        <el-row>
          <el-col :span="12">
            <el-form-item label="操作モジュール：">{{ form.title }} / {{ typeFormat(form) }}</el-form-item>
            <el-form-item
              label="ログイン情報："
            >{{ form.operName }} / {{ form.operIp }} / {{ form.operLocation }}</el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="リクエストアドレス：">{{ form.operUrl }}</el-form-item>
            <el-form-item label="リクエスト方式：">{{ form.requestMethod }}</el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="操作方法：">{{ form.method }}</el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="リクエストパラメータ：">{{ form.operParam }}</el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="レスポンスパラメータ：">{{ form.jsonResult }}</el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="操作ステータス：">
              <div v-if="form.status === 0">正常</div>
              <div v-else-if="form.status === 1">失敗</div>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="操作時間：">{{ parseTime(form.operTime) }}</el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="異常情報：" v-if="form.status === 1">{{ form.errorMsg }}</el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="open = false">閉じる</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { list, delOperlog, cleanOperlog } from "@/api/monitor/operlog";

export default {
  name: "Operlog",
  dicts: ['sys_oper_type', 'sys_common_status'],
  data() {
    return {
      // マスクレイヤー
      loading: false,
      // 選択配列
      ids: [],
      // 複数選択以外は無効
      multiple: true,
      // 検索条件を表示
      showSearch: true,
      // 総件数
      total: 0,
      // テーブルデータ
      list: [],
      // ポップアップを表示するかどうか
      open: false,
      // 日付範囲
      dateRange: [],
      // デフォルトソート
      defaultSort: {prop: 'operTime', order: 'descending'},
      // フォームパラメータ
      form: {},
      // クエリパラメータ
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        title: undefined,
        operName: undefined,
        businessType: undefined,
        status: undefined
      }
    };
  },
  created() {
    // this.getList();
  },
  methods: {
    /** 操作ログをクエリ */
    getList() {
      this.loading = true;
      list(this.addDateRange(this.queryParams, this.dateRange)).then( response => {
          this.list = response.rows;
          this.total = response.total;
          this.loading = false;
        }
      );
    },
    // 操作ログタイプ辞書翻訳
    typeFormat(row, column) {
      return this.selectDictLabel(this.dict.type.sys_oper_type, row.businessType);
    },
    /** 検索ボタン操作 */
    handleQuery() {
      this.queryParams.pageNum = 1;
      this.getList();
    },
    /** リセットボタン操作 */
    resetQuery() {
      this.dateRange = [];
      this.resetForm("queryForm");
      this.queryParams.pageNum = 1;
      this.list = [];
      this.total = 0;
      // this.$refs.tables.sort(this.defaultSort.prop, this.defaultSort.order)
    },
    /** チェックボックス選択データ */
    handleSelectionChange(selection) {
      this.ids = selection.map(item => item.operId)
      this.multiple = !selection.length
    },
    /** ソートトリガーイベント */
    handleSortChange(column, prop, order) {
      this.queryParams.orderByColumn = column.prop;
      this.queryParams.isAsc = column.order;
      this.getList();
    },
    /** 詳細ボタン操作 */
    handleView(row) {
      this.open = true;
      this.form = row;
    },
    /** 削除ボタン操作 */
    handleDelete(row) {
      const operIds = row.operId || this.ids;
      this.$modal.confirm('ログ番号が"' + operIds + '"のデータ項目を削除してもよろしいですか？').then(function() {
        return delOperlog(operIds);
      }).then(() => {
        this.getList();
        this.$modal.msgSuccess("削除しました。");
      }).catch(() => {});
    },
    /** クリアボタン操作 */
    handleClean() {
      this.$modal.confirm('すべての操作ログデータ項目をクリアしてもよろしいですか？').then(function() {
        return cleanOperlog();
      }).then(() => {
        this.getList();
        this.$modal.msgSuccess("クリア成功");
      }).catch(() => {});
    },
    /** エクスポートボタン操作 */
    handleExport() {
      const now = new Date();
      const timestamp = `${now.getFullYear()}${String(now.getMonth() + 1).padStart(2, '0')}${String(now.getDate()).padStart(2, '0')}${String(now.getHours()).padStart(2, '0')}${String(now.getMinutes()).padStart(2, '0')}${String(now.getSeconds()).padStart(2, '0')}`;
      this.download('monitor/operlog/export', {
        ...this.queryParams
      }, `操作履歴_${timestamp}.xlsx`)
    }
  }
};
</script>
