<template>
  <v-app-bar app color="primary" density="compact">
    <v-app-bar-nav-icon @click.stop="drawer = !drawer" v-if="!$vuetify.display.mdAndUp"></v-app-bar-nav-icon>

    <v-toolbar-title>Veritas-S 관리자 페이지</v-toolbar-title>

    <v-spacer></v-spacer>

  </v-app-bar>

  <v-navigation-drawer v-if="$route.path !== '/admin/login'" v-model="drawer" floating :permanent="$vuetify.display.mdAndUp">
    <v-list density="compact" nav>
      <v-list-item prepend-icon="mdi-account-multiple" title="회원 관리" value="member"></v-list-item>
      <v-list-item prepend-icon="mdi-calendar-multiple-check" title="출결 관리" value="attendance"></v-list-item>
      <v-list-item prepend-icon="mdi-book-open-page-variant" title="독서실 관리" value="readingrooms" to="/admin/readingrooms"></v-list-item>
      <v-list-item prepend-icon="mdi-cog" title="설정" value="settings"></v-list-item>
      <v-divider/>

      <v-list-item prepend-icon="mdi-logout" title="로그아웃" value="logout" @click="logout"></v-list-item>

      <!--
      <v-list-group value="about">
        <template v-slot:activator="{ props }">
          <v-list-item v-bind="props" prepend-icon="mdi-forum" title="About"></v-list-item>
        </template>

        <v-list-item value="about/company" prepend-icon="mdi-forum">
          <v-list-item-title>Company</v-list-item-title>
        </v-list-item>
        <v-list-item value="about/team">
          <v-list-item-title>Team</v-list-item-title>
        </v-list-item>
      </v-list-group>
      -->

    </v-list>
  </v-navigation-drawer>
  <router-view/>

</template>

<script setup>
import { ref } from 'vue'
import axios from "axios";
import store from "@/scripts/store";
import router from "@/scripts/router";

const drawer = ref(null)

const logout = () => {
  if (confirm("로그아웃하시겠습니까?")) {
    axios.post('/api/admin/logout').then((response) => {
      if (response.data.header.success) {
        store.commit('setIsAuth', false)
        localStorage.removeItem("vuex")
        router.push('/')
      }
    })
  }
}
</script>