<template>
  <div>
    <input
        type="text"
        v-model="qrCodeInput"
        placeholder="QR 코드를 입력하세요"
        @keyup.enter="onEnterKey"
        style="position: absolute; left: -9999px; width: 1px; height: 1px;"
        ref="inputRef"
        @blur="$refs.inputRef.focus()"
    />
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";

const qrCodeInput = ref("");

const onEnterKey = () => {
  if (qrCodeInput.value) {
    console.log(qrCodeInput.value);
    qrCodeInput.value = "";
  }
};

onMounted(() => {
  document.querySelector("input").focus();
});
</script>