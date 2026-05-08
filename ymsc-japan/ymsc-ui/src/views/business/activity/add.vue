<template>
  <div class="app-container-router">
    <el-form ref="form" :model="form" :rules="rules" label-width="135px">
      <title-bar title="案件情報" is-top>
        <el-row :gutter="12">
          <el-col :span="6">
            <el-form-item label="案件種類" prop="negotiationType">
              <el-select v-model="form.negotiationType" placeholder="" disabled>
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
              <el-input v-model="form.negotiationNo">
                <el-button
                  slot="append"
                  icon="el-icon-search"
                  @click="openNegotiationsIndex"
                />
              </el-input>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="子番" prop="subNumber">
              <el-input v-model="form.subNumber" disabled />
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
          <el-col :span="16">
            <el-form-item label="活動日時" prop="activityDate">
              <!-- 活動日 + 開始/終了時間 -->
              <el-date-picker
                clearable
                v-model="form.activityDate"
                type="date"
                value-format="yyyy-MM-dd"
                placeholder="YYYY-MM-DD"
                style="width: 180px"
              />
              <el-time-picker
                clearable
                style="width: 120px"
                v-model="form.startDate"
                value-format="HH:mm"
                placeholder="HH:MM"
              />
              ～
              <el-time-picker
                clearable
                style="width: 120px"
                v-model="form.endDate"
                value-format="HH:mm"
                placeholder="HH:MM"
              />
            </el-form-item>
          </el-col>
        </el-row>

        <el-row :gutter="10">
          <el-col :span="10">
            <el-form-item label="案件進捗" prop="status">
              <el-select v-model="form.status" placeholder="">
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
              >
                <el-option
                  v-for="user in userList"
                  :key="user.userId"
                  :label="user.nickName"
                  :value="user.userId"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="10">
            <el-form-item label="担当追加" prop="responsible">
              <dept-user-input v-model="form.responsible" class="w-100" />
            </el-form-item>
          </el-col>
        </el-row>

        <el-row :gutter="10">
          <el-col :span="10">
            <el-form-item label="活動種別" prop="type">
              <el-select v-model="form.type" placeholder="">
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
              <el-select v-model="form.purpose" placeholder="">
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
                show-word-limit
              />
            </el-form-item>
          </el-col>
        </el-row>

        <el-row :gutter="10">
          <el-col :span="20">
            <file-upload
              v-model="form.attachment"
              :isShowTip="false"
              title="資料添付"
              maxlength="50"
            />
          </el-col>
        </el-row>

        <el-row :gutter="10">
          <el-col :span="20">
            <el-form-item label="添付ファイル説明" prop="attachmentDescription">
              <el-input
                v-model="form.attachmentDescription"
                placeholder=""
                maxlength="50"
                show-word-limit
              />
            </el-form-item>
          </el-col>
        </el-row>
      </title-bar>

      <title-bar title="次回アラート" is-top>
        <el-row :gutter="10">
          <el-col :span="16">
            <el-form-item label="次回活動日時" prop="nextDate">
              <el-date-picker
                clearable
                v-model="form.nextDate"
                type="date"
                :picker-options="{ disabledDate: disabledEndDate }"
                value-format="yyyy-MM-dd"
                placeholder="YYYY-MM-DD"
                style="width: 180px"
              />
              <el-time-picker
                clearable
                style="width: 120px"
                v-model="form.nextStartDate"
                value-format="HH:mm"
                placeholder="HH:MM"
                :picker-options="{
                  selectableRange: '00:00:00 - 23:30:00',
                  step: '00:30',
                }"
              />
            </el-form-item>
          </el-col>
        </el-row>

        <el-row :gutter="10">
          <el-col :span="10">
            <el-form-item label="次回活動種別" prop="nextType">
              <el-select v-model="form.nextType" placeholder="">
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
              />
            </el-form-item>
          </el-col>
        </el-row>

        <el-row>
          <el-col :span="10">
            <el-form-item label="優先度" prop="nextPriority">
              <el-select v-model="form.nextPriority" placeholder="">
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
              <el-select v-model="form.nextAlert" placeholder="">
                <el-option
                  v-for="dict in dict.type.activity_alert"
                  :key="dict.value"
                  :label="dict.label"
                  :value="parseInt(dict.value)"
                ></el-option>
              </el-select>
              <span style="font-weight: bold"> 日前に通知</span>
            </el-form-item>
          </el-col>
        </el-row>
      </title-bar>
    </el-form>

    <div class="footer-back">
      <el-button type="primary" @click="submitForm">確定</el-button>
    </div>

    <customer ref="customer" @callback="handleCustomerCallback" />
    <negotiations ref="negotiations" @callback="handleNegotiationsCallback" />
  </div>
</template>

<script>
import { addActivity } from "@/api/business/activity";
import { listUser } from "@/api/system/user";
import DeptUserInput from "@/components/DeptUser/multipleInput";
import Customer from "@/components/Customer/radio";
import Negotiations from "@/components/Negotiations/radioIndex";

export default {
  name: "ActivityAdd",
  dicts: [
    "sys_user_sex",
    "negotiation_type",
    "negotiation_status",
    "activity_type",
    "activity_purpose",
    "priority",
    "activity_alert",
  ],
  components: {
    DeptUserInput,
    Customer,
    Negotiations,
  },
  data() {
    return {
      fromRouterPath: "",
      fromRouterQuery: "",
      form: {
        negotiationType: "",
        negotiationNo: "",
        subNumber: "",
        revisionNumber: "",
        customerId: "",
        customerNo: "",
        customerName: "",
        negotiationName: "",
        businessContent: "",
        // 活動内容
        activityDate: new Date(),
        startDate: "",
        endDate: "",
        status: "",
        mainResponsible: this.$store.getters.nickName,
        type: "",
        purpose: "",
        proposal: "",
        achieve: "",
        attachment: "",
        attachmentDescription: "",
        // 次回アラート
        nextDate: null,
        nextStartDate: "",
        nextType: "",
        nextProposal: "",
        nextPrepar: "",
        nextPriority: "",
        nextAlert: "",
      },
      rules: {
        activityDate: [
          {
            required: true,
            message: "活動日を選択してください",
            trigger: "blur",
          },
        ],
        startDate: [
          {
            required: true,
            message: "開始時間を選択してください",
            trigger: "blur",
          },
        ],
        endDate: [
          {
            required: true,
            message: "終了時間を選択してください",
            trigger: "blur",
          },
        ],
        status: [
          {
            required: true,
            message: "案件進捗を選択してください",
            trigger: "blur",
          },
        ],
        mainResponsible: [
          {
            required: true,
            message: "営業担当（主）を選択してください",
            trigger: "blur",
          },
        ],
        type: [
          {
            required: true,
            message: "活動種別を選択してください",
            trigger: "blur",
          },
        ],
        purpose: [
          {
            required: true,
            message: "活動目的を選択してください",
            trigger: "blur",
          },
        ],
        negotiationNo: [
          {
            required: true,
            message: "案件番号を入力してください",
            trigger: "blur",
          },
        ],
        proposal: [
          {
            required: true,
            message: "活動内容（詳細）を入力してください",
            trigger: "blur",
          },
          {
            max: 200,
            message: "活動内容は200文字以内で入力してください",
            trigger: "submit",
          },
        ],
        achieve: [
          {
            required: true,
            message: "成果を入力してください",
            trigger: "blur",
          },
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
      },
      visible: false,
      userList: [],
    };
  },
  watch: {
    "form.activityDate": {
      immediate: true,
      handler() {
        this.$forceUpdate();
        if (this.form.nextDate) {
          if (this.form.nextDate < this.form.activityDate) {
            this.form.nextDate = null;
          }
        }
      },
    },
  },
  beforeRouteEnter(to, from, next) {
    next((vm) => {
      if (!vm.fromRouterPath) {
        vm.fromRouterPath = from.path;
        vm.fromRouterQuery = from.query;
      }
    });
  },
  created() {
    this.$modal.loading();
    this.getUser();
    this.$modal.closeLoading();
  },
  methods: {
    disabledEndDate(time) {
      if (!this.form.activityDate) return false;
      const startDate = new Date(this.form.activityDate);
      startDate.setHours(0, 0, 0, 0);
      return time.getTime() < startDate.getTime();
    },
    getUser() {
      listUser().then((response) => {
        this.userList = response.rows;
      });
    },
    openNegotiationsIndex() {
      this.$refs.negotiations.open();
    },

    handleNegotiationsCallback(selectedNegotiation) {
      if (selectedNegotiation) {
        this.form.negotiationNo = selectedNegotiation.negotiationNo;
        this.form.subNumber = selectedNegotiation.subNumber || "";
        this.form.revisionNumber = selectedNegotiation.revisionNumber || "";
        this.form.customerNo = selectedNegotiation.customerNo || "";
        this.form.customerName = selectedNegotiation.customerName || "";
        this.form.negotiationName = selectedNegotiation.negotiationName || "";
        this.form.businessContent = selectedNegotiation.businessContent || "";
        this.form.negotiationType = selectedNegotiation.negotiationType || "";
      }
    },

    handleCustomerCallback(selectedCustomer) {
      if (selectedCustomer) {
        this.form.customerNo = selectedCustomer.customerNo || "";
        this.form.customerName = selectedCustomer.customerName || "";
      }
    },

    submitForm() {
      this.$refs["form"].validate((valid) => {
        if (valid) {
          this.$modal.loading();
          addActivity(this.form)
            .then((response) => {
              this.$modal.msgSuccess("登録しました。");
            })
            .catch((err) => console.error(err))
            .finally(() => this.$modal.closeLoading());
        }
      });
    },

    handleClose() {
      this.visible = false;
      this.$refs["form"].resetFields();
    },
  },
};
</script>
