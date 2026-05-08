<template>
  <el-dialog
    title="案件"
    :visible.sync="visible"
    width="70%"
    append-to-body
    :before-close="handleCancel"
  >
    <el-form
      :model="queryParams"
      ref="queryForm"
      size="small"
      :inline="true"
      v-show="showSearch"
      label-width="108px"
    >
      <el-row :gutter="10">
        <el-col :span="8">
          <el-form-item label="案件番号" prop="negotiationNo">
            <el-input
              v-model="queryParams.negotiationNo"
              clearable
              @keyup.enter.native="handleQuery"
            />
          </el-form-item>
        </el-col>
        <el-col :span="16">
          <el-form-item label="登録日" prop="registrationDate">
            <el-date-picker
              clearable
              v-model="queryParams.registrationDateFrom"
              type="date"
              value-format="yyyy-MM-dd"s
            >
            </el-date-picker>
            ～
            <el-date-picker
              clearable
              v-model="queryParams.registrationDateTo"
              :picker-options="{ disabledDate: disabledEndDate }"
              type="date"
              value-format="yyyy-MM-dd"
            >
            </el-date-picker>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="10">
        <el-col :span="8">
          <el-form-item label="営業担当" prop="responsiblePerson">
            <el-select
              v-model="queryParams.responsiblePerson"
              clearable
              filterable
              placeholder=""
            >
              <el-option
                v-for="user in userList"
                :key="user.userId"
                :label="user.nickName"
                :value="user.userId"
              ></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="得意先番号" prop="customerNo">
            <el-input v-model="queryParams.customerNo" clearable> </el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="得意先名" prop="customerName">
            <el-input
              v-model="queryParams.customerName"
              clearable
              @keyup.enter.native="handleQuery"
            />
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>

    <el-row :gutter="10" class="mb8">
      <div style="float: right !important">
        <el-button
          type="primary"
          icon="el-icon-search"
          size="mini"
          @click="handleQuery"
          >検索
        </el-button>
        <el-button
          icon="el-icon-refresh"
          size="mini"
          style="margin-right: 5px"
          @click="resetQuery"
          >リセット
        </el-button>
      </div>
    </el-row>

    <el-table
      v-loading="loading"
      :data="negotiationsList"
      :ref="refNodes.table"
      highlight-current-row
      @row-click="handleSelect"
      :height="tableHeight"
      border
    >
      <!-- 単一選択 -->
      <el-table-column
        width="40"
        header-align="center"
        align="center"
        fixed="left"
      >
        <template slot-scope="scope">
          <el-radio
            class="radio"
            v-model="radioSelectKey"
            :label="scope.row.fullNumber"
          />
        </template>
      </el-table-column>

      <el-table-column
        label="No."
        type="index"
        width="55"
        :header-align="alignTableConfig.header"
        fixed="left"
        :align="alignTableConfig.lineNo"
      >
        <template slot-scope="scope">
          <span>{{
            (queryParams.pageNum - 1) * queryParams.pageSize + scope.$index + 1
          }}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="案件番号"
        :header-align="alignTableConfig.header"
        :align="alignTableConfig.text"
        fixed="left"
        prop="negotiationNo"
        width="120"
      />
      <el-table-column
        label="子番"
        align="center"
        key="subNumber"
        prop="subNumber"
        :show-overflow-tooltip="true"
      >
      </el-table-column>
      <el-table-column
        label="活動番号"
        align="center"
        key="activityNo"
        prop="activityNo"
        width="180px"
        :show-overflow-tooltip="true"
      >
      </el-table-column>

      <el-table-column
        label="案件名"
        :header-align="alignTableConfig.header"
        :align="alignTableConfig.text"
        show-overflow-tooltip
        prop="negotiationName"
        width="300"
      />
      <el-table-column
        label="活動内容（詳細）"
        :header-align="alignTableConfig.header"
        :align="alignTableConfig.text"
        prop="proposal"
        width="220"
        show-overflow-tooltip
      >
      </el-table-column>
      <el-table-column label="登録日" :header-align="alignTableConfig.header" :align="alignTableConfig.text"
                       prop="registrationDate" width="180">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.registrationDate, '{y}-{m}-{d}') }}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="営業担当"
        :header-align="alignTableConfig.header"
        :align="alignTableConfig.text"
        show-overflow-tooltip
        prop="responsiblePersonName"
        width="180"
      >
      </el-table-column>
      <el-table-column
        label="得意先番号"
        :header-align="alignTableConfig.header"
        :align="alignTableConfig.text"
        prop="customerNo"
        width="100"
      />
      <el-table-column
        label="得意先名"
        :header-align="alignTableConfig.header"
        :align="alignTableConfig.text"
        show-overflow-tooltip
        prop="customerName"
        width="180"
      />
      <el-table-column
        label="業務内容"
        :header-align="alignTableConfig.header"
        :align="alignTableConfig.text"
        show-overflow-tooltip
        prop="businessContent"
        width="300"
      />
      <el-table-column
        label="見積番号"
        :header-align="alignTableConfig.header"
        :align="alignTableConfig.text"
        prop="quotationNo"
        width="160"
      />

      <!-- <el-table-column label="操作" :header-align="alignTableConfig.header" :align="alignTableConfig.action"
                       class-name="small-padding fixed-width" width="180" fixed="right">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-document"
            @click="handleDetail(scope.row)"
            v-hasPermi="['business:negotiations:detail']"
          >詳細
          </el-button>
        </template>
      </el-table-column> -->
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
      <el-button type="primary" @click="handleSubmit" :disabled="!radioSelect"
        >確定</el-button
      >
      <el-button @click="handleCancel">キャンセル</el-button>
    </div>
  </el-dialog>
</template>


<script>
import {
  listNegotiations,
  delNegotiations,
  businessTripList,
} from "@/api/business/negotiations";
import { getUserProfile, listUser } from "@/api/system/user";
export default {
    name: "Negotiations",
    dicts: [
        "sys_user_sex",
        "negotiation_type",
        "negotiation_cat1",
        "negotiation_cat2",
        "negotiation_cat3",
        "negotiation_cat4",
        "negotiation_cat5",
        "negotiation_cat6",
        "negotiation_cat7",
        "delivery_region",
        "importance",
        "difficulty",
        "volume_of_goods",
        "added_value",
        "probability",
    ],
    data() {
        return {
            // 表示状態
            visible: false,

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

            // 初回検索
            isFirstSearch: true,
            // ローディングマスク
            loading: true,
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
            // 案件管理テーブルデータ
            negotiationsList: [],
            // 検索パラメータ
            queryParams: {
                pageNum: 1,
                pageSize: 10,
                negotiationNo: null,
                subNumber: null,
                revisionNumber: null,
                mainResponsible: null,
                managerResponsible: null,
                negotiationType: null,
                registrationDate: null,
                creator: null,
                responsiblePerson: null,
                managementStart: null,
                managementEnd: null,
                customerNo: null,
                customerName: null,
                customerWindowDept: null,
                windowContact: null,
                customerRequestDept: null,
                requestContact: null,
                negotiationCat1: null,
                negotiationCat2: null,
                negotiationCat3: null,
                negotiationCat4: null,
                negotiationCat5: null,
                negotiationCat6: null,
                negotiationCat7: null,
                deliveryRegion: null,
                negotiationName: null,
                businessContent: null,
                requiredElements: null,
                optionalElements: null,
                transactionTerms: null,
                remarks1: null,
                remarks2: null,
                businessStart: null,
                businessEnd: null,
            },
            userList: [],
        };
    },

    /** 計算プロパティ */
    computed: {
        // テーブル高さ
        tableHeight() {
            // 高さ計算
            let height = document.body.clientHeight - 520;
            // テーブル高さ（最小300px）
            return height < 300 ? 300 : height;
        },
    },
    watch: {
        'queryParams.registrationDateFrom': {
            immediate: true,
            handler() {
                this.$forceUpdate();
                if (this.queryParams.registrationDateTo) {
                    if (this.queryParams.registrationDateTo < this.queryParams.registrationDateFrom) {
                        this.queryParams.registrationDateTo = null;
                    }
                }
            }
        },
    },

  created() {
    this.getList();
    //this.getUser();
  },

  methods: {
    // 送信処理
    handleSubmit() {
      // ディープクローン
      let callback = _.cloneDeep(this.radioSelect);
      // コールバック通知
      this.$emit("callback", callback);
      // キャンセル・閉じる
      this.handleCancel();
    },

    open(vo) {
      this.form = vo;
      this.radioSelectKey =  (vo.negotiationNo || "") + (vo.subNumber || "") + (vo.activityNo || "");
      this.visible = true;
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
        negotiationNo: null,
        registrationDate: null,
        responsiblePerson: null,
        customerNo: null,
        customerName: null,
      };
      this.resetForm(this.refNodes.form);
      // 選択データ・回显キークリア
      this.echoKey = null;
      // 選択をクリア
      this.clearSelect();
    },
    // 再読み込み
    reload() {
      this.clearSelection();
      this.queryParams.pageNum = 1;
      this.getList();
    },

    // テーブル選択データをクリア
    clearSelection() {
      this.$refs["dataTable"] && this.$refs["dataTable"].clearSelection();
    },

    /** 案件管理リスト取得 */
    getList() {
      this.loading = true;
      listUser({pageSize: -1}).then((response) => {
        this.userList = response.rows;
      });
      businessTripList(this.queryParams).then((response) => {
        response.rows.forEach((item) => {
          item.fullNumber = (item.negotiationNo || "") + (item.subNumber || "") + (item.activityNo || "");
        });
        this.negotiationsList = response.rows;
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
      this.handleQuery();
    },

    // 複数選択時のデータ取得
    handleSelectionChange(selection) {
      this.ids = selection.map((item) => item.negotiationNo);
      this.single = selection.length !== 1;
      this.multiple = !selection.length;
    },
    /* ------------- テーブル単一選択 ------------- */
    // データ選択
    handleSelect(row) {
      this.radioSelectKey = row.fullNumber;
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
        this.negotiationsList.forEach((item) => {
          // 一致判定
          if (this.echoKey + "" === item.fullNumber + "") {
            // 回显設定
            this.radioSelectKey = item.fullNumber;
            this.radioSelect = item;
          }
        });
      });
    },
    disabledEndDate(time) {
        if (!this.queryParams.registrationDateFrom) return false;
        const startDate = new Date(this.queryParams.registrationDateFrom);
        startDate.setHours(0, 0, 0, 0);
        return time.getTime() < startDate.getTime();
    },
  },
};
</script>
<style lang="scss" scoped>
::v-deep .el-radio__label {
  display: none;
}

::v-deep .tree-wrapper {
  overflow: auto;
}

::v-deep .tree-wrapper::-webkit-scrollbar {
  display: none;
}
</style>
