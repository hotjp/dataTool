<template>
  <div id="dashboard" class="full" >
    <div class="full">
      <div class="full dashboard_left">
        <div class="grid-content full">
          <dashboardDir :dashboardList="dashboardList" @showDialog="showDialog" @showEditor="showEditor" ></dashboardDir>
        </div>
      </div>
      <div class="dashboard_main">
        <div class="grid-content" :class="{editing:editStatus}"  v-loading.lock="fullscreenLoading">
          <div class="top fix">
            <span class="name l ">{{dashboardName}}</span>
            <div class="r edit_switch">
              编辑开关：
              <el-switch  v-model="editStatus"  active-color="#3582e3"  inactive-color="#ccc"></el-switch>
              <button v-show="editStatus" type="button" @click="saveDashboard()">保存编辑</button>
            </div>  
            <button type="button" class="r add_chart" @click="addChart()">添加图表</button>
          </div>
          <div id="dash" class="grid-stack grid-stack-6" data-gs-animate="yes" >
             <!-- data-gs-auto-position="true"  -->
            <div v-for="(item,index) in chartList" :key="index" class="grid-stack-item" :data-gs-auto-position="item.isAutoPosition" :data-id="item.id"  :data-gs-x="item.x" :data-gs-y="item.y" :data-gs-width="item.width" :data-gs-height="item.height" data-gs-min-height="2" >
              <div class="_wrap">
                <div class="edit_bar fix">
                  <router-link class="edit_bar_btn r el-icon-edit" :to="'/chart_editor/'+item.id" alt="编辑"></router-link>
                  <span class=" edit_bar_btn r el-icon-refresh" @click="getChartData(item.id,index,$event)" alt="刷新"></span>
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
    <el-dialog title="添加新图表" :visible.sync="dialogVisible" width="40%" :before-close="handleClose">
      <router-link class="new_built" to="/chart_editor/" alt="新建图表"><i class="el-icon-plus"></i>新建图表</router-link>
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
      <el-input v-model="newDashboardName" placeholder="仪表盘名称"></el-input>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dashboardDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addDashboard">确 定</el-button>
      </span>
    </el-dialog>

    <el-dialog title="编辑仪表盘" :visible.sync="editDialogVisible" width="40%">
      <el-input v-model="editTitle" placeholder="仪表盘名称"></el-input>
      
      <span slot="footer" class="dialog-footer">
        <el-button @click="editDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="saveEdit">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import '../../assets/css/gridstack.min.css';
import '../../assets/css/gridstack-extra.min.css';
import '../../assets/js/jquery-1.11.0';
import vars from '../../assets/js/vars';
import axios from 'axios';
import IEcharts from 'vue-echarts-v3/src/full.vue';
import dashboardDir from '../../components/dashboardDir.vue';
import { ajax } from 'jquery';
import Vue from 'vue';
import { Message } from 'element-ui';
import { Loading } from 'element-ui';
//引入echarts皮肤
import '../../assets/js/jquery-ui.min';
import '../../assets/js/gridstack';
import '../../assets/js/gridstack.jQueryUI';
import tableView from '../demo/tableView.vue';

import '../../vendor/seriesBar.js';
import seriesBarDefault from '../../vendor/seriesBar.json';
import '../../vendor/seriesLine.js';
import seriesLineDefault from '../../vendor/seriesLine.json';
import '../../vendor/seriesArea.js';
import seriesAreaDefault from '../../vendor/seriesArea.json';
import '../../vendor/seriesPie.js';
import seriesPieDefault from '../../vendor/seriesPie.json';


export default {
  mounted() {
    let that = (window.vm = this),
      params = that.$route.params;
    that.loadDashboard();
    // 加载 已有chart 列表
    axios({
      url: '/chart/list.do',
      baseURL: vars.api,
      params: {
        folder: '/'
      }
    })
      .then(function(res) {
        var resData = res.data;
        that.charts = resData.data.map(x => {
          // 多增加一个选择状态
          x.isActive = false;
          return x;
        });

        that.charts = resData.data;
      })
      .catch(function(res) {
        console.log(res);
      });
  },
  components: { IEcharts, dashboardDir, tableView },
  data() {
    return {
      fullscreenLoading: true,
      // 拖拽栅格
      dash: null,
      // 仪表盘名称,id
      dashboardName: '',
      dashboardId: '',
      // 栅格配置项
      dashOptions: {
        draggable: true,
        cellHeight: 80,
        verticalMargin: 0,
        width: 6
      },
      // 是否允许拖拽缩放
      editStatus: false,
      // dashboard 列表
      dashboardList: [],
      // chart列表
      chartList: [],
      dialogVisible: false,
      // 已有chart,添加时用
      charts: [],
      dashboardDialogVisible: false,
      newDashboardName: '',
      editDialogVisible: false,
      editTitle: '',
      editId: '',
      editIndex: ''
    };
  },
  methods: {
    // 设置图表禁止和允许拖拽缩放
    disable() {
      this.dash.disable();
    },
    enable() {
      this.dash.movable('.grid-stack-item', true);
      this.dash.resizable('.grid-stack-item', true);
    },
    // 加载拖拽栅格
    loadGrid() {
      let that = this;
      $('#dash').gridstack(that.dashOptions);
      that.dash = $('#dash').data('gridstack');
      that.disable();
    },
    // 加载 dashboard 列表
    loadDashboard() {
      let that = this,
        params = that.$route.params;
      axios({
        url: '/dashboard/list.do',
        baseURL: vars.api,
        params: {}
      })
        .then(function(res) {
          var resData = res.data;
          if (resData.success) {
            that.dashboardList = Object.assign([], resData.data);
            for (let i = 0; i < that.dashboardList.length; i++) {
              that.dashboardList[i].active = false;
              if (!params.viewId) {
                // that.chartList = that.dashboardList[0].layout || [];
                // that.dashboardName = that.dashboardList[0].text;
                // that.dashboardId = that.dashboardList[0].id;
                // that.dashboardList[0].active = true;
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
            for (let i = 0; i < that.chartList.length; i++) {
              that.getChartData(that.chartList[i].id, i);
            }
            // FIXME: 需要等到dom加载完后再load
            setTimeout(function() {
              that.loadGrid();
              that.closeFullScreen();
            }, 1000);
          }
        })
        .catch(function(res) {
          console.log(res);
        });
    },
    // 获取单一图表数据,i是在索引中的顺序
    getChartData(chartId, i, $event) {
      let that = this,
        loadingInstance;
      if ($event) {
        loadingInstance = Loading.service({
          target: $($event.target).closest('._wrap')[0]
        });
      }
      // TODO: loading使用elementUI的，但是关闭事件用了延时
      // that.chartList[i].loading = true;
      // Vue.set(this.chartList, i, this.chartList[i]);
      // that.chartList.splice(i, 1, this.chartList[i])
      // that.chartList = Object.assign([],that.chartList)

      // 查询图表源 数据
      ajax({
        type: 'post',
        url: vars.api + '/chart/info.do',
        async: false, // 设为同步
        data: {
          chart: chartId
        },
        dataType: 'json',
        success: function(data) {
          if (data.success && data.data) {
            that.chartList[i].option =
              data.data && data.data.option ? data.data.option : {};
            that.chartList[i].loading = false;
            that.chartList[i].type = data.data.type;
            // 手动清空series里数据
            if (that.chartList[i].option && that.chartList[i].option.series) {
              for (let j = 0; j < that.chartList[i].option.series.length; j++) {
                that.chartList[i].option.series[j].data = [];
              }
            }
            that.getChartSeriesData(
              data.data.tableName.sql,
              JSON.stringify(data.data.query),
              i,
              data.data.type
            );
          }
          // that.chartList = Object.assign([], that.chartList);
        }
      });
      if (loadingInstance) {
        setTimeout(function() {
          that.$nextTick(function() {
            loadingInstance.close();
          });
        }, 1000);
      }
    },
    // 获取图表option
    getChartSeriesData(id, queryInfo, index, type) {
      let that = this;
      ajax({
        type: 'post',
        url: vars.api + '/query.do',
        async: false, // 设为同步
        data: {
          view: id,
          query: queryInfo
        },
        dataType: 'json',
        success: function(data) {
          if (data.success) {
            if (data.data.dataError || !data.data.data) {
              return;
            }
            // 根据type选择处理方式
            switch (type) {
            case 'bar':
              that.barHandler(data.data, index);
              break;
            case 'line':
              that.lineHandler(data.data, index);
              break;
            case 'pie':
              that.pieHandler(data.data, index);
              break;
            case 'area':
              that.areaHandler(data.data, index);
              break;
            case 'table':
              that.tableHandler(data.data, index);
              break;
            default:
              console.warn('类型错误！');
            }
          }
        }
      });
    },
    // 根据仪表盘id获取charts列表
    // getChartlist(dashboardId) {
    //   let that = this,
    //     params = that.$route.params;
    //   // axios
    // },
    // 保存仪表盘
    saveDashboard() {
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
      axios({
        url: '/dashboard/save.do',
        baseURL: vars.api,
        params: {
          config: JSON.stringify(list)
        }
      })
        .then(function(res) {
          var resData = res.data;
          if (resData.success) {
            Message({ message: '保存成功', type: 'success' });
          }
        })
        .catch(function(res) {
          console.log(res);
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
      axios({
        url: '/dashboard/save.do',
        baseURL: vars.api,
        params: {
          config: JSON.stringify(list)
        }
      })
        .then(function(res) {
          var resData = res.data;
          if (resData.success) {
            Message({ message: '新建成功', type: 'success' });
            that.dashboardDialogVisible = false;
          }
        })
        .catch(function(res) {
          console.log(res);
        });
    },
    // 弹窗选择已有charts，不选择去新建不带参数去chart_editor
    addChart() {
      let that = this;
      that.dialogVisible = true;
    },
    handleClose() {
      this.dialogVisible = false;
    },
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
      if (!chartId) {
        Message({ message: '没有选中的图表', type: 'warning' });
      } else {
        that.dialogVisible = false;
        that.openFullScreen();
        that.chartList.push({
          id: chartId,
          x: 0,
          y: 0,
          width: 3,
          height: 4,
          isAutoPosition: true
        });

        for (let i = 0; i < that.chartList.length; i++) {
          that.getChartData(that.chartList[i].id, i);
        }
        that.chartList = Object.assign([], that.chartList);
        that.dash.destroy(false);
        $('#dash').data('gridstack', '');
        setTimeout(function() {
          that.loadGrid();
          that.closeFullScreen();
          that.saveDashboard();
        }, 1000);
      }
    },
    // 拖拽区遮罩
    toggleFullScreen() {
      this.fullscreenLoading
        ? (this.fullscreenLoading = false)
        : (this.fullscreenLoading = true);
    },
    openFullScreen() {
      this.fullscreenLoading = true;
    },
    closeFullScreen() {
      this.fullscreenLoading = false;
    },
    // 柱状图数据处理
    barHandler(data, index) {
      let that = this;
      let query = data.query;
      let columns = data.data.columns;
      let rows = data.data.rows;
      let queryNameY = query.valueColumns.map(x => x.name);
      let queryNameKeyY = queryNameY.map(function(x) {
        for (let i = 0; i < columns.length; i++) {
          if (columns[i].source.name == x) {
            return columns[i].name;
          }
        }
      });
      that.chartList[index].option.series = Object.assign(
        [],
        seriesBar(
          rows,
          queryNameKeyY,
          seriesBarDefault,
          that.chartList[index].option.series
        )
      );
    },
    // 折线图数据处理
    lineHandler(data, index) {
      let that = this;
      let query = data.query;
      let columns = data.data.columns;
      let rows = data.data.rows;
      let queryNameY = query.valueColumns.map(x => x.name);
      let queryNameKeyY = [];
      for(var j=0;j<queryNameY.length;j++){
        for (let i = 0; i < columns.length; i++) {
          if (columns[i].source.name == queryNameY[j]) {
            queryNameKeyY.push(columns[i].name);
          }
        }
      }
      // let queryNameKeyY = queryNameY.map(function(x) {
      //   for (let i = 0; i < columns.length; i++) {
      //     if (columns[i].source.name == x) {
      //       return columns[i].name;
      //     }
      //   }
      // });
      that.chartList[index].option.series = Object.assign(
        [],
        seriesLine(
          rows,
          queryNameKeyY,
          {},
          that.chartList[index].option.series
        )
      );
      console.log(that.chartList[index].option.series);
      
    },
    areaHandler(data, index) {
      let that = this;
      let query = data.query;
      let columns = data.data.columns;
      let rows = data.data.rows;
      let queryNameY = query.valueColumns.map(x => x.name);
      let queryNameKeyY = [];
      for(var j=0;j<queryNameY.length;j++){
        for (let i = 0; i < columns.length; i++) {
          if (columns[i].source.name == queryNameY[j]) {
            queryNameKeyY.push(columns[i].name);
          }
        }
      }
      that.chartList[index].option.series = Object.assign(
        [],
        seriesArea(
          rows,
          queryNameKeyY,
          seriesAreaDefault,
          that.chartList[index].option.series
        )
      );
    },
    // 饼图数据处理
    pieHandler(data, index) {
      let that = this;
      let query = data.query;
      let columns = data.data.columns;
      let rows = data.data.rows;
      // 获取维度和数值的name
      let queryNameX = query.categoryColumns.map(x => x.name);
      let queryNameY = query.valueColumns.map(x => x.name);
      // 根据name获取对应的key
      let queryNameKeyX = queryNameX.map(function(x) {
        for (let i = 0; i < columns.length; i++) {
          if (columns[i].source.name == x) {
            return columns[i].name;
          }
        }
      });
      let queryNameKeyY = queryNameY.map(function(x) {
        for (let i = 0; i < columns.length; i++) {
          if (columns[i].source.name == x) {
            return columns[i].name;
          }
        }
      });
      // 清空series
      that.chartList[index].option.series = Object.assign(
        [],
        seriesPie(
          rows,
          queryNameKeyX,
          queryNameKeyY,
          seriesPieDefault,
          that.chartList[index].option.series
        )
      );
    },
    // table数据处理
    tableHandler(data, index) {
      this.chartList[index].chartData = data;
    },
    // 添加弹窗显示
    showDialog(data) {
      this.dashboardDialogVisible = data;
    },
    // 删除图表
    deleteChart(chartId, i, $event) {
      let that = this;
      that.chartList.splice(i, 1);
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
      axios({
        url: '/dashboard/save.do',
        baseURL: vars.api,
        params: {
          config: JSON.stringify(list)
        }
      })
        .then(function(res) {
          var resData = res.data;
          if (resData.success) {
            Message({ message: '保存成功', type: 'success' });
            if (that.editId == that.$route.params.viewId) {
              list.active = true;
              that.dashboardName = that.editTitle;
            } else {
              list.active = false;
            }
            that.dashboardList.splice(that.editIndex, 1, list);
          }
        })
        .catch(function(res) {
          console.log(res);
        });
    }
  },
  watch: {
    editStatus: function(newVal, oldVal) {
      if (newVal) {
        this.enable();
      } else {
        this.disable();
      }
    }
  }
};
</script>