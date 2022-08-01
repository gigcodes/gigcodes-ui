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
      <select
          :id="id"
          class="form-select w-full"
          :autofocus="autofocus"
          :required="required"
          :aria-readonly="readonly"
          :disabled="disabled"
          :class="className"
          @change="updateSelf($event)"
          @keyup="$emit('keyup', $event)"
          @blur="handleBlur"
      >
        <option v-if="placeholder" selected value="">
          {{ placeholder }}
        </option>
        <option
            v-for="(option, key) in options" :key="key"
            :value="key"
            :selected="key == modelValue"
        >
          {{ option }}
        </option>
      </select>
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
import Fieldtypes from "./index";
import Input from "./customInput";
import {Tooltip} from "../../index";
export default {
  name: "SelectField",
  components:{Tooltip},
  mixins: [Fieldtypes, Input],
  props: {
    options: {
      type: Object,
      default: () => {
      }
    }
  },
  emits: ["change", "blur", "keyup", "update:modelValue"],
  setup(props, {emit}) {
    const handleChange = (event) => {
      emit("change", event);
    };
    const handleBlur = (event) => {
      emit("blur", event);
    };
    const updateSelf = (event) => {
      handleChange(event)
      emit("update:modelValue", event.target.value);
    }
    return {
      handleChange,
      handleBlur,
      updateSelf
    };
  },
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
};
</script>

<style scoped></style>
