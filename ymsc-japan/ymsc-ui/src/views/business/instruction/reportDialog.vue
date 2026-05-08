<template>
  <el-dialog
    title="出張報告書"
    :visible.sync="visible"
    width="60%"
    append-to-body
    :before-close="handleClose"
  >
    <el-form ref="form" :model="form" :rules="rules" label-width="108px">
      <el-row :gutter="10">
        <el-col :span="10">
          <el-form-item
            label="案件番号"
            label-width="100px"
            prop="negotiationNo"
          >
            <el-select
              v-model="form.negotiationNo"
              placeholder=""
              clearable
              size="small"
              style="width: 100%"
              :disabled="this.editDisabled"
            >
              <el-option
                v-for="dict in negotiationNoNameList"
                :key="dict.value"
                :label="dict.label"
                :value="dict.value"
              ></el-option>
            </el-select>
          </el-form-item>

          <!-- <el-form-item
            label="案件番号"
            prop="negotiationNo"
            label-width="80px"
          >
            <el-input v-model="topForm.negotiationNo" />
          </el-form-item> -->
        </el-col>
        <!-- <el-col :span="6">
          <el-form-item label="子番" prop="subNumber" label-width="80px">
            <el-input v-model="topForm.subNumber" disabled />
          </el-form-item>
        </el-col> -->
        <el-col :span="7">
          <el-form-item
            label="命令書No"
            prop="instructionNo"
            label-width="90px"
          >
            <el-input v-model="form.instructionNo" disabled />
          </el-form-item>
        </el-col>
        <el-col :span="7">
          <el-form-item label="報告書No" prop="reportNumber" label-width="90px">
            <el-input v-model="form.reportNumber" disabled />
          </el-form-item>
        </el-col>
      </el-row>

      <title-bar title="出張報告書 ＆ 続紙" is-top>
        <!-- タイトルバー -->
        <el-row :gutter="10">
          <el-col :span="20">
            <div style="display: flex; gap: 0; width: 99%">
              <el-form-item label="出張日" prop="periodStart" style="flex: 7">
                <el-date-picker
                  clearable
                  v-model="form.periodStart"
                  type="date"
                  value-format="yyyy-MM-dd"
                  placeholder="YYYY-MM-DD"
                  style="width: 160px"
                  :disabled="this.detailDisabled"
                >
                </el-date-picker>
              </el-form-item>
              <span>～</span>
              <el-form-item
                label=""
                prop="periodEnd"
                style="flex: 15"
                label-width="0px"
              >
                <el-date-picker
                  clearable
                  v-model="form.periodEnd"
                  type="date"
                  value-format="yyyy-MM-dd"
                  placeholder="YYYY-MM-DD"
                  style="width: 160px"
                  :picker-options="{ disabledDate: disabledEndDate }"
                  :disabled="this.detailDisabled"
                >
                </el-date-picker>
              </el-form-item>
            </div>
          </el-col>
          <el-col :span="20">
            <el-form-item label="目的" prop="location">
              <el-input v-model="form.location" placeholder="" :disabled="this.detailDisabled" show-word-limit maxlength="100" />
            </el-form-item>
          </el-col>
          <el-col :span="20">
            <el-form-item label="目的の補足欄" prop="locationSupplementary">
              <el-input
                v-model="form.locationSupplementary"
                type="textarea"
                placeholder=""
                :disabled="this.detailDisabled"
                show-word-limit maxlength="200"
              />
            </el-form-item>
          </el-col>
          <el-col :span="20">
            <el-form-item label="面会者名等" prop="visitorName">
              <el-input v-model="form.visitorName" placeholder="" :disabled="this.detailDisabled" show-word-limit maxlength="100" />
            </el-form-item>
          </el-col>
          <el-col :span="20">
            <el-form-item label="結果" prop="visitorResult">
              <el-input
                v-model="form.visitorResult"
                type="textarea"
                placeholder=""
                :disabled="this.detailDisabled"
                show-word-limit maxlength="500"
              />
            </el-form-item>
          </el-col>
          <el-col :span="20">
            <el-form-item label="課題・宿題等" prop="topic">
              <el-input v-model="form.topic" type="textarea" placeholder="" :disabled="this.detailDisabled" show-word-limit maxlength="200" />
            </el-form-item>
          </el-col>
          <el-col :span="20">
            <el-form-item label="備考・補足" prop="topicSupplementary">
              <el-input
                v-model="form.topicSupplementary"
                type="textarea"
                placeholder=""
                :disabled="this.detailDisabled"
                show-word-limit maxlength="500"
              />
            </el-form-item>
          </el-col>
          <el-col :span="18"></el-col>
        </el-row>
      </title-bar>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button type="primary" @click="submitForm" :disabled="this.detailDisabled">確 定</el-button>
      <el-button @click="handleClose">キャンセル</el-button>
    </div>
  </el-dialog>
</template>


<script>
import d from "highlight.js/lib/languages/d";
import { getByteLength } from "@/utils";

export default {
  name: "InstructionReportAdd",
  data() {
    const byteLengthValidator = (rule, value, callback) => {
      const maxLength = rule.maxLength;
      if (value && getByteLength(value) > maxLength) {
        callback(new Error(`${maxLength}文字以内入力してください`));
      } else {
        callback();
      }
    };
    return {
      editDisabled: false,
      detailDisabled: false,
      negotiationNoNameList: [],
      visible: false,
      fromRouterPath: "",
      fromRouterQuery: "",
      // フォームデータ
      topForm: {},
      form: { dateStr: "" },
      // フォーム検証ルール
      rules: {
        periodStart: [
          { required: true, message: "出張日は必須です", trigger: "blur" },
        ],
        periodEnd: [
          { required: true, message: "出張日は必須です", trigger: "blur" },
        ],
        negotiationNo: [
          { required: true, message: "案件番号は必須です", trigger: "change" },
        ],
        location: [
          { required: true, message: "目的は必須です", trigger: "blur" },
          {
            validator: byteLengthValidator,
            maxLength: 100,
            message: "目的には100バイトを超えて入力できません",
            trigger: "blur",
          },
        ],
        locationSupplementary: [
          {
            validator: byteLengthValidator,
            maxLength: 200,
            message: "目的の補足欄には200バイトを超えて入力できません",
            trigger: "blur",
          },
        ],
        visitorName: [
          {
            validator: byteLengthValidator,
            maxLength: 100,
            message: "面会者名等には100バイトを超えて入力できません",
            trigger: "blur",
          },
        ],
        visitorResult: [
          {
            validator: byteLengthValidator,
            maxLength: 500,
            message: "結果には500バイトを超えて入力できません",
            trigger: "blur",
          },
        ],
        topic: [
          {
            validator: byteLengthValidator,
            maxLength: 200,
            message: "課題・宿題等には200バイトを超えて入力できません",
            trigger: "blur",
          },
        ],
        topicSupplementary: [
          {
            validator: byteLengthValidator,
            maxLength: 500,
            message: "備考・補足には500バイトを超えて入力できません",
            trigger: "blur",
          },
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
    // handleClose() {
    //   // 移動設定
    //   const obj = { path: this.fromRouterPath, query: this.fromRouterQuery };
    //   // 現在のタブを閉じて指定ページを開く
    //   this.$tab.closeOpenPage(obj);
    // },

    submitForm() {
      this.$refs["form"].validate((valid) => {
        if (valid) {
          this.form.index = this.topForm.index;

          this.negotiationNoNameList.forEach((item) => {
            if (String(item?.value || "") === String(this.form.negotiationNo)) {
              this.form.negotiationNoName = item.label;
              return false;
            }
          });

          // this.form.negotiationNoName = this.negotiationNoNameList[this.form.negotiationNo];
          this.form.dateStr = `${this.form.periodStart || ""} ~ ${
            this.form.periodEnd || ""
          }`;
          this.$emit("callback", this.form);
          this.handleClose();
        }
      });
    },
    //
    open(vo) {
      this.form = {
        periodStart: "",
        periodEnd: "",
        location: "",
        locationSupplementary: "",
        visitorName: "",
        visitorResult: "",
        topic: "",
        topicSupplementary: "",
        negotiationNo: "",
        instructionNo: "",
        reportNo: "",
        reportNumber: "",
        operation: "",
      };
      if (vo.operation === "edit") {
        this.editDisabled = true;
        this.negotiationNoNameList = vo.negotiationNoNameAllList;
      } else if (vo.operation === "detail") {
        this.editDisabled = true;
        this.detailDisabled = true;
        this.negotiationNoNameList = vo.negotiationNoNameAllList;
      } else if (vo.negotiationNoNameList) {
        this.editDisabled = false;
        this.negotiationNoNameList = vo.negotiationNoNameList;
      }

      this.topForm.index = vo.rowIndex;

      const formKeys = [
        "periodStart",
        "periodEnd",
        "location",
        "locationSupplementary",
        "visitorName",
        "visitorResult",
        "topic",
        "topicSupplementary",
        "negotiationNo",
        "instructionNo",
        "reportNo",
        "operation",
        "reportNumber",
      ];
      formKeys.forEach((key) => {
        if (vo[key] !== undefined && vo[key] !== null) {
          this.form[key] = vo[key];
        }
      });

      this.form.operation = vo.operation;

      this.visible = true;
    },
    handleClose() {
      this.visible = false;
      this.resetForm("form");
    },
  },
};
</script>

