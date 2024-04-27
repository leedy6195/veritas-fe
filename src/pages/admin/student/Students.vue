<template>
  <v-container>
    <v-row>
      <v-col>
        <h2 class="text-h5 mb-4">회원 관리</h2>
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
                    label="가입일 시작일"
                    type="date"
                    density="comfortable"
                ></v-text-field>
              </v-col>
              <v-col cols="12" sm="6">
                <v-text-field
                    v-model="searchEndDate"
                    label="가입일 종료일"
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
            :items="filteredMembers"
            v-model="selectedMembers"
            class="elevation-1"
            show-select
        >

          <template v-slot:[`item.name`]="{ item }">
            <a @click="openEditMemberDialog(item)" style="color: blue; cursor: pointer; text-decoration: none;">{{ item.name }}</a>
          </template>

          <template v-slot:top>
            <v-toolbar flat>
              <v-toolbar-title>회원 목록</v-toolbar-title>
              <v-spacer></v-spacer>
              <v-btn color="error" @click="deleteSelectedMembers" :disabled="!selectedMembers.length">선택 회원 삭제</v-btn>
              <v-btn color="primary" @click="exportToExcel">엑셀로 내보내기</v-btn>
              <v-btn color="secondary" @click="openAddMemberDialog">회원 등록</v-btn>
            </v-toolbar>
          </template>
        </v-data-table>
      </v-col>
    </v-row>

    <v-dialog v-model="addMemberDialog" max-width="500px">
      <v-card>
        <v-card-title>
          <span class="text-h5">회원 등록</span>
        </v-card-title>
        <v-card-text>
          <v-form ref="addMemberForm" @submit.prevent="addMember">
            <v-text-field v-model="newMember.name" label="회원명" :rules="[v => !!v || '필수 입력']"></v-text-field>
            <v-text-field v-model="newMember.birthDate" label="생년월일" :rules="[v => !!v || '필수 입력']"></v-text-field>
            <v-text-field v-model="newMember.school" label="학교" :rules="[v => !!v || '필수 입력']"></v-text-field>
            <v-text-field v-model="newMember.email" label="이메일주소" :rules="[v => !!v || '필수 입력']"></v-text-field>
            <v-text-field v-model="newMember.tel" label="연락처" :rules="[v => !!v || '필수 입력']"></v-text-field>
            <v-text-field v-model="newMember.parentTel" label="부모님 연락처" :rules="[v => !!v || '필수 입력']"></v-text-field>
            <v-select
                v-model="newMember.courseType"
                :items="courseTypeOptions"
                label="수강 종류"
                density="comfortable"
            ></v-select>
          </v-form>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="blue darken-1" text @click="closeAddMemberDialog">취소</v-btn>
          <v-btn color="blue darken-1" text @click="addMember">등록</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-dialog v-model="editMemberDialog" max-width="500px">
      <v-card>
        <v-card-title>
          <span class="text-h5">회원 정보 수정</span>
        </v-card-title>
        <v-card-text>
          <v-form ref="editMemberForm" @submit.prevent="updateMember">
            <v-text-field v-model="editedMember.name" label="회원명" :rules="[v => !!v || '필수 입력']"></v-text-field>
            <v-text-field v-model="editedMember.birthDate" label="생년월일" :rules="[v => !!v || '필수 입력']"></v-text-field>
            <v-text-field v-model="editedMember.school" label="학교" :rules="[v => !!v || '필수 입력']"></v-text-field>
            <v-text-field v-model="editedMember.email" label="이메일주소" :rules="[v => !!v || '필수 입력']"></v-text-field>
            <v-text-field v-model="editedMember.tel" label="연락처" :rules="[v => !!v || '필수 입력']"></v-text-field>
            <v-text-field v-model="editedMember.parentTel" label="부모님 연락처" :rules="[v => !!v || '필수 입력']"></v-text-field>
            <v-select
                v-model="editedMember.courseType"
                :items="courseTypeOptions"
                label="수강 종류"
                density="comfortable"
            ></v-select>
          </v-form>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="blue darken-1" text @click="closeEditMemberDialog">취소</v-btn>
          <v-btn color="blue darken-1" text @click="updateMember">수정</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>


  </v-container>
</template>

<script setup>
import {onMounted, ref} from 'vue';
import axios from "axios";

const searchKeyword = ref('');
const searchStartDate = ref('');
const searchEndDate = ref('');
const selectedMembers = ref([]);

const headers = [
  {title: '가입일', align: 'start', key: 'joinDate'},
  {title: '회원명', key: 'name'},
  {title: '생년월일', key: 'birthDate'},
  {title: '학교', key: 'school'},
  {title: '이메일주소', key: 'email'},
  {title: '휴대폰번호', key: 'tel'},
  {title: '회원코드', key: 'serial'},
  { title: '수강 종류', key: 'formattedCourseType' },
];

const searchColumn = ref('name');
const searchColumnOptions = [
  {title: '회원명', value: 'name'},
  {title: '학교', value: 'school'},
  {title: '이메일주소', value: 'email'},
  {title: '휴대폰번호', value: 'tel'},
  {title: '회원코드', value: 'serial'},
  {title: '수강 종류', value: 'formattedCourseType'},
];


const members = ref([]);
const filteredMembers = ref([]);

const addMemberDialog = ref(false);

const courseTypeOptions = [
  { title: '해당없음', value: 'GENERAL' },
  { title: '주중반', value: 'WEEKDAY' },
  { title: '주말반', value: 'WEEKEND' },
];

const newMember = ref({
  name: '',
  birthDate: '',
  school: '',
  email: '',
  tel: '',
  parentTel: '',
  courseType: 'GENERAL'
});

const editMemberDialog = ref(false);
const editedMember = ref({});


const openEditMemberDialog = (member) => {
  editedMember.value = { ...member };
  editMemberDialog.value = true;
};

const closeEditMemberDialog = () => {
  editMemberDialog.value = false;
  resetEditedMember();
};

const updateMember = () => {
  if (!editedMember.value.name ||
      !editedMember.value.birthDate ||
      !editedMember.value.school ||
      !editedMember.value.email ||
      !editedMember.value.tel ||
      !editedMember.value.parentTel
  ) {
    alert('필수 항목을 입력하세요')
    return
  }

  axios.put(`http://localhost:8080/api/students/${editedMember.value.id}`, editedMember.value)
      .then((response) => {
        if (response.data.header.success) {
          location.reload()
        } else {
          alert(response.data.header.message)
        }
      })
};

const resetEditedMember = () => {
  editedMember.value = {};
};

const fetchMembers = async () => {
  await axios.get('http://localhost:8080/api/students').then((response) => {
    members.value = response.data.data.map(member => ({
      ...member,
      joinDate: formatDate(member.createdAt),
      formattedCourseType: formatCourseType(member.courseType)
    }))

    filteredMembers.value = members.value
  })
}

const search = () => {
  // 검색 로직 구현
  const startDate = searchStartDate.value ? new Date(searchStartDate.value) : null;
  const endDate = searchEndDate.value ? new Date(searchEndDate.value) : null;

  filteredMembers.value = members.value.filter(member => {
    const memberJoinDate = new Date(member.createdAt);
    let isDateInRange = true;

    if (startDate && endDate) {
      isDateInRange = memberJoinDate >= startDate && memberJoinDate <= endDate;
    } else if (startDate) {
      isDateInRange = memberJoinDate >= startDate;
    } else if (endDate) {
      isDateInRange = memberJoinDate <= endDate;
    }

    if (searchColumn.value && searchKeyword.value) {
      const searchValue = member[searchColumn.value].toString().toLowerCase();
      const keyword = searchKeyword.value.toLowerCase();
      const isMatchingKeyword = searchValue.includes(keyword);
      return isDateInRange && isMatchingKeyword;
    } else {
      return isDateInRange;
    }
  });
};
const exportToExcel = () => {
  // 엑셀 내보내기 로직 구현
};

const openAddMemberDialog = () => {
  addMemberDialog.value = true;
};
const closeAddMemberDialog = () => {
  addMemberDialog.value = false;
  resetNewMember();
};

const deleteSelectedMembers = async () => {
  if (confirm('선택한 회원을 삭제하시겠습니까?')) {
    const deletePromises = selectedMembers.value.map(memberId => axios.delete(`http://localhost:8080/api/students/${memberId}`));
    await Promise.all(deletePromises).then(() => {location.reload()})


  }
};

const addMember = () => {
  if (!newMember.value.name ||
      !newMember.value.birthDate ||
      !newMember.value.school ||
      !newMember.value.email ||
      !newMember.value.tel ||
      !newMember.value.parentTel
  ) {
    alert('필수 항목을 입력하세요')
    return
  }

  axios.post('http://localhost:8080/api/students', newMember.value)
      .then((response) => {
        if (response.data.header.success) {
          location.reload()
        } else {
          alert(response.data.header.message)
        }
      })
};

const resetNewMember = () => {
  newMember.value = {
    name: '',
    birthDate: '',
    school: '',
    email: '',
    tel: '',
    parentTel: '',
    courseType: 'GENERAL',

  };
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
  const date = new Date(dateString);
  const year = date.getFullYear().toString().slice(-2);
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const day = date.getDate().toString().padStart(2, '0');
  const hours = date.getHours().toString().padStart(2, '0');
  const minutes = date.getMinutes().toString().padStart(2, '0');
  return `${year}-${month}-${day} ${hours}:${minutes}`;
};


onMounted(() => {
  fetchMembers()

})
</script>