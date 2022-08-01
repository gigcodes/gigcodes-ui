<template>
  <input
      v-model="text"
      type="search"
      placeholder="Search"
      class="filter-control search"
      debounce="500"
      @keydown.esc.prevent="reset"
  />
</template>

<script>
import {ref, watch} from "vue";

export default {
  name: "DossierSearch",
  props: {
    keyword: {
      type: String,
      default: null
    }
  },
  emits: ["update:keyword"],
  setup(props, {emit}) {
    const text = ref(props.keyword);
    const reset = () => {
      text.value = "";
    };
    watch(text, (val) => {
      emit("update:keyword", val);
    });

    return {
      text,
      reset,
    };
  },
};
</script>
