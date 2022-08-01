<template>
    <div>
        <transition
            enter-active-class="transition ease-out duration-200"
            enter-from-class="opacity-0"
            enter-to-class="opacity-100"
            leave-active-class="transition ease-out duration-100"
            leave-from-class="opacity-100"
            leave-to-class="opacity-0"
        >
            <div
                v-show="modalOpen"
                class="fixed inset-0 bg-slate-900 bg-opacity-30 z-50 transition-opacity"
                aria-hidden="true"
            ></div>
        </transition>
        <!-- Modal dialog -->
        <transition
            enter-active-class="transition ease-in-out duration-200"
            enter-from-class="opacity-0 translate-y-4"
            enter-to-class="opacity-100 translate-y-0"
            leave-active-class="transition ease-in-out duration-200"
            leave-from-class="opacity-100 translate-y-0"
            leave-to-class="opacity-0 translate-y-4"
        >
            <div
                v-show="modalOpen"
                :id="id"
                v-click-away="away"
                class="fixed inset-0 z-50 overflow-hidden flex items-center my-4 justify-center transform px-4 sm:px-6"
                role="dialog"
                aria-modal="true"
            >
                <div
                    ref="modalContent"
                    class="bg-white rounded shadow-lg overflow-auto max-w-lg w-full max-h-full"
                >
                    <slot/>
                </div>
            </div>
        </transition>
    </div>
</template>

<script>
import {ref} from "vue";

import {mixin as clickaway} from "../../plugins/click-away";

export default {
    name: "ModalBlank",
    mixins: [clickaway],
    props: {
        id: {type: String, default: null},
        modalOpen: {type: Boolean, default: false},
    },
    emits: ["close-modal"],
    setup(props, {emit}) {
        const modalContent = ref(null);

        const away = () => {
            emit("close-modal");
        };

        return {
            modalContent,
            away,
        };
    },
};
</script>
