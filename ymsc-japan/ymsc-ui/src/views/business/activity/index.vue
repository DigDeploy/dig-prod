<template>
  <div class="app-container">
    <el-form
      :model="queryParams"
      ref="queryForm"
      size="small"
      :inline="true"
      v-show="showSearch"
      label-width="128px"
    >
      <el-row :gutter="20">

        <el-col :span="6">
          <el-form-item label="活動番号" prop="activityNo">
            <el-input
              v-model="queryParams.activityNo"
              clearable
              @keyup.enter.native="handleQuery"
            />
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="案件番号" prop="negotiationNo">
            <el-input
              v-model="queryParams.negotiationNo"
              clearable
              @keyup.enter.native="handleQuery"
            />
          </el-form-item>
        </el-col>


        <el-col :span="6">
          <el-form-item label="案件名" prop="negotiationName">
            <el-input
              v-model="queryParams.negotiationName"
              clearable
              @keyup.enter.native="handleQuery"
            />
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="子番" prop="subNumber">
            <el-input
              v-model="queryParams.subNumber"
              clearable
              @keyup.enter.native="handleQuery"
            />
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="案件進捗" prop="status">
            <el-select v-model="queryParams.status" clearable filterable>
              <el-option
                v-for="dict in dict.type.negotiation_status"
                :key="dict.value"
                :label="dict.label"
                :value="dict.value"
              />
            </el-select>
          </el-form-item>
        </el-col>


        <el-col :span="6">
          <el-form-item label="活動種別" prop="type">
            <el-select v-model="queryParams.type" clearable filterable>
              <el-option
                v-for="dict in dict.type.activity_type"
                :key="dict.value"
                :label="dict.label"
                :value="dict.value"
              />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="営業担当（主）" prop="mainResponsible">
            <el-select
              v-model="queryParams.mainResponsible"
              clearable
              filterable
              placeholder=""
            >
              <el-option
                v-for="user in userList"
                :key="user.userId"
                :label="user.nickName"
                :value="user.userId"
              />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="活動日" prop="activityDateRange">

            <el-date-picker
              clearable
              v-model="queryParams.activityDateStart"
              type="date"
              value-format="yyyy-MM-dd"
              placeholder="開始日"
              :picker-options="startDatePickerOptions"
            />
            ～
            <el-date-picker
              clearable
              v-model="queryParams.activityDateEnd"
              type="date"
              value-format="yyyy-MM-dd"
              placeholder="終了日"
              :picker-options="endDatePickerOptions"
            />
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>

    <el-row :gutter="10" class="mb8">
      <div style="float: right !important">
        <el-button
          type="primary"
          icon="el-icon-search"
          size="mini"
          @click="handleQuery"
        >検索</el-button>
        <el-button
          icon="el-icon-refresh"
          size="mini"
          style="margin-right: 5px"
          @click="resetQuery"
        >リセット</el-button>
      </div>
    </el-row>

    <el-table
      v-loading="loading"
      :data="activityList"
      border
      @selection-change="handleSelectionChange"
      ref="dataTable"
    >
      <el-table-column
        label="No."
        type="index"
        width="65"
        :header-align="alignTableConfig.header"
        :align="alignTableConfig.lineNo"
      >
        <template slot-scope="scope">
          <span>{{(queryParams.pageNum - 1) * queryParams.pageSize + scope.$index + 1}}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="案件番号"
        :header-align="alignTableConfig.header"
        :align="alignTableConfig.text"
        prop="negotiationNo" width="120"
      />
      <el-table-column
        label="子番"
        :header-align="alignTableConfig.header"
        :align="alignTableConfig.text"
        prop="subNumber"
      />

      <el-table-column
        label="活動番号"
        :header-align="alignTableConfig.header"
        :align="alignTableConfig.text"
        prop="activityNo" width="150"
      />
      <el-table-column
        label="活動日"
        :header-align="alignTableConfig.header"
        :align="alignTableConfig.text"
        prop="activityDate"
        width="120px"
      >
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.activityDate, "{y}-{m}-{d}") }}</span>
        </template>
      </el-table-column>
      <!-- <el-table-column
        label="時間"
        :header-align="alignTableConfig.header"
        :align="alignTableConfig.text"
        prop="startDate"
        width="180px"
      >
        <template slot-scope="scope">
          <span
            >{{ parseTime(scope.row.startDate, "{hh}:{mm}") }}～{{
              parseTime(scope.row.endDate, "{hh}:{mm}")
            }}</span
          >
        </template>
      </el-table-column> -->
      <el-table-column
        label="案件名"
        :header-align="alignTableConfig.header"
        :align="alignTableConfig.text"
        prop="negotiationName" width="180" show-overflow-tooltip
      />
      <el-table-column
        label="案件進捗"
        :header-align="alignTableConfig.header"
        :align="alignTableConfig.tag"
        prop="status"
      >
        <template slot-scope="scope">
          <dict-tag
            :options="dict.type.negotiation_status"
            :value="scope.row.status"
          />
        </template>
      </el-table-column>
      <el-table-column
        label="営業担当（主）"
        :header-align="alignTableConfig.header"
        :align="alignTableConfig.text"
        width="150"
        prop="mainResponsible"
      >
        <template slot-scope="scope">
          {{ getUserNameById(scope.row.mainResponsible) }}
        </template>
      </el-table-column>
      <el-table-column
        label="活動種別"
        :header-align="alignTableConfig.header"
        :align="alignTableConfig.tag"
        prop="type"
      >
        <template slot-scope="scope">
          <dict-tag
            :options="dict.type.activity_type"
            :value="scope.row.type"
          />
        </template>
      </el-table-column>
      <el-table-column
        label="活動目的"
        :header-align="alignTableConfig.header"
        :align="alignTableConfig.tag"
        prop="purpose"
      >
        <template slot-scope="scope">
          <dict-tag
            :options="dict.type.activity_purpose"
            :value="scope.row.purpose"
          />
        </template>
      </el-table-column>
      <el-table-column
        label="活動内容"
        :header-align="alignTableConfig.header"
        :align="alignTableConfig.text"
        prop="proposal" width="180" show-overflow-tooltip
      />
      <el-table-column
        label="成果"
        :header-align="alignTableConfig.header"
        :align="alignTableConfig.text"
        prop="achieve" width="180" show-overflow-tooltip
      />
      <el-table-column
        label="次回活動日時"
        :header-align="alignTableConfig.header"
        :align="alignTableConfig.text"
        prop="nextDate"
        width="150"
      >
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.nextDate, "{y}-{m}-{d}") }}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="次回活動種別"
        :header-align="alignTableConfig.header"
        :align="alignTableConfig.tag"
        prop="nextType"
        width="150"
      >
        <template slot-scope="scope">
          <dict-tag
            :options="dict.type.activity_type"
            :value="scope.row.nextType"
          />
        </template>
      </el-table-column>
      <el-table-column
        label="操作"
        :header-align="alignTableConfig.header"
        :align="alignTableConfig.action"
        class-name="small-padding fixed-width"
        width="200px"
        fixed="right"
      >
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row)"
            v-hasPermi="['business:activity:edit']"
          >編集</el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-view"
            @click="handleDetail(scope.row)"
            v-hasPermi="['business:activity:view']"
          >参照</el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['business:activity:remove']"
          >削除</el-button>
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
import { listActivity, delActivity } from "@/api/business/activity";
import { listUser } from "@/api/system/user";

export default {
  name: "Activity",
  dicts: [
    "sys_user_sex",
    "negotiation_type",
    "negotiation_status",
    "activity_type",
    "activity_purpose",
    "priority",
    "activity_alert",
  ],
  data() {
    return {
      isFirstSearch: true,
      loading: true,
      ids: [],
      single: true,
      multiple: true,
      showSearch: true,
      total: 0,
      activityList: [],
      userList: [],
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        activityNo: null,
        negotiationNo: null,
        subNumber: null,

        negotiationName: null,
        activityDateStart: null,
        activityDateEnd: null,
        status: null,
        mainResponsible: null,
        type: null,
        purpose: null,
        proposal: null,
        achieve: null,
        nextDate: null,
        nextType: null,
        nextProposal: null,
        nextPrepar: null,
        nextPriority: null,
        nextAlert: null,
      },
    };
  },

  computed: {
    startDatePickerOptions() {
      return {
        disabledDate: (time) => {
          if (this.queryParams.activityDateEnd) {
            const endDate = new Date(this.queryParams.activityDateEnd);
            return time.getTime() > endDate.getTime();
          }
          return false;
        }
      };
    },

    endDatePickerOptions() {
      return {
        disabledDate: (time) => {
          if (this.queryParams.activityDateStart) {
            const startDate = new Date(this.queryParams.activityDateStart);
            return time.getTime() < startDate.getTime();
          }
          return false;
        }
      };
    }
  },

  activated() {
    if (!this.isFirstSearch) {
      this.reload();
    }
    this.isFirstSearch = false;
  },

  created() {
    this.getList();
    this.getUserList();
  },

  methods: {
    getUserList() {
      listUser().then((response) => {
        this.userList = response.rows;
      });
    },


    getUserNameById(userId) {
      const user = this.userList.find(u => u.userId === userId);
      return user ? user.nickName : userId || '';
    },

    reload() {
      this.clearSelection();
      this.queryParams.pageNum = 1;
      this.getList();
    },

    clearSelection() {
      this.$refs["dataTable"] && this.$refs["dataTable"].clearSelection();
    },


    getList() {
      this.loading = true;

      const params = { ...this.queryParams };

      listActivity(params).then((response) => {
        this.activityList = response.rows;
        this.total = response.total;
        this.loading = false;
      });
    },

    handleQuery() {
      if (this.queryParams.activityDateStart && this.queryParams.activityDateEnd) {
        const startDate = new Date(this.queryParams.activityDateStart);
        const endDate = new Date(this.queryParams.activityDateEnd);

        if (endDate < startDate) {
          this.$modal.msgWarning('終了日は開始日より前にできません');
          return;
        }
      }

      this.queryParams.pageNum = 1;
      this.getList();
    },

    resetQuery() {
      this.resetForm("queryForm");
      this.queryParams.activityDateStart = null;
      this.queryParams.activityDateEnd = null;
      this.handleQuery();
    },

    handleSelectionChange(selection) {
      this.ids = selection.map((item) => item.activityNo);
      this.single = selection.length !== 1;
      this.multiple = !selection.length;
    },

    handleDetail(row) {
      this.$router.push(`/activity/activityInfo/activityDetail/${row.activityNo}`);
    },

    handleUpdate(row) {
      this.$router.push(`/activity/activityInfo/activityEdit/${row.activityNo}`);
    },

    handleDelete(row) {
      const activityNos = row.activityNo || this.ids;
      this.$modal
        .confirm(`活動情報番号 "${activityNos}" のデータを削除してもよろしいですか？`)
        .then(() => {
          this.$modal.loading();
          delActivity(activityNos)
            .then(() => {
              this.getList();
              this.$modal.msgSuccess("削除しました。");
            })
            .catch((err) => console.error(err))
            .finally(() => this.$modal.closeLoading());
        })
        .catch(() => {});
    },

    handleExport() {
      this.download(
        "business/activity/export",
        { ...this.queryParams },
        `activity_${new Date().getTime()}.xlsx`
      );
    },
  },
};
</script>
