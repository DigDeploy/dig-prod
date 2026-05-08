<template>
  <div class="top-right-btn" :style="style">
    <el-row>
      <el-tooltip class="item" effect="dark" :content="showSearch ? '検索を非表示' : '検索を表示'" placement="top" v-if="search">
        <el-button size="mini" circle icon="el-icon-search" @click="toggleSearch()"/>
      </el-tooltip>
      <el-tooltip class="item" effect="dark" content="リフレッシュ" placement="top">
        <el-button size="mini" circle icon="el-icon-refresh" @click="refresh()"/>
      </el-tooltip>
      <el-tooltip class="item popover" effect="dark" content="列の表示/非表示" placement="top" v-if="columns">
        <el-popover placement="bottom" trigger="click">
          <div class="tree-header">列の表示/非表示</div>
          <el-tree
            ref="columnRef"
            :data="columns"
            show-checkbox
            @check="columnChange"
            node-key="key"
            :props="{ label: 'label', children: 'children' }"
          ></el-tree>
          <template #reference>
            <el-button size="mini" circle icon="el-icon-menu"/>
          </template>
        </el-popover>
      </el-tooltip>
    </el-row>
    <el-dialog :title="title" :visible.sync="open" append-to-body>
      <el-transfer
        :titles="['表示', '非表示']"
        v-model="value"
        :data="columns"
        @change="dataChange"
      ></el-transfer>
    </el-dialog>
  </div>
</template>
<script>
  export default {
    name: "RightToolbar",
    data() {
      return {
        // 表示/非表示データ
        value: [],
        // ポップアップタイトル
        title: "列の表示/非表示",
        // ポップアップの表示有無
        open: false,
      };
    },
    props: {
      showSearch: {
        type: Boolean,
        default: true,
      },
      columns: {
        type: Array,
      },
      search: {
        type: Boolean,
        default: true,
      },
      gutter: {
        type: Number,
        default: 10,
      },
    },
    computed: {
      style() {
        const ret = {};
        if (this.gutter) {
          ret.marginRight = `${this.gutter / 2}px`;
        }
        return ret;
      }
    },
    mounted() {
      // 列の表示/非表示初期設定（デフォルト表示列を設定）
      this.columns?.forEach((item) => {
        if (item.visible) {
          this.$refs.columnRef.setChecked(item.key, true, false);
        }
      })
    },
    created() {
      // 列の表示/非表示初期設定（デフォルト非表示列を設定）
      for (let item in this.columns) {
        if (this.columns[item].visible === false) {
          this.value.push(parseInt(item));
        }
      }
    },
    methods: {
      // 検索の表示/非表示切り替え
      toggleSearch() {
        this.$emit("update:showSearch", !this.showSearch);
      },
      // リフレッシュ処理
      refresh() {
        this.$emit("queryTable");
      },
      // 右側リスト要素の変更処理
      dataChange(data) {
        for (let item in this.columns) {
          const key = this.columns[item].key;
          this.columns[item].visible = !data.includes(key);
        }
      },
      // 列の表示/非表示ダイアログを開く
      showColumn() {
        this.open = true;
      },
      // データ列の表示/非表示を変更
      columnChange(nodeObject, checkedObject) {
        this.columns?.forEach((item) => {
          item.visible = checkedObject.checkedKeys.includes(item.key);
        })
      }
    },
  }
  ;
</script>
<style lang="scss" scoped>
  ::v-deep .el-transfer__button {
    border-radius: 50%;
    padding: 12px;
    display: block;
    margin-left: 0px;
  }

  .item.popover {
    margin-left: 10px;
  }

  ::v-deep .el-transfer__button:first-child {
    margin-bottom: 10px;
  }
</style>