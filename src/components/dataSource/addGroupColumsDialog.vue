<template>
  <div>
    <el-dialog class="addGroupColumsDialog" title="新字段" :visible.sync="addGroupColumsDialogVisible" width="40%">
      <form action onsubmit="return false">
        <div>
          <input class="colums_name" placeholder="字段名称" type="text">
        </div>
        <div class="fix">
          <div class="l select_left">
            分组字段
            <el-select v-model="addGroupColumsSelectValue" placeholder="请选择">
              <el-option v-for="item in addGroupColumsSelectOptions" :key="item.value" :label="item.label" :value="item.value">
              </el-option>
            </el-select>
          </div>
          <div class="l select_right">
            分组方式
            <el-select v-model="addGroupColumsMethodValue" placeholder="请选择">
              <el-option v-for="item in addGroupColumsMethodOptions" :key="item.value" :label="item.label" :value="item.value">
              </el-option>
            </el-select>
          </div>
        </div>

        <div class="edit_container">

        </div>

        <span slot="footer" class="dialog-footer">
          <el-button class="btn-confirm" type="primary" @click="addGroupColumsDialogVisible = false">确 定</el-button>
          <el-button class="btn-cancel" @click="addGroupColumsDialogVisible = false">取 消</el-button>
        </span>
      </form>
    </el-dialog>

  </div>
</template>
<script type="text/babel">
export default {
  mounted() {
  },
  data: () => ({
    // 页面控制
    //添加字段显示隐藏标志
    addColFlag: false,
    // 添加分组字段
    addGroupColumsDialogVisible: false,
    // 数据流
    addGroupColumsSelectValue: '',
    addGroupColumsSelectOptions: [{
      value: '选项1',
      label: '日期'
    }, {
      value: '选项2',
      label: '数值'
    }, {
      value: '选项3',
      label: '文本'
    }],
    //        添加分组字段 分组方式选择器
    addGroupColumsMethodOptions: [{
      value: '选项1',
      label: '常规'
    }, {
      value: '选项2',
      label: '年内'
    }, {
      value: '选项3',
      label: '表达式'
    }],
    addGroupColumsMethodValue: ''

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
<style scoped>

</style>
