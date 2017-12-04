<template>
  <chartBar v-if="type=='bar'" :option="option" :data="data" @getSeries="getOption"></chartBar>
  <div v-else-if="type=='bar2'">
    bar2bar2
  </div>
  <!-- TODO: 根据类型判断该显示哪个图标 -->
</template>

<script>
import chartBar from "../components/chartsComponents/chart-bar.vue";

export default {
  // TODO 动态加载组件，根据type，动态传参
  mounted() {
    // 挂载后
    let that = this;
    (() => Object.assign(that.seriesOption.option, that.option))();
    (() => Object.assign(that.seriesOption.data, that.data))();
  },
  data() {
    // 组件数据
    return {
      seriesOption: {
        //  样式配置
        option: {
          name: "name"
        },
        //  数据
        data: {}
      },
      type: "bar"
    };
  },
  watch: {},
  props: ["option", "data"],
  components: {
    chartBar
  },
  methods: {
    getOption(data) {
      this.$emit("submitOption", data);
    }
  }
};
</script>

<style>

</style>
