export default {
    props: ["folder"],

    methods: {
        selectFolder() {
            this.$emit("selected", this.folder);
        },

        editFolder() {
            this.$emit("editing", this.folder);

            this.showActionsDropdown = false;
        },

        deleteFolder() {
            this.$emit("deleting", this.folder);

            this.showActionsDropdown = false;
        },

        drop(e) {
            this.$emit("dropped-on-folder", this.folder, e);
        },
    },
};
