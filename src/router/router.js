
import Vue from 'vue';
import VueRouter from 'vue-router';

// 通用组件
// import commonHeader from '../components/commonHeader.vue';
const commonHeader = () => import(
  /* webpackChunkName: "commonHeader" */
  '../components/commonHeader.vue');
// import indexHeader from '../components/indexHeader.vue';
const indexHeader = () => import(
  /* webpackChunkName: "indexHeader" */
  '../components/indexHeader.vue');

Vue.component('commonHeader', commonHeader);
Vue.component('indexHeader', indexHeader);

// 未登录限制访问列表
import loginConfig from '../vendor/loginConfig.json';

// 声明路由关系
const routes = [];

// 页面路由
// 用户注册
// import register from '../view/register/index.vue';
const register = () => import(
  /* webpackChunkName: "register" */
  '../view/register/index.vue');
routes.push({
  path: '/register',
  name: '用户注册',
  components: {
    default: register
  }
});

// empty
import empty from '../view/empty/index.vue';
routes.push({
  path: '/empty',
  name: 'empty',
  components: {
    default: empty
  }
});

// 用户登录
// import login from '../view/login/index.vue';
const login = () => import(
  /* webpackChunkName: "login" */  
  '../view/login/index.vue');
routes.push({
  path: '/login',
  name: '登录页',
  components: {
    default: login
  }
});

// 仪表盘
// import dashboard from '../view/dashboard/index.vue';
const dashboard = () => import(
  /* webpackChunkName: "dashboard" */    
  '../view/dashboard/index.vue');

routes.push({
  path: '/',
  name: '仪表盘',
  components: {
    default: dashboard,
    header: indexHeader
  }
}, {
  name: '仪表盘',
  path: '/dashboard/:viewId',
  components: {
    default: dashboard,
    header: indexHeader
  }
}, {
  name: '仪表盘',
  path: '/dashboard',
  components: {
    default: dashboard,
    header: indexHeader
  }
});

// 图表编辑
// import chart_editor from '../view/chart_editor/index.vue';
const chart_editor = () => import(
  /* webpackChunkName: "chart_editor" */    
  '../view/chart_editor/index.vue');

routes.push({
  name: '图表编辑',
  path: '/chart_editor/:viewId',
  components: {
    default: chart_editor,
    // header: commonHeader
    header: indexHeader
  }
}, {
  // 新建图表
  name: '图表编辑',
  path: '/chart_editor',
  components: {
    default: chart_editor,
    // header: commonHeader
    header: indexHeader    
  }
});

// 特殊图表编辑
// import chart_editor_prime from '../view/chart_editor_prime/index.vue';
const chart_editor_prime = () => import(
  /* webpackChunkName: "chart_editor_prime" */    
  '../view/chart_editor_prime/index.vue');

routes.push({
  name: '图表编辑',
  path: '/chart_editor_prime/:viewId',
  components: {
    default: chart_editor_prime,
    // header: commonHeader
    header: indexHeader
  }
});

// 数据源列表
// import database from '../view/database/index.vue';
const database = () => import(
  /* webpackChunkName: "database" */    
  '../view/database/index.vue');

routes.push({
  // 数据源列表
  name: '数据源',
  path: '/database',
  components: {
    default: database,
    header: indexHeader
  }
});

// 添加数据源
// import database_add from '../view/database/add.vue';
const database_add = () => import(
  /* webpackChunkName: "database_add" */    
  '../view/database/add.vue');

routes.push({
  // 添加数据源
  name: '添加数据源',
  path: '/database/add',
  components: {
    default: database_add,
    header: indexHeader
  }
});

// 数据视图列表
// import dataview from '../view/dataview/index.vue';
const dataview = () => import(
  /* webpackChunkName: "dataview" */    
  '../view/dataview/index.vue');

routes.push({
  // 数据视图列表
  name: '数据视图列表',
  path: '/dataview',
  components: {
    default: dataview,
    header: indexHeader
  }
}, {
  // 添加数据视图列表
  name: '数据视图列表',
  path: '/dataview/:viewId',
  components: {
    default: dataview,
    header: indexHeader
  }
});

import { getJson } from './utils';
// import { ElStep } from 'element-ui/types/step';
// 实例化路由
const router = new VueRouter({
  routes
});

router.beforeEach((to, from, next) => {
  if (to.name === '登录页' || to.name === '用户注册') {
    next();
  }else{
    getJson('/member/getSessionMember.do',{},function(res){
      if(res){
        if(res.success){
          if(res.data.user==null){
            router.push({name:'登录页'});
          }else{
            next();
          }
        }else{
          router.push({name:'登录页'});
          // next();
        }
      }
    },function(error){
      if(error.status==200){
        router.push({name:'登录页'});
      }
    });
  }
});




export default router;