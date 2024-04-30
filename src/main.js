import {createApp} from 'vue'
import App from './App.vue'
import vuetify from './plugins/vuetify'
import VueFullscreen from "vue-fullscreen";
//import {loadFonts} from './plugins/webfontloader'
import router from "@/scripts/router";
import VueSimpleContextMenu from 'vue-simple-context-menu';
import 'vue-simple-context-menu/dist/vue-simple-context-menu.css';
import axios from "axios";

axios.defaults.withCredentials = true;

//loadFonts()

createApp(App)
    .use(router)
    .use(VueFullscreen)
    .use(vuetify)
    .use(VueSimpleContextMenu)
    .mount('#app')
