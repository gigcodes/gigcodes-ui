<template>
  <div class="flex">
    <div class="page-move w-6" />
    <div class="flex items-center flex-1 p-2 ml-1 text-md leading-normal">
      <div class="flex items-center flex-1">
        <div class="little-dot mr-2" :class="getStatusClass()" />
        <img
          v-if="isRoot"
          src="../../../svg/home-page.svg"
          class="mr-1 h-4 w-4 text-grey-80"
          alt=""
        />
        <a
          :class="{ 'text-sm font-medium': isTopLevel }"
          @click="$emit('edit', $event)"
          v-text="title"
        />

        <span
          v-if="showSlugs"
          class="ml-1 font-mono text-grey-70 text-2xs pt-px"
        >
          {{ isRoot ? "/" : page.slug }}
        </span>

        <button
          v-if="hasChildren"
          class="p-2 text-gray-600 hover:text-gray-700 transition duration-100 outline-none flex"
          :class="{ '-rotate-90': isOpen }"
          @click="$emit('toggle-open')"
        >
          <svg viewBox="0 0 10 6.5" class="h-1.5">
            <path
              fill="currentColor"
              d="M9.9 1.4 5 6.4l-5-5L1.4 0 5 3.5 8.5 0l1.4 1.4z"
            ></path>
          </svg>
        </button>

        <div v-if="page.collection" class="ml-2 flex items-center">
          <img src="../../../svg/content-writing.svg" class="w-4 h-4" alt="" />
          <div class="ml-sm">
            <a :href="page.collection.create_url" v-text="'Add'" />
            <span class="text-grey">/</span>
            <a :href="page.collection.edit_url" v-text="'Edit'" />
          </div>
        </div>
      </div>

      <div class="pr-1 flex items-center">
        <slot name="branch-icon" :branch="page" />
        <dropdown-list v-if="!isRoot" class="ml-2">
          <slot
            name="branch-options"
            :branch="page"
            :depth="depth"
            :remove-branch="remove"
            :orphan-children="orphanChildren"
          />
        </dropdown-list>
      </div>
    </div>
  </div>
</template>

<script>
import * as th from "tree-helper";
import DropdownList from "../DropdownList.vue";

export default {
  components: {
    DropdownList,
  },
  props: {
    page: { type: Object, default: () => ({}) },
    depth: { type: Number, default: Infinity },
    root: { type: Boolean, default: false },
    vm: { type: Object, default: () => ({}) },
    firstPageIsRoot: { type: Boolean, default: false },
    hasCollection: { type: Boolean, default: false },
    isOpen: { type: Boolean, default: false },
    hasChildren: { type: Boolean, default: false },
    showSlugs: { type: Boolean, default: false },
  },

  emits: ["children-orphaned", "removed", "toggle-open", "edit"],

  data() {
    return {
      editing: false,
    };
  },

  computed: {
    isTopLevel() {
      return this.depth === 1;
    },

    isRoot() {
      if (!this.firstPageIsRoot) return false;
      if (!this.isTopLevel) return false;

      const firstNodeId = this.vm.data.parent.children[0].id;
      return this.page.id === firstNodeId;
    },

    isEntry() {
      return Boolean(this.page.id);
    },

    isLink() {
      return !this.page.id && this.page.title && this.page.url;
    },

    isText() {
      return this.page.title && !this.page.url;
    },

    title() {
      return this.page.title || this.page.entry_title || this.page.url;
    },
  },

  methods: {
    getStatusClass() {
      switch (this.page.status) {
        case "published":
          return "bg-green-600";
        case "draft":
          return "bg-gray-400";
        default:
          return "bg-transparent border border-gray-30";
      }
    },

    remove() {
      const store = this.page._vm.store;
      store.deleteNode(this.page);
      this.$emit("removed", store);
    },

    orphanChildren() {
      const store = this.page._vm.store;
      let children = this.vm.data.children;
      let length = children.length;
      for (let index = 0; index < length; index++) {
        // As the item is moved out, the rest of the items are moved up an index.
        // We always just want to move the first item.
        th.appendTo(children[0], this.vm.data.parent);
      }

      this.$emit("children-orphaned", store);
    },
  },
};
</script>
