<template>
  <selector
    ref="selectorEl"
    v-if="open"
    :container="container"
    :folder="'/'"
    :restrict-navigation="false"
    :selected="[]"
    view-mode="grid"
    :max-files="1"
    @closed="emit('closed')"
    :can-edit="canEdit"
    @selected="selectedAsset"
  >
  </selector>
</template>

<script>
export default {
  name: "MediaSelector",
};
</script>

<script setup>
import Selector from "./Selector.vue";
import { ref } from "vue";

const emit = defineEmits(["closed", "selected"]);
const selectorEl = ref(null);
const props = defineProps({
  open: {
    default: false,
    type: Boolean,
  },
  container: {
    default: "main",
    type: String,
  },
  canEdit: {
    type: Boolean,
    default: false,
  },
});

const selectedAsset = () => {
  emit("selected", selectorEl.value.$refs.assetBrowser.asset);
};
</script>

<style scoped>
</style>