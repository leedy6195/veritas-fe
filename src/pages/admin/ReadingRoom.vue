<template>
  <v-container class="overflow-x-auto">
    <v-row>
      <v-col>
        <div class="seating-plan ">
          <div
              v-for="y in roomData.height"
              :key="`row-${y}`"
              class="row"
          >
            <div
                v-for="x in roomData.width"
                :key="`seat-${x}-${y}`"
                class="seat rounded"
                :class="{ 'idle': isIdle(x, y), 'occupied': isOccupied(x, y), 'unavailable': isUnavailable(x, y)}"
                :draggable=true
                @dragstart="dragStart($event, x, y)"
                @dragover.prevent
                @drop="drop($event, x, y)"
                @contextmenu.prevent="showContextMenu($event, x, y)"
            >
              {{ getSeatName(x, y) }}
            </div>
          </div>
        </div>

        <v-menu ref="contextMenu" v-model="contextMenuVisible"
                :style="{ top: contextMenuY + 'px', left: contextMenuX + 'px' }">
          <v-list density="compact">
            <v-list-item v-if="selectedSeatId == null" @click="addSeat">좌석 추가</v-list-item>
            <v-list-item v-if="selectedSeatId != null" @click="editSeat">좌석 수정</v-list-item>
            <v-list-item v-if="selectedSeatId != null" @click="deleteSeat">좌석 삭제</v-list-item>
          </v-list>
        </v-menu>
      </v-col>
    </v-row>

    <v-dialog v-model="addSeatDialog" max-width="500px">
      <v-card>
        <v-card-title>
          <span class="text-h5">{{ selectedSeatId ? '좌석 수정' : '좌석 추가' }}</span>
        </v-card-title>
        <v-card-text>
          <v-form ref="addSeatForm" @submit.prevent="submitAddSeat">
            <v-text-field
                v-model="newSeatName"
                label="좌석 이름"
                required
            ></v-text-field>
            <v-select
                v-model="newSeatStatus"
                :items="seatStatusOptions"
                label="좌석 상태"
                required
            ></v-select>
          </v-form>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <!--<v-btn color="blue darken-1" text @click="closeAddSeatDialog">취소</v-btn>-->
          <v-btn color="blue darken-1" text @click="submitAddSeat">{{ selectedSeatId ? '수정' : '추가' }}</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

  </v-container>
</template>

<script setup>
import {onMounted, ref} from 'vue'
import axios from "axios";
import {useRoute} from "vue-router";

const route = useRoute()
const roomId = route.params.roomId
const roomData = ref({name: '', width: null, height: null, seats: []})

//컨텍스트 메뉴
const contextMenuVisible = ref(false);
const contextMenuX = ref(0);
const contextMenuY = ref(0);
const selectedSeatId = ref(null);
const selectedX = ref(0);
const selectedY = ref(0);

//좌석 추가 다이얼로그
const addSeatDialog = ref(false);
const newSeatName = ref('');
const newSeatStatus = ref('IDLE');
const seatStatusOptions = ref([
  {title: '사용 가능', value: 'IDLE'},
  {title: '사용 불가', value: 'UNAVAILABLE'},
]);


const fetchSeats = async () => {

  try {
    const response = await axios.get(`/api/readingrooms/${roomId}`)

    roomData.value = response.data.data
  } catch (error) {
    console.error('Error fetching seats:', error)
  }
}

const showContextMenu = (event, x, y) => {
  selectedX.value = x;
  selectedY.value = y;
  selectedSeatId.value = getSeatId(x, y);
  contextMenuX.value = event.clientX;
  contextMenuY.value = event.clientY;
  contextMenuVisible.value = true;
};

const addSeat = () => {
  addSeatDialog.value = true;
};

const editSeat = () => {
  newSeatName.value = getSeatName(selectedX.value, selectedY.value);
  newSeatStatus.value = getSeatStatus(selectedX.value, selectedY.value);
  addSeatDialog.value = true;
};

const getSeatStatus = (x, y) => {
  const seat = roomData.value.seats.find(seat => seat.x === x && seat.y === y);
  return seat ? seat.status : null;
};


const deleteSeat = async () => {
  try {
    await axios.delete(`/api/readingrooms/${roomId}/seats/${selectedSeatId.value}`);
    roomData.value.seats = roomData.value.seats.filter(seat => seat.id !== selectedSeatId.value);
    selectedSeatId.value = null;
    contextMenuVisible.value = false;
  } catch (error) {
    console.error('Error deleting seat:', error);
  }
};


const closeAddSeatDialog = () => {
  addSeatDialog.value = false;
  newSeatName.value = '';
  selectedSeatId.value = null;
};
const submitAddSeat = async () => {
  try {
    if (selectedSeatId.value) {
      const response = await axios.put(`/api/readingrooms/${roomId}/seats/${selectedSeatId.value}`, {
        name: newSeatName.value,
        x: selectedX.value,
        y: selectedY.value,
        status: newSeatStatus.value
      });
      const updatedSeatIndex = roomData.value.seats.findIndex(seat => seat.id === selectedSeatId.value);
      roomData.value.seats[updatedSeatIndex] = response.data.data;
    } else {
      const response = await axios.post(`/api/readingrooms/${roomId}/seats`, {
        name: newSeatName.value,
        x: selectedX.value,
        y: selectedY.value,
        status: newSeatStatus.value
      });
      roomData.value.seats.push(response.data.data);
    }
    closeAddSeatDialog();
  } catch (error) {
    console.error('Error updating/adding seat:', error);
  }
};

const isIdle = (x, y) => {
  return !!roomData.value.seats.find(seat => seat.x === x && seat.y === y && seat.status === 'IDLE')
}

const isOccupied = (x, y) => {
  return !!roomData.value.seats.find(seat => seat.x === x && seat.y === y && seat.status === 'OCCUPIED')
}

const isUnavailable = (x, y) => {
  return !!roomData.value.seats.find(seat => seat.x === x && seat.y === y && seat.status === 'UNAVAILABLE')
}

const getSeatId = (x, y) => {
  const seat = roomData.value.seats.find(seat => seat.x === x && seat.y === y)
  return seat ? seat.id : null
}

const getSeatName = (x, y) => {
  const seat = roomData.value.seats.find(seat => seat.x === x && seat.y === y)
  return seat ? seat.name : null
}

const dragStart = (event, x, y) => {
  const seatId = getSeatId(x, y)
  event.dataTransfer.setData('text/plain', JSON.stringify({seatId}))
}

const drop = async (event, x, y) => {
  event.preventDefault();
  const data = event.dataTransfer.getData('text/plain');

  if (data) {
    try {
      const draggedSeatId = JSON.parse(data).seatId;
      const draggedSeatIndex = roomData.value.seats.findIndex(seat => seat.id === draggedSeatId);

      if (draggedSeatIndex !== -1) {
        const targetSeatId = getSeatId(x, y);

        if (!targetSeatId) {
          const draggedSeat = roomData.value.seats[draggedSeatIndex];
          draggedSeat.x = x;
          draggedSeat.y = y;

          try {
            await axios.put(`/api/readingrooms/${roomId}/seats/${draggedSeatId}`, {
              name: draggedSeat.name,
              x: draggedSeat.x,
              y: draggedSeat.y,
              status: draggedSeat.status
            });
          } catch (error) {
            console.error('Error updating seat position:', error);
          }
        }
      }
    } catch (error) {
      console.error('Error parsing JSON data:', error);
    }
  }
};
onMounted(() => {
  fetchSeats()
})


</script>
<style scoped>
.seating-plan {
  display: inline-block;
}

.row {
  display: flex;
}

.seat {
  font-weight: bold;
  width: 3rem;
  height: 2rem;
  margin: 0.2rem;
  border: 0.1rem solid lightgray;
  text-align: center;
  line-height: 2rem;
  cursor: pointer;
  background-color: white;
}

.seat.idle {
  background-color: #01B9E9;
}

.seat.occupied {
  background-color: #ADADAD;
}

.seat.unavailable {
  background-color: #ff4242;
}

.custom-context-menu {
  position: absolute;
  left: v-bind(contextMenuX+ 'px');
  top: v-bind(contextMenuY+ 'px');
}

.v-list-item {
  cursor: pointer;
  font-size: 0.9rem;
  min-height: 1rem !important;
  padding-top: 0.1rem;
  padding-bottom: 0.1rem;
}

.v-list-item:hover {
  background-color: #e0e0e0;
}
</style>
