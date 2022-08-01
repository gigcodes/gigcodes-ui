<template>
    <svg class="shrink-0 h-6 w-6" viewBox="0 0 24 24">
        <path
            class="fill-current text-slate-600"
            :class="active && 'text-indigo-500'"
            d="M8 1v2H3v19h18V3h-5V1h7v23H1V1z"
        />
        <path
            class="fill-current text-slate-600"
            :class="active && 'text-indigo-500'"
            d="M1 1h22v23H1z"
        />
        <path
            class="fill-current text-slate-400"
            :class="active && 'text-indigo-300'"
            d="M15 10.586L16.414 12 11 17.414 7.586 14 9 12.586l2 2zM5 0h14v4H5z"
        />
    </svg>
</template>

<script>
import mixin from "./index";

export default {
    name: "TaskIcon",
    mixins: [mixin],
};
</script>
