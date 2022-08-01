<template>
    <div :style="finalStyle"></div>
</template>

<script>
import { computed } from "vue";
import { RADON_LOADING_BAR } from "./progress";

export default {
    name: "VueProgress",
    serverCacheKey: () => "Progress",
    setup() {
        const progress = RADON_LOADING_BAR;
        const finalStyle = computed(() => {
            const options = progress.options;
            const isShow = !!options.show;
            const location = options.location;
            const style = {
                "z-index": 999999,
                "background-color": options.canSuccess
                    ? options.color
                    : options.failedColor,
                opacity: options.show ? 1 : 0,
                position: options.position,
            };
            if (location === "top" || location === "bottom") {
                location === "top"
                    ? (style.top = "0px")
                    : (style.bottom = "0px");
                if (!options.inverse) {
                    style.left = "0px";
                } else {
                    style.right = "0px";
                }
                style.width = progress.percent + "%";
                style.height = options.thickness;
                style.transition =
                    (isShow ? "width " + options.transition.speed + ", " : "") +
                    "opacity " +
                    options.transition.opacity;
            } else if (location === "left" || location === "right") {
                location === "left"
                    ? (style.left = "0px")
                    : (style.right = "0px");
                if (!options.inverse) {
                    style.bottom = "0px";
                } else {
                    style.top = "0px";
                }
                style.height = progress.percent + "%";
                style.width = options.thickness;
                style.transition =
                    (isShow
                        ? "height " + options.transition.speed + ", "
                        : "") +
                    "opacity " +
                    options.transition.opacity;
            }
            return style;
        });
        return {
            progress,
            finalStyle,
        };
    },
};
</script>
