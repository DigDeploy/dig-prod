<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" size="small" :inline="true" v-show="showSearch" label-width="108px">
      <el-form-item label="年度" prop="date">
        <el-date-picker clearable
                        v-model="queryParams.nendo"
                        type="year"
                        value-format="yyyy"
                        placeholder="">
        </el-date-picker>
      </el-form-item>
      <el-form-item label="日付" prop="date">
        <el-date-picker clearable
                        v-model="queryParams.date"
                        type="date"
                        value-format="yyyy-MM-dd"
                        placeholder="">
        </el-date-picker>
      </el-form-item>
      <el-form-item label="日付タイプ" prop="dateType">
        <el-select v-model="queryParams.dateType" placeholder="" clearable>
          <el-option
            v-for="dict in dict.type.date_type"
            :key="dict.value"
            :label="dict.label"
            :value="dict.value"
          />
        </el-select>
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
        >追加
        </el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="primary"
          plain
          icon="el-icon-upload"
          size="mini"
          @click="handleImport"
        >インポート
        </el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="primary"
          plain
          icon="el-icon-download"
          size="mini"
          @click="handleExport"
          v-hasPermi="['business:workdayConfig:export']"
        >エクスポート
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

    <el-table v-loading="loading" :data="workdayConfigList" border @selection-change="handleSelectionChange"
              ref="dataTable">
      <el-table-column label="No." type="index" width="55" :header-align="alignTableConfig.header"
                       :align="alignTableConfig.lineNo">
        <template slot-scope="scope">
          <span>{{(queryParams.pageNum - 1) * queryParams.pageSize + scope.$index + 1}}</span>
        </template>
      </el-table-column>
      <el-table-column label="日付" :header-align="alignTableConfig.header" :align="alignTableConfig.text" prop="date"
                       width="180">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.date, '{y}-{m}-{d}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="日付タイプ" :header-align="alignTableConfig.header" :align="alignTableConfig.text"
                       prop="dateType">
        <template slot-scope="scope">
          <dict-tag :options="dict.type.date_type" :value="scope.row.dateType"/>
        </template>
      </el-table-column>
      <el-table-column label="備考" :header-align="alignTableConfig.header" :align="alignTableConfig.text" prop="remark"/>
      <el-table-column label="操作" :header-align="alignTableConfig.header" :align="alignTableConfig.action"
                       class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row)"
            v-hasPermi="['business:workdayConfig:edit']"
          >編集
          </el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['business:workdayConfig:remove']"
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
    <el-dialog :title="title" :visible.sync="open" :rule="rules" width="1100px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="138px">
        <el-row :gutter="10">
          <el-col :span="8">
            <el-form-item label="日時" prop="date">
              <el-date-picker clearable
                              v-model="form.date"
                              type="date"
                              value-format="yyyy-MM-dd"
                              placeholder="">
              </el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="日付タイプ" prop="content">
              <el-select v-model="form.dateType" placeholder="">
                <el-option
                  v-for="dict in dict.type.date_type"
                  :key="dict.value"
                  :label="dict.label"
                  :value="dict.value"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="10">
          <el-col :span="24">
            <el-form-item label="備考" prop="remark">
              <el-input v-model="form.remark" type="textarea" placeholder=""/>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm">確定</el-button>
        <el-button @click="cancel">キャンセル</el-button>
      </div>
    </el-dialog>
    <el-dialog :title="upload.title" :visible.sync="upload.open" width="400px" append-to-body>
      <el-upload
        ref="upload"
        :limit="1"
        accept=".xlsx, .xls"
        :headers="upload.headers"
        :action="upload.url + '?updateSupport=' + upload.updateSupport"
        :disabled="upload.isUploading"
        :on-progress="handleFileUploadProgress"
        :on-success="handleFileSuccess"
        :auto-upload="false"
        drag
      >
        <i class="el-icon-upload"></i>
        <div class="el-upload__text">ファイルをここにドラッグ＆ドロップするか、<em>クリックしてアップロード</em></div>
        <div class="el-upload__tip text-center" slot="tip">
          <span>xls、xlsx形式のファイルのみアップロード可能です。</span>
          <el-link type="primary" :underline="false" style="font-size:12px;vertical-align: baseline;" @click="importTemplate">テンプレートをダウンロード</el-link>
        </div>
      </el-upload>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitFileForm">確定</el-button>
        <el-button @click="upload.open = false">キャンセル</el-button>
      </div>
    </el-dialog>
  </div>
</template>


<script>
    import {listWorkdayConfig, delWorkdayConfig,updateWorkdayConfig,addWorkdayConfig,getWorkdayConfig} from "@/api/business/workdayConfig";
    import { getToken } from "@/utils/auth";
    export default {
        name: "WorkdayConfig",
        dicts: ['date_type'],
        data() {
            return {
                // 初回検索
                isFirstSearch: true,
                // ローディングマスク
                loading: false,
                // 選択されたID配列
                ids: [],
                // 単一選択無効
                single: true,
                // 複数選択無効
                multiple: true,
                // 検索条件表示
                showSearch: true,
                // 総件数
                total: 0,
                // 日付管理テーブルデータ
                workdayConfigList: [],
                // 検索パラメータ
                queryParams: {
                    pageNum: 1,
                    pageSize: 10,
                    nendo: new Date(),
                    date: null,
                    dateType: null,
                },
                form: {
                    date: new Date(),
                    dateType: '01',
                    remark: '',
                },
                open: false,
                title:'',
                rules: {
                    date: [
                        {required: true, message: '日付を入力してください', trigger: 'blur'},
                    ],
                    dateType: [
                        {required: true, message: '日付タイプを入力してください', trigger: 'blur'},
                    ],
                },
                // ユーザーインポートパラメータ
                upload: {
                    // ポップアップを表示するかどうか（ユーザーインポート）
                    open: false,
                    // ポップアップタイトル（ユーザーインポート）
                    title: "",
                    // アップロードを無効にするかどうか
                    isUploading: false,
                    // 既に存在するユーザーデータを更新するかどうか
                    updateSupport: 0,
                    // アップロードのリクエストヘッダーを設定
                    headers: { Authorization: "Bearer " + getToken() },
                    // アップロード先URL
                    url: process.env.VUE_APP_BASE_API + "/business/workdayConfig/importData"
                },
            };
        },

        /* アクティベート時 */
        activated() {
            // 削除禁止
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

            /** 日付管理リスト取得 */
            getList() {
                this.loading = true;
                listWorkdayConfig(this.queryParams).then(response => {
                    this.workdayConfigList = response.rows;
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
                this.workdayConfigList = [];
                this.total = 0;
            },

            // 複数選択時のデータ取得
            handleSelectionChange(selection) {
                this.ids = selection.map(item => item.date)
                this.single = selection.length !== 1
                this.multiple = !selection.length
            },


            /** 追加ボタン操作 */
            handleAdd() {
                this.open = true;
                this.title = "日付情報登録";
                this.reset();
            },

            /** 編集ボタン操作 */
            handleUpdate(row) {
                this.reset();
                const id = row.id;
                getWorkdayConfig(id).then(response => {
                    this.form = response.data;
                    this.open = true;
                    this.title = "日付情報修正";
                })
            },

            /** 送信ボタン */
            submitForm() {
                this.$refs["form"].validate(valid => {
                    if (valid) {
                        if (this.form.id != undefined) {
                            updateWorkdayConfig(this.form).then(response => {
                                this.$modal.msgSuccess("保存しました。");
                                this.open = false;
                                this.getList();
                            });
                        } else {
                            addWorkdayConfig(this.form).then(response => {
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
                const ids = row.id || this.ids;
                let that = this;
                that.$modal.confirm('日付 "' + row.date + '" のデータを削除してもよろしいですか？').then(function () {
                    that.$modal.loading();
                    delWorkdayConfig(ids).then(response => {
                        that.getList();
                        that.$modal.msgSuccess("削除しました。");
                    }).catch((err) => console.log(err))
                        .finally(() => that.$modal.closeLoading());
                }).catch(() => {
                });
            },
            // キャンセルボタン
            cancel() {
                this.open = false;
                this.reset();
            },
            reset() {
                this.resetForm("form");
            },

            /** エクスポートボタン操作 */
            handleExport() {
                this.download('business/workdayConfig/export', {
                    ...this.queryParams
                }, `workdayConfig_${new Date().getTime()}.xlsx`)
            },
            /** インポートボタン操作 */
            handleImport() {
                this.upload.title = "ユーザーインポート";
                this.upload.open = true;
            },
            /** テンプレートダウンロード操作 */
            importTemplate() {
                this.download('business/workdayConfig/importTemplate', {
                }, `date_template_${new Date().getTime()}.xlsx`)
            },
            // ファイルアップロード中処理
            handleFileUploadProgress(event, file, fileList) {
                this.upload.isUploading = true;
            },
            // ファイルアップロード成功処理
            handleFileSuccess(response, file, fileList) {
                this.upload.open = false;
                this.upload.isUploading = false;
                this.$refs.upload.clearFiles();
                this.$alert("<div style='overflow: auto;overflow-x: hidden;max-height: 70vh;padding: 10px 20px 0;'>" + response.msg + "</div>", "インポート結果", { dangerouslyUseHTMLString: true });
                this.getList();
            },
            // アップロードファイルを送信
            submitFileForm() {
                this.$refs.upload.submit();
            }
        }
    };
</script>

