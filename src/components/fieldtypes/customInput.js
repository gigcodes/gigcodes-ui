export default {
  emits: ["update:modelValue", "update:slug"],
  props: {
    modelValue: {
      type: [Number, String],
    },
  },
  methods: {
    updateSelf(title) {
      this.$emit("update:modelValue", title);
    },
  },
};
