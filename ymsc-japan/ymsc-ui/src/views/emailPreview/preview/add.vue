<template>
  <div class="app-container-router">
      <el-form ref="form" :model="form" :rules="rules" label-width="108px">
          <!-- タイトルバー -->
          <title-bar title="基本情報" is-top/>
          <el-row :gutter="10">
          </el-row>
      </el-form>
      <div class="footer-back">
        <el-button type="primary" @click="submitForm">確定</el-button>
        <el-button @click="handleClose">戻る</el-button>
      </div>
  </div>
</template>

<script>
import { addPreview} from "@/api/emailPreview/preview";

export default {
  name: "PreviewAdd",
  dicts: ['email_status'],
  data() {
    return {
      fromRouterPath:'',
      fromRouterQuery:'',
      // フォームパラメータ
      form: {},
      // フォームバリデーションルール
      rules: {
      }
    };
  },
  // ルーティング遷移用（遷移元情報取得）
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

    // 戻る・閉じる処理
    handleClose() {
      // 遷移設定
      const obj = {path: this.fromRouterPath, query: this.fromRouterQuery};
      // 現在のタブを閉じて指定タブを開く
      this.$tab.closeOpenPage(obj);
    },

    /** 送信ボタン処理 */
    submitForm() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          this.$modal.loading();
          addPreview(this.form).then(response => {
            this.$modal.closeLoading();
            this.$modal.msgSuccess("新規作成成功");
            this.handleClose();
          }).catch((err) => console.log(err))
            .finally(() => this.$modal.closeLoading());

        }
      });
    },
  }
};
</script>