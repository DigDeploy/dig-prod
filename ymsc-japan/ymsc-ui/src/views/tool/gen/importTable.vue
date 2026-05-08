<template>
  <!-- テーブルのインポート -->
  <el-dialog title="テーブルのインポート" :visible.sync="visible" width="800px" top="5vh" append-to-body>
    <el-form :model="queryParams" ref="queryForm" size="small" :inline="true">
      <el-form-item label="テーブル名" prop="tableName">
        <el-input
          v-model="queryParams.tableName"
          placeholder=""
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="テーブル説明" prop="tableComment">
        <el-input
          v-model="queryParams.tableComment"
          placeholder=""
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">検索</el-button>
        <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">リセット</el-button>
      </el-form-item>
    </el-form>
    <el-row>
      <el-table border @row-click="clickRow" ref="table" :data="dbTableList" @selection-change="handleSelectionChange" height="260px">
        <el-table-column type="selection" width="55"></el-table-column>
        <el-table-column prop="tableName" label="テーブル名" :show-overflow-tooltip="true"></el-table-column>
        <el-table-column prop="tableComment" label="テーブル説明" :show-overflow-tooltip="true"></el-table-column>
        <el-table-column prop="createTime" label="作成時間"></el-table-column>
        <el-table-column prop="updateTime" label="更新時間"></el-table-column>
      </el-table>
      <pagination
        v-show="total>0"
        :total="total"
        :page.sync="queryParams.pageNum"
        :limit.sync="queryParams.pageSize"
        @pagination="getList"
      />
    </el-row>
    <div slot="footer" class="dialog-footer">
      <el-button type="primary" @click="handleImportTable">確定</el-button>
      <el-button @click="visible = false">キャンセル</el-button>
    </div>
  </el-dialog>
</template>

<script>
import { listDbTable, importTable } from "@/api/tool/gen";
export default {
  data() {
    return {
      // マスクレイヤー
      visible: false,
      // 選択された配列値
      tables: [],
      // 総件数
      total: 0,
      // テーブルデータ
      dbTableList: [],
      // 検索パラメータ
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        tableName: undefined,
        tableComment: undefined
      }
    };
  },
  methods: {
    // ダイアログを表示
    show() {
      this.getList();
      this.visible = true;
    },
    clickRow(row) {
      this.$refs.table.toggleRowSelection(row);
    },
    // チェックボックス選択データ
    handleSelectionChange(selection) {
      this.tables = selection.map(item => item.tableName);
    },
    // テーブルデータを検索
    getList() {
      listDbTable(this.queryParams).then(res => {
        if (res.code === 200) {
          this.dbTableList = res.rows;
          this.total = res.total;
        }
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
    /** インポートボタン操作 */
    handleImportTable() {
      const tableNames = this.tables.join(",");
      if (tableNames == "") {
        this.$modal.msgError("インポートするテーブルを選択してください");
        return;
      }
      importTable({ tables: tableNames }).then(res => {
        this.$modal.msgSuccess(res.msg);
        if (res.code === 200) {
          this.visible = false;
          this.$emit("ok");
        }
      });
    }
  }
};
</script>
