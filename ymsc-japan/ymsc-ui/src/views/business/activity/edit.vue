<template>
  <div class="app-container-router">
    <el-form ref="form" :model="form" :rules="rules" label-width="128px">
      <title-bar title="案件情報" is-top>
        <el-row :gutter="10">
          <el-col :span="6">
            <el-form-item label="案件種類" prop="nextPriority">
              <el-select v-model="form.nextPriority" placeholder="" disabled>
                <el-option
                  v-for="dict in dict.type.sys_user_sex"
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

          <el-row :gutter="10">
            <el-col :span="8">
              <el-form-item label="得意先番号" prop="customerNo">
                <el-input v-model="form.customerNo" disabled> </el-input>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="得意先名" prop="customerName">
                <el-input v-model="form.customerName" disabled />
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12">
              <el-form-item label="案件名" prop="customerWindowDept">
                <el-input v-model="form.customerWindowDept" disabled />
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12">
              <el-form-item label="業務内容" prop="customerWindowDept">
                <el-input
                  type="textarea"
                  v-model="form.customerWindowDept"
                  disabled
                />
              </el-form-item>
            </el-col>
          </el-row>
        </el-row>
      </title-bar>
      <title-bar title="活動内容" is-top>
        <el-row :gutter="10">
          <el-col :span="16">
            <el-form-item label="活動No" prop="activityNo">
              <el-input v-model="form.activityNo" disabled placeholder="" />
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
                value-format="yyyy-MM-dd"
                placeholder="YYYY-MM-DD"
              >
              </el-date-picker>
              <el-time-picker
                clearable
                style="width: 120px"
                v-model="form.startDate"
                value-format="HH:mm"
                placeholder="HH:MM"
              >
              </el-time-picker>
              ～
              <el-time-picker
                clearable
                style="width: 120px"
                v-model="form.endDate"
                value-format="HH:mm"
                placeholder="HH:MM"
              >
              </el-time-picker>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
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
        <el-row>
          <el-col :span="8">
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
        </el-row>
        <el-row>
          <el-col :span="8">
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
          <el-col :span="8">
            <el-form-item label="活動目的" prop="purpose">
              <el-input v-model="form.purpose" placeholder="" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="活動内容（詳細）" prop="proposal">
              <el-input
                type="textarea"
                v-model="form.proposal"
                placeholder=""
              />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="成果" prop="achieve">
              <el-input v-model="form.achieve" placeholder="" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="10">
            <el-form-item label="資料添付" prop="achieve">
              <el-input v-model="form.achieve" placeholder="" />
            </el-form-item>
          </el-col>
          <el-col :span="2">
            <!--            <el-form-item label="資料添付" prop="achieve">-->
            <!--              <el-input v-model="form.achieve" placeholder="成果を入力してください"/>-->
            <!--            </el-form-item>-->
          </el-col>
          <el-col :span="8">
            <el-form-item label="添付ファイル説明" prop="achieve">
              <el-input v-model="form.achieve" placeholder="" />
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
                value-format="yyyy-MM-dd"
              >
              </el-date-picker>
              <el-time-picker
                clearable
                style="width: 120px"
                v-model="form.startDate"
                value-format="HH:mm"
                placeholder=""
              >
              </el-time-picker>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="10">
          <el-col :span="8">
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
          <el-col :span="12">
            <el-form-item label="内容" prop="nextProposal">
              <el-input v-model="form.nextProposal" placeholder="" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="準備事項" prop="nextPrepar">
              <el-input v-model="form.nextPrepar" placeholder="" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="8">
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
          <el-col :span="8">
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
      <el-button @click="handleClose">戻る</el-button>
    </div>
  </div>
</template>


<script>
import { listUser } from "@/api/system/user";

import {
  addActivity,
  updateActivity,
  getActivity,
} from "@/api/business/activity";

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
  data() {
    return {
      userList: [],
      fromRouterPath: "",
      fromRouterQuery: "",
      // フォームデータ
      form: {},
      // フォーム検証ルール
      rules: {},
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
    this.getUser();
    const activityNo = this.$route.params && this.$route.params.activityNo;
    if (activityNo) {
      this.getInfo(activityNo);
    }
  },

  methods: {
    getUser() {
      listUser().then((response) => {
        this.userList = response.rows;
      });
    },

    getInfo(activityNo) {
      this.$modal.loading();
      getActivity(activityNo)
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

          updateActivity(this.form)
            .then((response) => {
              this.$modal.msgSuccess("保存しました。");
              this.handleClose();
            })
            .catch((err) => {
              console.error("更新失敗:", err);
              this.$modal.msgError("更新失敗");
            })
            .finally(() => this.$modal.closeLoading());
        }
      });
    },
  },
};
</script>

