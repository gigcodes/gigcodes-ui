<template>
  <span :class="{ 'has-status-icon': index === 0 }">
    <span
      v-if="index === 0"
      class="status"
      :class="item.published ? 'status-live' : 'status-hidden'"
      :title="item.published ? 'Published' : 'Draft'"
    ></span>
    <a
      v-if="column.link && !column.custom_link && (item.canEdit === undefined || item.canEdit === true)"
      href="javascript:void(0)"
      class="has-status-icon"
      @click.prevent="goTo(item.edit_url)"
    >
      {{ value }}
    </a>
    <a
      v-else-if="column.link && column.custom_link"
      href="javascript:void(0)"
      class="has-status-icon"
      @click.prevent="goTo(item[column.custom_link])"
    >
      {{ value }}
    </a>
    <template v-else>
      {{ value }}
    </template>
  </span>
</template>

<script>
import { Events } from "../../../index";
import { onBeforeUnmount } from "vue";

export default {
  name: "Cell",
  props: {
    index: {
      type: Number,
      required: true,
    },
    item: {
      type: Object,
      required: true,
    },
    value: {
      type: String,
      required: true,
    },
    column: {
      type: Object,
      required: true,
    },
  },
  setup() {
    const goTo = (url) => {
      Events.$emit("goTo", url);
    };

    onBeforeUnmount(() => {
      Events.$off("goTo");
    });
    return {
      goTo,
    };
  },
};
</script>

<style scoped></style>
