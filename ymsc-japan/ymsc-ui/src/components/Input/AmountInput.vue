<template>
  <el-tooltip
    :disabled="!isOverflow"
    :content="formattedValue || ''"
    placement="top"
    effect="dark"
  >
    <input
      ref="amountInput"
      :value="formattedValue"
      :style="inputStyle"
      @input="handleInput"
      @blur="handleBlur"
      @mounted="checkOverflow"
      :placeholder="placeholder"
      :disabled="disabled"
      @keydown="handleKeydown"
      @paste="handlePaste"
      maxlength="10"
    />
  </el-tooltip>
</template>

<script>
export default {
  name: 'AmountInput',
  props: {
    value: {
      type: [String, Number],
      default: ''
    },
    decimalDigits: {
      type: Number,
      default: 0
    },
    placeholder: {
      type: String,
      default: ''
    },
    disabled: {
      type: Boolean,
      default: false
    },
    inputStyle: {
      type: Object,
      default: () => ({
        width: '100px',
        marginRight: '10px'
      })
    }
  },
  data() {
    return {
      formattedValue: '', 
      isOverflow: false 
    };
  },
  watch: {
    value: {
      immediate: true,
      handler(newVal) {
        this.formattedValue = this.formatAmount(newVal, this.decimalDigits);
        this.$nextTick(() => this.checkOverflow());
      }
    }
  },
  mounted() {
    this.checkOverflow();
  },
  methods: {
    checkOverflow() {
      const inputEl = this.$refs.amountInput;
      if (!inputEl) return;
      this.isOverflow = inputEl.scrollWidth > inputEl.clientWidth;
    },

    formatAmount(num, decimalDigits) {
      if (num === '' || num === null || num === undefined || isNaN(Number(num))) {
        return '';
      }

      // 统一转为字符串处理
      const numStr = Number(num).toString();
      const pureNum = numStr.replace(/[^0-9.]/g, '');
      const [integerPart, decimalPart] = pureNum.includes('.') ? pureNum.split('.') : [pureNum, ''];
      
      const formattedInteger = integerPart || integerPart === '0' ? integerPart.replace(/\B(?=(\d{3})+(?!\d))/g, ',') : '0';
      let formattedDecimal = '';

      if (decimalDigits > 0) {
        formattedDecimal = decimalPart ? decimalPart.slice(0, decimalDigits) : '';
        while (formattedDecimal.length < decimalDigits) {
          formattedDecimal += '0';
        }
      }

      return decimalDigits > 0 ? `${formattedInteger}.${formattedDecimal}` : formattedInteger;
    },

    restoreAmount(formattedStr) {
      if (!formattedStr) return '';
      const pure = formattedStr.replace(/,/g, '');
      return pure === '.' ? '0' : pure;
    },

    filterNumberInput(val) {
      if (!val) return '';
      let filtered = val.replace(/[^0-9.]/g, '');
      const dotIndex = filtered.indexOf('.');
      if (dotIndex !== -1) {
        filtered = filtered.slice(0, dotIndex + 1) + filtered.slice(dotIndex + 1).replace(/\./g, '');
      }
      if (filtered.startsWith('.')) {
        filtered = '0' + filtered;
      }
      return filtered || '';
    },

    handleInput(e) {
      const inputVal = e.target.value;
      const filteredVal = this.filterNumberInput(inputVal);
      const pureVal = this.restoreAmount(filteredVal);
      this.formattedValue = this.formatAmount(pureVal, this.decimalDigits);
      this.$emit('input', pureVal || (filteredVal === '0' ? '0' : ''));
      this.checkOverflow();
    },

    handleBlur() {
      let finalVal = this.value;
      if (finalVal === '' || finalVal === null || finalVal === undefined) {
        this.formattedValue = '';
        finalVal = '';
      } else {
        this.formattedValue = this.formatAmount(finalVal, this.decimalDigits);
      }
      
      this.$emit('change', finalVal);
      this.$emit('input', finalVal);
      this.checkOverflow();
    },

    handleKeydown(e) {
      const allowedKeys = [
        '0', '1', '2', '3', '4', '5', '6', '7', '8', '9',
        'Numpad0', 'Numpad1', 'Numpad2', 'Numpad3', 'Numpad4', 'Numpad5', 'Numpad6', 'Numpad7', 'Numpad8', 'Numpad9',
        '.', 'NumpadDecimal',
        'Backspace', 'Delete', 'ArrowLeft', 'ArrowRight', 'Tab', 'Enter' 
      ];
      
      if (this.disabled) {
        e.preventDefault();
        return;
      }

      if (!allowedKeys.includes(e.key)) {
        e.preventDefault();
      }

      const currentVal = e.target.value;
      if ((e.key === '.' || e.key === 'NumpadDecimal') && currentVal.includes('.')) {
        e.preventDefault();
      }

      if (e.key === 'Enter') {
        e.preventDefault();
        this.$refs.amountInput.blur();
      }
    },

    handlePaste(e) {
      if (this.disabled) return;
      e.preventDefault();
      const pasteContent = (e.clipboardData || window.clipboardData).getData('text');
      const filteredContent = this.filterNumberInput(pasteContent);
      if (filteredContent) {
        this.handleInput({ target: { value: filteredContent } });
      }
    }
  }
};
</script>

<style scoped>
input {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  padding: 4px 6px;
  box-sizing: border-box;
  text-align: right !important;
}
</style>