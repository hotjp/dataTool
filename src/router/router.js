import Vue from 'vue';
import VueRouter from 'vue-router';


// demo路由
import tpl from '../view/demo/tpl.vue';
import tableView from '../view/demo/tableView.vue';
// import option_list from './view/demo/option_list.vue';

// 通用组件
import commonHeader from '../components/commonHeader.vue';
import indexHeader from '../components/indexHeader.vue';
Vue.component('commonHeader', commonHeader);
Vue.component('indexHeader', indexHeader);

// 页面路由

import index from '../view/index.vue';

// 编辑器
import chart_editor from '../view/chart_editor/index.vue';

// 数据源
import database from '../view/database/index.vue';
import database_add from '../view/database/addList.vue';
import createView from '../view/database/createView.vue';

// 属性面板
import chartConfig from '../view/demo/chartConfig.vue';

//测试图表列举组件要删除
// import chartsList from './components/chartsList.vue';
//数据视图目录列表
import dataViewDirectoryList from '../components/dataViewDirectoryList.vue';
import dataViewList from '../components/dataViewList.vue';

// 仪表盘
import dashboard from '../view/dashboard/index.vue';
import empty from '../view/empty.vue';


// 声明路由关系
const routes = [
  // 演示页
  // {
  //   path: '/demo/tpl',
  //   component: tpl,
  //   name: '全生命周期模板'
  // },
  {
    path: '/demo',
    component: index
  },
  {
    path: '/demo/tableView',
    component: tableView
  },
  {
    path: '/demo/chartConfig',
    component: chartConfig
  },
  // { path: '/demo/option_list', component: option_list },

  // 路由
  {
    path: '/',
    name:'仪表盘',
    components: {
      default: dashboard,
      header: commonHeader
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
    path: '/chart_editor/',
    components: {
      default: chart_editor,
      header: commonHeader
    }
  }, {
    // 数据源
    name:'数据源',    
    path: '/database',
    components: {
      default: database,
      header: commonHeader
    }
  }, {
    // 添加数据源
    name:'添加数据源',
    path: '/database/add',
    components: {
      default: database_add,
      header: commonHeader
    }
  }
  //从数据源mysql1创建视图

  , {
    name:'创建视图',
    path: '/database/creatView/:id',
    component: createView
  }

  //ceshizujian  测试完删除 列举图表组件路由
  //   ,{
  //       path: '/testChartsList',
  //       component:chartsList
  //   }
  //数据视图目录列表
  , {
    path: '/dataViewDirectoryList',
    component: dataViewDirectoryList
  }, {
    path: '/dataViewList',
    component: dataViewList
  },
  // 仪表盘
  {
    name:'仪表盘',
    path: '/dashboard/:viewId',
    components: {
      default: dashboard,
      header: commonHeader
    }
  },
  // 仪表盘
  {
    name:'仪表盘',
    path: '/dashboard',
    components: {
      default: dashboard,
      header: indexHeader
    }
  },
  // 空页面，跳转用
  {
    name:'empty',
    path: '/empty',
    component: empty
  }
  
];
// 实例化路由
const router = new VueRouter({
  routes
});
export default router;