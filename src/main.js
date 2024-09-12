import {createApp} from 'vue';
import {createPinia} from "pinia";
import vuetify from "@/plugins/vuetify.js";

import App from './App.vue'
import VueKonva from 'vue-konva'

const pinia = createPinia()
const app = createApp(App)

app.use(pinia).use(vuetify).use(VueKonva).mount('#app')
