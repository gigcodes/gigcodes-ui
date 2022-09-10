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
    <div class="p-3 overflow-x-auto">
      <table :class="[{ 'has-checkboxes': hasCheckboxes }]" class="table-auto w-full ">
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
          <th v-if="hasActions" class="column-actions"/>
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
            <Menu as="div" class="relative inline-block text-left">
              <div>
                <MenuButton
                    class="w-full justify-center text-sm font-medium text-gray-700 hover:bg-gray-50">
                  <ChevronDownIcon class="-mr-1 ml-2 h-5 w-5" aria-hidden="true"/>
                </MenuButton>
              </div>
              <transition enter-active-class="transition ease-out duration-100"
                          enter-from-class="transform opacity-0 scale-95"
                          enter-to-class="transform opacity-100 scale-100"
                          leave-active-class="transition ease-in duration-75"
                          leave-from-class="transform opacity-100 scale-100"
                          leave-to-class="transform opacity-0 scale-95">
                <MenuItems
                    class="absolute right-0 z-10 mt-2 w-56 origin-top-right divide-y divide-gray-100 rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                  <div class="py-1">
                    <template v-for="(action,index) in tableOptions.partials.actions">
                      <MenuItem as="div" v-slot="{ active }"
                                v-if="action === 'edit' && (item.canEdit === undefined || item.canEdit === true)"
                                :key="index">
                        <a
                            @click.prevent="goTo(item.edit_url)"
                            href="javascript:void(0)"
                            :class="[active ? 'bg-gray-100 text-gray-900' : 'text-gray-700', 'group flex items-center px-4 py-2 text-sm']">
                          <PencilAltIcon class="mr-3 h-5 w-5 text-gray-400 group-hover:text-gray-500"
                                         aria-hidden="true"/>
                          Edit
                        </a>
                      </MenuItem>
                      <MenuItem as="div" v-slot="{ active }"
                                v-if="action === 'delete' && (item.canDelete === undefined || item.canDelete === true)"
                                :key="index">
                        <a
                            @click.prevent="showDeleteModal(item)"
                            href="javascript:void(0)"
                            :class="[active ? 'bg-gray-100 text-gray-900' : 'text-gray-700', 'group flex items-center px-4 py-2 text-sm']">
                          <TrashIcon class="mr-3 h-5 w-5 text-gray-400 group-hover:text-gray-500" aria-hidden="true"/>
                          Delete
                        </a>
                      </MenuItem>
                      <MenuItem as="div" v-slot="{ active }" v-if="item.custom_action_text"
                                :key="index">
                        <a
                            @click.prevent="goTo(item.custom_action_link)"
                            href="javascript:void(0)"
                            :class="[active ? 'bg-gray-100 text-gray-900' : 'text-gray-700', 'group flex items-center px-4 py-2 text-sm']">
                          <ArchiveIcon class="mr-3 h-5 w-5 text-gray-400 group-hover:text-gray-500"
                                       aria-hidden="true"/>
                          {{ item.custom_action_text }}
                        </a>
                      </MenuItem>
                      <slot name="actions" :item="item" :action="action" :index="index"></slot>
                    </template>
                  </div>
                </MenuItems>
              </transition>
            </Menu>
          </td>
        </tr>
        </tbody>
      </table>
      <modal
          :open="deleteModal"
          @cancelled="deleteModal = false"
          @confirmed="deleteItem"
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
        <btn type="dangerFill" @clicked="uncheckAllItems">Uncheck All</btn>
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
export default {
  name: "DossierTable"
}
</script>
<script setup>
import Cell from "./support/Cell.vue";
import _ from "underscore";
import Cookies from "js-cookie";
import Pagination from "../pagination/Pagination.vue";
import {Btn, createToaster, Events} from "../../index";
import Modal from "../modal/Modal.vue";
import {computed, inject, onMounted, onUnmounted, ref, watch} from "vue";
import {Menu, MenuButton, MenuItem, MenuItems} from '@headlessui/vue'
import {ChevronDownIcon, PencilAltIcon, TrashIcon, ArchiveIcon} from '@heroicons/vue/solid'


const props = defineProps({
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
})
const emit = defineEmits([
  "update:loading",
  "update:hasItems",
  "update:tableOptions",
  "update:columns",
  "update:searching",
  "update:selectedPage",
  "update:checked"
])

const getService = inject("getService");
const deleteService = inject("deleteService");
const showActionsDropdown = ref(false)
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

const showDeleteModal = (item) => {
  deleteModal.value = true;
  selectedItem.value = item;
  showActionsDropdown.value = false;
};

const deleteMultiple = async () => {
  try {
    await deleteMultiService({items: checkedItems.value})
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
  return items.value.filter((item) => item.checked).map((item) => item.id);
});

const checkedList = computed(() => {
  return items.value.filter((item) => item.checked);
})

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
  let sortOrder, sort;
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
  const item = _.findWhere(items.value, {id: id});
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
      _.findWhere(columns, {link: true}) === undefined;

  return _.map(columns, function (column, i) {
    if (typeof column === "string") {
      column = {value: column};
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
    const results = getService({q: props.searchTerm});
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

const goTo = (url) => {
  Events.$emit("goTo", url);
  showActionsDropdown.value = false
};

watch(hasItems, (val) => {
  emit("update:hasItems", Boolean(val));
});

watch(columns, (val) => {
  emit("update:columns", val)
});

watch(itemsAreChecked, () => emit("update:checked", checkedList.value))

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
</script>
