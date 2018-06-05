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
    <el-dialog class="upload_dialog" title="上传excel文件" :visible.sync="dialogUploadVisible">
      <!-- TODO: 上传 -->
      <el-upload class="upload-demo" :action="vars.api+'/datasource/addFile.do'" :on-success="uploadSuccess" ref="upload" :with-credentials="true" :auto-upload="false" name="fileUpload" :on-preview="handlePreview" :on-remove="handleRemove" multiple :limit="1" :on-exceed="handleExceed" :file-list="fileList" accept=".xls,.xlsx,.csv">
        <el-button size="small" type="primary">点击上传</el-button>
        <span slot="tip" class="upload_tip">点击<b>选择文件</b>选择上传文件</span>
        <div slot="tip" class="el-upload__tip">
          <div class="temp">
            <table>
              <tr>
                <th>日期@Date</th>
                <th>城市@String</th>
                <th>数量@Number</th>
              </tr>
              <tr>
                <td>2020-05-21</td>
                <td>烟台</td>
                <td>10</td>
              </tr>
              <tr>
                <td>2020-05-21</td>
                <td>烟台</td>
                <td>10</td>
              </tr>
              <tr>
                <td>2020-05-21</td>
                <td>烟台</td>
                <td>10</td>
              </tr>
              
            </table>
            <div class="download_wrap">
              <a target="_blank" :href="vars.src+'/assest/Maxtest.xls'" download="Maxtest.xls" >点击下载示例模板</a>
            </div>
          </div>
          <div class="info">
          *文件第一行为表头，每个列头的格式为“名称”+ “@” +“类型”，类型共有 Date、 String、 Number 三种分别代表日期、文本 和数字。</div>
          </div>
      </el-upload>
      <span slot="footer" class="dialog-footer">
        <el-button class="btn-confirm" type="primary" @click="submitUpload">确 定</el-button>
        <el-button class="btn-cancel" @click="uploadCancle">取 消</el-button>
      </span>
    </el-dialog>

    <dataSourceDialog @changeDialogFormVisible="changeFatherDialogFormVisible" v-if="dialogFormVisible" :form="form"></dataSourceDialog>

  </div>
</template>
<script>
import dataSourceDialog from '../../components/dataSource/dataSourceDialog.vue';
import dataSourceList from '../../vendor/dataSourceList.json';
export default {
  components: {
    dataSourceDialog
  },
  mounted() {
    for(let i=0;i<dataSourceList.length;i++){
      dataSourceList[i].show = true;
    }
    this.list = dataSourceList;
  },
  data: () => ({
    // 页面控制
    //显示隐藏dataSourceDialog组件
    dialogFormVisible: false,
    // 上传文件弹窗
    dialogUploadVisible: false,
    // 数据流
    vars: vars,
    fileList: [],
    pageName: '数据源添加',
    // 数据源列表
    list: [],
    pageType: '',
    form: {},
    formLabelWidth: '120px',
    // 搜索
    search: ''
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
      this.form={};
      this.form.dbType = name;
      this.form.loginTimeout = 10000;
      this.form.queryTimeout = 30000;

      if (type === 'form') {
        this.dialogFormVisible = true;
      } else if (type === 'upload') {
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
        `当前限制选择 1 个文件，本次选择了 ${files.length} 个文件，共选择了 ${files.length + fileList.length} 个文件`
      );
    },
    uploadCancle(){
      this.dialogUploadVisible = false;
    },
    submitUpload() {
      this.$refs.upload.submit();
    },
    // 上传成功
    uploadSuccess(response, file, fileList){
      console.log(response);
      if(response.success){
        this.dialogUploadVisible = false;
        this.$message({ message: '上传成功', type: 'success' });
        this.$refs.upload.clearFiles();
        this.$router.push({
          path: '/empty',
          query: { link: '/database/' + response.data.datasource.id }
        });
      }else{
        this.$message({ message: response.errorMessage||'上传失败', type: 'warning' });
        
      }
      
    }
  }
};
</script>