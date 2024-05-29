<template>
  <v-container>
    <v-row class="mb-10">
      <v-col class="centered">
        <v-img src="@/assets/daechi-logo.png" min-width="10" max-width="12em"></v-img>
      </v-col>
    </v-row>
    <v-row>
      <v-col>
        <v-text-field class="mx-3" variant="underlined" type="email" label="이메일 주소" v-model="email" density="comfortable" required></v-text-field>
      </v-col>
    </v-row>
    <v-row>
      <v-col>
        <v-text-field class="mx-3" variant="underlined" type="tel" label="휴대폰 번호" v-model="tel" placeholder="휴대폰 번호를 입력하세요(- 제외)" density="comfortable"
                      required></v-text-field>
      </v-col>
    </v-row>
    <v-row>
      <v-col class="centered">
        <v-btn color="black" width="16em" height="3.5em" @click="login">로그인</v-btn>
      </v-col>
    </v-row>
    <v-row>
      <v-col>
        <v-divider>OR</v-divider>
      </v-col>
    </v-row>

    <v-row>
      <v-col class="centered">
        <v-img src="@/assets/kakao_login_medium_narrow.png" min-width="14em" max-width="14em"
               @click="kakaoLogin"></v-img>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup>
import { ref } from 'vue';
import axios from "axios";
import router from "@/scripts/router";

const email = ref("");
const tel = ref("");

const login = async () => {
  if (!email.value) {
    alert("이메일 주소를 입력하세요.");
    return;
  }
  if (!tel.value) {
    alert("휴대폰 번호를 입력하세요.");
    return;
  }

  try {
    const response = await axios.post("https://veritas-s.app/api/auth/login", {
      email: email.value,
      tel: tel.value,
    });
    if (response.data.header.success) {
      router.push("/");
    }
  } catch (error) {
    console.error(error);
  }
};
const kakaoLogin = () => {
  const clientId = process.env.VUE_APP_KAKAO_CLIENT_ID;
  const redirectUri = process.env.VUE_APP_REDIRECT_URI;
  const kakaoAuthUrl =
      `https://kauth.kakao.com/oauth/authorize?` +
      `client_id=${clientId}&` +
      `redirect_uri=${redirectUri}&` +
      `response_type=code&` +
      `scope=phone_number&` +
      `state=${generateState()}&` +
      `prompt=login`;

  window.location.href = kakaoAuthUrl;
};

const generateState = () => {
  const state = Math.random().toString(36).substring(7);
  localStorage.setItem("state", state);
  return state;
};


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
<style scoped>
.centered {
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>
