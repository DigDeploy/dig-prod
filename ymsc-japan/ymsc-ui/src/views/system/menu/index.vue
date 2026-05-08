<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" size="small" :inline="true" v-show="showSearch">
      <el-form-item label="メニュー名" prop="menuName">
        <el-input
          v-model="queryParams.menuName"
          placeholder=""
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="ステータス" prop="status">
        <el-select v-model="queryParams.status" placeholder="" clearable>
          <el-option
            v-for="dict in dict.type.sys_normal_disable"
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
          v-hasPermi="['system:menu:add']"
        >新規追加</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="info"
          plain
          icon="el-icon-sort"
          size="mini"
          @click="toggleExpandAll"
        >展開/折りたたみ</el-button>
      </el-col>
      <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table
      v-if="refreshTable"
      v-loading="loading"
      :data="menuList"
      row-key="menuId"
      :default-expand-all="isExpandAll"
      :tree-props="{children: 'children', hasChildren: 'hasChildren'}"
    >
      <el-table-column prop="menuName" label="メニュー名" :show-overflow-tooltip="true" width="160"></el-table-column>
      <el-table-column prop="icon" label="アイコン" align="center" width="100">
        <template slot-scope="scope">
          <svg-icon :icon-class="scope.row.icon" />
        </template>
      </el-table-column>
      <el-table-column prop="orderNum" label="順序" width="60"></el-table-column>
      <el-table-column prop="perms" label="権限識別子" :show-overflow-tooltip="true"></el-table-column>
      <el-table-column prop="component" label="コンポーネントパス" :show-overflow-tooltip="true"></el-table-column>
      <el-table-column prop="status" label="ステータス" width="100">
        <template slot-scope="scope">
          <dict-tag :options="dict.type.sys_normal_disable" :value="scope.row.status"/>
        </template>
      </el-table-column>
      <el-table-column label="作成時間" align="center" prop="createTime">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.createTime) }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row)"
            v-hasPermi="['system:menu:edit']"
          >修正</el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-plus"
            @click="handleAdd(scope.row)"
            v-hasPermi="['system:menu:add']"
          >新規追加</el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['system:menu:remove']"
          >削除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- メニューの追加または修正ダイアログ -->
    <el-dialog :title="title" :visible.sync="open" width="880px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="180px">
        <el-row>
          <el-col :span="24">
            <el-form-item label="上位メニュー" prop="parentId">
              <treeselect
                v-model="form.parentId"
                :options="menuOptions"
                :normalizer="normalizer"
                :show-count="true"
                placeholder=""
              />
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="メニュータイプ" prop="menuType">
              <el-radio-group v-model="form.menuType">
                <el-radio label="M">ディレクトリ</el-radio>
                <el-radio label="C">メニュー</el-radio>
                <el-radio label="F">ボタン</el-radio>
                <el-radio label="E">ページ</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
          <el-col :span="24" v-if="form.menuType != 'F' && form.menuType != 'E'">
            <el-form-item label="メニューアイコン" prop="icon">
              <el-popover
                placement="bottom-start"
                width="460"
                trigger="click"
                @show="$refs['iconSelect'].reset()"
              >
                <IconSelect ref="iconSelect" @selected="selected" />
                <el-input slot="reference" v-model="form.icon" placeholder="" readonly>
                  <svg-icon
                    v-if="form.icon"
                    slot="prefix"
                    :icon-class="form.icon"
                    class="el-input__icon"
                    style="height: 32px;width: 16px;"
                  />
                  <i v-else slot="prefix" class="el-icon-search el-input__icon" />
                </el-input>
              </el-popover>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="メニュー名" prop="menuName">
              <el-input v-model="form.menuName" placeholder="" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="表示順序" prop="orderNum">
              <el-input-number v-model="form.orderNum" controls-position="right" :min="0" />
            </el-form-item>
          </el-col>
          <el-col :span="24" v-if="form.menuType != 'F'">
            <el-form-item prop="path">
              <span slot="label">
                <el-tooltip content="アクセスするルートアドレス（例：`user`）。外部サイトのアドレスを内部リンクでアクセスする場合は`http(s)://`で始める" placement="top">
                  <i class="el-icon-question"></i>
                </el-tooltip>
                ルートアドレス
              </span>
              <el-input v-model="form.path" placeholder="" />
            </el-form-item>
          </el-col>
          <el-col :span="12" v-if="form.menuType != 'F'">
            <el-form-item prop="isFrame">
              <span slot="label">
                <el-tooltip content="外部リンクを選択する場合は、ルートアドレスは`http(s)://`で始まる必要があります" placement="top">
                <i class="el-icon-question"></i>
                </el-tooltip>
                外部リンクかどうか
              </span>
              <el-radio-group v-model="form.isFrame">
                <el-radio label="0">はい</el-radio>
                <el-radio label="1">いいえ</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
          <el-col :span="12" v-if="form.menuType == 'C' || form.menuType == 'E'">
            <el-form-item prop="component">
              <span slot="label">
                <el-tooltip content="アクセスするコンポーネントパス（例：`system/user/index`）。デフォルトは`views`ディレクトリ配下" placement="top">
                <i class="el-icon-question"></i>
                </el-tooltip>
                コンポーネントパス
              </span>
              <el-input v-model="form.component" placeholder="" />
            </el-form-item>
          </el-col>
          <el-col :span="12" v-if="form.menuType != 'M'">
            <el-form-item prop="perms">
              <el-input v-model="form.perms" placeholder="" maxlength="100" />
              <span slot="label">
                <el-tooltip content="コントローラで定義された権限文字列（例：@PreAuthorize(`@ss.hasPermi('system:user:list')`)）" placement="top">
                <i class="el-icon-question"></i>
                </el-tooltip>
                権限文字列
              </span>
            </el-form-item>
          </el-col>
          <el-col :span="12" v-if="form.menuType == 'C'">
            <el-form-item prop="query">
              <el-input v-model="form.query" placeholder="" maxlength="255" />
              <span slot="label">
                <el-tooltip content="アクセスルートのデフォルト引き渡しパラメータ（例：`{&quot;id&quot;: 1, &quot;name&quot;: &quot;ry&quot;}`）" placement="top">
                <i class="el-icon-question"></i>
                </el-tooltip>
                ルートパラメータ
              </span>
            </el-form-item>
          </el-col>
          <el-col :span="12" v-if="form.menuType == 'C'">
            <el-form-item prop="isCache">
              <span slot="label">
                <el-tooltip content="はいを選択すると`keep-alive`でキャッシュされる。コンポーネントの`name`とアドレスを一致させる必要があります" placement="top">
                <i class="el-icon-question"></i>
                </el-tooltip>
                キャッシュするかどうか
              </span>
              <el-radio-group v-model="form.isCache">
                <el-radio label="0">キャッシュ</el-radio>
                <el-radio label="1">キャッシュしない</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
          <el-col :span="12" v-if="form.menuType != 'F' && form.menuType != 'E'">
            <el-form-item prop="visible">
              <span slot="label">
                <el-tooltip content="非表示を選択するとルートはサイドバーに表示されないが、アクセスは可能" placement="top">
                <i class="el-icon-question"></i>
                </el-tooltip>
                表示ステータス
              </span>
              <el-radio-group v-model="form.visible">
                <el-radio
                  v-for="dict in dict.type.sys_show_hide"
                  :key="dict.value"
                  :label="dict.value"
                >{{dict.label}}</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
          <el-col :span="12" v-if="form.menuType != 'F' && form.menuType != 'E'">
            <el-form-item prop="status">
              <span slot="label">
                <el-tooltip content="無効を選択するとルートはサイドバーに表示されず、アクセスも不可" placement="top">
                <i class="el-icon-question"></i>
                </el-tooltip>
                メニューステータス
              </span>
              <el-radio-group v-model="form.status">
                <el-radio
                  v-for="dict in dict.type.sys_normal_disable"
                  :key="dict.value"
                  :label="dict.value"
                >{{dict.label}}</el-radio>
              </el-radio-group>
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
import { listMenu, getMenu, delMenu, addMenu, updateMenu } from "@/api/system/menu";
import Treeselect from "@riophae/vue-treeselect";
import "@riophae/vue-treeselect/dist/vue-treeselect.css";
import IconSelect from "@/components/IconSelect";

export default {
  name: "Menu",
  dicts: ['sys_show_hide', 'sys_normal_disable'],
  components: { Treeselect, IconSelect },
  data() {
    return {
      // マスクレイヤー
      loading: false,
      // 検索条件を表示
      showSearch: true,
      // メニューテーブルツリーデータ
      menuList: [],
      // メニューツリーオプション
      menuOptions: [],
      // ポップアップタイトル
      title: "",
      // ポップアップを表示するかどうか
      open: false,
      // 展開するかどうか（デフォルトは全折りたたみ）
      isExpandAll: false,
      // テーブル再描画状態
      refreshTable: true,
      // クエリパラメータ
      queryParams: {
        menuName: undefined,
        visible: undefined
      },
      // フォームパラメータ
      form: {},
      // フォームバリデーション
      rules: {
        menuName: [
          { required: true, message: "メニュー名を入力してください", trigger: "blur" }
        ],
        orderNum: [
          { required: true, message: "メニュー順序を入力してください", trigger: "blur" }
        ],
        path: [
          { required: true, message: "ルートアドレスを入力してください", trigger: "blur" }
        ]
      }
    };
  },
  created() {
  },
  methods: {
    // アイコン選択
    selected(name) {
      this.form.icon = name;
    },
    /** メニューリストをクエリ */
    getList() {
      this.loading = true;
      listMenu(this.queryParams).then(response => {
        this.menuList = this.handleTree(response.data, "menuId");
        this.loading = false;
      });
    },
    /** メニューデータ構造を変換 */
    normalizer(node) {
      if (node.children && !node.children.length) {
        delete node.children;
      }
      return {
        id: node.menuId,
        label: node.menuName,
        children: node.children
      };
    },
    /** メニュードロップダウンツリー構造をクエリ */
    getTreeselect() {
      listMenu().then(response => {
        this.menuOptions = [];
        const menu = { menuId: 0, menuName: 'メインカテゴリ', children: [] };
        menu.children = this.handleTree(response.data, "menuId");
        this.menuOptions.push(menu);
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
        menuId: undefined,
        parentId: 0,
        menuName: undefined,
        icon: undefined,
        menuType: "M",
        orderNum: undefined,
        isFrame: "1",
        isCache: "0",
        visible: "0",
        status: "0"
      };
      this.resetForm("form");
    },
    /** 検索ボタン操作 */
    handleQuery() {
      this.getList();
    },
    /** リセットボタン操作 */
    resetQuery() {
      this.resetForm("queryForm");
      this.menuList = [];
    },
    /** 新規追加ボタン操作 */
    handleAdd(row) {
      this.reset();
      this.getTreeselect();
      if (row != null && row.menuId) {
        this.form.parentId = row.menuId;
      } else {
        this.form.parentId = 0;
      }
      this.open = true;
      this.title = "メニュー追加";
    },
    /** 展開/折りたたみ操作 */
    toggleExpandAll() {
      this.refreshTable = false;
      this.isExpandAll = !this.isExpandAll;
      this.$nextTick(() => {
        this.refreshTable = true;
      });
    },
    /** 修正ボタン操作 */
    handleUpdate(row) {
      this.reset();
      this.getTreeselect();
      getMenu(row.menuId).then(response => {
        this.form = response.data;
        this.open = true;
        this.title = "メニュー修正";
      });
    },
    /** 確定ボタン */
    submitForm: function() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          if (this.form.menuId != undefined) {
            updateMenu(this.form).then(response => {
              this.$modal.msgSuccess("保存しました。");
              this.open = false;
              this.getList();
            });
          } else {
            addMenu(this.form).then(response => {
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
      this.$modal.confirm('名前が"' + row.menuName + '"のデータ項目を削除してもよろしいですか？').then(function() {
        return delMenu(row.menuId);
      }).then(() => {
        this.getList();
        this.$modal.msgSuccess("削除しました。");
      }).catch(() => {});
    }
  }
};
</script>
