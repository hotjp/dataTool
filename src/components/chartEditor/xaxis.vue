<template>
  <div class="xaxis">
    <form action onsubmit="return false">
      <el-collapse v-model="activeNames">
        <el-collapse-item title="坐标X轴" name="1">
          <div>
            <el-checkbox v-model="xaxis.show">显示坐标轴</el-checkbox>
          </div>
          <div class="fix ">
            <lineStyle :color.sync="xaxis.axisLine.lineStyle.color" :type.sync="xaxis.axisLine.lineStyle.type" :width.sync="xaxis.axisLine.lineStyle.width" ></lineStyle>
          </div>
          <div>
            <el-checkbox v-model="xaxis.axisLabel.show">显示标签</el-checkbox>
          </div>
          <div class="fix ">
            <font :color.sync="xaxis.axisLabel.color" :fontFamily.sync="xaxis.axisLabel.fontFamily" :fontSize.sync="xaxis.axisLabel.fontSize"  ></font>
          </div>

          <div>
            <el-checkbox v-model="xaxis.splitLine.show">纵向网格线</el-checkbox>
          </div>
          <div class="fix ">
            <lineStyle :color.sync="xaxis.splitLine.lineStyle.color" :type.sync="xaxis.splitLine.lineStyle.type" :width.sync="xaxis.splitLine.lineStyle.width" ></lineStyle>
          </div>
        </el-collapse-item>
      </el-collapse>
    </form>
  </div>
</template>
<script type="text/babel">
import lineStyle from './propSelect/lineStyle.vue';
import font from './propSelect/font.vue';

export default {
  components: {
    lineStyle,font
  },
  mounted() {
    let that = this;
    // 初始化页面数据
    Object.assign(that.xaxis, that.setXaxis);
  },
  data: () => ({
    // 默认配置项展开
    activeNames: ['1'],
    // x轴配置
    xaxis: {
      show: true,
      // 轴线
      axisLine: {
        show: '',
        lineStyle: {
          type: '',
          width: '',
          color: ''
        }
      },
      // 轴标签
      axisLabel: {
        show: '',
        fontFamily: '',
        fontSize: '',
        color: ''
      },
      // 分隔线
      splitLine: {
        show: '',
        lineStyle: {
          color: '',
          type: '',
          width: '',
          opacity: ''
        }
      }
    }
  }),
  watch: {
    xaxis: {
      handler: function(val, oldval) {
        this.$emit('xaxisOptions', {
          option: {
            xAxis: val
          }
        });
      },
      deep: true
    },
    setXaxis: {
      handler: function(val, oldval) {
        Object.assign(this.xaxis, this.setXaxis);
      },
      deep: true
    }
  },  
  props: ['setXaxis']
  
};
</script>
<style scoped>
.el-dropdown,
.color_block {
  float: left;
  height: 24px;
  line-height: 24px;
}
.el-dropdown-item {
  height: 24px;
  line-height: 24px;
}
.el-dropdown {
  margin-right: 10px;
}
.el-dropdown-menu {
  margin-top: -3px;
}
.chart_right .el-color-picker {
  margin-top: -4px;
}
.el-color-picker__trigger {
  border-radius: 0px;
}
.chart_right .el-checkbox__input.is-checked + .el-checkbox__label {
  color: #0467e4;
}
.chart_right .el-checkbox__input.is-checked .el-checkbox__inner,
.chart_right .el-checkbox__input.is-indeterminate .el-checkbox__inner {
  background-color: #3582e3;
  border: none;
}
.font_family_menu {
  display: inline-block;
  max-width: 70px;
  overflow: hidden;
  height: 20px;
  text-overflow: ellipsis;
  white-space: nowrap;
}
</style>

