<template>
  <!-- 背景放在 dash_wrap上 -->
  <div class="dash_wrap" :style="{'background-color':dashboardBgcolor}">
    <div id="dash" class="grid-stack grid-stack-6" data-gs-animate="yes" >
      <div v-for="(item,index) in chartList" :key="index" :data-index="index" :data-isload="item.isload" class="dash_item grid-stack-item" :data-gs-auto-position="item.isAutoPosition" :data-id="item.id"  :data-gs-x="item.x" :data-gs-y="item.y" :data-gs-width="item.width" :data-gs-height="item.height" data-gs-min-height="3" data-gs-min-width="2" >
        <div class="_wrap" :style="item.background">
          <div class="chart_tit">{{item.title}}</div>
          <div class="edit_bar fix">
            <!-- 普通图表和3D图表判断，跳转不同页面 -->
            <router-link v-if="item.isSpec" class="edit_bar_btn r el-icon-edit" :to="'/chart_editor_prime/'+item.id" title="编辑"></router-link>
            <router-link v-else class="edit_bar_btn r el-icon-edit" :to="'/chart_editor/'+item.id" title="编辑"></router-link>
            
            <span class=" edit_bar_btn r el-icon-refresh" @click="onClickRefreshChartData(item.id,index,$event)" title="刷新"></span>
            <span class="el-icon-delete r edit_bar_btn" @click="onClickDeleteChart(item.id,index)" title="删除"></span>
          </div>
          <tableView v-if="item.type =='table'" class="full table_container" :myMessage="item.chartData"></tableView>
          <IEcharts v-else class="full charts_container" :resizable="true" :option="item.option" :loading="item.loading"></IEcharts>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { getJson } from '../../router/utils';

import tableView from '../../components/chartEditor/tableView.vue';
const IEcharts = () => import('vue-echarts-v3/src/full');
import('echarts-wordcloud');
import('echarts-gl');

// 引入拖拽网格
import '../../assets/js/lodash.min'
import '../../assets/css/gridstack.min.css';
import '../../assets/css/gridstack-extra.min.css';
import '../../assets/js/jquery-1.11.0';
import '../../assets/js/jquery-ui.min';
import '../../assets/js/gridstack';
import '../../assets/js/gridstack.jQueryUI';

export default {
  components: { IEcharts, tableView },
  mounted() {
    // 挂载后
    this.loadGrid();
  },
  data: () => ({
    // 数据流
    // 栅格配置项
    dashOptions: {
      draggable: true,
      cellHeight: 80,
      verticalMargin: 0,
      width: 6
    },
    // 拖拽栅格
    dash: null
  }),
  watch: {
    chartList: {
      handler: function (newData) {
        if(this.dash){
          this.dash.destroy(false);
          $('#dash').data('gridstack', '');
        }
        this.loadGrid();
      },
      deep: true
    },
    editStatus: function (val) {
      this.toggleGridEdit(val);
    }
  },
  methods: {
    // 设置图表禁止和允许拖拽缩放
    toggleGridEdit(e) {
      if (e) {
        this.dash.movable('.grid-stack-item', true);
        this.dash.resizable('.grid-stack-item', true);
      } else {
        this.dash.disable();
      }
    },
    // 加载拖拽栅格
    loadGrid() {
      let that = this;
      $('#dash').gridstack(that.dashOptions);
      that.dash = $('#dash').data('gridstack');
      that.toggleGridEdit();
    },
    onClickDeleteChart(id,index){
      this.$emit('onClickDeleteChart',{id:id,index:index});
    },
    onClickRefreshChartData(id,index,event){
      this.$emit('onClickRefreshChartData',{id:id,index:index,event:event});
    }

  },
  props: ['dashboardBgcolor', 'chartList', 'editStatus']
};
</script>

<style>
#app {
  font-family: Helvetica, sans-serif;
  text-align: center;
}
</style>
