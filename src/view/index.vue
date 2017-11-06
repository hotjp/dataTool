<template>
  <div id="index">
    <ul v-for="item in arr">
      <li><input type="text" :value="item.name" @change="trigger"></li>
    </ul>
    <el-button @click.native="startHacking">Yes!</el-button>
  </div>
</template>

<script>
export default {
  mounted() {
    var inputs = this.$el.getElementsByTagName("input");
    var evt = document.createEvent("HTMLEvents");
    evt.initEvent('change', true, true);
    for (var i = 0; i < inputs.length; i++) {
      inputs[i].dispatchEvent(evt);
    }
  },
  data() {
    return {
      arr: [{ name: "1111ssssssssss1111111111111111111111" }]
    };
  },
  methods: {
    trigger() {
      var el = event.target;
      autoGrow(el);
    }
  }
};
function autoGrow(el) {
  if (el.scrollWidth > el.clientWidth) {
    el.style.width = el.scrollWidth + "px";
  }
}
</script>

<style>
#app {
  font-family: Helvetica, sans-serif;
  text-align: center;
}
</style>
