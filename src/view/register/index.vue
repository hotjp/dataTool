<template id="register">
</template>
<script>
export default {
  mounted() {
    let query = this.$route.query;
    // console.log(query.link)
    if(query.link){
      this.$router.replace({ path: query.link });
    }else{
      // 返回上一页
      this.$route.go(-1);
    }
  },
  data() {
    return {};
  },
  methods: {}
};
</script>
