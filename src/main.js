import { createApp } from "vue";
import { createPinia } from "pinia";
import "normalize.css";
import "./styles/global.scss";

import App from "./App.vue";
import router from "./router";

const app = createApp(App);

app.use(createPinia());
app.use(router);

app.mount("#app");
