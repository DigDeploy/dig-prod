<template>
  <div>
    <el-button
      type="primary"
      :loading="loading"
      @click="handlePrint"
    >
      {{ loading ? '生成中...' : '打印空白发票' }}
    </el-button>
    
    <div v-if="errorMessage" style="color: red; margin-top: 10px;">
      {{ errorMessage }}
    </div>
  </div>
</template>

<script>
import { print } from "@/api/system/print";
import axios from 'axios';

export default {
  name: 'PrintPage',
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
        console.log('开始请求PDF...');
        
        // 直接调用API，返回的是Blob
        const blob = await print();
        
        if (!blob || blob.size === 0) {
          throw new Error('服务器返回的PDF文件为空');
        }
        
        console.log('收到Blob:', {
          size: blob.size,
          type: blob.type
        });
        
        // 创建对象URL
        const url = URL.createObjectURL(blob);
        
        // 直接打开新窗口预览和打印
        const printWindow = window.open(url, '_blank');
        
        if (!printWindow) {
          throw new Error('弹出窗口被浏览器阻止，请允许弹窗后重试');
        }
        
        // 给用户提示
        this.$message.success('PDF已生成，请在浏览器中打印');
        
        // 5秒后清理URL（确保窗口已打开）
        setTimeout(() => {
          URL.revokeObjectURL(url);
        }, 5000);
        
      } catch (error) {
        console.error('打印失败:', error);
        this.errorMessage = `错误: ${error.message}`;
        this.$message.error(`打印失败: ${error.message}`);
      } finally {
        this.loading = false;
      }
    }
  }
};
</script>