<template>
  <v-app-bar app color="primary" density="compact">
    <v-app-bar-nav-icon @click.stop="drawer = !drawer" v-if="!$vuetify.display.mdAndUp"></v-app-bar-nav-icon>

    <v-toolbar-title>Veritas-S 관리자 페이지</v-toolbar-title>

    <v-spacer></v-spacer>

  </v-app-bar>

  <v-navigation-drawer v-if="$route.path !== '/admin/login'" v-model="drawer" floating :permanent="$vuetify.display.mdAndUp">
    <v-list density="compact" nav>
      <v-list-item prepend-icon="mdi-account-multiple" title="회원 관리" value="member" to="/admin/students"></v-list-item>
      <v-list-item prepend-icon="mdi-calendar-multiple-check" title="출결 관리" value="attendance" to="/admin/attendances"></v-list-item>


      <v-list-group value="facilities">
        <template v-slot:activator="{ props }">
          <v-list-item v-bind="props" prepend-icon="mdi-domain" title="시설 관리"></v-list-item>

        </template>

        <v-list-item title="독서실" value="readingrooms" to="/admin/readingrooms"></v-list-item>
        <v-list-item title="강의실" value="lecturerooms" to="/admin/lecturerooms"></v-list-item>
      </v-list-group>

      <v-list-group value="devices">
        <template v-slot:activator="{ props }">
          <v-list-item v-bind="props" prepend-icon="mdi-cog" title="디바이스 관리"></v-list-item>
        </template>

        <v-list-item value="kiosks" to="/admin/kiosks" title="키오스크" />

        <v-list-item value="entryDevices" to="/admin/entryDevices" title="출입 디바이스" />


      </v-list-group>

      <v-divider/>

      <v-list-item prepend-icon="mdi-logout" title="로그아웃" value="logout" @click="logout"></v-list-item>





    </v-list>
  </v-navigation-drawer>
  <router-view/>

</template>

<script setup>
import { ref } from 'vue'
import axios from "axios";
import router from "@/scripts/router";

const drawer = ref(null)

const logout = () => {
  if (confirm("로그아웃하시겠습니까?")) {
    axios.post('http://223.130.130.160:8080/api/admin/logout').then((response) => {
      if (response.data.header.success) {
        //store.commit('setIsAuth', false)
        //localStorage.removeItem("vuex")
        router.push('/')
      }
    })
  }
}
</script>