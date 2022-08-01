<template>
    <div class="asset-upload-listing">
        <div class="asset-upload-listing-header">
            <h6>Upload</h6>
        </div>
        <table class="w-full">
            <tbody>
            <Upload
                v-for="(upload, i) in items"
                :key="i"
                :basename="upload.basename"
                :extension="upload.extension"
                :percent="upload.percent"
                :error="upload.errorMessage"
                @clear="clearUpload(i)"
            ></Upload>
            </tbody>
        </table>
    </div>
</template>

<script>
import Upload from "./Upload.vue";
import {ref} from "vue";

export default {
    components: {
        Upload,
    },
    props: {
        uploads: {
            type: Array,
            default: () => ([])
        }
    },
    setup(props) {
        const items = ref(props.uploads)
        const clearUpload = (i) => {
            return items.value.splice(i, 1)
        }
        return {
            items,
            clearUpload
        }
    }
};
</script>
