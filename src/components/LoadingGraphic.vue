<template>
  <div class="loading">
    <span class="icon icon-circular-graph animation-spin"></span>
    {{ text }}
  </div>
</template>

<script>
export default {
  name: "LoadingGraphic",
  props: {
    text: {
      type: String,
      default: "Loading",
    },
  },
};
</script>

<style scoped></style>
