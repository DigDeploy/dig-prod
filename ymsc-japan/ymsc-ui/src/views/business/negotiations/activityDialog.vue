<template>
  <el-dialog
    title="活動報告"
    :visible.sync="visible"
    width="1200px"
    style="overflow: hidden"
    append-to-body
    :before-close="handleClose"
  >
    <div
      style="
        max-height: calc(95vh - 220px);
        overflow-y: auto;
        padding-right: 10px;
      "
    >
      <el-form ref="form" :model="form" :rules="rules" label-width="148px">
        <title-bar title="案件情報" is-top>
          <el-row :gutter="12">
            <el-col :span="6">
              <el-form-item label="案件種類" prop="nextPriority">
                <el-select
                  v-model="form.negotiationType"
                  placeholder=""
                  disabled
                >
                  <el-option
                    v-for="dict in dict.type.negotiation_type"
                    :key="dict.value"
                    :label="dict.label"
                    :value="dict.value"
                  ></el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="案件番号" prop="negotiationNo">
                <el-input v-model="form.negotiationNo" disabled> </el-input>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="子番" prop="subNumber">
                <el-input v-model="form.subNumber" disabled />
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="改定番号" prop="revisionNumber">
                <el-input v-model="form.revisionNumber" disabled />
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="10">
            <el-col :span="8">
              <el-form-item label="得意先番号" prop="customerNo">
                <el-input v-model="form.customerNo" disabled />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="得意先名" prop="customerName">
                <el-input v-model="form.customerName" disabled />
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="20">
              <el-form-item label="案件名" prop="negotiationName">
                <el-input v-model="form.negotiationName" disabled />
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="20">
              <el-form-item label="業務内容" prop="businessContent">
                <el-input
                  type="textarea"
                  v-model="form.businessContent"
                  disabled
                />
              </el-form-item>
            </el-col>
          </el-row>
        </title-bar>
        <title-bar title="活動内容" is-top>
          <el-row :gutter="10">
            <el-col :span="8">
              <el-form-item label="活動番号" prop="activityNo">
                <el-input v-model="form.activityNo" disabled />
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="10">
            <el-col :span="16">
              <el-form-item label="活動日時" prop="activityDate">
                <el-date-picker
                  clearable
                  v-model="form.activityDate"
                  type="date"
                  format="yyyy-MM-dd"
                  value-format="yyyy-MM-dd"
                  :disabled="isViewMode"
                  placeholder="YYYY-MM-DD"
                >
                </el-date-picker>
                <el-time-select
                  clearable
                  style="width: 120px"
                  v-model="form.startDate"
                  value-format="HH:mm"
                  placeholder="HH:MM"
                  :disabled="isViewMode"
                  :picker-options="{
                    start: '00:00',
                    step: '00:30',
                    end: '23:30',
                  }"
                >
                </el-time-select>
                ～
                <el-time-select
                  clearable
                  style="width: 120px"
                  v-model="form.endDate"
                  value-format="HH:mm"
                  placeholder="HH:MM"
                  :disabled="isViewMode"
                  :picker-options="{
                    start: '00:00',
                    step: '00:30',
                    end: '23:30',
                  }"
                >
                </el-time-select>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="10">
            <el-col :span="10">
              <el-form-item label="案件進捗" prop="status">
                <el-select
                  v-model="form.status"
                  placeholder=""
                  :disabled="isViewMode"
                >
                  <el-option
                    v-for="dict in dict.type.negotiation_status"
                    :key="dict.value"
                    :label="dict.label"
                    :value="dict.value"
                  ></el-option>
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="10">
            <el-col :span="10">
              <el-form-item label="営業担当（主）" prop="mainResponsible">
                <el-select
                  v-model="form.mainResponsible"
                  placeholder=""
                  filterable
                  @change="handleMainResponsibleChange"
                  :disabled="isViewMode"
                >
                  <el-option
                    v-for="user in userList"
                    :key="user.userId"
                    :label="user.nickName"
                    :value="String(user.userId)"
                  ></el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="10">
              <el-form-item label="担当追加" prop="responsible">
                <dept-user-input
                  v-model="form.responsible"
                  :ref="`responsible_${form.index}`"
                  class="w-100"
                  :disabled="isViewMode"
                  :previewSize="3"
                />
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="10">
            <el-col :span="10">
              <el-form-item label="活動種別" prop="type">
                <el-select
                  v-model="form.type"
                  placeholder=""
                  :disabled="isViewMode"
                >
                  <el-option
                    v-for="dict in dict.type.activity_type"
                    :key="dict.value"
                    :label="dict.label"
                    :value="dict.value"
                  ></el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="10">
              <el-form-item label="活動目的" prop="purpose">
                <el-select
                  v-model="form.purpose"
                  placeholder=""
                  :disabled="isViewMode"
                >
                  <el-option
                    v-for="dict in dict.type.activity_purpose"
                    :key="dict.value"
                    :label="dict.label"
                    :value="dict.value"
                  ></el-option>
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="10">
            <el-col :span="20">
              <el-form-item label="活動内容（詳細）" prop="proposal">
                <el-input
                  type="textarea"
                  v-model="form.proposal"
                  placeholder=""
                  maxlength="200"
                  show-word-limit
                  :disabled="isViewMode"
                />
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="10">
            <el-col :span="20">
              <el-form-item label="成果" prop="achieve">
                <el-input
                  v-model="form.achieve"
                  placeholder=""
                  maxlength="100"
                  :disabled="isViewMode"
                  show-word-limit
                />
              </el-form-item>
            </el-col>
          </el-row>
        </title-bar>
        <title-bar title="添付ファイル" is-top>
          <el-form-item label-width="0" prop="fileList">
            <!-- 申请单附件组件 -->
            <file-table
              v-model="fileList"
              max-height="180"
              :remove-records="dataFormFile.fileIds"
              :readOnly="isViewMode"
            />
          </el-form-item>
        </title-bar>
        <title-bar title="次回アクション" is-top>
          <el-row :gutter="10">
            <el-col :span="16">
              <el-form-item label="次回活動日時" prop="nextDate">
                <el-date-picker
                  clearable
                  v-model="form.nextDate"
                  type="date"
                  :picker-options="{ disabledDate: disabledEndDate }"
                  value-format="yyyy-MM-dd"
                  :disabled="isViewMode"
                  placeholder="YYYY-MM-DD"
                >
                </el-date-picker>
                <el-time-select
                  clearable
                  style="width: 120px"
                  v-model="form.nextTime"
                  value-format="HH:mm"
                  placeholder="HH:MM"
                  :picker-options="{
                    start: '00:00',
                    step: '00:30',
                    end: '23:30',
                  }"
                  :disabled="isViewMode"
                >
                </el-time-select>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="10">
            <el-col :span="10">
              <el-form-item label="次回活動種別" prop="nextType">
                <el-select
                  v-model="form.nextType"
                  placeholder=""
                  :disabled="isViewMode"
                >
                  <el-option
                    v-for="dict in dict.type.activity_type"
                    :key="dict.value"
                    :label="dict.label"
                    :value="dict.value"
                  ></el-option>
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="20">
              <el-form-item label="内容" prop="nextProposal">
                <el-input
                  v-model="form.nextProposal"
                  placeholder=""
                  maxlength="100"
                  show-word-limit
                  :disabled="isViewMode"
                />
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="20">
              <el-form-item label="準備事項" prop="nextPrepar">
                <el-input
                  v-model="form.nextPrepar"
                  placeholder=""
                  maxlength="100"
                  show-word-limit
                  :disabled="isViewMode"
                />
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="10">
              <el-form-item label="優先度" prop="nextPriority">
                <el-select
                  v-model="form.nextPriority"
                  placeholder=""
                  :disabled="isViewMode"
                >
                  <el-option
                    v-for="dict in dict.type.priority"
                    :key="dict.value"
                    :label="dict.label"
                    :value="dict.value"
                  ></el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="10">
              <el-form-item label="アラート通知" prop="nextAlert">
                <el-select
                  v-model="form.nextAlert"
                  placeholder=""
                  :disabled="isViewMode"
                >
                  <el-option
                    v-for="dict in dict.type.activity_alert"
                    :key="dict.value"
                    :label="dict.label"
                    :value="dict.value"
                  ></el-option>
                </el-select>
                <span style="font-weight: bold"> 日前に通知</span>
              </el-form-item>
            </el-col>
          </el-row>
        </title-bar>
      </el-form>
    </div>
    <div slot="footer" class="dialog-footer">
      <el-button type="primary" @click="submitForm" :disabled="isViewMode"
        >確 定</el-button
      >
      <el-button @click="handleClose">キャンセル</el-button>
    </div>
  </el-dialog>
</template>

<script>
import DeptUserInput from "@/components/DeptUser/multipleInput";
import { listUser } from "@/api/system/user";

export default {
  name: "ActivityAdd",
  components: {
    DeptUserInput,
  },
  dicts: [
    "negotiation_type",
    "negotiation_status",
    "activity_type",
    "activity_purpose",
    "priority",
    "activity_alert",
  ],
  props: {
    mode: {
      type: String,
      default: "edit",
      validator: function (value) {
        return ["edit", "view"].indexOf(value) !== -1;
      },
    },
  },
  data() {
    return {
      fromRouterPath: "",
      fromRouterQuery: "",
      // フォームデータ
      form: {
        activityNo: "",
        negotiationType: "",
        negotiationNo: "",
        subNumber: "",
        revisionNumber: "",
        customerId: "",
        customerName: "",
        negotiationName: "",
        businessContent: "",
        // 活動内容
        activityDate: "",
        startDate: "",
        endDate: "",
        status: "", // 案件進捗
        mainResponsible: "", // 営業担当（主）
        type: "", // 活動種別
        purpose: "", // 活動目的
        proposal: "",
        achieve: "",
        attachment: "",
        attachmentDescription: "",
        // 次回アラート
        nextDate: "",
        nextTime: "",
        nextType: "",
        nextProposal: "",
        nextPrepar: "",
        nextPriority: "",
        nextAlert: "",
      },
      fileList: [],
      dataFormFile: {
          fileIds: [],
      },
      // フォーム検証ルール
      rules: {
        activityDate: [
          { required: true, message: "活動日時は必須です", trigger: "blur" },
          { validator: this.validateDateTime, trigger: "blur" },
        ],
        status: [
          { required: true, message: "案件進捗は必須です", trigger: "change" },
        ],
        mainResponsible: [
          {
            required: true,
            message: "営業担当（主）は必須です",
            trigger: "blur",
          },
        ],
        type: [
          { required: true, message: "活動種別は必須です", trigger: "change" },
        ],
        purpose: [
          { required: true, message: "活動目的は必須です", trigger: "change" },
        ],
        proposal: [
          {
            required: true,
            message: "活動内容（詳細）をは必須です",
            trigger: "blur",
          },
          {
            max: 200,
            message: "活動内容は200文字以内で入力してください",
            trigger: "submit",
          },
        ],
        achieve: [
          { required: true, message: "成果は必須です", trigger: "blur" },
          {
            max: 100,
            message: "成果は100文字以内で入力してください",
            trigger: "submit",
          },
        ],
        nextProposal: [
          {
            max: 100,
            message: "次回活動内容は100文字以内で入力してください",
            trigger: "submit",
          },
        ],
        attachmentDescription: [
          {
            max: 50,
            message: "添付ファイル説明は50文字以内で入力してください",
            trigger: "submit",
          },
        ],
        nextDate: [
          { validator: this.validateNextActiveDateTime, trigger: "blur" },
        ],
      },
      visible: false,
      userList: [],
    };
  },
  watch: {
      'form.activityDate': {
          immediate: true,
          handler() {
              this.$forceUpdate();
              if (this.form.nextDate) {
                  if (this.form.nextDate < this.form.activityDate) {
                      this.form.nextDate = null;
                  }
              }
          }
      },
  },
  computed: {
    // 计算属性：是否为查看模式
    isViewMode() {
      return this.mode === "view";
    },
    // tableHeight() {
    //     // 高度
    //     let height = document.body.clientHeight / 2;
    //     //表格的高度
    //     return height < 200 ? 300 : height;
    // },
  },
  // ルート遷移時
  beforeRouteEnter(to, from, next) {
    next((vm) => {
      if (!vm.fromRouterPath) {
        vm.fromRouterPath = from.path;
        vm.fromRouterQuery = from.query;
      }
    });
  },
  methods: {
    validateDateTime(rule, value, callback) {
      if (!this.form.activityDate) {
        return callback(new Error("日付を選択してください"));
      }

      if (!this.form.startDate) {
        return callback(new Error("開始時間を選択してください"));
      }

      if (!this.form.endDate) {
        return callback(new Error("終了時間を選択してください"));
      }

      const start = new Date(`2000-01-01T${this.form.startDate}`);
      const end = new Date(`2000-01-01T${this.form.endDate}`);
      if (end <= start) {
        return callback(
          new Error("終了時間は開始時間より後に設定してください")
        );
      }

      callback();
    },
    validateNextActiveDateTime(rule, value, callback) {
      if (this.form.activityDate && this.form.startDate && this.form.endDate && this.form.nextDate && this.form.nextTime) {
        const firstActiveEndDatetime = new Date(`${this.form.activityDate}T${this.form.endDate}`);
        const nextActiveDatetime = new Date(`${this.form.nextDate}T${this.form.nextTime}`);
        const now = new Date();
        if (nextActiveDatetime <= firstActiveEndDatetime) {
          return callback(new Error("次回活動日時は、活動日時より後の日時を入力してください"));
        }
        if (nextActiveDatetime < now) {
          return callback(new Error("本日以降（本日を含む）の日時を入力してください"));
        }
      }

      callback();
    },
    async getUser() {
      await listUser({ pageSize: -1 }).then((response) => {
        this.userList = response.rows;
      });
    },
    submitForm() {
      this.$refs["form"].validate((valid) => {
        if (valid) {
          this.form.fileList = this.fileList;
          this.form.fileRemoveIds = this.dataFormFile.fileIds;
          this.$emit("callback", this.form);
          this.handleClose();
        } else {
          this.$nextTick(() => {
            const errorEl = document.querySelector(".el-form-item.is-error");
            if (errorEl) {
              errorEl.scrollIntoView({ behavior: "smooth", block: "center" });
            }
          });
        }
      });
    },
    handleMainResponsibleChange(userId) {
      const selectedUser = this.userList.find(
        (user) => user.userId === parseInt(userId)
      );
      if (selectedUser) {
        this.form.mainResponsibleName = selectedUser.nickName;
      } else {
        this.form.mainResponsibleName = "";
      }
    },
    // 打开
    async open(vo) {
      let that = this;
      that.clearForm();
      await that.getUser();
      that.$nextTick(() => {
        for (let key in vo) {
          if (Object.prototype.hasOwnProperty.call(vo, key)) {
            that.form[key] = vo[key];
          }
        }
        that.fileList = that.form.fileList? that.form.fileList : [];
        that.form.nextAlert = that.form.nextAlert ? String(that.form.nextAlert) : '';
        that.visible = true;
        that.$refs.form?.clearValidate();
        setTimeout(() => {
          that.$forceUpdate();
        }, 500);
      });
    },
    handleClose() {
      this.visible = false;
      this.$nextTick(() => {
        this.clearForm();
      });
    },
    disabledEndDate(time) {
        if (!this.form.activityDate) return false;
        const startDate = new Date(this.form.activityDate);
        startDate.setHours(0, 0, 0, 0);
        return time.getTime() < startDate.getTime();
    },
    clearForm() {
      this.form.activityNo = '';
      this.form.negotiationType = '';
      this.form.negotiationNo = '';
      this.form.subNumber = '';
      this.form.revisionNumber = '';
      this.form.customerId = '';
      this.form.customerName = '';
      this.form.negotiationName = '';
      this.form.businessContent = '';
      this.form.activityDate = '';
      this.form.startDate = '';
      this.form.endDate = '';
      this.form.status = '';
      this.form.mainResponsible = '';
      this.form.type = '';
      this.form.purpose = '';
      this.form.proposal = '';
      this.form.achieve = '';
      this.form.attachment = '';
      this.form.attachmentDescription = '';
      this.form.nextDate = '';
      this.form.nextTime = '';
      this.form.nextType = '';
      this.form.nextProposal = '';
      this.form.nextPrepar = '';
      this.form.nextPriority = '';
      this.form.nextAlert = '';
      this.form.index = undefined;
      this.fileList = [];
      this.form.fileList = [];
    },
  },
};
</script>
