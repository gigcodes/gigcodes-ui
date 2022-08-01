<template>
    <div
        class="asset-tile"
        :class="{
            'is-image': isImage && !canShowSvg,
            'is-svg': canShowSvg,
            'is-file': !isImage && !canShowSvg,
            'is-selected': isSelected,
        }"
        :title="asset.filename"
        @click="toggle"
        @dblclick="doubleClicked"
        @dragstart="assetDragStart"
    >
        <div class="asset-thumb-container">
            <div
                v-if="canShowSvg"
                class="svg-img"
                :style="svgBackgroundStyle"
            ></div>
            <template v-else>
                <div v-if="isImage" class="asset-thumb">
                    <img :src="asset.thumbnail" />
                </div>
                <file-icon v-else :extension="asset.extension" />
            </template>
        </div>

        <div class="asset-meta" :title="label">{{ label }}</div>
    </div>
</template>

<script>
import Asset from "./Asset";
import FileIcon from "../../../FileIcon.vue";

export default {
  components: {FileIcon},
  mixins: [Asset],

    computed: {
        isImage() {
            return this.asset.is_image;
        },

        icon() {
            return `/img/filetypes/${this.asset.extension}.png`;
        },

        label() {
            return this.asset.title || this.asset.basename;
        },
    },
};
</script>
