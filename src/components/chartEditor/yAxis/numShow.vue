<template>
  <el-dialog class="value_display_format" title="设置字段数值显示格式" :visible.sync="option.valueDisplayFormat" width="30%">
    <form action onsubmit="return false">
      <el-radio v-model="option.valueFormatRadio" label="1">显示为数值</el-radio>
      <div class="decimal_digits">
        小数位数
        <input type="text" placeholder="2">
      </div>
      <div class="thousands_separator">
        <el-checkbox v-model="option.thousandsSeparator">使用千位分隔符</el-checkbox>
      </div>
      <div class="numeric_unit_div">
        数值单位
        <el-select class="numeric_unit" v-model="option.numericUnit" placeholder="无">
          <el-option v-for="item in numericUnitOptions" :key="item.value" :label="item.label" :value="item.value">
          </el-option>
        </el-select>
      </div>

      <el-radio v-model="option.valueFormatRadio" label="2">显示为百分数</el-radio>
      <div class="decimal_digits">
        小数位数
        <input type="text" placeholder="2">
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="valueDisplayFormat(0)">取 消</el-button>
        <el-button type="primary" @click="valueDisplayFormat(1)">确 定</el-button>
      </span>
    </form>
  </el-dialog>
</template>
<script type="text/babel">
export default {
  data: () => ({
    option:{
      valueDisplayFormat: false,
      numericUnit: '',
      valueFormatRadio: '1',
      thousandsSeparator: true
    },
    numericUnitOptions: [{
      value: '无',
      label: '无'
    }, {
      value: '万',
      label: '万'
    }, {
      value: '亿',
      label: '亿'
    }, {
      value: 'k',
      label: 'k'
    }, {
      value: 'M',
      label: 'M'
    }, {
      value: 'G',
      label: 'G'
    }]
  }),
  props: ['YnumOption'],
  methods: {
    // 隐藏组件并传值
    valueDisplayFormat(e){
      this.option.valueDisplayFormat=false;
      this.$emit('Ynum', this.option);
    }
  },
  mounted() {
    this.option=Object.assign({}, this.option, this.YnumOption);
  },
  watch: {
    YnumOption: {
      handler: function(val, oldval) {
        // 发数据
        this.option=Object.assign({}, this.option, this.YnumOption);
      },
      deep: true
    },
    'option.valueDisplayFormat':{
      handler:function(val,oldval){
        this.$emit('Ynum', this.option);
      }
    }
  }
};
</script>
<style scoped>

</style>