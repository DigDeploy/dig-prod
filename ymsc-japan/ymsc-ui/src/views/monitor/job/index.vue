<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" size="small" :inline="true" v-show="showSearch" label-width="130px">
      <el-form-item label="ジョブ名" prop="jobName">
        <el-input
          v-model="queryParams.jobName"
          placeholder=""
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="ジョブグループ名" prop="jobGroup">
        <el-select v-model="queryParams.jobGroup" placeholder="" clearable>
          <el-option
            v-for="dict in dict.type.sys_job_group"
            :key="dict.value"
            :label="dict.label"
            :value="dict.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="ジョブステータス" prop="status">
        <el-select v-model="queryParams.status" placeholder="" clearable>
          <el-option
            v-for="dict in dict.type.sys_job_status"
            :key="dict.value"
            :label="dict.label"
            :value="dict.value"
          />
        </el-select>
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
          @click="handleAdd"
          v-hasPermi="['monitor:job:add']"
        >新規作成</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="primary"
          plain
          icon="el-icon-download"
          size="mini"
          @click="handleExport"
          :disabled="jobList.length === 0"
          v-hasPermi="['monitor:job:export']"
        >EXCEL出力</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="primary"
          plain
          icon="el-icon-s-operation"
          size="mini"
          @click="handleJobLog"
          v-hasPermi="['monitor:job:query']"
        >ログ</el-button>
      </el-col>
      <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table border v-loading="loading" :data="jobList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="ジョブID" width="100" align="center" prop="jobId" />
      <el-table-column label="ジョブ名" align="center" prop="jobName" :show-overflow-tooltip="true" />
      <el-table-column label="ジョブグループ名" align="center" prop="jobGroup">
        <template slot-scope="scope">
          <dict-tag :options="dict.type.sys_job_group" :value="scope.row.jobGroup"/>
        </template>
      </el-table-column>
      <el-table-column label="呼び出し対象文字列" align="center" prop="invokeTarget" :show-overflow-tooltip="true" />
      <el-table-column label="Cron実行式" align="center" prop="cronExpression" :show-overflow-tooltip="true" />
      <el-table-column label="ステータス" align="center">
        <template slot-scope="scope">
          <el-switch
            v-model="scope.row.status"
            active-value="0"
            inactive-value="1"
            @change="handleStatusChange(scope.row)"
          ></el-switch>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row)"
            v-hasPermi="['monitor:job:edit']"
          >編集</el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['monitor:job:remove']"
          >削除</el-button>
          <el-dropdown size="mini" @command="(command) => handleCommand(command, scope.row)" v-hasPermi="['monitor:job:changeStatus', 'monitor:job:query']">
            <el-button size="mini" type="text" icon="el-icon-d-arrow-right">その他</el-button>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item command="handleRun" icon="el-icon-caret-right"
                v-hasPermi="['monitor:job:changeStatus']">1回実行</el-dropdown-item>
              <el-dropdown-item command="handleView" icon="el-icon-view"
                v-hasPermi="['monitor:job:query']">ジョブ詳細</el-dropdown-item>
              <el-dropdown-item command="handleJobLog" icon="el-icon-s-operation"
                v-hasPermi="['monitor:job:query']">スケジュールログ</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
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

    <!-- 定期実行ジョブの新規作成/編集ダイアログ -->
    <el-dialog :title="title" :visible.sync="open" width="800px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="120px">
        <el-row>
          <el-col :span="12">
            <el-form-item label="ジョブ名" prop="jobName">
              <el-input v-model="form.jobName" placeholder="ジョブ名を入力してください" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="ジョブグループ" prop="jobGroup">
              <el-select v-model="form.jobGroup" placeholder="ジョブグループを選択してください">
                <el-option
                  v-for="dict in dict.type.sys_job_group"
                  :key="dict.value"
                  :label="dict.label"
                  :value="dict.value"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item prop="invokeTarget">
              <span slot="label">
                呼び出しメソッド
                <el-tooltip placement="top">
                  <div slot="content">
                    Bean呼び出し例：ryTask.ryParams('ry')
                    <br />Class呼び出し例：RyTask.ryParams('ry')
                    <br />パラメータ説明：文字列、ブール型、ロング型、浮動小数点型、整数型をサポート
                  </div>
                  <i class="el-icon-question"></i>
                </el-tooltip>
              </span>
              <el-input v-model="form.invokeTarget" placeholder="呼び出し対象文字列を入力してください" />
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="Cron式" prop="cronExpression">
              <el-input v-model="form.cronExpression" placeholder="Cron実行式を入力してください">
                <template slot="append">
                  <el-button type="primary" @click="handleShowCron">
                    式を生成
                    <i class="el-icon-time el-icon--right"></i>
                  </el-button>
                </template>
              </el-input>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="実行ポリシー" prop="misfirePolicy">
              <el-radio-group v-model="form.misfirePolicy" size="small">
                <el-radio-button label="1">即時実行</el-radio-button>
                <el-radio-button label="2">1回実行</el-radio-button>
                <el-radio-button label="3">実行放弃</el-radio-button>
              </el-radio-group>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="並列実行許可" prop="concurrent">
              <el-radio-group v-model="form.concurrent" size="small">
                <el-radio-button label="0">許可</el-radio-button>
                <el-radio-button label="1">禁止</el-radio-button>
              </el-radio-group>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="ステータス">
              <el-radio-group v-model="form.status">
                <el-radio
                  v-for="dict in dict.type.sys_job_status"
                  :key="dict.value"
                  :label="dict.value"
                >{{dict.label}}</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm">確定</el-button>
        <el-button @click="cancel">キャンセル</el-button>
      </div>
    </el-dialog>

    <el-dialog title="Cron式ジェネレーター" :visible.sync="openCron" append-to-body destroy-on-close class="scrollbar">
      <crontab @hide="openCron=false" @fill="crontabFill" :expression="expression"></crontab>
    </el-dialog>

    <!-- ジョブ詳細 -->
    <el-dialog title="ジョブ詳細" :visible.sync="openView" width="700px" append-to-body>
      <el-form ref="form" :model="form" label-width="120px" size="mini">
        <el-row>
          <el-col :span="12">
            <el-form-item label="ジョブID：">{{ form.jobId }}</el-form-item>
            <el-form-item label="ジョブ名：">{{ form.jobName }}</el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="ジョブグループ：">{{ jobGroupFormat(form) }}</el-form-item>
            <el-form-item label="作成日時：">{{ form.createTime }}</el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="Cron式：">{{ form.cronExpression }}</el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="次回実行日時：">{{ parseTime(form.nextValidTime) }}</el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="呼び出し対象メソッド：">{{ form.invokeTarget }}</el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="ジョブステータス：">
              <div v-if="form.status == 0">正常</div>
              <div v-else-if="form.status == 1">停止</div>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="並列実行許可：">
              <div v-if="form.concurrent == 0">許可</div>
              <div v-else-if="form.concurrent == 1">禁止</div>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="実行ポリシー：">
              <div v-if="form.misfirePolicy == 0">デフォルトポリシー</div>
              <div v-else-if="form.misfirePolicy == 1">即時実行</div>
              <div v-else-if="form.misfirePolicy == 2">1回実行</div>
              <div v-else-if="form.misfirePolicy == 3">実行放弃</div>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="openView = false">閉じる</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { listJob, getJob, delJob, addJob, updateJob, runJob, changeJobStatus } from "@/api/monitor/job";
import Crontab from '@/components/Crontab'

export default {
  components: { Crontab },
  name: "Job",
  dicts: ['sys_job_group', 'sys_job_status'],
  data() {
    return {
      // ローディングマスク
      loading: false,
      // 選択配列
      ids: [],
      // 単一選択以外は無効
      single: true,
      // 複数選択以外は無効
      multiple: true,
      // 検索条件表示フラグ
      showSearch: true,
      // 総件数
      total: 0,
      // 定期実行ジョブテーブルデータ
      jobList: [],
      // モーダルタイトル
      title: "",
      // モーダル表示フラグ
      open: false,
      // 詳細モーダル表示フラグ
      openView: false,
      // Cron式モーダル表示フラグ
      openCron: false,
      // 入力された式
      expression: "",
      // 検索パラメータ
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        jobName: undefined,
        jobGroup: undefined,
        status: undefined
      },
      // フォームパラメータ
      form: {},
      // フォームバリデーションルール
      rules: {
        jobName: [
          { required: true, message: "ジョブ名を入力してください", trigger: "blur" }
        ],
        invokeTarget: [
          { required: true, message: "呼び出し対象文字列を入力してください", trigger: "blur" }
        ],
        cronExpression: [
          { required: true, message: "Cron実行式を入力してください", trigger: "blur" }
        ]
      }
    };
  },
  created() {
    // this.getList();
  },
  methods: {
    /** 定期実行ジョブ一覧を検索 */
    getList() {
      this.loading = true;
      listJob(this.queryParams).then(response => {
        this.jobList = response.rows;
        this.total = response.total;
        this.loading = false;
      });
    },
    // ジョブグループ名辞書変換
    jobGroupFormat(row, column) {
      return this.selectDictLabel(this.dict.type.sys_job_group, row.jobGroup);
    },
    // キャンセルボタン
    cancel() {
      this.open = false;
      this.reset();
    },
    // フォームリセット
    reset() {
      this.form = {
        jobId: undefined,
        jobName: undefined,
        jobGroup: undefined,
        invokeTarget: undefined,
        cronExpression: undefined,
        misfirePolicy: 1,
        concurrent: 1,
        status: "0"
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
      this.jobList = [];
      this.total = 0;
    },
    // チェックボックス選択データ
    handleSelectionChange(selection) {
      this.ids = selection.map(item => item.jobId);
      this.single = selection.length != 1;
      this.multiple = !selection.length;
    },
    // その他操作トリガー
    handleCommand(command, row) {
      switch (command) {
        case "handleRun":
          this.handleRun(row);
          break;
        case "handleView":
          this.handleView(row);
          break;
        case "handleJobLog":
          this.handleJobLog(row);
          break;
        default:
          break;
      }
    },
    // ジョブステータス変更
    handleStatusChange(row) {
      let text = row.status === "0" ? "有効化" : "無効化";
      this.$modal.confirm(`「${row.jobName}」ジョブを${text}しますか？`).then(function() {
        return changeJobStatus(row.jobId, row.status);
      }).then(() => {
        this.$modal.msgSuccess(`${text}に成功しました`);
      }).catch(function() {
        row.status = row.status === "0" ? "1" : "0";
      });
    },
    /* 即時1回実行 */
    handleRun(row) {
      this.$modal.confirm(`「${row.jobName}」ジョブを即時実行しますか？`).then(function() {
        return runJob(row.jobId, row.jobGroup);
      }).then(() => {
        this.$modal.msgSuccess("実行に成功しました");
      }).catch(() => {});
    },
    /** ジョブ詳細情報 */
    handleView(row) {
      getJob(row.jobId).then(response => {
        this.form = response.data;
        this.openView = true;
      });
    },
    /** Cron式ボタン操作 */
    handleShowCron() {
      this.expression = this.form.cronExpression;
      this.openCron = true;
    },
    /** 確定後値を返却 */
    crontabFill(value) {
      this.form.cronExpression = value;
    },
    /** ジョブログ一覧検索 */
    handleJobLog(row) {
      const jobId = row.jobId || 0;
      this.$router.push('/monitor/job-log/index/' + jobId)
    },
    /** 新規作成ボタン操作 */
    handleAdd() {
      this.reset();
      this.open = true;
      this.title = "ジョブ新規作成";
    },
    /** 編集ボタン操作 */
    handleUpdate(row) {
      this.reset();
      const jobId = row.jobId || this.ids;
      getJob(jobId).then(response => {
        this.form = response.data;
        this.open = true;
        this.title = "ジョブ編集";
      });
    },
    /** 送信ボタン */
    submitForm: function() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          if (this.form.jobId != undefined) {
            updateJob(this.form).then(response => {
              this.$modal.msgSuccess("編集に成功しました");
              this.open = false;
              this.getList();
            });
          } else {
            addJob(this.form).then(response => {
              this.$modal.msgSuccess("新規作成に成功しました");
              this.open = false;
              this.getList();
            });
          }
        }
      });
    },
    /** 削除ボタン操作 */
    handleDelete(row) {
      const jobIds = row.jobId || this.ids;
      this.$modal.confirm(`定期実行ジョブID「${jobIds}」のデータを削除しますか？`).then(function() {
        return delJob(jobIds);
      }).then(() => {
        this.getList();
        this.$modal.msgSuccess("削除に成功しました");
      }).catch(() => {});
    },
    /** エクスポートボタン操作 */
    handleExport() {
      const now = new Date();
      const timestamp = `${now.getFullYear()}${String(now.getMonth() + 1).padStart(2, '0')}${String(now.getDate()).padStart(2, '0')}${String(now.getHours()).padStart(2, '0')}${String(now.getMinutes()).padStart(2, '0')}${String(now.getSeconds()).padStart(2, '0')}`;
      this.download('monitor/job/export', {
        ...this.queryParams
      }, `定期タスク_${timestamp}.xlsx`)
    }
  }
};
</script>
