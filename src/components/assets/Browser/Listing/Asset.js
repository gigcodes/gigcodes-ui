import _ from "underscore"

export default {
    props: {
        asset: {
            type: Object,
            default: () => {
            }
        },
        selectedAssets: {
            type: Array,
            default: () => []
        },
        canEdit: {type: Boolean, default: false}
    },
    emits: ["selected", "deselected", "editing", "deleting", "assetdragstart", "doubleclicked"],

    computed: {
        /**
         * Determine if an asset should be in the selected state.
         */
        isSelected() {
            return _.contains(this.selectedAssets, this.asset.id);
        },

        /**
         * Whether the asset can be rendered as svg
         */
        canShowSvg() {
            return (
                this.asset.extension === "svg" && !this.asset.url.includes(":")
            );
        },

        /**
         * The inline style used to display an SVG background image
         */
        svgBackgroundStyle() {
            return 'background-image: url("' + this.asset.url + '")';
        },
    },

    methods: {
        /**
         * Trigger a toggle of the selected state.
         */
        toggle() {
            if (this.isSelected) {
                this.deselect();
            } else {
                this.select();
            }
        },

        select() {
            this.$emit("selected", {
                id: this.asset.id,
                asset: this.asset
            });
        },

        deselect() {
            this.$emit("deselected", {
                id: this.asset.id,
                asset: this.asset
            });
        },

        /**
         * Trigger editing of an asset.
         */
        editAsset() {
            this.$emit("editing", {
                id: this.asset.id,
                asset: this.asset
            });
        },

        /**
         * Trigger deleting of an asset.
         */
        deleteAsset() {
            this.$emit("deleting", {
                id: this.asset.id,
                asset: this.asset
            });
        },

        assetDragStart(e) {
            e.dataTransfer.setData("asset", this.asset.id);
            e.dataTransfer.effectAllowed = "move";
            this.$emit("assetdragstart", {
                id: this.asset.id,
                asset: this.asset
            });
        },

        doubleClicked() {
            // When in the context of the asset manager, we want to edit the asset. Otherwise, we want to
            // select the asset and close the dialog, which will be handled in the parent components.
            if (this.canEdit) {
                this.editAsset();
            } else {
                this.select();
                this.$emit("doubleclicked", {
                    id: this.asset.id,
                    asset: this.asset
                });
            }
        }
    },
};
