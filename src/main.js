import { createApp } from "vue";
import VueLazyLoad from "vue3-lazyload";
import App from "./App.vue";
import axios from "axios";
import VueAxios from "vue-axios";
import { createPinia } from "pinia";
import { createMetaManager } from "vue-meta";
import "@/assets/scss/style.scss";
import "@fortawesome/fontawesome-free/css/all.css";

import "./index.css";

import router from "./router"; // Import the router here

const app = createApp(App);

const pinia = createPinia();
app.use(VueAxios, axios);
app.use(router);
app.use(pinia);
app.use(createMetaManager());
app.use(VueLazyLoad, {
  loading: "",
  error: "",
});

app.mount("#app");


