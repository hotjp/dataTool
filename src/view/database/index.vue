<template>
  <div id="databaseList" class="full">
    <div id="database">
      <div  class="database_left full">
        <div class=" dirTreeTitle">
          数据源
          <i class="el-icon-more r"></i>
          <i class="el-icon-plus r" @click="onAddSourceClick"></i>
          <div class="search_box r">
            <i class="el-icon-search"></i>
            <input type="text" v-model="search" class="search_input">
          </div>

        </div>
        
        <ul class="database_list ">
          <li v-for="(item,index) in list" :key="index" v-if="item.show" :class="{hover:hoverIndex == index}">
            <!-- <router-link :to="{path:'/chart_editor/'+item.id}"> -->
            <span class="database_name">{{item.name}}</span>
            <i class="el-icon-more" @mouseenter="mouseenter(index)" @mouseleave="mouseleave()" ></i>
            <div class="cover" @mouseenter="mouseenter(index)" @mouseleave="mouseleave()" >
              <a href="javascript:;" @click="onEditClick(item.id)">修改</a>
              <a href="javascript:;" @click="onCreateSourceClick(item.id)">创建</a>
            </div>
          </li>
        </ul>
      </div>
      <div class="grid-content database_right">
        <div class="top common_top fix">
          <a href="javascript:;" class="top_btn menu" @click=""></a>          
          <a href="javascript:;" class="top_btn database_save" @click="">保存修改</a>
        </div>

      </div>
    </div>

    <dataSourceDialog @changeDialogFormVisible="changeFatherDialogFormVisible" v-if="dialogFormVisible" :form="form"></dataSourceDialog>
  </div>
</template>
<script>
import { getJson } from "../../router/utils";
import dataSourceDialog from "../../components/dataSource/dataSourceDialog.vue";
export default {
  components: {
    dataSourceDialog
  },
  mounted() {
    this.updateList();
    window.vm = this;
  },
  destroyed() {
    // 销毁后
    window.vm = null;
  },
  data: () => ({
    // 页面控制
    //显示隐藏dataSourceDialog组件
    dialogFormVisible: false,
    // 数据流
    //是否可保存
    pageName: "数据源添加",
    // 数据源列表
    list: [],
    pageType: "index",
    form: {},
    formLabelWidth: "120px",
    hoverIndex: null,
    search:''
  }),
  watch:{
     search:function(val){
      for(let i=0;i<this.list.length;i++){
        if(this.list[i].name.indexOf(val)<0){
          this.list[i].show=false;
        }else{
          this.list[i].show=true;          
        }
      }    
    }
  },
  methods: {
    updateList() {
      let that = this;
      getJson("/datasource/list.do", {}, function(res) {
        if (res.success) {
          for(let i=0;i<res.data.length;i++){
            res.data[i].show = true
          }
          that.list = res.data;
        }
      });
    },
    // 添加数据源
    onAddSourceClick() {
      this.$router.push("/database/add");
    },
    onCreateSourceClick(id) {
      // TODO: 链接不对
      // this.$router.push("/database/creatView/" + id);
    },
    // 编辑数据源
    onEditClick(paramId) {
      let that = this;
      getJson(
        "/datasource/info.do",
        {
          datasource: paramId
        },
        function(res) {
          if (res.success) {
            that.form = res.data;
            that.dialogFormVisible = true;
          }
        }
      );
    },
    //显示隐藏dataSourceDialog组件
    changeFatherDialogFormVisible(value) {
      this.dialogFormVisible = value;
    },
    // 鼠标事件 hover
    mouseenter(index) {
      this.hoverIndex = index;
    },
    // 鼠标事件 hover
    mouseleave() {
      this.hoverIndex = null;
    }
  }
};
</script>
<style>
.database_list li {
  line-height: 26px;
}
</style>