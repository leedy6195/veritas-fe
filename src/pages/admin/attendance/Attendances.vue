<template>
  <v-container>
    <v-row>
      <v-col>
        <h2 class="text-h5 mb-4">출결 관리</h2>
      </v-col>
    </v-row>

    <v-row>
      <v-col>
        <v-card>
          <v-card-text>
            <v-row>
              <v-col cols="12" sm="4">
                <v-select
                    v-model="searchColumn"
                    :items="searchColumnOptions"
                    label="검색 기준"
                    density="comfortable"
                ></v-select>
              </v-col>
              <v-col cols="12" sm="8">
                <v-text-field
                    v-model="searchKeyword"
                    label="검색어"
                    clearable
                    density="comfortable"
                    @keyup.enter="search"
                ></v-text-field>
              </v-col>
            </v-row>

            <v-row>
              <v-col cols="12" sm="6">
                <v-text-field
                    v-model="searchStartDate"
                    label="입실 시작일"
                    type="date"
                    density="comfortable"
                ></v-text-field>
              </v-col>
              <v-col cols="12" sm="6">
                <v-text-field
                    v-model="searchEndDate"
                    label="입실 종료일"
                    type="date"
                    density="comfortable"
                ></v-text-field>
              </v-col>
            </v-row>

            <v-row>
              <v-col>
                <v-btn color="primary" @click="search">검색</v-btn>
              </v-col>
            </v-row>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>

    <v-row>
      <v-col>
        <v-data-table
            :headers="headers"
            :items="filteredAttendances"
            class="elevation-1"
        >
          <template v-slot:top>
            <v-toolbar flat>
              <v-toolbar-title>회원 목록</v-toolbar-title>
              <v-spacer></v-spacer>
              <v-btn color="primary" @click="exportToExcel">엑셀로 내보내기</v-btn>
            </v-toolbar>
          </template>
        </v-data-table>
      </v-col>
    </v-row>



  </v-container>
</template>

<script setup>
import {onMounted, ref} from 'vue';
import { utils, writeFile } from 'xlsx';
import axios from "axios";

const searchKeyword = ref('');
const searchStartDate = ref('');
const searchEndDate = ref('');

const headers = [
  {title: '회원명', key: 'studentName'},
  {title: '회원코드', key: 'studentSerial'},
  {title: '시설구분', key: 'roomType'},
  {title: '시설명', key: 'roomName'},
  {title: '입실시간', key: 'formattedEnterTime'},
  {title: '퇴실시간', key: 'formattedExitTime'},
  { title: '수강 종류', key: 'formattedCourseType' },
];

const searchColumn = ref('studentName');
const searchColumnOptions = [
  {title: '회원명', value: 'studentName'},
  {title: '회원코드', value: 'studentSerial'},
  {title: '시설구분', value: 'roomType'},
  {title: '시설명', value: 'roomName'},
  {title: '수강 종류', value: 'formattedCourseType'},
];


const attendances = ref([]);
const filteredAttendances = ref([]);



const fetchAttendances = async () => {
  await axios.get('/api/access').then((response) => {
    attendances.value = response.data.data.map(attendance => ({
      ...attendance,
      formattedEnterTime: formatDate(attendance.enterTime),
      formattedExitTime: formatDate(attendance.exitTime),
      formattedCourseType: formatCourseType(attendance.courseType)
    }))

    filteredAttendances.value = attendances.value
  })
}


const search = () => {
  // 검색 로직 구현
  const startDate = searchStartDate.value ? new Date(searchStartDate.value) : null;
  const endDate = searchEndDate.value ? new Date(searchEndDate.value) : null;

  filteredAttendances.value = attendances.value.filter(attendance => {
    const enterTime = new Date(attendance.enterTime)
    let isDateInRange = true;

    if (startDate && endDate) {
      isDateInRange = enterTime >= startDate && enterTime <= endDate;
    } else if (startDate) {
      isDateInRange = enterTime >= startDate;
    } else if (endDate) {
      isDateInRange = enterTime <= endDate;
    }

    if (searchColumn.value && searchKeyword.value) {
      const searchValue = attendance[searchColumn.value].toString().toLowerCase();
      const keyword = searchKeyword.value.toLowerCase();
      const isMatchingKeyword = searchValue.includes(keyword);
      return isDateInRange && isMatchingKeyword;
    } else {
      return isDateInRange;
    }
  })
};
const exportToExcel = () => {
  const worksheet = utils.json_to_sheet(filteredAttendances.value.map(attendance => ({
    '회원명': attendance.studentName,
    '회원코드': attendance.studentSerial,
    '시설구분': attendance.roomType,
    '시설명': attendance.roomName,
    '입실시간': attendance.formattedEnterTime,
    '퇴실시간': attendance.formattedExitTime || '',
    '수강 종류': attendance.formattedCourseType,
  })));

  const workbook = utils.book_new();
  utils.book_append_sheet(workbook, worksheet, '출결 관리');

  writeFile(workbook, '출결 관리.xlsx');
};

const formatCourseType = (courseType) => {
  switch (courseType) {
    case 'GENERAL':
      return '해당없음';
    case 'WEEKDAY':
      return '주중반';
    case 'WEEKEND':
      return '주말반';
    default:
      return '';
  }
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




onMounted(() => {
  fetchAttendances()
})
</script>