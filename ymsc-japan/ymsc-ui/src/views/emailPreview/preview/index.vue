<template>
  <div class="app-container-router">
    <template>
      <el-form :model="queryParams" ref="queryForm" size="small" :inline="true" v-show="showSearch" label-width="108px">
        <el-form-item label="機能モジュール" prop="bizType">
          <el-input
            v-model="queryParams.bizType"
            placeholder="機能モジュールを入力してください"
            clearable
            @keyup.enter.native="handleQuery"
          />
        </el-form-item>
        <el-form-item label="送信状態" prop="status">
          <el-select v-model="queryParams.status" placeholder="送信状態を選択してください" clearable>
            <el-option
              v-for="dict in dict.type.email_status"
              :key="dict.value"
              :label="dict.label"
              :value="dict.value"
            />
          </el-select>
        </el-form-item>
      </el-form>

      <el-row :gutter="10" class="mb8">
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

      <el-table border :height="tableHeight(270)" v-loading="loading" :data="previewList"
                @selection-change="handleSelectionChange" ref="dataTable">
        <el-table-column type="selection" width="55" align="center"/>
        <el-table-column label="テンプレート番号" align="center" prop="tmplCode"/>
        <el-table-column label="タグ" align="center" prop="tabName" show-overflow-tooltip/>
        <el-table-column label="メールタイトル" align="center" prop="title" min-width="120px" show-overflow-tooltip/>
        <el-table-column label="業務ID" align="center" prop="bizId" min-width="120px" show-overflow-tooltip/>
        <el-table-column label="送信状態" min-width="90px" align="center" prop="status">
          <template slot-scope="scope">
            <dict-tag :options="dict.type.email_status" :value="scope.row.status"/>
          </template>
        </el-table-column>
        <el-table-column label="送信回数" align="center" prop="sendCount" min-width="80px"/>
        <el-table-column label="メール内容" align="center" prop="content" min-width="200px" show-overflow-tooltip/>
        <el-table-column label="送信成功時間" align="center" prop="sendSuccessTime">
          <template slot-scope="scope">
            <span>{{ parseTime(scope.row.sendSuccessTime, '{y}-{m}-{d}') }}</span>
          </template>
        </el-table-column>
        <el-table-column label="作成時間" align="center" prop="createTime">
          <template slot-scope="scope">
            <span>{{ parseTime(scope.row.createTime, '{y}-{m}-{d}') }}</span>
          </template>
        </el-table-column>
        <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
          <template slot-scope="scope">
            <el-button
              size="mini"
              type="text"
              icon="el-icon-edit"
              @click="handleUpdate(scope.row)"
              v-hasPermi="['emailPreview:preview:edit']"
            >編集
            </el-button>
            <el-dropdown style="margin-left: 5px">
              <span class='el-dropdown-link'><i class="el-icon-more" style="margin-right:4px "></i>その他<i
                class='el-icon-arrow-down el-icon--right'/></span>
              <el-dropdown-menu slot='dropdown'>
                <el-dropdown-item>
                  <el-button
                    size="mini"
                    type="text"
                    icon="el-icon-delete"
                    @click="handleDelete(scope.row)"
                    v-hasPermi="['emailPreview:preview:remove']"
                  >削除
                  </el-button>
                </el-dropdown-item>
                <el-dropdown-item>
                  <el-button
                    size="mini"
                    type="text"
                    icon="el-icon-s-promotion"
                    @click="sendEmail(scope.row)"
                    v-hasPermi="['emailPreview:preview:email']"
                  >メール送信
                  </el-button>
                </el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
          </template>
        </el-table-column>
      </el-table>

      <!-- <pagination
        v-show="total>0"
        :total="total"
        :page.sync="queryParams.pageNum"
        :limit.sync="queryParams.pageSize"
        @pagination="getList"
      /> -->
    </template>

    <email-preview ref="emailPreview"
                   @submit="submit"
    />

  </div>
</template>

<script>
  import {listPreview, delPreview, sendEmail} from "@/api/emailPreview/preview";
  import {saveBatchEmailPreview} from "@/api/emailPreview/preview"

  export default {
    name: "Preview",
    dicts: ['email_status', 'preview'],
    data() {
      return {
        // 初回検索フラグ
        isFirstSearch: true,
        editableTab: {
          tabName: null,
          tmplCode: null,
          bizId: null
        },
        // サブルートかどうか
        isTwoRouter: false,
        // ローディングマスク
        loading: true,
        emailVisible: false,
        // 選択配列
        ids: [],
        // 単一選択不可
        single: true,
        // 複数選択不可
        multiple: true,
        // 検索条件表示フラグ
        showSearch: true,
        // 総件数
        total: 0,
        // メールプレビューテーブルデータ
        previewList: [],
        // 検索パラメータ
        queryParams: {
          pageNum: 1,
          pageSize: 10,
          bizType: null,
          status: null,
        }
      };
    },

    /* コンポーネント活性化時 */
    activated() {
      // 削除しないでください
      if (!this.isFirstSearch) {
        this.reload();
      }
      this.isFirstSearch = false;
    },

    created() {
      this.getList();
    },

    methods: {
      submit(callback) {
        this.$modal.loading();
        // プレビューデータ保存（データ保存APIを呼び出し）
        saveBatchEmailPreview(callback).then(res => {
          if (res && res.code == '200') {
            this.$modal.msgSuccess("正常終了")
            this.getList();
          } else {
            this.$modal.msgError("操作失敗、再試行してください")
          }
        }).finally(() => this.$modal.closeLoading());
      },
      // 再読み込み処理
      reload() {
        this.clearSelection();
        this.queryParams.pageNum = 1;
        this.getList();
      },

      // テーブル選択データをクリア
      clearSelection() {
        this.$refs["dataTable"] && this.$refs["dataTable"].clearSelection();
      },

      /** メールプレビューリストを検索 */
      getList() {
        this.loading = true;
        listPreview(this.queryParams).then(response => {
          this.previewList = response.rows;
          this.total = response.total;
          this.loading = false;
        });
      },

      /** 検索ボタン処理 */
      handleQuery() {
        this.queryParams.pageNum = 1;
        this.getList();
      },

      /** リセットボタン処理 */
      resetQuery() {
        this.resetForm("queryForm");
        this.handleQuery();
      },

      // チェックボックス選択データ処理
      handleSelectionChange(selection) {
        this.ids = selection.map(item => item.id)
        this.single = selection.length !== 1
        this.multiple = !selection.length
      },

      /** 詳細ボタン処理 */
      handleDetail(row) {
        const router = "/monitor/preview/previewDetail/" + row.id;
        this.$router.push(router);
      },

      /** 新規作成ボタン処理 */
      handleAdd() {
        // TODO 手動でディレクトリルートを追加
        const router = "/monitor/preview/previewAdd";
        this.$router.push(router);
      },

      /** 編集ボタン処理 */
      handleUpdate(row) {
        this.$refs['emailPreview'].init(row.bizId, row.bizType)
      },


      /** 削除ボタン処理 */
      handleDelete(row) {
        const ids = row.id || this.ids;
        this.$modal.confirm('メールプレビュー番号「' + ids + '」のデータを削除してもよろしいですか？').then(function () {
          return delPreview(ids);
        }).then(() => {
          this.getList();
          this.$modal.msgSuccess("削除しました。");
        }).catch(() => {
        });
      },
      /** メール送信処理 **/
      sendEmail(row) {
        this.$modal.confirm('メールプレビュータイトル「' + row.title + '」のデータを送信してもよろしいですか？').then(function () {
          return sendEmail(row.id);
        }).then(() => {
          this.getList();
          this.$modal.msgSuccess("正常終了");
        }).catch(() => {
        });
      },
      /** エクスポートボタン処理 */
      handleExport() {
        this.download('emailPreview/preview/export', {
          ...this.queryParams
        }, `preview_${new Date().getTime()}.xlsx`)
      }
    }
  };
</script>
<style scoped>
  .el-dropdown-link {
    cursor: pointer;
    color: #409EFF;
  }

  .el-icon-arrow-down {
    font-size: 12px;
  }
</style>
