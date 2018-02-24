<template>
  <div class="yaxis">
    <form action onsubmit="return false">
      <el-collapse v-model="activeNames">
        <el-collapse-item title="坐标Y轴" name="1">
          <div>
            <div>
              <el-checkbox v-model="yaxis.show">显示坐标轴</el-checkbox>
            </div>
            <div class="fix pl20">
              <lineStyle :color.sync="yaxis.axisLine.lineStyle.color" :type.sync="yaxis.axisLine.lineStyle.type" :width.sync="yaxis.axisLine.lineStyle.width" ></lineStyle>
            </div>
          </div>
          <div>
            <div>
              <el-checkbox v-model="yaxis.axisLabel.show">显示标签</el-checkbox>
            </div>
            <div class="fix pl20">
              <font :color.sync="yaxis.axisLabel.color" :fontFamily.sync="yaxis.axisLabel.fontFamily" :fontSize.sync="yaxis.axisLabel.fontSize"  ></font>
            </div>
          </div>
          <div>
            <div>
              <el-checkbox v-model="yaxis.splitLine.show">横向网格线</el-checkbox>
            </div>
            <div class="fix pl20">
              <lineStyle :color.sync="yaxis.splitLine.lineStyle.color" :type.sync="yaxis.splitLine.lineStyle.type" :width.sync="yaxis.splitLine.lineStyle.width"></lineStyle>
            </div>
          </div>
        </el-collapse-item>
      </el-collapse>
    </form>
  </div>
</template>
<script type="text/babel">
// 引入线型字体组件
import lineStyle from './propSelect/lineStyle.vue';
import font from './propSelect/font.vue';

export default {
  data: () => ({
    // 默认配置项展开
    activeNames: ['1'],
    // x轴配置
    yaxis: {
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
  mounted() {
    let that = this;
    // 初始化页面数据
    Object.assign(that.yaxis, that.setYaxis);
  },
  components: {
    lineStyle,font
  },
  props: ['setYaxis'],
  watch: {
    yaxis: {
      handler: function (val, oldval) {
        this.$emit('yaxisOptions', {
          option: {
            yAxis: val
          }
        });
      },
      deep: true
    },
    setYaxis: {
      handler: function (val, oldval) {
        Object.assign(this.yaxis, this.setYaxis);
      },
      deep: true
    }
  }
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
.pl20 {
  padding-left: 20px;
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

