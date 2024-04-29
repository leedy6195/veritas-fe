<template>
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
      <v-img min-width="4rem" class="mr-3" src="@/assets/veritas_logo_white.png"></v-img>
      <h1>{{ roomName }}</h1>
    </div>

    <span class="current-date">{{ currentDate }}</span>
    <span class="current-time">{{ currentTime }}</span>


  </div>

  <v-container class="overflow-x-auto">


    <v-overlay opacity="0.3" v-model="exitCardOverlay" class="d-flex align-center justify-center" transition="false">
      <v-card class="mt-5 ml-16 mr-16" flat>
        <v-card-text class="text-center" style="color:#DD6396">
          <h3>{{ exitStudentName }}</h3>
          <div class="mt-2">퇴실: {{ exitTime }}</div>
        </v-card-text>
      </v-card>
    </v-overlay>

  </v-container>
</template>

<script setup>
import {nextTick, onMounted, ref} from "vue";
import axios from "axios";
import {useRoute} from "vue-router";

const route = useRoute();
const deviceId = route.params.deviceId;
const roomName = ref("");
const receiverToken = ref("");
const qrCodeInput = ref("");

const exitStudentName = ref("");
const exitTime = ref("");
const exitCardOverlay = ref(false);
const inputDisabled = ref(false);

const mutex = ref(0)

const fetchData = async () => {
  try {
    const response = await axios.get(`https://veritas-s.app/api/devices/entryDevices/${deviceId}`);
    roomName.value = response.data.data.name;
    receiverToken.value = response.data.data.receiverToken;
  } catch (error) {
    console.error("Error fetching seats:", error);
  }
};


const onQrInput = () => {

  axios.post(`https://veritas-s.app/api/access/readingroom/exit`, {
    deviceId: deviceId,
    serial: qrCodeInput.value
  }).then((response) => {

    if (response.data.header.success) {
      exitStudentName.value = response.data.data.studentName
      exitTime.value = new Date(response.data.data.exitTime).toLocaleTimeString();
      exitCardOverlay.value = true
      inputDisabled.value = true;

      setTimeout(() => {
        resetInput()
      }, 3000)

      mutex.value++;
      axios.get(`https://blynk.cloud/external/api/update?token=${receiverToken.value}&v0=0`).then(() => {
        setTimeout(() => {
          if (mutex.value <= 1) {
            axios.get(`https://blynk.cloud/external/api/update?token=${receiverToken.value}&v0=1`)
          }
          mutex.value--;
        }, 10000)
      })

    } else {
      resetInput()
      alert(response.data.header.message)
    }

  })
}

const resetInput = () => {
  exitStudentName.value = ""
  exitTime.value = ""
  qrCodeInput.value = ""
  inputDisabled.value = false;
  exitCardOverlay.value = false
  onInputBlur();
}
const onInputBlur = () => {

  nextTick(() => {
    document.querySelector("input").focus();
  });

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