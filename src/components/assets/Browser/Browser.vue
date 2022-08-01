<template>
  <div
    ref="el"
    class="asset-browser"
    @dragover.prevent="draggingFile = true"
    @dragleave.prevent="draggingFile = false"
    @drop.prevent="dropFile"
  >
    <div class="align-middle w-full" v-if="!initialized">
      <loading-graphic />
    </div>

    <div v-show="canEdit && draggingFile" class="drag-notification">
      <i class="icon icon-download" />
      <h3>Drop to Upload</h3>
    </div>

    <div v-if="showSidebar" class="asset-browser-sidebar">
      <h4>Containers</h4>
      <div
        v-for="(c, i) in containers"
        :key="i"
        class="sidebar-item"
        :class="{ active: container.id === c.id }"
      >
        <a @click="selectContainer(c.id)">
          {{ c.title }}
        </a>
      </div>
    </div>

    <div v-if="initialized" class="asset-browser-main">
      <div class="asset-browser-header bg-gray-50 rounded-t-lg">
        <h1 class="mb-3">
          <template v-if="isSearching"> Search Results</template>
          <template v-else>
            <template v-if="restrictNavigation">
              {{ folder.title || folder.path }}
            </template>
            <template v-else>
              {{ container.title }}
            </template>
          </template>

          <loading-graphic v-if="loadingAssets"></loading-graphic>
        </h1>

        <div class="asset-browser-actions flex flex-wrap">
          <div class="px-3" v-if="!assetsSelected.length">
            <label for="search" class="sr-only">Search</label>
            <div class="relative rounded-md shadow-sm">
              <div
                class="
                  absolute
                  inset-y-0
                  left-0
                  pl-3
                  flex
                  items-center
                  pointer-events-none
                "
                aria-hidden="true"
              >
                <!-- Heroicon name: solid/search -->
                <svg
                  class="mr-3 h-4 w-4 text-gray-400"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                  aria-hidden="true"
                >
                  <path
                    fill-rule="evenodd"
                    d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
                    clip-rule="evenodd"
                  />
                </svg>
              </div>
              <input
                type="text"
                v-model="searchTerm"
                name="search"
                id="search"
                class="
                  focus:ring-indigo-500 focus:border-indigo-500
                  block
                  w-full
                  pl-9
                  sm:text-sm
                  border-gray-300
                  rounded-md
                "
                placeholder="Search"
              />
            </div>
          </div>
          <div v-if="assetsSelected.length">
            <btn type="danger" class="mr-0.5" @click="deleteModalMulti = true"
              >Delete</btn
            >
            <btn type="tertiary" @click="assetsSelected = []">Uncheck All</btn>
          </div>

          <modal
            :open="deleteModalMulti"
            @cancelled="deleteModalMulti = false"
            @confirmed="deleteAsset(assetsSelected)"
          >
            <template #header>
              Delete {{ assetsSelected.length }}
              {{ assetsSelected.length === 1 ? "item" : "items" }} ?
            </template>
            <template #body>
              On clicking confirm the selected item will be deleted. If you
              don't wish to do it then please press cancel.
            </template>
          </modal>
          <modal
            :open="deleteModal"
            @cancelled="deleteModal = false"
            @confirmed="deleteAsset(assetToBeDeleted)"
          >
            <template #header>
              Delete {{ assetsSelected.length }}
              {{ assetsSelected.length === 1 ? "item" : "items" }} ?
            </template>
            <template #body>
              On clicking confirm the selected item will be deleted. If you
              don't wish to do it then please press cancel.
            </template>
          </modal>

          <div class="btn-group action mb-3">
            <btn
              type="tertiary"
              class="mr-0.5"
              :class="{ depressed: displayMode === 'grid' }"
              @click="setDisplayMode('grid')"
            >
              <span class="icon icon-grid" />
            </btn>
            <btn
              type="tertiary"
              @clicked="setDisplayMode('table')"
              :class="{ depressed: displayMode === 'table' }"
              ><span class="icon icon-list"
            /></btn>
          </div>

          <div class="btn-group action mb-3">
            <btn
              class="mr-0.5"
              v-if="!restrictNavigation && !isSearching"
              type="tertiary"
              @click.prevent="createFolder"
            >
              New Folder
            </btn>
            <btn
              v-if="!isSearching"
              type="tertiary"
              @click.prevent="uploadFile"
            >
              Upload
            </btn>
          </div>
        </div>
      </div>

      <div class="asset-browser-content">
        <uploader
          v-if="initialized"
          ref="uploaderEl"
          :container="container.id"
          :dom-element="uploadElement"
          :path="path"
          @updated="uploadsUpdated"
          @upload-complete="loadAssets"
        >
        </uploader>

        <uploads v-if="uploads.length" :uploads="uploads"></uploads>

        <component
          :is="listingComponent"
          :container="container.id"
          :assets="assets"
          :folder="folder"
          :subfolders="subfolders"
          :loading="loading"
          :selected-assets="selectedAssets"
          :restrict-navigation="restrictNavigation"
          :is-searching="isSearching"
          @folder-selected="folderSelected"
          @folder-editing="editFolder"
          @folder-deleted="folderDeleted"
          @asset-selected="assetSelected"
          @asset-deselected="assetDeselected"
          @asset-editing="editAsset"
          @asset-deleting="deleteAssetSingle"
          @assets-dragged-to-folder="assetsDraggedToFolder"
          @asset-doubleclicked="assetDoubleClicked"
          @sorted="sortBy"
          :can-edit="canEdit"
        >
        </component>

        <div v-if="isSearching && isEmpty" class="no-results">
          <!--                    <svg-icon name="folder-search-empty" class="h-16 w-16 mx-auto"/>-->
          <h2>No Search Results</h2>
        </div>
      </div>

      <pagination
        :data="pagination"
        :limit="2"
        @pagination-change-page="paginationPageSelected"
      />
      <breadcrumbs
        v-if="!restrictNavigation && !isSearching"
        :path="path"
        :folder="folder"
        :folders="folders"
        @navigated="folderSelected"
      >
      </breadcrumbs>

      <asset-editor
        v-if="showAssetEditor"
        :id="editedAssetId"
        :has-child="editorHasChild"
        @closed="closeAssetEditor"
        @saved="assetSaved"
        @deleted="assetDeleted"
        @moved="assetMoved"
      >
      </asset-editor>

      <folder-editor
        v-if="showFolderCreator"
        :create="true"
        :container="container"
        :path="path"
        :parent_uuid="folder?.uuid"
        @closed="folderCreatorClosed"
        @created="folderCreated"
      >
      </folder-editor>

      <folder-editor
        v-if="showFolderEditor"
        :create="false"
        :container="container"
        :path="editedFolderPath"
        :parent_uuid="folder?.uuid"
        @closed="folderEditorClosed"
        @updated="loadAssets"
      >
      </folder-editor>
    </div>
  </div>
</template>

<script setup>
import GridListing from "./Listing/GridListing.vue";
import TableListing from "./Listing/TableListing.vue";
import Uploader from "../Uploader.vue";
import Uploads from "../Uploads.vue";
import AssetEditor from "../Editor/Editor.vue";
import FolderEditor from "./FolderEditor.vue";
import Breadcrumbs from "./Breadcrumbs.vue";
import Pagination from "../../pagination/Pagination.vue";
import { Events } from "../../../index";
import _ from "underscore";
import LoadingGraphic from "../../LoadingGraphic.vue";
import { Btn } from "../../../index";
import { computed, inject, onBeforeUnmount, onMounted, ref, watch } from "vue";
import Cookies from "cookies-js";
import Modal from "../../modal/Modal.vue";

const emit = defineEmits([
  "selections-updated",
  "asset-doubleclicked",
  "navigated",
]);

const props = defineProps({
  selectedContainer: {
    // The ID of the container to display, determined by a parent component.
    type: String,
    default: null,
  },
  selectedPath: {
    // The path to display, determined by a parent component.
    type: String,
    default: null,
  },
  selectedPathUuid: {
    // The path to display, determined by a parent component.
    type: String,
    default: null,
  },
  restrictNavigation: {
    type: Boolean,
    default: false,
  },
  selectedAssets: {
    type: Array,
    default: () => [],
  },
  maxFiles: {
    type: Number,
    default: 10,
  },
  canEdit: {
    type: Boolean,
    default: false,
  },
});

const path = ref(props.selectedPath);
const path_uuid = ref(props.selectedPathUuid);
const browseContainer = inject("containerService");
const loadFilesService = inject("loadFilesService");
const moveFilesService = inject("moveFilesService");
const searchFilesService = inject("searchFilesService");
const deleteFilesService = inject("deleteFilesService");
const containers = ref(null);
const displayMode = ref("table");
const container = ref(null);
const loadingContainers = ref(true);
const loadingAssets = ref(true);
const initializedAssets = ref(false);
const deleteModalMulti = ref(false);
const deleteModal = ref(false);
const isSearching = ref(false);
const assets = ref([]);
const folders = ref([]);
const folder = ref({});
const pagination = ref({});
const selectedPage = ref(1);
const sort = ref("title");
const sortOrder = ref("asc");
const searchTerm = ref("");
const assetsSelected = ref(props.selectedAssets);
const asset = ref(null);
const assetToBeDeleted = ref([]);
const editedAssetId = ref(null);

const el = ref(null);
const uploaderEl = ref(null);
const uploads = ref([]);
const editedFolderPath = ref(null);
const showFolderCreator = ref(false);
const draggingFile = ref(false);
const editorHasChild = ref(false);

/**
 * Load asset container data
 */
const loadContainers = () => {
  browseContainer().then((response) => {
    // Set the containers property to a collection of the items in the response.
    // We are only interested in certain keys, and we want them indexed by
    // ID to make retrieving container values simpler down the road.
    containers.value = _.chain(response.data.items)
      .map((container) => {
        return _.pick(container, "id", "title", "uuid", "item_id");
      })
      .indexBy("id")
      .value();
    // We need the container property to be the retrieved data object.
    container.value = containers.value[props.selectedContainer];
    loadingContainers.value = false;
  });
};

/**
 * Load assets from the container and folder specified
 */
const loadAssets = () => {
  loadingAssets.value = true;
  loadFilesService({
    container: container.value.id,
    path: path.value,
    page: selectedPage.value,
    sort: sort.value,
    dir: sortOrder.value,
    path_uuid: path_uuid.value,
  }).then((response) => {
    assets.value = response.data.data.assets;
    folders.value = response.data.data.folders;
    folder.value = response.data.data.folder;
    pagination.value = response.data.pagination;
    selectedPage.value = response.data.pagination.meta.current_page;
    loadingAssets.value = false;
    initializedAssets.value = true;
    isSearching.value = false;
  });
};

const search = () => {
  loadingAssets.value = true;
  isSearching.value = true;
  searchFilesService({
    term: searchTerm,
    container: container.value.id,
    folder: folder.value.path,
    restrictNavigation: props.restrictNavigation,
  }).then((response) => {
    isSearching.value = false;
    assets.value = response.data.assets;
    folders.value = [];
    loadingAssets.value = false;
    initializedAssets.value = true;
  });
};

const assetsDraggedToFolder = (folder) => {
  const payload = {
    assets: props.selectedAssets,
    folder: folder,
    container: container.value.id,
  };

  moveFilesService(payload).then(() => {
    loadAssets();
    //@todo change needed
    // this.selectedAssets = [];
  });
};

const deleteAssetSingle = (asset) => {
  deleteModal.value = true;
  assetToBeDeleted.value = asset.id;
};

/**
 * Delete the given asset and refresh the browser.
 */
const deleteAsset = (ids) => {
  ids = Array.isArray(ids) ? ids : [ids];
  loadingAssets.value = true;
  try {
    deleteFilesService({ ids }).then(() => {
      loadAssets();
      assetsSelected.value = _.difference(assetsSelected.value, ids);
    });
  } catch (e) {
    console.log(e);
  }
  deleteModal.value = false;
  deleteModalMulti.value = false;
  assetToBeDeleted.value = [];
};

//computed
const fullPath = computed(() => {
  if (!container.value) return;

  let fullPath = container.value.id;

  if (path.value !== "/") {
    fullPath += "/" + path.value;
  }

  return fullPath;
});

const maxFilesReached = computed(() => {
  return props.maxFiles && props.selectedAssets.length >= props.maxFiles;
});

const initialized = computed(() => {
  return initializedAssets.value && !loadingContainers.value;
});

/**
 * Whether the current folder has assets.
 */
const hasAssets = computed(() => {
  return assets.value.length > 0;
});

const loading = computed(() => {
  return loadingAssets.value || loadingContainers.value;
});

const subfolders = computed(() => {
  if (props.restrictNavigation) return [];
  return folders.value;
});

const hasSubfolders = computed(() => {
  return subfolders.value.length > 0;
});

const isEmpty = computed(() => {
  return !hasAssets.value && !hasSubfolders.value;
});

const showSidebar = computed(() => {
  if (!initialized.value) return false;

  if (isSearching.value) return false;

  if (props.restrictNavigation) return false;

  return Object.keys(containers.value).length > 1;
});

const listingComponent = computed(() => {
  return displayMode.value === "grid" ? GridListing : TableListing;
});

const showAssetEditor = computed(() => {
  return Boolean(editedAssetId.value);
});

const showFolderEditor = computed(() => {
  return editedFolderPath.value !== null;
});

const uploadElement = computed(() => {
  return el.value;
});

const dropFile = (event) => {
  const files = event.dataTransfer.files;
  if (files.length) {
    Object.keys(event.dataTransfer.files).forEach((key) => {
      uploaderEl.value.upload(event.dataTransfer.files[key]);
    });
  }
  draggingFile.value = false;
};

/**
 * When a folder was selected from within listing component.
 */
const folderSelected = (folder) => {
  // Trigger re-loading of assets in the selected folder.
  path.value = folder.path;
  path_uuid.value = folder.uuid;
  selectedPage.value = 1;

  // Trigger an event so the parent can do something.
  // eg. The asset manager would want to change the browser URL.
  // emit("navigated", container.value.id, path.value);
};

/**
 * Set the display mode and remember it in a cookie
 */
const setDisplayMode = (mode) => {
  displayMode.value = mode;
  Cookies.set("gigcodes.assets.listing_view_mode", mode);
};

/**
 * When a container is selected/clicked in the sidebar
 */
const selectContainer = (c) => {
  // Trigger re-loading of assets in the selected container.
  container.value = containers.value[c];
  path.value = "/";

  // Trigger an event so the parent can do something.
  // eg. The asset manager would want to change the browser URL.
  emit("navigated", container.value.id, path.value);
};

/**
 * When an asset has been deselected.
 */
const assetDeselected = (asset) => {
  assetsSelected.value = _.without(assetsSelected.value, asset.id);
};

/**
 * When an asset has been chosen for editing.
 */
const editAsset = (asset) => {
  if (props.canEdit) {
    editedAssetId.value = asset.id;
  }
};

/**
 * Close the asset editor.
 */
const closeAssetEditor = () => {
  editedAssetId.value = null;
};

/**
 * When an asset has been saved from the editor.
 */
const assetSaved = () => {
  closeAssetEditor();
  loadAssets();
};

/**
 * When an asset was deleted from the editor.
 */
const assetDeleted = () => {
  closeAssetEditor();
  loadAssets();
};

/**
 * When an asset was moved to another folder from the editor.
 */
const assetMoved = (folder) => {
  closeAssetEditor();
  folderSelected(folder);
};

/**
 * When an asset has been selected.
 */
const assetSelected = (assetItem) => {
  asset.value = assetItem.asset;
  // For single asset selections, clicking a different asset will replace the selection.
  if (props.maxFiles === 1 && maxFilesReached) {
    assetsSelected.value = [assetItem.id];
  }

  // Completely prevent additional selections when the limit has been hit.
  if (maxFilesReached.value) {
    return;
  }

  // Don't add the same asset twice.
  if (_.contains(assetsSelected.value, assetItem.id)) {
    return;
  }

  assetsSelected.value.push(assetItem.id);

  // For some reason, Vue wasn't reacting to new item.
  // It would show up in the data, but wouldn't adjust the view.
  // Mapping over itself fixes this. ¯\_(ツ)_/¯
  assetsSelected.value = _.map(assetsSelected.value, (val) => val);
};

/**
 * When an asset was double clicked.
 *
 * This event would only ever be called when the browser is used in the context of a
 * fieldtype. When used in the "Assets" section, the double click would be handled
 * from within the asset component and caused the edit dialog to be opened.
 */
const assetDoubleClicked = (asset) => {
  assetSelected(asset.id);
  emit("asset-doubleclicked", asset);
};

/**
 * Show the file upload finder window.
 */
const uploadFile = () => {
  uploaderEl.value.browse();
};

/**
 * When a page was selected in the pagination.
 */
const paginationPageSelected = (page = 1) => {
  selectedPage.value = page;
  loadAssets();
};

const createFolder = () => {
  showFolderCreator.value = true;
};

const folderCreatorClosed = () => {
  showFolderCreator.value = false;
};

const folderCreated = (folder) => {
  folderSelected(folder);
};

const editFolder = (folder) => {
  editedFolderPath.value = folder;
};

const folderEditorClosed = () => {
  editedFolderPath.value = null;
};

const folderDeleted = () => {
  loadAssets();
};

const uploadsUpdated = (data) => {
  uploads.value = data;
};

const sortBy = (sort) => {
  if (isSearching.value) return;

  let order = "asc";

  // If the current sort order was clicked again, change the direction.
  if (sort.value === sort) {
    order = sortOrder.value === "asc" ? "desc" : "asc";
  }

  sort.value = sort;
  sortOrder.value = order;
  loadAssets();
};

Events.$on("close-editor", () => {
  if (editorHasChild.value) {
    return Events.$emit("close-child-editor");
  }
  showFolderCreator.value = false;
  editedAssetId.value = null;
  editedFolderPath.value = null;
});

Events.$on("refresh-assets", () => {
  loadAssets();
});

Events.$on("delete-assets", (ids) => {
  deleteAsset(ids);
});

//watchers
watch(searchTerm, (term) => {
  if (term.length >= 3) {
    search();
  } else {
    loadAssets();
  }
});
/**
 * When selected assets are updated/modified, the parent component should be notified.
 */

watch(assetsSelected, (selections) => {
  emit("selections-updated", selections);
});

/**
 * When the selected path prop has changed, the parent component
 * has indicated that a different set of assets should be shown.
 */
watch(
  () => props.selectedPath,
  (p) => {
    path.value = p;
  }
);

/**
 * When the selected container prop has changed, the parent component
 * has indicated that a different set of assets should be shown.
 */
watch(
  () => props.selectedContainer,
  (con) => {
    container.value = containers.value[con];
  }
);

/**
 * Whenever the fullPath computed property is changed, it means
 * that either the path or the container has been modified,
 * so then a new set of assets should be displayed.
 */
watch(fullPath, () => {
  loadAssets();
});

defineExpose({ assets, asset, uploadFile, sortOrder, sort, listingComponent });

onMounted(() => {
  loadContainers();
});

onBeforeUnmount(() => {
  Events.$off("asset-doubleclicked");
  Events.$off("close-child-editor");
  Events.$off("refresh-assets");
  Events.$off("delete-assets");
  Events.$off("close-editor");
});
</script>

<style>
.depressed {
  background: rgba(0, 0, 0, 0.02);
}

.assets-search {
  @apply p-2 focus:ring-indigo-500 focus:border-indigo-500 block w-full pl-9 sm:text-sm border-gray-300 rounded-md;
}
</style>
