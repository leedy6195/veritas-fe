<template>
  <v-container class="fill-height" fluid>
    <v-row align="center" justify="center">
      <v-col cols="12" sm="8" md="4">
        <v-card>
          <v-card-title class="text-center">관리자 로그인</v-card-title>
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
</template>
<script setup>
import {ref} from "vue";
import axios from "axios";
import store from "@/scripts/store";
import router from "@/scripts/router";

const loginId = ref("")
const password = ref("")

const login = () => {
  axios.post('http://223.130.130.160:8080/api/admin/login', {
    loginId: loginId.value,
    password: password.value
  }).then((response) => {
    if (response.data.header.success) {
      store.commit('setIsAuth', true)
      router.push('/admin')
    } else {
      alert(response.data.header.message)
    }

  }).catch((error) => {
    alert(error.response.data.message)
  })
}
</script>