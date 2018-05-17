<template>
  <div id="dashboard" class="full" >
    <div class="full">
      <div class="dashboard_left">
        <div class="grid-content full">
          <dashboardDir :activeId="dashboardId" :dataList="dashboardList" @itemClick="itemClick" @toggleAddDashboardDialog="toggleAddDashboardDialog" @showTitleEditor="showTitleEditor" ></dashboardDir>
        </div>
      </div>
      <div class="dashboard_main">
        <div class="new_user" v-show="dashboardEmpty">
          <!-- <img src="../../assets/images/dashboard_e.png" alt=""> -->
        </div>
        <div class="grid-content" :class="{editing:editStatus}"  v-loading.lock="fullscreenLoading">
          <div class="common_top top fix">
            <span class="name l ">{{dashboardName}}</span>
            <button type="button" class="r preview top_btn" @click="preview()">预览分享</button>
            <button type="button" class="r edit_switch top_btn" :class="{active:editStatus}" @click="toggleEdit()">设计模式</button>
            <button type="button" class="r add_chart top_btn" @click="toggleAddChartDialog(true)">添加图表</button>             
          </div>
          <!-- 编辑模式下显示的可编辑内容 -->
          <div class="edit_box" :class="{active:editStatus}">
            <div class="_top">
              仪表盘设计
              <el-radio v-model="model" label="waterfall">瀑布流模式</el-radio>
              <el-radio v-model="model" label="ppt" disabled >ppt模式</el-radio>
              <button type="button" class="_save"  @click="toggleEdit()"><i class="fa fa-check-square-o"></i>保存</button>
            </div>
            <div class="_items">
              <!-- <el-checkbox v-model="model1">备选项</el-checkbox> -->
              <colorPicker :color.sync="dashboardBgcolor" ></colorPicker>仪表盘背景色
            </div>
          </div>
          <!-- 背景放在 dash_wrap上 -->
          <div class="dash_wrap" :style="{'background-color':dashboardBgcolor}">
            <div id="dash" class="grid-stack grid-stack-6" data-gs-animate="yes" >
              <div v-for="(item,index) in chartList" :key="index" :data-index="index" :data-isload="item.isload" class="grid-stack-item" :data-gs-auto-position="item.isAutoPosition" :data-id="item.id"  :data-gs-x="item.x" :data-gs-y="item.y" :data-gs-width="item.width" :data-gs-height="item.height" data-gs-min-height="3" data-gs-min-width="2" >
                <div class="_wrap" :style="item.background">
                  <div class="chart_tit">{{item.title}}</div>
                  <div class="edit_bar fix">
                    <!-- 普通图表和3D图表判断，跳转不同页面 -->
                    <router-link v-if="item.isSpec" class="edit_bar_btn r el-icon-edit" :to="'/chart_editor_prime/'+item.id" title="编辑"></router-link>
                    <router-link v-else class="edit_bar_btn r el-icon-edit" :to="'/chart_editor/'+item.id" title="编辑"></router-link>
                    
                    <span class=" edit_bar_btn r el-icon-refresh" @click="onClickRefreshChartData(item.id,index,$event)" title="刷新"></span>
                    <span class="el-icon-delete r edit_bar_btn" @click="onClickDeleteChart(item.id,index,$event)" title="删除"></span>
                  </div>
                  <tableView v-if="item.type =='table'" class="full table_container" :myMessage="item.chartData"></tableView>
                  <IEcharts v-else class="full charts_container" :resizable="true" :option="item.option" :loading="item.loading"></IEcharts>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <el-dialog class="common_dialog chart_add_dialog" title="添加新图表" :visible.sync="addChartVisible">
      <a class="add_new" href="javascript:;" @click="onClickAddNewChart"><i class="el-icon-plus"></i>新建图表</a>
      <!-- <router-link class="new_built" to="/chart_editor/" title="新建图表"><i class="el-icon-plus"></i>新建图表</router-link> -->
      <div class="tit fix">选择已有图表
        <div class="search_box r" :class="{hover:searchCharts.length}">
          <i class="el-icon-search"></i>
          <input type="text" v-model="searchCharts" class="search_input">
        </div> 
      </div>
      <ul class="colums_list dialog_content">
        <li v-for="(item,index) in charts" :key="index" :class="{ active: item.isActive}" v-if="item.id&&item.show" :data-id="item.id" @click="toggleActive(index)">
          {{item.text}}
        </li>
      </ul>
      <span slot="footer" class="dialog-footer">
        <el-button class="btn-confirm" type="primary" @click="addChartTodashBoard">确 定</el-button>
        <el-button class="btn-cancel" @click="toggleAddChartDialog">取 消</el-button>
      </span>
    </el-dialog>

    <el-dialog class="common_dialog chart_add_dialog chart_type_dialog" title="选择类型" :visible.sync="chooseTypeVisible">
      <div class="tit fix">选择图表展示类型</div>
      <div class="fix chart_types">
        <span v-for="(item,index) in chartsTypes" :key="index" class="type" :class="{active:chooseTypeIndex==index,vip:item.isUsable}" @click="onClickChooseType(index)">{{item.name}}</span>
      </div>
      <div class="tit fix">选择其他展示类型</div>
      <ul class="other_types">
        <div class="empty_child" v-if="!activeChildren.length">暂无内容</div>
        <li v-else v-for="(item,index) in activeChildren" :key="index" :class="{active:chooseIndex==index}" @click="onClickType(index)">{{item.name}}</li>
      </ul>

      <span slot="footer" class="dialog-footer">
        <el-button class="btn-confirm" type="primary" @click="showDataView">确 定</el-button>
        <el-button class="btn-cancel" @click="toggleChooseTypeDialog">取 消</el-button>
      </span>
    </el-dialog>

    <el-dialog class="common_dialog chart_add_dialog" title="新建图表-选择数据视图" :visible.sync="addNewChartVisible" >
      <div class="add_new" href="javascript:;" ><router-link to="/dataview">新建数据视图</router-link></div>
      <div class="tit fix">选择已有视图
        <div class="search_box r" :class="{hover:searchView.length}">
          <i class="el-icon-search"></i>
          <input type="text" v-model="searchView" class="search_input">
        </div> 
      </div>
      <el-tree class="dialog_content" :data="listFolders.list" :props="listFolders.defaultProps" accordion @node-click="handleNodeClick" :filter-node-method="filterView" ref="viewTree"></el-tree>        
      <div slot="footer" class="dialog-footer">
        <el-button class="btn-confirm" type="primary" @click="newchartClick(1)">确 定</el-button>
        <el-button class="btn-cancel" @click="newchartClick(0)">取 消</el-button>
      </div>
    </el-dialog>

    <el-dialog title="添加仪表盘" :visible.sync="dashboardDialogVisible" width="40%">
      <form action onsubmit="return false">
        <el-input v-model="newDashboardName" placeholder="仪表盘名称"></el-input>
      </form>
      <span slot="footer" class="dialog-footer">
          <el-button class="btn-confirm" type="primary" @click="addDashboard">确 定</el-button>
          <el-button class="btn-cancel" @click="toggleAddDashboardDialog(false)">取 消</el-button>
        </span>
    </el-dialog>

    <el-dialog title="编辑仪表盘" :visible.sync="editDialogVisible" width="40%">
      <form action onsubmit="return false">
        <el-input v-model="editTitle" placeholder="仪表盘名称"></el-input>
      </form>
      <span slot="footer" class="dialog-footer">
          <el-button class="btn-confirm" type="primary" @click="saveEdit">确 定</el-button>
          <el-button class="btn-cancel" @click="closeEditDialog">取 消</el-button>
        </span>
    </el-dialog>
  </div>
</template>
<script>
// 引入公用配置
import { getJson } from '../../router/utils';
// 引入组件
const IEcharts = () => import('vue-echarts-v3/src/full');
import('echarts-wordcloud');
import('echarts-gl');
import dashboardDir from '../../components/dashboard/dashboardDir.vue';
import tableView from '../../components/chartEditor/tableView.vue';
import colorPicker from '../../components/chartEditor/propSelect/colorPicker.vue';

// 引入拖拽网格
import '../../assets/css/gridstack.min.css';
import '../../assets/css/gridstack-extra.min.css';
import '../../assets/js/jquery-1.11.0';
import '../../assets/js/jquery-ui.min';
import '../../assets/js/gridstack';
import '../../assets/js/gridstack.jQueryUI';
// 引入图表类型
import '../../vendor/jsVendor/seriesBar.js';
import seriesBarDefault from '../../vendor/seriesBar.json';
import '../../vendor/jsVendor/seriesLine.js';
import seriesLineDefault from '../../vendor/seriesLine.json';
import '../../vendor/jsVendor/seriesArea.js';
import seriesAreaDefault from '../../vendor/seriesArea.json';
import '../../vendor/jsVendor/seriesPie.js';
import seriesPieDefault from '../../vendor/seriesPie.json';
import '../../vendor/jsVendor/seriesStackbar.js';
import '../../vendor/jsVendor/seriesFunnel.js';
import seriesFunnelDefault from '../../vendor/seriesFunnel.json';
import '../../vendor/jsVendor/seriesRosePie.js';
import seriesRosePieDefault from '../../vendor/seriesRosePie.json';
import '../../vendor/jsVendor/seriesRadar.js';
import seriesRadarDefault from '../../vendor/seriesRadar.json';
import '../../vendor/jsVendor/seriesTreemap.js';
import seriesTreemapDefault from '../../vendor/seriesTreemap.json';
import '../../vendor/jsVendor/seriesWaterfall.js';
import seriesWaterfallDefault from '../../vendor/seriesWaterfall.json';
import '../../vendor/jsVendor/seriesGauge.js';
import seriesGaugeDefault from '../../vendor/seriesGauge.json';
import '../../vendor/jsVendor/seriesWordCloud.js';
import seriesWordCloudDefault from '../../vendor/seriesWordCloud.json';
import '../../vendor/jsVendor/seriesPercentStackbar.js';

import '../../vendor/jsVendor/seriesBar3D.js';
import seriesBar3DDefault from '../../vendor/seriesBar3D.json';

export default {
  components: { IEcharts, dashboardDir, tableView, colorPicker },
  mounted() {
    let that = window.vm = this,
      params = that.$route.params;
    that.loadDashboard();
    // 加载已有chart 列表
    getJson(
      '/chart/list.do',
      {
        folder: '/'
      },
      function (res) {
        if (res.success) {
          that.charts = res.data.map(x => {
            // 多增加一个选择状态
            x.isActive = false;
            // 搜索用
            x.show = true;
            return x;
          });
          that.charts = res.data;
        }
      }
    );
    // 选择表
    getJson(
      '/dataview/list.do',
      {
        folder: '',
        dataview: true
      },
      function (res) {
        if (res.success) {
          that.listFolders.list = res.data;
        }
      }
    );
  },
  destroyed() {
    // 销毁后
    window.vm = null;
  },
  data: () => ({
    // 页面控制
    // 拖拽区遮罩
    fullscreenLoading: true,
    // 添加新图表弹窗
    addChartVisible: false,
    // 选择图表类型弹窗
    chooseTypeVisible: false,
    // 添加新图表-新建图表弹窗
    addNewChartVisible: false,
    // 添加添加仪表盘弹窗
    dashboardDialogVisible: false,
    // 编辑仪表盘弹窗
    editDialogVisible: false,
    // 是否允许拖拽缩放
    editStatus: false,
    // 数据流
    // 栅格配置项
    dashOptions: {
      draggable: true,
      cellHeight: 80,
      verticalMargin: 0,
      width: 6
    },
    // 拖拽栅格
    dash: null,
    // 仪表盘名称
    dashboardName: '',
    // 仪表盘id
    dashboardId: '',
    // 仪表盘背景色
    dashboardBgcolor: '',
    // dashboard 列表
    dashboardList: [],
    // chart列表
    chartList: [],
    // 已有chart,添加时用
    charts: [],
    // 新建仪表盘名称
    newDashboardName: '',
    // 编辑仪表盘名称
    editTitle: '',
    // 编辑仪表盘ID
    editId: '',
    // 编辑仪表盘索引
    editIndex: '',
    // 数据表
    listFolders: {
      list: [
        {
          name: '',
          children: []
        }
      ],
      defaultProps: {
        children: '',
        label: 'name'
      },
      // 选择的id
      checkId: ''
    },
    // 新建图表数据
    newCharts: {
      tableName: {
        sql: '',
        name: ''
      },
      isSpec: false,
      type: ''
    },
    // 已有图表搜索
    searchCharts: '',
    // 已有视图搜索    
    searchView: '',
    // 仪表盘模式 瀑布流(waterfall)/ppt(ppt)  TODO: ppt模式
    model: 'waterfall',
    // 选中的图表类型
    chooseIndex: null,
    chooseTypeIndex: null,
    // 选中的特殊图表类型
    chooseType: '',
    // 图表类型
    chartsTypes: [{
      name: '二维图表',
      isSpec: false,
      isUsable: true,
      children: []
    }, {
      name: '三维图表',
      isSpec: true,
      isUsable: false,
      children: [{
        name: '三维柱图',
        img: '',
        type: 'bar3D',
        choose: false
      }]
    }, {
      name: '地理图表',
      isSpec: true,
      isUsable: false,
      children: []
    }],
    activeChildren: [],
    // 新用户的帮助
    dashboardEmpty: false
  }),
  watch: {
    editStatus: function (newVal, oldVal) {
      if (newVal) {
        this.toggleGridEdit(true);
      } else {
        this.toggleGridEdit();
        this.saveDashboard();
      }
    },
    searchCharts: function (val, oldVal) {
      for (let i = 0; i < this.charts.length; i++) {
        if (this.charts[i].text && this.charts[i].text.indexOf(val) < 0) {
          this.charts[i].show = false;
        } else {
          this.charts[i].show = true;
        }
      }
    },
    searchView: function (val) {
      this.$refs.viewTree.filter(val);
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
    // 加载 dashboard 列表
    loadDashboard() {
      let that = this,
        params = that.$route.params;
      getJson('/dashboard/list.do', {}, function (res) {
        if (res.success) {
          that.dashboardList = Object.assign([], res.data);
           
          for (let i = 0; i < that.dashboardList.length; i++) {
            that.dashboardList[i].active = false;
            that.dashboardList[i].show = true;
            if (that.dashboardList[i].id == params.viewId) {
              that.chartList = that.dashboardList[i].layout || [];
              that.dashboardName = that.dashboardList[i].text;
              that.dashboardId = that.dashboardList[i].id;
              that.dashboardBgcolor = that.dashboardList[i].dashboardBgcolor || '';
              that.dashboardList[i].active = true;
            }
          }
          if (!params.viewId) {
            that.fullscreenLoading = false;
            that.dashboardEmpty = true;
            return;
          }
          that.getDashboardData();
        }
      });
    },
    // 空函数
    noop() { },
    getDashboardData(callback) {
      let that = this,
        params = that.$route.params;
      for (let j = 0; j < that.chartList.length; j++) {
        that.chartList[j].option = {};
      }
      // 第一个promise取chart列表
      var resultArr = [];
      for (let i = 0; i < that.chartList.length; i++) {
        resultArr.push(request(that.chartList[i].id, i));
      }

      function request(id, i) {
        return new Promise(function (resolve, reject) {
          that.getChartData(id, i, resolve, reject);
        });
      }
      Promise.all(resultArr).then(result => {
        var chartDataPms = [];
        for (let i = 0; i < result.length; i++) {
          that.chartList[i].option =
            result[i] && result[i].option ? result[i].option : {};
          that.chartList[i].loading = false;
          that.chartList[i].type = result[i].type || '';
          that.chartList[i].sql = result[i].tableName?result[i].tableName.sql:'';
          that.chartList[i].query = result[i].query || {};
          that.chartList[i].isSpec = result[i].isSpec;

          that.chartList[i].background = result[i].background
            ? result[i].background
            : {
              backgroundColor: '#fff',
              backgroundRepeat: 'no-repeat',
              backgroundImage: ''
            };
          if (that.chartList[i].option) {
            that.chartList[i].title = that.chartList[i].option.title
              ? that.chartList[i].option.title.text
              : '';
            // 清空title，把title提出来
            that.chartList[i].option.title = '';
          } else {
            that.chartList[i].title = '';
          }

          // 手动清空series.data里数据
          if (that.chartList[i].option && that.chartList[i].option.series) {
            for (let j = 0; j < that.chartList[i].option.series.length; j++) {
              that.chartList[i].option.series[j].data = [];
            }
          }
        }

        that.loadGrid();
        that.toggleFullScreen();
        that.lazyload();
        if ('function' == typeof callback) {
          callback();
        }
        return;
        // 以下为不用懒加载的方式
        // for (let i = 0; i < that.chartList.length; i++) {
        //   chartDataPms.push(
        //     chartDataRequest(that.chartList[i].sql, JSON.stringify(that.chartList[i].query), i, that.chartList[i].type)
        //   );
        // }
        // function chartDataRequest(sql, queryInfo, index, type) {
        //   return new Promise(function (resolve, reject) {
        //     that.getChartSeriesData(
        //       sql,
        //       queryInfo,
        //       index,
        //       type,
        //       resolve,
        //       reject
        //     );
        //   });
        // }
        // Promise.all(chartDataPms).then(result2 => {
        //   for (let i = 0; i < result2.length; i++) {
        //     if (result2[i].data.dataError || !result2[i].data.data) {
        //       continue;
        //     }
        //     that.dataHandler(result2[i], i, that.chartList[i].type);
        //   }

        //   that.toggleFullScreen();
        //   if ('function' == typeof callback) {
        //     callback();
        //   }
        // });
      });
    },
    // 获取单一图表数据,i是在索引中的顺序
    getChartData(chartId, i, resolve, reject) {
      let that = this;
      if ('function' != typeof resolve) {
        resolve = that.noop;
      }
      if ('function' != typeof reject) {
        reject = that.noop;
      }
      // 查询图表源 数据
      getJson(
        '/chart/info.do',
        {
          chart: chartId
        },
        function (data) {
          resolve(data.data);
        },
        function () {
          reject();
        }
      );
    },
    // 获取图表数据，手动组织series.data
    getChartSeriesData(sql, queryInfo, index, type, resolve, reject) {
      let that = this;
      getJson(
        '/query.do',
        {
          view: sql,
          query: queryInfo
        },
        function (data) {
          // if (data.success) {
          //   resolve(data);
          // }
          if (data.success) {
            if (data.data.dataError || !data.data.data) {
              return;
            }
            that.dataHandler(data, index, type);
          }
        },
        function () {
          // reject();
        }
      );
    },
    onClickRefreshChartData(chartId, i, $event) {
      let that = this,
        loadingInstance;
      loadingInstance = that.$loading({
        target: $($event.target).closest('._wrap')[0]
      });
      // TODO: loading使用elementUI的，但是关闭事件用了延时
      // that.chartList[i].loading = true;
      // that.chartList.splice(i, 1, this.chartList[i])
      // that.chartList = Object.assign([],that.chartList)

      // 查询图表源 数据
      getJson(
        '/chart/info.do',
        {
          chart: chartId
        },
        function (data) {
          if (data.success && data.data) {
            that.chartList[i].isload = false;
            that.chartList[i].option =
              data.data && data.data.option ? data.data.option : {};
            that.chartList[i].loading = false;
            that.chartList[i].type = data.data.type;
            that.chartList[i].sql = data.data.tableName.sql;
            that.chartList[i].query = data.data.query;
            that.chartList[i].title = that.chartList[i].option.title
              ? that.chartList[i].option.title.text
              : '';
            // 清空title，把title提出来
            that.chartList[i].option.title = '';
            // 手动清空series.data里数据
            if (that.chartList[i].option && that.chartList[i].option.series) {
              for (let j = 0; j < that.chartList[i].option.series.length; j++) {
                that.chartList[i].option.series[j].data = [];
              }
            }
            getJson(
              '/query.do',
              {
                view: data.data.tableName.sql,
                query: JSON.stringify(data.data.query)
              },
              function (res) {
                if (res.success) {
                  if (res.data.dataError || !res.data.data) {
                    return;
                  }
                  that.dataHandler(res, i, data.data.type);
                }
              }
            );
          }
        }
      );
      setTimeout(function () {
        that.$nextTick(function () {
          loadingInstance.close();
        });
      }, 1000);
    },
    // 选择工作表
    handleNodeClick(data) {
      this.newCharts.tableName.sql = data.id;
      this.newCharts.tableName.name = data.name;
    },
    // 新建图表
    // TODO: 3D图表需增加标识字段和type
    newchartClick(e) {
      let that = this;
      that.addNewChartVisible = false;
      if (e) {
        getJson(
          '/chart/save.do',
          {
            folder: '/',
            config: JSON.stringify(that.newCharts)
          },
          function (data) {
            if (data.success) {
              let params = that.$route.params,
                list = {
                  id: that.dashboardId,
                  text: that.dashboardName,
                  layout: []
                };
              // 获取各图表x,y,w,h
              $('.grid-stack-item').each(function (i, e) {
                list.layout.push({
                  id: $(e).data('id'),
                  x: $(e).data('gs-x'),
                  y: $(e).data('gs-y'),
                  width: $(e).data('gs-width'),
                  height: $(e).data('gs-height'),
                  isAutoPosition: false
                });
              });
              list.layout.push({
                id: data.data.id,
                x: 0,
                y: 0,
                width: 3,
                height: 4,
                isAutoPosition: false
              });
              getJson(
                '/dashboard/save.do',
                {
                  config: JSON.stringify(list)
                },
                function (res) {
                  if (res.success) {
                    if (that.newCharts.isSpec) {
                      that.$router.push('/chart_editor_prime/' + data.data.id);
                    } else {
                      that.$router.push('/chart_editor/' + data.data.id);
                    }
                  }
                }
              );
            }
          }
        );
      }
    },
    // 保存仪表盘
    saveDashboard(callback) {
      let that = this,
        params = that.$route.params,
        list = {
          id: that.dashboardId,
          text: that.dashboardName,
          dashboardBgcolor: that.dashboardBgcolor,
          layout: []
        };
      // 获取各图表x,y,w,h
      $('.grid-stack-item').each(function (i, e) {
        list.layout.push({
          id: $(e).data('id'),
          x: $(e).data('gs-x'),
          y: $(e).data('gs-y'),
          width: $(e).data('gs-width'),
          height: $(e).data('gs-height'),
          isAutoPosition: false
        });
      });
      getJson(
        '/dashboard/save.do',
        {
          config: JSON.stringify(list)
        },
        function (res) {
          if (res.success) {
            if (callback) {
              callback();
            } else {
              that.$message({ message: '保存成功', type: 'success' });
            }
            that.editStatus = false;
          }
        }
      );
    },
    // 新建仪表盘
    addDashboard() {
      let that = this;
      if (!that.newDashboardName) {
        that.$message({ message: '请输入仪表名', type: 'error' });
        return;
      }
      let list = {
        id: '',
        text: that.newDashboardName,
        layout: []
      };
      getJson(
        '/dashboard/save.do',
        {
          config: JSON.stringify(list)
        },
        function (res) {
          if (res.success) {
            that.$message({ message: '新建成功', type: 'success' });
            that.dashboardDialogVisible = false;
            // that.$router.replace({ path: '/dashboard/'+resData.data.id });
            that.$router.replace({
              path: '/empty',
              query: { link: '/dashboard/' + res.data.id }
            });
          }
        }
      );
    },
    // 显示/隐藏添加图表弹窗
    toggleAddChartDialog(addFlag) {
      // 添加图表前判断有没有选择dashboard
      if('boolean' == typeof addFlag && !this.dashboardId){
        this.$message({ message: '请先选择仪表盘', type: 'warning' });
        return;
      }
      this.addChartVisible = !this.addChartVisible;
      
    },
    // 显示/隐藏选择图表类型弹窗
    toggleChooseTypeDialog() {
      this.chooseTypeVisible = !this.chooseTypeVisible;
    },
    // 打开图表类型弹窗
    onClickAddNewChart() {
      this.chooseTypeVisible = true;
    },
    // 打开数据视图弹窗
    showDataView() {
      if (vm.$data.chooseTypeIndex == null) {
        alert('请选择图表');
        return;
      }
      if (this.newCharts.isSpec && !this.newCharts.type) {
        alert('请选择图表');
        return;
      }
      this.addNewChartVisible = true;
    },
    // 第一级选择事件
    onClickChooseType(index) {
      if (this.chartsTypes[index].isUsable) {
        this.chooseTypeIndex = index;
        this.activeChildren = this.chartsTypes[index].children;
        this.newCharts.isSpec = this.chartsTypes[index].isSpec;
      }
    },
    // 第二级选择事件
    onClickType(index) {
      this.chooseIndex = index;
      this.newCharts.type = this.activeChildren[index].type;
    },
    // 关闭仪表盘编辑弹窗
    closeEditDialog() {
      this.editDialogVisible = false;
    },
    // 打开/关闭设计模式
    toggleEdit() {
      if(this.dashboardId){
        this.editStatus = !this.editStatus;
        if (this.editStatus) {
          this.toggleGridEdit(true);
        } else {
          this.toggleGridEdit();
          this.saveDashboard();
        }
      }
    },
    // 预览跳转
    preview() {
      // 预览前先保存
      let that = this;
      if(that.dashboardId){
        var href = vars.src + '/viewer/dashboard.html?id=' + that.dashboardId;
        that.saveDashboard(openPrevView);
      }else{
        this.$message({ message: '请先选择仪表盘', type: 'warning' });
      }
      function openPrevView() {
        window.open(href);
      }
    },
    // 已有图表选中事件
    toggleActive(index) {
      var that = this;
      if (that.charts[index].isActive) {
        for (let i = 0; i < this.charts.length; i++) {
          this.charts[i].isActive = false;
        }
      } else {
        for (let i = 0; i < this.charts.length; i++) {
          this.charts[i].isActive = false;
        }
        this.charts[index].isActive = true;
      }
      that.charts = Object.assign([], that.charts);
    },
    // 把选中的charts添加到dashboard中
    addChartTodashBoard() {
      let that = this,
        chartId;
      for (let i = 0; i < that.charts.length; i++) {
        if (that.charts[i].isActive) {
          chartId = that.charts[i].id;
          that.charts[i].isActive = false;
        }
      }
      for (let i = 0; i < that.chartList.length; i++) {
        if (chartId == that.chartList[i].id) {
          that.$message({ message: '不能添加相同的图表', type: 'warning' });
          return false;
        }
      }
      if (!chartId) {
        that.$message({ message: '没有选中的图表', type: 'warning' });
      } else {
        that.addChartVisible = false;
        that.toggleFullScreen(true);
        that.chartList.push({
          id: chartId,
          x: 0,
          y: 0,
          width: 3,
          height: 4,
          isAutoPosition: true
        });
        that.dash.destroy(false);
        $('#dash').data('gridstack', '');
        that.getDashboardData(that.saveDashboard);
      }
    },
    // 拖拽区遮罩
    toggleFullScreen(e) {
      if (e) {
        this.fullscreenLoading = true;
      } else {
        this.fullscreenLoading = false;
      }
    },
    // 添加弹窗显示
    toggleAddDashboardDialog(data) {
      this.dashboardDialogVisible = data;
    },
    // 左侧列表点击事件
    itemClick(data) {
      if (data != this.dashboardId) {
        this.$router.push({
          path: '/empty',
          query: { link: '/dashboard/' + data }
        });
      }

    },
    // 删除图表
    onClickDeleteChart(chartId, i, $event) {
      let that = this;
      this.chartList.splice(i, 1);
      setTimeout(() => {
        that.saveDashboard(callback);
      }, 300);
      function callback() {
        that.$message({ message: '删除成功', type: 'success' });
      }
    },
    // 编辑标题弹窗显示
    showTitleEditor(data) {
      this.editDialogVisible = data.status;
      this.editTitle = this.dashboardList[data.index].text;
      this.editId = this.dashboardList[data.index].id;
      this.editIndex = data.index;
    },
    // 保存仪表盘编辑（标题）
    saveEdit() {
      let that = this;
      that.editDialogVisible = false;
      var list = {
        id: that.editId,
        text: that.editTitle,
        layout: this.dashboardList[that.editIndex].layout
      };
      getJson(
        '/dashboard/save.do',
        {
          config: JSON.stringify(list)
        },
        function (res) {
          var resData = res.data;
          if (res.success) {
            that.$message({ message: '保存成功', type: 'success' });
            if (that.editId == that.$route.params.viewId) {
              list.active = true;
              that.dashboardName = that.editTitle;
            } else {
              list.active = false;
            }
            list.show=true;
            that.dashboardList.splice(that.editIndex, 1, list);
          }
        }
      );
    },
    // 图表数据处理
    dataHandler(data, index, type) {
      let that = this;
      let query = data.data.query;
      let columns = data.data.data.columns;
      let rows = data.data.data.rows;
      // 获取维度和数值的name
      let queryNameX = query.categoryColumns.map(x => x.name);
      let queryNameY = query.valueColumns.map(x => x.name);
      // 根据name获取对应的key
      let queryNameKeyX = [];
      for (var j = 0; j < queryNameX.length; j++) {
        for (let i = 0; i < columns.length; i++) {
          if (columns[i].source.name == queryNameX[j]) {
            queryNameKeyX.push(columns[i].name);
          }
        }
      }
      let queryNameKeyY = [];
      for (var j = 0; j < queryNameY.length; j++) {
        for (let i = 0; i < columns.length; i++) {
          if (columns[i].source.name == queryNameY[j]) {
            queryNameKeyY.push(columns[i].name);
          }
        }
      }
      // 根据type选择处理方式
      switch (type) {
      case 'bar':
        that.chartList[index].option.series = Object.assign(
          [],
          seriesBar(
            columns,
            rows,
            queryNameKeyX,
            queryNameKeyY,
            seriesBarDefault,
            that.chartList[index].option.series
          )
        );
        break;
      case 'line':
        that.chartList[index].option.series = Object.assign(
          [],
          seriesLine(
            columns,
            rows,
            queryNameKeyX,
            queryNameKeyY,
            {},
            that.chartList[index].option.series
          )
        );
        break;
      case 'pie':
        that.chartList[index].option.series = Object.assign(
          [],
          seriesPie(
            columns,
            rows,
            queryNameKeyX,
            queryNameKeyY,
            seriesPieDefault,
            that.chartList[index].option.series
          )
        );
        break;
      case 'area':
        that.chartList[index].option.series = Object.assign(
          [],
          seriesArea(
            columns,
            rows,
            queryNameKeyX,
            queryNameKeyY,
            seriesAreaDefault,
            that.chartList[index].option.series
          )
        );
        break;
      case 'stackbar':
        that.chartList[index].option.series = Object.assign(
          [],
          seriesStackbar(
            columns,
            rows,
            queryNameKeyY,
            seriesBarDefault,
            that.chartList[index].option.series
          )
        );
        break;
      case 'funnel':
        that.chartList[index].option.series = Object.assign(
          [],
          seriesFunnel(
            columns,
            rows,
            queryNameKeyX,
            queryNameKeyY,
            seriesFunnelDefault,
            that.chartList[index].option.series
          )
        );
        break;
      case 'rosePie':
        that.chartList[index].option.series = Object.assign(
          [],
          seriesRosePie(
            columns,
            rows,
            queryNameKeyX,
            queryNameKeyY,
            seriesRosePieDefault,
            that.chartList[index].option.series
          )
        );
        break;
      case 'radar':
        that.chartList[index].option.series = Object.assign(
          [],
          seriesRadar(
            columns,
            rows,
            queryNameKeyX,
            queryNameKeyY,
            seriesRadarDefault,
            that.chartList[index].option.series
          )
        );
        break;
      case 'treemap':
        that.chartList[index].option.series = Object.assign(
          [],
          seriesTreemap(
            columns,
            rows,
            queryNameKeyX,
            queryNameKeyY,
            seriesTreemapDefault,
            that.chartList[index].option.series
          )
        );
        break;
      case 'waterfall':
        that.chartList[index].option.series = Object.assign(
          [],
          seriesWaterfall(
            columns,
            rows,
            queryNameKeyX,
            queryNameKeyY,
            seriesWaterfallDefault,
            that.chartList[index].option.series
          )
        );
        break;
      case 'gauge':
        that.chartList[index].option.series = Object.assign(
          [],
          seriesGauge(
            columns,
            rows,
            queryNameKeyX,
            queryNameKeyY,
            seriesWaterfallDefault,
            that.chartList[index].option.series
          )
        );
        break;
      case 'wordCloud':
        that.chartList[index].option.series = Object.assign(
          [],
          seriesWordCloud(
            columns,
            rows,
            queryNameKeyX,
            queryNameKeyY,
            seriesWaterfallDefault,
            that.chartList[index].option.series
          )
        );
        break;
      case 'percentStackbar':
        that.chartList[index].option.series = Object.assign(
          [],
          seriesPercentStackbar(
            columns,
            rows,
            queryNameKeyY,
            seriesWaterfallDefault,
            that.chartList[index].option.series
          )
        );
        break;
      case 'table':
        this.chartList[index].chartData = data.data;
        break;
      case 'bar3D':
        that.chartList[index].option.series = Object.assign(
          [],
          seriesBar3D(
            columns,
            rows,
            queryNameKeyX,
            queryNameKeyY,
            seriesBar3DDefault,
            that.chartList[index].option.series
          )
        );
        break;

      default:
        console.warn('类型错误！');
      }
      that.chartList[index].option = Object.assign({}, that.chartList[index].option);
      that.$set(that.chartList, index, that.chartList[index]);
    },
    // 选择视图搜索
    filterView(value, data) {
      if (!value) return true;
      return data.label.indexOf(value) !== -1;
    },
    // 懒加载
    lazyload() {
      let that = this;
      $('.grid-content').on('scroll', function () {
        // 滚动的距离
        let scrollTop = Math.abs($('#dash').position().top);
        var h = $('.grid-content').height();
        $('.grid-stack-item').each(function () {
          let position = $(this).position().top;
          let index = $(this).attr('data-index');
          let isload = that.chartList[index].isload;
          let id = $(this).attr('data-id');
          if (position < scrollTop + h && !isload) {
            that.chartList[index].isload = true;
            let type = that.chartList[index].type;
            let queryInfo = JSON.stringify(that.chartList[index].query);
            let sql = that.chartList[index].sql;
            that.getChartSeriesData(sql, queryInfo, index, type);
          }
        });
      }).trigger('scroll');
    }
  }
};
</script>
<style scoped>
.new_user {
  width: 100%;
  height: 500px;
  margin-top: 40px;
  background: url('../../assets/images/dashboard_e.png') no-repeat;
  background-position: 5px 5px;
}
</style>
