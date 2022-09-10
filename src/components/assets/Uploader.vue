<template>
  <div class="asset-uploader">
    <input
      ref="fileInput"
      type="file"
      multiple="multiple"
      class="hidden"
      @change="selectFile"
    />
  </div>
</template>

<script>
import { inject, ref, watch } from "vue";
import { findIndex, findWhere } from "underscore";
import { createToaster } from "../../plugins/toaster";

export default {
  props: {
    domElement: { type: HTMLDivElement, default: null },
    container: { type: String, default: null },
    path: { type: String, default: null },
  },
  emits: ["progress", "upload-complete", "error", "updated"],
  setup(props, { emit }) {
    const id = () => {
      return ([1e7] + -1e3 + -4e3 + -8e3 + -1e11).replace(/[018]/g, (c) =>
        (
          c ^
          (crypto.getRandomValues(new Uint8Array(1))[0] & (15 >> (c / 4)))
        ).toString(16)
      );
    };
    const uploads = ref([]);
    const fileInput = ref(null);
    const uploadService = inject("uploadService");
    const toast = createToaster();

    const browse = () => fileInput.value.click();

    const selectFile = (event) => {
      if (event.target.files.length) {
        Object.keys(event.target.files).forEach((key) => {
          upload(event.target.files[key]);
        });
      }
    };

    const upload = (file) => {
      const uuid = id();

      uploads.value.push({
        id: uuid,
        basename: file.name,
        extension: file.name.split(".").pop(),
        percent: 0,
        errorMessage: null,
      });
      const files = new FormData();
      files.append("file", file);
      files.append("collection_name", props.container);
      files.append("path", props.path);
      files.append("filename", file.name);
      files.append("extension", file.name.split(".").pop());

      const config = {
        onUploadProgress(progressEvent) {
          let percentCompleted = Math.round(
            (progressEvent.loaded * 100) / progressEvent.total
          );
          let upload = findWhere(uploads.value, { id: uuid });
          upload.percent = percentCompleted;
          emit("updated", uploads.value);
        },
      };

      uploadService(files, config)
        .then((response) => {
          if (response.status === 201) {
            if (response.data.success) {
              emit("upload-complete", response.data.item, uploads.value);
              let index = findIndex(uploads.value, { id: uuid });
              uploads.value.splice(index, 1);
            } else {
              let upload = findWhere(uploads.value, { id: uuid });
              upload.errorMessage = "Error on file upload";
              toast.error("Error on file upload");
              emit("updated", uploads.value);
            }
          } else {
            toast.error("Error on file upload");
            emit("updated", uploads.value);
          }
        })
        .catch((err) => {
          let upload = findWhere(uploads.value, { id: uuid });
          if (err.response.status === 413) {
            toast.error("File size is too large");
            upload.errorMessage = "File size is too large";
            emit("updated", uploads.value);
          } else {
            upload.errorMessage = err.response?.data?.message;
            toast.error(err.response?.data?.message);
          }
        });
    };

    const uploadFile = (files) => {
      Object.keys(files).forEach((key) => {
        upload(files[key]);
      });
    };

    watch(
      uploads,
      (value) => {
        emit("updated", value);
      },
      { deep: true }
    );

    return {
      uploads,
      uploadFile,
      fileInput,
      browse,
      selectFile,
      upload,
    };
  },
};
</script>
