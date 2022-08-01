<template>
    <svg class="shrink-0 h-6 w-6" viewBox="0 0 24 24">
        <path
            class="fill-current text-slate-600"
            :class="active && 'text-indigo-500'"
            d="M16 13v4H8v-4H0l3-9h18l3 9h-8Z"
        />
        <path
            class="fill-current text-slate-400"
            :class="active && 'text-indigo-300'"
            d="m23.72 12 .229.686A.984.984 0 0 1 24 13v8a1 1 0 0 1-1 1H1a1 1 0 0 1-1-1v-8c0-.107.017-.213.051-.314L.28 12H8v4h8v-4H23.72ZM13 0v7h3l-4 5-4-5h3V0h2Z"
        />
    </svg>
</template>

<script>
import mixin from "./index";

export default {
    name: "InboxIcon",
    mixins: [mixin],
};
</script>
