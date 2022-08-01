<template>
    <svg class="shrink-0 h-6 w-6" viewBox="0 0 24 24">
        <circle
            class="fill-current text-slate-400"
            :class="active && 'text-indigo-300'"
            cx="18.5"
            cy="5.5"
            r="4.5"
        />
        <circle
            class="fill-current text-slate-600"
            :class="active && 'text-indigo-500'"
            cx="5.5"
            cy="5.5"
            r="4.5"
        />
        <circle
            class="fill-current text-slate-600"
            :class="active && 'text-indigo-500'"
            cx="18.5"
            cy="18.5"
            r="4.5"
        />
        <circle
            class="fill-current text-slate-400"
            :class="active && 'text-indigo-300'"
            cx="5.5"
            cy="18.5"
            r="4.5"
        />
    </svg>
</template>

<script>
import mixin from "./index";

export default {
    name: "UtilityIcon",
    mixins: [mixin],
};
</script>
