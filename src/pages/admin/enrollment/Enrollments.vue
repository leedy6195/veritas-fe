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
          <tr v-for="enrollment in enrollments" :key="enrollment.id" @click="openEditEnrollmentDialog(enrollment)" style="cursor: pointer;">
            <td>{{ enrollment.lecture.name }}</td>
            <td>{{ enrollment.student.name }}</td>
            <td>{{ formatPrice(enrollment.paymentAmount) }}</td>
            <td>{{ formatPaymentMethod(enrollment.paymentMethod) }}</td>
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
            <v-autocomplete
                v-model="newEnrollment.lectureId"
                :items="lectures"
                item-title="name"
                item-value="id"
                label="강의"
                required
            ></v-autocomplete>
            <v-autocomplete
                v-model="newEnrollment.studentId"
                :items="students"
                :item-title="studentTitle"
                item-value="id"
                label="학생"
                required
            ></v-autocomplete>
            <v-text-field v-model="newEnrollment.paymentAmount" label="결제금액" required></v-text-field>
            <v-radio-group v-model="newEnrollment.paymentMethod" inline>
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

    <v-dialog v-model="editEnrollmentDialog" max-width="600">
      <v-card>
        <v-card-title>수강신청 수정</v-card-title>
        <v-card-text>
          <v-form ref="editEnrollmentForm" @submit.prevent="editEnrollment">
            <v-text-field disabled label="강의" v-model="editedEnrollment.selectedLectureName"></v-text-field>
            <v-text-field disabled label="학생" v-model="editedEnrollment.selectedStudentName"></v-text-field>

            <v-text-field v-model="editedEnrollment.paymentAmount" label="결제금액" required></v-text-field>
            <v-radio-group v-model="editedEnrollment.paymentMethod" inline>
              <v-radio label="신용카드" value="CREDIT_CARD"></v-radio>
              <v-radio label="계좌이체" value="BANK_TRANSFER"></v-radio>
              <v-radio label="현금" value="CASH"></v-radio>
            </v-radio-group>
          </v-form>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="error" @click="deleteEnrollment">삭제</v-btn>
          <v-btn color="primary" @click="updateEnrollment">수정</v-btn>
          <v-btn color="error" @click="editEnrollmentDialog = false">취소</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>


  </v-container>
</template>

<script setup>
import axios from "axios";
import {onMounted, ref, watch} from "vue";

const enrollments = ref([]);
const students = ref([]);
const lectures = ref([]);

const addEnrollmentDialog = ref(false)
const editEnrollmentDialog = ref(false)
const editedEnrollment = ref({
  id: '',
  lectureId: '',
  studentId: '',
  paymentAmount: 0,
  paymentMethod: 'CREDIT_CARD',
  selectedLectureName: '',
  selectedStudentName: ''
})
const newEnrollment = ref({
  lectureId: '',
  studentId: '',
  paymentAmount: 0,
  paymentMethod: 'CREDIT_CARD'
})

const openEditEnrollmentDialog = (enrollment) => {
  editedEnrollment.value = {...enrollment}
  editedEnrollment.value.selectedLectureName = enrollment.lecture.name
  editedEnrollment.value.selectedStudentName = enrollment.student.name
  editEnrollmentDialog.value = true
}

const addEnrollment = () => {
  axios.post('https://veritas-s.app/api/enrollments', newEnrollment.value).then(() => {
    location.reload()
  })
}

const updateEnrollment = () => {
  axios.put(`https://veritas-s.app/api/enrollments/${editedEnrollment.value.id}`, editedEnrollment.value).then(() => {
    location.reload()
  })
}

const deleteEnrollment = () => {
  if (confirm("정말 삭제하시겠습니까?")) {
    axios.delete(`https://veritas-s.app/api/enrollments/${editedEnrollment.value.id}`).then(() => {
      location.reload()
    })
  }
}

const formatPaymentMethod = (paymentMethod) => {
  switch (paymentMethod) {
    case 'CREDIT_CARD':
      return '신용카드'
    case 'BANK_TRANSFER':
      return '계좌이체'
    case 'CASH':
      return '현금'
  }
}

const formatPrice = (price) => {
  return price.toLocaleString() + '원'
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
  return student ? `${student.name} (${student.serial})` : '';
};


onMounted(() => {
  fetchStudents()
  fetchLectures()
  fetchEnrollments()
})

watch(
    () => newEnrollment.value.lectureId,
    (lectureId) => {
      if (lectureId) {
        const selectedLecture = lectures.value.find((lecture) => lecture.id === lectureId);
        newEnrollment.value.paymentAmount = selectedLecture ? selectedLecture.fee : 0;
      } else {
        newEnrollment.value.paymentAmount = 0;
      }
    }
);
</script>