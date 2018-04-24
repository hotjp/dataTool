<template>
    <div>
        <el-dialog title="数据源操作" :visible.sync="dialogFormVisible">
            <el-form v-loading="loading" :model="form" onsubmit="return false">
                <input v-model="form.id" type="hidden">
                <el-form-item label="数据源类型" :label-width="formLabelWidth">
                    <el-input @input="saveFlagFalse" v-model="form.dbType" readonly="readonly" auto-complete="off"></el-input>
                </el-form-item>
                <el-form-item label="名称" :label-width="formLabelWidth">
                    <el-input @input="saveFlagFalse" v-model="form.name" auto-complete="off"></el-input>
                </el-form-item>
                <el-form-item label="主机" :label-width="formLabelWidth">
                    <el-input @input="saveFlagFalse" v-model="form.jdbcHost" auto-complete="off"></el-input>
                </el-form-item>
                <el-form-item label="端口" :label-width="formLabelWidth">
                    <el-input @input="saveFlagFalse" v-model="form.jdbcPort" auto-complete="off"></el-input>
                </el-form-item>
                <el-form-item label="数据库" :label-width="formLabelWidth">
                    <el-input @input="saveFlagFalse" v-model="form.jdbcDatabase" auto-complete="off"></el-input>
                </el-form-item>
                <el-form-item label="账号" :label-width="formLabelWidth">
                    <el-input @input="saveFlagFalse" v-model="form.jdbcUser" auto-complete="off"></el-input>
                </el-form-item>
                <el-form-item label="密码" :label-width="formLabelWidth">
                    <el-input @input="saveFlagFalse" v-model="form.password" type="password" auto-complete="off"></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <span class="tipText" :class="{opcityP:!saveFlag}">测试成功，请点击保存</span>
                <el-button class="btn-confirm" type="primary" @click="onClickDataSourceSave">保存</el-button>
                <el-button class="btn-confirm" @click="onClickDataSourceTest">测试链接</el-button>
            </div>
        </el-dialog>
    </div>
</template>
<script type="text/babel">
import { getJson } from "../../router/utils";
export default {
  data: () => ({
    // 页面控制
    // 保存状态
    saveFlag: false,
    // 数据源操作弹窗
    dialogFormVisible: true,
    loading: false,    
    // 数据流
    formLabelWidth: "120px"
  }),
  watch: {
    dialogFormVisible: function(val) {
      if (val === false) {
        this.saveFlag = false;
      }
      this.changeFatherDialogFormVisible(val);
    }
  },
  methods: {
    onClickDataSourceTest() {
      let that = this;
      that.loading = true;
      getJson(
        "/datasource/test.do",
        {
          id: that.form.id,
          name: that.form.name,
          dbType: that.form.dbType,
          host: that.form.jdbcHost,
          port: that.form.jdbcPort,
          user: that.form.jdbcUser,
          password: that.form.password,
          database: that.form.jdbcDatabase
        },
        function(res) {
          that.loading = false;
          if (res.success) {
            that.$message("测试成功");
            that.saveFlag = true;
            //   console.log(resData.data.rows);
          } else {
            // console.log(res);
            that.$message("测试失败" + res.errorMessage);
            that.saveFlag = false;
          }
        }
      );
    },
    onClickDataSourceSave() {
      let that = this;
      if (that.saveFlag) {
        that.loading = true;
        getJson(
          "/datasource/save.do",
          {
            id: that.form.id,
            name: that.form.name,
            dbType: that.form.dbType,
            host: that.form.jdbcHost,
            port: that.form.jdbcPort,
            user: that.form.jdbcUser,
            password: that.form.password,
            database: that.form.jdbcDatabase
          },
          function(res) {
            that.loading = false;
            if (res.success) {
              that.dialogFormVisible = false;
              that.$message("保存成功");
            } else {
              that.$message("保存未成功");
            }
          }
        );
      } else {
        this.$message("测试链接未通过，请通过测试后再保存");
      }
    },
    changeFatherDialogFormVisible(value) {
      //向父组件传值
      this.$emit("changeDialogFormVisible", value);
    },
    saveFlagFalse() {
      this.saveFlag = false;
    }
  },
  props: ["form"]
};
</script>
<style scoped>
.tipText {
  display: inline-block;
  font-size: 14px;
  margin-right: 10px;
  color: #409eff;
  line-height: 32px;
}

.opcityP {
  opacity: 0;
}
</style>