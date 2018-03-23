<template>
  <div class="fix">
    <el-dropdown class="line_type" @command="lineStyleType">
      <span class="el-dropdown-link">
        <span class="font_family_menu">{{style.type}}</span>
        <i class="el-icon-arrow-down el-icon--right"></i>
      </span>
      <el-dropdown-menu slot="dropdown">
        <el-dropdown-item command="solid">solid</el-dropdown-item>
        <el-dropdown-item command="dashed">dashed</el-dropdown-item>
        <el-dropdown-item command="dotted">dotted</el-dropdown-item>
      </el-dropdown-menu>
    </el-dropdown>
    <el-dropdown class="line_width" @command="lineStyleWidth">
      <span class="el-dropdown-link">
        <span class="font_family_menu">
          {{style.width}}
        </span>
        <i class="el-icon-arrow-down el-icon--right"></i>
      </span>
      <el-dropdown-menu slot="dropdown">
        <el-dropdown-item command="1">1px</el-dropdown-item>
        <el-dropdown-item command="2">2px</el-dropdown-item>
        <el-dropdown-item command="3">3px</el-dropdown-item>
        <el-dropdown-item command="4">4px</el-dropdown-item>
        <el-dropdown-item command="5">5px</el-dropdown-item>
        <el-dropdown-item command="6">6px</el-dropdown-item>
        <el-dropdown-item command="8">8px</el-dropdown-item>
      </el-dropdown-menu>
    </el-dropdown>
    <div class="color_block ">
      <colorPicker :color.sync="style.color" ></colorPicker>
    </div>
  </div>
</template>
<script type="text/babel">

import colorPicker from './colorPicker.vue';

export default {
  components: {
    colorPicker
  },
  data: () => ({
    // 线条样式
    style: {
      color: '',
      type: '',
      width: ''
    }
  }),
  watch: {
    'style.color':{
      handler: function(val, oldval) {
        this.$emit('update:color', val);
      },
      deep: true
    },
    'style.type':{
      handler: function(val, oldval) {
        this.$emit('update:type', val);
      },
      deep: true
    },
    'style.width':{
      handler: function(val, oldval) {
        this.$emit('update:width', val);
      },
      deep: true
    },
    color: function(val, oldval) {
      this.style.color = val;
    },
    type: function(val, oldval) {
      this.style.type = val;
    },
    width: function(val, oldval) {
      this.style.width = val;
    }
  },
  methods: {
    // 线型
    lineStyleType(command) {
      this.style.type = command;
    },
    // 线宽
    lineStyleWidth(command) {
      this.style.width = command;
    }
  },
  props: ['color', 'type', 'width'],
  
};
</script>
<style scoped>
.el-dropdown,
.color_block {
  float: left;
}

.el-dropdown-menu {
  margin-top: -3px;
}
</style>
