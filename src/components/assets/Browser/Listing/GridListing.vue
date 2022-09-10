<template>
  <div
    v-if="
      (hasParent && !restrictNavigation) ||
      !isSearching ||
      (isSearching && hasResults)
    "
    class="asset-grid-listing"
  >
    <div
      v-if="hasParent && !restrictNavigation"
      class="asset-tile is-folder"
      @click.prevent="selectFolder(folder.parent)"
    >
      <div class="asset-thumb-container">
        <file-icon extension="folder" />
      </div>
      <div class="asset-meta">
        <div class="asset-filename">..</div>
      </div>
    </div>

    <folder-tile
      v-for="(f, index) in subfolders"
      :key="index"
      :folder="f"
      @selected="selectFolder"
      @editing="editFolder"
      @deleting="deleteFolder"
    >
    </folder-tile>

    <asset-tile
      v-for="asset in assets"
      :key="asset.id"
      :asset="asset"
      :selected-assets="selectedAssets"
      @selected="selectAsset"
      @deselected="deselectAsset"
      @editing="editAsset"
      @doubleclicked="assetDoubleclicked"
    >
    </asset-tile>
  </div>
</template>

<script>
import AssetTile from "./AssetTile.vue";
import FolderTile from "./FolderTile.vue";
import FileIcon from "../../../FileIcon.vue";

export default {
  components: {
    FileIcon,
    AssetTile,
    FolderTile,
  },
  props: {
    container: {
      type: String,
      default: null,
    },
    assets: {
      type: Array,
      default: () => [],
    },
    folder: {
      type: Object,
      default: () => {},
    },
    subfolders: {
      type: Array,
      default: () => [],
    },
    loading: {
      default: true,
      type: Boolean,
    },
    selectedAssets: {
      type: Array,
      default: () => [],
    },
    restrictNavigation: {
      default: true,
      type: Boolean,
    },
    isSearching: {
      default: true,
      type: Boolean,
    },
    canEdit: {
      type: Boolean,
      default: false,
    },
  },
  emits: [
    "sorted",
    "folder-deleted",
    "asset-deleting",
    "asset-deselected",
    "asset-editing",
    "asset-deselected",
    "assets-dragged-to-folder",
    "folder-selected",
    "asset-selected",
    "asset-doubleclicked",
    "folder-editing",
  ],
  computed: {
    hasResults() {
      return this.assets.length || this.subfolders.length;
    },

    hasParent() {
      if (!this.folder) {
        return false;
      }

      return this.folder.parent_path !== null;
    },
  },

  methods: {
    /**
     * Select a folder to navigate to.
     */
    selectFolder(path) {
      this.$emit("folder-selected", path);
    },

    /**
     * Select (check) an asset.
     */
    selectAsset(id) {
      this.$emit("asset-selected", id);
    },

    /**
     * Deselect (uncheck) an asset.
     */
    deselectAsset(id) {
      this.$emit("asset-deselected", id);
    },

    /**
     * Trigger editing of this asset.
     */
    editAsset(id) {
      this.$emit("asset-editing", id);
    },

    /**
     * Trigger the deleting of this asset.
     */
    deleteAsset(id) {
      this.$emit("asset-deselected", id);
      this.$emit("asset-deleting", id);
    },

    assetDoubleclicked(asset) {
      this.$emit("asset-doubleclicked", asset);
    },

    /**
     * Trigger editing of this folder.
     */
    editFolder(path) {
      this.$emit("folder-editing", path);
    },

    /**
     * Delete a folder.
     */
    // eslint-disable-next-line no-unused-vars
    deleteFolder(folder) {
      //@todo add delete modal
      // swal({
      //     icon: "warning",
      //     title: "Are you sure",
      //     text: "Confirm delete folder",
      //     confirmButtonText: "Yes I am sure",
      //     cancelButtonText: "Cancel",
      //     buttons: true,
      //     dangerMode: true,
      // }).then((willDelete) => {
      //     if (willDelete) {
      //         this.$axios
      //             .delete(url, {
      //                 params: {
      //                     container: this.container,
      //                     folders: path,
      //                 },
      //             })
      //             .then((response) => {
      //                 this.$emit("folder-deleted", path);
      //                 this.saving = false;
      //                 this.$toast.success("Folder Deleted Successfully");
      //             });
      //     } else {
      //         this.$toast.default("Delete Cancelled");
      //     }
      // });
    },

    assetDragStart(id) {
      this.selectAsset(id);
      this.draggingAssets = true;
    },
  },
};
</script>
