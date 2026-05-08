<template>
  <div>
    <el-button
      type="primary"
      :loading="loading"
      @click="handlePrint"
    >
      {{ loading ? '生成中...' : '旅費精算請求書を印刷' }}
    </el-button>
    
    <div v-if="errorMessage" style="color: red; margin-top: 10px;">
      {{ errorMessage }}
    </div>
  </div>
</template>

<script>
import { printRyohiSeisan } from "@/api/system/print";

export default {
  name: 'RyohiSeisanPrint',
  data() {
    return {
      loading: false,
      errorMessage: ''
    };
  },
  methods: {
    async handlePrint() {
      this.loading = true;
      this.errorMessage = '';
      
      try {
        console.log('旅費精算請求書PDFを生成中...');
        
        // API呼び出し
        const blob = await printRyohiSeisan();
        
        if (!blob || blob.size === 0) {
          throw new Error('サーバーから返されたPDFファイルが空です');
        }
        
        console.log('PDF受信:', {
          size: blob.size,
          type: blob.type
        });
        
        // オブジェクトURL作成
        const url = URL.createObjectURL(blob);
        
        // 新しいウィンドウで開く
        const printWindow = window.open(url, '_blank');
        
        if (!printWindow) {
          throw new Error('ポップアップがブラウザによってブロックされました。ポップアップを許可して再試行してください');
        }
        
        // ユーザーへのメッセージ
        this.$message.success('旅費精算請求書PDFが生成されました。ブラウザで印刷してください');
        
        // 5秒後にURLを解放
        setTimeout(() => {
          URL.revokeObjectURL(url);
        }, 5000);
        
      } catch (error) {
        console.error('印刷失敗:', error);
        this.errorMessage = `エラー: ${error.message}`;
        this.$message.error(`印刷失敗: ${error.message}`);
      } finally {
        this.loading = false;
      }
    }
  }
};
</script>