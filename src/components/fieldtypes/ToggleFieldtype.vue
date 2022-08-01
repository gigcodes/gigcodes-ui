<template>
    <div>
        <div class="flex items-center mt-5">
            <div class="form-switch">
                <input
                    id="toggle1"
                    v-model="modelValue"
                    type="checkbox"
                    class="sr-only"
                    :true-value="options[1]"
                    :false-value="options[0]"
                />
                <label class="bg-slate-400" for="toggle1">
                    <span class="bg-white shadow-sm" aria-hidden="true"></span>
                    <span class="sr-only">Toggle</span>
                </label>
            </div>
            <div v-if="hasText" class="text-sm text-slate-400 ml-2">
                {{ text }}
            </div>
        </div>
    </div>
</template>

<script>
import FieldType from "./index";
import Input from "./customInput";
import {ref} from "vue";

export default {
    name: "ToggleField",
    mixins: [FieldType, Input],
    props: {
        options: {
            type: Array,
            default: () => []
        }
    },
    setup(props) {
        const hasText = ref(props.hasText);
        const text = () => {
            if (props.modelValue) {
                return props.options[1];
            } else return props.options[0];
        };
        return {
            text,
            hasText,
        };
    },
};
</script>

<style scoped></style>
