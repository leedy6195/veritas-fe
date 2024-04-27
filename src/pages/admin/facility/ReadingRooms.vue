<template>
  <v-container>
    <v-overlay v-model="loading" class="d-flex justify-center align-center">
      <v-progress-circular indeterminate color="primary"></v-progress-circular>
    </v-overlay>

    <v-row>
      <v-col>
        <h2 class="text-h5 mb-4">독서실 관리</h2>
      </v-col>
    </v-row>

    <v-row>
      <v-col>
        <v-btn class="mb-4 float-right" color="primary" @click="addReadingRoomDialog = true">
          독서실 추가
        </v-btn>
      </v-col>
    </v-row>

    <v-row>
      <v-col>
        <v-table density="comfortable">
          <thead>
          <tr>
            <th class="text-left">이름</th>
            <th class="text-left">좌석 수</th>
            <th class="text-left">사용 가능</th>
            <th class="text-left">사용 중</th>
            <th class="text-left">사용 불가</th>
            <th class="text-left"></th>
          </tr>
          </thead>
          <tbody>
          <tr v-for="item in readingRooms" :key="item.id">
            <td @click="openEditReadingRoomDialog(item)" style="cursor: pointer;">{{ item.name }}</td>
            <td>{{ item.seats }}</td>
            <td>{{ item.idle }}</td>
            <td>{{ item.occupied }}</td>
            <td>{{ item.unavailable }}</td>
            <td>
              <router-link :to="`/admin/readingrooms/${item.id}`">좌석 보기</router-link>
            </td>
          </tr>
          </tbody>
        </v-table>
      </v-col>
    </v-row>

    <!-- Dialog for adding a new reading room -->
    <v-dialog v-model="addReadingRoomDialog" max-width="500px">
      <v-card>
        <v-card-title>독서실 추가</v-card-title>
        <v-card-text>
          <v-row>
            <v-col>
              <v-text-field v-model="readingRoomName" label="독서실명" density="comfortable" required
                            :rules="[v => !!v || '필수 입력']"></v-text-field>
            </v-col>
          </v-row>
          <v-row>
            <v-col cols="6">
              <v-text-field v-model.number="readingRoomWidth" label="가로 길이" density="comfortable" suffix="칸"
                            required
                            :rules="[v => !!v || '필수 입력', v => /^[1-9]\d*$/.test(v) || '자연수를 입력하세요']"></v-text-field>
            </v-col>
            <v-col cols="6">
              <v-text-field v-model.number="readingRoomHeight" label="세로 길이" density="comfortable" suffix="칸"
                            required
                            :rules="[v => !!v || '필수 입력', v => /^[1-9]\d*$/.test(v) || '자연수를 입력하세요']"></v-text-field>
            </v-col>
          </v-row>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="primary" text @click="addReadingRoom">추가</v-btn>
          <v-btn color="error" text @click="addReadingRoomDialog = false">취소</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- Dialog for editing a reading room -->
    <v-dialog v-model="editReadingRoomDialog" max-width="500px">
      <v-card>
        <v-card-title>독서실 수정</v-card-title>
        <v-card-text>
          <v-row>
            <v-col>
              <v-text-field v-model="editedReadingRoomName" label="독서실명" density="comfortable" required
                            :rules="[v => !!v || '필수 입력']"></v-text-field>
            </v-col>
          </v-row>
          <v-row>
            <v-col cols="6">
              <v-text-field v-model.number="editedReadingRoomWidth" label="가로 길이" density="comfortable" suffix="칸"
                            required
                            :rules="[v => !!v || '필수 입력', v => /^[1-9]\d*$/.test(v) || '자연수를 입력하세요']"></v-text-field>
            </v-col>
            <v-col cols="6">
              <v-text-field v-model.number="editedReadingRoomHeight" label="세로 길이" density="comfortable" suffix="칸"
                            required
                            :rules="[v => !!v || '필수 입력', v => /^[1-9]\d*$/.test(v) || '자연수를 입력하세요']"></v-text-field>
            </v-col>
          </v-row>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="error" text @click="deleteReadingRoom">삭제</v-btn>
          <v-btn color="primary" text @click="updateReadingRoom">수정</v-btn>
          <v-btn color="error" text @click="editReadingRoomDialog = false">취소</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script setup>
import { onMounted, ref } from 'vue'
import axios from "axios";

const readingRooms = ref([])

const addReadingRoomDialog = ref(false)
const readingRoomName = ref('')
const readingRoomWidth = ref(null)
const readingRoomHeight = ref(null)
const loading = ref(true)

const editReadingRoomDialog = ref(false)
const editedReadingRoomId = ref(null)
const editedReadingRoomName = ref('')
const editedReadingRoomWidth = ref(null)
const editedReadingRoomHeight = ref(null)

const fetchRooms = () => {
  axios.get('http://223.130.130.160:8080/api/readingrooms').then((response) => {
    const roomsData = response.data.data
    readingRooms.value = roomsData.map(room => {
      const seatStatuses = room.seats.reduce((acc, seat) => {
        acc[seat.status] = (acc[seat.status] || 0) + 1;
        return acc;
      }, {});

      return {
        id: room.id,
        name: room.name,
        width: room.width,
        height: room.height,
        seats: room.seats.length,
        idle: seatStatuses.IDLE || 0,
        occupied: seatStatuses.OCCUPIED || 0,
        unavailable: seatStatuses.UNAVAILABLE || 0
      };
    })

    loading.value = false;
  })
}

const addReadingRoom = () => {
  if (!readingRoomName.value || !readingRoomWidth.value || !readingRoomHeight.value) {
    alert('필수 항목을 입력하세요')
    return
  }
  if (!/^[1-9]\d*$/.test(readingRoomWidth.value) || !/^[1-9]\d*$/.test(readingRoomHeight.value)) return

  axios.post('http://223.130.130.160:8080/api/readingrooms', {
    name: readingRoomName.value,
    width: readingRoomWidth.value,
    height: readingRoomHeight.value
  }).then((response) => {
    if (response.data.header.success) {
      //router.push(`/admin/readingrooms/${response.data.data.id}`)
      location.reload()
    } else {
      alert(response.data.header.message)
    }
  }).catch((error) => {
    console.log(error)
  })

  addReadingRoomDialog.value = false
  readingRoomName.value = ''
  readingRoomHeight.value = null
  readingRoomWidth.value = null
}

const openEditReadingRoomDialog = (readingRoom) => {
  editedReadingRoomId.value = readingRoom.id
  editedReadingRoomName.value = readingRoom.name
  editedReadingRoomWidth.value = readingRoom.width
  editedReadingRoomHeight.value = readingRoom.height
  editReadingRoomDialog.value = true
}

const updateReadingRoom = () => {
  if (!editedReadingRoomName.value || !editedReadingRoomWidth.value || !editedReadingRoomHeight.value) {
    alert('필수 항목을 입력하세요')
    return
  }
  if (!/^[1-9]\d*$/.test(editedReadingRoomWidth.value) || !/^[1-9]\d*$/.test(editedReadingRoomHeight.value)) return

  axios.put(`http://223.130.130.160:8080/api/readingrooms/${editedReadingRoomId.value}`, {
    name: editedReadingRoomName.value,
    width: editedReadingRoomWidth.value,
    height: editedReadingRoomHeight.value
  }).then((response) => {
    if (response.data.header.success) {
      fetchRooms()
      editReadingRoomDialog.value = false
    } else {
      alert(response.data.header.message)
    }
  }).catch((error) => {
    console.log(error)
  })
}

const deleteReadingRoom = () => {
  if (confirm('정말 삭제하시겠습니까?')) {
    axios.delete(`http://223.130.130.160:8080/api/readingrooms/${editedReadingRoomId.value}`).then((response) => {
      if (response.data.header.success) {
        fetchRooms()
        editReadingRoomDialog.value = false
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