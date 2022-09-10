export default {
  props: {
    state: {
      type: String,
      default: null,
    },
    type: {
      type: String,
      default: "primary",
    },
    size: {
      type: String,
      default: "normal",
    },
    disabled: {
      type: Boolean,
      default: false,
    },
    loading: {
      type: Boolean,
      default: false,
    },
    extraClass: {
      type: String,
      default: null,
    },
  },
};
