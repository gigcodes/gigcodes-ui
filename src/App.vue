<template>
  <h1 class="text-3xl font-bold underline">
    Hello world!
  </h1>
  <text-field name="hello" tooltip="hi" has-error="e" class="w-1/6"></text-field>
  <assets-field
      v-model:data="items"
      :config="{container:'main',max_files:5,canEdit:true}"
      name="Images"></assets-field>
  <dossier-table
      v-model:loading="loading"
      v-model:columns="columns"
      v-model:tableOptions="tableOptions"
      v-model:searching="searching"
      v-model:hasItems="hasItems"
      title="Categories"
      :search-term="searchTerm"
      collection="category"
  />

  <!--  <editor></editor> -->
  <MediaSelector container="main" :open="showMedia" @selected="selected" @closed="showMedia = false"
                 can-edit></MediaSelector>
  <btn @click="showMedia = true">Open Media Selector</btn>
</template>

<script>
import axios from "axios";
import {provide, ref} from "vue";
import {AssetsField, MediaSelector, Btn} from "../dist/gigcodes-admin.es"

export default {
  name: "App",
  components: {
    MediaSelector,
    Btn,
    AssetsField
  },
  setup() {
    const loading = ref(true);
    const searching = ref(false);
    const hasItems = ref(false);
    const searchTerm = ref('');
    const columns = ref([]);
    const showMedia = ref(false);
    const tableOptions = ref({
      sort: 'id',
      sortOrder: 'asc',
      checkboxes: true,
      partials: {
        actions: ['edit', 'delete']
      }
    });

    const selected = (asset) => {
      console.log(asset);
    }

    const uploadService = (data, config) => axios.post("http://127.0.0.1:8000/api/media/upload", data, config)
    const getService = (params) => axios.get("http://127.0.0.1:8000/api/payments/get", {params})
    const getMediaService = (params) => axios.get("http://127.0.0.1:8000/api/media/get-file", {params})
    const containerService = () => axios.get(`http://127.0.0.1:8000/api/media/browse`)
    const loadFilesService = (params) => axios.get(`http://127.0.0.1:8000/api/media/get-files`, {params})
    const deleteFilesService = (params) => axios.delete(`http://127.0.0.1:8000/api/media/delete`, {params})
    const folderCreateService = (data) => axios.post(`http://127.0.0.1:8000/api/media/folder`, data)
    const folderUpdateService = (uuid, data) => axios.patch(`http://127.0.0.1:8000/api/media/folder/${uuid}/edit`, data)
    const deleteFolderService = (uuid) => axios.delete(`https://laravelmedia.loc/api/media/folder/${uuid}`)
    const items = ref([])
    provide("uploadService", uploadService)
    provide("getService", getService)
    provide("getMediaService", getMediaService)
    provide("containerService", containerService)
    provide("loadFilesService", loadFilesService)
    provide("searchFilesService", '')
    provide("moveFilesService", '')
    provide("deleteFilesService", deleteFilesService)
    provide("folderCreateService", folderCreateService)
    provide("folderUpdateService", folderUpdateService)
    provide("deleteFolderService", deleteFolderService)
    provide("deleteMultiService", deleteFolderService)
    provide("deleteService", deleteFilesService)

    return {
      items, loading, searching, searchTerm, hasItems, columns, tableOptions, showMedia, selected
    }
  }

}
</script>

<style scoped>

</style>