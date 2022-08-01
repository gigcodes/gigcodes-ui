export default {
    props: {
        id: {
            type: String,
            default: null,
        },
        name: {
            type: String,
            default: null,
        },
        tooltip: {
            type: String,
            default: null,
        },
        type: {
            type: String,
            default: "text",
        },
        classes: {
            type: String,
            default: null,
        },
        inputClass: {
            type: String,
            default: null,
        },
        autofocus: {
            type: Boolean,
            default: false,
        },
        required: {
            type: Boolean,
            default: false,
        },
        readonly: {
            type: Boolean,
            default: false,
        },
        disabled: {
            type: Boolean,
            default: false,
        },
        placeholder: {
            type: String,
            default: null,
        },
        help: {
            type: String,
            default: null,
        },
        hasError: {
            default: null,
        },
        hasSuccess: {
            type: String,
            default: null,
        },
        suffix: {
            type: String,
            default: null,
        },
        prefix: {
            type: String,
            default: null,
        },
        hasIcon: {
            type: String,
            default: null,
        },
    },
};
