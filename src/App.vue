<template>
  <h1 class="text-3xl font-bold underline">Hello world!</h1>
  <text-field
    name="hello"
    tooltip="hi"
    has-error="e"
    class="w-1/6"
  ></text-field>

  <dossier-table
    v-model:loading="loading"
    v-model:columns="columns"
    v-model:tableOptions="tableOptions"
    v-model:searching="searching"
    v-model:hasItems="hasItems"
    title="Categories"
    :search-term="searchTerm"
    collection="category"
    :get-api="getApi"
  />

  <!--  <editor></editor> -->
  <MediaSelector
    container="main"
    :open="showMedia"
    can-edit
    @selected="selected"
    @closed="showMedia = false"
  ></MediaSelector>
  <btn @click="showMedia = true">Open Media Selector</btn>
</template>

<script>
import axios from "axios";
import { ref } from "vue";
import { MediaSelector, Btn } from "../dist/gigcodes-admin.es";

export default {
  name: "App",
  components: {
    MediaSelector,
    Btn,
  },
  setup() {
    const loading = ref(true);
    const searching = ref(false);
    const hasItems = ref(false);
    const searchTerm = ref("");
    const columns = ref([]);
    const showMedia = ref(false);
    const tableOptions = ref({
      sort: "id",
      sortOrder: "asc",
      checkboxes: true,
      partials: {
        actions: ["edit", "delete"],
      },
    });

    const selected = (asset) => {
      console.log(asset);
    };

    const getApi = () => axios.get("http://localhost:8000/api/account-list");

    const items = ref([]);

    return {
      items,
      loading,
      searching,
      searchTerm,
      hasItems,
      columns,
      tableOptions,
      showMedia,
      selected,
      getApi,
    };
  },
};
</script>

<style scoped></style>
