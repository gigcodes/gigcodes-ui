<template>
  <div ref="root" class="form-group assets-fieldtype">
    <div class="field-inner">
      <label class="block text-sm font-medium mb-1"
        >{{ name }}
        <span v-if="required" class="text-red-500">*</span>
      </label>
      <div
        class="assets-fieldtype"
        :class="{
          'max-files-reached': maxFilesReached,
          empty: !assets.length,
          solo: soloAsset,
        }"
        @dragover.prevent="dragOver"
        @dragleave.prevent="dragStop"
        @drop.prevent="dragStop"
      >
        <loading-graphic v-if="loading" />

        <div
          v-if="
            containerSpecified &&
            !innerDragging &&
            draggingFile &&
            !showSelector
          "
          class="drag-notification"
        >
          <i class="icon icon-download" />
          <h3>Drop to upload</h3>
        </div>
        <template v-if="!loading">
          <div v-if="!maxFilesReached" class="manage-assets">
            <div v-if="!containerSpecified">
              <i class="icon icon-warning" />
              No asset container specified
            </div>

            <template v-else>
              <btn
                class="border border-slate-300 hover:border-indigo-300 mr-2"
                type="tertiary"
                tabindex="0"
                @keyup.space.enter="openSelector"
                @clicked="openSelector"
              >
                <span
                  class="text-slate-600 icon icon-folder-images mr-2"
                />Browse assets
              </btn>
              <btn
                type="tertiary"
                class="border border-slate-300 hover:border-indigo-300 mr-2"
                @clicked="uploadFile"
              >
                <span class="icon icon-upload-to-cloud mr-2" />
                Upload
              </btn>

              <p>or drag or drop files</p>
            </template>
          </div>

          <uploader
            v-if="containerSpecified && !showSelector"
            ref="uploaderEl"
            :dom-element="uploadElement"
            :container="container"
            :path="folder"
            @updated="uploadsUpdated"
            @upload-complete="uploadComplete"
          >
          </uploader>

          <UploadsComponent v-if="uploads.length" :uploads="uploads" />

          <template v-if="expanded && !soloAsset">
            <div
              v-if="displayMode === 'grid'"
              ref="assetContainer"
              class="asset-grid-listing"
            >
              <asset-tile
                v-for="asset in assets"
                :key="asset.id"
                :asset="asset"
                :data-id="asset.id"
                @removed="assetRemoved"
              />
            </div>

            <div v-if="displayMode === 'list'" class="asset-table-listing">
              <table>
                <tbody ref="assetContainer">
                  <asset-row
                    v-for="(asset, i) in assets"
                    :key="i"
                    :asset="asset"
                    @removed="assetRemoved"
                  >
                  </asset-row>
                </tbody>
              </table>
            </div>
          </template>

          <div
            v-if="expanded && soloAsset"
            ref="assetContainer"
            class="asset-solo-container"
          >
            <asset-tile
              v-for="asset in assets"
              :key="asset.id"
              :asset="asset"
              @removed="assetRemoved"
            >
            </asset-tile>
          </div>
        </template>

        <selector
          v-if="showSelector"
          :container="container"
          :folder="folder"
          :restrict-navigation="restrictNavigation"
          :selected="selectedAssets"
          :view-mode="selectorViewMode"
          :max-files="maxFiles"
          :can-edit="config.canEdit ?? false"
          @selected="assetsSelected"
          @closed="closeSelector"
        >
        </selector>
      </div>
    </div>
  </div>
</template>

<script setup>
import AssetRow from "./AssetRow.vue";
import AssetTile from "./AssetTile.vue";
import Selector from "../../assets/Selector.vue";
import Uploader from "../../assets/Uploader.vue";
import UploadsComponent from "../../assets/Uploads.vue";
import { findIndex, findWhere, map } from "underscore";
import { computed, inject, nextTick, onMounted, ref, watch } from "vue";
import Cookies from "js-cookie";
import LoadingGraphic from "../../LoadingGraphic.vue";
import { createToaster } from "../../../plugins/toaster";
import Btn from "../../buttons/Button.vue";
import Sortable from "sortablejs";
import Events from "../../../modules/events";

Array.prototype.swap = function (x, y) {
  let b = this[x];
  this[x] = this[y];
  this[y] = b;
  return this;
};

const emit = defineEmits([
  "focus",
  "blur",
  "input",
  "meta-updated",
  "replicator-preview-updated",
  "update:data",
  "changesMade",
]);

const props = defineProps({
  name: { type: String, default: null },
  data: {
    type: [Object, Array],
    default: () => [],
  },
  config: {
    type: Object,
    default: () => {},
  },
  handle: { type: String, default: null },
  required: { type: Boolean, required: false },
  meta: {
    type: Object,
    default: () => {},
  },
  leaveAlert: { type: Boolean, default: false },
  readOnly: { type: Boolean, default: false },
  namePrefix: { type: String, default: null },
  errorKeyPrefix: { type: String, default: null },
});

const root = ref(null);
const assetContainer = ref(null);
const uploaderEl = ref(null);
const assets = ref([]);
const uploads = ref([]);
const loading = ref(true);
const showSelector = ref(false);
const selectorViewMode = ref(null);
const draggingFile = ref(false);
const draggingNonFile = ref(false);
const innerDragging = ref(false);
const changeWatcherIsBound = ref(false);
const changeWatcherWatchDeep = ref(true);
const displayMode = ref("grid");
const data = ref(props.data);
const toast = createToaster();

/**
 * Injection of axios routes
 */

const getService = inject("getMediaService");

//end of injections

//detect file dragging
const dragOver = () => {
  if (!draggingNonFile.value) {
    draggingFile.value = true;
  }
};

const dragStop = (event) => {
  draggingFile.value = false;
  handleDrop(event);
};

watch(
  assets,
  (value) => {
    emit("update:data", value);
  },
  { deep: true }
);

const handleDrop = (event) => {
  if (uploaderEl.value) {
    const files = event.dataTransfer.files;
    if (files.length > 0) uploaderEl.value.uploadFile(event.dataTransfer.files);
  }
};

/**
 * The initial container to be displayed in the selector.
 */
const container = computed(() => props.config.container);

/**
 * The initial folder to be displayed in the selector.
 */
const folder = computed(() => props.config.folder || "/");

/**
 * If an asset container has been specified in the config.
 */

const containerSpecified = computed(() => props.config.container != null);

/**
 * Whether assets should be restricted to the specified container
 * and folder. This will prevent navigation to other places.
 */

const restrictNavigation = computed(() => props.config.restrict || false);

/**
 * The maximum number of files allowed.
 */
const maxFiles = computed(() => {
  if (!props.config.max_files) return 0;
  return parseInt(props.config.max_files);
});

/**
 * Whether the maximum number of files have been selected.
 */
const maxFilesReached = computed(() => {
  if (maxFiles.value === 0) return false;

  return assets.value.length >= maxFiles.value;
});

/**
 * True if a single asset.
 */
const soloAsset = computed(() => maxFiles.value === 1);

/**
 * The selected assets.
 *
 * The asset browser expects an array of asset IDs to be passed in as a prop.
 */
const selectedAssets = computed(() => {
  // If the value has an :: it's already an ID and we can return as-is.
  // Otherwise, we need to find the ID from the corresponding asset.
  return map(props.data, (value) => {
    return value.id.includes("::")
      ? value.id
      : findWhere(assets.value, { id: value.id }).id;
  });
});

/**
 * Whether the fieldtype is in the expanded UI state.
 */
const expanded = computed(() => assets.value.length > 0);

const uploadElement = computed(() => root.value);

/**
 * Methods
 *
 */

/**
 * Get asset data from the server
 *
 * Accepts an array of asset URLs and/or IDs.
 */
const loadAssets = (d) => {
  loading.value = true;

  if (!d || !d.length) {
    loading.value = false;
    assets.value = [];
    return;
  }

  try {
    getService({ items: d }).then((response) => {
      assets.value = response.data.assets;
      loading.value = false;
      nextTick(() => {
        // Juggle the data to make parent components notice something changed.
        // This makes nested replicators generate new preview text.
        data.value = [];
        data.value = props.data;
        sortable();
        bindChangeWatcher();
      });
    });
  } catch (e) {
    console.log(e);
    if (d.length) toast.show("Unable to load assets");
  }
};

/**
 * When a admin has finished selecting items in the browser.
 *
 * We should update the fieldtype with any selections.
 */

const assetsSelected = (selections) => {
  loadAssets(selections);
};

/**
 * Show the file upload finder window.
 */
const uploadFile = () => {
  uploaderEl.value.browse();
};

/**
 * When the uploader component has modified the uploads array
 */
const uploadsUpdated = (items) => {
  uploads.value = items;
};

/**
 * When the uploader component has finished uploading a file.
 */
const uploadComplete = (asset) => {
  assets.value.push(asset);
  sortable();
};

onMounted(() => {
  displayMode.value = props.config.mode || "grid";
  selectorViewMode.value =
    Cookies.get("gigcodes.assets.listing_view_mode") || "grid";

  // We only have URLs in the field data, so we'll need to request the asset data from the server.
  loadAssets(props.data);
});

const bindChangeWatcher = () => {
  if (!props.leaveAlert) return;
  if (changeWatcherIsBound.value) return;
  watch(data, () => emit("changesMade", true), {
    deep: changeWatcherWatchDeep.value,
  });
  changeWatcherIsBound.value = true;
};

/**
 * Open the asset selector modal
 */

const openSelector = () => {
  showSelector.value = true;
  root.value.hideOverflow = true;
};

/**
 * Close the asset selector modal
 */
const closeSelector = () => {
  showSelector.value = false;
  root.value.hideOverflow = false;
};

/**
 * When an asset remove button was clicked.
 */
const assetRemoved = (asset) => {
  const index = findIndex(assets.value, { id: asset.id });
  assets.value.splice(index, 1);
  if (maxFiles.value === 1) {
    uploaderEl.value.fileInput.value = "";
  }
};

const sortable = () => {
  if (maxFiles.value === 1) return;
  if (assetContainer.value) {
    new Sortable(assetContainer.value, {
      preventOnFilter: true,
      dataIdAttr: "data-id",
      onStart: () => {
        innerDragging.value = true;
      },
      onEnd: (evt) => {
        assets.value.swap(evt.oldIndex, evt.newIndex);
        emit("update:data", assets.value);
        innerDragging.value = false;
      },
    });
  }
};

Events.$on("close-selector", closeSelector);
</script>

<style lang="scss">
.asset-listing-uploads {
  border: 1px dashed #ccc;
  border-top: 0;
  margin: 0;
  padding: 10px 20px;

  table {
    margin: 0;
  }

  thead {
    display: none;
  }

  tr:first-child {
    border-top: 0;
  }
}
</style>
