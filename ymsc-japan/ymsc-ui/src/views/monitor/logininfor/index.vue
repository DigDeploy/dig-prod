<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" size="small" :inline="true" v-show="showSearch" label-width="138px">
     <el-form-item label="ログインID" prop="userName">
            <el-input
              v-model="queryParams.userName"
              placeholder=""
              clearable
              style="width: 240px;"
              @keyup.enter.native="handleQuery"
            />
      </el-form-item>
      <el-form-item label="IPアドレス" prop="ipaddr">
        <el-input
          v-model="queryParams.ipaddr"
          placeholder=""
          clearable
          style="width: 240px;"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="ステータス" prop="status">
        <el-select
          v-model="queryParams.status"
          placeholder=""
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
      <el-form-item label="日時">
        <el-date-picker
          v-model="dateRange"
          style="width: 240px"
          value-format="yyyy-MM-dd"
          type="daterange"
          range-separator="-"
          start-placeholder=""
          end-placeholder=""
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
          v-hasPermi="['monitor:logininfor:remove']"
        >削除</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="primary"
          plain
          icon="el-icon-unlock"
          size="mini"
          :disabled="single"
          @click="handleUnlock"
          v-hasPermi="['monitor:logininfor:unlock']"
        >ロック解除</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="primary"
          plain
          icon="el-icon-download"
          size="mini"
          :disabled="list.length === 0"
          @click="handleExport"
          v-hasPermi="['monitor:logininfor:export']"
        >EXCEL出力</el-button>
      </el-col>
      <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table border ref="tables" v-loading="loading" :data="list" @selection-change="handleSelectionChange" :default-sort="defaultSort" @sort-change="handleSortChange">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="No." align="center" prop="infoId" width="80" />
      <el-table-column label="ログインID" align="center" prop="userName" width="170" :show-overflow-tooltip="true" sortable="custom" :sort-orders="['descending', 'ascending']" />
      <el-table-column label="IPアドレス" align="center" prop="ipaddr" width="150" :show-overflow-tooltip="true" />
      <!-- <el-table-column label="ログイン場所" align="center" prop="loginLocation" :show-overflow-tooltip="true" /> -->
      <el-table-column label="ステータス" align="center" prop="status" width="120">
        <template slot-scope="scope">
          <dict-tag :options="dict.type.sys_common_status" :value="scope.row.status"/>
        </template>
      </el-table-column>
      <el-table-column label="詳細情報" align="left" prop="msg" />
      <el-table-column label="日時" align="center" prop="loginTime" sortable="custom" :sort-orders="['descending', 'ascending']" width="180">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.loginTime) }}</span>
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
import { list, delLogininfor, unlockLogininfor } from "@/api/monitor/logininfor";

export default {
  name: "Logininfor",
  dicts: ['sys_common_status'],
  data() {
    return {
      // マスクレイヤー
      loading: false,
      // 選択配列
      ids: [],
      // 単一選択以外は無効
      single: true,
      // 複数選択以外は無効
      multiple: true,
      // 選択したユーザー名
      selectName: "",
      // 検索条件を表示
      showSearch: true,
      // 総件数
      total: 0,
      // テーブルデータ
      list: [],
      // 日付範囲
      dateRange: [],
      // デフォルトソート
      defaultSort: {prop: 'loginTime', order: 'descending'},
      // クエリパラメータ
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        ipaddr: undefined,
        userName: undefined,
        status: undefined
      }
    };
  },
  created() {
    // this.getList();
  },
  methods: {
    /** ログインログリストをクエリ */
    getList() {
      this.loading = true;
      list(this.addDateRange(this.queryParams, this.dateRange)).then(response => {
          this.list = response.rows;
          this.total = response.total;
          this.loading = false;
        }
      );
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
      this.ids = selection.map(item => item.infoId)
      this.single = selection.length!==1
      this.multiple = !selection.length
      this.selectName = selection.map(item => item.userName);
    },
    /** ソートトリガーイベント */
    handleSortChange(column, prop, order) {
      this.queryParams.orderByColumn = column.prop;
      this.queryParams.isAsc = column.order;
      this.getList();
    },
    /** 削除ボタン操作 */
    handleDelete(row) {
      const infoIds = row.infoId || this.ids;
      this.$modal.confirm('アクセス番号が"' + infoIds + '"のデータ項目を削除してもよろしいですか？').then(function() {
        return delLogininfor(infoIds);
      }).then(() => {
        this.getList();
        this.$modal.msgSuccess("削除しました。");
      }).catch(() => {});
    },
    /** ロック解除ボタン操作 */
    handleUnlock() {
      const username = this.selectName;
      this.$modal.confirm('ユーザー"' + username + '"のアカウントロックを解除してもよろしいですか？').then(function() {
        return unlockLogininfor(username);
      }).then(() => {
        this.$modal.msgSuccess("ユーザー" + username + "のロック解除成功");
      }).catch(() => {});
    },
    /** エクスポートボタン操作 */
    handleExport() {
      const now = new Date();
      const timestamp = `${now.getFullYear()}${String(now.getMonth() + 1).padStart(2, '0')}${String(now.getDate()).padStart(2, '0')}${String(now.getHours()).padStart(2, '0')}${String(now.getMinutes()).padStart(2, '0')}${String(now.getSeconds()).padStart(2, '0')}`;
      this.download('monitor/logininfor/export', {
        ...this.queryParams
      }, `ログイン履歴_${timestamp}.xlsx`)
    }
  }
};
</script>
