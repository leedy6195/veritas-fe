<template>
  <v-app-bar color="transparent" flat density="compact" v-if="$route.path !== '/login'">
    <v-app-bar-nav-icon @click.stop="drawer = !drawer" v-if="!$vuetify.display.mdAndUp"></v-app-bar-nav-icon>
    <v-toolbar-title><v-img src="@/assets/daechi-logo.png" max-height="40"></v-img></v-toolbar-title>
    <!--<v-btn class="logout-button">로그아웃</v-btn>-->
  </v-app-bar>

  <v-navigation-drawer :location="'bottom'" style="height: auto" v-if="$route.path !== '/login'" v-model="drawer" floating :permanent="$vuetify.display.mdAndUp">
    <v-list density="compact" nav>
      <v-list-item prepend-icon="mdi-logout" title="로그아웃" value="logout" @click="logout"></v-list-item>
    </v-list>
  </v-navigation-drawer>

  <router-view/>
</template>
<script setup>
import {ref} from "vue";
import axios from "axios";
import router from "@/scripts/router";

const drawer = ref(null)

const logout = () => {
  axios.post('/auth/logout').then(() => {
    router.push('/login')
  })
}
</script>