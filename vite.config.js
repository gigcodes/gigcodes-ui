const path = require("path");
const {defineConfig} = require("vite");
const vue = require("@vitejs/plugin-vue");

// https://vitejs.dev/config/
export default defineConfig({
    build: {
        lib: {
            entry: path.resolve(__dirname, "src/index.js"),
            name: "GigcodesAdmin",
            fileName: (format) => `gigcodes-admin.${format}.js`,
        },
        rollupOptions: {
            external: ["vue"],
            output: {
                // Provide global variables to use in the UMD build
                // Add external deps here
                globals: {
                    vue: "Vue",
                },
            },
        },
        css: {
            preprocessorOptions: {
                scss: {
                    additionalData: `@import "@/sass/index.scss";`
                }
            }
        },
    },
    plugins: [vue()],
    resolve: {
        alias: {
            '@': path.resolve(__dirname, 'src'),
        }
    }
});
