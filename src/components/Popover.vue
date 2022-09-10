<template>
  <div
    v-click-away="close"
    class="popover-container"
    :class="{ 'popover-open': isOpen }"
  >
    <div
      v-if="$slots.default"
      ref="trigger"
      aria-haspopup="true"
      :aria-expanded="isOpen"
      @click="toggle"
    >
      <slot name="trigger"></slot>
    </div>
    <div v-if="!disabled" ref="popover" class="popover">
      <div class="popover-content bg-white shadow-popover rounded-md">
        <slot :close="close" />
      </div>
    </div>
  </div>
</template>

<script>
import { CAMixin } from "../index";
import { createPopper } from "@popperjs/core";
import { mousetrap } from "../index";

export default {
  mixins: [CAMixin],

  props: {
    disabled: {
      type: Boolean,
      default: false,
    },
    placement: {
      type: String,
      default: "bottom-end",
    },
    offset: {
      type: Array,
      default: () => [0, 10],
    },
    scroll: {
      type: Boolean,
      default: false,
    },
  },

  data() {
    return {
      isOpen: false,
    };
  },

  mounted() {
    if (!this.disabled) this.bindPopper();
  },

  methods: {
    bindPopper() {
      createPopper(this.$refs.trigger, this.$refs.popover, {
        placement: this.placement,
        modifiers: [
          {
            name: "offset",
            options: {
              offset: this.offset,
            },
          },
          {
            name: "eventListeners",
            options: {
              scroll: this.scroll,
              resize: true,
            },
          },
        ],
      });
    },
    toggle() {
      this.isOpen ? this.close() : this.open();
    },
    open() {
      this.isOpen = true;
      mousetrap.bind("esc", () => this.close());
    },
    close() {
      this.isOpen = false;
    },
  },
};
</script>
