<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" size="small" :inline="true" v-show="showSearch" label-width="88px">
      <el-form-item label="辞書名" prop="dictName">
        <el-input
          v-model="queryParams.dictName"
          placeholder=""
          clearable
          style="width: 240px"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="辞書タイプ" prop="dictType">
        <el-input
          v-model="queryParams.dictType"
          placeholder=""
          clearable
          style="width: 240px"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="ステータス" prop="status">
        <el-select
          v-model="queryParams.status"
          placeholder=""
          clearable
          style="width: 240px"
        >
          <el-option
            v-for="dict in dict.type.sys_normal_disable"
            :key="dict.value"
            :label="dict.label"
            :value="dict.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="作成時間">
        <el-date-picker
          v-model="dateRange"
          style="width: 240px"
          value-format="yyyy-MM-dd"
          type="daterange"
          range-separator="-"
          start-placeholder=""
          end-placeholder=""
        ></el-date-picker>
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
          v-hasPermi="['system:dict:add']"
        >新規追加</el-button>
      </el-col>
<!--      <el-col :span="1.5">-->
<!--        <el-button-->
<!--          type="primary"-->
<!--          plain-->
<!--          icon="el-icon-download"-->
<!--          size="mini"-->
<!--          @click="handleExport"-->
<!--          v-hasPermi="['system:dict:export']"-->
<!--        >エクスポート</el-button>-->
<!--      </el-col>-->
      <el-col :span="1.5">
        <el-button
          type="primary"
          plain
          icon="el-icon-refresh"
          size="mini"
          @click="handleRefreshCache"
          v-hasPermi="['system:dict:remove']"
        >キャッシュをリフレッシュ</el-button>
      </el-col>
      <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table border v-loading="loading" :data="typeList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="辞書番号" align="center" prop="dictId" />
      <el-table-column label="辞書名" align="center" prop="dictName" :show-overflow-tooltip="true">
        <template slot-scope="scope">
          <router-link :to="'/system/dict-data/index/' + scope.row.dictId" class="link-type">
            <span>{{ scope.row.dictName }}</span>
          </router-link>
        </template>
      </el-table-column>
      <el-table-column label="辞書タイプ" align="center" prop="dictType" :show-overflow-tooltip="true">
      </el-table-column>
      <el-table-column label="ステータス" align="center" prop="status">
        <template slot-scope="scope">
          <dict-tag :options="dict.type.sys_normal_disable" :value="scope.row.status"/>
        </template>
      </el-table-column>
      <el-table-column label="備考" align="center" prop="remark" :show-overflow-tooltip="true" />
      <el-table-column label="作成時間" align="center" prop="createTime" width="180">
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
            v-hasPermi="['system:dict:edit']"
          >修正</el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['system:dict:remove']"
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

    <!-- 辞書タイプの追加または修正ダイアログ -->
    <el-dialog :title="title" :visible.sync="open" width="500px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="100px">
        <el-form-item label="辞書名" prop="dictName">
          <el-input v-model="form.dictName" placeholder="" />
        </el-form-item>
        <el-form-item label="辞書タイプ" prop="dictType">
          <el-input v-model="form.dictType" placeholder="" :disabled="typeCanEdit" />
        </el-form-item>
        <el-form-item label="ステータス" prop="status">
          <el-radio-group v-model="form.status">
            <el-radio
              v-for="dict in dict.type.sys_normal_disable"
              :key="dict.value"
              :label="dict.value"
            >{{dict.label}}</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="備考" prop="remark">
          <el-input v-model="form.remark" type="textarea" placeholder=""></el-input>
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
import { listType, getType, delType, addType, updateType, refreshCache } from "@/api/system/dict/type";

export default {
  name: "Dict",
  dicts: ['sys_normal_disable'],
  data() {
    return {
      // マスクレイヤー
      loading: false,
      // 選択配列
      ids: [],
      // 単一選択以外は無効
      single: true,
      // 複数選択以外は無効
      multiple: true,
      // 検索条件を表示
      showSearch: true,
      // 総件数
      total: 0,
      // 辞書テーブルデータ
      typeList: [],
      // ポップアップタイトル
      title: "",
      // ポップアップを表示するかどうか
      open: false,
      // 日付範囲
      dateRange: [],
      // クエリパラメータ
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        dictName: undefined,
        dictType: undefined,
        status: undefined
      },
      // フォームパラメータ
      form: {},
      // フォームバリデーション
      rules: {
        dictName: [
          { required: true, message: "辞書名を入力してください", trigger: "blur" }
        ],
        dictType: [
          { required: true, message: "辞書タイプを入力してください", trigger: "blur" }
        ]
      },
      typeCanEdit: false,
    };
  },
  created() {
  },
  methods: {
    /** 辞書タイプリストをクエリ */
    getList() {
      this.loading = true;
      listType(this.addDateRange(this.queryParams, this.dateRange)).then(response => {
          this.typeList = response.rows;
          this.total = response.total;
          this.loading = false;
        }
      );
    },
    // キャンセルボタン
    cancel() {
      this.open = false;
      this.reset();
    },
    // フォームリセット
    reset() {
      this.form = {
        dictId: undefined,
        dictName: undefined,
        dictType: undefined,
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
      this.dateRange = [];
      this.resetForm("queryForm");
      this.typeList = [];
      this.total = 0;
    },
    /** 新規追加ボタン操作 */
    handleAdd() {
      this.reset();
      this.open = true;
      this.typeCanEdit = false;
      this.title = "辞書タイプ追加";
    },
    // チェックボックス選択データ
    handleSelectionChange(selection) {
      this.ids = selection.map(item => item.dictId)
      this.single = selection.length!==1
      this.multiple = !selection.length
    },
    /** 修正ボタン操作 */
    handleUpdate(row) {
      this.reset();
      const dictId = row.dictId || this.ids
      getType(dictId).then(response => {
        this.form = response.data;
        this.open = true;
        this.typeCanEdit = true;
        this.title = "辞書タイプ修正";
      });
    },
    /** 確定ボタン */
    submitForm: function() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          if (this.form.dictId != undefined) {
            updateType(this.form).then(response => {
              this.$modal.msgSuccess("保存しました。");
              this.open = false;
              this.getList();
            });
          } else {
            addType(this.form).then(response => {
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
      const dictIds = row.dictId || this.ids;
      this.$modal.confirm('辞書番号が"' + dictIds + '"のデータ項目を削除してもよろしいですか？').then(function() {
        return delType(dictIds);
      }).then(() => {
        this.getList();
        this.$modal.msgSuccess("削除しました。");
      }).catch(() => {});
    },
    /** エクスポートボタン操作 */
    handleExport() {
      this.download('system/dict/type/export', {
        ...this.queryParams
      }, `type_${new Date().getTime()}.xlsx`)
    },
    /** キャッシュリフレッシュボタン操作 */
    handleRefreshCache() {
      refreshCache().then(() => {
        this.$modal.msgSuccess("リフレッシュ成功");
        this.$store.dispatch('dict/cleanDict');
      });
    },
  }
};
</script>
