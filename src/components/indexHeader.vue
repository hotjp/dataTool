<template>
  <div id="indexHeader" class="fix">
    <a @click="onClickChangeTitleType(1)" href="javascript:;" :class="{head_title:true,l:true,active:(titleType == 1)}">仪表盘</a>
    <a @click="onClickChangeTitleType(2)" href="javascript:;" :class="{head_title:true,l:true,active:(titleType == 2)}">数据视图</a>
    <a @click="onClickChangeTitleType(3)" href="javascript:;" :class="{head_title:true,l:true,active:(titleType == 3)}">数据源</a>
  </div>
</template>
<script>
export default {

  mounted() {
  },
  data: function () {
    return {
      titleType: 1
    };
  },
  methods: {
    onClickChangeTitleType: function (type) {
      this.titleType = type;
      if (type == 1) {
        this.$router.push({ path: '/' });
      } else if (type == 2) {
        this.$router.push({ path: '/dataview' });
      } else if (type == 3) {
        this.$router.push({ path: '/database' });
      }
    }
  }
};
</script>
