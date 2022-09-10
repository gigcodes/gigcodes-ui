<template>
  <div class="asset-tile is-folder" @click.prevent="selectFolder(folder)">
    <div class="asset-thumb-container">
      <file-icon extension="folder"></file-icon>
    </div>

    <div class="asset-meta">
      <div class="asset-filename" :title="folder.title">
        {{ folder.title }}
      </div>
    </div>
  </div>
</template>

<script>
import Folder from "./Folder";
import FileIcon from "../../../FileIcon.vue";

export default {
  components: { FileIcon },
  mixins: [Folder],
};
</script>
