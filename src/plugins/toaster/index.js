import Toaster from "./Toaster.vue";
import createToaster from "./api.js";
const Plugin = (app, options = {}) => {
    let methods = createToaster(options);
    app.$toast = methods;
    app.config.globalProperties.$toast = methods;
};

Toaster.install = Plugin;

export default Toaster;
export { Toaster, createToaster };
