<template>
  <div :class="classes">
    <div>
      <div class="flex items-center justify-between">
        <label class="block text-sm font-medium" :for="id"
        >{{ name }}
          <span v-if="required" class="text-red-500">*</span></label
        >
        <tooltip v-if="tooltip" class="ml-2" bg="dark" size="md">
          <div class="text-sm text-gray-200">{{ tooltip }}</div>
        </tooltip>
      </div>
      <textarea
          :id="id"
          :value="modelValue"
          :autofocus="autofocus"
          :required="required"
          :readonly="readonly"
          :placeholder="placeholder"
          :disabled="disabled"
          class="form-input w-full"
          :class="className"
          :rows="rows"
          @input="updateSelf($event.target.value)"
          @keyup="$emit('keyup', $event)"
          @blur="handleBlur"
          @change="handleChange"
      ></textarea>
    </div>
    <div v-if="help" class="text-xs mt-1">{{ help }}</div>
    <div v-if="hasSuccess" class="text-xs mt-1 text-green-500">
      {{ hasSuccess }}
    </div>
    <div v-if="hasError" class="text-xs mt-1 text-red-500">
      {{ hasError }}
    </div>
  </div>
</template>

<script>
import FieldType from "./index";
import Input from "./customInput";
import {Tooltip} from "../../index";

export default {
  name: "TextAreaField",
  mixins: [FieldType, Input],
  components: {Tooltip},

  props: {
    rows: {
      default: "10",
      type: String
    }
  },
  emits: ["update:modelValue", "keyup", "blur", "change", "focus"],
  computed: {
    className() {
      let classes = "";
      if (this.disabled) {
        classes =
            classes +
            "disabled:border-gray-200 disabled:bg-gray-100 disabled:text-gray-400 disabled:cursor-not-allowed ";
      }
      if (this.hasError) {
        classes = classes + "border-red-300 ";
      }
      if (this.hasSuccess) {
        classes = classes + "border-green-300 ";
      }
      if (this.suffix) {
        classes = classes + "pr-8 ";
      }
      if (this.prefix) {
        classes = classes + "pl-12";
      }
      return classes;
    },
  },
  methods: {
    updateSelf(title) {
      this.$emit("update:modelValue", title);
    },
    handleChange(event) {
      this.$emit("change", event.target.value);
    },
    handleBlur(event) {
      this.$emit("blur", event);
    },
  },
};
</script>

<style scoped></style>
