<template>
    <div class="focal-point">
        <div class="focal-point-toolbox card">
            <div class="form-group">
                <label>Click image to adjust the focal point</label>
                <small class="help-block"
                >The focal point is used when cropping so the most important
                    part of the image is not removed.
                </small>
                <div class="focal-point-image inline-block">
                    <img :src="image" ref="image"/>
                    <div
                        class="focal-point-reticle"
                        :style="{ top: y + '%', left: x + '%' }"
                    ></div>
                </div>
            </div>
            <div class="flexy apart">
                <div class="btn-group">
                    <button
                        type="button"
                        class="btn btn-default"
                        @click.prevent="close"
                    >
                        Cancel
                    </button>
                    <button
                        type="button"
                        class="btn btn-default"
                        @click.prevent="reset"
                    >
                        Reset
                    </button>
                    <button
                        type="button"
                        class="btn btn-primary"
                        @click="select"
                    >
                        Select
                    </button>
                </div>
                <div class="focal-point-coordinates">
                    <div class="pair">
                        <div class="axis">X</div>
                        <div class="value">{{ x }}<sup>%</sup></div>
                    </div>
                    <div class="pair">
                        <div class="axis">Y</div>
                        <div class="value">{{ y }}<sup>%</sup></div>
                    </div>
                </div>
            </div>
        </div>
        <div
            v-for="(n,index) in 9" :key="index"
            :class="'frame frame-' + n"
            :style="{
                backgroundImage: 'url(' + bgImage + ')',
                backgroundPosition: bgPosition,
            }"
        ></div>
    </div>
</template>

<script>
export default {
    props: {
        data: {
            type: String,
            default: "50-50"
        }, // The initial focus point data stored in the asset, if applicable.
        image: {
            type: String,
            default: null
        }, // The url of the image.
    },

    emits: ["selected", "closed"],

    data() {
        return {
            x: 50,
            y: 50,
        };
    },

    computed: {
        bgPosition() {
            return this.x + "% " + this.y + "%";
        },

        bgImage() {
            return encodeURI(this.image);
        },
    },

    mounted() {
        const initial = this.data || "50-50";
        const coords = initial.split("-");
        this.x = coords[0];
        this.y = coords[1];
    },

    methods: {
        define(e) {
            var $el = this.$refs.image;

            var imageW = $el.width();
            var imageH = $el.height();

            var offsetX = e.pageX - $el.offset().left;
            var offsetY = e.pageY - $el.offset().top;

            this.x = ((offsetX / imageW) * 100).toFixed();
            this.y = ((offsetY / imageH) * 100).toFixed();
        },

        select() {
            this.$emit("selected", this.x + "-" + this.y);
            this.close();
        },

        close() {
            this.$emit("closed");
        },

        reset() {
            this.x = 50;
            this.y = 50;
        },
    },
};
</script>
