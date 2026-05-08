<template>
  <div class="app-container-router">
    <el-form ref="form" :model="form" :rules="rules" label-width="108px">
      <!-- タイトルバー -->
      <title-bar title="基本情報" is-top />
      <el-row :gutter="10">
        <el-col :span="8">
          <el-form-item label="出張（伺）命令情報NO" prop="instructionNo">
            <el-input
              v-model="form.instructionNo"
              placeholder="出張（伺）命令情報NOを入力してください"
            />
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="出張者" prop="loginId">
            <el-input
              v-model="form.loginId"
              placeholder="出張者を入力してください"
            />
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="出張日開始期間" prop="periodStart">
            <el-date-picker
              clearable
              v-model="form.periodStart"
              type="date"
              value-format="yyyy-MM-dd"
              placeholder="出張日開始期間を選択してください"
            >
            </el-date-picker>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="出張日終了期間" prop="periodEnd">
            <el-date-picker
              clearable
              v-model="form.periodEnd"
              type="date"
              value-format="yyyy-MM-dd"
              placeholder="出張日終了期間を選択してください"
              :picker-options="{ disabledDate: disabledEndDate }"
            >
            </el-date-picker>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="目的" prop="location">
            <el-input
              v-model="form.location"
              placeholder="目的を入力してください"
            />
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="目的の補足欄" prop="locationSupplementary">
            <el-input
              v-model="form.locationSupplementary"
              type="textarea"
              placeholder="内容を入力してください"
            />
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="面会者名等" prop="visitorName">
            <el-input
              v-model="form.visitorName"
              placeholder="面会者名等を入力してください"
            />
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="結果" prop="visitorResult">
            <el-input
              v-model="form.visitorResult"
              type="textarea"
              placeholder="内容を入力してください"
            />
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="課題・宿題等" prop="topic">
            <el-input
              v-model="form.topic"
              placeholder="課題・宿題等を入力してください"
            />
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="備考・補足" prop="topicSupplementary">
            <el-input
              v-model="form.topicSupplementary"
              type="textarea"
              placeholder="内容を入力してください"
            />
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="種別" prop="type">
            <el-select v-model="form.type" placeholder="種別を選択してください">
              <el-option
                v-for="dict in dict.type.instruction_report_type"
                :key="dict.value"
                :label="dict.label"
                :value="dict.value"
              ></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="ステータス" prop="status">
            <el-radio-group v-model="form.status">
              <el-radio
                v-for="dict in dict.type.instruction_report_status"
                :key="dict.value"
                :label="dict.value"
                >{{ dict.label }}</el-radio
              >
            </el-radio-group>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="コメント" prop="comment">
            <el-input
              v-model="form.comment"
              placeholder="コメントを入力してください"
            />
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <div class="footer-back">
      <el-button type="primary" @click="submitForm">確定</el-button>
      <el-button @click="handleClose">戻る</el-button>
    </div>
  </div>
</template>


<script>
import { addInstructionReport } from "@/api/business/instructionReport";

export default {
  name: "InstructionReportAdd",
  dicts: ["instruction_report_type", "instruction_report_status"],
  data() {
    return {
      fromRouterPath: "",
      fromRouterQuery: "",
      // フォームデータ
      form: {},
      // フォーム検証ルール
      rules: {
        instructionNo: [
          { required: true, message: "出張は必須です", trigger: "blur" },
        ],
        delFlag: [
          { required: true, message: "削除フラグは必須です", trigger: "blur" },
        ],
      },
    };
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
  watch: {
    "form.periodStart": {
      immediate: true,
      handler() {
        this.$forceUpdate();
        if (this.form.periodEnd) {
          if (this.form.periodEnd < this.form.periodStart) {
            this.form.periodEnd = null;
          }
        }
      },
    },
  },
  created() {
    this.$modal.loading();
    this.$modal.closeLoading();
  },
  methods: {
    disabledEndDate(time) {
      if (!this.form.periodStart) return false;
      const startDate = new Date(this.form.periodStart);
      startDate.setHours(0, 0, 0, 0);
      return time.getTime() < startDate.getTime();
    },
    // 戻る／閉じる
    handleClose() {
      // 移動設定
      const obj = { path: this.fromRouterPath, query: this.fromRouterQuery };
      // 現在のタブを閉じて指定ページを開く
      this.$tab.closeOpenPage(obj);
    },

    submitForm() {
      this.$refs["form"].validate((valid) => {
        if (valid) {
          this.$modal.loading();
          addInstructionReport(this.form)
            .then((response) => {
              this.$modal.msgSuccess("追加成功");
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

