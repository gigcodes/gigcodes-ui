<template>
    <modal v-model:show="show" :saving="saving" class="modal-small">
        <template #header> Rename File</template>

        <template #body>
            <div class="alert alert-warning">{{ warningText }}</div>

            <div v-if="errors" class="alert alert-danger">
                <p v-for="(error,index) in errors" :key="index">{{ error }}</p>
            </div>

            <div class="form-group">
                <input
                    ref="input"
                    v-model="filename"
                    type="text"
                    autofocus
                    class="form-control"
                    @keyup.esc="cancel"
                    @keyup.enter="save"
                />
            </div>
        </template>

        <template #footer>
            <button
                class="btn btn-primary"
                :disabled="!hasChanged"
                @click="save"
            >
                Save
            </button>
            <button type="button" class="btn" @click="cancel">
                Cancel
            </button>
        </template>
    </modal>
</template>

<script>
import axios from "axios";

export default {
    props: {
        asset: {
            type: Object,
            default: () => ({})
        }
    },

    emits: ["saved", "closed"],

    data() {
        return {
            show: true,
            filename: null,
            saving: false,
            errors: null,
            warningText: "Are you sure to rename file",
        };
    },

    computed: {
        hasChanged() {
            return this.asset.filename !== this.filename;
        },
    },

    mounted() {
        this.filename = this.asset.filename;
    },

    watch: {
        show(val) {
            if (!val) this.cancel();
        },
    },

    methods: {
        save() {
            if (!this.hasChanged) return;

            this.saving = true;

            const url = "/assets/rename/" + this.asset.id.replace("::", "/");

            axios.post(url, {filename: this.filename})
                .then((response) => {
                    this.$emit("saved", response);
                    this.cancel();
                })
                .catch((response) => {
                    this.saving = false;
                    this.errors = response;
                    this.$refs.input.focus();
                });
        },

        cancel() {
            this.$emit("closed");
        },
    },
};
</script>
