<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" size="small" :inline="true" v-show="showSearch">
      <el-form-item label="ロール名" prop="roleName">
        <el-input
          v-model="queryParams.roleName"
          placeholder=""
          clearable
          style="width: 240px"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="権限キー" prop="roleKey">
        <el-input
          v-model="queryParams.roleKey"
          placeholder=""
          clearable
          style="width: 240px"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <!--<el-form-item label="ステータス" prop="status">-->
      <!--  <el-select-->
      <!--    v-model="queryParams.status"-->
      <!--    placeholder="ロールステータス"-->
      <!--    clearable-->
      <!--    style="width: 240px"-->
      <!--  >-->
      <!--    <el-option-->
      <!--      v-for="dict in dict.type.sys_normal_disable"-->
      <!--      :key="dict.value"-->
      <!--      :label="dict.label"-->
      <!--      :value="dict.value"-->
      <!--    />-->
      <!--  </el-select>-->
      <!--</el-form-item>-->
      <!--<el-form-item label="作成日時">-->
      <!--  <el-date-picker-->
      <!--    v-model="dateRange"-->
      <!--    style="width: 240px"-->
      <!--    value-format="yyyy-MM-dd"-->
      <!--    type="daterange"-->
      <!--    range-separator="-"-->
      <!--    start-placeholder="開始日"-->
      <!--    end-placeholder="終了日"-->
      <!--  ></el-date-picker>-->
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
          v-hasPermi="['system:role:add']"
        >新規作成</el-button>
      </el-col>
<!--      <el-col :span="1.5">-->
<!--        <el-button-->
<!--          type="primary"-->
<!--          plain-->
<!--          icon="el-icon-download"-->
<!--          size="mini"-->
<!--          @click="handleExport"-->
<!--          v-hasPermi="['system:role:export']"-->
<!--        >エクスポート</el-button>-->
<!--      </el-col>-->
      <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table border v-loading="loading" :data="roleList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="ロールID" prop="roleId" width="120" />
      <el-table-column label="ロール名" prop="roleName" :show-overflow-tooltip="true" width="150" />
      <el-table-column label="権限キー" prop="roleKey" :show-overflow-tooltip="true" width="150" />
      <!--<el-table-column label="表示順序" prop="roleSort" width="100" />-->
<!--      <el-table-column label="ステータス" align="center" width="100">-->
<!--        <template slot-scope="scope">-->
<!--          <el-switch-->
<!--            v-model="scope.row.status"-->
<!--            active-value="0"-->
<!--            inactive-value="1"-->
<!--            @change="handleStatusChange(scope.row)"-->
<!--          ></el-switch>-->
<!--        </template>-->
<!--      </el-table-column>-->
      <el-table-column label="作成日時" align="center" prop="createTime" width="180">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.createTime) }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope" v-if="scope.row.roleId !== 1">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row)"
            v-hasPermi="['system:role:edit']"
          >更新</el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['system:role:remove']"
          >削除</el-button>
<!--          <el-button-->
<!--            size="mini"-->
<!--            type="text"-->
<!--            icon="el-icon-circle-check"-->
<!--            @click="handleDataScope(scope.row)"-->
<!--            v-hasPermi="['system:role:edit']"-->
<!--          >データ権限</el-button>-->
          <el-button
            size="mini"
            type="text"
            icon="el-icon-user"
            @click="handleAuthUser(scope.row)"
            v-hasPermi="['system:role:edit']"
          >ユーザー割当</el-button>
<!--          <el-dropdown size="mini" @command="(command) => handleCommand(command, scope.row)" v-hasPermi="['system:role:edit']">-->
<!--            <el-button size="mini" type="text" icon="el-icon-d-arrow-right">その他</el-button>-->
<!--            <el-dropdown-menu slot="dropdown">-->
<!--              <el-dropdown-item command="handleDataScope" icon="el-icon-circle-check"-->
<!--                v-hasPermi="['system:role:edit']">データ権限</el-dropdown-item>-->
<!--              <el-dropdown-item command="handleAuthUser" icon="el-icon-user"-->
<!--                v-hasPermi="['system:role:edit']">ユーザー割当</el-dropdown-item>-->
<!--&lt;!&ndash;              <el-dropdown-item command="handleRoleNoticeSetting" icon="el-icon-bell">通知アラート設定</el-dropdown-item>&ndash;&gt;-->
<!--            </el-dropdown-menu>-->
<!--          </el-dropdown>-->
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

    <!-- ロールの追加または編集設定ダイアログ -->
    <el-dialog :title="title" :visible.sync="open" width="500px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="100px">
        <el-form-item label="ロール名" prop="roleName">
          <el-input v-model="form.roleName" placeholder="" />
        </el-form-item>
        <el-form-item prop="roleKey">
          <span slot="label">
            <el-tooltip content="コントローラーで定義した権限キー、例：@PreAuthorize(`@ss.hasRole('admin')`)" placement="top">
              <i class="el-icon-question"></i>
            </el-tooltip>
            権限キー
          </span>
          <el-input v-model="form.roleKey" placeholder="" />
        </el-form-item>
        <!--<el-form-item label="ロール順序" prop="roleSort">-->
        <!--  <el-input-number v-model="form.roleSort" controls-position="right" :min="0" />-->
        <!--</el-form-item>-->
<!--        <el-form-item label="ステータス">-->
<!--          <el-radio-group v-model="form.status">-->
<!--            <el-radio-->
<!--              v-for="dict in dict.type.sys_normal_disable"-->
<!--              :key="dict.value"-->
<!--              :label="dict.value"-->
<!--            >{{dict.label}}</el-radio>-->
<!--          </el-radio-group>-->
<!--        </el-form-item>-->
        <el-form-item label="メニュー権限">
          <el-checkbox v-model="menuExpand" @change="handleCheckedTreeExpand($event, 'menu')">展開/折りたたみ</el-checkbox>
          <el-checkbox v-model="menuNodeAll" @change="handleCheckedTreeNodeAll($event, 'menu')">全選択/全解除</el-checkbox>
          <el-checkbox v-model="form.menuCheckStrictly" @change="handleCheckedTreeConnect($event, 'menu')">親子連携</el-checkbox>
          <el-tree
            class="tree-border"
            :data="menuOptions"
            show-checkbox
            ref="menu"
            node-key="id"
            :check-strictly="!form.menuCheckStrictly"
            empty-text="読み込み中、しばらくお待ちください"
            :props="defaultProps"
          ></el-tree>
        </el-form-item>
        <!--<el-form-item label="備考">-->
        <!--  <el-input v-model="form.remark" type="textarea" placeholder="内容を入力してください"></el-input>-->
        <!--</el-form-item>-->
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm">確定</el-button>
        <el-button @click="cancel">キャンセル</el-button>
      </div>
    </el-dialog>

    <!-- ロールデータ権限割り当てダイアログ -->
    <el-dialog :title="title" :visible.sync="openDataScope" width="500px" append-to-body>
      <el-form :model="form" label-width="80px">
        <el-form-item label="ロール名">
          <el-input v-model="form.roleName" :disabled="true" />
        </el-form-item>
        <el-form-item label="権限キー">
          <el-input v-model="form.roleKey" :disabled="true" />
        </el-form-item>
        <el-form-item label="権限範囲">
          <el-select v-model="form.dataScope" @change="dataScopeSelectChange">
            <el-option
              v-for="item in dataScopeOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="データ権限" v-show="form.dataScope == 2">
          <el-checkbox v-model="deptExpand" @change="handleCheckedTreeExpand($event, 'dept')">展開/折りたたみ</el-checkbox>
          <el-checkbox v-model="deptNodeAll" @change="handleCheckedTreeNodeAll($event, 'dept')">全選択/全解除</el-checkbox>
          <el-checkbox v-model="form.deptCheckStrictly" @change="handleCheckedTreeConnect($event, 'dept')">親子連携</el-checkbox>
          <el-tree
            class="tree-border"
            :data="deptOptions"
            show-checkbox
            default-expand-all
            ref="dept"
            node-key="id"
            :check-strictly="!form.deptCheckStrictly"
            empty-text="読み込み中、しばらくお待ちください"
            :props="defaultProps"
          ></el-tree>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitDataScope">確定</el-button>
        <el-button @click="cancelDataScope">キャンセル</el-button>
      </div>
    </el-dialog>

    <!-- 通知アラートマスター -->
    <el-dialog :title="title" :visible.sync="openRoleNoticeSetting" width="500px" append-to-body>

    </el-dialog>
  </div>
</template>

<script>
import { listRole, getRole, delRole, addRole, updateRole, dataScope, changeRoleStatus, deptTreeSelect } from "@/api/system/role";
import { treeselect as menuTreeselect, roleMenuTreeselect } from "@/api/system/menu";
import { getRoleNoticeSetting } from "@/api/business/master";

export default {
  name: "Role",
  dicts: ['sys_normal_disable'],
  data() {
    return {
      fromRouterPath:'',
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
      // ロールテーブルデータ
      roleList: [],
      // ポップアップタイトル
      title: "",
      // ポップアップを表示するかどうか
      open: false,
      // ポップアップを表示するかどうか（データ権限）
      openDataScope: false,
      openRoleNoticeSetting: false,
      menuExpand: false,
      menuNodeAll: false,
      deptExpand: true,
      deptNodeAll: false,
      // 日付範囲
      dateRange: [],
      // データ範囲オプション
      dataScopeOptions: [
        {
          value: "1",
          label: "全データ権限"
        },
        // {
        //   value: "2",
        //   label: "カスタムデータ権限"
        // },
        {
          value: "3",
          label: "本店部署データ権限"
        },
        {
          value: "4",
          label: "本店部署及び配下データ権限"
        },
        {
          value: "5",
          label: "本人のみデータ権限"
        }
      ],
      // メニューリスト
      menuOptions: [],
      // 部署リスト
      deptOptions: [],
      // 検索パラメータ
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        roleName: undefined,
        roleKey: undefined,
        status: undefined
      },
      // フォームパラメータ
      form: {},
      defaultProps: {
        children: "children",
        label: "label"
      },
      // フォーム検証
      rules: {
        roleName: [
          { required: true, message: "ロール名を入力してください", trigger: "blur" }
        ],
        roleKey: [
          { required: true, message: "権限キーを入力してください", trigger: "blur" }
        ]
        // roleSort: [
        //   { required: true, message: "ロール順序を入力してください", trigger: "blur" }
        // ]
      }
    };
  },
  created() {
  },
  methods: {
    /** ロールリストを検索 */
    getList() {
      this.loading = true;
      listRole(this.addDateRange(this.queryParams, this.dateRange)).then(response => {
          this.roleList = response.rows;
          this.total = response.total;
          this.loading = false;
        }
      );
    },
    /** メニューツリー構造を検索 */
    getMenuTreeselect() {
      menuTreeselect().then(response => {
        this.menuOptions = response.data;
      });
    },
    // すべてのメニューノードデータ
    getMenuAllCheckedKeys() {
      // 現在選択されているメニューノード
      let checkedKeys = this.$refs.menu.getCheckedKeys();
      // 半選択のメニューノード
      let halfCheckedKeys = this.$refs.menu.getHalfCheckedKeys();
      checkedKeys.unshift.apply(checkedKeys, halfCheckedKeys);
      return checkedKeys;
    },
    // すべての部署ノードデータ
    getDeptAllCheckedKeys() {
      // 現在選択されている部署ノード
      let checkedKeys = this.$refs.dept.getCheckedKeys();
      // 半選択の部署ノード
      let halfCheckedKeys = this.$refs.dept.getHalfCheckedKeys();
      checkedKeys.unshift.apply(checkedKeys, halfCheckedKeys);
      return checkedKeys;
    },
    /** ロールIDに基づいてメニューツリー構造を検索 */
    getRoleMenuTreeselect(roleId) {
      return roleMenuTreeselect(roleId).then(response => {
        this.menuOptions = response.menus;
        return response;
      });
    },
    /** ロールIDに基づいて部署ツリー構造を検索 */
    getDeptTree(roleId) {
      return deptTreeSelect(roleId).then(response => {
        this.deptOptions = response.depts;
        return response;
      });
    },
    // ロールステータス更新
    handleStatusChange(row) {
      let text = row.status === "0" ? "有効化" : "無効化";
      this.$modal.confirm('「' + row.roleName + '」ロールを「' + text + '」してもよろしいですか？').then(function() {
        return changeRoleStatus(row.roleId, row.status);
      }).then(() => {
        this.$modal.msgSuccess(text + "成功");
      }).catch(function() {
        row.status = row.status === "0" ? "1" : "0";
      });
    },
    // キャンセルボタン
    cancel() {
      this.open = false;
      this.reset();
    },
    // キャンセルボタン（データ権限）
    cancelDataScope() {
      this.openDataScope = false;
      this.reset();
    },
    cancelRoleNoticeSetting() {
      this.openRoleNoticeSetting = false;
      this.reset();
    },
    // フォームリセット
    reset() {
      if (this.$refs.menu != undefined) {
        this.$refs.menu.setCheckedKeys([]);
      }
      this.menuExpand = false,
      this.menuNodeAll = false,
      this.deptExpand = true,
      this.deptNodeAll = false,
      this.form = {
        roleId: undefined,
        roleName: undefined,
        roleKey: undefined,
        // roleSort: 0,
        status: "0",
        menuIds: [],
        deptIds: [],
        menuCheckStrictly: true,
        deptCheckStrictly: true
        // remark: undefined
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
      this.roleList = [];
      this.total = 0;
    },
    // チェックボックス選択データ
    handleSelectionChange(selection) {
      this.ids = selection.map(item => item.roleId)
      this.single = selection.length!=1
      this.multiple = !selection.length
    },
    // その他操作トリガー
    handleCommand(command, row) {
      switch (command) {
        case "handleDataScope":
          this.handleDataScope(row);
          break;
        case "handleAuthUser":
          this.handleAuthUser(row);
          break;
        case "handleRoleNoticeSetting":
          this.handleRoleNoticeSetting(row);
          break;
        default:
          break;
      }
    },
    // ツリー権限（展開/折りたたみ）
    handleCheckedTreeExpand(value, type) {
      if (type == 'menu') {
        let treeList = this.menuOptions;
        for (let i = 0; i < treeList.length; i++) {
          this.$refs.menu.store.nodesMap[treeList[i].id].expanded = value;
        }
      } else if (type == 'dept') {
        let treeList = this.deptOptions;
        for (let i = 0; i < treeList.length; i++) {
          this.$refs.dept.store.nodesMap[treeList[i].id].expanded = value;
        }
      }
    },
    // ツリー権限（全選択/全解除）
    handleCheckedTreeNodeAll(value, type) {
      if (type == 'menu') {
        this.$refs.menu.setCheckedNodes(value ? this.menuOptions: []);
      } else if (type == 'dept') {
        this.$refs.dept.setCheckedNodes(value ? this.deptOptions: []);
      }
    },
    // ツリー権限（親子連携）
    handleCheckedTreeConnect(value, type) {
      if (type == 'menu') {
        this.form.menuCheckStrictly = value ? true: false;
      } else if (type == 'dept') {
        this.form.deptCheckStrictly = value ? true: false;
      }
    },
    /** 新規作成ボタン操作 */
    handleAdd() {
      this.reset();
      this.getMenuTreeselect();
      this.open = true;
      this.title = "ロールの追加";
    },
    /** 更新ボタン操作 */
    handleUpdate(row) {
      this.reset();
      const roleId = row.roleId || this.ids
      const roleMenu = this.getRoleMenuTreeselect(roleId);
      getRole(roleId).then(response => {
        this.form = response.data;
        this.open = true;
        this.$nextTick(() => {
          roleMenu.then(res => {
            let checkedKeys = res.checkedKeys
            checkedKeys.forEach((v) => {
                this.$nextTick(()=>{
                    this.$refs.menu.setChecked(v, true ,false);
                })
            })
          });
        });
        this.title = "ロールの更新";
      });
    },
    /** ロール権限範囲選択トリガー */
    dataScopeSelectChange(value) {
      if(value !== '2') {
        this.$refs.dept.setCheckedKeys([]);
      }
    },
    /** データ権限割り当て操作 */
    handleDataScope(row) {
      this.reset();
      const deptTreeSelect = this.getDeptTree(row.roleId);
      getRole(row.roleId).then(response => {
        this.form = response.data;
        this.openDataScope = true;
        this.$nextTick(() => {
          deptTreeSelect.then(res => {
            this.$refs.dept.setCheckedKeys(res.checkedKeys);
          });
        });
        this.title = "データ権限の割り当て";
      });
    },
    /** ユーザー割り当て操作 */
    handleAuthUser: function(row) {
      const roleId = row.roleId;
      this.$router.push("/system/role-auth/user/" + roleId);
    },
    /** 通知アラート設定操作 */
    handleRoleNoticeSetting: function(row) {
      this.reset();
      getRoleNoticeSetting(row.roleId).then(response => {
        this.form = response.data;
        this.openRoleNoticeSetting = true;
        this.title = "通知アラートマスター";
      });
    },
    /** 送信ボタン */
    submitForm: function() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          if (this.form.roleId != undefined) {
            this.form.menuIds = this.getMenuAllCheckedKeys();
            updateRole(this.form).then(response => {
              this.$modal.msgSuccess("保存しました。");
              this.open = false;
              this.getList();
            });
          } else {
            this.form.menuIds = this.getMenuAllCheckedKeys();
            addRole(this.form).then(response => {
              this.$modal.msgSuccess("登録しました。");
              this.open = false;
              this.getList();
            });
          }
        }
      });
    },
    /** 送信ボタン（データ権限） */
    submitDataScope: function() {
      if (this.form.roleId != undefined) {
        this.form.deptIds = this.getDeptAllCheckedKeys();
        dataScope(this.form).then(response => {
          this.$modal.msgSuccess("更新成功");
          this.openDataScope = false;
          this.getList();
        });
      }
    },
    /** 削除ボタン操作 */
    handleDelete(row) {
      const roleIds = row.roleId || this.ids;
      this.$modal.confirm('ロールID「' + roleIds + '」のデータを削除してもよろしいですか？').then(function() {
        return delRole(roleIds);
      }).then(() => {
        this.getList();
        this.$modal.msgSuccess("削除しました。");
      }).catch(() => {});
    },
    /** エクスポートボタン操作 */
    handleExport() {
      this.download('system/role/export', {
        ...this.queryParams
      }, `role_${new Date().getTime()}.xlsx`)
    }
  }
};
</script>
