<template>
  <div class="asset-selector-modal">
    <div class="asset-selector shadow rounded-lg">
      <asset-browser
          ref="assetBrowser"
          :selected-container="container"
          :selected-path="folder"
          :selected-assets="browserSelections"
          :restrict-navigation="restrictNavigation"
          :max-files="maxFiles"
          @selections-updated="selectionsUpdated"
          @asset-doubleclicked="select"
          :can-edit="canEdit"
      >
        <template v-if="browserSelections.length">
          <button
              class="btn action mb-3"
              @click="browserSelections = []"
          >
            Uncheck all
          </button>
        </template>
      </asset-browser>
      <div class="p-3 text-right border-t border-gray-200 bg-gray-50 rounded-b-lg">
        <div v-if="browserSelections.length" class="float-left mt-2">
          {{ browserSelections.length }}<span v-if="maxFiles">/{{ maxFiles }}</span> Selected
        </div>
        <button
            type="button"
            @click="close"
            class="close-btn">
          Cancel
        </button>
        <button
            type="button"
            @click="select"
            class="select-btn">
          Select
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import {default as AssetBrowser} from "./Browser/Browser.vue";

export default {
  emits: ["modal.open", "selected", "closed"],
  components: {
    AssetBrowser
  },
  props: {
    container: {
      type: String,
      default: null
    },
    folder: {
      type: String,
      default: null
    },
    selected: {
      type: Array,
      default: () => ([])
    },
    maxFiles: {
      type: Number,
      default: null
    },
    restrictNavigation: {
      type: Boolean,
      default: false,
    },
    canEdit: {
      type: Boolean,
      default: false,
    }
  },

  data() {
    return {
      // We will initialize the browser component with the selections, but not pass in the selections directly.
      // We only want selection changes to be reflected in the fieldtype once the admin is ready to commit
      // them. They should be able to cancel at any time and have their updated selections discarded.
      browserSelections: this.selected,
    };
  },

  mounted() {
    this.$emit("modal.open");
  },

  methods: {
    /**
     * Confirm the updated selections
     */
    select: function () {
      this.$emit("selected", this.browserSelections);
      this.close();
    },

    /**
     * Close this selector
     */
    close() {
      this.$emit("closed");
    },

    /**
     * Selections have been updated within the browser component.
     */
    selectionsUpdated(selections) {
      this.browserSelections = selections;
    },
  },
};
</script>
<style scoped>
.select-btn {
  @apply ml-2 items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-cyan-600 hover:bg-cyan-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-cyan-500;
}

.close-btn {
  @apply items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-cyan-500;
}
</style>
