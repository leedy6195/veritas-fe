<template>
  <v-container>
    <v-row>
      <v-col>
        <h2 class="text-h5 mb-4">강의 관리</h2>
      </v-col>
    </v-row>

    <v-row>
      <v-col>
        <v-btn class="mb-4 float-right" color="primary" @click="openAddLectureDialog">
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
            <th class="text-left">강의노출</th>

          </tr>
          </thead>
          <tbody>
          <tr v-for="lecture in lectures" :key="lecture.id">
            <td @click="editLecture(lecture)" style="cursor: pointer;">{{ lecture.name }}</td>
            <td>{{ lecture.instructor }}</td>
            <td @click="goToSchedule(lecture.id)" style="cursor: pointer;">{{ lecture.startDate }} ~ {{ lecture.endDate }}</td>
            <td>{{ formatPrice(lecture.fee) }}</td>
            <td @click="goToEnrolledStudents(lecture.id)" style="cursor: pointer;">{{ lecture.enrolledStudents }}</td>
            <td>{{ lecture.status === 'OPEN'? '노출' : '숨김' }}</td>
          </tr>
          </tbody>
        </v-table>
      </v-col>
    </v-row>

    <!-- 강의 추가 다이얼로그 -->
    <v-dialog v-model="addLectureDialog" max-width="600">
      <v-card>
        <v-card-title>강의 추가</v-card-title>
        <v-card-text>
          <!-- 강의 추가 폼 -->
          <lecture-form v-model="newLecture" @submit="addLecture"></lecture-form>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="primary" @click="addLecture">추가</v-btn>
          <v-btn color="error" @click="addLectureDialog = false">취소</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- 강의 수정 다이얼로그 -->
    <v-dialog v-model="editLectureDialog" max-width="600">
      <v-card>
        <v-card-title>강의 수정</v-card-title>
        <v-card-text>
          <!-- 강의 수정 폼 -->
          <lecture-form v-model="editedLecture" @submit="updateLecture"></lecture-form>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="error" @click="deleteLecture">삭제</v-btn>
          <v-btn color="primary" @click="updateLecture">수정</v-btn>
          <v-btn color="error" @click="editLectureDialog = false">취소</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>



  </v-container>
</template>

<script setup>
import {onMounted, ref} from 'vue'
import axios from "axios";
import LectureForm from "@/components/LectureForm.vue";
import router from "@/scripts/router";

const addLectureDialog = ref(false)
const editLectureDialog = ref(false)
const lectures = ref([])
const newLecture = ref({
  name: '',
  description: '',
  instructor: '',
  startDate: '',
  endDate: '',
  fee: 0,
  status: 'OPEN',
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
const editedLecture = ref({...newLecture.value})

const goToSchedule = (lectureId) => {
  router.push(`/admin/lectures/${lectureId}/schedules`)
}

const formatPrice = (price) => {
  return price.toLocaleString() + '원'
}

const goToEnrolledStudents = (lectureId) => {
  router.push(`/admin/lectures/${lectureId}/enrolled`)
}
const fetchLectures = () => {
  axios.get('https://veritas-s.app/api/lectures').then((response) => {
    lectures.value = response.data.data
  })
}

const openAddLectureDialog = () => {
  addLectureDialog.value = true
}

const editLecture = (lecture) => {
  editedLecture.value = {
    ...lecture,
    schedule: {
      MON: {
        checked: lecture.monStartTime !== null,
        startTime: lecture.monStartTime,
        endTime: lecture.monEndTime,
      },
      TUE: {
        checked: lecture.tueStartTime !== null,
        startTime: lecture.tueStartTime,
        endTime: lecture.tueEndTime,
      },
      WED: {
        checked: lecture.wedStartTime !== null,
        startTime: lecture.wedStartTime,
        endTime: lecture.wedEndTime,
      },
      THU: {
        checked: lecture.thuStartTime !== null,
        startTime: lecture.thuStartTime,
        endTime: lecture.thuEndTime,
      },
      FRI: {
        checked: lecture.friStartTime !== null,
        startTime: lecture.friStartTime,
        endTime: lecture.friEndTime,
      },
      SAT: {
        checked: lecture.satStartTime !== null,
        startTime: lecture.satStartTime,
        endTime: lecture.satEndTime,
      },
      SUN: {
        checked: lecture.sunStartTime !== null,
        startTime: lecture.sunStartTime,
        endTime: lecture.sunEndTime,
      },
    },
  };

  editLectureDialog.value = true;
};

const lectureToDto = (lecture) => {
  return {
    name: lecture.name,
    description: lecture.description,
    instructor: lecture.instructor,
    startDate: lecture.startDate,
    endDate: lecture.endDate,
    fee: lecture.fee,
    status: lecture.status,

    monStartTime: lecture.schedule.MON.checked ? lecture.schedule.MON.startTime : null,
    monEndTime: lecture.schedule.MON.checked ? lecture.schedule.MON.endTime : null,
    tueStartTime: lecture.schedule.TUE.checked ? lecture.schedule.TUE.startTime : null,
    tueEndTime: lecture.schedule.TUE.checked ? lecture.schedule.TUE.endTime : null,
    wedStartTime: lecture.schedule.WED.checked ? lecture.schedule.WED.startTime : null,
    wedEndTime: lecture.schedule.WED.checked ? lecture.schedule.WED.endTime : null,
    thuStartTime: lecture.schedule.THU.checked ? lecture.schedule.THU.startTime : null,
    thuEndTime: lecture.schedule.THU.checked ? lecture.schedule.THU.endTime : null,
    friStartTime: lecture.schedule.FRI.checked ? lecture.schedule.FRI.startTime : null,
    friEndTime: lecture.schedule.FRI.checked ? lecture.schedule.FRI.endTime : null,
    satStartTime: lecture.schedule.SAT.checked ? lecture.schedule.SAT.startTime : null,
    satEndTime: lecture.schedule.SAT.checked ? lecture.schedule.SAT.endTime : null,
    sunStartTime: lecture.schedule.SUN.checked ? lecture.schedule.SUN.startTime : null,
    sunEndTime: lecture.schedule.SUN.checked ? lecture.schedule.SUN.endTime : null,
  }
}

const addLecture = () => {
  const lectureCreateRequest = lectureToDto(newLecture.value)

  axios.post('https://veritas-s.app/api/lectures', lectureCreateRequest).then(() => {

    addLectureDialog.value = false
    fetchLectures()
  })
}

const updateLecture = () => {
  const lectureUpdateRequest = lectureToDto(editedLecture.value)

  axios.put(`https://veritas-s.app/api/lectures/${editedLecture.value.id}`, lectureUpdateRequest).then(() => {
    editLectureDialog.value = false
    fetchLectures()
  })
}

const deleteLecture = () => {
  if (confirm('정말 삭제하시겠습니까?')) {
    axios.delete(`https://veritas-s.app/api/lectures/${editedLecture.value.id}`).then(() => {

      editLectureDialog.value = false
      fetchLectures()
    })
  }
}

onMounted(() => {
  fetchLectures()
})
</script>