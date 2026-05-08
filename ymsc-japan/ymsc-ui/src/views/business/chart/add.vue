<template>
  <div class="app-container-router">
      <el-form ref="form" :model="form" :rules="rules" label-width="108px">
          <!--  タイトルバー  -->
          <title-bar title="基本情報" is-top/>
          <el-row :gutter="10">
            <el-col :span="8">
                <el-form-item label="画像URL" prop="picture">
                  <el-input v-model="form.picture" placeholder="画像URLを入力してください" />
                </el-form-item>
            </el-col>
            <el-col :span="8">
                <el-form-item label="ルート" prop="picctureRoute">
                  <el-input v-model="form.picctureRoute" placeholder="ルートを入力してください" />
                </el-form-item>
            </el-col>
            <el-col :span="8">
                <el-form-item label="ソート" prop="sortId">
                  <el-input v-model="form.sortId" placeholder="ソート番号を入力してください" />
                </el-form-item>
            </el-col>
            <el-col :span="8">
                <el-form-item label="トップページ紹介" prop="text">
                  <el-input v-model="form.text" placeholder="トップページ紹介文を入力してください" />
                </el-form-item>
            </el-col>
            <el-col :span="8">
            </el-col>
            <el-col :span="8">
                <el-form-item label="備考" prop="remark">
                  <el-input v-model="form.remark" placeholder="備考を入力してください" />
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
import { addChart} from "@/api/business/chart";

export default {
  name: "ChartAdd",
  data() {
    return {
      fromRouterPath:'', // 遷移元ルートパス
      fromRouterQuery:'', // 遷移元ルートクエリ
      // フォームパラメータ
      form: {},
      // フォームバリデーションルール
      rules: {
      }
    };
  },
  // 遷移元ルート情報を取得（コンポーネント生成前）
  beforeRouteEnter(to, from, next) {
      next(vm => {
          if(!vm.fromRouterPath) {
              vm.fromRouterPath = from.path;
              vm.fromRouterQuery = from.query;
          }
      });
  },
  created() {
    this.$modal.loading(); // ローディング表示
    this.$modal.closeLoading(); // ローディング非表示
  },
  methods: {

    // 戻る・閉じる処理
    handleClose() {
      // 遷移先設定
      const obj = {path: this.fromRouterPath, query: this.fromRouterQuery};
      // 現在ページを閉じて指定ページを開く
      this.$tab.closeOpenPage(obj);
    },

    // フォーム送信
    submitForm() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          this.$modal.loading(); // ローディング表示
          addChart(this.form).then(response => {
            this.$modal.msgSuccess("新規登録成功"); // 成功メッセージ
            this.handleClose();
          }).catch((err) => console.log(err))
            .finally(() => this.$modal.closeLoading()); // ローディング非表示
        }
      });
    },
  }
};
</script>