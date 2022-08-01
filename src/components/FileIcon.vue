<template>
  <img
    v-if="type !== 'div'"
    :src="image"
    :alt="name"
    :class="[
      'svg-icon',
      { 'using-div': type === 'div', 'using-svg': type === 'svg' },
    ]"
  />

  <template v-if="type == 'div'">
    <div
      class="circular"
      :style="{ backgroundImage: 'url(/svg/' + name + '.svg)' }"
    ></div>
  </template>
</template>

<script>
import { computed } from "vue";

export default {
  name: "FileIcon",
  props: {
    extension: {
      type: String,
      default: null,
    },
    type: {
      type: String,
      default() {
        return "svg";
      },
    },
  },
  setup(props) {
    const name = computed(() => {
      switch (props.extension) {
        case "folder":
          return "folder";

        case "7z":
        case "pkg":
        case "rar":
        case "tar":
        case "tar.zg":
        case "z":
        case "zip":
          return "archive";

        case "aac":
        case "aif":
        case "cda":
        case "flac":
        case "m4a":
        case "mp3":
        case "mp4a":
        case "mpa":
        case "ogg":
        case "mid":
        case "midi":
        case "wav":
        case "wma":
          return "audio";

        case "doc":
        case "docx":
          return "doc";

        case "xls":
        case "xlsx":
          return "excel";

        case "json":
          return "json";

        case "ai":
        case "eps":
        case "indb":
        case "psd":
        case "sketch":
          return "layered";

        case "pdf":
          return "pdf";

        case "key":
        case "odp":
        case "pps":
        case "ppt":
        case "pptx":
          return "presentation";

        case "3g2":
        case "3gp":
        case "avi":
        case "flv":
        case "h264":
        case "m4v":
        case "mvk":
        case "mp4":
        case "mpg":
        case "mpeg":
        case "mov":
        case "rm":
        case "swf":
        case "vob":
        case "wmv":
          return "video";

        case "xml":
          return "xml";

        case "bmp":
        case "gif":
        case "ico":
        case "jpg":
        case "jpeg":
        case "png":
        case "tiff":
          return "picture";

        default:
          return "generic";
      }
    });

    const image = computed(() => {
      return `/svg/filetypes/${name.value}.svg`;
    });
    return {
      image,
      name,
    };
  },
};
</script>
