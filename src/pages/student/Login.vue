<template>
  <v-container class="fill-height" fluid>
    <v-row align="center" justify="center">
      <v-col cols="12" sm="8" md="4">
        <v-card>
          <v-card-title class="text-center">학생 로그인</v-card-title>
          <v-card-text>
            <v-form>
              <v-text-field
                  v-model="loginId"
                  label="LoginId"
                  prepend-icon="mdi-account"
                  required
              ></v-text-field>
              <v-text-field
                  v-model="password"
                  label="Password"
                  prepend-icon="mdi-lock"
                  type="password"
                  required
              ></v-text-field>
            </v-form>
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="primary" @click="login">Login</v-btn>
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
  <!--
  <v-btn @click="kakaoLogin">
    <v-icon left>mdi-chat</v-icon>
    카카오로 로그인
  </v-btn>

  <v-btn @click="logout">로그아웃</v-btn>
  -->
</template>

<script setup>
import axios from "axios";
import router from "@/scripts/router";
import { ref } from "vue";
import store from "@/scripts/store";

const loginId = ref("");
const password = ref("");

const login = () => {
  axios
      .post("/api/students/login", {
        loginId: loginId.value,
        password: password.value,
      })
      .then((response) => {
        if (response.data.header.success) {
          store.commit("setLogin", true);
          localStorage.setItem("studentId", response.data.data.id)
          router.push("/");
        } else {
          alert(response.data.header.message);
        }
      })
      .catch((error) => {
        alert(error.response.data.message);
      });
};
/*
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
      `prompt=consent`;

  window.location.href = kakaoAuthUrl;
};

const generateState = () => {
  const state = Math.random().toString(36).substring(7);
  localStorage.setItem("state", state);
  return state;
};

const logout = async () => {
  try {
    await axios.post("/auth/logout");
    localStorage.removeItem("token");
    localStorage.removeItem("userEmail");
    router.push("/login");
  } catch (error) {
    console.error(error);
  }
};

 */
</script>