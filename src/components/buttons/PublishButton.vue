<template>
  <div class="relative inline-flex publish">
    <Btn
      v-if="publishType === 'save'"
      ref="trigger"
      type="primary"
      :disabled="loading"
      @click="publishWithoutContinuing()"
      >{{ saveText }}
    </Btn>
    <Btn
      v-if="publishType === 'continue' && hasContinue"
      ref="trigger"
      type="primary"
      :disabled="loading"
      @click="publishAndContinue()"
      >{{ saveText }} and continue
    </Btn>
    <Btn
      v-if="
        allowSaveAndAddAnother && publishType === 'another' && hasAddAnother
      "
      ref="trigger"
      type="primary"
      :disabled="loading"
      @click="publishAndAnother()"
      >{{ saveText }}
      and add another
    </Btn>
    <Btn
      v-click-away="away"
      :state="state"
      type="primary"
      :size="size"
      :disabled="loading"
      class="dropdown"
      @click="toggle"
    >
      <svg
        class="h-5 w-5"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 20 20"
        fill="currentColor"
        aria-hidden="true"
      >
        <path
          fill-rule="evenodd"
          d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
          clip-rule="evenodd"
        />
      </svg>
    </Btn>
    <transition
      enter-active-class="transition ease-out duration-200 transform"
      enter-from-class="opacity-0 -translate-y-2"
      enter-to-class="opacity-100 translate-y-0"
      leave-active-class="transition ease-out duration-200"
      leave-from-class="opacity-100"
      leave-to-class="opacity-0"
    >
      <div
        v-show="dropdownOpen"
        class="origin-top-right z-10 absolute top-full min-w-44 bg-white border border-slate-200 py-1.5 rounded shadow-lg overflow-hidden mt-1"
        :class="align === 'right' ? 'right-0' : 'left-0'"
      >
        <ul
          ref="dropdown"
          @focusin="dropdownOpen = true"
          @focusout="dropdownOpen = false"
        >
          <li v-if="publishType !== 'continue' && hasContinue">
            <a
              class="font-medium text-sm text-indigo-500 hover:text-indigo-600 flex items-center py-1 px-3"
              href="javascript:void(0)"
              @click="publishAndContinue()"
              >{{ saveText }} and continue</a
            >
          </li>
          <li v-if="publishType !== 'save'">
            <a
              class="font-medium text-sm text-indigo-500 hover:text-indigo-600 flex items-center py-1 px-3"
              href="javascript:void(0)"
              @click="publishWithoutContinuing()"
              >{{ saveText }}</a
            >
          </li>
          <li
            v-if="
              allowSaveAndAddAnother &&
              publishType !== 'another' &&
              hasAddAnother
            "
          >
            <a
              class="font-medium text-sm text-indigo-500 hover:text-indigo-600 flex items-center py-1 px-3"
              href="javascript:void(0)"
              @click="publishAndAnother()"
              >{{ saveText }} and add another</a
            >
          </li>
        </ul>
      </div>
    </transition>
  </div>
</template>
<script>
import classes from "./class";
import type from "./index";
import sizes from "./sizes";
import { Btn } from "../../index";
import { mixin } from "../../plugins/click-away";

export default {
  name: "PublishButton",
  components: {
    Btn,
  },
  mixins: [type, mixin],
  props: {
    hasContinue: {
      type: Boolean,
      default: true,
    },
    hasAddAnother: {
      type: Boolean,
      default: true,
    },
    type: {
      type: String,
      default: "save",
    },
    collection: {
      type: String,
      default: "gigcodes",
    },
    saveText: {
      type: String,
      default: "Save",
    },
    align: {
      type: String,
      default: "right",
    },
  },
  emits: ["update:type", "publish"],
  data() {
    return {
      sizes,
      classes,
      disable: this.disabled,
      dropdownOpen: false,
      allowSaveAndAddAnother: true,
      publishType: "save",
      saving: false,
    };
  },
  computed: {
    saveBehaviorScope() {
      return `gigcodes.publish.${this.collection}.type`;
    },
    getInitialPublishType() {
      let type = localStorage.getItem(this.saveBehaviorScope) || "save";
      if (!this.allowSaveAndAddAnother && type === "another") {
        type = "save";
      }
      return type;
    },
  },
  mounted() {
    this.publishType = this.getInitialPublishType;
  },
  methods: {
    toggle() {
      this.dropdownOpen = !this.dropdownOpen;
    },
    away() {
      this.dropdownOpen = false;
    },
    publishWithoutContinuing() {
      this.publishType = "save";
      this.saving = true;
      localStorage.setItem(this.saveBehaviorScope, "save");
      this.$emit("update:type", "save");
      this.$emit("publish");
    },
    publishAndContinue() {
      this.publishType = "continue";
      this.saving = true;
      this.$emit("update:type", "continue");
      localStorage.setItem(this.saveBehaviorScope, "continue");
      this.$emit("publish");
    },
    publishAndAnother() {
      this.publishType = "another";
      this.saving = true;
      this.$emit("update:type", "another");
      localStorage.setItem(this.saveBehaviorScope, "another");
      this.$emit("publish");
    },
  },
};
</script>

<style scoped lang="scss">
.fill-current {
  fill: white;
}

.publish {
  button {
    @apply rounded-none rounded-l-lg;
  }

  .dropdown {
    @apply rounded-none rounded-r-lg p-2 px-0.5;
  }
}
</style>
