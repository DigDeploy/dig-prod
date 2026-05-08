<template>
  <div class="app-container">
    <el-form
      :model="queryParams"
      ref="queryForm"
      size="small"
      :inline="true"
      v-show="showSearch"
      label-width="150px"
    >
      <el-form-item label="出張命令情報NO" prop="instructionNo">
        <el-input
          v-model="queryParams.instructionNo"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="出張者" prop="loginId">
        <el-select v-model="queryParams.loginId" placeholder="">
          <el-option
            v-for="user in userList"
            :key="user.userId"
            :label="user.nickName"
            :value="user.userId"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="出張日開始期間" prop="periodStart">
        <el-date-picker
          clearable
          v-model="queryParams.periodStart"
          type="date"
          value-format="yyyy-MM-dd"
        >
        </el-date-picker>
      </el-form-item>
      <el-form-item label="出張日終了期間" prop="periodEnd">
        <el-date-picker
          clearable
          v-model="queryParams.periodEnd"
          type="date"
          value-format="yyyy-MM-dd"
        >
        </el-date-picker>
      </el-form-item>
      <!-- <el-form-item label="種別" prop="type">
        <el-select v-model="queryParams.type" clearable>
          <el-option
            v-for="dict in dict.type.instruction_report_type"
            :key="dict.value"
            :label="dict.label"
            :value="dict.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="ステータス" prop="status">
        <el-select v-model="queryParams.status" clearable>
          <el-option
            v-for="dict in dict.type.instruction_report_status"
            :key="dict.value"
            :label="dict.label"
            :value="dict.value"
          />
        </el-select>
      </el-form-item> -->
    </el-form>

    <el-row :gutter="10" class="mb8">
      <!-- <el-col :span="1.5">
        <el-button
          type="primary"
          plain
          icon="el-icon-plus"
          size="mini"
          @click="handleAdd"
          v-hasPermi="['business:instructionReport:add']"
          >追加</el-button
        >
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="warning"
          plain
          icon="el-icon-download"
          size="mini"
          @click="handleExport"
          v-hasPermi="['business:instructionReport:export']"
          >エクスポート</el-button
        >
      </el-col> -->
      <div style="float: right !important">
        <el-button
          type="primary"
          icon="el-icon-search"
          size="mini"
          @click="handleQuery"
          >検索
        </el-button>
        <el-button
          icon="el-icon-refresh"
          size="mini"
          style="margin-right: 5px"
          @click="resetQuery"
          >リセット
        </el-button>
      </div>
    </el-row>

    <el-table
      v-loading="loading"
      :data="instructionReportList"
      border
      @selection-change="handleSelectionChange"
      ref="dataTable"
    >
      <el-table-column
        label="No."
        type="index"
        width="55"
        :header-align="alignTableConfig.header"
        :align="alignTableConfig.lineNo"
      >
        <template slot-scope="scope">
          <span>{{
            (queryParams.pageNum - 1) * queryParams.pageSize + scope.$index + 1
          }}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="出張命令情報NO"
        :header-align="alignTableConfig.header"
        :align="alignTableConfig.text"
        prop="instructionNo"
        width="130px"
        show-overflow-tooltip
      />
      <!-- <el-table-column
        label="案件名"
        :header-align="alignTableConfig.header"
        :align="alignTableConfig.text"
        prop="negotiationNoName"
        width="130px"
        show-overflow-tooltip
      /> -->
      <el-table-column
        label="出張者"
        :header-align="alignTableConfig.header"
        :align="alignTableConfig.text"
        prop="loginId"
        width="100"
        show-overflow-tooltip
      >
        <template slot-scope="scope">
          <span>{{ getUserName(scope.row.loginId) }}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="出張日開始期間"
        :header-align="alignTableConfig.header"
        :align="alignTableConfig.text"
        prop="periodStart"
        width="115"
        show-overflow-tooltip
      >
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.periodStart, "{y}-{m}-{d}") }}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="出張日終了期間"
        :header-align="alignTableConfig.header"
        :align="alignTableConfig.text"
        prop="periodEnd"
        width="115"
      >
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.periodEnd, "{y}-{m}-{d}") }}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="目的"
        :header-align="alignTableConfig.header"
        :align="alignTableConfig.text"
        prop="location"
        show-overflow-tooltip
      />
      <el-table-column
        label="目的の補足欄"
        :header-align="alignTableConfig.header"
        :align="alignTableConfig.text"
        prop="locationSupplementary"
        show-overflow-tooltip
      />
      <el-table-column
        label="面会者名等"
        :header-align="alignTableConfig.header"
        :align="alignTableConfig.text"
        prop="visitorName"
        show-overflow-tooltip
      />
      <el-table-column
        label="結果"
        :header-align="alignTableConfig.header"
        :align="alignTableConfig.text"
        prop="visitorResult"
        show-overflow-tooltip
      />
      <el-table-column
        label="課題・宿題等"
        :header-align="alignTableConfig.header"
        :align="alignTableConfig.text"
        prop="topic"
        show-overflow-tooltip
      />
      <el-table-column
        label="備考・補足"
        :header-align="alignTableConfig.header"
        :align="alignTableConfig.text"
        prop="topicSupplementary"
        show-overflow-tooltip
      />
      <!-- <el-table-column
        label="種別"
        :header-align="alignTableConfig.header"
        :align="alignTableConfig.tag"
        prop="type"
        show-overflow-tooltip
      >
        <template slot-scope="scope">
          <dict-tag
            :options="dict.type.instruction_report_type"
            :value="scope.row.type"
          />
        </template>
      </el-table-column>
      <el-table-column
        label="ステータス"
        :header-align="alignTableConfig.header"
        :align="alignTableConfig.tag"
        prop="status"
        show-overflow-tooltip
      >
        <template slot-scope="scope">
          <dict-tag
            :options="dict.type.instruction_report_status"
            :value="scope.row.status"
          />
        </template>
      </el-table-column>
      <el-table-column
        label="コメント"
        :header-align="alignTableConfig.header"
        :align="alignTableConfig.text"
        prop="comment"
        show-overflow-tooltip
      /> -->
      <el-table-column
        label="操作"
        :header-align="alignTableConfig.header"
        :align="alignTableConfig.action"
        class-name="small-padding fixed-width"
        show-overflow-tooltip
        width="150"
      >
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row)"
            v-hasPermi="['business:instructionReport:edit']"
            >編集</el-button
          >
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleDetail(scope.row)"
            v-hasPermi="['business:instructionReport:edit']"
            >詳細</el-button
          >
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['business:instructionReport:remove']"
            >削除</el-button
          >
        </template>
      </el-table-column>
    </el-table>

    <pagination
      v-show="total > 0"
      :total="total"
      :page.sync="queryParams.pageNum"
      :limit.sync="queryParams.pageSize"
      @pagination="getList"
    />
  </div>
</template>


<script>
import {
  listInstructionReport,
  delInstructionReport,
} from "@/api/business/instructionReport";
import { getUserProfile, listUser } from "@/api/system/user";

export default {
  name: "InstructionReport",
  dicts: ["instruction_report_type", "instruction_report_status"],
  data() {
    return {
      userList: [],
      // 初回検索
      isFirstSearch: true,
      // ローディングマスク
      loading: true,
      // 選択されたID配列
      ids: [],
      // 単一選択無効
      single: true,
      // 複数選択無効
      multiple: true,
      // 検索条件表示
      showSearch: true,
      // 総件数
      total: 0,
      // 出張報告書情報テーブルデータ
      instructionReportList: [],
      // 検索パラメータ
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        reportNo: null,
        instructionNo: null,
        loginId: null,
        periodStart: null,
        periodEnd: null,
        location: null,
        locationSupplementary: null,
        visitorName: null,
        visitorResult: null,
        topic: null,
        topicSupplementary: null,
        type: null,
        status: null,
        comment: null,
      },
    };
  },

  /* アクティベート時 */
  activated() {
    // 削除禁止
    if (!this.isFirstSearch) {
      this.reload();
    }
    this.isFirstSearch = false;
  },

  created() {
    this.getList();
    this.getUser();
  },

  methods: {
    getUserName(loginId) {
      const user = this.userList.find(
        (item) => String(item.userId) === String(loginId)
      );
      const a = user ? user.nickName : loginId;
      return user ? user.nickName : loginId;
    },
    getUser() {
      getUserProfile().then((response) => {
        this.user = response.data;
      });
      listUser().then((response) => {
        this.userList = response.rows;
      });
    },
    // 再読み込み
    reload() {
      this.clearSelection();
      this.queryParams.pageNum = 1;
      this.getList();
    },

    // テーブル選択データをクリア
    clearSelection() {
      this.$refs["dataTable"] && this.$refs["dataTable"].clearSelection();
    },

    /** 出張報告書情報リスト取得 */
    getList() {
      this.loading = true;
      listInstructionReport(this.queryParams).then((response) => {
        this.instructionReportList = response.rows;
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

    // 複数選択時のデータ取得
    handleSelectionChange(selection) {
      this.ids = selection.map((item) => item.reportNo);
      this.single = selection.length !== 1;
      this.multiple = !selection.length;
    },

    /** 詳細ボタン操作 */
    handleDetail(row) {
      // TODO: 手動でルートを追加
      const router =
        "/businessTrip/instructionReport/instructionReportDetail/" +
        row.reportNo;
      this.$router.push(router);
    },

    /** 追加ボタン操作 */
    handleAdd() {
      // TODO: 手動でルートを追加
      const router =
        "/businessTrip/instructionReport/instructionReportAdd/index";
      this.$router.push(router);
    },

    /** 編集ボタン操作 */
    handleUpdate(row) {
      const router =
        "/businessTrip/instructionReport/instructionReportEdit/" + row.reportNo;
      this.$router.push(router);
    },
    /** 削除ボタン操作 */
    handleDelete(row) {
      const reportNos = row.reportNo || this.ids;
      let that = this;
      that.$modal
        .confirm(
          '出張報告書情報番号 "' +
            reportNos +
            '" のデータを削除してもよろしいですか？'
        )
        .then(function () {
          that.$modal.loading();
          delInstructionReport(reportNos)
            .then((response) => {
              that.getList();
              that.$modal.msgSuccess("削除成功");
            })
            .catch((err) => console.log(err))
            .finally(() => that.$modal.closeLoading());
        })
        .catch(() => {});
    },

    /** エクスポートボタン操作 */
    handleExport() {
      this.download(
        "business/instructionReport/export",
        {
          ...this.queryParams,
        },
        `instructionReport_${new Date().getTime()}.xlsx`
      );
    },
  },
};
</script>

