<template>
  <div class="fix">
    <el-dropdown @command="linefontFamily">
      <span class="el-dropdown-link">
        <span class="font_family_menu">{{fontFamily}}</span>
        <i class="el-icon-arrow-down el-icon--right"></i>
      </span>
      <el-dropdown-menu slot="dropdown">
        <el-dropdown-item command="sans-serif">sans-serif</el-dropdown-item>
        <el-dropdown-item command="serif">serif</el-dropdown-item>
        <el-dropdown-item command="monospace">monospace</el-dropdown-item>
        <el-dropdown-item command="Arial">Arial</el-dropdown-item>
        <el-dropdown-item command="Courier New">Courier New</el-dropdown-item>
        <el-dropdown-item command="Microsoft YaHei">Microsoft YaHei</el-dropdown-item>
      </el-dropdown-menu>
    </el-dropdown>
    <el-dropdown @command="linefontSize">
      <span class="el-dropdown-link">
        <span class="font_family_menu">
          {{fontSize}}
        </span>
        <i class="el-icon-arrow-down el-icon--right"></i>
      </span>
      <el-dropdown-menu slot="dropdown">
        <el-dropdown-item command="10">10px</el-dropdown-item>
        <el-dropdown-item command="11">11px</el-dropdown-item>
        <el-dropdown-item command="12">12px</el-dropdown-item>
        <el-dropdown-item command="13">13px</el-dropdown-item>
        <el-dropdown-item command="14">14px</el-dropdown-item>
        <el-dropdown-item command="15">15px</el-dropdown-item>
        <el-dropdown-item command="16">16px</el-dropdown-item>
        <el-dropdown-item command="18">18px</el-dropdown-item>
        <el-dropdown-item command="20">20px</el-dropdown-item>
        <el-dropdown-item command="24">24px</el-dropdown-item>
        <el-dropdown-item command="32">32px</el-dropdown-item>
        <el-dropdown-item command="36">36px</el-dropdown-item>
        <el-dropdown-item command="48">48px</el-dropdown-item>
        <el-dropdown-item command="64">64px</el-dropdown-item>
      </el-dropdown-menu>
    </el-dropdown>
    <div class="color_block ">
      <colorPicker :color.sync="style.color" ></colorPicker>
    </div>
  </div>
</template>
<script type="text/babel">
// 引入颜色选择器组件
import colorPicker from './colorPicker.vue';

export default {
  data: () => ({
    // 字体样式
    style: {
      color: '',
      fontFamily: '',
      fontSize: ''
    }
  }),
  components: {
    colorPicker
  },
  props: ['color', 'fontFamily', 'fontSize'],
  methods: {
    // 字体
    linefontFamily(command) {
      this.style.fontFamily = command;
    },
    // 字号
    linefontSize(command) {
      this.style.fontSize = command;
    }
  },
  watch: {
    'style.color':{
      handler: function(val, oldval) {
        this.$emit('update:color', val);
      },
      deep: true
    },
    'style.fontFamily':{
      handler: function(val, oldval) {
        this.$emit('update:fontFamily', val);
      },
      deep: true
    },
    'style.fontSize':{
      handler: function(val, oldval) {
        this.$emit('update:fontSize', val);
      },
      deep: true
    },

    color: function(val, oldval) {
      this.style.color = val;
    },
    fontFamily: function(val, oldval) {
      this.style.fontFamily = val;
    },
    fontSize: function(val, oldval) {
      this.style.fontSize = val;
    }
  }
};
</script>
<style scoped>
.el-dropdown,
.color_block {
  float: left;
  height: 24px;
  line-height: 24px;
}
.el-dropdown-item {
  height: 24px;
  line-height: 24px;
}
.el-dropdown {
  margin-right: 10px;
}
.el-dropdown-menu {
  margin-top: -3px;
}
</style>
