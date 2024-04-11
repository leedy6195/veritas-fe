import {createApp} from 'vue'
import App from './App.vue'
import vuetify from './plugins/vuetify'
import {loadFonts} from './plugins/webfontloader'
import router from "@/scripts/router";
import VueSimpleContextMenu from 'vue-simple-context-menu';
import 'vue-simple-context-menu/dist/vue-simple-context-menu.css';


loadFonts()

createApp(App)
    .use(router)
    .use(vuetify)
    .use(VueSimpleContextMenu)
    .mount('#app')
