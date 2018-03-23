<template>
  <el-dialog class="category_set_colums" title="设置字段" :visible.sync="option.categorySetColums" width="30%">
    <form onsubmit="return false">
      <p>设置当前字段别名</p>
      <input type="text" class="set_alias" placeholder="别名">
      <p>字段描述</p>
      <input type="text" class="field_description" placeholder="字段描述">
      <span slot="footer" class="dialog-footer">
        <el-button class="btn-confirm" type="primary" @click="categorySetColums(1)">确 定</el-button>
        <el-button class="btn-cancel" @click="categorySetColums(0)">取 消</el-button>
      </span>
    </form>
  </el-dialog>
</template>
<script type="text/babel">
export default {
  mounted() {
    this.option=Object.assign({}, this.option, this.XfieldOption);
  },
  data: () => ({
    // 维度设置字段弹出框
    option:{
      categorySetColums: false
    }
  }),
  watch: {
    XfieldOption: {
      handler: function(val, oldval) {
        // 发数据
        this.option=Object.assign({}, this.option, this.XfieldOption);
      },
      deep: true
    },
    'option.categorySetColums':{
      handler:function(val,oldval){
        this.$emit('Xfield', this.option);
      }
    }
  },
  methods: {
    categorySetColums(e){
      // if(e){}
      this.option.categorySetColums=false;
      this.$emit('Xfield', this.option);
    }
  },
  props: ['XfieldOption']
  
};
</script>
<style scoped>

</style>

