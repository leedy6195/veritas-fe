<template>
  <v-container>
    <v-overlay v-model="loading" class="d-flex justify-center align-center">
      <v-progress-circular indeterminate color="primary"></v-progress-circular>
    </v-overlay>

    <v-row>
      <v-col>
        <h2 class="text-h5 mb-4">강의실 관리</h2>
      </v-col>
    </v-row>


    <v-row>
      <v-col>
        <v-btn class="mb-4 float-right" color="primary" @click="addLectureRoomDialog = true">
          강의실 추가
        </v-btn>
      </v-col>
    </v-row>

    <v-row>
      <v-col>
        <v-table density="comfortable">
          <thead>
          <tr>
            <th class="text-left">이름</th>
            <th class="text-left">기기 토큰</th>
          </tr>
          </thead>
          <tbody>
          <tr v-for="item in lectureRooms" :key="item.id">
            <td>
              <a @click="openEditLectureRoomDialog(item)" style="cursor: pointer;">{{ item.name }}</a>
            </td>
            <td>{{ item.receiverToken }}</td>
          </tr>
          </tbody>
        </v-table>
      </v-col>
    </v-row>

    <v-dialog v-model="addLectureRoomDialog" max-width="500px">
      <v-card>
        <v-card-title>강의실 추가</v-card-title>
        <v-card-text>
          <v-row>
            <v-col>
              <v-text-field v-model="lectureRoomName" label="강의실명" density="comfortable" required
                            :rules="[v => !!v || '필수 입력']"></v-text-field>
            </v-col>
          </v-row>
          <v-row>
            <v-col>
              <v-text-field v-model="receiverToken" label="수신기 토큰" density="comfortable"></v-text-field>
            </v-col>
          </v-row>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="primary" text @click="addLectureRoom">추가</v-btn>
          <v-btn color="error" text @click="addLectureRoomDialog = false">취소</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-dialog v-model="editLectureRoomDialog" max-width="500px">
      <v-card>
        <v-card-title>강의실 수정</v-card-title>
        <v-card-text>
          <v-row>
            <v-col>
              <v-text-field v-model="editedLectureRoomName" label="강의실명" density="comfortable" required
                            :rules="[v => !!v || '필수 입력']"></v-text-field>
            </v-col>
          </v-row>
          <v-row>
            <v-col>
              <v-text-field v-model="editedReceiverToken" label="수신기 토큰" density="comfortable"></v-text-field>
            </v-col>
          </v-row>

        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="error" text @click="deleteLectureRoom">삭제</v-btn>
          <v-btn color="primary" text @click="updateLectureRoom">수정</v-btn>
          <v-btn color="error" text @click="editLectureRoomDialog = false">취소</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script setup>
import {onMounted, ref} from 'vue'
import axios from "axios";

const lectureRooms = ref([])

const addLectureRoomDialog = ref(false)
const lectureRoomName = ref('')
const receiverToken = ref('')
const loading = ref(true)

const editLectureRoomDialog = ref(false)
const editedLectureRoomId = ref(null)
const editedLectureRoomName = ref('')
const editedReceiverToken = ref('')


const fetchRooms = () => {
  axios.get('https://veritas-s.app/api/lecturerooms').then((response) => {
    lectureRooms.value = response.data.data
    loading.value = false;
  })
}

const addLectureRoom = () => {
  if (!lectureRoomName.value) {
    alert('필수 항목을 입력하세요')
    return
  }

  axios.post('https://veritas-s.app/api/lecturerooms', {
    name: lectureRoomName.value,
    receiverToken: receiverToken.value
  }).then((response) => {
    if (response.data.header.success) {
      location.reload()
    }
  }).catch((error) => {
    console.log(error)
  })
}

const openEditLectureRoomDialog = (lectureRoom) => {
  editedLectureRoomId.value = lectureRoom.id
  editedLectureRoomName.value = lectureRoom.name
  editedReceiverToken.value = lectureRoom.receiverToken
  editLectureRoomDialog.value = true
}

const updateLectureRoom = () => {
  if (!editedLectureRoomName.value) {
    alert('필수 항목을 입력하세요')
    return
  }

  axios.put(`https://veritas-s.app/api/lecturerooms/${editedLectureRoomId.value}`, {
    name: editedLectureRoomName.value,
    receiverToken: editedReceiverToken.value
  }).then((response) => {
    if (response.data.header.success) {
      fetchRooms()
      editLectureRoomDialog.value = false
    } else {
      alert(response.data.header.message)
    }
  }).catch((error) => {
    console.log(error)
  })
}

const deleteLectureRoom = () => {
  if (confirm('정말 삭제하시겠습니까?')) {
    axios.delete(`https://veritas-s.app/api/lecturerooms/${editedLectureRoomId.value}`).then((response) => {
      if (response.data.header.success) {
        fetchRooms()
        editLectureRoomDialog.value = false
      }
    }).catch((error) => {
      console.log(error)
    })
  }
}

onMounted(() => {
  fetchRooms()
})
</script>
