<template>
  <div class="app-container-router">
    <el-form ref="form" :model="form" :rules="rules" label-width="108px">
      <el-row :gutter="10">
        <el-col :span="12">
          <el-form-item
            label="案件番号"
            label-width="100px"
            prop="negotiationNo"
          >
            <el-select
              v-model="form.negotiationNoName"
              placeholder=""
              clearable
              size="small"
              style="width: 100%"
              disabled
            >
              <el-option
                v-for="dict in negotiationNoNameList"
                :key="dict.value"
                :label="dict.label"
                :value="dict.value"
              ></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item
            label="命令書No"
            prop="instructionNo"
            label-width="90px"
          >
            <el-input v-model="form.instructionNo" disabled />
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item
            label="報告書No"
            prop="reportNo"
            label-width="90px"
          >
            <el-input v-model="form.reportNo" disabled />
          </el-form-item>
        </el-col>
      </el-row>

      <title-bar title="出張報告書 ＆ 続紙" is-top>
        <!-- タイトルバー -->
        <el-row :gutter="10">
          <el-col :span="12">
            <div style="display: flex; gap: 0; width: 99%">
              <el-form-item label="出張日" prop="periodStart" style="flex: 7">
                <el-date-picker
                  clearable
                  v-model="form.periodStart"
                  type="date"
                  value-format="yyyy-MM-dd"
                  placeholder=""
                  @change="checkDateRange"
                  style="width: 100%"
                  :disabled="isViewMode"
                >
                </el-date-picker>
              </el-form-item>
              <span>～</span>
              <el-form-item
                label=""
                prop="periodEnd"
                style="flex: 5"
                label-width="0px"
              >
                <el-date-picker
                  clearable
                  v-model="form.periodEnd"
                  type="date"
                  value-format="yyyy-MM-dd"
                  placeholder=""
                  @change="checkDateRange"
                  style="width: 100%"
                  :disabled="isViewMode"
                  :picker-options="{ disabledDate: disabledEndDate }"
                >
                </el-date-picker>
              </el-form-item>
            </div>
          </el-col>
          <el-col :span="20">
            <el-form-item label="目的" prop="location">
              <el-input
                v-model="form.location"
                placeholder=""
                :disabled="isViewMode"
              />
            </el-form-item>
          </el-col>
          <el-col :span="20">
            <el-form-item label="目的の補足欄" prop="locationSupplementary">
              <el-input
                v-model="form.locationSupplementary"
                type="textarea"
                placeholder=""
                :disabled="isViewMode"
              />
            </el-form-item>
          </el-col>
          <el-col :span="20">
            <el-form-item label="面会者名等" prop="visitorName">
              <el-input
                v-model="form.visitorName"
                placeholder=""
                :disabled="isViewMode"
              />
            </el-form-item>
          </el-col>
          <el-col :span="20">
            <el-form-item label="結果" prop="visitorResult">
              <el-input
                v-model="form.visitorResult"
                type="textarea"
                placeholder=""
                :disabled="isViewMode"
              />
            </el-form-item>
          </el-col>
          <el-col :span="20">
            <el-form-item label="課題・宿題等" prop="topic">
              <el-input
                v-model="form.topic"
                type="textarea"
                placeholder=""
                :disabled="isViewMode"
              />
            </el-form-item>
          </el-col>
          <el-col :span="20">
            <el-form-item label="備考・補足" prop="topicSupplementary">
              <el-input
                v-model="form.topicSupplementary"
                type="textarea"
                placeholder=""
                :disabled="isViewMode"
              />
            </el-form-item>
          </el-col>
          <el-col :span="18"></el-col>
        </el-row>
      </title-bar>
    </el-form>
    <div class="footer-back">
      <el-button type="primary" @click="submitForm">確定</el-button>
      <el-button @click="handleClose">戻る</el-button>
    </div>
  </div>
</template>


<script>
import {
  getBusinessTripReport,
  updateBusinessTripReport,
} from "@/api/business/businessTripReport";

export default {
  name: "BusinessTripReportEdit",
  dicts: ["instruction_report_type", "instruction_report_status"],
  data() {
    return {
      fromRouterPath: "",
      fromRouterQuery: "",
      // フォームデータ
      form: {},
      // フォーム検証ルール
      rules: {
        periodStart: [
          { required: true, message: "出張日は必須です", trigger: "submit" },
        ],
        periodEnd: [
          { required: true, message: "出張日は必須です", trigger: "submit" },
        ],
        negotiationNo: [
          { required: true, message: "案件番号は必須です", trigger: "submit" },
        ],
        location: [
          {
            max: 100,
            message: "は100文字以内で入力してください",
            trigger: "submit",
          },
        ],
        locationSupplementary: [
          {
            max: 200,
            message: "は200文字以内で入力してください",
            trigger: "submit",
          },
        ],
        visitorName: [
          {
            max: 100,
            message: "は100文字以内で入力してください",
            trigger: "submit",
          },
        ],
        visitorResult: [
          {
            max: 500,
            message: "は500文字以内で入力してください",
            trigger: "submit",
          },
        ],
        topic: [
          {
            max: 200,
            message: "は200文字以内で入力してください",
            trigger: "submit",
          },
        ],
        topicSupplementary: [
          {
            max: 500,
            message: "は500文字以内で入力してください",
            trigger: "submit",
          },
        ],
      },
    };
  },
  // 遷移元のルート名
  beforeRouteEnter(to, from, next) {
    next((vm) => {
      if (!vm.fromRouterPath) {
        vm.fromRouterPath = from.path;
        vm.fromRouterQuery = from.query;
      }
    });
  },
  created() {
    const reportNo = this.$route.params && this.$route.params.reportNo;
    if (reportNo) {
      this.getInfo(reportNo);
    }
  },

  methods: {
    getInfo(reportNo) {
      this.$modal.loading();
      getBusinessTripReport(reportNo)
        .then((response) => {
          this.form = response.data;
        })
        .catch((err) => console.log(err))
        .finally(() => this.$modal.closeLoading());
    },

    // 戻る・閉じる
    handleClose() {
      // 遷移設定
      const obj = { path: this.fromRouterPath, query: this.fromRouterQuery };
      // 現在のタブを閉じて指定タブを開く
      this.$tab.closeOpenPage(obj);
    },

    /** 送信ボタン */
    submitForm() {
      this.$refs["form"].validate((valid) => {
        if (valid) {
          this.$modal.loading();
          updateBusinessTripReport(this.form)
            .then((response) => {
              this.$modal.msgSuccess("保存しました。");
              this.handleClose();
            })
            .catch((err) => console.log(err))
            .finally(() => this.$modal.closeLoading());
        }
      });
    },
  },
};
</script>
