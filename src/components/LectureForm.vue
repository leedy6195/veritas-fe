<template>
  <v-form @submit.prevent="submit">
    <v-row>
      <v-col cols="12">
        <v-text-field v-model="lecture.name" label="강의명" density="comfortable"></v-text-field>
        <v-text-field v-model="lecture.instructor" label="강사명" density="comfortable"></v-text-field>
        <v-text-field v-model="lecture.fee" label="수강료" type="number" density="comfortable"></v-text-field>
      </v-col>
      <v-col cols="6">
        <v-text-field v-model="lecture.startDate" label="시작일" type="date" density="comfortable"></v-text-field>
      </v-col>
      <v-col cols="6">
        <v-text-field v-model="lecture.endDate" label="종료일" type="date" density="comfortable"></v-text-field>
      </v-col>
      <v-col cols="12">
        <v-row>
          <v-col cols="4">
            <v-checkbox v-model="lecture.schedule.MON.checked" label="월요일"></v-checkbox>
          </v-col>
          <v-col cols="4">
            <v-text-field v-model="lecture.schedule.MON.startTime" type="time" label="시작시간"
                          :disabled="!lecture.schedule.MON.checked"></v-text-field>
          </v-col>
          <v-col cols="4">
            <v-text-field v-model="lecture.schedule.MON.endTime" type="time" label="종료시간"
                          :disabled="!lecture.schedule.MON.checked"></v-text-field>
          </v-col>
        </v-row>
        <v-row>
          <v-col cols="4">
            <v-checkbox v-model="lecture.schedule.TUE.checked" label="화요일"></v-checkbox>
          </v-col>
          <v-col cols="4">
            <v-text-field v-model="lecture.schedule.TUE.startTime" type="time" label="시작시간"
                          :disabled="!lecture.schedule.TUE.checked"></v-text-field>
          </v-col>
          <v-col cols="4">
            <v-text-field v-model="lecture.schedule.TUE.endTime" type="time" label="종료시간"
                          :disabled="!lecture.schedule.TUE.checked"></v-text-field>
          </v-col>
        </v-row>
        <v-row>
          <v-col cols="4">
            <v-checkbox v-model="lecture.schedule.WED.checked" label="수요일"></v-checkbox>
          </v-col>
          <v-col cols="4">
            <v-text-field v-model="lecture.schedule.WED.startTime" type="time" label="시작시간"
                          :disabled="!lecture.schedule.WED.checked"></v-text-field>
          </v-col>
          <v-col cols="4">
            <v-text-field v-model="lecture.schedule.WED.endTime" type="time" label="종료시간"
                          :disabled="!lecture.schedule.WED.checked"></v-text-field>
          </v-col>
        </v-row>
        <v-row>
          <v-col cols="4">
            <v-checkbox v-model="lecture.schedule.THU.checked" label="목요일"></v-checkbox>
          </v-col>
          <v-col cols="4">
            <v-text-field v-model="lecture.schedule.THU.startTime" type="time" label="시작시간"
                          :disabled="!lecture.schedule.THU.checked"></v-text-field>
          </v-col>
          <v-col cols="4">
            <v-text-field v-model="lecture.schedule.THU.endTime" type="time" label="종료시간"
                          :disabled="!lecture.schedule.THU.checked"></v-text-field>
          </v-col>
        </v-row>
        <v-row>
          <v-col cols="4">
            <v-checkbox v-model="lecture.schedule.FRI.checked" label="금요일"></v-checkbox>
          </v-col>
          <v-col cols="4">
            <v-text-field v-model="lecture.schedule.FRI.startTime" type="time" label="시작시간"
                          :disabled="!lecture.schedule.FRI.checked"></v-text-field>
          </v-col>
          <v-col cols="4">
            <v-text-field v-model="lecture.schedule.FRI.endTime" type="time" label="종료시간"
                          :disabled="!lecture.schedule.FRI.checked"></v-text-field>
          </v-col>
        </v-row>
        <v-row>
          <v-col cols="4">
            <v-checkbox v-model="lecture.schedule.SAT.checked" label="토요일"></v-checkbox>
          </v-col>
          <v-col cols="4">
            <v-text-field v-model="lecture.schedule.SAT.startTime" type="time" label="시작시간"
                          :disabled="!lecture.schedule.SAT.checked"></v-text-field>
          </v-col>
          <v-col cols="4">
            <v-text-field v-model="lecture.schedule.SAT.endTime" type="time" label="종료시간"
                          :disabled="!lecture.schedule.SAT.checked"></v-text-field>
          </v-col>
        </v-row>
        <v-row>
          <v-col cols="4">
            <v-checkbox v-model="lecture.schedule.SUN.checked" label="일요일"></v-checkbox>
          </v-col>
          <v-col cols="4">
            <v-text-field v-model="lecture.schedule.SUN.startTime" type="time" label="시작시간"
                          :disabled="!lecture.schedule.SUN.checked"></v-text-field>
          </v-col>
          <v-col cols="4">
            <v-text-field v-model="lecture.schedule.SUN.endTime" type="time" label="종료시간"
                          :disabled="!lecture.schedule.SUN.checked"></v-text-field>
          </v-col>
        </v-row>
      </v-col>
    </v-row>
  </v-form>
</template>

<script setup>
import {onMounted, ref, watch} from 'vue'

// eslint-disable-next-line no-undef
const props = defineProps({
  modelValue: {
    type: Object,
    required: true,
  },
})

// eslint-disable-next-line no-undef
const emit = defineEmits(['update:modelValue', 'submit'])

const lecture = ref({ ...props.modelValue })

const submit = () => {
  emit('submit')
}

const daysOfWeek = ['MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT', 'SUN']
daysOfWeek.forEach(day => {
  watch(() => lecture.value.schedule[day].checked, (newVal) => {
    if (!newVal) {
      lecture.value.schedule[day].startTime = null
      lecture.value.schedule[day].endTime = null
    }
  })
})

watch(lecture, (newVal) => {
  emit('update:modelValue', newVal)
}, { deep: true })

</script>