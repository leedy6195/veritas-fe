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
            <tr v-for="attendance in attendances" :key="attendance.attendanceCoode">
              <td>{{ attendance.roomName }}</td>
              <td>{{ attendance.formattedEnterTime }}</td>
              <td>{{ attendance.formattedExitTime }}</td>
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
//import {useRouter} from "vue-router";

//const router = useRouter();
const studentInfo = ref({serial: "", name: ""});
/*
const facilities = ref([
  {name: "독서실 A", entryTime: "09:00", exitTime: "18:00"},
  {name: "체육관", entryTime: "13:00", exitTime: "17:00"},
  {name: "강의실", entryTime: "10:00", exitTime: "16:00"},
]);
 */
const attendances = ref([]);


const getMyAccess = () => {
  axios.get("https://veritas-s.app/api/access/my").then((response) => {
    attendances.value = response.data.data.map(attendance => ({
          ...attendance,
          formattedEnterTime: formatDate(attendance.enterTime),
          formattedExitTime: formatDate(attendance.exitTime)
        })
    )
  });
};

const formatDate = (dateString) => {
  if (!dateString) return '';

  const date = new Date(dateString);
  const year = date.getFullYear().toString().slice(-2);
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const day = date.getDate().toString().padStart(2, '0');
  const hours = date.getHours().toString().padStart(2, '0');
  const minutes = date.getMinutes().toString().padStart(2, '0');
  return `${year}-${month}-${day} ${hours}:${minutes}`;
};

const getStudentInfo = () => {
  axios.get("https://veritas-s.app/api/students/getMyInfo").then((response) => {
    studentInfo.value = response.data.data;
  });
};
/*
const goToDetailPage = () => {
  router.push({name: "DetailPage"});
};
 */

onMounted(() => {
  getStudentInfo();
  getMyAccess();
});
</script>

<style scoped>

</style>