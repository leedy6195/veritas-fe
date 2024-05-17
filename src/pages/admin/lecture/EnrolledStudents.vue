<template>
  <v-container>
    <v-row>
      <v-col>
        <h2 class="text-h5 mb-4">출석 내역 [{{ lecture.name }}]</h2>
      </v-col>
    </v-row>

    <v-row>
      <v-col>
        <v-table density="comfortable">
          <thead>
          <tr>
            <th class="text-left">학생</th>
            <th v-for="schedule in lecture.schedules" :key="schedule.id" class="text-center">
              {{ formatDate(schedule.date) }}
            </th>
          </tr>
          </thead>
          <tbody>
          <tr v-for="student in students" :key="student.id">
            <td>{{ student.name }}</td>
            <td v-for="schedule in lecture.schedules" :key="schedule.id" class="text-center">
              {{ getAttendanceStatus(student.id, schedule.id) }}
            </td>
          </tr>
          </tbody>
        </v-table>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup>
import { useRoute } from "vue-router";
import axios from "axios";
import { onMounted, ref } from "vue";

const route = useRoute();
const lectureId = route.params.lectureId;

const formatDate = (dateString) => {
  const date = new Date(dateString);
  return `${date.getMonth() + 1}/${date.getDate()}`;
};

const lecture = ref({
  id: null,
  name: "",
  description: "",
  instructor: "",
  startDate: "",
  endDate: "",
  fee: 0,
  schedules: [],
});

const students = ref([]);
const attendanceRecords = ref([]);

const getAttendanceStatus = (studentId, scheduleId) => {
  const record = attendanceRecords.value.find(
      (r) => r.student.id === studentId && r.schedule.id === scheduleId
  );
  return record ? formatStatus(record.status) : "";
};

const fetchLecture = () => {
  axios
      .get(`/api/lectures/${lectureId}`)
      .then((response) => {
        lecture.value = response.data.data;
      })
      .catch((error) => {
        console.error(error);
      });
};

const formatStatus = (status) => {
  return status === "ATTENDED" ? "출석" : status === "ABSENT" ? "결석" : status === "LATE" ? "지각" : "조퇴";
};

const fetchStudents = () => {
  axios
      .get(`/api/lectures/${lectureId}/enrollments`)
      .then((response) => {
        const enrollments = response.data.data;
        students.value = enrollments.map((enrollment) => enrollment.student);
      })
      .catch((error) => {
        console.error(error);
      });
};

const fetchAttendanceRecords = () => {
  axios
      .get(`/api/lectures/${lectureId}/scheduleAttendances`)
      .then((response) => {
        attendanceRecords.value = response.data.data;
      })
      .catch((error) => {
        console.error(error);
      });
};

onMounted(() => {
  fetchLecture();
  fetchStudents();
  fetchAttendanceRecords();
});
</script>