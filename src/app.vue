<template>
  <div id="container">
    <h1>{{initData}}</h1>
  </div>
</template>

<script>
export default {
  name: "App",
  data() {
    return {
      initData: "Vue开发环境运行成功"
    };
  }
};
</script>

<style lang="less" scoped>
#container {
  color: red;
  display: flex;
}
</style>
