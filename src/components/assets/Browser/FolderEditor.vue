<template>
  <modal-blank
    :modal-open="true"
    class="asset-modal asset-folder-editor"
    @close-modal="close"
  >
    <div class="p-5 space-x-4">
      <div>
        <!-- Modal header -->
        <div class="mb-2">
          <div class="text-lg font-semibold text-slate-800">
            <h1 v-if="create">Create Folder</h1>
            <h1 v-if="!create">Edit Folder</h1>
          </div>
        </div>
        <div class="text-sm mb-10">
          <div class="space-y-2">
            <div v-if="hasErrors" class="alert alert-danger">
              <p v-for="(error, i) in errors" :key="i">{{ error }}</p>
            </div>
          </div>
          <div class="flex flex-wrap">
            <TextField
              v-model="form.basename"
              class="w-full"
              name="Name"
              help="The filesystem directory name"
              @keyup.esc="close"
              @keyup.enter="save"
            ></TextField>
          </div>
        </div>
        <!-- Modal footer -->
        <div class="flex flex-wrap justify-end space-x-2">
          <button
            class="btn-sm border-slate-200 hover:border-slate-300 text-slate-600"
            @click.stop="close"
          >
            Cancel
          </button>
          <button
            class="btn-sm bg-rose-500 hover:bg-rose-600 text-white"
            @click="save"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  </modal-blank>
</template>

<script>
import ModalBlank from "../../modal/ModalBlank.vue";
import TextField from "../../fieldtypes/TextFieldtype.vue";
import { computed, inject, ref } from "vue";
import { createToaster } from "../../../plugins/toaster";

export default {
  components: {
    TextField,
    ModalBlank,
  },
  props: {
    container: {
      type: Object,
      default: () => {},
    },
    path: {
      type: [String, Object],
      default: null,
    },
    parentUuid: {
      type: String,
      default: null,
    },
    create: {
      type: Boolean,
      default: false,
    },
  },
  emits: ["created", "updated", "closed"],

  setup(props, { emit }) {
    const form = ref({});
    const folder = ref({});
    const loading = ref(true);
    const saving = ref(false);
    const errors = ref([]);
    const basenameModified = ref(false);
    const folderCreateService = inject("folderCreateService");
    const folderUpdateService = inject("folderUpdateService");

    if (props.path instanceof Object && !props.create) {
      // eslint-disable-next-line vue/no-setup-props-destructure
      form.value.basename = props.path.title;
    }
    const hasErrors = computed(() => {
      return Object.keys(errors.value).length > 0 && !saving.value;
    });

    const reset = () => {
      folder.value = {};
      form.value = {};
      loading.value = true;
    };

    const save = () => {
      saving.value = true;
      if (folderCreateService && folderUpdateService) {
        if (props.create) {
          folderCreateService({
            ...form.value,
            path: props.path,
            container: props.container,
            parent_id: props.parentUuid,
          })
            .then((response) => {
              createToaster().success("Folder created successfully");
              emit("created", response.data);
            })
            .catch((err) => {
              if (err.response.status === 422) {
                createToaster().warning(err.response.data.message);
              } else {
                createToaster().error("Unable to create a folder");
              }
            });
        } else {
          folderUpdateService(props.path.uuid, {
            ...form.value,
            path: props.path,
            container: props.container,
            parent_id: props.parentUuid,
          })
            .then((response) => {
              createToaster().success("Folder updated successfully");
              emit("updated", response.data);
            })
            .catch((err) => {
              if (err.response.status === 422) {
                createToaster().warning(err.response.data.message);
              } else {
                createToaster().error("Unable to update a folder");
              }
            });
        }
        close();
      } else {
        console.log("folderCreateService or folderUpdateService is not set !");
      }
    };

    const close = () => {
      emit("closed");
    };

    return {
      form,
      folder,
      loading,
      saving,
      errors,
      basenameModified,
      hasErrors,
      reset,
      close,
      save,
    };
  },
};
</script>
