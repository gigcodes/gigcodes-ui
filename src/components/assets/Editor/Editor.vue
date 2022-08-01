<template>
  <div class="asset-editor-modal">
    <div class="asset-editor" :class="isImage ? 'is-image' : 'is-file'">
      <div v-if="loading" class="loading">
        <loading-graphic/>
      </div>

      <div v-if="saving" class="loading">
        <loading-graphic text="Saving"/>
      </div>

      <template v-if="!loading && !saving">
        <div class="editor-meta">
          <div class="asset-editor-meta-items">
            <div class="meta-item one-line">
              <file-icon :extension="asset.extension"/>
              {{ asset.path }}
            </div>
            <div v-if="isImage" class="meta-item">
              <span class="meta-label">Dimensions</span>
              <span class="meta-value"
              >{{ asset.width }} x {{ asset.height }}</span
              >
            </div>
            <div class="meta-item">
              <span class="meta-label">Size</span>
              <span class="meta-value">{{ asset.size }}</span>
            </div>
            <div class="meta-item">
              <span class="meta-label">Last Modified</span>
              <span
                  class="meta-value"
                  :title="asset.last_modified"
              >{{ asset.last_modified_relative }}</span
              >
            </div>
          </div>

          <div class="asset-editor-meta-actions">
            <a title="Open" @click.prevent="open">
              <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="27"
                  height="27"
                  viewBox="0 0 27 23"
              >
                <g
                    fill="none"
                    fill-rule="evenodd"
                    stroke="#676767"
                    stroke-width="2"
                    transform="translate(1 1.045)"
                >
                  <path
                      d="m20.121 18.882 2.121-2.121.00000003-.00000003c.781207-.780931.781431-2.04729.00049994-2.8285-.780931-.781207-2.04729-.781431-2.8285-.00049994l-2.121 2.122"
                  />
                  <path
                      d="m15.878 17.468-2.12 2.121.00000014-.00000014c-.781483.780931-.781931 2.04752-.00100025 2.829.780931.781483 2.04752.781931 2.829.00100028l2.121-2.119"
                  />
                  <path d="m19.77 16.41-3.54 3.53"/>
                  <path d="m2 5.18h20"/>
                  <path
                      d="m5 2.926h-.00000001c-.138071.00000001-.25.111929-.25.25.00000001.138071.111929.25.25.25.138071-.00000001.25-.111929.25-.25v.00000001c0-.138071-.111929-.25-.25-.25"
                  />
                  <path
                      d="m7 2.926h-.00000001c-.138071.00000001-.25.111929-.25.25.00000001.138071.111929.25.25.25.138071-.00000001.25-.111929.25-.25v.00000001c0-.138071-.111929-.25-.25-.25"
                  />
                  <path
                      d="m9 2.926h-.00000001c-.138071.00000001-.25.111929-.25.25.00000001.138071.111929.25.25.25.138071-.00000001.25-.111929.25-.25v.00000001c0-.138071-.111929-.25-.25-.25"
                  />
                  <path
                      d="m10 17.176h-6-.00000009c-1.10457-.00000005-2-.895431-2-2v-12 .0000003c-.00000017-1.10457.89543-2 2-2h16-.00000009c1.10457-.00000005 2 .89543 2 2v6"
                  />
                </g>
              </svg>
            </a>
            <a title="Download" @click.prevent="download">
              <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="27"
                  height="23"
                  viewBox="0 0 27 23"
              >
                <g
                    fill="none"
                    fill-rule="evenodd"
                    stroke="#676767"
                    stroke-width="2"
                    transform="translate(1 1.045)"
                >
                  <path
                      d="M21.1219828 6.85714286C21.1219828 6.85714286 20.0297414 6.69642857 18.9655172 6.85714286M3.01724138 6C3.01724138 4.10657143 4.5612069 2.57142857 6.46551724 2.57142857 8.36982759 2.57142857 9.9137931 4.10657143 9.9137931 6"
                  />
                  <path
                      d="M18.5344828 16.2857143L20.2465517 16.2857143C22.8607759 16.2857143 25 14.1591429 25 11.5594286 25 9.25757143 23.3215517 7.26942857 21.1219828 6.85714286 21.0728448 3.129 18.0219828 0 14.2603448 0 11.8642241 0 9.61465517 1.28785714 8.37241379 3.144 7.82586207 2.78271429 7.17068966 2.57142857 6.46551724 2.57142857 4.5612069 2.57142857 3.01724138 4.10657143 3.01724138 6 3.01724138 6.06557143 3.02327586 6.12985714 3.02715517 6.19457143 3.02284483 6.273 3.01724138 6.35142857 3.01724138 6.42857143 1.29784483 7.248 0 9.19585714 0 11.2092857 0 14.0014286 2.29741379 16.2857143 5.10560345 16.2857143L7.32758621 16.2857143M12.9310345 11.1428571L12.9310345 21M12.9310345 21L9.48275862 17.5714286M16.3793103 17.5714286L12.9310345 21"
                  />
                </g>
              </svg>
            </a>
            <a title="Close" @click.prevent="close">
              <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="18"
                  height="19"
                  viewBox="0 0 18 19"
              >
                <g
                    fill="none"
                    fill-rule="evenodd"
                    stroke="#676767"
                    stroke-width="2"
                    transform="translate(1 1.545)"
                >
                  <path
                      d="M16 0L.160533333 15.8389333M16 15.8389333L.160533333 0"
                  />
                </g>
              </svg>
            </a>
          </div>
        </div>

        <div class="editor-main">
          <div class="editor-preview">
            <div v-if="isImage" class="editor-preview-image">
              <div class="image-wrapper">
                <img :src="asset.preview" class="asset-thumb"/>
              </div>
            </div>

            <div v-if="asset.is_audio" class="audio-wrapper">
              <audio :src="asset.url" controls preload="auto"/>
            </div>

            <div v-if="asset.is_video" class="video-wrapper">
              <video :src="asset.url" controls/>
            </div>

            <div
                v-if="asset.extension === 'pdf'"
                class="full-height"
            >
              <object
                  :data="asset.url"
                  type="application/pdf"
                  width="100%"
                  height="100%"
              ></object>
            </div>

            <div v-if="asset.is_previewable" class="full-height">
              <iframe
                  class="full-height full-width"
                  frameborder="0"
                  :src="
                                    'https://docs.google.com/gview?url=' +
                                    asset.permalink +
                                    '&embedded=true'
                                "
              ></iframe>
            </div>

            <div class="editor-file-actions">
              <button
                  v-if="isImage"
                  type="button"
                  class="btn"
                  @click.prevent="openFocalPointEditor"
              >
                Focal Point
              </button>
            </div>
          </div>

          <div class="editor-form">
            <div class="editor-form-fields">
              <div v-if="hasErrors" class="alert alert-danger">
                <ul>
                  <li v-for="(error,i) in errors" :key="i">{{ error }}</li>
                </ul>
              </div>
              <div class="publish-fields">
                <text-field
                    v-model="title"
                    name="Title"
                    help="The display name of the asset."
                    :config="{ mode: 'text' }"
                ></text-field>
                <text-field
                    v-model="altText"
                    name="Alt Text"
                    help="An alternate name for accessibility."
                    :config="{ mode: 'text' }"
                ></text-field>
              </div>
            </div>

            <div class="editor-form-actions">
              <button
                  v-if="allowDeleting"
                  type="button"
                  class="btn btn-danger"
                  @click="deleteItem"
              >
                Delete
              </button>
              <button
                  type="button"
                  class="btn btn-primary"
                  @click="save"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      </template>

      <focal-point-editor
          v-if="showFocalPointEditor"
          :data="focus"
          :image="asset.preview"
          @selected="selectFocalPoint"
          @closed="closeFocalPointEditor"
      >
      </focal-point-editor>
    </div>
  </div>
</template>

<script>
import {Events, TextField} from "../../../index";
import FocalPointEditor from "./FocalPointEditor.vue";
import _ from "underscore";
import axios from "axios";
import FileIcon from "../../FileIcon.vue";
import LoadingGraphic from "../../LoadingGraphic.vue";

export default {
  components: {
    LoadingGraphic,
    FileIcon,
    FocalPointEditor,
    TextField,
  },

  emits: ["deleted", "closed", "saved", "moved"],

  props: {
    id: {
      type: String,
      default: null
    },
    hasChild: {
      type: Boolean,
      default: false
    },
    allowDeleting: {
      type: Boolean,
      default: false,
    },
  },

  data() {
    return {
      loading: true,
      saving: false,
      asset: null,
      fields: null,
      focus: null,
      showFocalPointEditor: false,
      showRenamer: false,
      showMover: false,
      hasChildData: this.hasChild,
      errors: [],
      title: "",
      altText: "",
    };
  },

  computed: {
    /**
     * Whether the asset is an image
     */
    isImage() {
      if (!this.asset) return false;

      return this.asset.is_image;
    },

    /**
     * Whether there are errors present.
     */
    hasErrors: function () {
      return _.size(this.errors) !== 0;
    },
  },

  mounted() {
    this.load();
  },

  created() {
    Events.$on("close-child-editor", function () {
      this.closeFocalPointEditor();
      this.closeRenamer();
    });
  },

  methods: {
    /**
     * Load the asset data
     *
     * This component is given an asset ID.
     * It needs to get the corresponding data from the server.
     */
    load() {
      this.loading = true;
      const url = "/api/media/" + this.id.replace("::", "/");
      axios.get(url).then((response) => {
        this.asset = response.data.asset;
        this.title = response.data.asset.title;
        this.focus = response.data.asset.focus;
        this.altText = response.data.asset.alt;
        this.loading = false;
      });
    },

    /**
     * Open the focal point editor UI
     */
    openFocalPointEditor() {
      this.showFocalPointEditor = true;
      this.hasChildData = true;
    },

    /**
     * Close the focal point editor UI
     */
    closeFocalPointEditor() {
      this.showFocalPointEditor = false;
      this.hasChildData = false;
    },

    /**
     * When the focal point is selected
     */
    selectFocalPoint(point) {
      point = point === "50-50" ? null : point;
      this.focus = point;
    },

    /**
     * Save the asset
     */
    save() {
      this.saving = true;
      const url = "/api/media/" + this.id.replace("::", "/");
      axios.patch(url, {
        title: this.title,
        altText: this.altText,
        focus: this.focus,
      })
          .then((response) => {
            this.$emit("saved", response.asset);
            this.saving = false;
          })
          .catch((error) => {
            this.$toast.error("Error", {timeout: 2000});
            this.saving = false;
            this.errors = error;
          });
    },

    /**
     * Delete the asset
     */
    deleteItem() {
      if (!confirm("Are you sure")) {
        return;
      }

      this.saving = true;

      const url = "/admin/media/destroy";

      axios.delete(url, {
        params: {ids: this.asset.basename},
      })
          .then(() => {
            this.$emit("deleted", this.asset.id);
            this.saving = false;
          });
    },

    /**
     * Close the editor
     */
    close() {
      this.$emit("closed");
    },

    closeRenamer() {
      this.showRenamer = false;
      this.hasChildData = false;
    },

    assetRenamed(asset) {
      this.asset = asset;
      this.$emit("saved", asset);
    },

    closeMover() {
      this.showMover = false;
      this.hasChildData = false;
    },

    /**
     * When an asset has been moved to another folder
     */
    assetMoved(asset, folder) {
      this.asset = asset;
      this.$emit("moved", asset, folder);
    },

    open() {
      window.open(this.asset.url, "_blank");
    },

    download() {
      window.open(this.asset.download_url);
    },
  },
};
</script>
