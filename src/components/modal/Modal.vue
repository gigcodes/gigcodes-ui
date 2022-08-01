<template>
    <ModalBlank
        id="danger-modal"
        :modal-open="open"
        @close-modal="$emit('closed')"
    >
        <div class="p-5 flex space-x-4">
            <!-- Icon -->
            <div
                class="w-10 h-10 rounded-full flex items-center justify-center shrink-0 bg-rose-100"
            >
                <svg
                    class="w-4 h-4 shrink-0 fill-current text-rose-500"
                    viewBox="0 0 16 16"
                >
                    <path
                        d="M8 0C3.6 0 0 3.6 0 8s3.6 8 8 8 8-3.6 8-8-3.6-8-8-8zm0 12c-.6 0-1-.4-1-1s.4-1 1-1 1 .4 1 1-.4 1-1 1zm1-3H7V4h2v5z"
                    />
                </svg>
            </div>
            <!-- Content -->
            <div>
                <!-- Modal header -->
                <div class="mb-2">
                    <div class="text-lg font-semibold text-slate-800">
                        <slot name="header"></slot>
                    </div>
                </div>
                <!-- Modal content -->
                <div class="text-sm mb-10">
                    <div class="space-y-2">
                        <p>
                            <slot name="body"></slot>
                        </p>
                    </div>
                </div>
                <!-- Modal footer -->
                <div class="flex flex-wrap justify-end space-x-2">
                    <button
                        class="btn-sm border-slate-200 hover:border-slate-300 text-slate-600"
                        @click.stop="$emit('cancelled')"
                    >
                        Cancel
                    </button>
                    <button
                        class="btn-sm bg-rose-500 hover:bg-rose-600 text-white"
                        @click="$emit('confirmed')"
                    >
                        {{ confirmText }}
                    </button>
                </div>
            </div>
        </div>
    </ModalBlank>
</template>

<script>
import ModalBlank from "./ModalBlank.vue";

export default {
    name: "Modal",
    components: {
        ModalBlank,
    },
    props: {
        open: {type: Boolean, default: false},
        confirmText: {
            type: String,
            default: "Do it !"
        }
    },
    emits: ["cancelled", "confirmed", "closed"],
};
</script>

<style scoped></style>
