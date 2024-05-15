<template>
  <v-container>
    <v-row>
      <v-col>
        <h2 class="text-h5 mb-4">강의 일정 [{{ lecture.name }}]</h2>
      </v-col>
    </v-row>

    <v-row>
      <v-col>
        <v-btn class="mb-4 float-right" color="primary" @click="addScheduleDialog = true">
          일정 추가
        </v-btn>
      </v-col>
    </v-row>

    <v-row>
      <v-col>
        <v-table density="comfortable">
          <thead>
          <tr>
            <th class="text-left">순번</th>
            <th class="text-left">강의일</th>
            <th class="text-left">강의시간</th>
            <th class="text-left">강의내용</th>
          </tr>
          </thead>
          <tbody>
          <tr v-for="(schedule, index) in lecture.schedules" :key="schedule.id">
            <td>{{ index + 1 }}</td>
            <td>{{ schedule.date }}</td>
            <td><v-chip>{{ schedule.startTime }}</v-chip> ~ <v-chip>{{ schedule.endTime }}</v-chip></td>
            <td>{{ schedule.description }}</td>
          </tr>
          </tbody>
        </v-table>
      </v-col>
    </v-row>

    <v-dialog v-model="addScheduleDialog" max-width="600">
      <v-card>
        <v-card-title>일정 추가</v-card-title>
        <v-card-text>

          <v-form ref="addScheduleForm" @submit.prevent="addSchedule">
            <v-text-field
                v-model="newSchedule.date"
                label="강의일"
                type="date"
                required

            ></v-text-field>
            <v-text-field
                v-model="newSchedule.startTime"
                label="시작시간"
                type="time"
                required
            ></v-text-field>
            <v-text-field
                v-model="newSchedule.endTime"
                label="종료시간"
                type="time"
                required
            ></v-text-field>
            <v-text-field
                v-model="newSchedule.description"
                label="강의내용"
                required
            ></v-text-field>
          </v-form>


        </v-card-text>
        <v-card-actions>
          <v-btn color="primary" @click="addSchedule">추가</v-btn>
          <v-btn color="primary" @click="closeAddScheduleDialog">취소</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script setup>
import {useRoute} from "vue-router";
import axios from "axios";
import {onMounted, ref} from "vue";

const addScheduleDialog = ref(false)
const route = useRoute()
const lectureId = route.params.lectureId

const lecture = ref({
  id: null,
  name: '',
  description: '',
  instructor: '',
  startDate: '',
  endDate: '',
  fee: 0,
  schedules: []
})

const newSchedule = ref({
  date: '',
  startTime: '',
  endTime: '',
  description: ''
})

const addSchedule = () => {
  axios.post(`/lectures/${lectureId}/schedules`, newSchedule.value)
      .then(response => {
        console.log(response.data.data)
        //location.reload()
      })
      .catch(error => {
        console.error(error)
      })
}

const fetchLecture = () => {
  axios.get(`/lectures/${lectureId}`)
      .then(response => {
        console.log(response.data.data)
        lecture.value = response.data.data
      })
      .catch(error => {
        console.error(error)
      })
}

const closeAddScheduleDialog = () => {
  newSchedule.value = {
    date: '',
    startTime: '',
    endTime: '',
    description: ''
  }
  addScheduleDialog.value = false
}

onMounted(() => {
  fetchLecture()
})
</script>