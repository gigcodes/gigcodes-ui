//components
import Tooltip from "./components/Tooltip.vue";
import Btn from "./components/buttons/Button.vue";
import BtnGroup from "./components/buttons/ButtonGroup.vue";
import DossierTable from "./components/dossier/DossierTable.vue";
import DossierSortSelector from "./components/dossier/SortSelector.vue";
import Modal from "./components/modal/Modal.vue";
import PublishButton from "./components/buttons/PublishButton.vue";
import LoadingGraphic from "./components/LoadingGraphic.vue";
import PageTree from "./components/structures/PageTree.vue";
import Cookies from "js-cookie";
import SvgIcon from "./components/SvgIcon.vue";
import MediaSelector from "./components/assets/MediaSelector.vue";
import "luminous-lightbox/dist/luminous-basic.css";
//fieldTypes
import TextField from "./components/fieldtypes/TextFieldtype.vue";
import TextAreaField from "./components/fieldtypes/TextAreaFieldtype.vue";
import SelectField from "./components/fieldtypes/SelectFieldtype.vue";
import ToggleField from "./components/fieldtypes/ToggleFieldtype.vue";
import AssetsField from "./components/fieldtypes/assets/AssetsFieldtype.vue";

//plugins
import { createToaster, default as Toaster } from "./plugins/toaster";
import { default as ProgressBar, progress } from "./plugins/progressbar";
import copy from "./plugins/copyt-to-clipboard";
import RouteMiddleware from "./plugins/route-middleware";
import slugify from "./plugins/slugify";
import {
  directive as CADirective,
  mixin as CAMixin,
  plugin as CAPlugin,
} from "./plugins/click-away";
import { default as Events } from "./modules/events";
import "./plugins/mousetrap/mousetrap";
import "./sass/index.scss";

import { default as hasErrorMixin } from "./mixins/hasError";

const dev = import.meta.env.DEV;
window.cloneItem = function (value) {
  if (value === undefined) return undefined;

  return JSON.parse(JSON.stringify(value));
};

window.Cookies = Cookies;

window.dd = function (args) {
  if (dev) console.log(args);
  return "";
};

const mousetrap = window.Mousetrap;

const components = {
  Tooltip,
  Btn,
  BtnGroup,
  DossierTable,
  DossierSortSelector,
  Modal,
  TextField,
  TextAreaField,
  SelectField,
  ToggleField,
  PublishButton,
  LoadingGraphic,
  PageTree,
  SvgIcon,
};

const GigcodesAdmin = {
  install(app) {
    for (const prop in components) {
      if (Object.prototype.hasOwnProperty.call(components, prop)) {
        const component = components[prop];
        app.component(component.name, component);
      }
    }
  },
};

mousetrap.bind(
  ["/", "mod+k"],
  () => {
    Events.$emit("openSearch");
  },
  "keyup"
);

export {
  Tooltip,
  Btn,
  BtnGroup,
  DossierTable,
  DossierSortSelector,
  Modal,
  TextField,
  TextAreaField,
  SelectField,
  ToggleField,
  MediaSelector,
  Toaster,
  createToaster,
  copy,
  RouteMiddleware,
  CAMixin,
  CAPlugin,
  CADirective,
  Events,
  hasErrorMixin,
  mousetrap,
  slugify,
  ProgressBar,
  progress,
  GigcodesAdmin,
  AssetsField,
  GigcodesAdmin as default,
};
