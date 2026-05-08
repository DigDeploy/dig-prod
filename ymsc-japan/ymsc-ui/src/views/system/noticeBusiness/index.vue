<template>
  <div :class="[isTwoRouter?'app-container':'']">
    <template v-if="isTwoRouter">
        <el-form :model="queryParams" ref="queryForm" size="small" :inline="true" v-show="showSearch" label-width="108px">
          <el-form-item label="メッセージタイプ" prop="deptId">
            <el-select v-model="queryParams.noticeType" placeholder="メッセージタイプ" clearable>
              <el-option
                v-for="dict in dict.type.sys_notice_type_business"
                :key="dict.value"
                :label="dict.label"
                :value="dict.value"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="メッセージステータス" prop="status">
            <el-select v-model="queryParams.status" placeholder="メッセージステータス" clearable>
              <el-option
                v-for="dict in dict.type.sys_notice_status_business"
                :key="dict.value"
                :label="dict.label"
                :value="dict.value"
              />
            </el-select>
          </el-form-item>
        </el-form>

        <el-row :gutter="10" class="mb8">
<!--          <el-col :span="1.5">-->
<!--            <el-button-->
<!--              type="primary"-->
<!--              plain-->
<!--              icon="el-icon-plus"-->
<!--              size="mini"-->
<!--              @click="handleAdd"-->
<!--              v-hasPermi="['noticeBusiness:noticeBusiness:add']"-->
<!--            >新規作成</el-button>-->
<!--          </el-col>-->
<!--          <el-col :span="1.5">-->
<!--            <el-button-->
<!--              type="success"-->
<!--              plain-->
<!--              icon="el-icon-edit"-->
<!--              size="mini"-->
<!--              :disabled="single"-->
<!--              @click="handleUpdate"-->
<!--              v-hasPermi="['noticeBusiness:noticeBusiness:edit']"-->
<!--            >更新</el-button>-->
<!--          </el-col>-->
<!--          <el-col :span="1.5">-->
<!--            <el-button-->
<!--              type="danger"-->
<!--              plain-->
<!--              icon="el-icon-delete"-->
<!--              size="mini"-->
<!--              :disabled="multiple"-->
<!--              @click="handleDelete"-->
<!--              v-hasPermi="['noticeBusiness:noticeBusiness:remove']"-->
<!--            >削除</el-button>-->
<!--          </el-col>-->
          <el-col :span="1.5">
            <el-button
              type="warning"
              plain
              icon="el-icon-download"
              size="mini"
              @click="handleExport"
              v-hasPermi="['noticeBusiness:noticeBusiness:export']"
            >エクスポート</el-button>
          </el-col>
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

        <el-table border v-loading="loading" :data="noticeBusinessList" border @selection-change="handleSelectionChange" ref="dataTable">
          <el-table-column type="selection" width="55" align="center" />
          <el-table-column label="メッセージタイプ" align="center" prop="noticeType" >
          <template slot-scope="scope">
            <dict-tag :options="dict.type.sys_notice_type_business" :value="scope.row.noticeType"/>
          </template>
          </el-table-column>
          <el-table-column label="メッセージ内容" align="center" prop="noticeContent" >
          <template slot-scope="scope">
            <span  class="link-type" @click="handleDetail(scope.row)">{{scope.row.noticeContent}}</span>
          </template>
          </el-table-column>>
          <el-table-column label="メッセージステータス" align="center" prop="status" >
            <template slot-scope="scope">
              <dict-tag :options="dict.type.sys_notice_status_business" :value="scope.row.status"/>
            </template>
          </el-table-column>
          <el-table-column label="送信者" align="center" prop="sender" />
          <el-table-column label="受信者" align="center" prop="receiver" />
          <el-table-column label="備考" align="center" prop="remark" />
<!--          <el-table-column label="操作" align="center" class-name="small-padding fixed-width">-->
<!--            <template slot-scope="scope">-->
<!--              <el-button-->
<!--                size="mini"-->
<!--                type="text"-->
<!--                icon="el-icon-edit"-->
<!--                @click="handleUpdate(scope.row)"-->
<!--                v-hasPermi="['noticeBusiness:noticeBusiness:edit']"-->
<!--              >更新</el-button>-->
<!--              <el-button-->
<!--                size="mini"-->
<!--                type="text"-->
<!--                icon="el-icon-delete"-->
<!--                @click="handleDelete(scope.row)"-->
<!--                v-hasPermi="['noticeBusiness:noticeBusiness:remove']"-->
<!--              >削除</el-button>-->
<!--            </template>-->
<!--          </el-table-column>-->
        </el-table>

        <pagination
          v-show="total>0"
          :total="total"
          :page.sync="queryParams.pageNum"
          :limit.sync="queryParams.pageSize"
          @pagination="getList"
        />
    </template>
      <template v-else>
          <router-view></router-view>
      </template>
  </div>
</template>

<script>
import { listNoticeBusiness, delNoticeBusiness, } from "@/api/system/noticeBusiness";
import Template from '@/views/system/template/index.vue'

export default {
  name: "NoticeBusiness",
  components: { Template },
  dicts: ['sys_notice_status_business','sys_notice_type_business'],
  data() {
    return {
      // 二段階ルートかどうか
      isTwoRouter: false,
      // 初回検索
      isFirstSearch: true,
      // ローディングマスク
      loading: true,
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
      // 業務メッセージテーブルデータ
      noticeBusinessList: [],
      // 検索パラメータ
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        noticeType: null,
        noticeContent: null,
        status: null,
        sender: null,
        receiver: null,
        deptId: null,
      }
    };
  },

  /* アクティブ */
  activated() {
    // 削除しない 一覧ルートかどうか判定
    const twoRouter = this.$route.query && this.$route.query.twoRouter;
    this.isTwoRouter = twoRouter;
    if (this.isTwoRouter && !this.isFirstSearch) {
      this.reload();
    }
    this.isFirstSearch = false;
  },

  created() {
    // 削除しない 一覧ルートかどうか判定
    const twoRouter = this.$route.query && this.$route.query.twoRouter;
    this.isTwoRouter = twoRouter;
    if (this.isTwoRouter) {
      this.getList();
    }
  },

  methods: {
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

    /** 業務メッセージリストを検索 */
    getList() {
      this.loading = true;
      listNoticeBusiness(this.queryParams).then(response => {
        this.noticeBusinessList = response.rows;
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

    // チェックボックス選択データ
    handleSelectionChange(selection) {
      this.ids = selection.map(item => item.id)
      this.single = selection.length!==1
      this.multiple = !selection.length
    },

    /** 詳細ボタン操作 */
    handleDetail(row) {
        const router = "/tool/noticeBusiness/noticeBusinessDetail/index/"+row.id;
        this.$router.push(router);
    },

    /** 新規作成ボタン操作 */
    handleAdd() {
        // TODO 手動でディレクトリルートを追加
        const router = "/noticeBusiness/noticeBusinessAdd";
        this.$router.push(router);
    },

    /** 更新ボタン操作 */
    handleUpdate(row) {
      // TODO 手動でディレクトリルートを追加
      const router = "/noticeBusiness/noticeBusinessEdit/"+row.id;
      this.$router.push(router);
    },

    /** 削除ボタン操作 */
    handleDelete(row) {
      const ids = row.id || this.ids;
      this.$modal.confirm('業務メッセージ番号が「' + ids + '」のデータを削除してもよろしいですか？').then(function() {
        return delNoticeBusiness(ids);
      }).then(() => {
        this.getList();
        this.$modal.msgSuccess("削除しました。");
      }).catch(() => {});
    },

    /** エクスポートボタン操作 */
    handleExport() {
      this.download('noticeBusiness/noticeBusiness/export', {
        ...this.queryParams
      }, `noticeBusiness_${new Date().getTime()}.xlsx`)
    }
  }
};
</script>
