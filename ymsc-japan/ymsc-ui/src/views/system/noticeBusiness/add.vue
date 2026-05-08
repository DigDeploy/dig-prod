<template>
  <div class="app-container-router">
      <el-form ref="form" :model="form" :rules="rules" label-width="108px">
          <!-- タイトルバー -->
          <title-bar title="基本情報" is-top/>
          <el-row :gutter="10">
            <el-col :span="8">
            </el-col>
            <el-col :span="8">
                <el-form-item label="メッセージ内容">
                  <editor v-model="form.noticeContent" :min-height="192"/>
                </el-form-item>
            </el-col>
            <el-col :span="8">
            </el-col>
            <el-col :span="8">
                <el-form-item label="送信者ID" prop="sender">
                  <el-input v-model="form.sender" type="textarea" placeholder="" />
                </el-form-item>
            </el-col>
            <el-col :span="8">
                <el-form-item label="受信者ID" prop="receiver">
                  <el-input v-model="form.receiver" type="textarea" placeholder="" />
                </el-form-item>
            </el-col>
            <el-col :span="8">
                <el-form-item label="部署ID" prop="deptId">
                  <el-input v-model="form.deptId" placeholder="" />
                </el-form-item>
            </el-col>
            <el-col :span="8">
                <el-form-item label="備考" prop="remark">
                  <el-input v-model="form.remark" placeholder="" />
                </el-form-item>
            </el-col>
            <el-col :span="8">
                <el-form-item label="削除フラグ（0：存在、1：削除）" prop="delFlag">
                  <el-input v-model="form.delFlag" placeholder="" />
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
import { addNoticeBusiness} from "@/api/system/noticeBusiness";

export default {
  name: "NoticeBusinessAdd",
  data() {
    return {
      fromRouterPath:'',
      fromRouterQuery:'',
      // フォームパラメータ
      form: {},
      // フォームバリデーション
      rules: {
      }
    };
  },
  // 遷移先ルート名
  beforeRouteEnter(to, from, next) {
      next(vm => {
          if(!vm.fromRouterPath) {
              vm.fromRouterPath = from.path;
              vm.fromRouterQuery = from.query;
          }
      });
  },
  created() {
    this.$modal.loading();
    this.$modal.closeLoading();
  },
  methods: {

    // 戻る・閉じる
    handleClose() {
      // 遷移設定
      const obj = {path: this.fromRouterPath, query: this.fromRouterQuery};
      // 現在のページを閉じて指定ページタブを開く
      this.$tab.closeOpenPage(obj);
    },

    /** 確定ボタン */
    submitForm() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          this.$modal.loading();
          addNoticeBusiness(this.form).then(response => {
            this.$modal.closeLoading();
            this.$modal.msgSuccess("登録しました。");
            this.handleClose();
          }).catch((err) => console.log(err))
            .finally(() => this.$modal.closeLoading());

        }
      });
    },
  }
};
</script>
