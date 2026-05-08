<template>
  <div class="app-container">
    <h4 class="form-header h4">基本情報</h4>
    <el-form ref="form" :model="form" label-width="140px">
      <el-row>
        <el-col :span="8" :offset="1">
          <el-form-item label="氏名" prop="nickName">
            <el-input v-model="form.nickName" disabled />
          </el-form-item>
        </el-col>
        <el-col :span="8" :offset="1">
          <el-form-item label="ログインアカウント" prop="userName">
            <el-input  v-model="form.userName" disabled />
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>

    <h4 class="form-header h4">ロール情報</h4>
    <el-table border v-loading="loading" :row-key="getRowKey" @row-click="clickRow" ref="table" @selection-change="handleSelectionChange" :data="roles.slice((pageNum-1)*pageSize,pageNum*pageSize)">
      <el-table-column label="序号" type="index" align="center">
        <template slot-scope="scope">
          <span>{{(pageNum - 1) * pageSize + scope.$index + 1}}</span>
        </template>
      </el-table-column>
      <el-table-column type="selection" :reserve-selection="true" width="55"></el-table-column>
      <el-table-column label="ロールID" align="center" prop="roleId" />
      <el-table-column label="ロール名" align="center" prop="roleName" />
      <el-table-column label="権限キー" align="center" prop="roleKey" />
      <el-table-column label="作成日時" align="center" prop="createTime" width="180">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.createTime) }}</span>
        </template>
      </el-table-column>
    </el-table>

    <pagination v-show="total>0" :total="total" :page.sync="pageNum" :limit.sync="pageSize" />

    <el-form label-width="100px">
      <el-form-item style="text-align: center;margin-left:-120px;margin-top:30px;">
        <el-button type="primary" @click="submitForm()">送信</el-button>
        <el-button @click="close()">戻る</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import { getAuthRole, updateAuthRole } from "@/api/system/user";

export default {
  name: "AuthRole",
  data() {
    return {
       // ローディングマスク
      loading: true,
      // ページネーション情報
      total: 0,
      pageNum: 1,
      pageSize: 10,
      // 選択ロールID
      roleIds:[],
      // ロール情報
      roles: [],
      // ユーザー情報
      form: {}
    };
  },
  created() {
    const userId = this.$route.params && this.$route.params.userId;
    if (userId) {
      this.loading = true;
      getAuthRole(userId).then((response) => {
        this.form = response.user;
        this.roles = response.roles;
        this.total = this.roles.length;
        this.$nextTick(() => {
          this.roles.forEach((row) => {
            if (row.flag) {
              this.$refs.table.toggleRowSelection(row);
            }
          });
        });
        this.loading = false;
      });
    }
  },
  methods: {
    /** 行データをクリックして選択 */
    clickRow(row) {
      this.$refs.table.toggleRowSelection(row);
    },
    // チェックボックス選択データ
    handleSelectionChange(selection) {
      this.roleIds = selection.map((item) => item.roleId);
    },
    // 選択したデータIDを保存
    getRowKey(row) {
      return row.roleId;
    },
    /** 送信ボタン */
    submitForm() {
      const userId = this.form.userId;
      const roleIds = this.roleIds.join(",");
      updateAuthRole({ userId: userId, roleIds: roleIds }).then((response) => {
        this.$modal.msgSuccess("認可成功");
        this.close();
      });
    },
    /** 閉じるボタン */
    close() {
      const obj = { path: "/system/user" };
      this.$tab.closeOpenPage(obj);
    },
  },
};
</script>
