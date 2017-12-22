<template>
  <el-dialog class="value_set_colums" title="设置字段" :visible.sync="option.valueSetColums" width="30%">
    <p>设置当前字段别名</p>
    <input type="text" class="set_alias" placeholder="别名">
    <p>设置当前字段单位</p>
    <input type="text" class="set_unit" placeholder="单位">
    <p>字段描述</p>
    <input type="text" class="field_description" placeholder="字段描述">
    <span slot="footer" class="dialog-footer">
      <el-button @click="valueSetColums(0)">取 消</el-button>
      <el-button type="primary" @click="valueSetColums(1)">确 定</el-button>
    </span>
  </el-dialog>
</template>
<script type="text/babel">
export default {
  data: () => ({
    // 维度设置字段弹出框
    option:{
      valueSetColums: false
    }
  }),
  props: ['YfieldOption'],
  methods: {
    valueSetColums(e){
      // if(e){}
      this.option.valueSetColums=false;
      this.$emit('Yfield', this.option);
    }
  },
  mounted() {
    this.option=Object.assign({}, this.option, this.YfieldOption);
  },
  watch: {
    YfieldOption: {
      handler: function(val, oldval) {
        this.option=Object.assign({}, this.option, this.YfieldOption);
      },
      deep: true
    },
    'option.valueSetColums':{
      handler:function(val,oldval){
        this.$emit('Yfield', this.option);
      }
    }
  }
};
</script>
<style scoped>

</style>