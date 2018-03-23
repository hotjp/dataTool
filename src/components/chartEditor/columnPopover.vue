<template>
  <div>
    <el-dialog class="columnPopover" title="添加字段" :visible.sync="addColFlag" width="30%">
      <div>
        <a href="javascript:;" @click="onClickAddComputedColumsDialog">添加计算字段</a>
        <a href="javascript:;" @click="onAddGroupColumsDialog">添加分组字段</a>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button class="btn-confirm" type="primary" @click="addColFlag = false">确 定</el-button>
        <el-button class="btn-cancel" @click="addColFlag = false">取 消</el-button>
      </span>

    </el-dialog>

  </div>
</template>
<script type="text/babel">
export default {
  mounted() {
  },
  data: () => ({
    //添加字段显示隐藏标志
    addColFlag: false

  }),
  methods: {
    //      添加计算字段
    onClickAddComputedColumsDialog() {
      this.addColFlag = false;
      this.addComputedColumsDialogVisible = true;
    },
    // //      添加分组字段
    onAddGroupColumsDialog() {
      this.addColFlag = false;
      this.addGroupColumsDialogVisible = true;
      // console.log(data);
    }
  }
};
</script>