<template>
  <div
      ref="el"
      class="asset-tile"
      :class="{
            'is-image': isImage && !canShowSvg,
            'is-svg': canShowSvg,
            'is-file': !isImage && !canShowSvg,
        }"
      :title="asset.filename"
  >
    <asset-editor
        v-if="editing"
        :id="asset.id"
        :allow-deleting="false"
        @closed="closeEditor"
        @saved="assetSaved"
    >
    </asset-editor>

    <div class="asset-thumb-container">
      <div
          class="asset-thumb"
          :class="{ 'bg-checkerboard': canBeTransparent }"
      >
        <!-- Solo Bard -->
        <template v-if="isImage && isInBardField && !isInAssetBrowser">
          <img :src="asset.url" :alt="asset.basename"/>
        </template>

        <template v-else>
          <a v-if="isImage" :href="toenail" class="zoom"  :title="label">
            <img :src="thumbnail" :alt="asset.basename"/>
          </a>

          <template v-else>
            <div
                v-if="canShowSvg"
                class="svg-img"
                :style="'background-image:url('+asset.url+')'">
            </div>
            <file-icon v-else type="div" :extension="asset.extension"></file-icon>
          </template>
        </template>

        <div v-if="!readOnly" class="asset-controls">
          <button
              v-if="canEdit"
              class="btn btn-icon icon icon-pencil"
              @click="edit"
          ></button>

          <btn size="sm" type="dangerFill" @click="remove"><i class="icon icon-trash"></i></btn>
        </div>
      </div>
    </div>

    <div v-if="showFilename" class="asset-meta">
      <div class="asset-filename" :title="label">{{ label }}</div>
    </div>
  </div>
</template>

<script>
import asset from "./Asset";
import FileIcon from "../../FileIcon.vue";
import {computed, getCurrentInstance} from "vue";
import {Btn} from "../../../index";
export default {
  props: {
    ...asset.props
  },
  components: {
    FileIcon,
    Btn,
    ...asset.components
  },
  emits: ["removed"],
  setup(props, app) {
    const {
      isImage, label, thumbnail, canBeTransparent, canShowSvg, edit,
      assetSaved, closeEditor, makeZoomable, remove, editing, el, toenail
    } = asset.properties(props, app)
    const instance = getCurrentInstance()
    const isInAssetBrowser = computed(() => {
      const parent = instance.parent
      if (!parent) return false;
      if (parent.type.name === "AssetBrowser") {
        return true;
      }
      return instance === parent
    })

    const isInBardField = computed(() => {
      return false
    })

    return {
      isInAssetBrowser, isImage, label, thumbnail, canBeTransparent, canShowSvg, edit,
      assetSaved, closeEditor, makeZoomable, remove, editing, isInBardField, el, toenail
    }
  }
}
</script>
