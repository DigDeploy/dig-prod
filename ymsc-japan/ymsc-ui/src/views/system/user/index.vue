<template>
  <div class="app-container">
    <el-row :gutter="20">
      <!--部署データ-->
      <el-col :span="4" :xs="24">
        <div class="head-container">
            <el-form :inline="true" label-width="40px">
               <el-form-item label="部門" prop="deptName">
                <el-input
                  v-model="deptName"
                  placeholder=""
                  clearable
                  size="small"
                  style="width: 145px;"
                  prefix-icon="el-icon-search"
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
            class="tree-content"
          />
        </div>
      </el-col>
      <!--ユーザーデータ-->
      <el-col :span="20" :xs="24">
        <el-form :model="queryParams" ref="queryForm" size="small" :inline="true" v-show="showSearch" label-width="150px">
          <el-form-item label="ログインID" prop="userName">
            <el-input
              v-model="queryParams.userName"
              placeholder=""
              clearable
              style="width: 240px"
              @keyup.enter.native="handleQuery"
            />
          </el-form-item>
          <el-form-item label="氏名" prop="nickName">
            <el-input
              v-model="queryParams.nickName"
              placeholder=""
              clearable
              style="width: 240px"
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
          <!--<el-form-item label="携帯番号" prop="phonenumber">-->
          <!--  <el-input-->
          <!--    v-model="queryParams.phonenumber"-->
          <!--    placeholder="携帯番号を入力してください"-->
          <!--    clearable-->
          <!--    style="width: 240px"-->
          <!--    @keyup.enter.native="handleQuery"-->
          <!--  />-->
          <!--</el-form-item>-->
<!--          <el-form-item label="状態" prop="status">-->
<!--            <el-select-->
<!--              v-model="queryParams.status"-->
<!--              placeholder=""-->
<!--              clearable-->
<!--              style="width: 240px"-->
<!--            >-->
<!--              <el-option-->
<!--                v-for="dict in dict.type.sys_normal_disable"-->
<!--                :key="dict.value"-->
<!--                :label="dict.label"-->
<!--                :value="dict.value"-->
<!--              />-->
<!--            </el-select>-->
<!--          </el-form-item>-->
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

        <el-row :gutter="10" class="mb8">
          <el-col :span="1.5">
            <el-button
              type="primary"
              plain
              icon="el-icon-plus"
              size="mini"
              @click="handleAdd"
              v-hasPermi="['system:user:add']"
            >追加</el-button>
          </el-col>
          <!--<el-col :span="1.5">-->
          <!--  <el-button-->
          <!--    type="info"-->
          <!--    plain-->
          <!--    icon="el-icon-upload2"-->
          <!--    size="mini"-->
          <!--    @click="handleImport"-->
          <!--    v-hasPermi="['system:user:import']"-->
          <!--  >インポート</el-button>-->
          <!--</el-col>-->
          <!--<el-col :span="1.5">-->
          <!--  <el-button-->
          <!--    type="warning"-->
          <!--    plain-->
          <!--    icon="el-icon-download"-->
          <!--    size="mini"-->
          <!--    @click="handleExport"-->
          <!--    v-hasPermi="['system:user:export']"-->
          <!--  >エクスポート</el-button>-->
          <!--</el-col>-->
          <!--<right-toolbar :showSearch.sync="showSearch" @queryTable="getList" :columns="columns"></right-toolbar>-->
        </el-row>

        <el-table border v-loading="loading" :data="userList" @selection-change="handleSelectionChange">
          <el-table-column type="selection" width="50" align="center" />
          <el-table-column label="ログインID" align="center" key="userName" prop="userName" v-if="columns[1].visible" :show-overflow-tooltip="true" width="140" />
          <el-table-column label="氏名" align="center" key="nickName" prop="nickName" v-if="columns[2].visible" :show-overflow-tooltip="true" width="160" />
          <el-table-column label="部門" align="center" key="deptName" prop="dept.deptName" v-if="columns[3].visible" :show-overflow-tooltip="true" />
          <el-table-column label="役割" align="center" key="roleNames" prop="roleNames" :show-overflow-tooltip="true" width="200" />
          <!--<el-table-column label="携帯番号" align="center" key="phonenumber" prop="phonenumber" v-if="columns[4].visible" width="120" />-->
<!--          <el-table-column label="状態" align="center" key="status" v-if="columns[5].visible">-->
<!--            <template slot-scope="scope">-->
<!--              <el-switch-->
<!--                v-model="scope.row.status"-->
<!--                active-value="0"-->
<!--                inactive-value="1"-->
<!--                @change="handleStatusChange(scope.row)"-->
<!--              ></el-switch>-->
<!--            </template>-->
<!--          </el-table-column>-->
          <el-table-column label="作成日時" align="center" prop="createTime" v-if="columns[6].visible" width="160">
            <template slot-scope="scope">
              <span>{{ parseTime(scope.row.createTime) }}</span>
            </template>
          </el-table-column>
          <el-table-column
            label="操作"
            align="center"
            width="200"
            class-name="small-padding fixed-width"
          >
            <template slot-scope="scope" v-if="scope.row.userId !== 1">
              <el-button
                size="mini"
                type="text"
                icon="el-icon-edit"
                @click="handleUpdate(scope.row)"
                v-hasPermi="['system:user:edit']"
              >修正</el-button>
              <el-button
                size="mini"
                type="text"
                icon="el-icon-delete"
                @click="handleDelete(scope.row)"
                v-hasPermi="['system:user:remove']"
              >削除</el-button>
              <el-button
                size="mini"
                type="text"
                icon="el-icon-circle-check"
                @click="handleJoushi(scope.row)"
              >上司設定</el-button>
<!--              <el-dropdown size="mini" @command="(command) => handleCommand(command, scope.row)" v-hasPermi="['system:user:resetPwd', 'system:user:edit']">-->
<!--                <el-button size="mini" type="text" icon="el-icon-d-arrow-right">その他</el-button>-->
<!--                <el-dropdown-menu slot="dropdown">-->
<!--&lt;!&ndash;                  <el-dropdown-item command="handleResetPwd" icon="el-icon-key"&ndash;&gt;-->
<!--&lt;!&ndash;                    v-hasPermi="['system:user:resetPwd']">パスワードリセット</el-dropdown-item>&ndash;&gt;-->
<!--                  <el-dropdown-item command="handleAuthRole" icon="el-icon-circle-check"-->
<!--                    v-hasPermi="['system:user:edit']">役割割り当て</el-dropdown-item>-->
<!--                </el-dropdown-menu>-->
<!--              </el-dropdown>-->
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

    <!-- ユーザー追加または修正設定ダイアログ -->
    <el-dialog :title="title" :visible.sync="open" width="900px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="150px">
        <el-row>
          <el-col :span="12">
            <el-form-item label="氏名" prop="nickName">
              <el-input v-model="form.nickName" placeholder="" maxlength="30" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="所属部署" prop="deptId">
              <treeselect v-model="form.deptId" :options="deptOptions" :show-count="true" placeholder="" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="携帯番号" prop="phonenumber">
              <el-input v-model="form.phonenumber" placeholder="" maxlength="11" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="メールアドレス" prop="email">
              <el-input v-model="form.email" placeholder="" maxlength="50" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item v-if="form.userId == undefined" label="ログインID" prop="userName">
              <el-input v-model="form.userName" placeholder="" maxlength="30" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
              <el-form-item label="ユーザー性別">
                <el-select v-model="form.sex" placeholder="">
                  <el-option
                    v-for="dict in dict.type.sys_user_sex"
                    :key="dict.value"
                    :label="dict.label"
                    :value="dict.value"
                  ></el-option>
                </el-select>
              </el-form-item>
            </el-col>
        </el-row>
        <el-row>
          <!--<el-col :span="12">-->
          <!--  <el-form-item label="役職">-->
          <!--    <el-select v-model="form.postIds" multiple placeholder="役職を選択してください">-->
          <!--      <el-option-->
          <!--        v-for="item in postOptions"-->
          <!--        :key="item.postId"-->
          <!--        :label="item.postName"-->
          <!--        :value="item.postId"-->
          <!--        :disabled="item.status == 1"-->
          <!--      ></el-option>-->
          <!--    </el-select>-->
          <!--  </el-form-item>-->
          <!--</el-col>-->
          <el-col :span="12">
            <el-form-item label="役割" prop="roleIds">
              <el-select v-model="form.roleIds" multiple placeholder="">
                <el-option
                  v-for="item in roleOptions"
                  :key="item.roleId"
                  :label="item.roleName"
                  :value="item.roleId"
                  :disabled="item.status == 1"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="住所" prop="address">
              <el-input v-model="form.address" placeholder="" maxlength="30" />
            </el-form-item>
          </el-col>
        </el-row>
<!--        <el-row>-->
<!--          <el-col :span="24">-->
<!--            <el-form-item label="管理者">-->
<!--              <dept-user-input-->
<!--                v-model="form.joshi"-->
<!--                :ref="'joshi'"-->
<!--                class="w-100"-->
<!--              />-->
<!--            </el-form-item>-->
<!--          </el-col>-->
<!--        </el-row>-->
        <el-row>
          <el-col :span="12">
            <el-form-item label="活動メール通知">
              <el-switch v-model="form.nextActionEmial" active-value="1" inactive-value="0"></el-switch>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="失注メール通知">
              <el-switch v-model="form.shitchuEmial" active-value="1" inactive-value="0"></el-switch>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <el-form-item label="備考">
              <el-input v-model="form.remark" type="textarea" placeholder=""></el-input>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm">確定</el-button>
        <el-button @click="cancel">キャンセル</el-button>
      </div>
    </el-dialog>

    <!-- ユーザーインポートダイアログ -->
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
          <div class="el-upload__tip" slot="tip">
            <el-checkbox v-model="upload.updateSupport" /> 既に存在するユーザーデータを更新するかどうか
          </div>
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
import { listUser, getUser, delUser, addUser, updateUser, resetUserPwd, changeUserStatus, deptTreeSelect } from "@/api/system/user";
import { getToken, getConfigKey } from "@/utils/auth"; // getConfigKeyをインポート（元コードで使用されていたがインポート漏れ修正）
import Treeselect from "@riophae/vue-treeselect";
import "@riophae/vue-treeselect/dist/vue-treeselect.css";
import DeptUserInput from "@/components/DeptUser/multipleInput";


export default {
  name: "User",
  dicts: ['sys_normal_disable', 'sys_user_sex'],
  components: { Treeselect, DeptUserInput},
  data() {
    return {
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
      // ユーザーテーブルデータ
      userList: null,
      // ポップアップタイトル
      title: "",
      // 部署ツリーオプション
      deptOptions: undefined,
      // ポップアップを表示するかどうか
      open: false,
      // 部署名
      deptName: undefined,
      // 初期パスワード
      initPassword: undefined,
      // 日付範囲
      dateRange: [],
      // 役職オプション
      postOptions: [],
      // 役割オプション
      roleOptions: [],
      // フォームパラメータ
      form: {},
      defaultProps: {
        children: "children",
        label: "label"
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
        url: process.env.VUE_APP_BASE_API + "/system/user/importData"
      },
      // 検索パラメータ
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        userName: undefined,
        nickName: undefined,
        phonenumber: undefined,
        status: undefined,
        deptId: undefined,
        roleName: undefined,
      },
      // 列情報
      columns: [
        { key: 0, label: `ユーザーID`, visible: true },
        { key: 1, label: `ユーザーアカウント`, visible: true },
        { key: 2, label: `氏名`, visible: true },
        { key: 3, label: `部署`, visible: true },
        { key: 4, label: `携帯番号`, visible: true },
        { key: 5, label: `状態`, visible: true },
        { key: 6, label: `作成日時`, visible: true }
      ],
      // フォーム検証
      rules: {
        userName: [
          { required: true, message: "ユーザーアカウントを入力してください", trigger: "blur" },
          { min: 2, max: 20, message: 'ユーザーアカウントの長さは2～20文字の間でなければなりません', trigger: 'blur' }
        ],
        nickName: [
          { required: true, message: "氏名を入力してください", trigger: "blur" }
        ],
        roleIds: [
            { required: true, message: "役割を入力してください", trigger: "blur" }
        ],
        password: [
          { required: true, message: "ユーザーパスワードを入力してください", trigger: "blur" },
          { min: 5, max: 20, message: 'ユーザーパスワードの長さは5～20文字の間でなければなりません', trigger: 'blur' }
        ],
        email: [
          {
            type: "email",
            message: "正しいメールアドレスを入力してください",
            trigger: ["blur", "change"]
          },
          { required: true, message: "ユーザーパスワードを入力してください", trigger: "blur" },
        ],
        // phonenumber: [
        //   {
        //     pattern: /^1[3|4|5|6|7|8|9][0-9]\d{8}$/,
        //     message: "正しい携帯番号を入力してください",
        //     trigger: "blur"
        //   }
        // ]
      }
    };
  },
  watch: {
    // 名称に基づいて部署ツリーをフィルタリング
    deptName(val) {
      this.$refs.tree.filter(val);
    }
  },
  created() {
    this.getDeptTree();
    this.getConfigKey("sys.user.initPassword").then(response => {
      this.initPassword = response.msg;
    });
  },
  methods: {
    /** ユーザーリストを検索 */
    getList() {
      this.loading = true;
      listUser(this.addDateRange(this.queryParams, this.dateRange)).then(response => {
          this.userList = response.rows;
          this.total = response.total;
          this.loading = false;
        }
      );
    },
    /** 部署ドロップダウンツリー構造を検索 */
    getDeptTree() {
      deptTreeSelect().then(response => {
        this.deptOptions = response.data;
      });
    },
    // ノードをフィルタリング
    filterNode(value, data) {
      if (!value) return true;
      return data.label.indexOf(value) !== -1;
    },
    // ノードクリックイベント
    handleNodeClick(data) {
      this.queryParams.deptId = data.id;
      this.handleQuery();
    },
    // ユーザー状態修正
    handleStatusChange(row) {
      let text = row.status === "0" ? "有効化" : "無効化";
      this.$modal.confirm('「' + row.userName + '」ユーザーを「' + text + '」してもよろしいですか？').then(function() {
        return changeUserStatus(row.userId, row.status);
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
    // フォームリセット
    reset() {
      this.form = {
        userId: undefined,
        deptId: undefined,
        userName: undefined,
        nickName: undefined,
        password: undefined,
        phonenumber: undefined,
        email: undefined,
        sex: undefined,
        status: "0",
        remark: undefined,
        nextActionEmial: "1",
        shitchuEmial: "1",
        postIds: [],
        roleIds: []
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
      this.queryParams.deptId = undefined;
      this.$refs.tree.setCurrentKey(null);
      this.userList = [];
      this.total = 0;
    },
    // チェックボックス選択データ
    handleSelectionChange(selection) {
      this.ids = selection.map(item => item.userId);
      this.single = selection.length != 1;
      this.multiple = !selection.length;
    },
    // その他操作トリガー
    handleCommand(command, row) {
      switch (command) {
        case "handleResetPwd":
          this.handleResetPwd(row);
          break;
        case "handleAuthRole":
          this.handleAuthRole(row);
          break;
        default:
          break;
      }
    },
    /** 追加ボタン操作 */
    handleAdd() {
      this.reset();
      getUser().then(response => { // 空のgetUser()呼び出しで役職/役割リスト取得（元コードの動作を保持）
        this.postOptions = response.posts;
        this.roleOptions = response.roles;
        this.open = true;
        this.title = "ユーザー追加";
        this.form.password = this.initPassword;
      });
    },
    /** 修正ボタン操作 */
    handleUpdate(row) {
      this.reset();
      const userId = row.userId || this.ids;
      getUser(userId).then(response => {
        this.form = response.data;
        this.postOptions = response.posts;
        this.roleOptions = response.roles;
        this.$set(this.form, "postIds", response.postIds);
        this.$set(this.form, "roleIds", response.roleIds);
        this.open = true;
        this.title = "ユーザー修正";
        this.form.password = "";
      });
    },
    /** パスワードリセットボタン操作 */
    handleResetPwd(row) {
      this.$prompt('「' + row.userName + '」の新しいパスワードを入力してください', "ヒント", {
        confirmButtonText: "確定",
        cancelButtonText: "キャンセル",
        closeOnClickModal: false,
        inputPattern: /^.{5,20}$/,
        inputErrorMessage: "ユーザーパスワードの長さは5～20文字の間でなければなりません"
      }).then(({ value }) => {
          resetUserPwd(row.userId, value).then(response => {
            this.$modal.msgSuccess("変更成功。新しいパスワード：" + value);
          });
        }).catch(() => {});
    },
    // /** 役割割り当て操作 */
    // handleAuthRole: function(row) {
    //   const userId = row.userId;
    //   this.$router.push("/system/user-auth/role/" + userId);
    // },
    handleJoushi: function(row) {
        const userId = row.userId;
        this.$router.push("/system/user-joushi/user/" + userId);
    },
    /** 送信ボタン */
    submitForm: function() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          this.$modal.loading();
          if (this.form.userId != undefined) {
            updateUser(this.form).then(response => {
              this.$modal.msgSuccess("保存しました。");
              this.$modal.closeLoading();
              this.open = false;
              this.getList();
            });
          } else {
            addUser(this.form).then(response => {
              this.$modal.msgSuccess("登録しました。");
              this.$modal.closeLoading();
              this.open = false;
              this.getList();
            });
          }
        }
      });
    },
    /** 削除ボタン操作 */
    handleDelete(row) {
      const userIds = row.userId || this.ids;
      this.$modal.confirm('ユーザーIDが「' + row.userName + '」のデータを削除してもよろしいですか？').then(function() {
        return delUser(userIds);
      }).then(() => {
        this.getList();
        this.$modal.msgSuccess("削除しました。");
      }).catch(() => {});
    },
    /** エクスポートボタン操作 */
    handleExport() {
      this.download('system/user/export', {
        ...this.queryParams
      }, `user_${new Date().getTime()}.xlsx`)
    },
    /** インポートボタン操作 */
    handleImport() {
      this.upload.title = "ユーザーインポート";
      this.upload.open = true;
    },
    /** テンプレートダウンロード操作 */
    importTemplate() {
      this.download('system/user/importTemplate', {
      }, `user_template_${new Date().getTime()}.xlsx`)
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
<style lang="scss" scoped>
  .tree-scroll-container {
    overflow-x: auto;
    width: 100%;
  }

  .tree-content {
    min-width: max-content;
    padding-right: 10px;
  }
</style>
