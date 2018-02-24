<template>
</template>
<script>
export default {
  data() {
    return {};
  },
  mounted() {
    let query = this.$route.query;
    if(query.link){
      this.$router.replace({ path: query.link });
    }else{
      // 返回上一页
      this.$route.go(-1);
    }
  },
  methods: {}
};
</script>
