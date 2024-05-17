<template>
  <v-card v-for="enrollment in enrollments" max-width="358" :key="enrollment.id" class="ma-8" elevation="4">
    <v-card-item>
      <v-card-title>
        {{ enrollment.lecture.name }}
      </v-card-title>
      <v-card-subtitle>
        {{ enrollment.lecture.startDate }} ~ {{ enrollment.lecture.endDate }}
      </v-card-subtitle>
    </v-card-item>
    <v-card-text>
      <v-row>
        <v-col>
          강사 <b>{{ enrollment.lecture.instructor }}</b>
        </v-col>
        <v-col class="text-right" style="color: blue">
          총 {{ enrollment.lecture.schedules.length }} 회
        </v-col>
      </v-row>
      <v-row>

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
