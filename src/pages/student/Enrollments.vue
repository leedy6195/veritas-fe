<template>
  <v-card v-for="(enrollment, index) in enrollments" max-width="358"
          :key="enrollment.id" class="ma-4" elevation="2">

    <v-card-title style="font-weight: 800;">
      {{ enrollment.lecture.name }}
    </v-card-title>
    <v-card-subtitle>
      {{ enrollment.lecture.startDate }} ~ {{ enrollment.lecture.endDate }}
    </v-card-subtitle>

    <v-card-text >
      <v-row>
        <v-col>
          강사 <b>{{ enrollment.lecture.instructor }}</b>
        </v-col>
        <v-col class="text-right" style="color: blue">
          총 {{ enrollment.lecture.schedules.length }} 회
        </v-col>
      </v-row>


    </v-card-text>
    <v-card-actions>


      <v-spacer></v-spacer>

      <v-btn
          :icon="showList[index] ? 'mdi-chevron-up' : 'mdi-chevron-down'"
          @click="toggleShow(index)"
      ></v-btn>
    </v-card-actions>
    <v-expand-transition>
      <div v-show="showList[index]">
        <v-divider></v-divider>
        <v-card-text>
          {{enrollment.lecture.description}}
        </v-card-text>
      </div>
    </v-expand-transition>
  </v-card>
</template>
<script setup>

import {onMounted, ref} from "vue";
import axios from "axios";

const enrollments = ref([]);
const showList = ref([]);

const fetchMyEnrollments = () => {
  axios.get('https://veritas-s.app/api/enrollments/my').then((response) => {
    enrollments.value = response.data.data
    showList.value = new Array(enrollments.value.length).fill(false);
  })
}

const toggleShow = (index) => {
  showList.value[index] = !showList.value[index];
};

onMounted(() => {
  fetchMyEnrollments()
})

</script>
