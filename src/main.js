/*
 * @Author: hotjp 
 * @Date: 2017-11-06 13:40:14 
 * @Last Modified by: hotjp
 * @Last Modified time: 2017-11-13 08:44:06
 */

import Vue from 'vue';
import ElementUI from 'element-ui';
import 'animate.css/animate.min.css';
import 'element-ui/lib/theme-chalk/index.css';
import './assets/css/app.less';
// import axios from 'axios'
import IEcharts from 'vue-echarts-v3/src/full.vue';
import VueRouter from 'vue-router';
Vue.use(VueRouter);
Vue.use(ElementUI);

// 路由
import App from './App.vue';
// demo路由
import tpl from './view/demo/tpl.vue';
import chart from './view/demo/chart.vue';
// import option_list from './view/demo/option_list.vue';

// 通用组件
import commonHeader from './components/commonHeader.vue';

Vue.component('commonHeader', commonHeader);

// 页面路由
import index from './view/index.vue';

// 编辑器
import chart_editor from './view/chart_editor/index.vue';

// 声明路由关系
const routes = [
  // 演示页
  { path: '/demo/tpl', component: tpl, name: '全生命周期模板' },
  { path: '/demo/chart', component: chart },
  // { path: '/demo/option_list', component: option_list },

  // 路由
  { path: '/', component: index },
  {
    path: '/chart_editor/:viewId', 
    components: {
      default: chart_editor,
      header: commonHeader
    }
  }
];

// 实例化路由
const router = new VueRouter({
  routes
});

// 绑定vue
const app = new Vue({
  router,
  render: h => h(App)
}).$mount('#app');
