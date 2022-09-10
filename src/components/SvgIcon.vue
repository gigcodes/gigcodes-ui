<template>
  <div
    v-if="type === 'div'"
    :class="[
      'svg-icon',
      { 'using-div': type === 'div', 'using-svg': type === 'svg' },
    ]"
  >
    <div :style="{ backgroundImage: 'url(/svg/' + name + '.svg)' }"></div>
  </div>
  <img v-else :src="`/svg/${name}.svg`" alt="" />
</template>

<script>
export default {
  name: "SvgIcon",
  props: {
    name: {
      type: String,
      default: null,
    },
    type: {
      type: String,
      default: "svg",
    },
  },
};
</script>
