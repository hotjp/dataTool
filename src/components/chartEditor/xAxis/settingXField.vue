<template>
  <el-dialog class="category_set_colums" title="设置字段" :visible.sync="option.categorySetColums" width="30%">
    <p>设置当前字段别名</p>
    <input type="text" class="set_alias" placeholder="别名">
    <p>字段描述</p>
    <input type="text" class="field_description" placeholder="字段描述">
    <span slot="footer" class="dialog-footer">
      <el-button @click="categorySetColums(0)">取 消</el-button>
      <el-button type="primary" @click="categorySetColums(1)">确 定</el-button>
    </span>
  </el-dialog>
</template>
<script type="text/babel">
export default {
  data: () => ({
    // 维度设置字段弹出框
    option:{
      categorySetColums: false
    }
  }),
  props: ['XfieldOption'],
  methods: {
    categorySetColums(e){
      // if(e){}
      this.option.categorySetColums=false;
      this.$emit('Xfield', this.option);
    }
  },
  mounted() {
    this.option=Object.assign({}, this.option, this.XfieldOption);
  },
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
  }
};
</script>
<style scoped>

</style>

