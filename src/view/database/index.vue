<template>
  <div id="databaseList" class="full">
    <div id="database">
      <div  class="database_left full">
        <div class=" dirTreeTitle">
          数据源
          <i class="el-icon-more r"></i>
          <i class="el-icon-plus r" @click="onAddSourceClick"></i>
          <div class="search_box r" :class="{hover:search.length}">
            <i class="el-icon-search"></i>
            <input type="text" v-model="search" class="search_input">
          </div>
        </div>
        <ul class="database_list ">
          <li v-for="(item,index) in list" :key="index" v-if="item.show" :class="{hover:hoverIndex == index,active:item.active}">
            <!-- <router-link :to="{path:'/chart_editor/'+item.id}"> -->
            <span class="database_name" @click="itemSelect(item.id)">{{item.name}}</span>
            <i class="el-icon-more" @mouseenter="mouseenter(index)" @mouseleave="mouseleave()" ></i>
            <div class="cover" @mouseenter="mouseenter(index)" @mouseleave="mouseleave()" >
              <a v-if="item.dir!=1" href="javascript:;" @click="onEditClick(item.id)">修改</a>
              <a href="javascript:;" @click="onCreateSourceClick(item.id,item.name)">删除</a>
            </div>
          </li>
        </ul>
      </div>
      <div class="grid-content database_right">
        <div class="top common_top fix">
          <el-popover width="100" trigger="click" >
            <div class="menu_popover">
              <div class="menu_item" @click="toggleShare(false)">共享</div>
              <!-- <div class="menu_item">删除</div> -->
            </div>
            <a slot="reference" href="javascript:;" class="top_btn menu"></a>
          </el-popover>
          <a href="javascript:;" class="top_btn database_save" @click="save">保存修改</a>
        </div>
        <div class="database_main">
          <table>
            <thead>
                <tr v-if="!canNotEdit">
                  <el-popover  v-for="(item,index) in dataList.title" :key="index" width="280" trigger="hover">
                    <div class="pop_content">
                      <div class="pop_item pop_type fix">
                        <label>类型</label> 
                        <a href="javascript:;" :class="{active: 'date'== dataList.title[index].type }" @click="typeChange(index,'date')"><i class="bdfont bdfont-rili" ></i>日期</a>
                        <a href="javascript:;" :class="{active: 'string'== dataList.title[index].type }" @click="typeChange(index,'string')"><i class="bdfont bdfont-string"></i>文本</a>
                        <a href="javascript:;" :class="{active: 'number'== dataList.title[index].type }" @click="typeChange(index,'number')"><i class="bdfont bdfont-number"></i>数字</a>
                      </div>
                      <div class="pop_item pop_name fix">
                        <label>别名</label> 
                        <input type="text" v-model="otherName">
                      </div>
                      <div class="btn_group">
                        <el-button type="button" size="mini">取消</el-button>
                        <el-button type="primary" size="mini" @click='saveTypeChange(index)'>确定</el-button>
                      </div>
                    </div>
                    <th slot="reference">
                      <i class="bdfont bdfont-string" v-show="'string'== dataList.title[index].type"></i>
                      <i class="bdfont bdfont-rili" v-show="'date'== dataList.title[index].type"></i>
                      <i class="bdfont bdfont-number" v-show="'number'== dataList.title[index].type"></i>
                      {{dataList.title[index].content | getTitle}} <i class="edit bdfont bdfont-bianji"></i></th>
                  </el-popover>
                </tr>
                <tr v-else>
                  <th v-for="(item,index) in dataList.title" :key="index">
                    <i class="bdfont bdfont-string" v-show="'string'== dataList.title[index].type"></i>
                    <i class="bdfont bdfont-rili" v-show="'date'== dataList.title[index].type"></i>
                    <i class="bdfont bdfont-number" v-show="'number'== dataList.title[index].type"></i>
                    {{dataList.title[index].content | getTitle}}</th>
                </tr>
            </thead>
            <tbody>
              <tr v-for="(item,i) in dataList.data" :key="i">
                <td v-for="(titem,k) in dataList.title" :key="k">
                  <span v-for="(key,j) in item" :key="j" v-if="j==titem.content">{{key}}</span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
    <!--选择共享人弹出框-->
    <el-dialog title="选择共享人" class="share_dialog" :visible.sync="shareVisible">
      <input type="text" class="shareInput" v-model="shareUser" placeholder="请输入共享人的用户名或手机号">
      <span slot="footer" class="dialog-footer">
        <el-button class="btn-confirm" type="primary" @click="toggleShare(true)">确 定</el-button>
        <el-button class="btn-cancel" @click="toggleShare(false)">取 消</el-button>
      </span>
    </el-dialog>
    <el-dialog title="提示" :visible.sync="dialogVisible" width="30%">
      <span>您确定删除{{tip}}吗?</span>
      <span slot="footer" class="dialog-footer">
        <el-button class="btn-confirm" type="primary" @click="confirm()">确 定</el-button>
        <el-button class="btn-cancel" @click="dialogVisible = false">取 消</el-button>
      </span>
    </el-dialog>
    <dataSourceDialog @changeDialogFormVisible="changeFatherDialogFormVisible" v-if="dialogFormVisible" :form="form"></dataSourceDialog>
  </div>
</template>
<script>
import { getJson } from '../../router/utils';
import dataSourceDialog from '../../components/dataSource/dataSourceDialog.vue';
export default {
  components: {
    dataSourceDialog
  },
  mounted() {
    this.updateList();
    window.vm = this;
    let params = this.$route.params;
    this.databaseId =  params.viewId;
  },
  destroyed() {
    // 销毁后
    window.vm = null;
  },
  data: () => ({
    // 页面控制
    //显示隐藏dataSourceDialog组件
    dialogFormVisible: false,
    shareVisible: false,
    // 数据流
    //是否可保存
    pageName: '数据源添加',
    // 数据源列表
    list: [],
    pageType: 'index',
    form: {},
    formLabelWidth: '120px',
    hoverIndex: null,
    search: '',
    // 共享人
    shareUser: '',
    databaseId:null,
    // 上传的Excel中为sheet，目前只取1个sheet
    dataList:[],
    // 别名
    otherName:'',
    // 更改类型
    selectType:'',
    dialogVisible:false,
    tip:'',
    delId:'',
    // 是否允许编辑数据 
    canNotEdit:false
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
    }
  },
  methods: {
    updateList() {
      let that = this,
        params = that.$route.params;
      getJson('/datasource/list.do', {}, function (res) {
        if (res.success) {
          for (let i = 0; i < res.data.length; i++) {
            res.data[i].show = true;
          }
          that.list = res.data;
          for (let i = 0; i < that.list.length; i++) {
            that.list[i].active = false;
            if (that.list[i].id == params.viewId) {
              // TODO: 取数据源数据，渲染右侧
              that.list[i].active = true;
              that.canNotEdit = true;              
              if(that.list[i].dataFrom!=1 && that.list[i].dataFrom!=null){
                that.canNotEdit = false;
              }
              if(that.list[i].dir==1){
              // Excel,第一次可以编辑，数据库不可以编辑
                if(!that.canNotEdit){
                  getJson('/datasource/getDemoData.do', {
                    datasourceId:params.viewId
                  }, function (res) {
                    if (res.success) {
                      if(res.data.dataList.length){
                      // 只取第一个sheet
                      // 先对title做处理
                        let title = res.data.dataList[0].title||[];
                        for(let i=0;i<title.length;i++){
                          title[i].type = title[i].content.split('@')[1].toLowerCase();
                        }
                        that.dataList = res.data.dataList[0];
                      }
                    }
                  });
                }else{
                  getJson('/datasource/getData.do', {
                    datasourceId:params.viewId
                  }, function (res) {
                    if (res.success) {
                      if(res.data.dataList.length){
                      // 只取第一个sheet
                      // 先对title做处理
                        let title = res.data.dataList[0].title||[];
                        for(let i=0;i<title.length;i++){
                          if(title[i].content){
                            title[i].type = title[i].content.split('@')[1].toLowerCase();
                          }
                        }
                        that.dataList = res.data.dataList[0];
                      }
                    }
                  });
                }
              }
            }
          }
        } else {
          that.$message({ message: res.errorMessage || '系统错误', type: 'warning' });
        }
      });
    },
    // 添加数据源
    onAddSourceClick() {
      this.$router.push('/databaseAdd');
    },
    onCreateSourceClick(id,name) {
      this.tip=name;
      this.dialogVisible=true;
      this.delId=id;
    },
    confirm(){
      let that=this;
      getJson('/datasource/delete.do',{
        source:that.delId
      },function(res){
        if(res.success){
          that.list=[];
          // that.updateList();
          that.dialogVisible = false;
          that.$message({ message: '删除成功', type: 'warning' });
          that.$router.push({
            path: '/empty',
            query: { link: '/database' }
          });
        }else{
          that.$message({ message: res.errorMessage || '系统错误', type: 'warning' });
        }
      });
    },
    // 编辑数据源
    onEditClick(paramId) {
      let that = this;
      getJson(
        '/datasource/info.do',
        {
          datasource: paramId
        },
        function (res) {
          if (res.success) {
            that.form = res.data;
            that.form.loginTimeout = res.data.loginTimeout ? res.data.loginTimeout : 10000;
            that.form.queryTimeout = res.data.queryTimeout ? res.data.queryTimeout : 30000;
            that.dialogFormVisible = true;
          } else {
            that.$message({ message: res.errorMessage || '系统错误', type: 'warning' });
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
    },
    // 共享弹窗
    toggleShare(flag) {
      if (flag) {
        // 
        let that = this;
        if(!that.databaseId){
          that.$message({ message: '请选择一个数据视图', type: 'warning' });
          return;
        }
        if(!that.shareUser){
          that.$message({ message: '请输入分享人', type: 'warning' });
          return;
        }
        getJson('/saveUserAuth.do', {
          bussiType: 'Datasource',
          bussiId: that.databaseId,
          authUserName: that.shareUser
        }, function (res) {
          if (res.success) {
            that.$message({ message: '共享成功', type: 'success' });
          } else {
            that.$message({ message: res.errorMessage || '系统错误', type: 'warning' });
          }
        });
      }
      this.shareVisible = !this.shareVisible;
    },
    itemSelect(id){
      if (id != this.databaseId) {
        this.$router.push({
          path: '/empty',
          query: { link: '/database/' + id }
        });
      }
    },
    typeChange(index,type){
      let that = this;
      that.selectType = type ;
      that.dataList.title[index].type=that.selectType;
    },
    saveTypeChange(index){
      let that = this;
      that.dataList.title[index].type=that.selectType || that.dataList.title[index].type ||that.dataList.title[index].content.split('@')[1];
      that.dataList.title[index].otherName=that.otherName || that.dataList.title[index].content.split('@')[0];
      
      let key = that.dataList.title[index].content,
        newKey = that.dataList.title[index].otherName+'@'+that.dataList.title[index].type;
      // 处理data
      for(let i=0;i<that.dataList.data.length;i++){
        let val = that.dataList.data[i][key];
        for(let j in that.dataList.data[i]){
          if(j==key){
            delete that.dataList.data[i][j];
          }
        }
        that.dataList.data[i][newKey]=val;
      }
      console.log(that.dataList.data);
      that.dataList.title[index].content=newKey;
    },
    save(){
      let that = this;
      let title=[];
      if(that.canNotEdit){
        that.$message({ message: '当前数据源不允许编辑', type: 'warning' });
        return false;
      }
      // 只有1个sheet
      let val={
        name:that.dataList.name,
        index:0,
        title:[]
      };
      for(let i=0;i<that.dataList.title.length;i++){
        val.title.push({
          content:that.dataList.title[i].content
        });
      }
      title.push(val);
      getJson('/datasource/saveXls.do', {
        datasourceId: that.databaseId,
        title:JSON.stringify(title)
      }, function (data) {
        if(data.success){
          that.$message({ message: '保存成功', type: 'success' });
        }else{
          that.$message({ message: res.errorMessage || '系统错误', type: 'warning' });
        }

      });

    }
  },
  filters: {
    getTitle: function (value) {
      if (!value) return '';
      value = value.toString();
      return value.split('@')[0];
    },
    getType: function (value) {
      if (!value) return '';
      value = value.toString();
      return value.split('@')[1];
    }
  }
};
</script>
<style>
.database_list li {
  line-height: 26px;
}
</style>