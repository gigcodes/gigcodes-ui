import { Luminous } from "luminous-lightbox";
import AssetEditor from "../../assets/Editor/Editor.vue";
import { computed, onMounted, ref } from "vue";

export default {
  components: {
    AssetEditor,
  },

  props: {
    asset: {
      type: Object,
      required: true,
    },
    readOnly: {
      type: Boolean,
      default: false,
    },
    canEdit: {
      type: Boolean,
      default: false,
    },
    showFilename: {
      type: Boolean,
      default: true,
    },
  },

  properties(props, { emit }) {
    const isImage = computed(() => {
      return props.asset.is_image;
    });

    const el = ref(null);

    const canShowSvg = computed(() => {
      return props.asset.extension === "svg";
    });

    const canBeTransparent = computed(() => {
      return ["png", "svg"].includes(props.asset.extension);
    });

    const thumbnail = computed(() => {
      return props.asset.thumbnail;
    });

    const label = computed(() => {
      return props.asset.basename;
    });

    const toenail = computed(() => {
      return props.asset.toenail;
    });

    const editing = ref(false);

    const edit = () => {
      if (props.readOnly) return;
      editing.value = true;
    };

    const remove = () => {
      if (props.readOnly) return;
      emit("removed", props.asset);
    };

    const makeZoomable = () => {
      const element = el.value.getElementsByClassName("zoom")[0];
      if (!element || !isImage.value) return;
      new Luminous(element, {
        closeOnScroll: true,
        captionAttribute: "title",
      });
    };

    const closeEditor = () => {
      editing.value = false;
    };

    onMounted(() => {
      makeZoomable();
    });

    const assetSaved = (asset) => {
      emit("update", asset);
      closeEditor();
    };

    return {
      isImage,
      label,
      thumbnail,
      canBeTransparent,
      canShowSvg,
      edit,
      assetSaved,
      closeEditor,
      makeZoomable,
      remove,
      editing,
      el,
      toenail,
    };
  },
};
