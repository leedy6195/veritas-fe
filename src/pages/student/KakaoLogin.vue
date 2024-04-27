<template>
  <v-container class="fill-height">
    <v-row class="ma-4">
      <v-col>
        <v-img src="@/assets/daechi-logo.png" min-width="10em" ></v-img>
      </v-col>
    </v-row>
    <v-row class="ma-6">
      <v-col>
        <v-img src="@/assets/kakao_login_medium_narrow.png" min-width="10em" @click="kakaoLogin"></v-img>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup>
import {onMounted} from "vue";
import axios from "axios";

const kakaoLogin = () => {
  const clientId = process.env.VUE_APP_KAKAO_CLIENT_ID;
  const redirectUri = process.env.VUE_APP_REDIRECT_URI;
  const kakaoAuthUrl =
      `https://kauth.kakao.com/oauth/authorize?` +
      `client_id=${clientId}&` +
      `redirect_uri=${redirectUri}&` +
      `response_type=code&` +
      `scope=profile_nickname account_email&` +
      `state=${generateState()}&` +
      `prompt=login`;

  window.location.href = kakaoAuthUrl;
};

const generateState = () => {
  const state = Math.random().toString(36).substring(7);
  localStorage.setItem("state", state);
  return state;
};

onMounted(() => {
    axios.get('http://localhost:8080/test')
})


/*
const logout = async () => {
  try {
    const response = await axios.post("/auth/logout")
    if (response.data.header.success) {
      localStorage.removeItem("token");
      store.commit('setLogin', false)
      router.push("/login");
    }
  } catch (error) {
    console.error(error);
  }
};

 */


</script>