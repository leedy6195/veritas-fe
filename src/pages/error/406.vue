<!-- user is unregistered error page. show tel of academy -->


<template>
  <v-container class="fill-height">
    <v-row class="ma-4">
      <v-col>
        <v-img src="@/assets/daechi-logo.png" min-width="10em" ></v-img>
      </v-col>
    </v-row>
    <v-row class="ma-6">
      <v-col>
        <v-card>
          <v-card-title class="text-center">등록되지 않은 회원입니다</v-card-title>
          <v-card-text>
            <p>이 페이지에 접근할 권한이 없습니다.</p>
          </v-card-text>
          <v-card-actions>
            <v-btn color="primary" @click="goLoginPage">뒤로 가기</v-btn>
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>


<script setup>
import router from "@/scripts/router";

const goLoginPage = () => {
  router.push("/login")
};
</script>