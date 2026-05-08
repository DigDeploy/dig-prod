<template>
  <div class="app-container-router">
<!--      <el-form ref="form" :model="form" label-width="108px">-->
          <!--  タイトルバー  -->
          <title-bar title="基本情報" is-top/>
        <el-descriptions class="margin-top" :column="3" border>
          <el-descriptions-item>
            <template slot="label">
              メッセージ内容
            </template>
            {{ form.noticeContent }}
          </el-descriptions-item>
          <el-descriptions-item>
            <template slot="label">
              送信者
            </template>
            {{ form.sender }}
          </el-descriptions-item>
          <el-descriptions-item>
            <template slot="label">
              受信者
            </template>
            {{ form.receiver }}
          </el-descriptions-item>
        </el-descriptions>
<!--          <el-row :gutter="10">-->
<!--            <el-col :span="8">-->
<!--            </el-col>-->
<!--            <el-col :span="8">-->
<!--                <el-form-item label="メッセージ内容">-->
<!--                  <editor v-model="form.noticeContent" :min-height="192" disabled="true" />-->
<!--                </el-form-item>-->
<!--            </el-col>-->
<!--            <el-col :span="8">-->
<!--            </el-col>-->
<!--            <el-col :span="8">-->
<!--                <el-form-item label="送信者ID" >-->
<!--                  <el-input v-model="form.sender" type="textarea" placeholder="内容を入力してください" disabled="true"  />-->
<!--                </el-form-item>-->
<!--            </el-col>-->
<!--            <el-col :span="8">-->
<!--                <el-form-item label="受信者ID" >-->
<!--                  <el-input v-model="form.receiver" type="textarea" placeholder="内容を入力してください" />-->
<!--                </el-form-item>-->
<!--            </el-col>-->
<!--&lt;!&ndash;            <el-col :span="8">&ndash;&gt;-->
<!--&lt;!&ndash;                <el-form-item label="部署ID" >&ndash;&gt;-->
<!--&lt;!&ndash;                  <el-input v-model="form.deptId" placeholder="部署IDを入力してください" />&ndash;&gt;-->
<!--&lt;!&ndash;                </el-form-item>&ndash;&gt;-->
<!--&lt;!&ndash;            </el-col>&ndash;&gt;-->
<!--            <el-col :span="8">-->
<!--                <el-form-item label="備考" >-->
<!--                  <el-input v-model="form.remark" placeholder="備考を入力してください" />-->
<!--                </el-form-item>-->
<!--            </el-col>-->
<!--          </el-row>-->

<!--      </el-form>-->
      <div class="footer-back">
        <el-button @click="handleClose">戻る</el-button>
      </div>
  </div>
</template>

<script>
import { getNoticeBusiness, listRead, updateNoticeBusiness } from '@/api/system/noticeBusiness'

export default {
  name: "NoticeBusinessDetail",
  data() {
    return {
      fromRouterPath:'',
      fromRouterQuery:'',
      // フォームパラメータ
      form: {},
    };
  },
  // 遷移元のルート情報
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
      this.updateNotice(id);
    }
  },

  methods: {
    getList() {
      listRead().then(response => {
        this.$root.notifications = response.data;
        this.$root.noticeNum = response.data.length;
      });
    },
    updateNotice(id){
      updateNoticeBusiness({id:id,status:1}).then(response => {
        if(response.data){
          this.getList()
        }
      })
    },
    getInfo(id){
      this.$modal.loading();
      getNoticeBusiness(id).then(response => {
          this.form = response.data;
    }).catch((err) => console.log(err))
      .finally(() => this.$modal.closeLoading());
    },

    // 戻る・閉じる
    handleClose() {
      // 遷移設定
      const obj = {path: this.fromRouterPath, query: this.fromRouterQuery};
      // 現在のタブを閉じて指定タブを開く
      this.$tab.closeOpenPage(obj);
    },

  }
};
</script>