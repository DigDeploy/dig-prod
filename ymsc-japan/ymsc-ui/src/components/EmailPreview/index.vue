<template>
  <el-dialog
    :title="title"
    :visible.sync="visible"
    width="50%"
    append-to-body
    :before-close="handleClose"
    :close-on-click-modal='false'
    :close-on-press-escape='false'
  >
    <el-tabs
      v-model="editableTabsValue"
      type="card"
      :editable="editFlag"
      @edit="createTab"
    >
      <el-tab-pane
        v-for="(item, index) in this.editableTabs"
        :key="item.tmplCode"
        :label="item.tabName"
        :name="item.tabName"
      >
        <el-form :model="item" :key="index">
          <el-row :gutter="24">
            <el-col :span="24">
              <el-form-item label="メール件名" prop="title">
                <el-input
                  v-model="item.title"
                  placeholder=""
                  clearable
                />
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="24">
            <el-col :span="12">
              <el-form-item label="受信者" prop="projectNumber">
                <dept-user-input
                  v-model="item.receiver"
                  :ref="`mailRecipientInput_${index}`"
                  placeholder=""
                  class="w-100"
                  @callback="(val) => replaceReceiverField(val, index)"
                />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="Cc受信者" prop="projectNumber">
                <dept-user-input
                  v-model="item.ccTo"
                  :ref="`mailCcInput_${index}`"
                  placeholder=""
                  class="w-100"
                  @callback="(val) => replaceCcToField(val, index)"
                />
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="24">
            <el-col :span="24">
              <el-form-item label="メール内容" prop="content">
                <el-input
                  type="textarea"
                  :rows="15"
                  v-model="item.content"
                  placeholder=""
                  clearable
                />
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
      </el-tab-pane>
    </el-tabs>

    <!-- dialog フッター -->
    <div slot="footer" class="dialog-footer">
      <el-button type="primary" @click="handleSubmit">確定</el-button>
      <el-button @click="handleClose">キャンセル</el-button>
    </div>
  </el-dialog>
</template>
<script>
  import DeptUserInput from "@/components/DeptUser/multipleInput";
  import {cloneDeep} from 'lodash'
  import {formatTemplateField} from "./func";
  import {initEmailPreviewList} from "@/api/emailPreview/preview";

  export default {
    name: "EmailPreviewCom",
    components: {
      DeptUserInput
    },

    props: {
      bizType: String,
      default: "other"
    },

    data() {
      return {
        editableTabsValue: "",
        title: "メール内容プレビュー",
        editFlag: true,
        visible: false,
        editableTabs: [],
        tmplCode: null,
        // 置換データ
        formatData: {}
      };
    },
    computed: {},
    methods: {

      // 開く
      open(previewList, formatData) {
        this.visible = true;
        this.$modal.loading();
        this.formatData = cloneDeep(formatData);
        previewList = previewList || [];

        // テンプレートデータが存在する場合
        if (previewList.length) {
          // 最初のTabをデフォルトで展開
          this.editableTabsValue = cloneDeep(previewList[0].tabName);
          this.tmplCode = cloneDeep(previewList[0].tmplCode);
        }

        // テンプレートデータ
        let editableTabs = cloneDeep(previewList);

        // テンプレート文字置換
        editableTabs.forEach(obj => {
          // メール件名
          obj.title = obj.title || formatData.name;
          // メール受信者、Cc受信者
          obj.receiver = obj.receiver || (formatData.receiver || undefined);
          obj.receiverName = obj.receiverName || (formatData.receiverName || '${receiverName}');
          obj.ccTo = obj.ccTo || (formatData.ccTo || undefined);
          obj.ccToName = obj.ccToName || (formatData.ccToName || '${ccToName}');
          // 業務タイプ
          obj.bizType = this.bizType;

          // 独立したフォーマット
          let tmplFormatData = {
            ...formatData,
            receiver: obj.receiver,
            receiverName: obj.receiverName,
            ccTo: obj.ccTo,
            ccToName: obj.ccToName,
          }

          // テンプレートを置換
          obj.content = formatTemplateField(obj.content, tmplFormatData);
        })

        this.editableTabs = editableTabs;
        this.$modal.closeLoading();
      },

      // 開く
      init(id,bizType) {
        this.visible = true;
        this.$modal.loading();

        initEmailPreviewList({
          bizType: bizType,
          bizId: id,
        }).then((response) => {
          let previewList = response.data;
          // テンプレートデータが存在する場合
          if (previewList.length) {
            // 最初のTabをデフォルトで展開
            this.editableTabsValue = cloneDeep(previewList[0].tabName);
            this.tmplCode = cloneDeep(previewList[0].tmplCode);
          }
          this.editableTabs = previewList;
          this.$modal.closeLoading();
        }).finally(() => this.$modal.closeLoading())


      },

      // 検証
      checkData() {
        // 少なくとも1件の検証
        if (this.editableTabs.length <= 0) {
          this.$modal.msgError("メールプレビューデータの取得に異常が発生しました。ページを更新して再試行してください");
          return true;
        }
      },
      // 送信
      handleSubmit() {
        // //データを検証
        // if (this.checkData()) {
        //   return;
        // }
        this.$modal.loading()
        // 業務キーを設定
        this.editableTabs.forEach((obj) => {
          obj.bizType = cloneDeep(this.bizType);
        });
        this.$emit("submit", this.editableTabs);

        this.handleClose();
        this.$modal.closeLoading();
      },

      // 戻る、閉じる
      handleClose(submit) {
        // DOM レンダリング完了
        this.$nextTick(() => {
          // ポップアップを閉じる
          this.visible = false;
          this.editableTabs = [];
          this.tmplCode = null;
          this.editableTabsValue = "";
        });
      },

      // タブを作成
      createTab(targetName, action) {
        if (action === "add") {
          // 一時タブコードの集合
          let tempNoList = this.editableTabs.filter(item => item.tabName.includes("一時"))
              .map(obj => {
                let temp = obj.tabName.split("_");
                return Number(temp[1])
              });

          // 一時番号
          let tempNo = (tempNoList.length ? Math.max(...tempNoList) : 0) + 1;
          // タブ名
          targetName = `一時_${tempNo}`;
          this.handleTabsEdit(targetName, action);
        } else {
          this.handleTabsEdit(targetName, action);
        }
      },

      // tab編集
      handleTabsEdit(targetName, action) {
        if (action === "add") {
          this.editableTabs.push({
            tabName: targetName,
            tmplCode: targetName,
            tmplContent: "",
          });
          this.editableTabsValue = targetName;
        }
        if (action === "remove") {
          let tabs = this.editableTabs;
          let activeName = this.editableTabsValue;
          if (activeName === targetName) {
            tabs.forEach((tab, index) => {
              if (tab.tabName === targetName) {
                let nextTab = tabs[index + 1] || tabs[index - 1];
                if (nextTab) {
                  activeName = nextTab.tabName;
                }
              }
            });
          }
          this.editableTabsValue = activeName;
          this.editableTabs = cloneDeep(
              tabs.filter((tab) => tab.tabName !== targetName)
          );
        }
      },

      // 受信者を置換
      replaceReceiverField(userList, index) {
        // 行データ
        let itemRow = this.editableTabs[index];
        // 受信者名
        let receiverName = userList.map(item => item.nickName).join() || '${receiverName}';

        // 受信者テンプレート文字が存在しない場合、置換ロジックを実行する必要がない
        if (!(itemRow.tmplContent || "").includes("${receiverName}")) {
          itemRow.receiverName = receiverName;
          return;
        }

        // テンプレート置換
        let replaceContent = formatTemplateField(itemRow.content, {receiverName: receiverName});
        // テキスト内容
        replaceContent = replaceContent.replaceAll(itemRow.receiverName, receiverName);

        // 値を代入
        itemRow.receiverName = receiverName;
        itemRow.content = replaceContent;

        // 受信者を代入
        this.$set(this.editableTabs, index, itemRow);
      },

      // Cc受信者を置換
      replaceCcToField(userList, index) {
        // 行データ
        let itemRow = this.editableTabs[index];
        // Cc受信者名
        let ccToName = userList.map(item => item.nickName).join() || '${ccToName}';

        // Cc受信者テンプレート文字が存在しない場合、置換ロジックを実行する必要がない
        if (!(itemRow.tmplContent || "").includes('${ccToName}')) {
          itemRow.ccToName = ccToName;
          return;
        }

        // テンプレート置換
        let replaceContent = formatTemplateField(itemRow.content, {ccToName: ccToName});
        // テキスト内容
        replaceContent = replaceContent.replaceAll(itemRow.ccToName, ccToName);

        // 値を代入
        itemRow.ccToName = ccToName;
        itemRow.content = replaceContent;

        // 受信者を代入
        this.$set(this.editableTabs, index, itemRow);
      }
    },
  };
</script>
<style scoped lang="scss">
</style>
