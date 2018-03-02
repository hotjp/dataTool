<template>
  <div id="dashboard" class="full" >
    <div class="full">
      <div class="full dashboard_left">
        <div class="grid-content full">
          <dashboardDir :dashboardId="dashboardId" :dashboardList="dashboardList" @showDialog="showDialog" @showEditor="showEditor" ></dashboardDir>
        </div>
      </div>
      <div class="dashboard_main">
        <div class="grid-content" :class="{editing:editStatus}"  v-loading.lock="fullscreenLoading">
          <div class="top fix">
            <span class="name l ">{{dashboardName}}</span>
            <div class="r edit_switch">
              <form onsubmit="return false">
                编辑开关：
                <el-switch  v-model="editStatus"  active-color="#3582e3"  inactive-color="#ccc"></el-switch>
            </form>
            </div>  
            <button type="button" class="r add_chart" @click="addChart()">添加图表</button>
            <a class="r preview" href="javascript:;" @click="preview()">预览</a>
          </div>
          <div id="dash" class="grid-stack grid-stack-6" data-gs-animate="yes" >
            <div v-for="(item,index) in chartList" :key="index" class="grid-stack-item" :data-gs-auto-position="item.isAutoPosition" :data-id="item.id"  :data-gs-x="item.x" :data-gs-y="item.y" :data-gs-width="item.width" :data-gs-height="item.height" data-gs-min-height="3" data-gs-min-width="2" >
              <div class="_wrap">
                <div class="chart_tit">{{item.title}}</div>
                <div class="edit_bar fix">
                  <router-link class="edit_bar_btn r el-icon-edit" :to="'/chart_editor/'+item.id" alt="编辑"></router-link>
                  <span class=" edit_bar_btn r el-icon-refresh" @click="refreshChartData(item.id,index,$event)" alt="刷新"></span>
                  <span class="el-icon-delete r edit_bar_btn" @click="deleteChart(item.id,index,$event)" alt="删除"></span>
                </div>
                <tableView v-if="item.type =='table'" class="full table_container" :myMessage="item.chartData"></tableView>
                <IEcharts v-else class="full charts_container" :resizable="true" :option="item.option" :loading="item.loading"></IEcharts>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <el-dialog title="添加新图表" :visible.sync="dialogVisible" width="40%">
      <el-dialog width="30%" title="选择工作表" :visible.sync="newVisible" append-to-body>
        <el-tree :data="listFolders.list" :props="listFolders.defaultProps" accordion @node-click="handleNodeClick"></el-tree>
        <div slot="footer" class="dialog-footer">
          <el-button @click="newchartClick(0)">取 消</el-button>
          <el-button type="primary" @click="newchartClick(1)">确 定</el-button>
        </div>
      </el-dialog>
      <div @click="newVisible = true"><i class="el-icon-plus"></i>新建图表</div>

      <!-- <router-link class="new_built" to="/chart_editor/" alt="新建图表"><i class="el-icon-plus"></i>新建图表</router-link> -->

      <p class="tit">选择已有图表：</p>
      <!-- TODO: 搜索 -->
      <!-- <input type="text" name="" class="searchColumns"> -->
      <ul class="colums_list">
        <li v-for="(item,index) in charts" :key="index" :class="{ active: item.isActive}" v-if="item.id" :data-id="item.id" @click="toggleActive(index)">
          {{item.text}}
        </li>
      </ul>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addChartTodashBoard">确 定</el-button>
      </span>
    </el-dialog>

    <el-dialog title="添加仪表盘" :visible.sync="dashboardDialogVisible" width="40%">
      <form action onsubmit="return false">
        <el-input v-model="newDashboardName" placeholder="仪表盘名称"></el-input>
        <span slot="footer" class="dialog-footer">
          <el-button @click="dashboardDialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="addDashboard">确 定</el-button>
        </span>
      </form>
    </el-dialog>

    <el-dialog title="编辑仪表盘" :visible.sync="editDialogVisible" width="40%">
      <form action onsubmit="return false">
        <el-input v-model="editTitle" placeholder="仪表盘名称"></el-input>
        <span slot="footer" class="dialog-footer">
          <el-button @click="editDialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="saveEdit">确 定</el-button>
        </span>
      </form>
    </el-dialog>
  </div>
</template>
<script>
// 引入公用配置
import vars from '../../assets/js/vars';
import { Message } from 'element-ui';
import { Loading } from 'element-ui';
import { getJson } from '../../router/utils';
// 引入组件
import IEcharts from 'vue-echarts-v3/src/full.vue';
import dashboardDir from '../../components/dashboard/dashboardDir.vue';
import tableView from '../../components/chartEditor/tableView.vue';
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

export default {
  data() {
    return {
      // 拖拽区遮罩
      fullscreenLoading: true,
      // 栅格配置项
      dashOptions: {
        draggable: true,
        cellHeight: 80,
        verticalMargin: 0,
        width: 6
      },
      // 添加新图表弹窗
      dialogVisible: false,
      // 添加添加仪表盘弹窗
      dashboardDialogVisible: false,
      // 编辑仪表盘弹窗
      editDialogVisible: false,
      // 添加新图表-新建图表弹窗
      newVisible:false,
      // 拖拽栅格
      dash: null,
      // 仪表盘名称
      dashboardName: '',
      // 仪表盘id      
      dashboardId: '',
      // 是否允许拖拽缩放
      editStatus: false,
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
        list: [{
          name: '',
          children: []
        }],
        defaultProps: {
          children: '',
          label: 'name'
        },
        // 选择的id
        checkId: ''
      },
      // 新建图表数据
      newCharts:{
        tableName:{
          sql:'',
          name:''
        }
      }
    };
  },
  mounted() {
    let that = this,
      params = that.$route.params;
    that.loadDashboard();
    // 加载已有chart 列表
    getJson('/chart/list.do',{
      folder: '/'
    },function(res){
      if(res.success){
        that.charts = res.data.map(x => {
        // 多增加一个选择状态
          x.isActive = false;
          return x;
        });
        that.charts = res.data;
      }
    });
    // 选择表
    getJson('/dataview/list.do',{
      folder: '',
      dataview: true
    },function(res){
      if(res.success){
        that.listFolders.list = res.data;
      }
    });
  },
  components: { IEcharts, dashboardDir, tableView },
  methods: {
    // 设置图表禁止和允许拖拽缩放
    toggleGridEdit(e){
      if(e){
        this.dash.movable('.grid-stack-item', true);
        this.dash.resizable('.grid-stack-item', true);
      }else{
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
      getJson('/dashboard/list.do',{},function(res){
        if (res.success) {
          that.dashboardList = Object.assign([], res.data);
          for (let i = 0; i < that.dashboardList.length; i++) {
            that.dashboardList[i].active = false;
            if (!params.viewId) {
              // 获取不到当前仪表盘id时默认取第一个
              that.$router.replace({
                path: '/empty',
                query: { link: '/dashboard/' + that.dashboardList[0].id }
              });
            } else {
              if (that.dashboardList[i].id == params.viewId) {
                that.chartList = that.dashboardList[i].layout || [];
                that.dashboardName = that.dashboardList[i].text;
                that.dashboardId = that.dashboardList[i].id;
                that.dashboardList[i].active = true;
              }
            }
          }
          that.getDashboardData()
        }
      });
    },
    // 空函数
    noop(){},
    getDashboardData(callback){
      let that = this,
        params = that.$route.params;
      for(let j=0;j<that.chartList.length;j++){
        that.chartList[j].option={}
      }
      // 第一个promise取chart列表
      var resultArr=[];
      for (let i = 0; i < that.chartList.length; i++) {
        resultArr.push(request(that.chartList[i].id, i))
      }
      function request(id, i){
        return new Promise(function(resolve,reject){
          that.getChartData(id, i,resolve,reject);
        })
      }
      Promise.all(resultArr).then((result)=>{
        var chartDataPms = [];
        for (let i=0;i<result.length;i++) {
          that.chartList[i].option = result[i] && result[i].option ? result[i].option : {};
          that.chartList[i].loading = false;
          that.chartList[i].type = result[i].type;
          that.chartList[i].sql = result[i].tableName.sql;
          that.chartList[i].query = result[i].query;
          that.chartList[i].title = that.chartList[i].option.title.text;
          // 清空title，把title提出来
          that.chartList[i].option.title = '';
          // 手动清空series.data里数据   
          if (that.chartList[i].option && that.chartList[i].option.series) {
            for (let j = 0; j < that.chartList[i].option.series.length; j++) {
              that.chartList[i].option.series[j].data = [];
            }
          }
        }
        for (let i = 0; i < that.chartList.length; i++) {
          chartDataPms.push(chartDataRequest(that.chartList[i].sql,JSON.stringify(that.chartList[i].query), i,that.chartList[i].type))
        }
        function chartDataRequest(sql, queryInfo, index, type){
          return new Promise(function(resolve,reject){
            that.getChartSeriesData(sql, queryInfo, index, type,resolve,reject);
          })
        }
        Promise.all(chartDataPms).then((result2)=>{
            for(let i=0;i<result2.length;i++){
              if (result2[i].data.dataError || !result2[i].data.data) {
                continue
              }
              that.dataHandler(result2[i], i, that.chartList[i].type);
            }
            that.loadGrid();
            that.toggleFullScreen();
            if('function' == typeof callback){
              callback()
            }
        })
      });
    },
    // 获取单一图表数据,i是在索引中的顺序
    getChartData(chartId, i,resolve,reject) {
      let that = this;
      if('function' != typeof resolve){
        resolve = that.noop
      }
      if('function' != typeof reject){
        reject = that.noop
      }
      // 查询图表源 数据
      getJson('/chart/info.do',{
        chart: chartId
      },
      function(data) {
        resolve(data.data)
      },
      function(){
        reject()
      })
    },
    // 获取图表数据，手动组织series.data
    getChartSeriesData(id, queryInfo, index, type,resolve,reject) {
      let that = this;
      getJson('/query.do',{
        view: id,
        query: queryInfo
      },
      function(data) {
        if (data.success) {
          resolve(data)
        }
      },
      function(){
        reject()
      });
    },
    refreshChartData(chartId, i, $event){
      let that = this,
        loadingInstance;
      loadingInstance = Loading.service({
        target: $($event.target).closest('._wrap')[0]
      });
      // TODO: loading使用elementUI的，但是关闭事件用了延时
      // that.chartList[i].loading = true;
      // that.chartList.splice(i, 1, this.chartList[i])
      // that.chartList = Object.assign([],that.chartList)

      // 查询图表源 数据
      getJson('/chart/info.do',{
        chart: chartId
      },
      function(data) {
        if (data.success && data.data) {
          that.chartList[i].option = data.data && data.data.option ? data.data.option : {};
          that.chartList[i].loading = false;
          that.chartList[i].type = data.data.type;
          that.chartList[i].sql = data.data.tableName.sql;
          that.chartList[i].query = data.data.query;
          that.chartList[i].title = that.chartList[i].option.title.text;
          // 清空title，把title提出来
          that.chartList[i].option.title = '';
          // 手动清空series.data里数据   
          if (that.chartList[i].option && that.chartList[i].option.series) {
            for (let j = 0; j < that.chartList[i].option.series.length; j++) {
              that.chartList[i].option.series[j].data = [];
            }
          }
          getJson('/query.do',{
            view: data.data.tableName.sql,
            query: JSON.stringify(data.data.query)
          },
          function(res) {
            if (res.success) {
              if (res.data.dataError || !res.data.data) {
                return;
              }
              that.dataHandler(res, i, data.data.type);
            }
          });
        }
      });
      setTimeout(function() {
        that.$nextTick(function() {
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
    newchartClick(e){
      let that=this;
      that.newVisible=false;
      if(e){
        getJson('/chart/save.do',{
          folder: '/',
          config: JSON.stringify(that.newCharts)
        },function(data){
          if (data.success) {
            let params = that.$route.params,
              list = {
                id: that.dashboardId,
                text: that.dashboardName,
                layout: []
              };
              // 获取各图表x,y,w,h
            $('.grid-stack-item').each(function(i, e) {
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
            getJson('/dashboard/save.do',{
              config: JSON.stringify(list)
            },function(res){
              if(res.success){
                that.$router.push('/chart_editor/' + data.data.id);
              }
            });
          }
        });
      }
    },
    // 保存仪表盘
    saveDashboard(callback) {
      let that = this,
        params = that.$route.params,
        list = {
          id: that.dashboardId,
          text: that.dashboardName,
          layout: []
        };
      // 获取各图表x,y,w,h
      $('.grid-stack-item').each(function(i, e) {
        list.layout.push({
          id: $(e).data('id'),
          x: $(e).data('gs-x'),
          y: $(e).data('gs-y'),
          width: $(e).data('gs-width'),
          height: $(e).data('gs-height'),
          isAutoPosition: false
        });
      });
      getJson('/dashboard/save.do',{
        config: JSON.stringify(list)
      },function(res){
        if (res.success) {
          if(callback){
            callback();
          }else{
            Message({ message: '保存成功', type: 'success' });
          }
          that.editStatus = false;
        }
      });
    },
    // 新建仪表盘
    addDashboard() {
      let that = this;
      if (!that.newDashboardName) {
        Message({ message: '请输入仪表名', type: 'error' });
        return;
      }
      let list = {
        id: '',
        text: that.newDashboardName,
        layout: []
      };
      getJson('/dashboard/save.do',{
        config: JSON.stringify(list)
      },function(res){
        if (res.success) {
          Message({ message: '新建成功', type: 'success' });
          that.dashboardDialogVisible = false;
          // that.$router.replace({ path: '/dashboard/'+resData.data.id });
          that.$router.replace({
            path: '/empty',
            query: { link: '/dashboard/' + res.data.id }
          });
        }
      });
    },
    // 弹窗选择已有charts，不选择去新建不带参数去chart_editor
    addChart() {
      let that = this;
      that.dialogVisible = true;
    },
    // 预览跳转
    preview(){
      // 预览前先保存
      let that = this;
      var href = vars.src+'/viewer/dashboard.html?id='+that.dashboardId;
      that.saveDashboard(openPrevView);
      function openPrevView(){
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
      for(let i=0;i<that.chartList.length;i++){
        if(chartId == that.chartList[i].id){
          Message({ message: '不能添加相同的图表', type: 'warning' });
          return false;
        }
      }
      if (!chartId) {
        Message({ message: '没有选中的图表', type: 'warning' });
      } else {
        that.dialogVisible = false;
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
        that.getDashboardData(that.saveDashboard)

      }
    },
    // 拖拽区遮罩
    toggleFullScreen(e) {
      if(e){
        this.fullscreenLoading = true;
      }else{
        this.fullscreenLoading = false;
      }
    },
    // 添加弹窗显示
    showDialog(data) {
      this.dashboardDialogVisible = data;
    },
    // 删除图表
    deleteChart(chartId, i, $event) {
      let that = this;
      that.chartList.splice(i, 1);
      setTimeout(() => {
        that.saveDashboard(callback);     
      }, 300);
      function callback(){
        Message({ message: '删除成功', type: 'success' });
      }
    },
    // 编辑标题弹窗显示
    showEditor(data) {
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
      getJson('/dashboard/save.do',{
        config: JSON.stringify(list)  
      },function(res){
        var resData = res.data;
        if (res.success) {
          Message({ message: '保存成功', type: 'success' });
          if (that.editId == that.$route.params.viewId) {
            list.active = true;
            that.dashboardName = that.editTitle;
          } else {
            list.active = false;
          }
          that.dashboardList.splice(that.editIndex, 1, list);
        }
      });
    },
    // 图表数据处理
    dataHandler(data,index,type){
      let that = this;
      let query = data.data.query;
      let columns = data.data.data.columns;
      let rows = data.data.data.rows;
      // 获取维度和数值的name
      let queryNameX = query.categoryColumns.map(x => x.name);
      let queryNameY = query.valueColumns.map(x => x.name);      
      // 根据name获取对应的key
      let queryNameKeyX = [];
      for(var j=0;j<queryNameX.length;j++){
        for (let i = 0; i < columns.length; i++) {
          if (columns[i].source.name == queryNameX[j]) {
            queryNameKeyX.push(columns[i].name);
          }
        }
      }
      let queryNameKeyY = [];
      for(var j=0;j<queryNameY.length;j++){
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
      case 'table':
        this.chartList[index].chartData = data;
        break;
      default:
        console.warn('类型错误！');
      }
    }
  },
  watch: {
    editStatus: function(newVal, oldVal) {
      if (newVal) {
        this.toggleGridEdit(true);
      } else {
        this.toggleGridEdit();
        this.saveDashboard();
      }
    }
  }
};

</script>