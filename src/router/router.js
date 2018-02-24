import Vue from 'vue';
import VueRouter from 'vue-router';


// 通用组件
import commonHeader from '../components/commonHeader.vue';
import indexHeader from '../components/indexHeader.vue';
Vue.component('commonHeader', commonHeader);
Vue.component('indexHeader', indexHeader);

// 页面路由

// 用户注册
import register from '../view/register/index.vue';
// empty
import empty from '../view/empty/index.vue';
// 用户登录
import login from '../view/login/index.vue';
// 仪表盘
import dashboard from '../view/dashboard/index.vue';
// 图表编辑
import chart_editor from '../view/chart_editor/index.vue';
// 数据源列表
import database from '../view/database/index.vue';
// 添加数据源
import database_add from '../view/database/add.vue';
// 数据视图列表
import dataview from '../view/dataview/index.vue';

// 声明路由关系
const routes = [
  // 路由
  // 用户注册
  {
    path: '/register',
    name:'用户注册',
    components: {
      default: register
    }
  },
  // empty
  {
    path: '/empty',
    name:'empty',
    components: {
      default: empty
    }
  },
  // 用户登录
  {
    path: '/login',
    name:'登录页',
    components: {
      default: login
    }
  },
  // 仪表盘
  {
    path: '/',
    name:'仪表盘',
    components: {
      default: dashboard,
      header: indexHeader
    }
  },
  {
    name:'仪表盘',
    path: '/dashboard/:viewId',
    components: {
      default: dashboard,
      header: indexHeader
    }
  },
  {
    name:'仪表盘',
    path: '/dashboard',
    components: {
      default: dashboard,
      header: indexHeader
    }
  },
  {
    // 图表编辑
    name:'图表编辑',
    path: '/chart_editor/:viewId',
    components: {
      default: chart_editor,
      header: commonHeader
    }
  },  {
    // 新建图表
    name:'图表编辑',
    path: '/chart_editor',
    components: {
      default: chart_editor,
      header: commonHeader
    }
  }, {
    // 数据源列表
    name:'数据源',    
    path: '/database',
    components: {
      default: database,
      header: indexHeader
    }
  }, {
    // 添加数据源
    name:'添加数据源',
    path: '/database/add',
    components: {
      default: database_add,
      header: indexHeader
    }
  }, {
    // 数据视图列表
    name:'数据视图列表',
    path: '/dataview',
    components: {
      default: dataview,
      header: indexHeader
    }
  }, {
    // 添加数据视图列表
    name:'数据视图列表',
    path: '/dataview/:viewId',
    components: {
      default: dataview,
      header: indexHeader
    }
  }
];
// 实例化路由
const router = new VueRouter({
  routes
});
export default router;