<template>
  <v-container>
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
            <th class="text-left">독서실</th>
            <th class="text-left">좌석 수</th>
            <th class="text-left">사용 가능</th>
            <th class="text-left">사용 중</th>
            <th class="text-left">사용 불가</th>
          </tr>
          </thead>
          <tbody>
          <tr v-for="item in readingRooms" :key="item.id">
            <td>
              <router-link :to="`/admin/readingrooms/${item.id}`">{{ item.name }}</router-link>
            </td>
            <td>{{ item.seats }}</td>
            <td>{{ item.idle }}</td>
            <td>{{ item.occupied }}</td>
            <td>{{ item.unavailable }}</td>
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
              <v-text-field v-model="readingRoomName" label="독서실명" variant="outlined" required
                            :rules="[v => !!v || '필수 입력']"></v-text-field>
            </v-col>
          </v-row>
          <v-row>
            <v-col cols="6">
              <v-text-field v-model.number="readingRoomWidth" label="GRID 가로 길이" variant="outlined" suffix="칸"
                            required
                            :rules="[v => !!v || '필수 입력', v => /^[1-9]\d*$/.test(v) || '자연수를 입력하세요']"></v-text-field>
            </v-col>
            <v-col cols="6">
              <v-text-field v-model.number="readingRoomHeight" label="GRID 세로 길이" variant="outlined" suffix="칸"
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
  </v-container>
</template>

<script setup>
import {onMounted, ref} from 'vue'
import axios from "axios";
import router from "@/scripts/router";

const readingRooms = ref([])
    /*
    [
  {id: 1, name: '독서실 A', seats: 50, idle: 40, occupied: 8, unavailable: 2},
  {id: 2, name: '독서실 B', seats: 50, idle: 40, occupied: 8, unavailable: 2},
]

     */

const addReadingRoomDialog = ref(false)
const readingRoomName = ref('')
const readingRoomWidth = ref(null)
const readingRoomHeight = ref(null)

const fetchRooms = () => {
  axios.get('/api/readingrooms').then((response) => {
    const roomsData = response.data.data
    readingRooms.value = roomsData.map(room => {
      const seatStatuses = room.seats.reduce((acc, seat) => {
        acc[seat.status] = (acc[seat.status] || 0) + 1;
        return acc;
      }, {});

      return {
        id: room.id,
        name: room.name,
        seats: room.seats.length,
        idle: seatStatuses.IDLE || 0,
        occupied: seatStatuses.OCCUPIED || 0,
        unavailable: seatStatuses.UNAVAILABLE || 0
      };
    })
  })
}
const addReadingRoom = () => {

  if (!readingRoomName.value || !readingRoomWidth.value || !readingRoomHeight.value) {
    alert('필수 항목을 입력하세요!')
    return
  }
  if (!/^[1-9]\d*$/.test(readingRoomWidth.value) || !/^[1-9]\d*$/.test(readingRoomHeight.value)) return

  axios.post('/api/readingrooms', {
    name: readingRoomName.value,
    width: readingRoomWidth.value,
    height: readingRoomHeight.value
  }).then((response) => {
    if (response.data.header.success) {
      router.push(`/admin/readingrooms/${response.data.data.id}`)
    }
  }).catch((error) => {
    console.log(error)
  })

  addReadingRoomDialog.value = false
  readingRoomName.value = ''
  readingRoomHeight.value = null
  readingRoomWidth.value = null
}
onMounted(() => {
  fetchRooms()
})


</script>
