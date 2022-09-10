<template>
  <div class="dossier-sort-options">
    <btn>
      <svg class="w-4 h-4 fill-current" viewBox="0 0 16 16">
        <path
          d="M9 15H7a1 1 0 010-2h2a1 1 0 010 2zM11 11H5a1 1 0 010-2h6a1 1 0 010 2zM13 7H3a1 1 0 010-2h10a1 1 0 010 2zM15 3H1a1 1 0 010-2h14a1 1 0 010 2z"
        />
      </svg>
      {{ sortLabel }}
    </btn>
    <ul class="dropdown-menu">
      <li v-for="(column, key) in columns" :key="key">
        <a href="" @click.prevent="changeSortColumn(column.field)">
          {{ column.header }}
          <span
            v-if="sort === column.field"
            class="icon icon-check pull-right mr-0"
          ></span>
        </a>
      </li>
      <li class="divider"></li>
      <li>
        <a href="" @click.prevent="changeSortOrder('asc')">
          Ascending
          <span
            v-if="order === 'asc'"
            class="icon icon-check pull-right mr-0"
          ></span>
        </a>
      </li>
      <li>
        <a href="" @click.prevent="changeSortOrder('desc')">
          Descending
          <span
            v-if="order === 'desc'"
            class="icon icon-check pull-right mr-0"
          ></span>
        </a>
      </li>
    </ul>
  </div>
</template>

<script>
import { where } from "underscore";
import { Btn } from "../../index";
import { computed, ref } from "vue";

export default {
  name: "DossierSortSelector",
  components: {
    Btn,
  },
  props: {
    sortOrder: {
      type: String,
      default: null,
    },
    sortData: {
      type: String,
      default: null,
    },
    columns: {
      type: Object,
      default: () => ({}),
    },
  },
  emits: ["sortBy", "sort"],
  setup(props, { emit }) {
    const order = ref(props.sortOrder);
    const sort = computed(() => {
      return props.sortData;
    });

    const sortLabel = computed(() => {
      let data = where(props.columns, { value: sort.value })[0];
      if (data) return data.header;
      else return undefined;
    });

    const changeSortColumn = (sort) => {
      emit("sort", {
        sort,
        order: order.value,
      });
    };
    const changeSortOrder = (order) => {
      emit("sortBy", {
        sort: sort.value,
        order,
      });
    };

    return {
      order,
      sort,
      sortLabel,
      changeSortColumn,
      changeSortOrder,
    };
  },
};
</script>
