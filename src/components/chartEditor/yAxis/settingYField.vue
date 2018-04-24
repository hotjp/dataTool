<template>
  <el-dialog class="value_set_colums" title="设置字段" :visible.sync="option.valueSetColums" width="30%">
    <form onsubmit="return false">
      <p>设置当前字段别名</p>
      <input type="text" class="set_alias" placeholder="别名">
      <p>设置当前字段单位</p>
      <input type="text" class="set_unit" placeholder="单位">
      <p>字段描述</p>
      <input type="text" class="field_description" placeholder="字段描述">
    </form>
    <span slot="footer" class="dialog-footer">
      <el-button class="btn-confirm" type="primary" @click="valueSetColums(1)">确 定</el-button>
      <el-button class="btn-cancel" @click="valueSetColums(0)">取 消</el-button>
    </span>
  </el-dialog>
</template>
<script type="text/babel">
export default {
  mounted() {
    this.option=Object.assign({}, this.option, this.YfieldOption);
  },
  data: () => ({
    // 维度设置字段弹出框
    option:{
      valueSetColums: false
    }
  }),
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
  },
  methods: {
    valueSetColums(e){
      // if(e){}
      this.option.valueSetColums=false;
      this.$emit('Yfield', this.option);
    }
  },
  props: ['YfieldOption'],
};
</script>
<style scoped>

</style>