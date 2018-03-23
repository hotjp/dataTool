<template>
  <div id="datebaseAdd" class="full">
    <el-row id="addDataList">
      <el-col :span="18" :offset="3">
        <div class="grid-content">
          <div class="input_wrap">
            <form action onsubmit="return false">
              <el-input placeholder="请输入想要接入的数据源" prefix-icon="el-icon-search" v-model="search"></el-input>
            </form>
          </div>
          <el-row  class="database_list" :gutter="20">
            <el-col :span="6" v-for="(item,index) in list" :key="index" v-if="item.show">
              <div class="database_item rect-100">
                <!-- <router-link :to="{path:'/chart_editor/'+item.id}"> -->
                <img :src="vars.src+item.img" alt="">
                {{item.name}}
                <a href="javascript:;" class="_full" @click="addDataSource(item.type,item.name)"></a>
                <!-- </router-link> -->
              </div>
            </el-col>
          </el-row>
        </div>
      </el-col>
    </el-row>
    <el-dialog title="上传excel文件" :visible.sync="dialogUploadVisible" width="30%">
      <el-upload class="upload-demo" action="https://jsonplaceholder.typicode.com/posts/" :on-preview="handlePreview" :on-remove="handleRemove" multiple :limit="3" :on-exceed="handleExceed" :file-list="fileList">
        <el-button size="small" type="primary">点击上传</el-button>
        <!--<div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div>-->
      </el-upload>
      <span slot="footer" class="dialog-footer">
        <el-button class="btn-confirm" type="primary">确 定</el-button>
      </span>
    </el-dialog>

    <dataSourceDialog @changeDialogFormVisible="changeFatherDialogFormVisible" v-if="dialogFormVisible" :form="form"></dataSourceDialog>

  </div>
</template>
<script>
import vars from "../../assets/js/vars";
import dataSourceDialog from "../../components/dataSource/dataSourceDialog.vue";
import dataSourceList from "../../vendor/dataSourceList.json";
export default {
  components: {
    dataSourceDialog
  },
  mounted() {
    for(let i=0;i<dataSourceList.length;i++){
      dataSourceList[i].show = true
    }
    this.list = dataSourceList;
  },
  data: () => ({
    vars: vars,
    fileList: [],
    dialogFormVisible: false,
    pageName: "数据源添加",
    // 数据源列表
    list: [],
    pageType: "",
    dialogUploadVisible: false,
    form: {},
    formLabelWidth: "120px",
    // 搜索
    search: ""
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
    onAddSourceClick() {
      this.dialogFormVisible = true;
    },
    addDataSource(type, name) {
      this.pageType = type;
      this.form.dbType = name;
      if (type === "form") {
        this.dialogFormVisible = true;
      } else if (type === "upload") {
        this.dialogUploadVisible = true;
      }
    },
    changeFatherDialogFormVisible(value) {
      this.dialogFormVisible = value;
    },
    handleRemove(file, fileList) {
      console.log(file, fileList);
    },
    handlePreview(file) {
      console.log(file);
    },
    handleExceed(files, fileList) {
      this.$message.warning(
        `当前限制选择 3 个文件，本次选择了 ${
          files.length
        } 个文件，共选择了 ${files.length + fileList.length} 个文件`
      );
    }
  }
};
</script>