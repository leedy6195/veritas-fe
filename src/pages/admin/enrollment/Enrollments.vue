<template>
  <v-container>
    <v-row>
      <v-col>
        <h2 class="text-h5 mb-4">수강 관리</h2>
      </v-col>
    </v-row>

    <v-row>
      <v-col>
        <v-btn class="mb-4 float-right" color="primary" @click="addEnrollmentDialog = true">
          수강신청
        </v-btn>
      </v-col>
    </v-row>

    <v-row>
      <v-col>
        <v-table density="comfortable">
          <thead>
          <tr>
            <th class="text-left">강의</th>
            <th class="text-left">학생</th>
            <th class="text-left">결제금액</th>
            <th class="text-left">결제수단</th>
          </tr>
          </thead>
          <tbody>
          <tr v-for="enrollment in enrollments" :key="enrollment.id">
            <td>{{ enrollment.lecture.name }}</td>
            <td>{{ enrollment.student.name }}</td>
            <td>{{ enrollment.paymentAmount }}</td>
            <td>{{ enrollment.paymentMethod }}</td>
          </tr>
          </tbody>
        </v-table>
      </v-col>
    </v-row>

    <v-dialog v-model="addEnrollmentDialog" max-width="600">
      <v-card>
        <v-card-title>수강신청</v-card-title>
        <v-card-text>
          <v-form ref="addEnrollmentForm" @submit.prevent="addEnrollment">
            <v-select v-model="newEnrollment.lectureId" :items="lectures" item-title="name" item-value="id" label="강의" required></v-select>
            <v-select v-model="newEnrollment.studentId" :items="students" :item-title="studentTitle" item-value="id" label="학생" required></v-select>
            <v-text-field v-model="newEnrollment.paymentAmount" label="결제금액" required></v-text-field>
            <v-radio-group v-model="newEnrollment.paymentMethod" row>
              <v-radio label="신용카드" value="CREDIT_CARD"></v-radio>
              <v-radio label="계좌이체" value="BANK_TRANSFER"></v-radio>
              <v-radio label="현금" value="CASH"></v-radio>
            </v-radio-group>
          </v-form>

        </v-card-text>
        <v-card-actions>
          <v-btn color="primary" @click="addEnrollment">신청</v-btn>
          <v-btn color="primary" @click="addEnrollmentDialog = false">취소</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>


  </v-container>
</template>

<script setup>
import axios from "axios";
import {onMounted, ref} from "vue";

const enrollments = ref([]);
const students = ref([]);
const lectures = ref([]);

const addEnrollmentDialog = ref(false)

const newEnrollment = ref({
  lectureId: '',
  studentId: '',
  paymentAmount: 0,
  paymentMethod: 'CREDIT_CARD'
})

const addEnrollment = () => {
  axios.post('https://veritas-s.app/api/enrollments', newEnrollment.value).then(() => {
    location.reload()
  })
}

const fetchStudents = () => {
  axios.get('https://veritas-s.app/api/students').then((response) => {
    students.value = response.data.data
  })
}

const fetchLectures = () => {
  axios.get('https://veritas-s.app/api/lectures').then((response) => {
    lectures.value = response.data.data
  })
}
const fetchEnrollments = () => {
  axios.get('https://veritas-s.app/api/enrollments').then((response) => {
    enrollments.value = response.data.data
  })
}

const studentTitle = (student) => {
  return `${student.name} (${student.serial})`;
};


onMounted(() => {
  fetchStudents()
  fetchLectures()
  fetchEnrollments()
})
</script>