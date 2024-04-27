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


    <v-overlay opacity="0.3" v-model="enterCardOverlay" class="d-flex align-center justify-center" transition="false">
      <v-card class="mt-5 ml-16 mr-16" flat>
        <v-card-text class="text-center" style="color:#01B9E9">
          <h3>{{ enterStudentName }}</h3>
          <div class="mt-2">입실: {{ enterTime }}</div>
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
const qrCodeInput = ref("");

const enterStudentName = ref("");
const enterTime = ref("");
const enterCardOverlay = ref(false);
const inputDisabled = ref(false);


const fetchData = async () => {
  try {
    const response = await axios.get(`http://localhost:8080/api/devices/entryDevices/${deviceId}`);
    roomName.value = response.data.data.name;
  } catch (error) {
    console.error("Error fetching device:", error);
  }
};


const onQrInput = () => {

  axios.post(`http://localhost:8080/api/access/lectureroom/enter`, {
    accessType: 'IN',
    deviceId: deviceId,
    serial: qrCodeInput.value
  }).then((response) => {

    if (response.data.header.success) {
      enterStudentName.value = response.data.data.studentName
      enterTime.value = response.data.data.time
      enterCardOverlay.value = true
      inputDisabled.value = true;

      setTimeout(() => {
        enterCardOverlay.value = false
        resetInput()
      }, 3000)
    } else {
      resetInput()
      alert(response.data.header.message)
    }

  })
}

const resetInput = () => {
  enterStudentName.value = ""
  enterTime.value = ""
  qrCodeInput.value = ""
  inputDisabled.value = false;
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