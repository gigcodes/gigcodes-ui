<template>
  <RenderlessVuePagination
    v-slot="slotProps"
    :data="data"
    :limit="limit"
    :show-disabled="showDisabled"
    :size="size"
    :align="align"
    @pagination-change-page="onPaginationChangePage"
  >
    <div>
      <p class="text-sm text-gray-700">
        Showing
        {{ " " }}
        <span class="font-medium">{{ data.meta.from }}</span>
        {{ " " }}
        to
        {{ " " }}
        <span class="font-medium"> {{ data.meta.to }}</span>
        {{ " " }}
        of
        {{ " " }}
        <span class="font-medium">{{ data.meta.total }}</span>
        {{ " " }}
        results
      </p>
    </div>
    <nav
      v-if="slotProps.computed.total > slotProps.computed.perPage"
      class="isolate inline-flex -space-x-px rounded-md shadow-sm"
      aria-label="Pagination"
    >
      <a
        v-if="slotProps.computed.prevPageUrl || slotProps.showDisabled"
        :tabindex="!slotProps.computed.prevPageUrl && -1"
        href="#"
        class="relative inline-flex items-center rounded-l-md border border-gray-300 bg-white px-2 py-2 text-sm font-medium text-gray-500 hover:bg-gray-50 focus:z-20"
        :class="{ disabled: !slotProps.computed.prevPageUrl }"
        v-on="slotProps.prevButtonEvents"
      >
        <span class="sr-only">Previous</span>
        <ChevronLeftIcon class="h-5 w-5" aria-hidden="true" />
      </a>
      <!-- Current: "z-10 bg-indigo-50 border-indigo-500 text-indigo-600", Default: "bg-white border-gray-300 text-gray-500 hover:bg-gray-50" -->
      <a
        v-for="(page, key) in slotProps.computed.pageRange"
        :key="key"
        href="#"
        aria-current="page"
        class="page"
        :class="page === slotProps.computed.currentPage ? 'active' : 'inactive'"
        v-on="slotProps.pageButtonEvents(page)"
        >{{ page }}</a
      >
      <a
        v-if="slotProps.computed.nextPageUrl || slotProps.showDisabled"
        href="#"
        :tabindex="!slotProps.computed.nextPageUrl && -1"
        class="relative inline-flex items-center rounded-r-md border border-gray-300 bg-white px-2 py-2 text-sm font-medium text-gray-500 hover:bg-gray-50 focus:z-20"
        :class="{ disabled: !slotProps.computed.nextPageUrl }"
        v-on="slotProps.nextButtonEvents"
      >
        <span class="sr-only">Next</span>
        <ChevronRightIcon class="h-5 w-5" aria-hidden="true" />
      </a>
    </nav>
  </RenderlessVuePagination>
</template>

<script>
import RenderlessVuePagination from "./RenderlessVuePagination.vue";
import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/vue/solid";
export default {
  components: {
    RenderlessVuePagination,
    ChevronLeftIcon,
    ChevronRightIcon,
  },
  inheritAttrs: false,

  props: {
    data: {
      type: Object,
      default: () => {},
    },
    limit: {
      type: Number,
      default: 0,
    },
    showDisabled: {
      type: Boolean,
      default: false,
    },
    size: {
      type: String,
      default: "default",
      validator: (value) => {
        return ["small", "default", "large"].indexOf(value) !== -1;
      },
    },
    align: {
      type: String,
      default: "left",
      validator: (value) => {
        return ["left", "center", "right"].indexOf(value) !== -1;
      },
    },
  },

  emits: ["pagination-change-page"],

  methods: {
    onPaginationChangePage(page) {
      this.$emit("pagination-change-page", page);
    },
  },
};
</script>

<style lang="scss">
ul.pagination {
  @apply inline-flex text-sm font-medium -space-x-px shadow-sm;
  a.page-link {
    @apply inline-flex items-center justify-center leading-5 px-3.5 py-2 bg-white hover:bg-indigo-500 border border-slate-200 text-slate-600 hover:text-white;
  }

  a.page-link:hover,
  li.active a.page-link {
    --tw-bg-opacity: 1;
    --tw-text-opacity: 1;
    background-color: rgb(99 102 241 / var(--tw-bg-opacity));
    color: rgb(255 255 255 / var(--tw-text-opacity));
  }

  li.active a.page-link {
    cursor: not-allowed;
  }

  .first a {
    @apply rounded-l;
  }

  .last a {
    @apply rounded-r;
  }
}

.page.active {
  @apply relative z-10 inline-flex items-center border border-indigo-500 bg-indigo-50 px-4 py-2 text-sm font-medium text-indigo-600 focus:z-20;
}

.page.inactive {
  @apply relative inline-flex items-center border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-500 hover:bg-gray-50 focus:z-20;
}
</style>
