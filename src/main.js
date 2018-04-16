/*
 * @Author: hotjp 
 * @Date: 2017-11-06 13:40:14 
 * @Last Modified by: hotjp
 * @Last Modified time: 2018-04-08 13:11:26
 */

import Stats from 'stats.js';
let stats = window.stats = new Stats();
document.body.appendChild(stats.dom);
stats.showPanel(3);
function animate(){
  stats.update();
  requestAnimationFrame( animate );
}
requestAnimationFrame( animate );

import Vue from 'vue';

import ElementUI from 'element-ui';
import 'animate.css/animate.min.css';
import 'element-ui/lib/theme-chalk/index.css';
import './assets/css/app.less';
// import axios from 'axios'
// import IEcharts from 'vue-echarts-v3/src/full.vue';
import VueRouter from 'vue-router';
Vue.use(VueRouter);
Vue.use(ElementUI);

// 路由
import router from './router/router';
import App from './App.vue';

// 绑定vue
const app = new Vue({
  router,
  render: h => h(App)
}).$mount('#app');

// 数据编辑

// 设置版本
import {version} from '../package.json';
document.body.setAttribute('data-version',version);