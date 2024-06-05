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
        />
      </div>
      <div style="display:flex">
        <v-img v-on:dblclick="toggle" min-width="4rem" class="mr-3" src="@/assets/veritas_logo_white.png"></v-img>
        <h1>{{ roomName }}</h1>
      </div>

      <span class="current-date">{{ currentDate }}</span>
      <span class="current-time">{{ currentTime }}</span>


    </div>
  </fullscreen>


  <v-overlay attach="#fullscreen" opacity="0.3" v-model="exitCardOverlay" class="d-flex align-center justify-center" transition="false">
    <v-card class="mt-5 ml-16 mr-16" flat>
      <v-card-text class="text-center" style="color:#DD6396">
        <h3>{{ exitStudentName }}</h3>
        <div class="mt-2">퇴실: {{ exitTime }}</div>
      </v-card-text>
    </v-card>
  </v-overlay>


  <v-dialog attach="#fullscreen" v-model="alertDialog" max-width="500px" @click:outside="closeAlertDialogWithFocus">
    <v-card class="pa-5">
      <v-card-text>
        <div>{{ alertMessage }}</div>
      </v-card-text>
    </v-card>
  </v-dialog>


</template>

<script setup>
import {nextTick, onMounted, ref} from "vue";
import axios from "axios";
import {useRoute} from "vue-router";

const route = useRoute();
const deviceId = route.params.deviceId;
const roomName = ref("");
const qrCodeInput = ref("");

const exitStudentName = ref("");
const exitTime = ref("");
const exitCardOverlay = ref(false);
const inputDisabled = ref(false);

const isfullscreen = ref(false);
const alertDialog = ref(false);
const alertMessage = ref("");


const fetchData = async () => {
  try {
    const response = await axios.get(`https://veritas-s.app/api/devices/entryDevices/${deviceId}`);
    roomName.value = response.data.data.name;
  } catch (error) {
    console.error("Error fetching device:", error);
  }
};

const toggle = () => {
  isfullscreen.value = !isfullscreen.value;
};

const onQrInput = () => {

  axios.post(`https://veritas-s.app/api/access/lectureroom/exit`, {
    accessType: 'OUT',
    deviceId: deviceId,
    serial: qrCodeInput.value
  }).then((response) => {

    if (response.data.header.success) {
      exitStudentName.value = response.data.data.studentName
      exitTime.value = new Date(response.data.data.time).toLocaleTimeString()
      exitCardOverlay.value = true
      inputDisabled.value = true;

      setTimeout(() => {
        exitCardOverlay.value = false
        resetInput()
      }, 3000)
    } else {
      resetInput()
      //alert(response.data.header.message)
      openAlertDialog(response.data.header.message)
    }

  })
}

const openAlertDialog = (message) => {
  alertMessage.value = message;
  alertDialog.value = true;
  inputDisabled.value = true;

  setTimeout(() => {
    alertDialog.value = false;
    resetInput();
  }, 3000);
};

const closeAlertDialogWithFocus = () => {
  alertMessage.value = "";
  alertDialog.value = false;
  qrCodeInput.value = ""
  inputDisabled.value = false;
  nextTick(() => {
    document.querySelector("input").focus();
  });
};

const resetInput = () => {
  exitStudentName.value = ""
  exitTime.value = ""
  qrCodeInput.value = ""
  inputDisabled.value = false;
  onInputBlur();
}
const onInputBlur = () => {
  if (!alertDialog.value) {
    nextTick(() => {
      document.querySelector("input").focus();
    });
  }
}


const currentTime = ref("");
const currentDate = ref("");
const updateCurrentTime = () => {
  const now = new Date();
  const options = {weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'};
  currentDate.value = now.toLocaleDateString(undefined, options);
  currentTime.value = now.toLocaleTimeString();
};

onMounted(() => {
  fetchData();
  document.querySelector("input").focus();
  updateCurrentTime();
  setInterval(updateCurrentTime, 1000);
});
</script>

<style scoped>

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


</style>