<template>
  <v-container>
    <v-row>
      <v-col>
        <h2 class="text-h5 mb-4">강의 관리</h2>
      </v-col>
    </v-row>

    <v-row>
      <v-col>
        <v-btn class="mb-4 float-right" color="primary" @click="addLectureDialog = true">
          강의 추가
        </v-btn>
      </v-col>
    </v-row>

    <v-row>
      <v-col>
        <v-table density="comfortable">
          <thead>
          <tr>
            <th class="text-left">강의명</th>
            <th class="text-left">강사명</th>
            <th class="text-left">강의 일정</th>
            <th class="text-left">수강료</th>
            <th class="text-left">수강생 수</th>
          </tr>
          </thead>
          <tbody>
          <tr v-for="lecture in lectures" :key="lecture.id">
            <td>{{ lecture.name }}</td>
            <td>{{ lecture.instructor }}</td>
            <td>{{ lecture.startDate }} ~ {{ lecture.endDate }}</td>
            <td>{{ lecture.fee }}</td>
            <td>{{ lecture.enrolledStudents }}</td>
          </tr>
          </tbody>
        </v-table>
      </v-col>
    </v-row>

    <v-dialog v-model="addLectureDialog" max-width="600">
      <v-card>
        <v-card-title>강의 추가</v-card-title>
        <v-card-text>
          <v-row>
            <v-col cols="12">
              <v-text-field v-model="newLecture.name" label="강의명" density="comfortable"></v-text-field>
              <v-text-field v-model="newLecture.instructor" label="강사명" density="comfortable"></v-text-field>
              <v-text-field v-model="newLecture.fee" label="수강료" type="number" density="comfortable"></v-text-field>
            </v-col>
            <v-col cols="6">
              <v-text-field v-model="newLecture.startDate" label="시작일" type="date" density="comfortable"></v-text-field>
            </v-col>
            <v-col cols="6">
              <v-text-field v-model="newLecture.endDate" label="종료일" type="date" density="comfortable"></v-text-field>
            </v-col>
            <v-col cols="12">
              <v-row>
                <v-col cols="4">
                  <v-checkbox v-model="newLecture.schedule.MON.checked" label="월요일" value="월요일"></v-checkbox>
                </v-col>
                <v-col cols="4">
                  <v-text-field v-model="newLecture.schedule.MON.startTime" type="time" label="시작시간"
                                :disabled="!newLecture.schedule.MON.checked"></v-text-field>
                </v-col>
                <v-col cols="4">
                  <v-text-field v-model="newLecture.schedule.MON.endTime" type="time" label="종료시간"
                                :disabled="!newLecture.schedule.MON.checked"></v-text-field>
                </v-col>
              </v-row>
              <v-row>
                <v-col cols="4">
                  <v-checkbox v-model="newLecture.schedule.TUE.checked" label="화요일" value="화요일"></v-checkbox>
                </v-col>
                <v-col cols="4">
                  <v-text-field v-model="newLecture.schedule.TUE.startTime" type="time" label="시작시간"
                                :disabled="!newLecture.schedule.TUE.checked"></v-text-field>
                </v-col>
                <v-col cols="4">
                  <v-text-field v-model="newLecture.schedule.TUE.endTime" type="time" label="종료시간"
                                :disabled="!newLecture.schedule.TUE.checked"></v-text-field>
                </v-col>
              </v-row>
              <v-row>
                <v-col cols="4">
                  <v-checkbox v-model="newLecture.schedule.WED.checked" label="수요일" value="수요일"></v-checkbox>
                </v-col>
                <v-col cols="4">
                  <v-text-field v-model="newLecture.schedule.WED.startTime" type="time" label="시작시간"
                                :disabled="!newLecture.schedule.WED.checked"></v-text-field>
                </v-col>
                <v-col cols="4">
                  <v-text-field v-model="newLecture.schedule.WED.endTime" type="time" label="종료시간"
                                :disabled="!newLecture.schedule.WED.checked"></v-text-field>
                </v-col>
              </v-row>
              <v-row>
                <v-col cols="4">
                  <v-checkbox v-model="newLecture.schedule.THU.checked" label="목요일" value="목요일"></v-checkbox>
                </v-col>
                <v-col cols="4">
                  <v-text-field v-model="newLecture.schedule.THU.startTime" type="time" label="시작시간"
                                :disabled="!newLecture.schedule.THU.checked"></v-text-field>
                </v-col>
                <v-col cols="4">
                  <v-text-field v-model="newLecture.schedule.THU.endTime" type="time" label="종료시간"
                                :disabled="!newLecture.schedule.THU.checked"></v-text-field>
                </v-col>
              </v-row>
              <v-row>
                <v-col cols="4">
                  <v-checkbox v-model="newLecture.schedule.FRI.checked" label="금요일" value="금요일"></v-checkbox>
                </v-col>
                <v-col cols="4">
                  <v-text-field v-model="newLecture.schedule.FRI.startTime" type="time" label="시작시간"
                                :disabled="!newLecture.schedule.FRI.checked"></v-text-field>
                </v-col>
                <v-col cols="4">
                  <v-text-field v-model="newLecture.schedule.FRI.endTime" type="time" label="종료시간"
                                :disabled="!newLecture.schedule.FRI.checked"></v-text-field>
                </v-col>
              </v-row>
              <v-row>
                <v-col cols="4">
                  <v-checkbox v-model="newLecture.schedule.SAT.checked" label="토요일" value="토요일"></v-checkbox>
                </v-col>
                <v-col cols="4">
                  <v-text-field v-model="newLecture.schedule.SAT.startTime" type="time" label="시작시간"
                                :disabled="!newLecture.schedule.SAT.checked"></v-text-field>
                </v-col>
                <v-col cols="4">
                  <v-text-field v-model="newLecture.schedule.SAT.endTime" type="time" label="종료시간"
                                :disabled="!newLecture.schedule.SAT.checked"></v-text-field>
                </v-col>
              </v-row>
              <v-row>
                <v-col cols="4">
                  <v-checkbox v-model="newLecture.schedule.SUN.checked" label="일요일" value="일요일"></v-checkbox>
                </v-col>
                <v-col cols="4">
                  <v-text-field v-model="newLecture.schedule.SUN.startTime" type="time" label="시작시간"
                                :disabled="!newLecture.schedule.SUN.checked"></v-text-field>
                </v-col>
                <v-col cols="4">
                  <v-text-field v-model="newLecture.schedule.SUN.endTime" type="time" label="종료시간"
                                :disabled="!newLecture.schedule.SUN.checked"></v-text-field>
                </v-col>
              </v-row>
            </v-col>
          </v-row>
        </v-card-text>
        <v-card-actions>
          <v-btn color="primary" @click="addLecture">추가</v-btn>
          <v-btn color="primary" @click="addLectureDialog = false">취소</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script setup>
import {ref, watch} from 'vue'
import axios from "axios";

const addLectureDialog = ref(false)
const lectures = ref([
  {
    id: 1,
    name: 'Vue.js',
    instructor: '홍길동',
    startDate: '2021-09-01',
    endDate: '2021-09-30',
    fee: 100000,
    enrolledStudents: 10,
  },
  {
    id: 2,
    name: 'React.js',
    instructor: '김철수',
    startDate: '2021-10-01',
    endDate: '2021-10-31',
    fee: 120000,
    enrolledStudents: 15,
  },
  {
    id: 3,
    name: 'Angular.js',
    instructor: '이영희',
    startDate: '2021-11-01',
    endDate: '2021-11-30',
    fee: 150000,
    enrolledStudents: 20,
  },
])

const newLecture = ref({
  name: '',
  instructor: '',
  startDate: '',
  endDate: '',
  fee: 0,
  enrolledStudents: 0,
  schedule: {
    MON: {checked: false, startTime: null, endTime: null},
    TUE: {checked: false, startTime: null, endTime: null},
    WED: {checked: false, startTime: null, endTime: null},
    THU: {checked: false, startTime: null, endTime: null},
    FRI: {checked: false, startTime: null, endTime: null},
    SAT: {checked: false, startTime: null, endTime: null},
    SUN: {checked: false, startTime: null, endTime: null},
  },
})

const addLecture = () => {
  const lectureCreateRequest = {
    name: newLecture.value.name,
    description: '', // description 필드가 newLecture에 없으므로 빈 문자열로 설정
    instructor: newLecture.value.instructor,
    startDate: newLecture.value.startDate,
    endDate: newLecture.value.endDate,
    monStartTime: newLecture.value.schedule.MON.checked ? newLecture.value.schedule.MON.startTime : null,
    monEndTime: newLecture.value.schedule.MON.checked ? newLecture.value.schedule.MON.endTime : null,
    tueStartTime: newLecture.value.schedule.TUE.checked ? newLecture.value.schedule.TUE.startTime : null,
    tueEndTime: newLecture.value.schedule.TUE.checked ? newLecture.value.schedule.TUE.endTime : null,
    wedStartTime: newLecture.value.schedule.WED.checked ? newLecture.value.schedule.WED.startTime : null,
    wedEndTime: newLecture.value.schedule.WED.checked ? newLecture.value.schedule.WED.endTime : null,
    thuStartTime: newLecture.value.schedule.THU.checked ? newLecture.value.schedule.THU.startTime : null,
    thuEndTime: newLecture.value.schedule.THU.checked ? newLecture.value.schedule.THU.endTime : null,
    friStartTime: newLecture.value.schedule.FRI.checked ? newLecture.value.schedule.FRI.startTime : null,
    friEndTime: newLecture.value.schedule.FRI.checked ? newLecture.value.schedule.FRI.endTime : null,
    satStartTime: newLecture.value.schedule.SAT.checked ? newLecture.value.schedule.SAT.startTime : null,
    satEndTime: newLecture.value.schedule.SAT.checked ? newLecture.value.schedule.SAT.endTime : null,
    sunStartTime: newLecture.value.schedule.SUN.checked ? newLecture.value.schedule.SUN.startTime : null,
    sunEndTime: newLecture.value.schedule.SUN.checked ? newLecture.value.schedule.SUN.endTime : null,
  };

  axios.post('https://veritas-s.app/api/lectures', lectureCreateRequest).then((response) => {
    console.log(response)
  })
}

const daysOfWeek = ['MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT', 'SUN']
daysOfWeek.forEach(day => {
  watch(() => newLecture.value.schedule[day].checked, (newVal) => {
    if (!newVal) {
      newLecture.value.schedule[day].startTime = null
      newLecture.value.schedule[day].endTime = null
    }
  })
})

</script>
