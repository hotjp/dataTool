import Vue from 'vue';
import VueRouter from 'vue-router';


// demo路由
import tpl from '../view/demo/tpl.vue';
import tableView from '../view/demo/tableView.vue';
// import option_list from './view/demo/option_list.vue';

// 通用组件
import commonHeader from '../components/commonHeader.vue';
Vue.component('commonHeader', commonHeader);
// 图表标题
import title from '../components/title.vue';


// 页面路由

import index from '../view/index.vue';

// 编辑器
import chart_editor from '../view/chart_editor/index.vue';

// 数据源
import datebase from '../view/datebase/index.vue';
import datebase_add from '../view/datebase/addList.vue';
import createView from '../view/datebase/createView.vue';

// 属性面板
import chartConfig from '../view/demo/chartConfig.vue';

//测试图表列举组件要删除
// import chartsList from './components/chartsList.vue';
//数据视图目录列表
import dataViewDirectoryList from '../components/dataViewDirectoryList.vue';
import dataViewList from '../components/dataViewList.vue';



// 声明路由关系
const routes = [
  // 演示页
  {
    path: '/demo/tpl',
    component: tpl,
    name: '全生命周期模板'
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
    component: index
  },
  {
    // 图表编辑
    path: '/chart_editor/:viewId',
    components: {
      default: chart_editor,
      header: commonHeader
    }
  }, {
    // 数据源
    path: '/datebase',
    components: {
      default: datebase,
      header: commonHeader
    }
  }, {
    // 添加数据源
    path: '/datebase/add',
    components: {
      default: datebase_add,
      header: commonHeader
    }
  }
  //从数据源mysql1创建视图

  , {
    path: '/datebase/creatView/:id',
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
  }


];
// 实例化路由
const router = new VueRouter({
  routes
});
export default router;