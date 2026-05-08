<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" size="small" :inline="true" v-show="showSearch">
      <el-form-item label="部門名" prop="deptName">
        <el-input
          v-model="queryParams.deptName"
          placeholder=""
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <!--<el-form-item label="ステータス" prop="status">-->
      <!--  <el-select v-model="queryParams.status" placeholder="部署ステータス" clearable>-->
      <!--    <el-option-->
      <!--      v-for="dict in dict.type.sys_normal_disable"-->
      <!--      :key="dict.value"-->
      <!--      :label="dict.label"-->
      <!--      :value="dict.value"-->
      <!--    />-->
      <!--  </el-select>-->
      <!--</el-form-item>-->
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
          v-hasPermi="['system:dept:add']"
        >新規追加</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="info"
          plain
          icon="el-icon-sort"
          size="mini"
          @click="toggleExpandAll"
        >展開/折りたたみ</el-button>
      </el-col>
      <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table
      v-if="refreshTable"
      v-loading="loading"
      border
      :data="deptList"
      row-key="deptId"
      :default-expand-all="isExpandAll"
      :tree-props="{children: 'children', hasChildren: 'hasChildren'}"
    >
      <el-table-column prop="deptNo" label="部門ID" width="260"></el-table-column>
      <el-table-column prop="deptName" label="部門名" ></el-table-column>
      <el-table-column prop="orderNum" label="表示順" align="center" width="100"></el-table-column>
<!--      <el-table-column prop="leader" label="部門長" width="260"></el-table-column>-->
<!--      <el-table-column prop="status" label="ステータス" width="100">-->
<!--        <template slot-scope="scope">-->
<!--          <dict-tag :options="dict.type.sys_normal_disable" :value="scope.row.status"/>-->
<!--        </template>-->
<!--      </el-table-column>-->
      <el-table-column label="作成時間" align="center" prop="createTime" width="200">
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
            v-hasPermi="['system:dept:edit']"
          >修正</el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-plus"
            @click="handleAdd(scope.row)"
            v-hasPermi="['system:dept:add']"
          >新規追加</el-button>
          <el-button
            v-if="scope.row.parentId != 0"
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['system:dept:remove']"
          >削除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- 部署の追加または修正ダイアログ -->
    <el-dialog :title="title" :visible.sync="open" width="700px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="120px">
        <el-row>
          <el-col :span="24" v-if="form.parentId !== 0">
            <el-form-item label="上位部署" prop="parentId">
              <treeselect v-model="form.parentId" :options="deptOptions" :normalizer="normalizer" placeholder="" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="部署名" prop="deptName">
              <el-input v-model="form.deptName" placeholder="" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="順序" prop="orderNum">
              <el-input v-model="form.orderNum" placeholder="" />
            </el-form-item>
          </el-col>
<!--          <el-col :span="12">-->
<!--            <el-form-item label="担当者" prop="leader">-->
<!--&lt;!&ndash;              <el-input v-model="form.leader" placeholder="担当者を入力してください" maxlength="20" />&ndash;&gt;-->
<!--              <el-select v-model="form.leader" filterable>-->
<!--                <el-option-->
<!--                  v-for="user in userList"-->
<!--                  :key="user.userId"-->
<!--                  :label="user.nickName"-->
<!--                  :value="String(user.userId)"-->
<!--                ></el-option>-->
<!--              </el-select>-->
<!--            </el-form-item>-->
<!--          </el-col>-->
        </el-row>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm">確定</el-button>
        <el-button @click="cancel">キャンセル</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { listDept, getDept, delDept, addDept, updateDept, listDeptExcludeChild } from "@/api/system/dept";
import Treeselect from "@riophae/vue-treeselect";
import "@riophae/vue-treeselect/dist/vue-treeselect.css";
import { listUser } from "@/api/system/user";

export default {
  name: "Dept",
  dicts: ['sys_normal_disable'],
  components: { Treeselect },
  data() {
    return {
      // マスクレイヤー
      loading: false,
      // 検索条件を表示
      showSearch: true,
      // テーブルツリーデータ
      deptList: [],
      // 部署ツリーオプション
      deptOptions: [],
      // ポップアップタイトル
      title: "",
      // ポップアップを表示するかどうか
      open: false,
      // 展開するかどうか（デフォルトは全展開）
      isExpandAll: true,
      // テーブル再描画状態
      refreshTable: true,
      // クエリパラメータ
      queryParams: {
        deptName: undefined
      },
      // フォームパラメータ
      form: {},
      // フォームバリデーション
      rules: {
        parentId: [
          { required: true, message: "上位部署を入力してください", trigger: "blur" }
        ],
        deptName: [
          { required: true, message: "部署名を入力してください", trigger: "blur" }
        ]
      },
      userList: [],
    };
  },
  async created() {
      // await this.getList();
  },
  methods: {
    /** 部署リストをクエリ */
    async getList() {
      this.loading = true;
      // let vo =  {
      //       pageNum: 1,
      //       pageSize: 99999,
      //   };
      // await listUser(vo).then(response => {
      //     this.userList = response.rows;
      // });
      await listDept(this.queryParams).then(response => {
          this.deptList = this.handleTree(response.data, "deptId");
          this.loading = false;
      });
    },
    /** 部署データ構造を変換 */
    normalizer(node) {
      if (node.children && !node.children.length) {
        delete node.children;
      }
      return {
        id: node.deptId,
        label: node.deptName,
        children: node.children
      };
    },
    // キャンセルボタン
    cancel() {
      this.open = false;
      this.reset();
    },
    // フォームリセット
    reset() {
      this.form = {
        deptId: undefined,
        parentId: undefined,
        deptName: undefined,
        leader: undefined
      };
      this.resetForm("form");
    },
    /** 検索ボタン操作 */
    handleQuery() {
      this.getList();
    },
    /** リセットボタン操作 */
    resetQuery() {
      this.resetForm("queryForm");
      this.deptList = [];
    },
    /** 新規追加ボタン操作 */
    handleAdd(row) {
      this.reset();
      if (row != undefined) {
        this.form.parentId = row.deptId;
      }
      this.open = true;
      this.title = "部署追加";
      listDept().then(response => {
        this.deptOptions = this.handleTree(response.data, "deptId");
      });
    },
    /** 展開/折りたたみ操作 */
    toggleExpandAll() {
      this.refreshTable = false;
      this.isExpandAll = !this.isExpandAll;
      this.$nextTick(() => {
        this.refreshTable = true;
      });
    },
    /** 修正ボタン操作 */
    handleUpdate(row) {
      this.reset();
      getDept(row.deptId).then(response => {
        this.form = response.data;
        this.open = true;
        this.title = "部署修正";
        listDeptExcludeChild(row.deptId).then(response => {
          this.deptOptions = this.handleTree(response.data, "deptId");
          if (this.deptOptions.length == 0) {
            const noResultsOptions = { deptId: this.form.parentId, deptName: this.form.parentName, children: [] };
            this.deptOptions.push(noResultsOptions);
          }
        });
      });
    },
    /** 確定ボタン */
    submitForm: function() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          if (this.form.deptId != undefined) {
            updateDept(this.form).then(response => {
              this.$modal.msgSuccess("保存しました。");
              this.open = false;
              this.getList();
            });
          } else {
            addDept(this.form).then(response => {
              this.$modal.msgSuccess("登録しました。");
              this.open = false;
              this.getList();
            });
          }
        }
      });
    },
    /** 削除ボタン操作 */
    handleDelete(row) {
      this.$modal.confirm('名称が「' + row.deptName + '」のデータを削除してもよろしいですか？').then(function() {
        return delDept(row.deptId);
      }).then(() => {
        this.getList();
        this.$modal.msgSuccess("削除しました。");
      }).catch(() => {});
    }
  }
};
</script>
