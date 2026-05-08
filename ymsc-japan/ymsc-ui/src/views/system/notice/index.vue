<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" size="small" :inline="true" v-show="showSearch" label-width="138px">
      <el-form-item label="お知らせタイトル" prop="noticeTitle">
        <el-input
          v-model="queryParams.noticeTitle"
          placeholder=""
          clearable
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
            v-for="dict in dict.type.sys_notice_status"
            :key="dict.value"
            :label="dict.label"
            :value="dict.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="お知らせタイプ" prop="noticeType">
        <el-select
          v-model="queryParams.noticeType"
          placeholder=""
          clearable
          style="width: 240px"
        >
          <el-option
            v-for="dict in dict.type.sys_notice_type"
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
          v-hasPermi="['system:notice:add']"
        >新規追加
        </el-button>
      </el-col>
      <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table border v-loading="loading" :data="noticeList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center"/>
      <el-table-column label="お知らせタイトル" align="center" prop="noticeTitle" :show-overflow-tooltip="true"/>
      <el-table-column label="内容" align="center" prop="noticeContent" :show-overflow-tooltip="true"/>
      <el-table-column label="ステータス" align="center" prop="status" width="120">
        <template slot-scope="scope">
          <dict-tag :options="dict.type.sys_notice_status" :value="scope.row.status"/>
        </template>
      </el-table-column>
      <el-table-column label="お知らせタイプ" align="center" prop="noticeType" width="150">
        <template slot-scope="scope">
          <dict-tag :options="dict.type.sys_notice_type" :value="scope.row.noticeType"/>
        </template>
      </el-table-column>
      <el-table-column label="作成時間" align="center" prop="createTime" width="170">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.createTime) }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width" width="150">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row)"
            v-hasPermi="['system:notice:edit']"
          >修正
          </el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['system:notice:remove']"
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

    <!-- お知らせの追加または修正ダイアログ -->
    <el-dialog :title="title" :visible.sync="open" width="780px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="160px">
        <el-row>
          <el-col :span="24">
            <el-form-item label="お知らせタイトル" prop="noticeTitle">
              <el-input v-model="form.noticeTitle" placeholder=""/>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="ステータス">
              <el-radio-group v-model="form.status">
                <el-radio
                  v-for="dict in dict.type.sys_notice_status"
                  :key="dict.value"
                  :label="dict.value"
                >{{dict.label}}
                </el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="お知らせタイプ" prop="noticeType">
              <el-select v-model="form.noticeType" placeholder="">
                <el-option
                  v-for="dict in dict.type.sys_notice_type"
                  :key="dict.value"
                  :label="dict.label"
                  :value="dict.value"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="内容">
              <el-input type="textarea" v-model="form.noticeContent" :min-height="192"/>
            </el-form-item>
          </el-col>
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
    import {listNotice, getNotice, delNotice, addNotice, updateNotice} from "@/api/system/notice";

    export default {
        name: "Notice",
        dicts: ['sys_notice_status', 'sys_notice_type'],
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
                // お知らせテーブルデータ
                noticeList: [],
                // ポップアップタイトル
                title: "",
                // ポップアップを表示するかどうか
                open: false,
                // クエリパラメータ
                queryParams: {
                    pageNum: 1,
                    pageSize: 10,
                    noticeTitle: undefined,
                    noticeType: undefined,
                    createBy: undefined,
                    status: undefined
                },
                // フォームパラメータ
                form: {},
                // フォームバリデーション
                rules: {
                    noticeTitle: [
                        {required: true, message: "お知らせタイトルを入力してください", trigger: "blur"}
                    ],
                }
            };
        },
        created() {
        },
        methods: {
            /** お知らせリストをクエリ */
            getList() {
                this.loading = true;
                listNotice(this.queryParams).then(response => {
                    this.noticeList = response.rows;
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
                    noticeId: undefined,
                    noticeTitle: undefined,
                    noticeType: '01',
                    noticeContent: undefined,
                    status: "0"
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
                this.noticeList = [];
                this.total = 0;
            },
            // チェックボックス選択データ
            handleSelectionChange(selection) {
                this.ids = selection.map(item => item.noticeId)
                this.single = selection.length !== 1
                this.multiple = !selection.length
            },
            /** 新規追加ボタン操作 */
            handleAdd() {
                this.reset();
                this.open = true;
                this.title = "お知らせ追加";
            },
            /** 修正ボタン操作 */
            handleUpdate(row) {
                this.reset();
                const noticeId = row.noticeId || this.ids
                getNotice(noticeId).then(response => {
                    this.form = response.data;
                    this.open = true;
                    this.title = "お知らせ修正";
                });
            },
            /** 確定ボタン */
            submitForm: function () {
                this.$refs["form"].validate(valid => {
                    if (valid) {
                        if (this.form.noticeId != undefined) {
                            updateNotice(this.form).then(response => {
                                this.$modal.msgSuccess("保存しました。");
                                this.open = false;
                                this.getList();
                            });
                        } else {
                            addNotice(this.form).then(response => {
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
                const noticeIds = row.noticeId || this.ids
                this.$modal.confirm('お知らせ番号が"' + noticeIds + '"のデータ項目を削除してもよろしいですか？').then(function () {
                    return delNotice(noticeIds);
                }).then(() => {
                    this.getList();
                    this.$modal.msgSuccess("削除しました。");
                }).catch(() => {
                });
            }
        }
    };
</script>
