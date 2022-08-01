import {Events} from "../../../../index";

export default {
    data() {
        return {
            showActionsDropdown: false,
        };
    },

    mounted() {
        Events.$on("close-dropdown", (reference) => {
            if (this === reference) {
                return;
            }
            this.showActionsDropdown = false;
        });
    },

    beforeUnmount() {
        Events.$off("close-dropdown")
    },

    methods: {
        toggleActions() {
            this.$emit("open-dropdown", this);

            this.showActionsDropdown = !this.showActionsDropdown;
        },

        away() {
            this.showActionsDropdown = false;
        },
    },
};
