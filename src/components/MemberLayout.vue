<template>
  <v-app-bar color="transparent" flat density="compact" v-if="$route.path !== '/login'">
    <v-app-bar-nav-icon @click.stop="drawer = !drawer" v-if="!$vuetify.display.mdAndUp"></v-app-bar-nav-icon>

    <v-toolbar-title class="mr-4">
      <v-img src="@/assets/daechi-logo.png" max-height="40"></v-img>
    </v-toolbar-title>

  </v-app-bar>

  <v-navigation-drawer :location="'bottom'" style="height: auto" v-if="$route.path !== '/login'" v-model="drawer"
                       floating :permanent="$vuetify.display.mdAndUp">
    <v-list density="compact" nav>
      <v-list-item prepend-icon="mdi-logout" title="로그아웃" value="logout" @click="logout"></v-list-item>
    </v-list>
  </v-navigation-drawer>
  <v-main>
    <router-view/>
  </v-main>
  <!-- footer -->
  <v-footer class="footer">
    <v-row>
      <v-col>
        <div>상호명: (주) 골든이스트에듀</div>
        <div>대표자: 금동흠</div>
        <div>대표번호: 02-564-5557</div>
        <div>주소: 서울특별시 강남구 선릉로 64길 8-1, 지하1층-6층(대치동)</div>
        <div>사업자등록번호: 475-87-02839</div>
        <div>이메일: veritasedus@gmail.com</div>
      </v-col>
    </v-row>
  </v-footer>
</template>
<script setup>
import {ref} from "vue";
import axios from "axios";
import router from "@/scripts/router";

const drawer = ref(null)

const logout = () => {
  axios.post('https://veritas-s.app/api/auth/logout').then(() => {
    router.push('/login')
  })
}
</script>
<style scoped>
.footer {
  color: darkgray;
  font-size: small;
  background-color: #f5f5f5;
}
</style>