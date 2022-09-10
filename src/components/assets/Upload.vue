<template>
  <tr>
    <td class="column-status" :class="status">
      <span v-if="status === 'error'" class="icon icon-warning error" />
      <loading-graphic v-else text="" />
    </td>
    <td class="column-thumbnail">
      <div class="img">
        <file-icon :extension="extension" />
      </div>
    </td>

    <td class="column-filename">
      <span class="filename">{{ basename }}</span>
    </td>

    <td v-if="status === 'error'" class="column-error">{{ error }}</td>

    <td v-else class="column-progress">
      <div class="w-full bg-gray-200 rounded-full dark:bg-gray-700">
        <div
          class="bg-blue-600 text-xs font-medium text-blue-100 text-center p-0.5 leading-none rounded-full"
          :style="{ width: percent + '%' }"
        >
          {{ percent }}%
        </div>
      </div>
    </td>

    <td style="width: 30px">
      <a v-if="status === 'error'" href="#" @click.prevent="clear">
        <i class="icon icon-circle-with-cross" />
      </a>
    </td>
  </tr>
</template>

<script>
import FileIcon from "../FileIcon.vue";
import { computed } from "vue";
import LoadingGraphic from "../LoadingGraphic.vue";
export default {
  components: {
    FileIcon,
    LoadingGraphic,
  },
  props: {
    extension: {
      type: String,
      default: null,
    },
    basename: {
      type: String,
      default: null,
    },
    percent: {
      type: Number,
      default: null,
    },
    error: {
      type: String,
      default: null,
    },
  },
  emits: ["clear"],
  setup(props, { emit }) {
    const status = computed(() => {
      if (props.error) {
        return "error";
      } else if (props.percent === 100) {
        return "pending";
      } else {
        return "uploading";
      }
    });

    const clear = () => {
      emit("clear");
    };

    return {
      status,
      clear,
    };
  },
};
</script>
<style lang="scss" scoped>
table {
  td {
    @apply p-2;
  }
}

a:hover {
  color: #3aa3e3;
  text-decoration: none;
}
</style>
