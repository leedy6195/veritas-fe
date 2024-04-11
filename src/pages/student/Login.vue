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
  <v-btn @click="kakaoLogin">
    <v-icon left>mdi-chat</v-icon>
    카카오로 로그인
  </v-btn>
  <v-btn @click="logout">로그아웃</v-btn>
</template>

<script>
import axios from "axios";
import router from "@/scripts/router";


export default {
  methods: {
    kakaoLogin() {
      const clientId = process.env.VUE_APP_KAKAO_CLIENT_ID;
      const redirectUri = process.env.VUE_APP_REDIRECT_URI;
      const kakaoAuthUrl = `https://kauth.kakao.com/oauth/authorize?` +
          `client_id=${clientId}&` +
          `redirect_uri=${redirectUri}&` +
          `response_type=code&` +
          `scope=profile_nickname account_email&` +
          `state=${this.generateState()}&` +
          `prompt=consent`


      window.location.href = kakaoAuthUrl;
    },
    generateState() {
      // 임의의 state 값 생성
      const state = Math.random().toString(36).substring(7);
      localStorage.setItem('state', state);
      return state;
    },
    async logout () {
      try {
        await axios.post('/auth/logout');
        // 로그아웃 성공 시 처리 로직
        localStorage.removeItem('token');
        localStorage.removeItem('userEmail');
        // 로그아웃 후 이동할 페이지로 라우팅
        router.push('/login');
      } catch (error) {
        // 로그아웃 실패 시 처리 로직
        console.error(error);
      }
    }
  },

}
</script>