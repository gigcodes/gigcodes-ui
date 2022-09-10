<template>
  <tr :class="{ selected: isSelected }" @click="toggle">
    <td class="thumbnail-col" @dragstart="assetDragStart">
      <div
        v-if="canShowSvg"
        class="img svg-img"
        :style="svgBackgroundStyle"
      ></div>
      <div v-else class="img">
        <img v-if="asset.is_image" :src="asset.thumbnail" alt="" />
        <file-icon v-else :extension="asset.extension" />
      </div>
    </td>

    <td class="title-col">{{ asset.basename }}</td>
    <td class="size-col extra-col">{{ asset.size_formatted }}</td>
    <td class="modifed-col extra-col">
      {{ asset.last_modified_formatted }}
    </td>

    <td class="column-actions">
      <div class="btn-group action-more">
        <button
          type="button"
          class="btn-more dropdown-toggle"
          aria-haspopup="true"
          aria-expanded="false"
          @click="showActionsDropdown = !showActionsDropdown"
        >
          <i class="icon icon-dots-three-vertical"></i>
        </button>
        <ul class="dropdown-menu" :class="{ show: showActionsDropdown }">
          <li v-if="canEdit">
            <a
              href="#"
              class="text-gray-700 hover:bg-gray-100 hover:text-gray-900 block px-4 py-1 text-sm"
              @click="closeDropdownAndEditAsset"
              >Edit</a
            >
          </li>
          <li class="divider"></li>
          <li class="warning">
            <a
              href="#"
              class="text-gray-700 hover:bg-rose-600 hover:text-white block px-4 py-1 text-sm"
              @click.prevent="closeDropdownAndDeleteAsset"
              >Delete</a
            >
          </li>
        </ul>
      </div>
    </td>
  </tr>
</template>

<script>
import Asset from "./Asset";
import Row from "./Row";
import FileIcon from "../../../FileIcon.vue";

export default {
  components: {
    FileIcon,
  },
  mixins: [Asset, Row],

  methods: {
    closeDropdownAndEditAsset() {
      this.showActionsDropdown = false;
      this.editAsset();
    },

    closeDropdownAndDeleteAsset() {
      this.showActionsDropdown = false;
      this.deleteAsset();
    },
  },
};
</script>
