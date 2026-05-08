<template>
  <el-dialog
    title="ユーザー選択"
    :visible.sync="visible"
    width="100%"
    append-to-body
  >
    <el-row :gutter="20">
      <!-- 部署データ -->
      <el-col :span="4" :xs="24">
        <div class="head-container">
          <el-input
            v-model="deptName"
            placeholder=""
            clearable
            size="small"
            prefix-icon="el-icon-search"
            style="margin-bottom: 20px"
          />
        </div>
        <div class="head-container tree-scroll-container">
          <el-tree
            :data="deptOptions"
            :props="defaultProps"
            :expand-on-click-node="false"
            :filter-node-method="filterNode"
            :ref="refNodes.tree"
            node-key="id"
            default-expand-all
            highlight-current
            @node-click="handleNodeClick"
            class="tree-wrapper tree-content"
            :style="{height: tableHeight+100+'px'}"
          />
        </div>
      </el-col>

      <!-- ユーザーデータ 検索 -->
      <el-col :span="20" :xs="24">
        <el-form
          :model="queryParams"
          :ref="refNodes.form"
          size="small"
          :inline="true"
          v-show="showSearch"
          label-width="68px"
        >
          <el-form-item label="ユーザー名" prop="userName">
            <el-input
              v-model="queryParams.userName"
              placeholder=""
              clearable
              style="width: 240px"
              @keyup.enter.native="handleQuery"
            />
          </el-form-item>
          <el-form-item label="携帯電話番号" prop="phonenumber">
            <el-input
              v-model="queryParams.phonenumber"
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
          <el-form-item label="作成日時">
            <el-date-picker
              v-model="dateRange"
              style="width: 240px"
              value-format="yyyy-MM-dd"
              type="daterange"
              range-separator="-"
              start-placeholder="開始日"
              end-placeholder="終了日"
            ></el-date-picker>
          </el-form-item>
          <el-form-item>
            <el-button
              type="primary"
              icon="el-icon-search"
              size="mini"
              @click="handleQuery"
            >検索
            </el-button
            >
            <el-button icon="el-icon-refresh" size="mini" @click="resetQuery"
            >リセット
            </el-button
            >
          </el-form-item>
        </el-form>

        <!-- テーブルデータ -->
        <el-table
          v-loading="loading"
          :data="userList"
          :ref="refNodes.table"
          row-key="userId"
          @selection-change="handleSelectionChange"
          :height="tableHeight"
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

          <el-table-column
            label="ユーザーID"
            align="center"
            key="userId"
            prop="userId"
            v-if="columns[0].visible"
          />
          <el-table-column
            label="ユーザー名"
            align="center"
            key="userName"
            prop="userName"
            v-if="columns[1].visible"
            :show-overflow-tooltip="true"
          />
          <el-table-column
            label="ニックネーム"
            align="center"
            key="nickName"
            prop="nickName"
            v-if="columns[2].visible"
            :show-overflow-tooltip="true"
          />
          <el-table-column
            label="部署"
            align="center"
            key="deptName"
            prop="deptName"
            v-if="columns[3].visible"
            :show-overflow-tooltip="true"
          />
          <el-table-column
            label="携帯電話番号"
            align="center"
            key="phonenumber"
            prop="phonenumber"
            v-if="columns[4].visible"
            width="120"
          />
          <el-table-column
            label="ステータス"
            align="center"
            key="status"
            v-if="columns[5].visible"
          >
            <template slot-scope="scope">
              <dict-tag
                :options="dict.type.sys_normal_disable"
                :value="scope.row.status"
              />
            </template>
          </el-table-column>
          <el-table-column
            label="作成日時"
            align="center"
            prop="createTime"
            v-if="columns[6].visible"
            width="160"
          >
            <template slot-scope="scope">
              <span>{{ parseTime(scope.row.createTime) }}</span>
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
      </el-col>
    </el-row>

    <!-- 下部フッターボタン -->
    <div slot="footer" class="dialog-footer">
      <template v-if="isShowSubmit">
        <el-button type="primary" @click="handleSubmit">確定</el-button>
        <el-button @click="handleCancel">キャンセル</el-button>
      </template>
      <template v-else>
        <el-button @click="handleCancel">閉じる</el-button>
      </template>
    </div>
  </el-dialog>
</template>

<script>
import { deptTreeSelect, echoList, listUser } from "@/api/system/user";
import Treeselect from "@riophae/vue-treeselect";
import "@riophae/vue-treeselect/dist/vue-treeselect.css";

export default {
  name: "DeptUsser",
  dicts: ["sys_normal_disable", "sys_user_sex"],
  components: { Treeselect },
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
        tree: "tree"
      },

      // 選択配列
      ids: [],
      // 選択配列
      multipleSelections: [],
      // 単一選択不可フラグ
      single: true,
      // 複数選択不可フラグ
      multiple: true,

      // 検索条件の表示
      showSearch: true,

      // 確定ボタンの表示/非表示
      isShowSubmit: true,

      // 総件数
      total: 0,
      // ユーザーテーブルデータ
      userList: null,

      // 部署ツリーオプション
      deptOptions: undefined,
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

      // 送信済みアイテム
      submitSelections: [],
    };
  },
  watch: {
    // 名称で部署ツリーをフィルタリング
    deptName(val) {
      this.$refs.tree.filter(val);
    },
  },

  created() {
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
      // 送信済み多肢選択に保存
      this.submitSelections = _.cloneDeep(this.multipleSelections);
      // ディープクローン
      let callback = _.cloneDeep(this.submitSelections);

      // コールバック通知
      this.$emit("callback", callback);
      // ダイアログを閉じる
      this.handleCancel();
    },

    // 表示クエリ（選択済みユーザー回显）
    echoList(userIds) {
      // ユーザーID配列が空の場合
      if (!userIds.length) {
        return;
      }

      echoList(userIds)
        .then(
          (response) => {
            // データを代入
            this.submitSelections = response.data;
            // テーブル多肢選択をレンダリング
            this.renderSelections();
          }
        )
        .catch(err => console.log(err))
    },

    // テーブル多肢選択のレンダリング
    renderSelections() {
      // DOM更新を非同期で実行
      this.$nextTick(() => {
        // テーブル多肢選択をクリア
        this.clearSelection();

        // 送信済み選択肢をテーブルに反映
        this.submitSelections.forEach(row => {
          this.$refs[this.refNodes.table].toggleRowSelection(row);
        });
      });
    },

    /* ------------- テーブルチェックボックス ------------- */
    // チェックボックス選択データ
    handleSelectionChange(selection) {
      this.ids = selection.map((item) => item.userId);
      this.multipleSelections = selection;
      this.single = selection.length !== 1;
      this.multiple = !selection.length;
    },

    // チェックボックス活性判定
    handleSelectionEnable() {
      return true;
    },

    // テーブル選択データをクリア
    clearSelection() {
      this.$refs[this.refNodes.table].clearSelection();
    },

    /* ------------- ユーザーリストクエリ ------------- */
    /** ユーザーリストのクエリ */
    getList() {
      this.loading = true;
      listUser(this.addDateRange(this.queryParams, this.dateRange))
        .then(
          (response) => {
            this.userList = response.rows;
            this.total = response.total;
          }
        )
        .catch(err => console.log(err))
        .finally(() => this.loading = false);
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
    /** 検索ボタン操作 */
    handleQuery() {
      this.queryParams.pageNum = 1;
      this.getList();
    },

    /** リセットボタン操作 */
    resetQuery() {
      this.dateRange = [];
      this.resetForm(this.refNodes.form);
      this.queryParams.deptId = undefined;
      this.$refs[this.refNodes.tree].setCurrentKey(null);
      this.handleQuery();
    },

    /* ------------- 基本メソッド ------------- */
    // ダイアログを開く
    open(echoIds, isShow) {
      // 表示状態をtrueに
      this.visible = true;
      // 確定ボタンの表示/非表示設定
      this.isShowSubmit = isShow;
      // 部署ツリーを取得
      this.getDeptTree();
      // ユーザーリストを取得
      this.getList();
      // 選択済みユーザーを回显
      this.echoList(echoIds)
    },

    // キャンセル・閉じる
    handleCancel() {
      // 表示状態をfalseに
      this.visible = false;
      // 部署ツリー検索値をクリア
      this.deptName = null;
      // 検索条件をクリア
      this.dateRange = [];
      this.resetForm(this.refNodes.form);
      this.queryParams.deptId = undefined;
      this.$refs[this.refNodes.tree].setCurrentKey(null);
      // チェックボックス選択をクリア
      this.clearSelection();
    },

  },
};
</script>
<style lang="scss" scoped>
::v-deep .tree-wrapper {
  overflow: auto
}

::v-deep .tree-wrapper::-webkit-scrollbar {
  display: none
}
  .tree-scroll-container {
    overflow-x: auto;
    width: 100%;
  }

  .tree-content {
    min-width: max-content;
    padding-right: 10px;
  }
</style>
