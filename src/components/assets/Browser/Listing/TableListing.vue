<template>
  <div class="asset-table-listing gigcodes">
    <table v-if="!isSearching || (isSearching && hasResults)" class="w-full">
      <thead>
      <tr>
        <th></th>
        <th
            v-for="(column, index) in columns"
            :key="index"
            :class="{'extra-col': column.extra,active: isColumnActive(column),'column-sortable': !isSearching}"
            @click="$emit('sorted', column.field)"
        >
          {{ column.label }}
          <i
              v-if="isColumnActive(column)"
              :class="sortOrder === 'asc'? 'icon icon-chevron-up': 'icon icon-chevron-down'"/>
        </th>
        <th class="column-actions"></th>
      </tr>
      </thead>
      <tbody>
      <tr v-if="hasParent && !restrictNavigation">
        <td @click.prevent="selectFolder(folder.parent)">
          <div class="img">
            <a>
              <file-icon extension="folder"/>
            </a>
          </div>
        </td>
        <td>
          <a href="" @click.prevent="selectFolder(folder.parent)">..</a>
        </td>
        <td colspan="3">..</td>
      </tr>

      <folder-row
          v-for="(folderItem, index) in subfolders"
          :key="index"
          :folder="folderItem"
          @open-dropdown="closeDropdowns"
          @selected="selectFolder"
          @editing="editFolder"
          @deleting="deleteFolder"
          @dropped-on-folder="droppedOnFolder"
      ></folder-row>

      <asset-row
          v-for="asset in assets"
          :key="asset.id"
          :asset="asset"
          :selected-assets="selectedAssets"
          @open-dropdown="closeDropdowns"
          @selected="selectAsset"
          @deselected="deselectAsset"
          @editing="editAsset"
          @deleting="deleteAsset"
          @assetdragstart="assetDragStart"
          @doubleclicked="assetDoubleclicked"
          :can-edit="canEdit"
      ></asset-row>
      </tbody>
    </table>
  </div>
  <modal
      :open="deleteModal"
      @cancelled="deleteFolderItem(false)"
      @confirmed="deleteFolderItem(true)"
  >
    <template #header>
      Delete the folder selected ?
    </template>
    <template #body>
      On clicking confirm the selected item will be deleted. If
      you don't wish to do it then please press cancel.
    </template>
  </modal>
</template>

<script>
import AssetRow from "./AssetRow.vue";
import FolderRow from "./FolderRow.vue";
import FileIcon from "../../../FileIcon.vue";
import Modal from "../../../modal/Modal.vue";
import {createToaster} from "../../../../index"
import {inject, ref} from "vue";

export default {
  emits: ["sorted", "folder-deleted", "asset-deleting",
    "asset-deselected", "asset-editing", "asset-deselected",
    "assets-dragged-to-folder", "folder-selected", "asset-selected", "asset-doubleclicked", "folder-editing"],
  components: {
    FileIcon,
    AssetRow,
    FolderRow,
    Modal,
  },
  props: {
    container: {
      type: String,
      default: null
    },
    assets: {
      type: Array,
      default: () => ([])
    },
    folder: {
      type: Object,
      default: () => ({})
    },
    subfolders: {
      type: Array,
      default: () => ([])
    },
    loading: {
      default: true,
      type: Boolean
    },
    selectedAssets: {
      type: Array,
      default: () => ([])
    },
    restrictNavigation: {
      default: true,
      type: Boolean
    },
    isSearching: {
      default: true,
      type: Boolean
    },
    canEdit: {
      type: Boolean,
      default: false
    }

  },
  setup(_,{emit}) {
    const toast = createToaster()
    const deleteModal = ref(false);
    const deleteFolderSelected = ref(null);
    const deleteFolderService = inject("deleteFolderService")
    const deleteFolderItem = (type) => {
      if (type) {
        try {
          deleteFolderService(deleteFolderSelected.value.uuid).then(() => {
            toast.success('Folder deleted successfully');
            emit('folder-deleted')
            deleteModal.value = false;
          }).catch(() => {
            toast.error("Unable to delete the folder")
            deleteModal.value = false;
          })
        } catch (e) {
          toast.error("Unable to delete the folder")
          deleteModal.value = false;
          console.log("deleteFolderService is not registered")
        }
      } else {
        deleteModal.value = false;
        toast.info("Folder delete cancelled")
      }
    }

    return {
      deleteFolderItem, deleteModal, deleteFolderSelected
    }
  },
  data() {
    return {
      columns: [
        {
          field: "title",
          label: "Title",
        },
        {
          field: "size",
          label: "File Size",
          extra: true,
        },
        {
          field: "lastModified",
          label: "Date Modified",
          extra: true,
        },
      ],
    };
  },

  computed: {
    sortOrder() {
      return this.$parent.sortOrder;
    },
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
    closeDropdowns: function () {

    },


    droppedOnFolder(folder, e) {
      const asset = e.dataTransfer.getData("asset");
      e.dataTransfer.clearData("asset");
      // discard any drops that weren't started on an asset
      if (asset === "") return;
      this.$emit("assets-dragged-to-folder", folder);
    },

    isColumnActive(col) {
      if (this.isSearching) return false;
      return col.field === this.$parent.sort;
    },

    /**
     * Select a folder to navigate to.
     */
    selectFolder(folder) {
      this.$emit("folder-selected", folder);
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
    deleteFolder(folder) {
      this.deleteFolderSelected = folder;
      this.deleteModal = true;
    },

    assetDragStart(id) {
      this.selectAsset(id);
      this.draggingAssets = true;
    },
  },
};
</script>
