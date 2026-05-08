<template>
  <el-form ref="genInfoForm" :model="info" :rules="rules" label-width="150px">
    <el-row>
      <el-col :span="12">
        <el-form-item prop="tplCategory">
          <span slot="label">生成テンプレート</span>
          <el-select v-model="info.tplCategory" @change="tplSelectChange">
            <el-option label="単一テーブル（CRUD）" value="crud" />
            <el-option label="ツリーテーブル（CRUD）" value="tree" />
            <el-option label="マスターサブテーブル（CRUD）" value="sub" />
          </el-select>
        </el-form-item>
      </el-col>
      <el-col :span="12">
        <el-form-item prop="packageName">
          <span slot="label">
            生成パッケージパス
            <el-tooltip content="生成するJavaパッケージを指定します（例：com.ymsc.system）" placement="top">
              <i class="el-icon-question"></i>
            </el-tooltip>
          </span>
          <el-input v-model="info.packageName" />
        </el-form-item>
      </el-col>

      <el-col :span="12">
        <el-form-item prop="moduleName">
          <span slot="label">
            生成モジュール名
            <el-tooltip content="サブシステム名として理解可（例：system）" placement="top">
              <i class="el-icon-question"></i>
            </el-tooltip>
          </span>
          <el-input v-model="info.moduleName" />
        </el-form-item>
      </el-col>

      <el-col :span="12">
        <el-form-item prop="businessName">
          <span slot="label">
            生成ビジネス名
            <el-tooltip content="機能の英文名として理解可（例：user）" placement="top">
              <i class="el-icon-question"></i>
            </el-tooltip>
          </span>
          <el-input v-model="info.businessName" />
        </el-form-item>
      </el-col>

      <el-col :span="12">
        <el-form-item prop="functionName">
          <span slot="label">
            生成機能名
            <el-tooltip content="クラスの説明として使用（例：ユーザー）" placement="top">
              <i class="el-icon-question"></i>
            </el-tooltip>
          </span>
          <el-input v-model="info.functionName" />
        </el-form-item>
      </el-col>

      <el-col :span="12">
        <el-form-item>
          <span slot="label">
            上位メニュー
            <el-tooltip content="指定したメニュー配下に配置（例：システム管理）" placement="top">
              <i class="el-icon-question"></i>
            </el-tooltip>
          </span>
          <treeselect
            :append-to-body="true"
            v-model="info.parentMenuId"
            :options="menus"
            :normalizer="normalizer"
            :show-count="true"
            placeholder=""
          />
        </el-form-item>
      </el-col>

      <el-col :span="12">
        <el-form-item prop="genType">
          <span slot="label">
            コード生成方式
            <el-tooltip content="デフォルトはZIP圧縮ファイルでダウンロード、カスタム生成パスも設定可" placement="top">
              <i class="el-icon-question"></i>
            </el-tooltip>
          </span>
          <el-radio v-model="info.genType" label="0">ZIP圧縮ファイル</el-radio>
          <el-radio v-model="info.genType" label="1">カスタムパス</el-radio>
        </el-form-item>
      </el-col>
      <el-col :span="6">
        <el-form-item prop="genType">
          <span slot="label">
            添付ファイルリストの生成
            <el-tooltip content="デフォルトは生成しない" placement="top">
              <i class="el-icon-question"></i>
            </el-tooltip>
          </span>
          <el-radio v-model="info.autoCreateTable" label="0">はい</el-radio>
          <el-radio v-model="info.autoCreateTable" label="1">いいえ</el-radio>
        </el-form-item>
      </el-col>
      <el-col :span="6">
        <el-form-item prop="genType">
          <span slot="label">
            メールプレビュー機能の生成
            <el-tooltip content="デフォルトは生成しない" placement="top">
              <i class="el-icon-question"></i>
            </el-tooltip>
          </span>
          <el-radio v-model="info.autoCreateEmail" label="0">はい</el-radio>
          <el-radio v-model="info.autoCreateEmail" label="1">いいえ</el-radio>
        </el-form-item>
      </el-col>
      <el-col :span="24" v-if="info.genType == '1'">
        <el-form-item prop="genPath">
          <span slot="label">
            カスタムパス
            <el-tooltip content="ディスクの絶対パスを入力します。未入力の場合は、現在のWebプロジェクト配下に生成されます" placement="top">
              <i class="el-icon-question"></i>
            </el-tooltip>
          </span>
          <el-input v-model="info.genPath">
            <el-dropdown slot="append">
              <el-button type="primary">
                最近のパスをクイック選択
                <i class="el-icon-arrow-down el-icon--right"></i>
              </el-button>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item @click.native="info.genPath = '/'">デフォルトの生成ベースパスに復元</el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
          </el-input>
        </el-form-item>
      </el-col>
    </el-row>

    <el-row v-show="info.tplCategory == 'tree'">
      <h4 class="form-header">その他情報</h4>
      <el-col :span="12">
        <el-form-item>
          <span slot="label">
            ツリーコードフィールド
            <el-tooltip content="ツリーに表示するコードフィールド名（例：dept_id）" placement="top">
              <i class="el-icon-question"></i>
            </el-tooltip>
          </span>
          <el-select v-model="info.treeCode" placeholder="">
            <el-option
              v-for="(column, index) in info.columns"
              :key="index"
              :label="column.columnName + '：' + column.columnComment"
              :value="column.columnName"
            ></el-option>
          </el-select>
        </el-form-item>
      </el-col>
      <el-col :span="12">
        <el-form-item>
          <span slot="label">
            ツリー親コードフィールド
            <el-tooltip content="ツリーに表示する親コードフィールド名（例：parent_Id）" placement="top">
              <i class="el-icon-question"></i>
            </el-tooltip>
          </span>
          <el-select v-model="info.treeParentCode" placeholder="">
            <el-option
              v-for="(column, index) in info.columns"
              :key="index"
              :label="column.columnName + '：' + column.columnComment"
              :value="column.columnName"
            ></el-option>
          </el-select>
        </el-form-item>
      </el-col>
      <el-col :span="12">
        <el-form-item>
          <span slot="label">
            ツリー名前フィールド
            <el-tooltip content="ツリーノードの表示名フィールド名（例：dept_name）" placement="top">
              <i class="el-icon-question"></i>
            </el-tooltip>
          </span>
          <el-select v-model="info.treeName" placeholder="">
            <el-option
              v-for="(column, index) in info.columns"
              :key="index"
              :label="column.columnName + '：' + column.columnComment"
              :value="column.columnName"
            ></el-option>
          </el-select>
        </el-form-item>
      </el-col>
    </el-row>
    <el-row v-show="info.tplCategory == 'sub'">
      <h4 class="form-header">関連情報</h4>
      <el-col :span="12">
        <el-form-item>
          <span slot="label">
            関連サブテーブルのテーブル名
            <el-tooltip content="関連するサブテーブルのテーブル名（例：sys_user）" placement="top">
              <i class="el-icon-question"></i>
            </el-tooltip>
          </span>
          <el-select v-model="info.subTableName" placeholder="" @change="subSelectChange">
            <el-option
              v-for="(table, index) in tables"
              :key="index"
              :label="table.tableName + '：' + table.tableComment"
              :value="table.tableName"
            ></el-option>
          </el-select>
        </el-form-item>
      </el-col>
      <el-col :span="12">
        <el-form-item>
          <span slot="label">
            サブテーブル関連の外部キー名
            <el-tooltip content="サブテーブルに関連する外部キー名（例：user_id）" placement="top">
              <i class="el-icon-question"></i>
            </el-tooltip>
          </span>
          <el-select v-model="info.subTableFkName" placeholder="">
            <el-option
              v-for="(column, index) in subColumns"
              :key="index"
              :label="column.columnName + '：' + column.columnComment"
              :value="column.columnName"
            ></el-option>
          </el-select>
        </el-form-item>
      </el-col>
    </el-row>
  </el-form>
</template>

<script>
import Treeselect from "@riophae/vue-treeselect";
import "@riophae/vue-treeselect/dist/vue-treeselect.css";

export default {
  components: { Treeselect },
  props: {
    info: {
      type: Object,
      default: null
    },
    tables: {
      type: Array,
      default: null
    },
    menus: {
      type: Array,
      default: []
    },
  },
  data() {
    return {
      subColumns: [],
      rules: {
        tplCategory: [
          { required: true, message: "生成テンプレートを選択してください", trigger: "blur" }
        ],
        packageName: [
          { required: true, message: "生成パッケージパスを入力してください", trigger: "blur" }
        ],
        moduleName: [
          { required: true, message: "生成モジュール名を入力してください", trigger: "blur" }
        ],
        businessName: [
          { required: true, message: "生成ビジネス名を入力してください", trigger: "blur" }
        ],
        functionName: [
          { required: true, message: "生成機能名を入力してください", trigger: "blur" }
        ],
      }
    };
  },
  created() {},
  watch: {
    'info.subTableName': function(val) {
      this.setSubTableColumns(val);
    }
  },
  methods: {
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
    /** サブテーブル名選択時のトリガー */
    subSelectChange(value) {
      this.info.subTableFkName = '';
    },
    /** 生成テンプレート選択時のトリガー */
    tplSelectChange(value) {
      if(value !== 'sub') {
        this.info.subTableName = '';
        this.info.subTableFkName = '';
      }
    },
    /** 関連外部キーを設定 */
    setSubTableColumns(value) {
      for (var item in this.tables) {
        const name = this.tables[item].tableName;
        if (value === name) {
          this.subColumns = this.tables[item].columns;
          break;
        }
      }
    }
  }
};
</script>
