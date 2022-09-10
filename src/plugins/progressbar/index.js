import View from "./progressbar.vue";

import { api as progress } from "./progress.js";

const ProgressBar = {
  install: (app) => {
    app.component("VueProgressBar", View);
    app.config.globalProperties.$progress = progress;
  },
};

export default ProgressBar;
export { ProgressBar, progress };
