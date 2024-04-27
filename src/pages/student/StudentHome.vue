<template>
  <v-container>
    <v-row>
      <v-col class="text-center">
        <v-card class="pa-5" flat>
          <qrcode-vue :value="studentInfo.serial"/>
        </v-card>
      </v-col>
    </v-row>
    <v-row>
      <v-col class="text-center">
        <v-card class="pa-1" flat>
          <v-card-actions class="justify-end">
            <v-icon @click="goToDetailPage">mdi-dots-horizontal</v-icon>
          </v-card-actions>
          <v-table density="comfortable">
            <thead>
            <tr>
              <th class="text-center">위치</th>
              <th class="text-center">입실</th>
              <th class="text-center">퇴실</th>
            </tr>
            </thead>
            <tbody>
            <tr v-for="facility in facilities" :key="facility.name">
              <td>{{ facility.name }}</td>
              <td>{{ facility.entryTime }}</td>
              <td>{{ facility.exitTime }}</td>
            </tr>
            </tbody>
          </v-table>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup>
import {onMounted, ref} from "vue";
import axios from "axios";
import QrcodeVue from "qrcode.vue";
import {useRouter} from "vue-router";

const router = useRouter();
const studentInfo = ref({serial: "", name: ""});
const facilities = ref([
  {name: "독서실 A", entryTime: "09:00", exitTime: "18:00"},
  {name: "체육관", entryTime: "13:00", exitTime: "17:00"},
  {name: "강의실", entryTime: "10:00", exitTime: "16:00"},
]);

const getStudentInfo = () => {
  axios.get("http://localhost:8080/api/students/getMyInfo").then((response) => {
    studentInfo.value = response.data.data;
  });
};

const goToDetailPage = () => {
  router.push({name: "DetailPage"});
};

onMounted(() => {
  getStudentInfo();
});
</script>

<style scoped>

</style>