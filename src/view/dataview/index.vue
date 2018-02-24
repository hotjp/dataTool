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
      <!-- <i class="el-icon-more r"></i> -->
      <i class="el-icon-plus r" @click="addSouch()" ></i>
      <!-- TODO: 搜索 -->
      <!-- <i class="el-icon-search r"></i> -->
    </div>

    <ul>
      <li class="dirChildren" :class="{active:childIndex == activeIndex,hover:hoverIndex == childIndex}" v-for="(child,childIndex) in list" :key="childIndex">
        <el-tooltip class="item" effect="light" disabled :content="'数据源名称：'+child.sourceType.name" placement="right">
          <div>
            <div class="childrenText" @click="changeView(child,childIndex)">
              <i class="el-icon-document"></i>
              {{child.name}}
            </div>
            <i class="el-icon-more" @mouseenter="mouseenter(childIndex)" @mouseleave="mouseleave()" ></i>
            <div class="cover" @mouseenter="mouseenter(childIndex)" @mouseleave="mouseleave()" >
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
    <el-button @click="dialogVisible = false">取 消</el-button>
    <el-button type="primary" @click="confirm()">确 定</el-button>
  </span>
</el-dialog>
<el-dialog title="新建数据视图(输入视图名称并选择数据源)" :visible.sync="addVisible" width="30%"><form action onsubmit="return false">数据视图名称:<input v-model="newName.text" class="new_name" type="text" placeholder="请输入数据视图名称">
  <el-tree :data="listFolders.list" :props="listFolders.defaultProps"   @node-click="handleNodeClick"></el-tree>
  <span slot="footer" class="dialog-footer">
    <el-button @click="addVisible = false">取 消</el-button>
    <el-button type="primary" @click="addView()">确 定</el-button>
  </span>
  </form>
</el-dialog>
</div>
</template>
<script>
import { getJson } from '../../router/utils';
export default {
  beforeCreate() {
    // 组件创建前
  },
  created() {
    // 组件创建后

  },
  beforeMount() {
    // 挂载前
  },
  mounted() {
    // 挂载后
    let that=this;
    getJson('/dataview/list.do',{
      folder:''
    },function(res){
      if (res.success) {
        that.list=res.data;
        let params = that.$route.params;
        for(let i=0;i<res.data.length;i++){
          if(res.data[i].id==params.viewId){
            getJson('/dataview/design/info.do',{
              view:params.viewId
            },function(res){
              if (res.success) {
                that.src='http://localhost:8080/src/data_editor/index.html?sourceId='+res.data.datasourceId+'&view='+params.viewId;
              }
            });
            break;
          }
        }
      }
    });
    
  },
  beforeUpdate() {
    // 数据更新前
  },
  updated() {
    // 数据更新后
  },
  beforeDestroy() {
    // 销毁前
  },
  destroyed() {
    // 销毁后
  },
  data: () => ({
    list:[],
    src:'http://localhost:8080/src/data_editor/index.html',
    dialogVisible:false,
    tip:'',
    delId:'',
    hoverIndex:null,
    addVisible:false,
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
    sqlId:'',
    activeIndex:null,
    newName:{
      text:''
    }
  }),
  computed: {

  },
  watch: {
  },
  methods: {
    // 更换数据视图
    changeView(item,index){
      this.openFullScreen(1);
      let that=this;
      getJson('/dataview/design/info.do',{
        view:item.id
      },function(res){
        if (res.success) {
          let src='http://localhost:8080/src/data_editor/index.html?sourceId='+res.data.datasourceId+'&view='+item.id;
          that.src=src;
          that.activeIndex=index;
          that.$router.replace({path: '/dataview/'+item.id});
          that.$refs.iframe.onload=function(){
            that.openFullScreen(0);
          };
        }
      });
    },
    // 删除数据视图
    del(item){
      this.delId=item.id;
      this.tip=item.name;
      this.dialogVisible=true;
    },
    // 确定删除
    confirm(){
      this.dialogVisible=false;
      let that=this;
      getJson('/dataview/design/delete.do',{
        view:that.delId
      },function(res){
        if (res.success) {
          getJson('/dataview/list.do',{
            folder:''
          },function(res){
            if (res.success) {
              that.list=res.data;
              that.$message({
                message: '删除成功',
                type: 'success'
              });
            }
          });
        }
      });
    },
    mouseenter(index){
      this.hoverIndex = index;
    },
    mouseleave(){
      this.hoverIndex = null;
    },
    // 新建数据视图
    addSouch(){
      let that = this;
      getJson('/datasource/list.do',{},function(res){
        if (res.success) {
          that.listFolders.list = res.data;
          that.addVisible=true;
        }
      });
    },
    // 添加数据视图
    addView(){
      let that=this;
      this.addVisible=false;
      // let src='http://localhost:8080/src/data_editor/index.html?sourceId='+this.sqlId;
      // this.src=src;
      let data={
        id:'',
        name:this.newName.text,
        datasourceId:this.sqlId,
        structure:{
          filters:[],
          joins:[],
          orders:[],
          tables:[]
        },
        layout:''
      };
      getJson('/dataview/design/save.do',{
        folder:'',
        config:JSON.stringify(data)
      },function(ress){
        if(ress.success){
          getJson('/dataview/list.do',{
            folder:''
          },function(res){
            if (res.success) {
              that.list=res.data;
              that.$router.replace({path: '/dataview/'+ress.data.id});
              let src='http://localhost:8080/src/data_editor/index.html?sourceId='+that.sqlId+'&view='+ress.data.id;
              that.src=src;
            }
          });
        }
      });
    },
    // 选择了哪个数据源
    handleNodeClick(data){
      this.sqlId=data.id;
    },
    // loadding的全屏遮罩
    openFullScreen(e) {
      if(e){
        this.$loading({
          customClass:'dataview_loading'
        });
      }else{
        const loading = this.$loading({
          customClass:'dataview_loading'
        });
        return loading.close();
      }
    }
  }
};
</script>

<style scoped>
.data_view .left{
  position: absolute;
  top:64px;
  left: 0;
  bottom:0;
  width:220px;
  background: #f0f2f3;
  overflow-x: hidden;
  overflow-y: auto;
}
.data_view .right_r{
  position: absolute;
  top:64px;
  left: 220px;
  right: 0;
  bottom:0;
  overflow: hidden;
}
/* .data_view .right_r iframe{ */
  /* width:100%;
  height:100%; */
/* } */
/* .list{
  position: relative;
  width: 100%;
  height: 32px;
  line-height: 32px;
  padding-left: 20px;
  cursor: pointer;
  font-size: 12px;
  position: relative;
}
.list:hover{
  cursor: pointer;
  background: #fff;
}
.del{
  position: absolute;
  top:0;
  right:10px;
} */
/*滚动条垂直方向的宽度*/

::-webkit-scrollbar {
    width: 10px;
}


/* 垂直滚动条的滑动块 */

::-webkit-scrollbar-thumb:vertical {
    border-radius: 4px;
    -webkit-box-shadow: inset 0 0 6px rgba(188, 176, 241, 0.3);
    background-color: rgba(189, 183, 247, 0.281);
}
.dirChildren{
    width: 100%;
    height: 32px;
    line-height: 32px;
    padding-left: 20px;
    cursor: pointer;
    font-size: 12px;
    position: relative;
}
.dirChildren.active{
  background: #e0e0e0;
}
.childrenText{
    width: 80%;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    float: left;
}
.dirChildren .el-icon-more{
    display: none;
    position: relative;
    top: 0px;
    padding: 3px;
}
.dirChildren .cover{
    display: none;
    width: 50px;
    background-color: #ffffff;
    position: absolute;
    right: 25px;
    top: 25px;
    text-align: center;
    z-index: 10;
    cursor: default;
}
.dirChildren .cover .cover_item{
    line-height: 24px;
    margin: 5px 0;
    cursor: pointer;
}
.dirChildren.hover .cover{
  display: block;
}
.dirChildren:hover .el-icon-more {
  display: inline-block;
}
.dirTreeTitle{
    padding-left: 16px;
    line-height: 48px;
    height: 48px;
    font-size: 14px;
}
.dirTreeTitle .el-icon-more,.dirTreeTitle .el-icon-plus{
    margin-top: 18px;
    margin-right: 5px;
    cursor: pointer;
}
.el-dialog__body{
  padding-top:10px;
}
.data_view .workTableDialog .el-dialog__header{
  padding-top: 10px;
  text-align: left;
}


</style>
