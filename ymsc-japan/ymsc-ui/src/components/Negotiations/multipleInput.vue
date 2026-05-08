<template>
  <!-- 入力框 -->
  <el-input
    type="text"
    readonly
    :placeholder="placeholder"
    :disabled="disabled"
    :style="dynamicAttr"
    class="dept-user"
    :class="[{'dept-user-preview':showPreview},{'dept-user-disabled':disabled}]"
  >

    <!-- tags表示 -->
    <div
      v-if="showPreview"
      slot="prepend"
      class="prepend-width"
    >
      <!-- 確定済み項目 -->
      <el-tag size="small" v-for="tag in previewTags" :key="tag.negotiationNo" type="info"
              :closable="!disabled"
              @close="closeTag(tag.negotiationNo)" class="user-tag"
              :title="`案件:${tag.negotiationNoStr}|子番:${tag.subNumber}|案件名:${tag.negotiationName}|活動:${tag.activityNo}`">
        <span style="color: #f97316">案件:{{ tag.negotiationNoStr }}</span>
        <span style="color: #909399; font-size: 14px; margin: 0 4px">|</span>
        <span style="color: #409eff">子番:{{ tag.subNumber }}</span>
        <span style="color: #909399; font-size: 14px; margin: 0 4px">|</span>
        <span style="color: #e83e8c">案件名:{{ tag.negotiationName }}</span>
        <span style="color: #909399; font-size: 14px; margin: 0 4px">|</span>
        <span style="color: #67c23a">活動:{{ tag.activityNo }}</span>
      </el-tag>

      <!-- 追加数量 -->
      <el-tag v-if="whetherExceed" icon="el-icon-plus" size="small"
              type="info" class="user-tag user-tag-pointer" @click="visibleSearch">
        <!-- 追加数量 -->
        <i class="el-icon-circle-plus">{{exceedPreviewSize}}</i>
      </el-tag>
    </div>

    <!-- input框後置内容 -->
    <el-button
      slot="append"
      icon="el-icon-search"
      class="input-icon-btn"
      @click="visibleSearch"
    >
      <!-- ダイアログ -->
      <el-dialog
        title="案件選択"
        :visible.sync="visible"
        width="75%"
        :append-to-body="appendToBody"
        @open="handleOpen"
        :before-close="handleCancel"
      >
        <el-row :gutter="24">
          <!-- ユーザーデータ 検索 -->
          <el-col :span="24" :xs="24">
            <el-form
              :model="queryParams"
              :ref="refNodes.form"
              size="small"
              :inline="true"
              v-show="showSearch"
              label-width="98px"
            >
              <el-form-item label="案件番号" prop="negotiationNo">
                <el-input
                  v-model="queryParams.negotiationNo"
                  placeholder=""
                  clearable
                  style="width: 240px"
                  @keyup.enter.native="handleQuery"
                />
              </el-form-item>
              <el-form-item label="活動No" prop="activityNo">
                <el-input
                  v-model="queryParams.activityNo"
                  placeholder=""
                  clearable
                  style="width: 240px"
                  @keyup.enter.native="handleQuery"
                />
              </el-form-item>
              <el-form-item label="得意先番号" prop="customerNo">
                <el-input
                  v-model="queryParams.customerNo"
                  placeholder=""
                  clearable
                  style="width: 240px"
                  @keyup.enter.native="handleQuery"
                />
              </el-form-item>
              <el-form-item label="得意先名" prop="customerName">
                <el-input
                  v-model="queryParams.customerName"
                  placeholder=""
                  clearable
                  style="width: 240px"
                  @keyup.enter.native="handleQuery"
                />
              </el-form-item>

              <el-form-item style="float: right !important">
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
                  @click="resetQuery"
                  >リセット
                </el-button>
              </el-form-item>
            </el-form>

            <!-- テーブルデータ -->
            <el-table
              v-loading="loading"
              :data="negotiationsList"
              :ref="refNodes.table"
              row-key="negotiationNo"
              @selection-change="handleSelectionChange"
              @row-click="(row, column, event) => { if(!disabled) appendSelection(row, column, event) }"
              :height="tableHeight"
              stripe
              border
            >
              <!-- チェックボックス -->
              <el-table-column
                type="selection"
                width="55"
                header-align="center"
                align="center"
                :reserve-selection="true"
                :selectable="handleSelectionEnable"
              />
              <el-table-column label="No." type="index" width="55" :header-align="alignTableConfig.header"
                               :align="alignTableConfig.lineNo">
                <template slot-scope="scope">
                  <span>{{(queryParams.pageNum - 1) * queryParams.pageSize + scope.$index + 1}}</span>
                </template>
              </el-table-column>
              <el-table-column
                label="案件番号"
                width="110px"
                align="center"
                key="negotiationNo"
                prop="negotiationNo"
                :show-overflow-tooltip="true"
              >
                <template #default="scope">
                  <span style="color: #f97316">{{
                    scope.row.negotiationNoStr
                  }}</span>
                </template>
              </el-table-column>

              <el-table-column
                label="子番"
                align="center"
                key="subNumber"
                prop="subNumber"
                width="70px"
                :show-overflow-tooltip="true"
              >
                <template #default="scope">
                  <span style="color: #409eff">{{ scope.row.subNumber }}</span>
                </template>
              </el-table-column>
              <el-table-column
                label="活動No"
                width="70px"
                align="center"
                key="activityNo"
                prop="activityNo"
                :show-overflow-tooltip="true"
              >
                <template #default="scope">
                  <span style="color: #67c23a">{{ scope.row.activityNo }}</span>
                </template>
              </el-table-column>
              <el-table-column
                label="案件名"
                align="center"
                key="negotiationName"
                prop="negotiationName"
                width="150px"
                :show-overflow-tooltip="true"
              >
                <template #default="scope">
                  <span style="color: #e83e8c">{{
                    scope.row.negotiationName
                  }}</span>
                </template>
              </el-table-column>
              <el-table-column
                label="登録日"
                align="center"
                key="registrationDate"
                prop="registrationDate"
                width="100px"
                :show-overflow-tooltip="true"
              />
              <!-- <el-table-column
                label="営業担当"
                align="center"
                key="responsiblePerson"
                prop="responsiblePerson"
                width="180"
                :show-overflow-tooltip="true"
              /> -->
              <el-table-column
                label="営業担当"
                :header-align="alignTableConfig.header"
                :align="alignTableConfig.text"
                prop="responsiblePerson"
                show-overflow-tooltip
              >
                <template slot-scope="scope">
                  <span>{{ getUserName(scope.row.responsiblePerson) }}</span>
                </template>
              </el-table-column>
              <el-table-column
                label="得意先番号"
                align="center"
                key="customerNo"
                prop="customerNo"
                width="100px"
                :show-overflow-tooltip="true"
              />
              <el-table-column
                label="得意先名"
                align="center"
                key="customerName"
                prop="customerName"
                :show-overflow-tooltip="true"
              />
              <el-table-column
                label="業務内容"
                align="center"
                key="businessContent"
                prop="businessContent"
                :show-overflow-tooltip="true"
              />
              <el-table-column
                label="見積番号"
                align="center"
                key="quotationNo"
                prop="quotationNo"
                width="140px"
                :show-overflow-tooltip="true"
              />
            </el-table>

            <pagination
              v-show="total > 0"
              :total="total"
              :page.sync="queryParams.pageNum"
              :limit.sync="queryParams.pageSize"
              @pagination="getList"
            />
          </el-col>
        </el-row>

        <!-- 下部フッターボタン -->
        <div slot="footer" class="dialog-footer">
          <template v-if="isShowSubmit">
            <el-button v-if="!disabled" type="primary" @click="handleSubmit">
              確定
            </el-button>
            <el-button @click="handleCancel">キャンセル</el-button>
          </template>
          <template v-else>
            <el-button @click="handleCancel">閉じる</el-button>
          </template>
        </div>
      </el-dialog>
    </el-button>
  </el-input>
</template>

<script>
import { getUserProfile, listUser } from "@/api/system/user";
import { businessTripList,businessTripListByNegotiationNos } from "@/api/business/negotiations";
import Treeselect from "@riophae/vue-treeselect";
import "@riophae/vue-treeselect/dist/vue-treeselect.css";

export default {
  name: "NegotiationsMultipleInput",
  dicts: ["sys_normal_disable"],
  components: { Treeselect },
  model: {
    prop: "value",
    event: "input"
  },
  props: {
    value: {
      type: [String, Number],
      required: true,
      default: ''
    },

    disabled: {
      type: Boolean,
      default: false
    },

    placeholder: {
      type: String,
      default: '',
    },

    appendToBody: {
      type: Boolean,
      default: true
    },

    // プレビュー設定規模（tag表示数）
    previewSize: {
      type: Number,
      default: 2
    },
  },
  data() {
    return {
      negotiationNos: "",
      // 表示状態
      visible: false,
      // 初回レンダリング
      firstRender: true,
      // ダイアログ遅延ロード対策
      dialogRender: false,

      // マスク層
      loading: true,

      // refノード
      refNodes: {
        form: "queryForm",
        table: "dataTable",
        tree: "tree"
      },

      // 選択配列
      ids: [],
      // 選択配列
      negotiationsList: [],
      multipleSelections: [],
      // 単一選択不可
      single: true,
      // 複数選択不可
      multiple: true,

      // 検索条件の表示
      showSearch: true,

      // 確定ボタンの表示/非表示
      isShowSubmit: true,

      // 総件数
      total: 0,
      // ユーザーテーブルデータ
      userList: [],

      // 部署ツリーオプション
      deptOptions: [],
      // デフォルトプロパティ
      defaultProps: {
        children: "children",
        label: "label",
      },

      // 部署名 部署ツリー検索
      deptName: undefined,
      // 日付範囲
      dateRange: [],
      // クエリパラメータ
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        userName: undefined,
        phonenumber: undefined,
        status: undefined,
        deptId: undefined,
        nickName: undefined,
        negotiationNo: undefined,
        activityNo: undefined,
        customerNo: undefined,
        customerName: undefined,
      },
      // 列情報
      columns: [
        { key: 0, label: `ユーザーID`, visible: true },
        { key: 1, label: `ユーザー名`, visible: true },
        { key: 2, label: `ニックネーム`, visible: true },
        { key: 3, label: `部署`, visible: true },
        { key: 4, label: `携帯電話番号`, visible: true },
        { key: 5, label: `ステータス`, visible: true },
        { key: 6, label: `作成日時`, visible: true },
      ],

      // 送信済み項目
      submitSelections: [],
      submitSelectionsCopy: [],
      user: {},
      userList: [],
    };
  },

  /** 作成 */
  created() {
    // 部署ツリーを取得
    // this.getDeptTree();
  },

  /** マウント */
  mounted() {
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

    // tagsの表示判定
    showPreview() {
      return this.submitSelections && this.submitSelections.length;
    },

    // プレビューtagデータ
    previewTags() {
      // プレビュー設定規模を超える場合の表示制御
      if (this.submitSelections.length > this.previewSize) {
        return this.submitSelections.filter((obj, index) => index < this.previewSize);
      } else {
        return this.submitSelections;
      }
    },

    // プレビュー設定規模の超過判定
    whetherExceed() {
      return this.submitSelections && this.submitSelections.length > this.previewSize;
    },

    // プレビュー設定規模超過分 残りtag数
    exceedPreviewSize() {
      return this.submitSelections.length - this.previewSize;
    },

    // 動的スタイル属性
    dynamicAttr() {
      // デフォルト動的スタイル属性
      let attr = {
        "--prependColor": "#FFF",
      };

      // 無効状態の場合
      if (this.disabled) {
        attr['--prependColor'] = "#F5F7FA";
      }

      // 返却
      return attr;
    }
  },

  /** 監視 */
  watch: {
    value: {
      immediate: true,
      handler(val) {
          if (val) {
              this.echoList(val);
          } else {
              this.submitSelections = [];
              this.multipleSelections = [];
              this.ids = [];
          }
      }
    },
    // 名称で部署ツリーをフィルタリング
    deptName(val) {
      this.$refs.tree.filter(val);
    },
  },

  /** メソッド関数 */
  methods: {
    getUserName(loginId) {
      const user = this.userList.find(
        (item) => String(item.userId) === String(loginId)
      );
      return user ? user.nickName : loginId;
    },
    getUser() {
      getUserProfile().then((response) => {
        this.user = response.data;
      });
      listUser({ pageSize: -1 }).then((response) => {
        this.userList = response.rows;
      });
    },
    clearTag() {
      this.submitSelections = [];
      this.submitSelectionsCopy = [];
    },
    /* ------------- 共通処理 ------------- */
    // クエリで多肢選択テーブルを展開
    visibleSearch() {
      // ダイアログ表示状態
      this.visible = true;
      // ダイアログ遅延ロード制御
      this.dialogRender = true;
      // リセット
      this.resetQuery();
      // 強制レンダリング完了フラグ
      this.firstRender = false;
      this.getUser();
    },

    /* ------------- 送信処理 ------------- */
    // 送信処理
    handleSubmit() {
      // 送信済み多肢選択に保存
      this.submitSelections = _.cloneDeep(this.multipleSelections);
      // コールバック通知
      this.$emit("submitSelections", this.submitSelections);
      // 受領確認を送信
      this.bundleReceipt();
      // ダイアログを閉じる
      this.handleCancel();
    },

    // 受領確認を送信
    bundleReceipt() {
      this.$emit(
        "input",
        this.submitSelections.map((obj) => obj["negotiationNo"]).join()
      );
      this.$emit("callback", _.cloneDeep(this.submitSelections));
    },

    // 選択項目を取得
    getSelections() {
      return this.submitSelections;
    },

    /* ------------- テーブルチェックボックス ------------- */
    // チェックボックス選択データ
    handleSelectionChange(selection) {
      this.ids = selection.map((item) => item.negotiationNo);
      this.multipleSelections = selection;
      this.single = selection.length !== 1;
      this.multiple = !selection.length;
    },

    // 多肢選択を追加
    appendSelection(row, column, event) {
      // データ回显
      this.$nextTick(() => {
        // 選択状態を切り替え
        this.$refs[this.refNodes.table].toggleRowSelection(row);
      });
    },

    // テーブル多肢選択のレンダリング
    renderSelections() {
      // DOM更新を非同期で実行
      this.$nextTick(() => {

        // 未レンダリングの場合
        if (!this.$refs[this.refNodes.table]) {
          return;
        }

        // テーブル多肢選択をクリア
        this.clearSelection();

        // 送信済み以外の選択を除外
        this.submitSelectionsCopy.forEach(row => {
          this.$refs[this.refNodes.table].toggleRowSelection(row,true);
        });
      });
    },

    // チェックボックス活性イベント
    handleSelectionEnable() {

      return !this.disabled;
    },

    // テーブル選択データをクリア
    clearSelection() {
      this.$refs[this.refNodes.table].clearSelection();
    },

    // tagを閉じる
    closeTag(negotiationNo) {
      /// インデックスを検索
      let index = this.submitSelections.findIndex(
        (obj) => obj.negotiationNo === negotiationNo
      );

      // 削除
      index === -1 || this.submitSelections.splice(index, 1);

      // 受領確認を送信
      this.bundleReceipt();
    },

    /* ------------- ユーザークエリ ------------- */
    // ユーザーリストのクエリ
    getList() {
      this.loading = true;
      businessTripList(this.addDateRange(this.queryParams, this.dateRange))
        .then(
          (response) => {
            this.negotiationsList = response.rows;
            this.total = response.total;
            this.loading = false;

            if (this.negotiationsList && this.negotiationsList.length > 0) {
              this.negotiationsList.forEach((item) => {
                item.negotiationNoStr = item.negotiationNo;
                item.negotiationNo = `${item.negotiationNo || ""}|${
                  item.subNumber || ""
                }|${item.activityNo || ""}`;
                item.negotiationNoName = `案件:${
                  item.negotiationNoStr || ""
                }|子番:${item.subNumber || ""}|案件名:${
                  item.negotiationName || ""
                }|活動:${item.activityNo || ""}`;
              });
            }
          }
        )
        .catch(err => console.log(err))
        .finally(() => this.loading = false);
    },

    // 表示クエリ（選択済み回显）
    echoList(negotiationNos) {
      // ユーザーIDが存在しない場合
      if (!negotiationNos.length) {
        return;
      }
      this.negotiationsList = []
      negotiationNos = negotiationNos.replace(/\|/g, '');
      businessTripListByNegotiationNos(negotiationNos)
        .then(
          (response) => {
            // データを代入
            this.submitSelections = response.data;
            this.submitSelectionsCopy = response.data;
            this.submitSelections.forEach((item) => {
                item.negotiationNoStr = item.negotiationNo;
                item.negotiationNo = `${item.negotiationNo || ""}|${
                  item.subNumber || ""
                }|${item.activityNo || ""}`;
                item.negotiationNoName = `案件:${
                  item.negotiationNoStr || ""
                }|子番:${item.subNumber || ""}|案件名:${
                  item.negotiationName || ""
                }|活動:${item.activityNo || ""}`;
            });
            // テーブル多肢選択のレンダリング
            this.renderSelections();
          }
        )
        .catch(err => console.log(err))
    },

    /* ------------- ツリーコンポーネント ------------- */
    // 部署ドロップダウンツリー構造のクエリ
    getDeptTree() {
      deptTreeSelect().then((response) => {
        this.deptOptions = response.data;
      });
    },

    // ノードのフィルタリング
    filterNode(value, data) {
      if (!value) return true;
      return data.label.indexOf(value) !== -1;
    },

    // ノードクリックイベント
    handleNodeClick(data) {
      this.queryParams.deptId = data.id;
      this.handleQuery();
    },

    /* ------------- 検索操作 ------------- */
    // 検索ボタン操作
    handleQuery() {
      this.queryParams.pageNum = 1;
      this.getList();
    },

    // リセットボタン操作
    resetQuery() {
      this.dateRange = [];
      this.resetForm(this.refNodes.form);
      this.queryParams.deptId = undefined;
      this.$refs[this.refNodes.tree] && this.$refs[this.refNodes.tree].setCurrentKey(null);
      this.handleQuery();
    },

    /* ------------- 基本メソッド ------------- */
    // 開く
    open(echoIds, isShow) {
      // 表示状態を変更
      this.visible = true;
      // 確定ボタンの表示/非表示
      this.isShowSubmit = isShow;
      // 部署ツリーを取得
      this.getDeptTree();
      // データを取得
      this.getList();
      // 回显
      this.echoList(echoIds)
      this.getUser();
    },

    // キャンセル・閉じる
    handleCancel() {
      // 表示状態を変更
      this.visible = false;
      // 部署ツリー検索をクリア
      this.deptName = null;
      // 検索条件をクリア
      this.dateRange = [];
      this.resetForm(this.refNodes.form);
      this.queryParams.deptId = undefined;
      this.$refs[this.refNodes.tree].setCurrentKey(null);
      // チェックボックス選択をクリア
      this.clearSelection();
    },

    // ダイアログ開くコールバック
    handleOpen() {
      this.$nextTick(() => this.renderSelections());
    },
  },
};
</script>
<style lang="scss" scoped>
::v-deep.dept-user {

  .el-input-group__append{
    background-color: #1890ff !important;
    border-color: #1890ff;
    color: white;
  }

  .el-input__inner:focus {
    border-color: #DCDFE6
  }

  .el-input-group__prepend {
    background-color: var(--prependColor);
    width: 100%;
  }

  .user-tag {
    margin: 1px 3px;
    max-width: 400px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .user-tag-pointer {
    cursor: pointer;
  }

  .placeholder {
    padding-left: 5px;
    color: #C0C4CC;
  }

  .input-icon-btn [class*=el-icon-] + span {
    margin-left: 0;
  }
}

::v-deep.dept-user-preview .el-input__inner {
  border-left: 0 !important;
}

::v-deep .tree-wrapper {
  overflow: auto
}

::v-deep .tree-wrapper::-webkit-scrollbar {
  display: none
}
</style>
