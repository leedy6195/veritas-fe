<template>
  <fullscreen id="fullscreen" v-model="isfullscreen" style="background-color: white">
    <div class="blue-container">
      <div>
        <input
            type="text"
            v-model="qrCodeInput"
            placeholder="QR 코드를 입력하세요"
            @keyup.enter="onQrInput"
            style="position: absolute; left: -9999px; width: 1px; height: 1px;"
            ref="inputRef"
            @blur="onInputBlur"
            :disabled="inputDisabled"
            inputmode="none"
        />
      </div>
      <div style="display:flex">
        <v-img v-on:dblclick="toggle" min-width="4rem" class="mr-3" src="@/assets/veritas_logo_white.png"></v-img>
        <h1>{{ roomData.name }}</h1>
      </div>

      <span class="current-date">{{ currentDate }}</span>
      <span class="current-time">{{ currentTime }}</span>
      <v-icon @click="refreshAndFullsize">mdi-refresh</v-icon>

      <div class="card">
        <div class="seating-info">
          <div class="info-item">
            <div class="color-box idle"></div>
            <span>이용가능</span>
          </div>
          <div class="info-item">
            <div class="color-box occupied"></div>
            <span>사용중</span>
          </div>
          <div class="info-item">
            <div class="color-box unavailable"></div>
            <span>사용불가</span>
          </div>
        </div>


      </div>
    </div>

    <v-container class="overflow-x-auto">
      <v-row>
        <v-col class="d-flex justify-center">
          <div class="seating-plan">
            <div v-for="y in roomData.height" :key="`row-${y}`" class="row">
              <div
                  v-for="x in roomData.width"
                  :key="`seat-${x}-${y}`"
                  class="seat rounded"
                  :class="{
                  idle: getSeatStatus(x, y) === 'IDLE',
                  occupied: getSeatStatus(x, y) === 'OCCUPIED',
                  unavailable: getSeatStatus(x, y) === 'UNAVAILABLE',
                  clickable: isClickable(x, y),
                }"
                  @click="openQrDialog(x, y)"
              >
                {{ getSeatName(x, y) }}
              </div>
            </div>
          </div>
        </v-col>
      </v-row>

    </v-container>
  </fullscreen>


  <v-dialog attach="#fullscreen" v-model="qrDialog" max-width="500px" @click:outside="closeQrDialogWithFocus">
    <v-card class="pa-5">
      <v-card-title class="text-h5 align-self-center">
        좌석 입실 신청
      </v-card-title>
      <v-card-text>
        <div>{{ selectedSeatName }}번 좌석 입실을 신청하시려면 QR코드를 인식해주세요.</div>
        <div class="mt-2">{{ remainingTime }}초 후에 대기화면으로 이동합니다.</div>
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="primary" @click="closeQrDialogWithFocus">
          닫기
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>

  <v-dialog attach="#fullscreen" v-model="alertDialog" max-width="500px" @click:outside="closeAlertDialogWithFocus">
    <v-card class="pa-5">
      <v-card-text>
        <div>{{ alertMessage }}</div>
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="primary" @click="closeAlertDialogWithFocus">
          닫기
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>


  <v-overlay attach="#fullscreen" opacity="0.3" v-model="enterCardOverlay" class="d-flex align-center justify-center">
    <v-card class="mt-5 ml-16 mr-16" flat>
      <v-card-text class="text-center" style="color:#01B9E9">
        <h3>{{ enterStudentName }}</h3>
        <div class="mt-2">입실: {{ enterTime }}</div>
      </v-card-text>
    </v-card>
  </v-overlay>
</template>

<script setup>
import {nextTick, onMounted, ref} from "vue";
import axios from "axios";
//import { Portal, PortalTarget } from "portal-vue"

import {useRoute} from "vue-router";

const route = useRoute();
const roomId = route.params.roomId;
const roomData = ref({name: "", width: null, height: null, receiverToken: "", seats: []});
const qrCodeInput = ref("");
const qrDialog = ref(false);
const selectedSeatId = ref(null);
const selectedSeatName = ref("");
const enterStudentName = ref("");
const enterTime = ref("");
const enterCardOverlay = ref(false);
const remainingTime = ref(30);
let countdownTimer = null;
const inputDisabled = ref(false);
const mutex = ref(0);
const isfullscreen = ref(false);
const alertDialog = ref(false);
const alertMessage = ref("");

const refreshAndFullsize = () => {
  location.reload()
}
const toggle = () => {
  isfullscreen.value = !isfullscreen.value;
};
const getSeatName = (x, y) => {
  const seat = roomData.value.seats.find((seat) => seat.x === x && seat.y === y);
  return seat ? seat.name : null;
};

const getSeatStatus = (x, y) => {
  const seat = roomData.value.seats.find((seat) => seat.x === x && seat.y === y);
  return seat ? seat.status : null;
};

const isClickable = (x, y) => {
  return getSeatStatus(x, y) === "IDLE";
};

const getSeatId = (x, y) => {
  const seat = roomData.value.seats.find((seat) => seat.x === x && seat.y === y);
  return seat ? seat.id : null;
};

const fetchSeats = async () => {
  try {
    const response = await axios.get(`https://veritas-s.app/api/readingrooms/${roomId}`);
    roomData.value = response.data.data;
  } catch (error) {
    console.error("Error fetching seats:", error);
    // 오류 메시지를 사용자에게 표시하거나 다른 작업 수행
  }
};

const resetInput = () => {
  qrCodeInput.value = "";
  selectedSeatId.value = null;
  selectedSeatName.value = "";
  inputDisabled.value = false;

  enterStudentName.value = "";
  enterTime.value = "";
  enterCardOverlay.value = false;



  /***
   *   qrCodeInput.value = "";
   *   selectedSeatId.value = null;
   *   inputDisabled.value = false;
   *
   *   enterStudentName.value = "";
   *   enterTime.value = "";
   *   enterCardOverlay.value = false;
   */

  onInputBlur();
};

const closeAlertDialogWithFocus = () => {
  resetInput();
  alertMessage.value = "";
  alertDialog.value = false;
  nextTick(() => {
    document.querySelector("input").focus();
  });
};

const closeQrDialogWithFocus = () => {
  resetInput();
  qrDialog.value = false;

  clearInterval(countdownTimer);
  nextTick(() => {
    document.querySelector("input").focus();
  });
};


const onQrInput = () => {
  inputDisabled.value = true;
  if (qrCodeInput.value) {
    if (selectedSeatId.value) {
      enterReadingRoom();
    } else {
      axios.post(`https://veritas-s.app/api/access/readingroom/check`, {
        roomId: roomId,
        serial: qrCodeInput.value,
      }).then((response) => {
        if (response.data.header.success) {
          if (response.data.data == null) {
            resetInput();
            openAlertDialog("입실정보가 없습니다. 좌석지정을 먼저 해주세요.");

          } else {
            selectedSeatId.value = response.data.data.seatId;
            enterReadingRoom();
          }
        } else {
          resetInput();
          openAlertDialog(response.data.header.message);
        }
      });
    }
  }
};


// 기존 코드 수정
const enterReadingRoom = () => {
  axios.post(`https://veritas-s.app/api/access/readingroom/enter`, {
    roomId: roomId,
    seatId: selectedSeatId.value,
    serial: qrCodeInput.value,
  }).then((response) => {
    if (response.data.header.success) {
      roomData.value.seats.find((seat) => seat.id === selectedSeatId.value).status = "OCCUPIED";
      closeQrDialogWithFocus();
      enterStudentName.value = response.data.data.studentName;
      enterTime.value = new Date(response.data.data.enterTime).toLocaleTimeString();

      enterCardOverlay.value = true;

      setTimeout(() => {
        enterStudentName.value = "";
        enterTime.value = "";
        enterCardOverlay.value = false;
      }, 3000);

      mutex.value++;
      axios.get(`https://blynk.cloud/external/api/update?token=${roomData.value.receiverToken}&v0=0`)
          .finally(() => {
            setTimeout(() => {
              console.log("second call")
              axios.get(`https://blynk.cloud/external/api/update?token=${roomData.value.receiverToken}&v0=1`)
                  .finally(() => {
                    mutex.value--;
                  });
            }, 10000);
          });
    } else {
      resetInput();
      openAlertDialog(response.data.header.message);
    }
  });
};


const openAlertDialog = (message) => {
  alertMessage.value = message;
  alertDialog.value = true;
};
const onInputBlur = () => {
  if (!qrDialog.value && !alertDialog.value) {
    nextTick(() => {
      document.querySelector("input").focus();
    });
  }
};

const openQrDialog = (x, y) => {
  if (isClickable(x, y)) {
    qrDialog.value = true;
    selectedSeatId.value = getSeatId(x, y);
    selectedSeatName.value = getSeatName(x, y);
    remainingTime.value = 30;
    startCountdownTimer();
  }
};

const startCountdownTimer = () => {
  countdownTimer = setInterval(() => {
    remainingTime.value--;
    if (remainingTime.value === 0) {
      clearInterval(countdownTimer);
      closeQrDialogWithFocus();
    }
  }, 1000);
};


const currentTime = ref("");
const currentDate = ref("");
const updateCurrentTime = () => {
  const now = new Date();
  const options = {weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'};
  currentDate.value = now.toLocaleDateString(undefined, options);
  currentTime.value = now.toLocaleTimeString();
};

onMounted(() => {
  fetchSeats();
  document.querySelector("input").focus();
  updateCurrentTime();
  setInterval(updateCurrentTime, 1000);

});
</script>


<style scoped>

.seating-plan {
  display: inline-block;
}


.color-box.idle {
  background-color: #01b9e9;
}

.color-box.occupied {
  background-color: #adadad;
}

.color-box.unavailable {
  background-color: #ff4242;
}

.info-item {
  display: flex;
  align-items: center;
  margin-right: 20px;
}

.row {
  display: flex;
}

.seat {
  font-weight: bold;
  width: 8rem;
  height: 5rem;
  margin: 0.4rem;
  text-align: center;
  display: flex;
  justify-content: center;
  align-items: center;
}

.seat.clickable {
  cursor: pointer;
}

.seat.idle {
  background-color: #01b9e9;
}

.seat.occupied {
  background-color: #adadad;
}

.seat.unavailable {
  background-color: #ff4242;
}

.blue-container {
  background-color: #236DB5;
  padding: 20px;
  height: 20rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;
  color: white;
}

.current-time {
  font-size: 1.5rem;
  font-weight: bold;
}

.card {
  border: 1px solid white;
  border-radius: 8px;
  padding: 1em;
  align-self: flex-end;
}

.seating-info {
  display: flex;
  justify-content: center;

}

.color-box {
  width: 20px;
  height: 20px;
  margin-right: 5px;
  border-radius: 4px;
}


.color-box.idle {
  background-color: #01b9e9;
}

.color-box.occupied {
  background-color: #adadad;
}

.color-box.unavailable {
  background-color: #ff4242;
}

.info-item {
  display: flex;
  align-items: center;
  margin-right: 20px;
  color: white;
}
</style>