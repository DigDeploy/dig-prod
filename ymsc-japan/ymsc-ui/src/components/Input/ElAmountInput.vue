<template>
  <el-tooltip
    :disabled="!isOverflow"
    :content="formattedValue || ''"
    placement="top"
    effect="dark"
  >
    <el-input
      size="mini"
      ref="ElAmountInput" 
      v-model="formattedValue"
      @input="handleInput"
      @blur="handleBlur"
      :placeholder="placeholder"
      :disabled="disabled"
      @keydown="handleKeydown"
      @paste="handlePaste"
      maxlength="10"
      @paste.native.prevent="prevent"
      @copy.native.prevent="prevent"
      @cut.native.prevent="prevent"
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
     prevent() {
      return false;
    },
    checkOverflow() {
      const inputEl = this.$refs.ElAmountInput;
      if (!inputEl) return;
      const inputDom = inputEl.$el?.querySelector('input') || inputEl;
      this.isOverflow = inputDom.scrollWidth > inputDom.clientWidth;
    },

    formatAmount(num, decimalDigits) {
      if (num === '' || num === null || num === undefined || isNaN(Number(num))) {
        return '';
      }

      const numValue = Number(num);
      let numStr = numValue.toString().replace(/,/g, '');
      if (!numStr) return '0'; 

      let integerPart = '';
      let decimalPart = '';
      const dotIndex = numStr.indexOf('.');
      if (dotIndex !== -1) {
        integerPart = numStr.slice(0, dotIndex) || '0';
        decimalPart = numStr.slice(dotIndex + 1);
      } else {
        integerPart = numStr;
      }

      const formattedInteger = integerPart.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
      let formattedDecimal = '';
      
      if (decimalDigits > 0) {
        formattedDecimal = decimalPart.slice(0, decimalDigits);
        while (formattedDecimal.length < decimalDigits) {
          formattedDecimal += '0';
        }
        return `${formattedInteger}.${formattedDecimal}`;
      }

      return formattedInteger || '0';
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
      return filtered;
    },

    handleInput(val) {
      if (this.disabled) return;
      const filteredVal = this.filterNumberInput(val);
      const pureVal = this.restoreAmount(filteredVal);
      const formatted = this.formatAmount(pureVal, this.decimalDigits);
      if (formatted !== this.formattedValue) {
        this.formattedValue = formatted;
      }
      this.$emit('input', pureVal || (filteredVal === '0' ? '0' : ''));
      this.$nextTick(() => this.checkOverflow());
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
      if (e.ctrlKey) {
        const key = e.key.toLowerCase();
        if (key === 'c' || key === 'v' || key === 'x') {
          e.preventDefault();
          e.stopPropagation();
          return;
        }
      }

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

      const currentVal = this.formattedValue;
      if ((e.key === '.' || e.key === 'NumpadDecimal') && currentVal.includes('.')) {
        e.preventDefault();
      }

      if (e.key === 'Enter') {
        e.preventDefault();
        const inputDom = this.$refs.ElAmountInput;
        if (inputDom) inputDom.blur();
      }
    },

    handlePaste(e) {
      if (this.disabled) return;
      e.preventDefault();
      const pasteContent = (e.clipboardData || window.clipboardData).getData('text');
      const filteredContent = this.filterNumberInput(pasteContent);
      if (filteredContent) {
        this.formattedValue = filteredContent;
        this.handleInput(filteredContent);
      }
    }
  }
};
</script>

<style scoped>
:deep(.el-input__inner) {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  text-align: right;
}
</style>