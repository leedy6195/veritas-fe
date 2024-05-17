<template>
  <v-card v-for="enrollment in enrollments" :key="enrollment.id">
    <v-card-title>
      {{ enrollment.lecture.name }}
    </v-card-title>
    <v-card-text>
      <v-row>
        <v-col>
          {{ enrollment.lecture.startDate }} ~ {{ enrollment.lecture.endDate }}
        </v-col>
      </v-row>
      <v-row>
        <v-col>
          강사 {{ enrollment.lecture.instructor }}
        </v-col>
      </v-row>
      <v-row>
        <v-col>
          총 {{ enrollment.lecture.schedules.length }} 회
        </v-col>
      </v-row>
    </v-card-text>
  </v-card>
</template>
<script setup>

import {onMounted, ref} from "vue";
import axios from "axios";

const enrollments = ref([]);


const fetchMyEnrollments = () => {
  axios.get('https://veritas-s.app/api/enrollments/my').then((response) => {
    enrollments.value = response.data.data
  })
}

onMounted(() => {
  fetchMyEnrollments()
})

</script>
