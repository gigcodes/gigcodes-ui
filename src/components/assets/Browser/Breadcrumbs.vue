<template>
  <div class="breadcrumbs">
    <a
      v-for="(part, i) in pathParts"
      :key="i"
      href=""
      @click.prevent="selectFolder(i)"
    >
      <span class="icon icon-folder"></span>
      {{ part }}
    </a>
  </div>
</template>

<script>
export default {
  props: {
    path: {
      type: String,
      default: null,
    },
    folder: {
      type: Object,
      default: () => {},
    },
    folders: {
      type: Object,
      default: () => {},
    },
  },
  emits: ["navigated"],
  computed: {
    pathParts() {
      let parts = ["/"];
      if (this.path === "/" || this.path === null) {
        return parts;
      }
      if (this.folder.path.length > 1) {
        let path = this.folder.path.substring(1);
        return parts.concat(path.split("/"));
      } else return parts.concat(this.folder.path.split("/"));
    },
  },

  methods: {
    selectFolder(part) {
      const path =
        part === 0 ? "/" : this.pathParts.slice(1, part + 1).join("/");

      this.$emit("navigated", path);
    },
  },
};
</script>
