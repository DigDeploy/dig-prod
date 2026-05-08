<template>
  <!-- ユーザー認可 -->
  <el-dialog title="ユーザー選択" :visible.sync="visible" width="1200px" top="5vh" append-to-body custom-class="user-select-dialog">
    <el-row :gutter="20">
      <el-col :span="4" :xs="24">
        <div class="head-container">
          <el-form :inline="true" label-width="40px">
            <el-form-item label="部門" prop="deptName">
            <el-input
              v-model="deptName"
              placeholder=""
              clearable
              size="small"
              prefix-icon="el-icon-search"
              style="margin-bottom: 20px; width: 125px;"
            />
            </el-form-item>
          </el-form>
        </div>
        <div class="head-container tree-scroll-container">
          <el-tree
            :data="deptOptions"
            :props="defaultProps"
            :expand-on-click-node="false"
            :filter-node-method="filterNode"
            ref="tree"
            node-key="id"
            default-expand-all
            highlight-current
            @node-click="handleNodeClick"
            class="tree-wrapper tree-content"
            :style="{height: tableHeight+100+'px'}"
          />
        </div>
      </el-col>
      <el-col :span="20" :xs="24">
        <el-form :model="queryParams" ref="queryForm" size="small" :inline="true">
          <el-form-item label="ログインID" prop="userName">
            <el-input
              v-model="queryParams.userName"
              placeholder=""
              clearable
              @keyup.enter.native="handleQuery"
            />
          </el-form-item>
          <el-form-item label="氏名" prop="nickName">
            <el-input
              v-model="queryParams.nickName"
              placeholder=""
              clearable
              @keyup.enter.native="handleQuery"
            />
          </el-form-item>
          <el-form-item label="役割" prop="roleName">
            <el-input
              v-model="queryParams.roleName"
              placeholder=""
              clearable
              @keyup.enter.native="handleQuery"
            />
          </el-form-item>
          <el-form-item>
            <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">検索</el-button>
            <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">リセット</el-button>
          </el-form-item>
        </el-form>

        <el-table border @row-click="clickRow" ref="table" :data="userList" @selection-change="handleSelectionChange" :height="tableHeight">
          <el-table-column type="selection" width="55"></el-table-column>
          <el-table-column label="ログインID" prop="userName" :show-overflow-tooltip="true" />
          <el-table-column label="氏名" prop="nickName" :show-overflow-tooltip="true" />
          <el-table-column label="メールアドレス" prop="email" :show-overflow-tooltip="true" />
          <el-table-column label="電話番号" prop="phonenumber" :show-overflow-tooltip="true" />
          <el-table-column label="部門" align="center" key="deptName" prop="dept.deptName":show-overflow-tooltip="true" />
          <el-table-column label="役割" align="center" key="roleNames" prop="roleNames" :show-overflow-tooltip="true" />
          <!--        <el-table-column label="ステータス" align="center" prop="status">-->
          <!--          <template slot-scope="scope">-->
          <!--            <dict-tag :options="dict.type.sys_normal_disable" :value="scope.row.status"/>-->
          <!--          </template>-->
          <!--        </el-table-column>-->
          <el-table-column label="作成日時" align="center" prop="createTime" width="180">
            <template slot-scope="scope">
              <span>{{ parseTime(scope.row.createTime) }}</span>
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
      </el-col>
    </el-row>
    <div slot="footer" class="dialog-footer">
      <el-button type="primary" @click="handleSelectUser">確定</el-button>
      <el-button @click="visible = false">キャンセル</el-button>
    </div>
  </el-dialog>
</template>

<script>
    import { unallocatedUserList, authUserSelectAll } from "@/api/system/role";
    import { deptTreeSelect } from "@/api/system/user";
    export default {
        dicts: ['sys_normal_disable'],
        props: {
            // ロールID
            roleId: {
                type: [Number, String]
            }
        },
        data() {
            return {
                // ポップアップ表示状態
                visible: false,
                // 選択配列値
                userIds: [],
                // 総件数
                total: 0,
                // 未認可ユーザーデータ
                userList: [],
                // 検索パラメータ
                queryParams: {
                    pageNum: 1,
                    pageSize: 10,
                    roleId: undefined,
                    userName: undefined,
                    phonenumber: undefined,
                    nickName: undefined,
                    deptId: undefined,
                },
                deptOptions: [],
                deptName: undefined,
                defaultProps: {
                    children: "children",
                    label: "label"
                },
            };
        },
        created() {
            // 部署ツリーを取得
            this.getDeptTree();
        },
        computed: {
            // テーブル高さ
            tableHeight() {
                // 高さ計算
                let height = document.body.clientHeight - 502;
                // テーブル高さ（最小300px）
                return height < 300 ? 300 : height;
            },
        },
        watch: {
            // 名称に基づいて部署ツリーをフィルタリング
            deptName(val) {
                this.$refs.tree.filter(val);
            }
        },
        methods: {
            getDeptTree() {
                deptTreeSelect().then((response) => {
                    this.deptOptions = response.data;
                });
            },
            filterNode(value, data) {
                if (!value) return true;
                return data.label.indexOf(value) !== -1;
            },
            handleNodeClick(data) {
                this.queryParams.deptId = data.id;
                this.getList();
            },
            // ポップアップを表示
            show() {
                this.queryParams.roleId = this.roleId;
                this.queryParams.userName = '';
                this.queryParams.nickName = '';
                this.queryParams.roleName = '';
                this.deptName = '';
                this.queryParams.deptId = undefined;
                this.getList();
                this.visible = true;
                this.$nextTick(() => {
                    this.$refs.tree.filter('');
                    this.$refs.tree.setCurrentKey(null);
                    this.$refs.tree.expandAll();
                })
            },
            clickRow(row) {
                this.$refs.table.toggleRowSelection(row);
            },
            // チェックボックス選択データ
            handleSelectionChange(selection) {
                this.userIds = selection.map(item => item.userId);
            },
            // テーブルデータを検索
            getList() {
                unallocatedUserList(this.queryParams).then(res => {
                    this.userList = res.rows;
                    this.total = res.total;
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
                this.deptName = '';
                this.$refs.tree.filter('');
                this.$refs.tree.setCurrentKey(null);
                this.handleQuery();
            },
            /** 認可ユーザー選択操作 */
            handleSelectUser() {
                const roleId = this.queryParams.roleId;
                const userIds = this.userIds.join(",");
                if (userIds == "") {
                    this.$modal.msgError("ユーザーを選択してください。");
                    return;
                }
                authUserSelectAll({ roleId: roleId, userIds: userIds }).then(res => {
                    this.$modal.msgSuccess("ユーザーを追加しました。");
                    if (res.code === 200) {
                        this.visible = false;
                        this.$emit("ok");
                    }
                });
            }
        }
    };
</script>
<style lang="scss" scoped>
  ::v-deep .user-select-dialog {
    max-height: 90vh;
    overflow: hidden;
  }
  ::v-deep .user-select-dialog .el-dialog__body {
    height: calc(90vh - 110px);
    overflow: hidden;
  }

  ::v-deep .tree-wrapper {
    overflow-y: auto;
    overflow-x: hidden;
  }
  ::v-deep .tree-wrapper::-webkit-scrollbar {
    display: none;
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
