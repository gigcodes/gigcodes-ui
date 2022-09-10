<template>
  <tr @drop="drop">
    <td @click.prevent="selectFolder(folder)">
      <div class="img">
        <a href="">
          <file-icon extension="folder"></file-icon>
        </a>
      </div>
    </td>

    <td @click.prevent="selectFolder(folder)">
      <a>
        {{ folder.title }}
      </a>
    </td>

    <td
      colspan="2"
      class="extra-col"
      @click.prevent="selectFolder(folder)"
    ></td>

    <td class="column-actions">
      <div
        v-click-away="away"
        class="btn-group action-more"
        :class="{ show: showActionsDropdown }"
      >
        <button
          type="button"
          class="btn-more dropdown-toggle"
          aria-haspopup="true"
          :aria-expanded="showActionsDropdown"
          @click="toggleActions"
        >
          <i class="icon icon-dots-three-vertical"></i>
        </button>

        <ul class="dropdown-menu" :class="{ show: showActionsDropdown }">
          <li>
            <a
              class="text-gray-700 hover:bg-gray-100 hover:text-gray-900 block px-4 py-1 text-sm"
              href=""
              @click.prevent="editFolder"
            >
              Edit
            </a>
          </li>

          <li class="divider"></li>

          <li class="warning">
            <a
              class="text-gray-700 hover:bg-rose-600 hover:text-white block px-4 py-1 text-sm"
              href="#"
              @click.prevent="deleteFolder"
            >
              Delete
            </a>
          </li>
        </ul>
      </div>
    </td>
  </tr>
</template>

<script>
import Folder from "./Folder";
import Row from "./Row";
import FileIcon from "../../../FileIcon.vue";
import { mixin as clickaway } from "../../../../plugins/click-away";

export default {
  components: { FileIcon },
  mixins: [Folder, Row, clickaway],
  emits: [
    "selected",
    "editing",
    "deleting",
    "dropped-on-folder",
    "close-dropdown",
    "open-dropdown",
  ],
};
</script>

<style>
.dropdown-menu {
  right: 10px;
}
</style>
