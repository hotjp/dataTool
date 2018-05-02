<template>
  <div id="dataView" class="full data_view">
    <div class="left">
      <!-- <ul>
        <li class="list" @click="changeView(item)" v-for="(item,index) in list">
          {{item.name}}
          <div class="del" @click.stop="del(item)"><i class="el-icon-delete"></i></div>
        </li>
      </ul> -->
      <div class="fix dirTreeTitle">
        数据视图
        <i class="el-icon-more r"></i>
        <i class="el-icon-plus r" @click="addSouch()"></i>
        <div class="search_box r">
          <i class="el-icon-search"></i>
          <input type="text" v-model="search" class="search_input">
        </div>
      </div>

      <ul>
        <li class="dirChildren" :class="{active:childIndex == activeIndex,hover:hoverIndex == childIndex}" v-for="(child,childIndex) in list" v-if="child.show" :key="childIndex">
          <el-tooltip class="item" effect="light" disabled :content="'数据源名称：'+child.sourceType.name" placement="right">
            <div>
              <div class="childrenText" @click="changeView(child,childIndex)">
                <i class="el-icon-document"></i>
                {{child.name}}
              </div>
              <i class="el-icon-more" @mouseenter="mouseenter(childIndex)" @mouseleave="mouseleave()"></i>
              <div class="cover" @mouseenter="mouseenter(childIndex)" @mouseleave="mouseleave()">
                <p class="cover_item" @click="del(child)">删除</p>
              </div>
            </div>
          </el-tooltip>
        </li>
      </ul>
    </div>
    <div class="right_r">
      <iframe ref="iframe" :src="src" width="100%" height="100%" frameborder="0" border="0" scrolling="atuo"></iframe>
    </div>
    <el-dialog title="提示" :visible.sync="dialogVisible" width="30%">
      <span>您确定删除{{tip}}吗?</span>
      <span slot="footer" class="dialog-footer">
        <el-button class="btn-confirm" type="primary" @click="confirm()">确 定</el-button>
        <el-button class="btn-cancel" @click="dialogVisible = false">取 消</el-button>
      </span>
    </el-dialog>

    <el-dialog class="common_dialog chart_add_dialog" title="添加数据视图" :visible.sync="addVisible">
      <form action onsubmit="return false">
        <el-input v-model="newName.text" class="new_name" type="text" placeholder="请输入视图名称"></el-input>
        <i class="required">*</i>
        <div class="tit">
          选择数据源
          <i class="required">*</i>
          <div class="search_box r">
            <i class="el-icon-search"></i>
            <input type="text" class="search_input" v-model="searchView">
          </div>
        </div>
        <el-tree class="dialog_content" :data="listFolders.list" :props="listFolders.defaultProps" @node-click="handleNodeClick" :filter-node-method="filterView" ref="viewTree"></el-tree>
      </form>

      <span slot="footer" class="dialog-footer">
        <el-button class="btn-confirm" type="primary" @click="addView()">确 定</el-button>
        <el-button class="btn-cancel" @click="addVisible = false">取 消</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import { getJson } from '../../router/utils';

export default {
  mounted() {
    // 挂载后
    let that = this;
    getJson('/dataview/list.do', {
      folder: ''
    }, function (res) {
      if (res.success) {
        for (let i = 0; i < res.data.length; i++) {
          res.data[i].show = true;
        }
        that.list = res.data;
        let params = that.$route.params;
        if (!params.viewId) {
          // 获取不到当前id时默认取第一个
          that.$router.replace({
            path: '/empty',
            query: { link: '/dataview/' + res.data[0].id }
          });
          return;
        }
        for (let i = 0; i < res.data.length; i++) {
          if (res.data[i].id == params.viewId) {
            getJson('/dataview/design/info.do', {
              view: params.viewId
            }, function (res) {
              if (res.success) {
                that.activeIndex = i;
                that.src = vars.src + '/data_editor/index.html?sourceId=' + res.data.datasourceId + '&view=' + params.viewId;
              }
            });
            break;
          }
        }
      }
    });

  },

  data: () => ({
    // 页面控制
    // 删除视图弹窗
    dialogVisible: false,
    // 添加数据视图弹窗
    addVisible: false,
    // 数据流
    list: [],
    src: vars.src + '/data_editor/index.html',
    tip: '',
    delId: '',
    hoverIndex: null,
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
    sqlId: '',
    activeIndex: null,
    newName: {
      text: ''
    },
    // 搜索用
    search: '',
    searchView: ''
  }),
  watch: {
    search: function (val) {
      for (let i = 0; i < this.list.length; i++) {
        if (this.list[i].name.indexOf(val) < 0) {
          this.list[i].show = false;
        } else {
          this.list[i].show = true;
        }
      }
    },
    searchView: function (val) {
      this.$refs.viewTree.filter(val);
    }
  },
  methods: {
    // 更换数据视图
    changeView(item, index) {
      this.openFullScreen(1);
      let that = this;
      getJson('/dataview/design/info.do', {
        view: item.id
      }, function (res) {
        if (res.success) {
          let src = vars.src + '/data_editor/index.html?sourceId=' + res.data.datasourceId + '&view=' + item.id;
          that.src = src;
          that.activeIndex = index;
          that.$router.replace({ path: '/dataview/' + item.id });
          that.$refs.iframe.onload = function () {
            that.openFullScreen(0);
          };
        }
      });
    },
    // 删除数据视图
    del(item) {
      this.delId = item.id;
      this.tip = item.name;
      this.dialogVisible = true;
    },
    // 确定删除
    confirm() {
      this.dialogVisible = false;
      let that = this;
      getJson('/dataview/design/delete.do', {
        view: that.delId
      }, function (res) {
        if (res.success) {
          getJson('/dataview/list.do', {
            folder: ''
          }, function (res) {
            if (res.success) {
              that.list = res.data;
              that.$message({
                message: '删除成功',
                type: 'success'
              });
            }
          });
        }
      });
    },
    mouseenter(index) {
      this.hoverIndex = index;
    },
    mouseleave() {
      this.hoverIndex = null;
    },
    // 新建数据视图
    addSouch() {
      let that = this;
      getJson('/datasource/list.do', {}, function (res) {
        if (res.success) {
          that.listFolders.list = res.data;
          that.addVisible = true;
        }
      });
    },
    // 添加数据视图
    addView() {
      let that = this;
      // let src='http://localhost:8080/src/data_editor/index.html?sourceId='+this.sqlId;
      // this.src=src;
      if (!this.newName.text) {
        that.$message({ message: '请输入视图名称', type: 'success' });
        return;
      }
      this.addVisible = false;

      let data = {
        id: '',
        name: this.newName.text,
        datasourceId: this.sqlId,
        structure: {
          filters: [],
          joins: [],
          orders: [],
          tables: []
        },
        layout: ''
      };
      getJson('/dataview/design/save.do', {
        folder: '',
        config: JSON.stringify(data)
      }, function (ress) {
        if (ress.success) {
          getJson('/dataview/list.do', {
            folder: ''
          }, function (res) {
            if (res.success) {
              that.list = res.data;
              that.$router.replace({ path: '/dataview/' + ress.data.id });
              let src = vars.src + '/data_editor/index.html?sourceId=' + that.sqlId + '&view=' + ress.data.id;
              that.src = src;
            }
          });
        }
      });
    },
    // 选择了哪个数据源
    handleNodeClick(data) {
      this.sqlId = data.id;
    },
    // loadding的全屏遮罩
    openFullScreen(e) {
      if (e) {
        this.$loading({
          customClass: 'dataview_loading'
        });
      } else {
        const loading = this.$loading({
          customClass: 'dataview_loading'
        });
        return loading.close();
      }
    },
    // 选择视图搜索
    filterView(value, data) {
      if (!value) return true;
      return data.name.indexOf(value) !== -1;
    }
  }
};
</script>
