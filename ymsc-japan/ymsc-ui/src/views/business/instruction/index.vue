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
      <el-form-item label="出張命令管理番号" prop="instructionNo">
        <el-input
          v-model="queryParams.instructionNo"
          clearable
          @keyup.enter.native="handleQuery"
          style="width: 205px;"
        />
      </el-form-item>
      <el-form-item label="案件番号" prop="negotiationNo">
        <el-input
          v-model="queryParams.negotiationNo"
          clearable
          @keyup.enter.native="handleQuery"
          style="width: 205px;"
        />
      </el-form-item>
      <el-form-item label="子番" prop="subNumber">
        <el-input
          v-model="queryParams.subNumber"
          clearable
          @keyup.enter.native="handleQuery"
          style="width: 205px;"
        />
      </el-form-item>
      <el-form-item label="活動No" prop="activityNo">
        <el-input
          v-model="queryParams.activityNo"
          clearable
          @keyup.enter.native="handleQuery"
          style="width: 205px;"
        />
      </el-form-item>

      <el-form-item label="開始期間" prop="periodStart">
        <el-date-picker
          clearable
          v-model="queryParams.periodStart"
          type="date"
          @change="handleStartDateChange"
          value-format="yyyy-MM-dd"
          placeholder="YYYY-MM-DD"
          style="width: 205px;"
        >
        </el-date-picker>
      </el-form-item>
      <el-form-item label="～　　終了期間" prop="periodEnd">
        <el-date-picker
          clearable
          v-model="queryParams.periodEnd"
          type="date"
          :picker-options="endDatePickerOptions"
          value-format="yyyy-MM-dd"
          placeholder="YYYY-MM-DD"
          style="width: 205px;"
        >
        </el-date-picker>
      </el-form-item>
      <el-form-item label="出張先" prop="businessTrip">
        <el-input
          v-model="queryParams.businessTrip"
          clearable
          @keyup.enter.native="handleQuery"
          style="width: 205px;"
        />
      </el-form-item>
    </el-form>

    <el-row :gutter="10" class="mb8">
      <el-col :span="1.5">
        <el-button
          type="primary"
          icon="el-icon-download"
          size="mini"
          :disabled="instructionList.length === 0"
          @click="handleExport"
        >EXCEL出力</el-button>
      </el-col>
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
      :data="instructionList"
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
        label="出張命令管理番号"
        :header-align="alignTableConfig.header"
        :align="alignTableConfig.text"
        prop="instructionNo"
        show-overflow-tooltip
        width="150"
      />
      <el-table-column
        label="案件番号:子番:活動No"
        :header-align="alignTableConfig.header"
        :align="alignTableConfig.text"
        prop="negotiationNoStr"
        show-overflow-tooltip
        width="160"
      />
      <el-table-column
        label="出張者"
        :header-align="alignTableConfig.header"
        :align="alignTableConfig.text"
        prop="loginId"
        show-overflow-tooltip
      >
        <template slot-scope="scope">
          <span>{{ getUserName(scope.row.loginId) }}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="期間（開始）"
        :header-align="alignTableConfig.header"
        :align="alignTableConfig.text"
        prop="periodStart"
        width="120"
      />
      <el-table-column
        label="期間（終了）"
        :header-align="alignTableConfig.header"
        :align="alignTableConfig.text"
        prop="periodEnd"
        width="120"
      />
      <el-table-column
        label="所属"
        :header-align="alignTableConfig.header"
        :align="alignTableConfig.text"
        prop="belonging"
        show-overflow-tooltip
      />
      <el-table-column
        label="出張先"
        :header-align="alignTableConfig.header"
        :align="alignTableConfig.text"
        prop="businessTrip"
        show-overflow-tooltip
      />
      <el-table-column
        label="所在地"
        :header-align="alignTableConfig.header"
        :align="alignTableConfig.text"
        prop="location"
        show-overflow-tooltip
      />
      <el-table-column
        label="要件"
        :header-align="alignTableConfig.header"
        :align="alignTableConfig.text"
        prop="requirements"
        show-overflow-tooltip
      />

      <el-table-column
        label="操作"
        :header-align="alignTableConfig.header"
        :align="alignTableConfig.action"
        class-name="small-padding fixed-width"
      >
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row)"
            v-hasPermi="['business:instruction:edit']"
            >編集</el-button
          >
          <el-button
            size="mini"
            type="text"
            icon="el-icon-document"
            @click="handleDetail(scope.row)"
            v-hasPermi="['business:instruction:edit']"
            >参照</el-button
          >
          <!-- <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['business:instruction:remove']"
            >削除</el-button
          > -->
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
import { listInstruction, delInstruction, exportInstruction } from "@/api/business/instruction";
import { getUserProfile, listUser } from "@/api/system/user";

export default {
  name: "Instruction",
  dicts: ["sys_user_sex"],
  data() {
    return {
      userList: [],
      // 初回検索
      isFirstSearch: true,
      // ローディングマスク
      loading: false,
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
      // 出張（同）命令情報テーブルデータ
      instructionList: [],
      // 検索パラメータ
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        negotiationId: null,
        subNum: null,
        revisionNum: null,
        recordId: null,
        businessInstructionId: null,
        class: null,
        loginId: null,
        businessTrip: null,
        location: null,
        requirements: null,
        periodStart: null,
        periodEnd: null,
        expenses: null,
        estPayment: null,
        approveId: null,
        indication: null,
        indicateId: null,
        approveManager: null,
        managerApproveDate: null,
        approveDirector: null,
        directorApproveDate: null,
        approvePresident: null,
        presidentApproveDate: null,
        createUser: null,
        updateUser: null,
        loginName: null,
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

  computed: {
    endDatePickerOptions() {
      return {
        disabledDate: (time) => {
          if (this.queryParams.periodStart) {
            const startDate = new Date(this.queryParams.periodStart);
            startDate.setHours(0, 0, 0, 0);
            return time.getTime() < startDate.getTime();
          }
          return false;
        }
      };
    }
  },

  created() {
    this.getUser();
  },

  methods: {
    handleStartDateChange() {
      if (this.queryParams.periodEnd) {
        const startDate = new Date(this.queryParams.periodStart);
        const endDate = new Date(this.queryParams.periodEnd);
        if (endDate < startDate) {
          this.queryParams.periodEnd = null;
        }
      }
    },
    getUserName(loginId) {
      const user = this.userList.find(
        (item) => String(item.userId) === String(loginId)
      );
      return user ? user.nickName : loginId;
    },
    getUser() {
      getUserProfile().then((response) => {
        this.user = response.data;
      });
      listUser({pageSize: -1}).then((response) => {
        this.userList = response.rows;
      });
    },
    // 再読み込み
    reload() {
      this.clearSelection();
      this.queryParams.pageNum = 1;
    },

    // テーブル選択データをクリア
    clearSelection() {
      this.$refs["dataTable"] && this.$refs["dataTable"].clearSelection();
    },

    /** 出張（同）命令情報リスト取得 */
    getList() {
      this.loading = true;
      listInstruction(this.queryParams).then((response) => {
        this.instructionList = response.rows;
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
      this.instructionList = [];
      this.total = 0;
    },

    // 複数選択時のデータ取得
    handleSelectionChange(selection) {
      this.ids = selection.map((item) => item.recordId);
      this.single = selection.length !== 1;
      this.multiple = !selection.length;
    },

    /** 詳細ボタン操作 */
    handleDetail(row) {
      // TODO: 手動でルートを追加
      const router = "/instruction/instruction/instructionDetail/" + row.instructionNo;
      this.$router.push(router);
    },

    /** 追加ボタン操作 */
    handleAdd() {
      // TODO: 手動でルートを追加
      const router = "/instruction/instruction/instructionAdd/index";
      this.$router.push(router);
    },

    /** 編集ボタン操作 */
    handleUpdate(row) {
      // TODO: 手動でルートを追加
      const router = "/instruction/instruction/instructionEdit/" + row.instructionNo;
      this.$router.push(router);
    },

    /** 削除ボタン操作 */
    handleDelete(row) {
      const recordIds = row.recordId || this.ids;
      let that = this;
      that.$modal
        .confirm(
          '出張（同）命令情報番号 "' +
            recordIds +
            '" のデータを削除してもよろしいですか？'
        )
        .then(function () {
          that.$modal.loading();
          delInstruction(recordIds)
            .then((response) => {
              that.getList();
              that.$modal.msgSuccess("削除しました。");
            })
            .catch((err) => console.log(err))
            .finally(() => that.$modal.closeLoading());
        })
        .catch(() => {});
    },

    /** エクスポートボタン操作 */
    handleExport() {
      // 検索条件をコピーし、ページングパラメータを削除してすべてのデータをエクスポート
      const exportParams = { ...this.queryParams };
      delete exportParams.pageNum;
      delete exportParams.pageSize;
      const now = new Date();
      const timestamp = `${now.getFullYear()}${String(now.getMonth() + 1).padStart(2, '0')}${String(now.getDate()).padStart(2, '0')}${String(now.getHours()).padStart(2, '0')}${String(now.getMinutes()).padStart(2, '0')}${String(now.getSeconds()).padStart(2, '0')}`;
      this.download(
        "business/instruction/export",
        exportParams,
        `命令書情報_${timestamp}.xlsx`
      );
    },
  },
};
</script>
