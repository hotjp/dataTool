<template>
  <!-- 背景放在 dash_wrap上 -->
  <div class="ppt_box">
    <div class="dash_wrap" :style="{'background-color':dashboardBgcolor}">
      <div :id="'dash'+i" v-show="i == page"  v-for="i in pageSize" :key="i" class="grid-stack grid-stack-6" data-gs-animate="yes" >
        <div v-for="(item,index) in chartList" :key="index" v-if="item.pptPage == i" :data-pptpage="item.pptPage" :data-index="index" :data-isload="item.isload" class="dash_item grid-stack-item" :data-gs-auto-position="item.isAutoPosition" :data-id="item.id"  :data-gs-x="item.x" :data-gs-y="item.y" :data-gs-width="item.width" :data-gs-height="item.height" data-gs-min-height="3" data-gs-min-width="2" >
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
    <div class="ppt_footer " :class="{active:footerShow}">
      <div class="close_btn" :class="{'fa fa-chevron-down':footerShow,'fa fa-chevron-up':!footerShow}" @click="toggleFooter"></div>
      <div class="swiper-container">
        <ul class="swiper-wrapper">
          <li class="swiper-slide" :class="{active:i==page}" v-for="i in pageSize" :key="i" @click="changePage(i)">
            <i v-for="(item,index) in pptChartList" :key="index" v-if="item.pptPage == i" :data-x="item.x" :data-y="item.y" :data-width="item.width" :data-height="item.height" ></i>
          </li>
          <li class="swiper-slide newPage" @click="addNewPage(true)">
            <span class="fa fa-plus"></span>          
          </li>
        </ul>
      </div>
      <button type="button" class="prev"> < </button>
      <button type="button"  class="next" > > </button>
    </div>
  </div>

</template>

<script>
import { getJson } from '../../router/utils';

import tableView from '../../components/chartEditor/tableView.vue';
const IEcharts = () => import('vue-echarts-v3/src/full');
import('echarts-wordcloud');
import('echarts-gl');
import Swiper from 'swiper/dist/js/swiper.js';
import 'swiper/dist/css/swiper.min.css';
import '../../assets/js/lodash.min'

// 引入拖拽网格
import '../../assets/css/gridstack.min.css';
import '../../assets/css/gridstack-extra.min.css';
import '../../assets/js/jquery-1.11.0';
import '../../assets/js/jquery-ui.min';
import '../../assets/js/gridstack.js';
import '../../assets/js/gridstack.jQueryUI';

export default {
  components: { IEcharts, tableView },
  mounted() {
    // 挂载后
    this.loadAllGrid();
    this.pptInit(this.chartList);
  },
  data: () => ({
    // 栅格配置项
    dashOptions: {
      draggable: true,
      cellHeight: 80,
      verticalMargin: 0,
      width: 6,
      height: 6
    },
    // 拖拽栅格
    dash: null,
    dashList: [],
    pptChartList: [],
    pageSize: 1,
    page: 1,
    swiper: null,
    footerShow:true
  }),
  watch: {
    chartList: {
      handler: function (newData) {
        if (newData) {
          this.pageSize = 0;
          this.pptInit(newData);
          this.renderThumbnail();
          
        }
      },
      deep: true
    },
    editStatus: function (val) {
      let that = this,
        checkInterval=null;
      this.toggleGridEdit(val);
      if(val){
        // 定时检测chart位置，改变略缩图
        checkInterval= setInterval(function(){
          that.renderThumbnail();
        },1000);
      }else{
        clearInterval(checkInterval);
      }
    },
    page: function (val) {
      let that = this;
      this.$emit('pptPage', val);
      this.dash = this.dashList[val];
      if(that.swiper){
        // 等待dom渲染
        setTimeout(function(){
          that.swiper.updateSlides();
        },300);
      }
    }
  },
  methods: {
    // footer显示隐藏
    toggleFooter(){
      this.footerShow=!this.footerShow;
    },
    // 设置图表禁止和允许拖拽缩放
    toggleGridEdit(e, i) {
      i = i || this.page;
      if (e) {
        this.dashList[i].movable('.grid-stack-item', true);
        this.dashList[i].resizable('.grid-stack-item', true);
      } else {
        if (this.dashList[i]) {
          this.dashList[i].disable();
        }
      }
    },
    // 加载拖拽栅格
    loadGrid(index) {
      let that = this;
      if (that.dashList[index]) {
        that.dashList[index].destroy(false);
      }
      $('#dash' + index).gridstack(that.dashOptions);
      that.dashList[index] = $('#dash' + index).data('gridstack');
      that.toggleGridEdit(false, index);
    },
    loadAllGrid() {
      let that = this;
      for (var i = 1; i <= that.pageSize; i++) {
        that.loadGrid(i);
      }
    },
    // 删除图表
    onClickDeleteChart(id, index) {
      this.$emit('onClickDeleteChart', { id: id, index: index });
    },
    onClickRefreshChartData(id, index, event) {
      this.$emit('onClickRefreshChartData', { id: id, index: index, event: event });
    },
    // 初始化
    pptInit(list) {
      for (var i = 0; i < list.length; i++) {
        var pptPage = parseInt(list[i].pptPage);
        this.pageSize = pptPage && pptPage > this.pageSize ? pptPage : this.pageSize;
      }
      this.loadAllGrid();
      this.swiper = new Swiper('.swiper-container', {
        navigation: {
          nextEl: '.next',
          prevEl: '.prev'
        },
        slidesPerView: 'auto',
        spaceBetween: 10
      });
      
    },
    // 增加新页
    addNewPage(loadFlag) {
      this.page = ++this.pageSize;
      if (loadFlag) {
        this.loadGrid(this.pageSize);
      }
      return this.page;
      
    },
    // 判断当前位置是否有空位
    checkIsAreaEmpty(w, h) {
      // x,y,w,h
      // x,y,默认都是6，轮训判断
      let result = false;
      if (this.dashList[this.page]) {
        for (var y = 0; y < 6; y++) {
          for (var x = 0; x < 6; x++) {
            result = this.dashList[this.page].isAreaEmpty(x, y, w, h);
            if (result) {
              break;
            }
          }
          if (result) {
            break;
          }
        }
      } else {
        result = true;
      }

      return result;
    },
    changePage(i) {
      this.page = i;
    },
    // 略缩图色块渲染
    renderThumbnail() {
      let list = [];
      // 获取各图表x,y,w,h
      $('.grid-stack-item').each(function (i, e) {
        var chart = {};
        chart.id = $(e).attr('data-id');
        chart.x = $(e).attr('data-gs-x');
        chart.y = $(e).attr('data-gs-y');
        chart.width = $(e).attr('data-gs-width');
        chart.height = $(e).attr('data-gs-height');
        chart.pptPage = $(e).attr('data-pptpage');
        list.push(chart);
      });
      this.pptChartList.splice(0, this.pptChartList.length, ...list);
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
