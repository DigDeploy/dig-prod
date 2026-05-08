<template>
  <div class="app-container-router">
      <el-form ref="form" :model="form" label-width="108px">
          <!--  タイトルバー  -->
          <title-bar title="基本情報" is-top/>
          <el-row :gutter="10">
            <el-col :span="8">
                <el-form-item label="画像URL" >
                  <el-input v-model="form.picture" placeholder="画像URLを入力してください" />
                </el-form-item>
            </el-col>
            <el-col :span="8">
                <el-form-item label="ルート" >
                  <el-input v-model="form.picctureRoute" placeholder="ルートを入力してください" />
                </el-form-item>
            </el-col>
            <el-col :span="8">
                <el-form-item label="ソート" >
                  <el-input v-model="form.sortId" placeholder="ソート番号を入力してください" />
                </el-form-item>
            </el-col>
            <el-col :span="8">
                <el-form-item label="トップページ紹介" >
                  <el-input v-model="form.text" placeholder="トップページ紹介文を入力してください" />
                </el-form-item>
            </el-col>
            <el-col :span="8">
            </el-col>
            <el-col :span="8">
                <el-form-item label="備考" >
                  <el-input v-model="form.remark" placeholder="備考を入力してください" />
                </el-form-item>
            </el-col>
          </el-row>

      </el-form>
      <div class="footer-back">
        <el-button @click="handleClose">戻る</el-button>
      </div>
  </div>
</template>

<script>
import { getChart} from "@/api/business/chart";

export default {
  name: "ChartDetail",
  data() {
    return {
      fromRouterPath:'', // 遷移元ルートパス
      fromRouterQuery:'', // 遷移元ルートクエリ
      // フォームパラメータ
      form: {},
    };
  },
  // 遷移元ルート情報（name用）
  beforeRouteEnter(to, from, next) {
      next(vm => {
          if(!vm.fromRouterPath) {
              vm.fromRouterPath = from.path;
              vm.fromRouterQuery = from.query;
          }
      });
  },
  created() {
    const id = this.$route.params && this.$route.params.id;
    if (id) {
      this.getInfo(id);
    }
  },

  methods: {

    // チャート情報取得
    getInfo(id){
      this.$modal.loading(); // ローディング表示
      getChart(id).then(response => {
          this.form = response.data;
    }).catch((err) => console.log(err))
      .finally(() => this.$modal.closeLoading()); // ローディング非表示
    },

    // 戻る・閉じる処理
    handleClose() {
      // 遷移先設定
      const obj = {path: this.fromRouterPath, query: this.fromRouterQuery};
      // 現在ページを閉じて指定ページを開く
      this.$tab.closeOpenPage(obj);
    },

  }
};
</script>