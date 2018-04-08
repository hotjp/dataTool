<template>
  <div id="chartEditor" class="full">
    <!--TODO:test方法尝试更新数组数据-->
    <!--<a href="javascript:;" @click="test">点我</a>-->
    <div class="full">
      <div class="full chart_left">
        <div class="grid-content full">
          <div class="chart_data_info">
            <p>数据视图名称</p>
            <!--TODO:切换表弹窗-->
            <p class="table_name">{{charts.tableName.name}}
              <span class="r" @click="workTableDialogVisible = true">
                <i class="el-icon-edit-outline"></i>
              </span>
            </p>
            <!--TODO:添加字段弹窗-->
            <!-- <p class="add_col">字段 -->
            <!-- <a href="javascript:;" class="r" @click="addColFlag = !addColFlag">
                <i class="el-icon-circle-plus-outline"></i>
              </a> -->
            <!-- </p> -->

            <!--<p>日期单独做</p>-->
          </div>
          <div class="search_wrap fix">
            字段
            <!-- TODO: 添加-->
            <i class="el-icon-plus r"  @click=""></i>
            <div class="search_box r">
              <i class="el-icon-search"></i>
              <input type="text" v-model="search" class="search_input">
            </div>
          </div>
          
          <ul v-for="(item,index) in columns" :key="index" v-if="item.show" class="colums_list">
            <li class="colums_item fix " draggable="true" @dragstart="itemOnDragstart(item,$event)" @selectstart="itemOnSelectstart">
              <i class="icon el-icon-document" v-if="item.type=='String'"></i>
              <i class="icon el-icon-date" v-if="item.type=='Date'"></i>
              <i class="icon el-icon-edit-outline" v-if="item.type=='Number'"></i>
              {{item.text}}
              <!-- <a @click="onAddColumnClick(item)" href="javascript:;">添加到维度</a> -->
              <!-- <a @click="onAddValueClick(item)" href="javascript:;">添加到数值</a> -->
              <!--TODO:排序弹出层-->
              <a class="sort_icon r" v-if="item.type == 'String'" href="javascript:;" @click="sortDialogVisible = true">
                <i class="el-icon-sort"></i>
              </a>
            </li>
          </ul>
        </div>
      </div>
      <div class="common_top top fix">
          <chartTitle class="l name" @titleText="getTitle" :setTitle="charts.option.title"></chartTitle>
          <!-- <span class="name l ">11111111111</span> -->
          <button type="button" class="r menu top_btn" @click=""></button>     
          <button type="button" class="r preview top_btn" @click="preview()">预览分享</button>
          <button type="button" class="r save top_btn" @click="saveChartData">保存视图</button>
          <button type="button" class="r redo top_btn" @click="">重做</button>   
          <button type="button" class="r undo top_btn" @click="">撤销</button>     
      </div>
      <div class="chart_main">
        <div class="grid-content">
          <div class="query">
            <div class="xAxis fix">
              <!--TODO:弹出添加维度数值弹出框-->
              <div class="fix list_row" @dragenter="categoryOnDragenter" @dragover="categoryOnDragover" @drop="categoryOnDrop">
                <a href="javascript:;" class="tit l" @click="batchAddCategoryColumsDialogVisible = true">维度
                  <!--批量添加数值-->
                  <i class="el-icon-edit-outline"></i>
                </a>
                <ul class="fix l">
                  <li class="l" v-for="(column,index) in queryInfo.categoryColumns" :key="index">
                    <!--TODO:点击下拉-->
                    <a href="javascript:;" class="none_line_white" @click="toggleSelectedItem(index)">
                      <i class="el-icon-arrow-down"></i>
                      {{column.text}}
                    </a>

                    <span v-if="column.sort">{{column.sort}}</span>
                    <a @click="onDeleteColumnClick(column)" href="javascript:;">
                      <i class="el-icon-circle-close"></i>
                    </a>
                    <!--维度下拉框-->
                    <!-- <ul class="selectedItem" v-if="column.selectedItemSwitch" > -->
                    <ul class="selectedItem" v-if="column.selectedItemSwitch" @mouseleave="closeSelectedItem(index)">
                      <!-- <ul class="selectedItem" v-if="column.selectedItemSwitch" > -->
                      <li v-for="(item,indexItem) in dimensionalitySelectOptions" :key="indexItem">
                        <a href="javascript:;" v-if="item.children" @click="toggleSelectedChildren(index,indexItem)">
                          {{item.value}}
                          <i class="el-icon-arrow-right r"></i>
                        </a>
                        <a href="javascript:;" @click="onClickPopup(item.popup)" v-else-if="item.popup">
                          {{item.value}}
                        </a>
                        <a href="javascript:;" @click="onClickSetItemSort(index,item.value)" v-else>
                          {{item.value}}
                        </a>
                        <ul v-if="item.children&&column.selectedChildrenSwitch==indexItem" class="selectedItemChildren" @mouseleave="closeSelectedChildren(index)">
                          <!-- <ul v-if="item.children&&column.selectedChildrenSwitch==indexItem" class="selectedItemChildren" > -->
                          <li v-for="(itemChild,indexChild) in item.children" :key="indexChild">
                            <a href="javascript:;" @click="onClickSetItemSort(index,itemChild.value)">
                              {{itemChild.value}}
                            </a>
                          </li>
                        </ul>
                      </li>
                    </ul>
                  </li>
                </ul>
              </div>
              <div class="fix list_row" @dragenter="valueOnDragenter" @dragover="valueOnDragover" @drop="valueOnDrop">
                <!--TODO:图表类型下拉框-->
                <a href="javascript:;" class="tit l" @click="batchAddColumsDialogVisible = true">数值
                  <!--批量添加数值-->
                  <i class="el-icon-edit-outline"></i>
                </a>
                <ul class="fix l">
                  <li class="l" v-for="(value,index) in queryInfo.valueColumns" :key="index">
                    <a href="javascript:;" class="none_line_white" @click="toggleValueSelectedItem(index)">
                      <i class="el-icon-arrow-down"></i>
                      {{value.text}}
                    </a>

                    <span v-if="value.sort">{{value.sort}}</span>
                    <!--<a @click="onDeleteValueClick(column)" href="javascript:;">删除</a>-->
                    <a @click="onDeleteValueClick(value)" href="javascript:;">
                      <i class="el-icon-circle-close"></i>
                    </a>
                    <!--数值下拉框-->
                    <ul class="selectedItem" v-if="value.selectedItemSwitch" @mouseleave="closeValueSelectedItem(index)">
                      <!-- <ul class="selectedItem" v-if="value.selectedItemSwitch" > -->
                      <li v-for="(item,indexItem) in valueSelectOptions" :key="indexItem">
                        <a href="javascript:;" v-if="item.children" @click="toggleValueSelectedChildren(index,indexItem)">
                          {{item.value}}
                          <i class="el-icon-arrow-right r"></i>
                        </a>
                        <a href="javascript:;" @click="onClickPopup(item.popup,index,value)" v-else-if="item.popup">
                          {{item.value}}
                        </a>
                        <a href="javascript:;" @click="onClickSetValueItemSort(index,item)" v-else>
                          {{item.value}}
                        </a>
                        <ul v-if="item.children&&value.selectedChildrenSwitch==indexItem" class="selectedItemChildren" @mouseleave="closeValueSelectedChildren(index)">
                          <!-- <ul v-if="item.children&&value.selectedChildrenSwitch==indexItem" class="selectedItemChildren"> -->
                          <li v-for="(itemChild,indexChild) in item.children" :key="indexChild">
                            <a href="javascript:;" @click="onClickSetValueItemSort(index,itemChild)">
                              {{itemChild.value}}
                            </a>
                          </li>
                        </ul>
                      </li>
                    </ul>
                  </li>
                </ul>
              </div>
            </div>
            <div class="yAxis"></div>
          </div>
          <el-card class="display_container box-card" :style="[{width:(screenWidth-442)+'px'},charts.background]">
            <div class="full empty_container" v-show="!echartsShow && !tableShow" :style="{height:chartsHeight+'px',lineHeight:chartsHeight+'px'}">
              暂无数据
              <!-- {{chartsHeight}}{{screenWidth}} -->
            </div>
            <IEcharts class="full charts_container" v-show="echartsShow" theme="macarons" :style="{height:chartsHeight+'px'}" :notMerge="true" :resizable="charts.resizable" :option="charts.option" :loading="charts.loading" @ready="onChartReady"></IEcharts>
            <tableView class="full table_container" :myMessage="chartData" v-show="tableShow" :style="{height:chartsHeight+'px'}"></tableView>
          </el-card>

          <!-- <el-button size="mini" @click="getChartData">点击使用query获取data并判断可用图表</el-button> -->

        </div>
      </div>
      <div class="full chart_right">
        <div class="grid-content full">

          <!-- 图表类型 -->
          <chartsTypes ref="chartsTypes" :charts="charts" :echartsShow="echartsShow" :tableShow="tableShow" @gettableShow="gettableShow" @getechartsShow="getechartsShow" @getCharts="getCharts" :setqueryInfo="queryInfo"></chartsTypes>
          <!-- 序列风格 -->
          <seriesStyles :charts="charts" @seriesStyles="seriesStyles"></seriesStyles>
          <!-- 面板属性 -->
          <chartConfig @getProp="getProp" :setProp="graphData" :charts="charts"></chartConfig>

        </div>
      </div>
    </div>

    <!--选择工作表弹出框-->
    <el-dialog class="workTableDialog" title="选择工作表" :visible.sync="workTableDialogVisible" width="30%" center>
      <form onsubmit="return false">
        <input type="text" class="workTableSearch" />
        <br>
        <!-- <div>
          <i class="el-icon-tickets"></i>
          <span>仪表盘示例</span>
        </div> -->
        <el-tree :data="listFolders.list" :props="listFolders.defaultProps" accordion @node-click="handleNodeClick"></el-tree>

        <!-- <div>
          <i class="el-icon-tickets"></i>
          <span>仪表盘示例</span>
        </div> -->
        <!--<span>需要注意的是内容是默认不居中的</span>-->
        <span slot="footer" class="dialog-footer">
          <el-button class="btn-confirm" type="primary" @click="workTableDialog(1)">确 定</el-button>
          <el-button class="btn-cancel" @click="workTableDialog(0)">取 消</el-button>
        </span>
      </form>
    </el-dialog>
    <!--排序弹出框-->
    <el-dialog class="sort_select_dialog" title="文本排序" :visible.sync="sortDialogVisible" width="30%">
      <el-radio v-model="radio" label="1">默认排序</el-radio>
      <br>
      <div class="sort_selectDiv">
        <el-radio v-model="radio" label="2">按字母排序</el-radio>
        <!--<div class="">-->
        <el-select v-model="selectSortValue" placeholder="请选择">
          <el-option v-for="item in selectSortOptions" :key="item.value" :label="item.label" :value="item.value">
          </el-option>
        </el-select>
        <!--</div>-->

      </div>
      <el-radio v-model="radio" label="3">自定义排序</el-radio>

      <div class="sort_select_container">

      </div>

      <span slot="footer" class="dialog-footer">
        <el-button class="btn-confirm" type="primary" @click="sortDialogVisible = false">确 定</el-button>
        <el-button class="btn-cancel" @click="sortDialogVisible = false">取 消</el-button>
      </span>
    </el-dialog>

    <!--批量添加维度字段-->
    <el-dialog class="batchAddColumsDialog" title="批量添加维度字段" :visible.sync="batchAddCategoryColumsDialogVisible" width="70%">
      <form onsubmit="return false">
        <div class="fix">
          <div class="r" style="width: 200px">
            <input type="text" class="workTableSearch" />
          </div>
        </div>

        <!--日期-->
        <div>
          <el-checkbox :indeterminate="isIndeterminateCategoryDates" v-model="checkAllCategoryDates" @change="handleCheckAllCategoryChangeDates">
            <i class="el-icon-date"></i>日期</el-checkbox>
          <el-checkbox-group v-model="checkedCategoryDates" @change="handleCheckedCategoryDatesChange">
            <el-checkbox v-for="date in dates" :label="date" :key="date.text">{{date.text}}</el-checkbox>
          </el-checkbox-group>
        </div>
        <!--文本-->
        <div>
          <el-checkbox :indeterminate="isIndeterminateCategoryTexts" v-model="checkAllCategoryTexts" @change="handleCheckAllCategoryChangeTexts">
            <i class="el-icon-tickets"></i>文本</el-checkbox>
          <el-checkbox-group v-model="checkedCategoryTexts" @change="handleCheckedCategoryTextsChange">
            <el-checkbox v-for="text in texts" :label="text" :key="text.text">{{text.text}}</el-checkbox>
          </el-checkbox-group>
        </div>
        <!--数值-->
        <div>
          <el-checkbox :indeterminate="isIndeterminateCategoryNums" v-model="checkAllCategoryNums" @change="handleCheckAllCategoryChangeNums">
            <i class="el-icon-more"></i>数值</el-checkbox>
          <el-checkbox-group v-model="checkedCategoryNums" @change="handleCheckedCategoryNumsChange">
            <el-checkbox v-for="num in nums" :label="num" :key="num.text">{{num.text}}</el-checkbox>
          </el-checkbox-group>
        </div>

        <span slot="footer" class="dialog-footer">
          <el-button class="btn-confirm" type="primary" @click="batchAddCategoryColums">确 定</el-button>
          <el-button class="btn-cancel" @click="batchAddCategoryColumsDialogVisible = false">取 消</el-button>
        </span>
      </form>
    </el-dialog>

    <!--批量添加数值字段-->
    <el-dialog class="batchAddColumsDialog" title="批量添加数值字段" :visible.sync="batchAddColumsDialogVisible" width="70%">
      <form onsubmit="return false">
        <div class="fix">
          <div class="r" style="width: 200px">
            <input type="text" class="workTableSearch" />
          </div>
        </div>

        <!--日期-->
        <div>
          <el-checkbox :indeterminate="isIndeterminateDates" v-model="checkAllDates" @change="handleCheckAllChangeDates">
            <i class="el-icon-date"></i>日期</el-checkbox>
          <el-checkbox-group v-model="checkedDates" @change="handleCheckedDatesChange">
            <el-checkbox v-for="date in dates" :label="date" :key="date.text">{{date.text}}</el-checkbox>
          </el-checkbox-group>
        </div>
        <!--文本-->
        <div>
          <el-checkbox :indeterminate="isIndeterminateTexts" v-model="checkAllTexts" @change="handleCheckAllChangeTexts">
            <i class="el-icon-tickets"></i>文本</el-checkbox>
          <el-checkbox-group v-model="checkedTexts" @change="handleCheckedTextsChange">
            <el-checkbox v-for="text in texts" :label="text" :key="text.text">{{text.text}}</el-checkbox>
          </el-checkbox-group>
        </div>
        <!--数值-->
        <div>
          <el-checkbox :indeterminate="isIndeterminateNums" v-model="checkAllNums" @change="handleCheckAllChangeNums">
            <i class="el-icon-more"></i>数值</el-checkbox>
          <el-checkbox-group v-model="checkedNums" @change="handleCheckedNumsChange">
            <el-checkbox v-for="num in nums" :label="num" :key="num.text">{{num.text}}</el-checkbox>
          </el-checkbox-group>
        </div>

        <span slot="footer" class="dialog-footer">
          <el-button class="btn-confirm" type="primary" @click="batchAddColums">确 定</el-button>
          <el-button class="btn-cancel" @click="batchAddColumsDialogVisible = false">取 消</el-button>
        </span>
      </form>
    </el-dialog>

    <!--添加计算字段弹出框-->
    <el-dialog class="addComputedColumsDialog" title="添加计算字段" :visible.sync="addComputedColumsDialogVisible" width="50%">
      <form onsubmit="return false">
        <input class="colums_name" type="text" placeholder="字段名称">
        <br>
        <el-select v-model="value" placeholder="请选择字段类型">
          <el-option v-for="item in addComputedColumnsOptions" :key="item.value" :label="item.label" :value="item.value">
          </el-option>
        </el-select>
        <el-input type="textarea" :rows="4" placeholder="SUM([A]) + SUM([B])" v-model="addComputedColumsTextarea">
        </el-input>
        <div class="addComputedColumsList">
          <div class="listLeft">

          </div>
          <div class="listRight">

          </div>

        </div>
        <span slot="footer" class="dialog-footer">
          <el-button class="btn-confirm" type="primary" @click="addComputedColumsDialogVisible = false">确 定</el-button>
          <el-button class="btn-cancel" @click="addComputedColumsDialogVisible = false">取 消</el-button>
        </span>
      </form>
    </el-dialog>

    <!-- 维度 设置字段弹窗 -->
    <settingXfield :XfieldOption="XfieldOption" @Xfield="Xfield"></settingXfield>
    <!-- 数值 设置字段弹窗 -->
    <settingYfield :YfieldOption="YfieldOption" @Yfield="Yfield"></settingYfield>
    <!-- 数值 结果筛选器弹窗-->
    <resultScreen :queryInfo="queryInfo" :ScreenOption="ScreenOption" @summaryFilter="summaryFilter" @YScreen="YScreen" @getqueryInfo="getqueryInfo"></resultScreen>
    <!-- 数值 数值显示弹窗 -->
    <numShow :YnumOption="YnumOption" @Ynum="Ynum"></numShow>
  </div>
</template>
<script>
import { getJson } from "../../router/utils";
import _ from "lodash";
import IEcharts from "vue-echarts-v3/src/full";
import 'echarts-wordcloud'
import tableView from "../../components/chartEditor/tableView.vue";
import chartTypeOption from "../../components/chartEditor/chartTypeOption.vue";
// 属性面板
import chartConfig from "../../components/chartEditor/chartConfig.vue";
// 序列风格
import seriesStyles from "../../components/chartEditor/seriesStyles.vue";
// 图表类型
import chartsTypes from "../../components/chartEditor/chartsTypes.vue";
//引入echarts皮肤
import { Message } from "element-ui";
//import 'echarts/theme/dark.js'
//import 'echarts/theme/infographic.js'
import "echarts/theme/macarons.js";
//import 'echarts/theme/roma.js'
//import 'echarts/theme/shine.js'
//import 'echarts/theme/vintage.js'

//import '../../assets/js/dark.js';

// 维度 设置字段弹窗
import settingXfield from "../../components/chartEditor/xAxis/settingXField.vue";
// 数值 设置字段弹窗
import settingYfield from "../../components/chartEditor/yAxis/settingYField.vue";
// 数值 结果筛选器弹窗
import resultScreen from "../../components/chartEditor/yAxis/resultScreen.vue";
// 数值 数值显示弹窗
import numShow from "../../components/chartEditor/yAxis/numShow.vue";
import chartTitle from "../../components/chartEditor/title.vue";

// 历史记录工具
import TimeLine from "../../assets/js/objectTimeLine";

export default {
  components: {
    chartTitle,
    IEcharts,
    tableView,
    chartTypeOption,
    chartConfig,
    seriesStyles,
    chartsTypes,
    settingXfield,
    settingYfield,
    resultScreen,
    numShow
  },
  mounted() {
    let that = (window.vm = this),
      params = that.$route.params;
    // TODO: 完成历史记录工具
    // window.timeLines = this.timeLine = new TimeLine({
    //   treasures: this.chats,
    //   backupOpt: {
    //     backupCallback: function() {
    //       console.log(arguments);
    //     }
    //   }
    // });

    if (Object.keys(params).length) {
      that.charts.id = params.viewId;
    }
    window.onresize = function() {
      that.onresizeWindow();
    };

    this.menuStatus = _.debounce(function() {
      this.$set(
        this.queryInfo.categoryColumns[this._index],
        "selectedItemSwitch",
        false
      );
      this.$set(
        this.queryInfo.categoryColumns[this._index],
        "selectedChildrenSwitch",
        false
      );
    }, 200);
    this.menuChildrenStatus = _.debounce(function() {
      // this.$set(this.queryInfo.categoryColumns[this._index], 'selectedItemSwitch', false);
      this.$set(
        this.queryInfo.categoryColumns[this._index],
        "selectedChildrenSwitch",
        -1
      );
    }, 200);
    this.valMenuStatus = _.debounce(function() {
      this.$set(
        this.queryInfo.valueColumns[this.val_index],
        "selectedItemSwitch",
        false
      );
      this.$set(
        this.queryInfo.valueColumns[this.val_index],
        "selectedChildrenSwitch",
        false
      );
    }, 200);
    this.valMenuChildrenStatus = _.debounce(function() {
      // selectedChildrenSwitch
      // this.$set(this.queryInfo.valueColumns[this.val_index], 'selectedItemSwitch', false);
      this.$set(
        this.queryInfo.valueColumns[this.val_index],
        "selectedChildrenSwitch",
        -1
      );
    }, 200);
    this.getChartDataChangeView = _.debounce(function() {
      this.getChartData();
    }, 500);

    // 选择表
    getJson(
      "/dataview/list.do",
      {
        params: {
          folder: "",
          dataview: true
        }
      },
      function(res) {
        if (res.success) {
          that.listFolders.list = res.data;
        }
      }
    );
    if (that.charts.id != "") {
      getJson(
        "/chart/info.do",
        {
          chart: that.charts.id
        },
        function(res) {
          if (res.success&&res.data) {
            that.charts = Object.assign({}, that.charts, res.data);
            that.queryInfo = Object.assign({}, that.queryInfo, res.data.query);
            that.$nextTick(function() {
              that.getTopHeight();
              vm.getChartDataChangeView();
            });
          }
          getJson(
            "/dataview/info.do",
            {
              view: that.charts.tableName.sql
            },
            function(res) {
              if (res.success) {
                that.nums = [];
                that.dates = [];
                that.texts = [];
                that.columns = res.data.columns;
                for (let i = 0; i < res.data.columns.length; i++) {
                  if (res.data.columns[i].type == "Number") {
                    that.nums.push(res.data.columns[i]);
                  }
                  if (res.data.columns[i].type == "Date") {
                    that.dates.push(res.data.columns[i]);
                  }
                  if (res.data.columns[i].type == "String") {
                    that.texts.push(res.data.columns[i]);
                  }
                  res.data.columns[i].show = true;
                }
              }
            }
          );
        }
      );
    } else {
      that.workTableDialogVisible = true;
    }
  },
  destroyed() {
    // 销毁后
    window.vm=null;
    window.timeLines =null;
    window.onresize = null;
    window.screenWidth=null;
    window.chartsHeight=null;
  },
  data: () => ({
    // 表格用数据
    chartData:{},
    // 数值 显示格式弹出框
    YnumOption: {
      valueDisplayFormat: false,
      numericUnit: "",
      // 数值 显示格式弹出框单选框
      valueFormatRadio: "1",
      // 数值 显示格式弹出框单选框 千位分隔符
      thousandsSeparator: true
    },
    // 数值 设置字段弹出框
    YfieldOption: {
      valueSetColums: false
    },
    // 数值 结果筛选器
    ScreenOption: {
      summaryFilter: false,
      filterValue: "",
      // 使用下方筛选条件
      useFilter: false,
      index: 0
    },
    // 维度 设置字段弹出框以及数据
    XfieldOption: {
      categorySetColums: false
    },
    // 左侧列表拖拽暂存值
    dragObj: {},
    val_index: "",
    //        数值下拉元素
    valueSelectOptions: [
      {
        value: "求和",
        label: "sum"
      },
      {
        value: "平均值",
        label: "avg"
      },
      {
        value: "计数",
        label: "count"
      },
      {
        value: "更多",
        label: "more",
        children: [
          {
            value: "最大值",
            label: "max"
          },
          {
            value: "最小值",
            label: "min"
          },
          {
            value: "无",
            label: "无"
          }
        ]
      },
      {
        value: "数值显示格式",
        label: "数值显示格式",
        popup: {
          src: "YnumOption",
          name: "valueDisplayFormat"
        }
      },
      {
        value: "设置字段",
        label: "设置字段",
        popup: {
          src: "YfieldOption",
          name: "valueSetColums"
        }
      },
      {
        value: "结果筛选器",
        label: "结果筛选器",
        // summary
        popup: {
          src: "ScreenOption",
          name: "summaryFilter"
        }
      }
    ],
    //        维度下拉菜单索引
    _index: "",
    //        维度下拉元素
    dimensionalitySelectOptions: [
      {
        value: "设置字段",
        label: "设置字段",
        popup: {
          src: "XfieldOption",
          name: "categorySetColums"
        }
      },
      {
        value: "排序",
        label: "排序",
        children: [
          {
            value: "默认",
            label: "默认"
          },
          {
            value: "升序",
            label: "升序"
          },
          {
            value: "降序",
            label: "降序"
          },
          {
            value: "自定义排序",
            label: "自定义排序"
          }
        ]
      }
    ],
    //        添加分组字段 分组方式选择器
    addGroupColumsMethodOptions: [
      {
        value: "选项1",
        label: "常规"
      },
      {
        value: "选项2",
        label: "年内"
      },
      {
        value: "选项3",
        label: "表达式"
      }
    ],
    addGroupColumsMethodValue: "",
    //        添加分组字段 分组字段选择器
    addGroupColumsSelectOptions: [
      {
        value: "选项1",
        label: "日期"
      },
      {
        value: "选项2",
        label: "数值"
      },
      {
        value: "选项3",
        label: "文本"
      }
    ],
    addGroupColumsSelectValue: "",
    //        添加分组字段
    addGroupColumsDialogVisible: false,
    //        添加计算字段
    addComputedColumsDialogVisible: false,
    addComputedColumsTextarea: "",
    addComputedColumnsOptions: [
      {
        value: "选项1",
        label: "文本"
      },
      {
        value: "选项2",
        label: "数值"
      },
      {
        value: "选项3",
        label: "日期"
      }
    ],
    value: "",

    // 批量添加维度字段
    checkAllCategoryDates: false,
    checkedCategoryDates: [],
    isIndeterminateCategoryDates: true,
    checkAllCategoryTexts: false,
    checkedCategoryTexts: [],
    isIndeterminateCategoryTexts: true,
    checkAllCategoryNums: false,
    checkedCategoryNums: [],
    isIndeterminateCategoryNums: true,
    batchAddCategoryColumsDialogVisible: false,
    // 批量添加数值字段批量添加数值字段批量添加数值字段
    checkAllDates: false,
    checkedDates: [],
    dates: [{ name: "date", text: "日期", type: "Date" }],
    isIndeterminateDates: true,
    checkAllTexts: false,
    checkedTexts: [],
    texts: [
      { name: "name", text: "名称", type: "String" },
      { name: "type", text: "类型", type: "String" },
      { name: "status", text: "状态", type: "String" }
    ],
    isIndeterminateTexts: true,
    checkAllNums: false,
    checkedNums: [],
    nums: [
      { name: "qty", text: "数量", type: "Number" },
      { name: "price", text: "价格", type: "Number" }
    ],
    isIndeterminateNums: true,
    //批量添加数值字段
    batchAddColumsDialogVisible: false,
    //排序弹出框 下拉菜单
    selectSortOptions: [
      {
        value: "选项1",
        label: "升序"
      },
      {
        value: "选项2",
        label: "降序"
      }
    ],
    selectSortValue: "",
    //排序单选按钮 默认1 需要调整
    radio: "1",
    //排序弹出层显示隐藏开关
    sortDialogVisible: false,
    //添加字段显示隐藏标志
    // addColFlag: false,
    //工作表弹出框显示开关
    workTableDialogVisible: false,
    // 屏幕宽度默认值
    screenWidth: document.body.clientWidth,
    chartsHeight: document.body.clientHeight - 150,
    //echarts显示
    echartsShow: false,
    //table显示
    tableShow: false,
    // 当前查询
    queryInfo: {
      // 现有图表类型
      valueColumns: [],
      categoryColumns: [],
      filters: []
    },
    // 当前报表数据列
    columns: [],
    charts: {
      id: "",
      text: "",
      tableName: {
        name: "",
        sql: ""
      },
      type: "",
      loading: false,
      resizable: true,
      option: {
        color: [
          "#d87c7c",
          "#919e8b",
          "#d7ab82",
          "#6e7074",
          "#61a0a8",
          "#efa18d",
          "#787464",
          "#cc7e63",
          "#724e58",
          "#4b565b"
        ],
        title: {
          text: "未命名图表",
          textStyle: {
            fontSize: 14
          }
        }
      },
      query: {
        // 数值列
        valueColumns: [
          {
            name: "price", // 列名
            aggr: "conunt" // 聚合方式(sum/min/max/avg)
          },
          {
            name: "price",
            aggr: "conunt"
          },
          {
            name: "qty",
            aggr: "conunt"
          }
        ],
        // 维度列
        // 日期型数据可以对数据进行粒度调整，分为提取字段(year/month/date/hour/minute/second/week/quarter)和按截断到时间(trunc_*)
        // 数值型数据可以按数值分布进行分区，并指定分区数量
        // 其他类型按字面值分组
        categoryColumns: [
          {
            name: "date", // 列名
            //          gran: "trunc_month",   // 粒度：按月
            //          gran: "trunc_date",    // 粒度：按日叠加
            //          gran: "quarter",       // 粒度：按季度叠加
            gran: "trunc_quarter", // 粒度：按季度
            sort: "asc" // 排序
          },
          {
            name: "type"
          }
        ],
        // 过滤条件
        // 表达式树，与千里马的表达式编辑器类似
        filters: [
          {
            conj: "and", // 条件关系，同级别条件的关系运算符应相同，第一个表达式的条件没有作用
            name: "price", // 列名
            op: "gt", // 操作符(gt/gte/lt/lte/eq/ne/in/not_in/between)
            values: [1] // 目标值列表，数量根据操作符决定
          },
          {
            conj: "and",
            name: "qty",
            op: "lt",
            values: [99999]
          },
          {
            conj: "and",
            exprs: [
              {
                conj: "or",
                name: "type",
                op: "eq",
                values: ["requirement"]
              },
              {
                conj: "or",
                name: "status",
                op: "in",
                values: ["closed", "done"]
              }
            ]
          }
        ]
      },
      layout: {
        title: "标题",
        subtitle: "副标题",
        palette: ["0xf90", "0xccc", "0x9f0", "0x09f"],
        type: "scatter"
      },
      // 图表背景
      background:{
        backgroundColor:'#fff',
        backgroundRepeat:'no-repeat',
        backgroundImage:''
      }
    },
    // pageName: '图表编辑',
    graphData: {},
    rule: {
      columns: {}
    },
    listFolders: {
      list: [
        {
          name: "",
          children: []
        }
      ],
      defaultProps: {
        children: "",
        label: "name"
      },
      // 选择的id
      checkId: ""
    },
    // 搜索
    search:''
  }),
  watch: {
    // 如果 charts 改变，函数运行
    charts: {
      handler: function(newCharts) {
        this.timeLine.snapshoot(newCharts);
      },
      deep: true
    },
    search:function(val,oldVal){
      for(let i=0;i<this.columns.length;i++){
        if(this.columns[i].text.indexOf(val)<0){
          this.columns[i].show=false;
        }else{
          this.columns[i].show=true;          
        }
      }
    }
  },
  methods: {
    // IEcharts组件会返回实例
    onChartReady(instance) {
      this.charts.loading = false;
      this.instance = instance
    },
    // 删除某一维度,操作queryInfo.categoryColumns
    // TODO:考虑和删除数值是否需要合并
    onDeleteColumnClick(column) {
      let that = this;
      let index = this.queryInfo.categoryColumns.indexOf(column);
      if (0 <= index) {
        this.queryInfo.categoryColumns.splice(index, 1);
      }
      this.$nextTick(function() {
        that.getTopHeight();
        vm.getChartDataChangeView();
      });
    },
    // 删除某一数值,操作queryInfo.categoryColumns
    onDeleteValueClick(column) {
      let that = this;
      let index = this.queryInfo.valueColumns.indexOf(column);
      if (0 <= index) {
        this.queryInfo.valueColumns.splice(index, 1);
      }
      this.$nextTick(function() {
        that.getTopHeight();
        vm.getChartDataChangeView();
      });
    },
    getChartData() {
      let that = this,
        params = that.$route.params;
      // 查询图表源 数据
      getJson(
        "/query.do",
        {
          view: that.charts.tableName.sql,
          query: JSON.stringify(that.queryInfo)
        },
        function(res) {
          if (res.success) {
            that.chartData = Object.assign({}, res.data);
            that.graphData = Object.assign({}, res.data);
            that.$refs.chartsTypes.checkChartType();
            // that.checkChartType();
            if (Object.keys(that.charts.option).length) {
              // that.echartsShow = true;
            }
            if (!Object.keys(res.data.data).length) {
              that.echartsShow = false;
              that.tableShow = false;
            }
          }
        }
      );
    },
    //通用填值
    fetchVal(item, type) {
      let temVal = {};
      if (type == "category") {
        if (item.type == "Date") {
          temVal["gran"] = "trunc_quarter";
          temVal["sort"] = "asc";
        }
      } else if (type == "value") {
        temVal["aggr"] = "count";
        temVal["selectedChildrenSwitch"] = false;
        temVal["selectedItemSwitch"] = false;
        temVal["sort"] = "计数";
        temVal["filter"] = {};
        temVal["filter"]["values"] = [];
      }
      temVal["name"] = item.name;
      temVal["text"] = item.text;
      temVal["type"] = item.type;
      return temVal;
    },
    //获取维度数值高度
    getTopHeight() {
      let nowTopHeight = document.getElementsByClassName("query")[0]
        .offsetHeight;
      // grid-content的padding + el-card__body的padding + top的高度
      let padding = 45 + 40 + 90;
      let Dvalue = nowTopHeight + padding;
      this.chartsHeight = document.body.clientHeight - Dvalue;
    },
    //添加到维度
    onAddColumnClick(item) {
      let that = this;
      let res = this.fetchVal(item);
      if (res) {
        this.queryInfo.categoryColumns.push(res);
      }
      this.$nextTick(function() {
        that.getTopHeight();
      });
      this.$nextTick(function() {
        vm.getChartDataChangeView();
      });
      that.charts.query = Object.assign({}, that.queryInfo);
    },
    //添加到数值
    onAddValueClick(item, type) {
      let that = this;
      let res = {};
      for (var i = 0; i < that.queryInfo.valueColumns.length; i++) {
        if (item.name == that.queryInfo.valueColumns[i].name) {
          res = Object.assign({}, res, that.queryInfo.valueColumns[i]);
          break;
        }
      }
      if (!Object.keys(res).length) {
        res = this.fetchVal(item, type);
      }
      if (res) {
        this.queryInfo.valueColumns.push(res);
      }
      this.$nextTick(function() {
        that.getTopHeight();
      });
      this.$nextTick(function() {
        vm.getChartDataChangeView();
      });
      that.charts.query = Object.assign({}, that.queryInfo);
    },
    //
    saveChartData() {
      let that = this;
      // 保存图表 数据
      that.charts.query = that.queryInfo;
      that.charts.text = that.charts.option.title.text;
      that.charts.layout.type = that.charts.type;
      getJson(
        "/chart/save.do",
        {
          folder: "/",
          config: JSON.stringify(that.charts)
        },
        function(data) {
          if (data.success) {
            that.charts.id = data.data.id;
            Message({ message: "保存成功", type: "success" });
          }
        }
      );
    },
    getBackground: function(data){
      this.instance?this.instance.clear():'';      
      this.charts.background = Object.assign({}, this.charts.background, data);
    },
    // 属性面板数据
    getProp: function(data) {
      this.instance?this.instance.clear():'';      
      this.charts.option = Object.assign({}, this.charts.option, data);
    },
    //      弹出框选择日期型
    handleCheckAllChangeDates(val) {
      this.checkedDates = val ? this.dates : [];
      this.isIndeterminateDates = false;
    },
    handleCheckedDatesChange(value) {
      let checkedCount = value.length;
      this.checkAllDates = checkedCount === this.dates.length;
      this.isIndeterminateDates =
        checkedCount > 0 && checkedCount < this.dates.length;
    },
    //      弹出框选择文本型
    handleCheckAllChangeTexts(val) {
      this.checkedTexts = val ? this.texts : [];
      this.isIndeterminateTexts = false;
    },
    handleCheckedTextsChange(value) {
      let checkedCount = value.length;
      this.checkAllTexts = checkedCount === this.texts.length;
      this.isIndeterminateTexts =
        checkedCount > 0 && checkedCount < this.texts.length;
    },
    //      弹出框选择数值型
    handleCheckAllChangeNums(val) {
      this.checkedNums = val ? this.nums : [];
      this.isIndeterminateNums = false;
    },
    handleCheckedNumsChange(value) {
      let checkedCount = value.length;
      this.checkAllNums = checkedCount === this.nums.length;
      this.isIndeterminateNums =
        checkedCount > 0 && checkedCount < this.nums.length;
    },
    //      添加计算字段 TODO:以后会用到 18-2-12 hahage
    // onClickAddComputedColumsDialog() {
    //   this.addColFlag = false;
    //   this.addComputedColumsDialogVisible = true;
    // },
    // //      添加分组字段 TODO:以后会用到 18-2-12 hahage
    // onAddGroupColumsDialog() {
    //   this.addColFlag = false;
    //   this.addGroupColumsDialogVisible = true;
    //   // console.log(data);
    // },
    // 序列风格
    seriesStyles: function(data) {
      this.instance?this.instance.clear():''; 
      this.charts.option = Object.assign({}, this.charts.option, {
        color: data.value,
        colorName: data.name
      });
    },
    // 图表类型
    chartsShape: function(data) {},
    getCharts: function(data) {
      this.charts.type = data.type;
      this.instance?this.instance.clear():''; 
      this.charts.option = Object.assign({}, this.charts.option, data.option);
    },
    gettableShow: function(data) {
      this.tableShow = data;
      this.instance?this.instance.clear():'';       
    },
    getechartsShow: function(data) {
      this.echartsShow = data;
    },
    onClickSetItemSort(index, val) {
      this.$set(this.queryInfo.categoryColumns[index], "sort", val);
      this.toggleSelectedItem(index);
    },
    //维度下拉框
    toggleSelectedItem(index) {
      let selectedItemSwitch = this.queryInfo.categoryColumns[index]
        .selectedItemSwitch
        ? this.queryInfo.categoryColumns[index].selectedItemSwitch
        : false;
      let val = !selectedItemSwitch;
      this.$set(
        this.queryInfo.categoryColumns[index],
        "selectedItemSwitch",
        val
      );
    },
    toggleSelectedChildren(index, indexItem) {
      let selectedChildrenSwitch = this.queryInfo.categoryColumns[index]
        .selectedChildrenSwitch
        ? this.queryInfo.categoryColumns[index].selectedChildrenSwitch
        : -1;
      let val = -1;
      if (selectedChildrenSwitch == indexItem) {
        val = -1;
      } else {
        val = indexItem;
      }
      this.$set(
        this.queryInfo.categoryColumns[index],
        "selectedChildrenSwitch",
        val
      );
    },
    closeSelectedItem(index) {
      this._index = index;
      vm.menuStatus();
    },
    closeSelectedChildren(index) {
      this._index = index;
      vm.menuChildrenStatus();
    },
    // 维度设置字段弹窗
    Xfield: function(data) {
      this.XfieldOption = Object.assign({}, this.XfieldOption, data);
    },
    Yfield: function(data) {
      this.YfieldOption = Object.assign({}, this.YfieldOption, data);
    },
    YScreen: function(data) {
      this.ScreenOption = Object.assign({}, this.ScreenOption, data);
    },
    Ynum: function(data) {
      this.YnumOption = Object.assign({}, this.YnumOption, data);
    },
    //数值下拉框
    toggleValueSelectedItem(index) {
      let selectedItemSwitch = this.queryInfo.valueColumns[index]
        .selectedItemSwitch
        ? this.queryInfo.valueColumns[index].selectedItemSwitch
        : false;
      let val = !selectedItemSwitch;
      this.$set(this.queryInfo.valueColumns[index], "selectedItemSwitch", val);
    },
    toggleValueSelectedChildren(index, indexItem) {
      let selectedChildrenSwitch = this.queryInfo.valueColumns[index]
        .selectedChildrenSwitch
        ? this.queryInfo.valueColumns[index].selectedChildrenSwitch
        : -1;
      let val = -1;
      if (selectedChildrenSwitch == indexItem) {
        val = -1;
      } else {
        val = indexItem;
      }
      this.$set(
        this.queryInfo.valueColumns[index],
        "selectedChildrenSwitch",
        val
      );
    },
    closeValueSelectedItem(index) {
      this.val_index = index;
      vm.valMenuStatus();
    },
    closeValueSelectedChildren(index) {
      this.val_index = index;
      vm.valMenuChildrenStatus();
    },
    onClickSetValueItemSort(index, item) {
      let that = this;
      if (that.queryInfo.valueColumns[index].type != "Number") {
        this.$message({
          message: "您选择的非数值型字段不允许" + item.value + "聚合",
          type: "warning"
        });
        return false;
      }
      for (var i = 0; i < that.queryInfo.valueColumns.length; i++) {
        if (that.queryInfo.valueColumns[i].type == "Number") {
          if (
            that.queryInfo.valueColumns[i].name ==
            that.queryInfo.valueColumns[index].name
          ) {
            that.queryInfo.valueColumns[i].aggr = item.label;
          }
        }
      }
      this.$set(this.queryInfo.valueColumns[index], "sort", item.value);
      this.toggleValueSelectedItem(index);

      this.$nextTick(function() {
        vm.getChartDataChangeView();
      });
    },
    itemOnSelectstart() {
      //禁止被选中  拖拽元素
      return false;
    },
    itemOnDragstart(item, ev) {
      //          拖拽开始  拖拽元素
      this.dragObj = item;
      return true;
    },
    leafOnDragend() {
      //          拖拽结束  拖拽元素
      return false;
    },
    categoryOnDragover(ev) {
      //          console.log(ev);
      //          拖拽元素在目标元素头上移动的时候，目标元素
      ev.preventDefault();
      return true;
    },
    categoryOnDragenter() {
      //          拖拽元素进入目标元素头上的时候，目标元素

      return true;
    },
    categoryOnDrop() {
      //          拖拽元素进入目标元素头上，同时鼠标松开的时候,目标元素
      //          this.$set(this.charts.option.series[0].data, 0, a);
      this.onAddColumnClick(this.dragObj, "category");
      return false;
    },
    valueOnDragover(ev) {
      //          console.log(ev);
      //          拖拽元素在目标元素头上移动的时候，目标元素
      ev.preventDefault();
      return true;
    },
    valueOnDragenter() {
      //          拖拽元素进入目标元素头上的时候，目标元素

      return true;
    },
    valueOnDrop() {
      //          拖拽元素进入目标元素头上，同时鼠标松开的时候,目标元素
      //          this.$set(this.charts.option.series[0].data, 0, a);
      this.onAddValueClick(this.dragObj, "value");
      return false;
    },
    onClickPopup(popup, index, value) {
      if (popup.src != "") {
        this[popup.src][popup.name] = true;
      } else {
        this[popup.name] = true;
      }
      if (popup.name == "summaryFilter") {
        this.ScreenOption.index = index;
      }
    },
    // 批量添加数值字段
    batchAddColums() {
      let that = this;
      let checkedDates = this.checkedDates;
      let checkedTexts = this.checkedTexts;
      let checkedNums = this.checkedNums;
      for (let i = 0; i < checkedDates.length; i++) {
        this.onAddValueClick(checkedDates[i]);
      }
      for (let i = 0; i < checkedTexts.length; i++) {
        this.onAddValueClick(checkedTexts[i]);
      }
      for (let i = 0; i < checkedNums.length; i++) {
        this.onAddValueClick(checkedNums[i]);
      }
      this.batchAddColumsDialogVisible = false;
      this.$nextTick(function() {
        that.checkedDates = [];
        that.checkedTexts = [];
        that.checkedNums = [];
      });
      that.charts.query = Object.assign({}, that.queryInfo);
    },
    // 批量添加维度字段
    batchAddCategoryColums() {
      let that = this;
      let checkedDates = this.checkedCategoryDates;
      let checkedTexts = this.checkedCategoryTexts;
      let checkedNums = this.checkedCategoryNums;
      for (let i = 0; i < checkedDates.length; i++) {
        this.onAddColumnClick(checkedDates[i]);
      }
      for (let i = 0; i < checkedTexts.length; i++) {
        this.onAddColumnClick(checkedTexts[i]);
      }
      for (let i = 0; i < checkedNums.length; i++) {
        this.onAddColumnClick(checkedNums[i]);
      }
      this.batchAddCategoryColumsDialogVisible = false;
      this.$nextTick(function() {
        that.checkedCategoryDates = [];
        that.checkedCategoryTexts = [];
        that.checkedCategoryNums = [];
      });
      that.charts.query = Object.assign({}, that.queryInfo);
    },
    // 选择全部日期维度
    handleCheckAllCategoryChangeDates(val) {
      this.checkedCategoryDates = val ? this.dates : [];
      this.isIndeterminateCategoryDates = false;
    },
    // 选择单个日期维度
    handleCheckedCategoryDatesChange(value) {
      let checkedCount = value.length;
      this.checkAllCategoryDates = checkedCount === this.dates.length;
      this.isIndeterminateCategoryDates =
        checkedCount > 0 && checkedCount < this.dates.length;
    },
    // 选择全部文本维度
    handleCheckAllCategoryChangeTexts(val) {
      this.checkedCategoryTexts = val ? this.texts : [];
      this.isIndeterminateCategoryTexts = false;
    },
    // 选择单个文本维度
    handleCheckedCategoryTextsChange(value) {
      let checkedCount = value.length;
      this.checkAllCategoryTexts = checkedCount === this.texts.length;
      this.isIndeterminateCategoryTexts =
        checkedCount > 0 && checkedCount < this.texts.length;
    },
    // 选择全部数值维度
    handleCheckAllCategoryChangeNums(val) {
      this.checkedNums = val ? this.nums : [];
      this.isIndeterminateNums = false;
    },
    // 选择单个数值维度
    handleCheckedCategoryNumsChange(value) {
      let checkedCount = value.length;
      this.checkAllCategoryNums = checkedCount === this.nums.length;
      this.isIndeterminateCategoryNums =
        checkedCount > 0 && checkedCount < this.nums.length;
    },
    handleNodeClick(data) {
      this.charts.tableName.sql = data.id;
      this.charts.tableName.name = data.name;
    },
    workTableDialog(e) {
      let that = this;
      if (e) {
        if (that.charts.tableName.sql != "") {
          getJson(
            "/dataview/info.do",
            {
              view: that.charts.tableName.sql
            },
            function(res) {
              if (res.success) {
                that.columns = res.data.columns;
                that.workTableDialogVisible = false;
              }
            }
          );
        }
        if (that.charts.id == "") {
          that.charts.query = that.queryInfo||{};
          that.charts.text = that.charts.option.title.text;
          that.charts.layout.type = that.charts.type;
          getJson(
            "/chart/save.do",
            {
              folder: "/",
              config: JSON.stringify(that.charts)
            },
            function(data) {
              if (data.success) {
                that.charts.id = data.data.id;
                that.$router.push("/chart_editor/" + data.data.id);
              }
            }
          );
        }
      } else {
        this.charts.tableName.sql = "";
        this.charts.tableName.name = "";
        that.workTableDialogVisible = false;
      }
    },
    getqueryInfo: function(data) {
      let that = this;
      if (this.ScreenOption.useFilter) {
        this.$nextTick(function() {
          that.getTopHeight();
        });
        this.$nextTick(function() {
          vm.getChartDataChangeView();
        });
      }
    },
    summaryFilter: function(data) {
      this.ScreenOption.summaryFilter = data;
    },
    onresizeWindow: function() {
      let that = this;
      let pathStr = that.$route.path;
      let pathArr = pathStr.split("/");
      // console.log(pathArr);

      if (pathArr[1] === "chart_editor") {
        _.debounce(function() {
          window.screenWidth = document.body.clientWidth;
          that.screenWidth = window.screenWidth;
          window.chartsHeight = document.body.clientHeight;
          // console.log('---------tip-------------');
          // console.log(document.getElementsByClassName('query')[0]);
          // if(document.getElementsByClassName('query')[0]!=undefined){
          let nowTopHeight = document.getElementsByClassName("query")[0]
            .offsetHeight;
          // grid-content的padding + el-card__body的padding + top的高度
          let padding = 45 + 40 + 90;
          let Dvalue = nowTopHeight + padding;

          // }
          that.chartsHeight = window.chartsHeight - Dvalue;
        }, 500)();
      } else {
        return false;
      }
    },
    // 获取图表标题的值
    getTitle: function(data) {
      this.instance?this.instance.clear():''; 
      Object.assign(this.charts.option.title, data);
    }
  }
};
</script>
<style>
#app {
  font-family: Helvetica, sans-serif;
  text-align: center;
}
</style>