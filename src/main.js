/*
 * @Author: hotjp 
 * @Date: 2017-11-06 13:40:14 
 * @Last Modified by:   hotjp 
 * @Last Modified time: 2017-11-06 13:40:14 
 */
import Vue from 'vue';
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-default/index.css';
import './assets/css/app.less';
// import axios from 'axios'
import IEcharts from 'vue-echarts-v3/src/full.vue';
import VueRouter from 'vue-router';
Vue.use(VueRouter);
Vue.use(ElementUI);

import App from './App.vue';

import tpl from './view/demo/tpl.vue';
import chart from './view/demo/chart.vue';
import option_list from './view/demo/option_list.vue';
// 路由页面
import index from './view/index.vue';
import chart_editor from './view/chart_editor.vue';

// 声明路由关系
const routes = [
  // 演示页
  { path: '/tpl', component: tpl },
  { path: '/chart', component: chart },
  { path: '/option_list', component: option_list },

  // 路由
  { path: '/:user', component: index },
  { path: '/chart_editor/:chartId', component: chart }
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
