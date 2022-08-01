<template>
    <svg class="shrink-0 h-6 w-6" viewBox="0 0 24 24">
        <path
            class="fill-current text-slate-600"
            :class="active && 'text-indigo-500'"
            d="M8.07 16H10V8H8.07a8 8 0 110 8z"
        />
        <path
            class="fill-current text-slate-400"
            :class="active && 'text-indigo-500'"
            d="M15 12L8 6v5H0v2h8v5z"
        />
    </svg>
</template>

<script>
import mixin from "./index";

export default {
    name: "AuthenticationIcon",
    mixins: [mixin],
};
</script>
