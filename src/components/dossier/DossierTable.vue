<template>
  <div
    v-if="!loading"
    class="
      dossier
      bg-white
      shadow-lg
      rounded-sm
      border border-slate-200
      relative
    "
  >
    <header class="px-5 py-4 border-b border-slate-100">
      <h2 class="font-semibold text-slate-800">
        {{ title }}
        <span class="text-slate-400 font-medium float-end">{{
          pagination.totalItems
        }}</span>
      </h2>
    </header>
    <div class="p-3">
      <table :class="[{ 'has-checkboxes': hasCheckboxes }]">
        <thead v-if="hasHeaders">
          <tr>
            <th v-if="hasCheckboxes" class="checkbox-col">
              <div class="flex items-center">
                <label class="inline-flex">
                  <span class="sr-only">Select all</span>
                  <input
                    class="form-checkbox"
                    type="checkbox"
                    :checked="allItemsChecked"
                    @click="checkAllItems"
                  />
                </label>
              </div>
            </th>

            <th
              v-for="(column, index) in columns"
              :key="index"
              :class="[
                'column-' + column.value,
                {
                  active: isColumnActive(column),
                  'column-sortable': !isSearching,
                  'extra-col': column.extra,
                },
              ]"
              :style="{ width: tableColWidth(column.width) }"
              @click="sortBy(column)"
            >
              {{ column.header }}
              <i
                v-if="isColumnActive(column)"
                :class="
                  tableOptions.sortOrder === 'asc'
                    ? 'icon icon-chevron-up'
                    : 'icon icon-chevron-down'
                "
              />
            </th>
            <th v-if="hasActions" class="column-actions" />
          </tr>
        </thead>
        <tbody ref="tbody">
          <tr v-for="(item, index) in items" :key="index">
            <td v-if="hasCheckboxes && !reordering" class="checkbox-col">
              <div class="flex items-center">
                <label class="inline-flex" :for="'checkbox-' + index">
                  <span class="sr-only">Select</span>
                  <input
                    :id="'checkbox-' + index"
                    class="form-checkbox"
                    type="checkbox"
                    :checked="item.checked"
                    @change="toggle(item)"
                  />
                </label>
              </div>
            </td>
            <td
              v-for="(column, i) in columns"
              :key="i"
              :class="[
                `cell-${column.value}`,
                {
                  'extra-col': column.extra,
                  'empty-col': !item[column.value],
                  'first-cell': i === 0,
                },
              ]"
            >
              <span class="sr-only">{{ column.header }}</span>
              <cell
                :index="i"
                :item="item"
                :value="formatValue(item[column.value])"
                :column="column"
              />
            </td>

            <!-- actions -->
            <td v-if="hasActions" class="column-actions">
              <actions :item="item" :actions="tableOptions.partials.actions" />
            </td>
          </tr>
        </tbody>
      </table>
      <modal
        :open="deleteModal"
        @cancelled="deleteModal = false"
        @confirmed="deleteItem()"
      >
        <template #header> Delete item ?</template>
        <template #body>
          On clicking confirm the selected item will be deleted. If you don't
          wish to do it then please press cancel.
        </template>
      </modal>

      <modal
        :open="deleteModalMulti"
        @cancelled="deleteModalMulti = false"
        @confirmed="deleteMultiple()"
      >
        <template #header>
          Delete {{ checkedItems.length }}
          {{ checkedItems.length === 1 ? "item" : "items" }} ?
        </template>
        <template #body>
          On clicking confirm the selected item will be deleted. If you don't
          wish to do it then please press cancel.
        </template>
      </modal>

      <div
        v-if="showBulkActions"
        :class="[
          'pl-1 my-2',
          { 'bulk-actions': true, 'no-checkboxes': !hasCheckboxes },
        ]"
      >
        <btn type="dangerFill" @clicked="uncheckAllItems">Uncheck All </btn>
        <btn type="danger" extra-class="ml-2" @clicked="deleteModalMulti = true"
          >Delete {{ checkedItems.length }}
          {{ checkedItems.length === 1 ? "item" : "items" }}
        </btn>
      </div>
      <div class="p-2 flex justify-center">
        <pagination
          :data="pagination"
          :limit="2"
          @pagination-change-page="paginationPageSelected"
        />
      </div>
    </div>
  </div>
</template>

<script>
import Cell from "./support/Cell.vue";
import _ from "underscore";
import Cookies from "js-cookie";
import Pagination from "../pagination/Pagination.vue";
import { Btn, createToaster, Events } from "../../index";
import Modal from "../modal/Modal.vue";
import { computed, inject, onMounted, onUnmounted, ref, watch } from "vue";
import Actions from "./support/Actions.vue";

export default {
  name: "DossierTable",
  components: {
    Cell,
    Pagination,
    Btn,
    Modal,
    Actions,
  },

  props: {
    hasItems: {
      type: Boolean,
      default: false,
    },
    title: {
      type: String,
      default: null,
    },
    tableOptions: {
      type: Object,
      default: () => ({}),
    },
    searchTerm: {
      type: String,
      default: null,
    },
    collection: {
      type: String,
      required: true,
    },
  },
  emits: [
    "update:loading",
    "update:hasItems",
    "update:tableOptions",
    "update:columns",
    "update:searching",
    "update:selectedPage",
  ],

  setup(props, { emit }) {
    const getService = inject("getService");
    const deleteService = inject("deleteService");
    const deleteMultiService = inject("deleteMultiService");
    const selectedPage = ref(
      Cookies.get(`gigcodes.table.${props.collection}.page`) ?? 1
    );
    const pagination = ref({});
    const columns = ref([]);
    const items = ref([]);
    const reordering = ref(false);
    const sortable = ref(true);
    const loading = ref(true);
    const isSearching = ref(false);
    const searchStarted = ref(false);
    const deleteModal = ref(false);
    const deleteModalMulti = ref(false);
    const selectedItem = ref(null);
    const toast = createToaster();

    Events.$on("showModal", (data) => {
      deleteModal.value = true;
      selectedItem.value = data.item;
    });

    onUnmounted(() => {
      Events.$off("showModal");
    });

    const deleteItem = async () => {
      try {
        await deleteService(selectedItem.value.id)
          .then((response) => {
            removeItemFromList(selectedItem.value.id);
            toast.show(response.data.message);
          })
          .catch((error) => {
            toast.error(error.response.data.message);
          });
      } catch (e) {
        console.log("Delete service is not setup");
      }
      deleteModal.value = false;
    };

    const deleteMultiple = async () => {
      try {
        await deleteMultiService({ items: checkedItems.value })
          .then((response) => {
            _.each(checkedItems.value, (id) => {
              removeItemFromList(id);
            });
            toast.show(response.data.message);
          })
          .catch((error) => {
            toast.error(error.response.data.message);
          });
      } catch (e) {
        console.log("deleteMultiService is not setup");
      }
      deleteModalMulti.value = false;
    };

    const formatValue = (value) => {
      if (
        value &&
        typeof value === "object" &&
        !Array.isArray() &&
        value.thumbnail
      ) {
        let html = `<span class="img"><img src="${value.thumbnail}" alt="${value.value}" />`;
        if (value.value) html += `<span>${value.value}</span>`;
        html += `</span>`;
        return html;
      }

      function htmlEntities(str) {
        if (!str) return "";
        return String(str)
          .replace(/&/g, "&amp;")
          .replace(/</g, "&lt;")
          .replace(/>/g, "&gt;")
          .replace(/"/g, "&quot;");
      }

      return Array.isArray(value)
        ? value.map((v) => htmlEntities(v)).join(", ")
        : htmlEntities(value);
    };

    const tableColWidth = (width) => {
      if (!width || width === 100) return;
      if (typeof width === "string" && width.endsWith("px")) return width;
      return `${width}%`;
    };

    const allItemsChecked = computed(() => {
      return items.value.length === checkedItems.value.length;
    });

    const checkedItems = computed(() => {
      return items.value
        .filter(function (item) {
          return item.checked;
        })
        .map(function (item) {
          return item.id;
        });
    });

    const hasItems = computed(() => {
      return !loading.value && items.value && items.value.length;
    });

    const hasCheckboxes = computed(() => {
      return props.tableOptions.checkboxes !== false;
    });

    const showBulkActions = computed(() => {
      return (
        hasItems.value &&
        hasCheckboxes.value &&
        itemsAreChecked.value &&
        !reordering.value
      );
    });

    const itemsAreChecked = computed(() => {
      return checkedItems.value.length > 0;
    });

    const hasHeaders = computed(() => {
      return props.tableOptions.headers !== false;
    });

    const hasActions = computed(() => {
      return (
        props.tableOptions.partials.actions !== undefined &&
        props.tableOptions.partials.actions !== ""
      );
    });

    const getParameters = computed(() => {
      let sortOrder,sort;
      if (Cookies.get(`gigcodes.table.${props.collection}.sortOrder`)) {
        sortOrder = Cookies.get(`gigcodes.table.${props.collection}.sortOrder`);
        sort = Cookies.get(`gigcodes.table.${props.collection}.sort`);
        return {
          sort:
            sortOrder === "asc"
              ? sort
              : `-${sort}`,
          page: selectedPage.value,
        };
      } else {
        return {
          sort:
            props.tableOptions.sortOrder === "asc"
              ? props.tableOptions.sort
              : `-${props.tableOptions.sort}`,
          page: selectedPage.value,
        };
      }
    });

    const isColumnActive = (col) => {
      if (isSearching.value) return false;
      return col.value === props.tableOptions.sort;
    };

    const removeItemFromList = (id) => {
      const item = _.findWhere(items.value, { id: id });
      const index = _.indexOf(items.value, item);
      items.value.splice(index, 1);
    };

    const getItems = () => {
      loading.value = true;
      emit("update:loading", true);
      try {
        const results = getService(getParameters.value);
        if (results) {
          results
            .then((response) => {
              items.value = response.data.data.items;
              columns.value = parseColumns(response.data.data.columns);
              loading.value = false;
              emit("update:loading", false);
              pagination.value = response.data.pagination;
            })
            .catch((error) => {
              console.log(error);
              emit("update:loading", false);
              toast.error("Error Fetching Data");
            });
        }
      } catch (e) {
        console.error("Get service not registered");
        emit("update:loading", false);
      }
      return true;
    };

    const paginationPageSelected = (page) => {
      selectedPage.value = page;
      Cookies.set(`gigcodes.table.${props.collection}.page`, page);
      emit("update:selectedPage", page);
      getItems();
    };

    const toggle = (item) => {
      item.checked = !item.checked;
    };

    const uncheckAllItems = () => {
      _.each(items.value, function (item) {
        item.checked = false;
      });
    };

    const checkAllItems = () => {
      const status = !allItemsChecked.value;
      _.each(items.value, function (item) {
        item.checked = status;
      });
    };

    const parseColumns = (columns) => {
      // If a link column hasn't been explicitly defined, we'll make the first column the link.
      const linkColumnUndefined =
        _.findWhere(columns, { link: true }) === undefined;

      return _.map(columns, function (column, i) {
        if (typeof column === "string") {
          column = { value: column };
        }

        let sort, custom_link;
        //for sorting
        if (column.sort === undefined) sort = true;
        else sort = column.sort;
        //for custom link
        if (column.custom_link === undefined) {
          custom_link = false;
        } else {
          custom_link = column.custom_link;
        }
        return {
          value: column.value,
          header: column.header,
          extra: column.extra,
          width: column.width,
          sort: sort,
          link: column.link || (linkColumnUndefined && i === 0),
          custom_link: custom_link,
        };
      });
    };

    const sortBy = (col) => {
      if (!sortable.value) return;
      if (isSearching.value) return;
      if (!col.sort) return;
      let sort = col.value;
      let sortOrder = "desc";

      // If the current sort order was clicked again, change the direction.
      if (props.tableOptions.sort === sort) {
        sortOrder = props.tableOptions.sortOrder === "asc" ? "desc" : "asc";
      }
      parentSortBy(sort, sortOrder);
    };

    const parentSortBy = (sort, sortOrder) => {
      let options = props.tableOptions;
      options["sort"] = sort;
      options["sortOrder"] = sortOrder;
      Cookies.set(`gigcodes.table.${props.collection}.sort`, sort);
      Cookies.set(`gigcodes.table.${props.collection}.sortOrder`, sortOrder);
      emit("update:tableOptions", options);
      getItems();
    };

    const performSearch = () => {
      isSearching.value = true;
      emit("update:searching", true);
      loading.value = true;
      emit("update:loading", true);
      try {
        const results = getService({ q: props.searchTerm });
        if (results) {
          results
            .then((response) => {
              items.value = response.data.data.items;
              columns.value = parseColumns(response.data.data.columns);
              loading.value = false;
              emit("update:loading", false);
              pagination.value = response.data.pagination;
            })
            .catch((error) => {
              console.log(error);
              loading.value = false;
              emit("update:loading", false);
              toast.error("Error Fetching Data");
            });
        }
      } catch (e) {
        console.error("Get service not registered");
      }
      isSearching.value = false;
      emit("update:searching", false);
      deleteModal.value = false;
    };

    watch(hasItems, (val) => {
      emit("update:hasItems", Boolean(val));
    });

    watch(columns, (val) => {
      emit("update:columns", val);
    });

    watch(
      () => props.searchTerm,
      (term) => {
        if (term.length > 3) {
          searchStarted.value = true;
          performSearch();
        } else {
          if (searchStarted.value) {
            getItems();
            searchStarted.value = false;
          }
        }
      }
    );

    onMounted(() => [getItems()]);

    return {
      isSearching,
      items,
      deleteItem,
      formatValue,
      tableColWidth,
      selectedItem,
      deleteModal,
      sortable,
      reordering,
      columns,
      isColumnActive,
      paginationPageSelected,
      toggle,
      checkAllItems,
      uncheckAllItems,
      deleteMultiple,
      selectedPage,
      pagination,
      showBulkActions,
      getParameters,
      hasHeaders,
      itemsAreChecked,
      hasActions,
      hasCheckboxes,
      allItemsChecked,
      checkedItems,
      loading,
      sortBy,
      deleteModalMulti,
      getItems,
    };
  },
};
</script>
