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
          <template v-slot:[`item.studentName`]="{ item }">
            <a @click="openEditAttendanceDialog(item)" style="cursor: pointer; text-decoration: none;">{{ item.studentName }}</a>
          </template>

          <template v-slot:top>
            <v-toolbar flat>
              <v-toolbar-title>출입 목록</v-toolbar-title>
              <v-spacer></v-spacer>
              <v-btn color="primary" @click="exportToExcel">엑셀로 내보내기</v-btn>
              <v-btn color="secondary" @click="openAddAttendanceDialog">출입기록 등록</v-btn>
            </v-toolbar>
          </template>
        </v-data-table>
      </v-col>
    </v-row>

    <v-dialog v-model="addAttendanceDialog" max-width="500px">
      <v-card>
        <v-card-title>
          <span class="text-h5">출입기록 등록</span>
        </v-card-title>
        <v-card-text>
          <v-form ref="addAttendanceForm" @submit.prevent="addAttendance">
            <v-select
                v-model="newAttendance.serial"
                :items="members"
                item-title="name"
                item-value="id"
                label="회원코드"
                :rules="[v => !!v || '필수 선택']"
            ></v-select>
            <v-select
                v-model="newAttendance.roomType"
                :items="roomTypeOptions"
                label="시설구분"
                :rules="[v => !!v || '필수 선택']"
                @change="onRoomTypeChange"
            ></v-select>
            <v-select
                v-if="newAttendance.roomType === 'CLASSROOM'"
                v-model="newAttendance.roomId"
                :items="classrooms"
                item-title="name"
                item-value="id"
                label="강의실"
                :rules="[v => !!v || '필수 선택']"
            ></v-select>
            <v-select
                v-if="newAttendance.roomType === 'READING_ROOM'"
                v-model="newAttendance.roomId"
                :items="readingRooms"
                item-title="name"
                item-value="id"
                label="독서실"
                :rules="[v => !!v || '필수 선택']"
                @change="onReadingRoomChange"
            ></v-select>
            <v-select
                v-if="newAttendance.roomType === 'READING_ROOM' && newAttendance.roomId"
                v-model="newAttendance.seatId"
                :items="seats"
                item-title="name"
                item-value="id"
                label="좌석"
                :rules="[v => !!v || '필수 선택']"
            ></v-select>
            <v-text-field
                v-model="newAttendance.enterTime"
                label="입실시간"
                type="datetime-local"
                :rules="[v => !!v || '필수 입력']"
            ></v-text-field>
            <v-text-field
                v-model="newAttendance.exitTime"
                label="퇴실시간"
                type="datetime-local"
            ></v-text-field>
          </v-form>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="blue darken-1" text @click="closeAddAttendanceDialog">취소</v-btn>
          <v-btn color="blue darken-1" text @click="addAttendance">등록</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-dialog v-model="editAttendanceDialog" max-width="500px">
      <v-card>
        <v-card-title>
          <span class="text-h5">출입기록 수정</span>
        </v-card-title>
        <v-card-text>
          <v-form ref="editAttendanceForm" @submit.prevent="updateAttendance">
            <v-text-field v-model="editedAttendance.studentName" label="회원명" readonly></v-text-field>
            <v-text-field v-model="editedAttendance.roomName" label="시설명" readonly></v-text-field>
            <v-text-field
                v-model="editedAttendance.enterTime"
                label="입실시간"
                type="datetime-local"
                :rules="[v => !!v || '필수 입력']"
            ></v-text-field>
            <v-text-field
                v-model="editedAttendance.exitTime"
                label="퇴실시간"
                type="datetime-local"
                :rules="exitTimeRules"
            ></v-text-field>
          </v-form>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="error" text @click="deleteAttendance">삭제</v-btn>
          <v-btn color="blue darken-1" text @click="closeEditAttendanceDialog">취소</v-btn>
          <v-btn color="blue darken-1" text @click="updateAttendance">수정</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>



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
  await axios.get('https://veritas-s.app/api/access').then((response) => {
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

/**
 * 출입 기록 등록, 수정
 * */

const addAttendanceDialog = ref(false);
const editAttendanceDialog = ref(false);
const editedAttendance = ref({});
const newAttendance = ref({
  studentId: null,
  roomType: null,
  roomId: null,
  seatId: null,
  enterTime: null,
  exitTime: null,
});

const members = ref([]);
const roomTypeOptions = [
  { title: '강의실', value: 'CLASSROOM' },
  { title: '독서실', value: 'READING_ROOM' },
];
const classrooms = ref([]);
const readingRooms = ref([]);
const seats = ref([]);

const exitTimeRules = [
  v => !v || new Date(v) >= new Date(editedAttendance.value.enterTime) || '퇴실 시간은 입실 시간보다 이후여야 합니다.',
];

const fetchMembers = async () => {
  const response = await axios.get('https://veritas-s.app/api/students');
  members.value = response.data.data;
};

const fetchClassrooms = async () => {
  const response = await axios.get('https://veritas-s.app/api/lecturerooms');
  classrooms.value = response.data.data;
};

const fetchReadingRooms = async () => {
  const response = await axios.get('https://veritas-s.app/api/readingrooms');
  readingRooms.value = response.data.data;
};

const fetchSeats = async (readingRoomId) => {
  const response = await axios.get(`https://veritas-s.app/api/readingrooms/${readingRoomId}/seats`);
  seats.value = response.data.data;
};

const openAddAttendanceDialog = () => {
  addAttendanceDialog.value = true;
};

const closeAddAttendanceDialog = () => {
  addAttendanceDialog.value = false;
  resetNewAttendance();
};

const openEditAttendanceDialog = (attendance) => {
  editedAttendance.value = { ...attendance };
  editAttendanceDialog.value = true;
};

const closeEditAttendanceDialog = () => {
  editAttendanceDialog.value = false;
  resetEditedAttendance();
};

const onRoomTypeChange = () => {
  newAttendance.value.roomId = null;
  newAttendance.value.seatId = null;
};

const onReadingRoomChange = () => {
  newAttendance.value.seatId = null;
  if (newAttendance.value.roomId) {
    fetchSeats(newAttendance.value.roomId);
  }
};

const addAttendance = async () => {
  if (!newAttendance.value.studentId ||
      !newAttendance.value.roomType ||
      !newAttendance.value.roomId ||
      (newAttendance.value.roomType === 'READING_ROOM' && !newAttendance.value.seatId) ||
      !newAttendance.value.enterTime
  ) {
    alert('필수 항목을 입력하세요');
    return;
  }

  if (newAttendance.value.exitTime && new Date(newAttendance.value.exitTime) < new Date(newAttendance.value.enterTime)) {
    alert('퇴실 시간은 입실 시간보다 이후여야 합니다.');
    return;
  }

  const response = await axios.post('https://veritas-s.app/api/attendances', newAttendance.value);
  if (response.data.success) {
    fetchAttendances();
    closeAddAttendanceDialog();
  } else {
    alert('출입기록 등록에 실패했습니다.');
  }
};

const updateAttendance = async () => {
  if (!editedAttendance.value.enterTime) {
    alert('필수 항목을 입력하세요');
    return;
  }

  if (editedAttendance.value.exitTime && new Date(editedAttendance.value.exitTime) < new Date(editedAttendance.value.enterTime)) {
    alert('퇴실 시간은 입실 시간보다 이후여야 합니다.');
    return;
  }

  const response = await axios.put(`https://veritas-s.app/api/attendances/${editedAttendance.value.id}`, editedAttendance.value);
  if (response.data.success) {
    fetchAttendances();
    closeEditAttendanceDialog();
  } else {
    alert('출입기록 수정에 실패했습니다.');
  }
};

const deleteAttendance = async () => {
  if (confirm('정말 삭제하시겠습니까?')) {
    const response = await axios.delete(`https://veritas-s.app/api/attendances/${editedAttendance.value.id}`);
    if (response.data.success) {
      fetchAttendances();
      closeEditAttendanceDialog();
    } else {
      alert('출입기록 삭제에 실패했습니다.');
    }
  }
};

const resetNewAttendance = () => {
  newAttendance.value = {
    studentId: null,
    roomType: null,
    roomId: null,
    seatId: null,
    enterTime: null,
    exitTime: null,
  };
};

const resetEditedAttendance = () => {
  editedAttendance.value = {};
};

onMounted(() => {
  fetchAttendances();
  fetchMembers();
  fetchClassrooms();
  fetchReadingRooms();
});
</script>