<template>
  <el-dialog
    title="得意先選択"
    :visible.sync="visible"
    width="60%"
    append-to-body
    :before-close="handleCancel"
  >
    <el-form
      :model="queryParams"
      :ref="refNodes.form"
      size="small"
      :inline="true"
      v-show="showSearch"
      label-width="128px"
    >
      <el-row>
        <el-form-item label="得意先番号" prop="customerNo">
          <el-input
            v-model="queryParams.customerNo"
            clearable
            @keyup.enter.native="handleQuery"
          />
        </el-form-item>
        <el-form-item label="予実得意先番号" prop="yushiNo">
          <el-input
            v-model="queryParams.yushiNo"
            clearable
            @keyup.enter.native="handleQuery"
          />
        </el-form-item>
        <el-form-item label="得意先名称/略名" prop="customerName">
          <el-input
            v-model="queryParams.customerName"
            clearable
            @keyup.enter.native="handleQuery"
          />
        </el-form-item>
      </el-row>
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
    <!-- テーブルデータ -->
    <el-table
      v-loading="loading"
      :data="customerList"
      :ref="refNodes.table"
      highlight-current-row
      @row-click="handleSelect"
      :height="tableHeight"
      border
    >
      <!-- 単一選択 -->
      <el-table-column width="40" header-align="center" align="center" fixed="left">
        <template slot-scope="scope">
          <el-radio
            class="radio"
            v-model="radioSelectKey"
            :label="scope.row.customerNo"
          />
        </template>
      </el-table-column>
      <el-table-column label="No." type="index" width="55" :header-align="alignTableConfig.header"
                       :align="alignTableConfig.lineNo" fixed="left">
        <template slot-scope="scope">
          <span>{{(queryParams.pageNum - 1) * queryParams.pageSize + scope.$index + 1}}</span>
        </template>
      </el-table-column>
      <el-table-column label="得意先番号" :header-align="alignTableConfig.header" :align="alignTableConfig.text" fixed="left"
                       prop="customerNo" width="100"/>
      <el-table-column label="予実得意先番号" :header-align="alignTableConfig.header" :align="alignTableConfig.text"
                       prop="yushiNo" width="120"/>
      <el-table-column label="得意先名称" :header-align="alignTableConfig.header" :align="alignTableConfig.text"
                       prop="customerName" width="300" show-overflow-tooltip/>
      <el-table-column label="得意先略名" :header-align="alignTableConfig.header" :align="alignTableConfig.text"
                       prop="cusNameShort" width="300" show-overflow-tooltip/>
      <el-table-column label="事業所·部署名" :header-align="alignTableConfig.header" :align="alignTableConfig.text"
                       prop="deptName" width="200" show-overflow-tooltip/>
      <el-table-column label="有効期限開始" :header-align="alignTableConfig.header" :align="alignTableConfig.text"
                       prop="expDateStart" width="120">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.expDateStart, '{y}-{m}-{d}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="有効期限終了" :header-align="alignTableConfig.header" :align="alignTableConfig.text"
                       prop="expDateEnd" width="120">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.expDateEnd, '{y}-{m}-{d}') }}</span>
        </template>
      </el-table-column>
    </el-table>
    <pagination
      v-show="total > 0"
      :total="total"
      :page.sync="queryParams.pageNum"
      :limit.sync="queryParams.pageSize"
      @pagination="getList"
    />
    <!-- 下部フッターボタン -->
    <div slot="footer" class="dialog-footer">
      <el-button type="primary" @click="handleSubmit" :disabled="!radioSelect">確定</el-button>
      <el-button @click="handleCancel">キャンセル</el-button>
    </div>
  </el-dialog>
</template>

<script>
    import {listInfo, delInfo} from "@/api/business/info";

    export default {
        name: "CustomerRadio",
        dicts: ['customer_inhouse_class', 'customer_foreign_trade_class'],
        data() {
            return {
                // 表示状態
                visible: false,
                // マスク層
                loading: true,

                // refノード
                refNodes: {
                    form: "queryForm",
                    table: "dataTable",
                },

                // 回显キー
                echoKey: null,

                // 選択データ
                radioSelectKey: null,
                radioSelect: null,

                // 検索条件の表示
                showSearch: true,

                // 総件数
                total: 0,
                customerList: null,
                // 日付範囲
                dateRange: [],
                // クエリパラメータ
                queryParams: {
                    pageNum: 1,
                    pageSize: 10,
                    customerNo: null,
                    yushiNo: null,
                    deptName: null,
                    customerName: null,
                    expDateStart: null,
                    expDateEnd: null,
                    cusNameShort: null,
                    inhouseClass: null,
                    foreignTradeClass: null,
                    invoiceNum: null,
                },
            };
        },

        created() {
            this.getList();
        },

        /** 計算プロパティ */
        computed: {
            // テーブル高さ
            tableHeight() {
                // 高さ計算
                let height = document.body.clientHeight - 502;
                // テーブル高さ（最小300px）
                return height < 300 ? 300 : height;
            },
        },

        methods: {
            /* ------------- 送信処理 ------------- */
            // 送信処理
            handleSubmit() {
                // ディープクローン
                let callback = _.cloneDeep(this.radioSelect);
                // コールバック通知
                this.$emit("callback", callback);
                // キャンセル・閉じる
                this.handleCancel();
            },

            /* ------------- ユーザークエリ ------------- */
            /** ユーザーリストのクエリ */
            getList() {
                this.loading = true;
                listInfo(this.queryParams)
                    .then((response) => {
                        this.customerList = this.transLineNo(response.rows, this.queryParams);
                        this.total = response.total;

                        // 単一選択のレンダリング
                        this.renderRadioSelect();
                    })
                    .catch((err) => console.log(err))
                    .finally(() => (this.loading = false));
            },

            /* ------------- テーブル単一選択 ------------- */
            // データ選択
            handleSelect(row) {
                this.radioSelectKey = row.customerNo;
                this.radioSelect = row;
            },

            // 選択データをクリア
            clearSelect() {
                this.radioSelectKey = null;
                this.radioSelect = null;
            },

            // 単一選択のレンダリング（回显）
            renderRadioSelect() {
                // 回显キーが存在しない場合
                if (!this.echoKey) {
                    return;
                }
                // 回显処理
                this.$nextTick(() => {
                    // 取得データをループ
                    this.customerList.forEach((item) => {
                        // 一致判定
                        if (this.echoKey + "" === item.customerNo + "") {
                            // 回显設定
                            this.radioSelectKey = item.customerNo;
                            this.radioSelect = item;
                        }
                    });
                });
            },
            /* ------------- 検索操作 ------------- */
            /** 検索ボタン操作 */
            handleQuery() {
                this.queryParams.pageNum = 1;
                this.getList();
            },

            /** リセットボタン操作 */
            resetQuery() {
                this.dateRange = [];
                this.resetForm(this.refNodes.form);
                this.handleQuery();
            },

            /* ------------- 基本メソッド ------------- */
            // 開く
            open(echoKey) {
                // 表示状態を変更
                this.visible = true;
                // 選択データ・回显キー設定
                this.echoKey = echoKey;
                // データを取得
                this.getList();
            },

            // キャンセル・閉じる
            handleCancel() {
                // 表示状態を変更
                this.visible = false;
                // クエリパラメータリセット
                this.queryParams = {
                    pageNum: 1,
                    pageSize: 10,
                    customerNo: null,
                    yushiNo: null,
                    deptName: null,
                    customerName: null,
                    expDateStart: null,
                    expDateEnd: null,
                    cusNameShort: null,
                    inhouseClass: null,
                    foreignTradeClass: null,
                    invoiceNum: null,
                };
                this.resetForm(this.refNodes.form);
                // 選択データ・回显キークリア
                this.echoKey = null;
                // 選択をクリア
                this.clearSelect();
            },
        },
    };
</script>
<style lang="scss" scoped>
  ::v-deep .el-radio__label {
    display: none;
  }

  ::v-deep .tree-wrapper {
    overflow: auto
  }

  ::v-deep .tree-wrapper::-webkit-scrollbar {
    display: none
  }
</style>
