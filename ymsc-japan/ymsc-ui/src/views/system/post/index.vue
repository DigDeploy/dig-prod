<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" size="small" :inline="true" v-show="showSearch" label-width="68px">
      <el-form-item label="役職コード" prop="postCode">
        <el-input
          v-model="queryParams.postCode"
          placeholder="役職コードを入力してください"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="役職名" prop="postName">
        <el-input
          v-model="queryParams.postName"
          placeholder="役職名を入力してください"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="ステータス" prop="status">
        <el-select v-model="queryParams.status" placeholder="役職ステータス" clearable>
          <el-option
            v-for="dict in dict.type.sys_normal_disable"
            :key="dict.value"
            :label="dict.label"
            :value="dict.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">検索</el-button>
        <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">リセット</el-button>
      </el-form-item>
    </el-form>

    <el-row :gutter="10" class="mb8">
      <el-col :span="1.5">
        <el-button
          type="primary"
          plain
          icon="el-icon-plus"
          size="mini"
          @click="handleAdd"
          v-hasPermi="['system:post:add']"
        >新規作成</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="success"
          plain
          icon="el-icon-edit"
          size="mini"
          :disabled="single"
          @click="handleUpdate"
          v-hasPermi="['system:post:edit']"
        >更新</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="danger"
          plain
          icon="el-icon-delete"
          size="mini"
          :disabled="multiple"
          @click="handleDelete"
          v-hasPermi="['system:post:remove']"
        >削除</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="warning"
          plain
          icon="el-icon-download"
          size="mini"
          @click="handleExport"
          v-hasPermi="['system:post:export']"
        >エクスポート</el-button>
      </el-col>
      <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table border v-loading="loading" :data="postList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="役職ID" align="center" prop="postId" />
      <el-table-column label="役職コード" align="center" prop="postCode" />
      <el-table-column label="役職名" align="center" prop="postName" />
      <el-table-column label="役職順序" align="center" prop="postSort" />
      <el-table-column label="ステータス" align="center" prop="status">
        <template slot-scope="scope">
          <dict-tag :options="dict.type.sys_normal_disable" :value="scope.row.status"/>
        </template>
      </el-table-column>
      <el-table-column label="作成日時" align="center" prop="createTime" width="180">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.createTime) }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row)"
            v-hasPermi="['system:post:edit']"
          >更新</el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['system:post:remove']"
          >削除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination
      v-show="total>0"
      :total="total"
      :page.sync="queryParams.pageNum"
      :limit.sync="queryParams.pageSize"
      @pagination="getList"
    />

    <!-- 役職の追加または編集ダイアログ -->
    <el-dialog :title="title" :visible.sync="open" width="500px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="役職名" prop="postName">
          <el-input v-model="form.postName" placeholder="役職名を入力してください" />
        </el-form-item>
        <el-form-item label="役職コード" prop="postCode">
          <el-input v-model="form.postCode" placeholder="コード名を入力してください" />
        </el-form-item>
        <el-form-item label="役職順序" prop="postSort">
          <el-input-number v-model="form.postSort" controls-position="right" :min="0" />
        </el-form-item>
        <el-form-item label="役職ステータス" prop="status">
          <el-radio-group v-model="form.status">
            <el-radio
              v-for="dict in dict.type.sys_normal_disable"
              :key="dict.value"
              :label="dict.value"
            >{{dict.label}}</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="備考" prop="remark">
          <el-input v-model="form.remark" type="textarea" placeholder="内容を入力してください" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm">確定</el-button>
        <el-button @click="cancel">キャンセル</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { listPost, getPost, delPost, addPost, updatePost } from "@/api/system/post";

export default {
  name: "Post",
  dicts: ['sys_normal_disable'],
  data() {
    return {
      // ローディングマスク
      loading: true,
      // 選択配列
      ids: [],
      // 単一選択でない場合無効
      single: true,
      // 複数選択でない場合無効
      multiple: true,
      // 検索条件を表示
      showSearch: true,
      // 総件数
      total: 0,
      // 役職テーブルデータ
      postList: [],
      // ポップアップタイトル
      title: "",
      // ポップアップを表示するかどうか
      open: false,
      // 検索パラメータ
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        postCode: undefined,
        postName: undefined,
        status: undefined
      },
      // フォームパラメータ
      form: {},
      // フォーム検証
      rules: {
        postName: [
          { required: true, message: "役職名を入力してください", trigger: "blur" }
        ],
        postCode: [
          { required: true, message: "役職コードを入力してください", trigger: "blur" }
        ],
        postSort: [
          { required: true, message: "役職順序を入力してください", trigger: "blur" }
        ]
      }
    };
  },
  created() {
    this.getList();
  },
  methods: {
    /** 役職リストを検索 */
    getList() {
      this.loading = true;
      listPost(this.queryParams).then(response => {
        this.postList = response.rows;
        this.total = response.total;
        this.loading = false;
      });
    },
    // キャンセルボタン
    cancel() {
      this.open = false;
      this.reset();
    },
    // フォームリセット
    reset() {
      this.form = {
        postId: undefined,
        postCode: undefined,
        postName: undefined,
        postSort: 0,
        status: "0",
        remark: undefined
      };
      this.resetForm("form");
    },
    /** 検索ボタン操作 */
    handleQuery() {
      this.queryParams.pageNum = 1;
      this.getList();
    },
    /** リセットボタン操作 */
    resetQuery() {
      this.resetForm("queryForm");
      this.handleQuery();
    },
    // チェックボックス選択データ
    handleSelectionChange(selection) {
      this.ids = selection.map(item => item.postId)
      this.single = selection.length!=1
      this.multiple = !selection.length
    },
    /** 新規作成ボタン操作 */
    handleAdd() {
      this.reset();
      this.open = true;
      this.title = "役職の追加";
    },
    /** 更新ボタン操作 */
    handleUpdate(row) {
      this.reset();
      const postId = row.postId || this.ids
      getPost(postId).then(response => {
        this.form = response.data;
        this.open = true;
        this.title = "役職の更新";
      });
    },
    /** 送信ボタン */
    submitForm: function() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          if (this.form.postId != undefined) {
            updatePost(this.form).then(response => {
              this.$modal.msgSuccess("保存しました。");
              this.open = false;
              this.getList();
            });
          } else {
            addPost(this.form).then(response => {
              this.$modal.msgSuccess("新規作成成功");
              this.open = false;
              this.getList();
            });
          }
        }
      });
    },
    /** 削除ボタン操作 */
    handleDelete(row) {
      const postIds = row.postId || this.ids;
      this.$modal.confirm('役職IDが「' + postIds + '」のデータを削除してもよろしいですか？').then(function() {
        return delPost(postIds);
      }).then(() => {
        this.getList();
        this.$modal.msgSuccess("削除しました。");
      }).catch(() => {});
    },
    /** エクスポートボタン操作 */
    handleExport() {
      this.download('system/post/export', {
        ...this.queryParams
      }, `post_${new Date().getTime()}.xlsx`)
    }
  }
};
</script>
