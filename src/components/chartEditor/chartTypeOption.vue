<template>
  <div>
    <chartBar v-if="type=='bar'" :option="option" :data="data" @getSeries="getOption"></chartBar>
    <chartLine v-else-if="type=='line'" :option="option" :data="data" @getSeries="getOption"></chartLine>
    <chartPie v-else-if="type=='pie'" :option="option" :data="data" @getSeries="getOption"></chartPie>
    <chartArea v-else-if="type=='area'" :option="option" :data="data" @getSeries="getOption"></chartArea>
    <chartStackbar v-else-if="type=='stackbar'" :option="option" :data="data" @getSeries="getOption"></chartStackbar>
    <chartFunnel v-else-if="type=='funnel'" :option="option" :data="data" @getSeries="getOption"></chartFunnel>
    <chartRosePie v-else-if="type=='rosePie'" :option="option" :data="data" @getSeries="getOption"></chartRosePie>
    <chartRadar v-else-if="type=='radar'" :option="option" :data="data" @getSeries="getOption"></chartRadar>
    <chartTreemap v-else-if="type=='treemap'" :option="option" :data="data" @getSeries="getOption"></chartTreemap>
    <chartWaterfall v-else-if="type=='waterfall'" :option="option" :data="data" @getSeries="getOption"></chartWaterfall>
    <chartGauge v-else-if="type=='gauge'" :option="option" :data="data" @getSeries="getOption"></chartGauge>

    <!-- <div class="split_line">图表样式</div>  
    <div>
      <el-checkbox v-model="chartsStyle.xAxis.splitLine.show">横向网格</el-checkbox>
      <div class="fix pl20">
        <el-dropdown @command="lineType">
          <span class="el-dropdown-link">
            {{chartsStyle.xAxis.splitLine.lineStyle.type}}
            <i class="el-icon-arrow-down el-icon--right"></i>
          </span>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item command="solid">solid</el-dropdown-item>
            <el-dropdown-item command="dashed">dashed</el-dropdown-item>
            <el-dropdown-item command="dotted">dotted</el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
        <el-dropdown @command="lineWidth">
          <span class="el-dropdown-link">
            {{chartsStyle.xAxis.splitLine.lineStyle.width}}
            <i class="el-icon-arrow-down el-icon--right"></i>
          </span>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item command="1">1</el-dropdown-item>
            <el-dropdown-item command="2">2</el-dropdown-item>
            <el-dropdown-item command="3">3</el-dropdown-item>
            <el-dropdown-item command="4">4</el-dropdown-item>
            <el-dropdown-item command="5">5</el-dropdown-item>
            <el-dropdown-item command="6">6</el-dropdown-item>
            <el-dropdown-item command="7">7</el-dropdown-item>
            <el-dropdown-item command="8">8</el-dropdown-item>
            <el-dropdown-item command="9">9</el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
        <div class="color_block">
          <el-color-picker v-model="chartsStyle.xAxis.splitLine.lineStyle.color[0]"></el-color-picker>
        </div>
      </div>
    </div>
    <div>
      <el-checkbox v-model="chartsStyle.yAxis.splitLine.show">纵向网格</el-checkbox>
    </div>  -->

  </div>
</template>

<script>
// 引入图表组件
import chartBar from '../chartsComponents/chart-bar.vue';
import chartLine from '../chartsComponents/chart-line.vue';
import chartPie from '../chartsComponents/chart-pie.vue';
import chartArea from '../chartsComponents/chart-area.vue';
import chartStackbar from '../chartsComponents/chart-stackbar.vue';
import chartFunnel from '../chartsComponents/chart-funnel.vue';
import chartRosePie from '../chartsComponents/chart-rosePie.vue';
import chartRadar from '../chartsComponents/chart-radar.vue';
import chartTreemap from '../chartsComponents/chart-treemap.vue';
import chartWaterfall from '../chartsComponents/chart-waterfall.vue';
import chartGauge from '../chartsComponents/chart-gauge.vue';

export default {
  data() {
    return {
      // series设置
      seriesOption: {
      },
      // 图表样式
      chartsStyle: {
        xAxis: {
          splitLine: {
            show: false,
            lineStyle: {
              color: ['#ccc'],
              width: 1,
              type: 'solid'
            }
          }
        },
        yAxis: {
          splitLine: {
            show: false,
            lineStyle: {
              color: ['#ccc'],
              width: 1,
              type: 'solid'
            }
          }
        }

      }
    };
  },
  mounted() {
  },
  props: ['option', 'data', 'type'],
  components: {
    chartBar, chartLine, chartPie, chartArea, chartStackbar, chartFunnel, 
    chartRosePie, chartRadar,chartTreemap,chartWaterfall,chartGauge
  },
  methods: {
    getOption(data) {
      this.$emit('submitOption', data);
    },
    lineType(command) {
      this.chartsStyle.xAxis.splitLine.lineStyle.type = command;
    },
    lineWidth(command) {
      this.chartsStyle.xAxis.splitLine.lineStyle.width = command;
    }
  },
  watch: {
    chartsStyle: {
      handler: function (oldval, val) {
        this.$emit('submitOption', val);
      }
    }
  },
};
</script>

<style scoped>
.split_line {
  font-size: 13px;
}
</style>
