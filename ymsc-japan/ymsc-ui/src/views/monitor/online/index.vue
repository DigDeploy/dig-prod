<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" size="small" :inline="true" label-width="68px">
      <el-form-item label="ログインアドレス" prop="ipaddr">
        <el-input
          v-model="queryParams.ipaddr"
          placeholder="ログインアドレスを入力してください"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="ユーザーアカウント" prop="userName">
        <el-input
          v-model="queryParams.userName"
          placeholder="ユーザーアカウントを入力してください"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">検索</el-button>
        <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">リセット</el-button>
      </el-form-item>

    </el-form>
    <el-table
      v-loading="loading"
      :data="list.slice((pageNum-1)*pageSize,pageNum*pageSize)"
      style="width: 100%;"
    >
      <el-table-column label="番号" type="index" align="center">
        <template slot-scope="scope">
          <span>{{(pageNum - 1) * pageSize + scope.$index + 1}}</span>
        </template>
      </el-table-column>
      <el-table-column label="セッション番号" align="center" prop="tokenId" :show-overflow-tooltip="true" />
      <el-table-column label="ユーザーアカウント" align="center" prop="userName" :show-overflow-tooltip="true" />
      <el-table-column label="部署名" align="center" prop="deptName" />
      <el-table-column label="ホスト" align="center" prop="ipaddr" :show-overflow-tooltip="true" />
      <el-table-column label="ログイン場所" align="center" prop="loginLocation" :show-overflow-tooltip="true" />
      <el-table-column label="ブラウザ" align="center" prop="browser" />
      <el-table-column label="オペレーティングシステム" align="center" prop="os" />
      <el-table-column label="ログイン時間" align="center" prop="loginTime" width="180">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.loginTime) }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleForceLogout(scope.row)"
            v-hasPermi="['monitor:online:forceLogout']"
          >強制ログアウト</el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination v-show="total>0" :total="total" :page.sync="pageNum" :limit.sync="pageSize" />
  </div>
</template>

<script>
import { list, forceLogout } from "@/api/monitor/online";

export default {
  name: "Online",
  data() {
    return {
      // マスクレイヤー
      loading: true,
      // 総件数
      total: 0,
      // テーブルデータ
      list: [],
      pageNum: 1,
      pageSize: 10,
      // クエリパラメータ
      queryParams: {
        ipaddr: undefined,
        userName: undefined
      }
    };
  },
  created() {
    this.getList();
  },
  methods: {
    /** オンラインユーザーリストをクエリ */
    getList() {
      this.loading = true;
      list(this.queryParams).then(response => {
        this.list = response.rows;
        this.total = response.total;
        this.loading = false;
      });
    },
    /** 検索ボタン操作 */
    handleQuery() {
      this.pageNum = 1;
      this.getList();
    },
    /** リセットボタン操作 */
    resetQuery() {
      this.resetForm("queryForm");
      this.handleQuery();
    },
    /** 強制ログアウトボタン操作 */
    handleForceLogout(row) {
      this.$modal.confirm('ユーザー名が"' + row.userName + '"のユーザーを強制ログアウトしてもよろしいですか？').then(function() {
        return forceLogout(row.tokenId);
      }).then(() => {
        this.getList();
        this.$modal.msgSuccess("強制ログアウト成功");
      }).catch(() => {});
    }
  }
};
</script>