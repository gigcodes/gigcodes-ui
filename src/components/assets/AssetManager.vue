<template>
  <div class="asset-manager">
    <asset-browser
      :selected-container="container"
      :selected-path="activePath"
      :selected-assets="selectedAssets"
      @navigated="navigate"
      @selections-updated="updateSelections"
    >
      <template v-if="selectedAssets.length">
        <button class="btn btn-danger ml-16 mr-2 mb-3" @click="deleteSelected">
          Delete
        </button>
        <div class="btn-group mb-3">
          <button class="btn" @click="selectedAssets = []">Uncheck all</button>
          <button class="btn" @click="openAssetMover">Move</button>
        </div>
      </template>
    </asset-browser>
    <mover
      v-if="showAssetMover"
      :assets="selectedAssets"
      :container="activeContainer"
      :folder="activePath"
      @saved="assetsMoved"
      @closed="closeAssetMover"
    >
    </mover>
  </div>
</template>

<script>
import { Events } from "../../index";
import Mover from "./Mover.vue";
import { onBeforeUnmount, onMounted, ref } from "vue";
import AssetBrowser from "./Browser/Browser.vue";
export default {
  name: "AssetManager",
  components: { Mover, AssetBrowser },
  props: {
    container: {
      type: String,
      default: null,
    },
    path: {
      type: String,
      default: null,
    },
  },

  setup(props) {
    const selectedAssets = ref([]);
    const showAssetMover = ref(false);
    const activePath = ref(props.path);
    const activeContainer = ref(props.container);

    /**
     * Bind browser navigation features
     *
     * This will initialize the state for using the history API to allow
     * navigation back and forth through folders using browser buttons.
     */
    const bindBrowserNavigation = () => {
      window.history.replaceState(
        {
          container: this.container,
          path: this.activePath,
        },
        ""
      );
      window.onpopstate = (e) => {
        activeContainer.value = e.state.container;
        activePath.value = e.state.path;
      };
    };

    /**
     * Push a new state onto the browser's history
     */
    const pushState = () => {
      let url = "/admin/media/browse/" + activeContainer.value;

      if (activePath.value !== "/") {
        url += "/" + activePath.value;
      }
      window.history.pushState(
        { container: activeContainer.value, path: activePath.value },
        "",
        url
      );
    };

    /**
     * When admin has navigated to another folder or container
     */
    const navigate = (container, path) => {
      activeContainer.value = container;
      activePath.value = path;
      pushState();

      // Clear out any selections. It would be confusing to navigate to a different
      // folder and/or container, perform an action, and discover you performed
      // it on an asset that was still selected, but no longer visible.
      selectedAssets.value = [];
    };

    /**
     * When selections are changed, we need them reflected here.
     */
    const updateSelections = (selections) => {
      selectedAssets.value = selections;
    };

    const openAssetMover = () => {
      showAssetMover.value = true;
    };

    const deleteSelected = () => {
      Events.$emit("delete-assets", selectedAssets.value);
    };

    const closeAssetMover = () => {
      showAssetMover.value = false;
    };

    const assetsMoved = (folder) => {
      closeAssetMover();
      navigate(activeContainer.value, folder);
    };

    onMounted(() => {
      bindBrowserNavigation();
    });

    onBeforeUnmount(() => {
      Events.$off("delete-assets");
    });

    return {
      selectedAssets,
      showAssetMover,
      activeContainer,
      activePath,
      pushState,
      bindBrowserNavigation,
      navigate,
      updateSelections,
      openAssetMover,
      deleteSelected,
      closeAssetMover,
      assetsMoved,
    };
  },
};
</script>
