<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" size="small" :inline="true" v-show="showSearch" label-width="138px">
      <el-form-item label="テンプレートコード" prop="templateCode">
        <el-input
          v-model="queryParams.templateCode"
          placeholder=""
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="テンプレート名" prop="templateName">
        <el-input
          v-model="queryParams.templateName"
          placeholder=""
          clearable
          @keyup.enter.native="handleQuery"
        />
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
          v-hasPermi="['system:template:add']"
        >新規作成
        </el-button>
      </el-col>
      <div style="float: right !important;">
        <el-button
          type="primary"
          icon="el-icon-search"
          size="mini"
          @click="handleQuery"
        >検索
        </el-button>
        <el-button icon="el-icon-refresh" size="mini" style="margin-right: 5px" @click="resetQuery">リセット
        </el-button>
      </div>
    </el-row>

    <el-table border v-loading="loading" :data="templateList" border @selection-change="handleSelectionChange"
              ref="dataTable">
      <el-table-column type="selection" width="55" align="center"/>
      <el-table-column label="テンプレートコード" align="left" prop="templateCode" width="200"/>
      <el-table-column label="テンプレート名" align="left" prop="templateName"/>
      <el-table-column label="説明" align="left" prop="remark"/>
      <el-table-column label="作成日時" align="left" prop="createTime" width="200">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.createTime, '{y}-{m}-{d} {h}:{i}:{s}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width" width="150">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row)"
            v-hasPermi="['system:template:edit']"
          >更新
          </el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['system:template:remove']"
          >削除
          </el-button>
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
  </div>
</template>

<script>
  import {listTemplate, delTemplate,} from "@/api/system/template";

  export default {
    name: "Template",
    data() {
      return {
        // 二段階ルートかどうか
        isTwoRouter: false,
        // 初回検索
        isFirstSearch: true,
        // ローディングマスク
        loading: false,
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
        // システムメールテンプレートテーブルデータ
        templateList: [],
        // 検索パラメータ
        queryParams: {
          pageNum: 1,
          pageSize: 10,
          templateCode: null,
          templateName: null,
          remark: null,
        }
      };
    },

    /* アクティブ */
    activated() {
      // 削除しない
      if (!this.isFirstSearch) {
        this.reload();
      }
      this.isFirstSearch = false;
    },

    created() {
    },

    methods: {
      // 再読み込み
      reload() {
        this.clearSelection();
        this.queryParams.pageNum = 1;
      },

      // テーブル選択データをクリア
      clearSelection() {
        this.$refs["dataTable"] && this.$refs["dataTable"].clearSelection();
      },

      /** システムメールテンプレートリストを検索 */
      getList() {
        this.loading = true;
        listTemplate(this.queryParams).then(response => {
          this.templateList = response.rows;
          this.total = response.total;
          this.loading = false;
        });
      },

      /** 検索ボタン操作 */
      handleQuery() {
        this.queryParams.pageNum = 1;
        this.getList();
      },

      /** リセットボタン操作 */
      resetQuery() {
        this.resetForm("queryForm");
        this.templateList = [];
        this.total = 0;
      },

      // チェックボックス選択データ
      handleSelectionChange(selection) {
        this.ids = selection.map(item => item.templateId)
        this.single = selection.length !== 1
        this.multiple = !selection.length
      },

      /** 詳細ボタン操作 */
      handleDetail(row) { // 注：元コードでrow引数が欠落していたため補完
        const router = "/system/template/templateDetail/index/" + row.templateId;
        this.$router.push(router);
      },

      /** 新規作成ボタン操作 */
      handleAdd() {
        const router = "/system/template/templateAdd/index";
        this.$router.push(router);
      },

      /** 更新ボタン操作 */
      handleUpdate(row) {
        const router = "/system/template/templateEdit/index/" + row.templateId;
        this.$router.push(router);
      },

      /** 削除ボタン操作 */
      handleDelete(row) {
        this.$modal.confirm('テンプレートコード「' + row.templateCode + '」のデータを削除してもよろしいですか？').then(function() {
          return delTemplate(row.templateId);
        }).then(() => {
          this.getList();
          this.$modal.msgSuccess(this.$YmMessage.getMessage("IN00003"));
        }).catch(() => {
        });
      },

      /** エクスポートボタン操作 */
      handleExport() {
        this.download('system/template/export', {
          ...this.queryParams
        }, `template_${new Date().getTime()}.xlsx`)
      }
    }
  };
</script>
