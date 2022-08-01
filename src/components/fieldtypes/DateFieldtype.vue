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
      <div class="relative">
        <flat-pickr
            :id="id"
            v-model="date"
            class="form-input pl-9 text-slate-500 hover:text-slate-600 font-medium focus:border-slate-300 w-full"
            :config="DFconfig"
            @on-change="changed()"
        ></flat-pickr>
        <div
            class="absolute inset-0 right-auto flex items-center pointer-events-none"
        >
          <svg
              class="w-4 h-4 fill-current text-slate-500 ml-3"
              viewBox="0 0 16 16"
          >
            <path
                d="M15 2h-2V0h-2v2H9V0H7v2H5V0H3v2H1a1 1 0 00-1 1v12a1 1 0 001 1h14a1 1 0 001-1V3a1 1 0 00-1-1zm-1 12H2V6h12v8z"
            />
          </svg>
        </div>
      </div>
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
import flatPickr from "../../plugins/flatpicker";
import Fieldtypes from "./index";
import {Tooltip} from "../../index";

export default {
  name: "DateField",
  components: {
    flatPickr,
    Tooltip
  },
  mixins: [Fieldtypes],
  props: {
    config: {
      default: function () {
        return {
          mode: "range",
          dateFormat: "M j, Y",
          defaultDate: null,
        };
      },
      type: Object,
    },
    modelValue: {
      type: String,
      default: null
    },
  },
  emits: ["update:modelValue"],
  data(props) {
    return {
      date: props.modelValue,
      DFconfig: {
        mode: props.config.mode,
        static: true,
        monthSelectorType: "static",
        dateFormat: props.config.dateFormat,
        defaultDate: props.config.defaultDate,
        prevArrow:
            '<svg class="fill-current" width="7" height="11" viewBox="0 0 7 11"><path d="M5.4 10.8l1.4-1.4-4-4 4-4L5.4 0 0 5.4z" /></svg>',
        nextArrow:
            '<svg class="fill-current" width="7" height="11" viewBox="0 0 7 11"><path d="M1.4 10.8L0 9.4l4-4-4-4L1.4 0l5.4 5.4z" /></svg>',
        onReady: (selectedDates, dateStr, instance) => {
          instance.element.value = dateStr.replace("to", "-");
          const customClass = props.config.align
              ? props.config.align
              : "";
          instance.calendarContainer.classList.add(
              `flatpickr-${customClass}`
          );
        },
        onChange: (selectedDates, dateStr, instance) => {
          instance.element.value = dateStr.replace("to", "-");
        },
      },
    };
  },
  methods: {
    changed() {
      this.updateSelf(this.date);
    },
    updateSelf(title) {
      this.$emit("update:modelValue", title);
    },
  },
};
</script>

<style>
.flatpickr-wrapper {
  width: 100%;
}
</style>
