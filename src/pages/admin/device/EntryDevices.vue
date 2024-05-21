<template>
  <v-container>
    <v-row>
      <v-col>
        <v-btn class="mb-4 float-right" color="primary" @click="addEntryDeviceDialog = true">
          출입 디바이스 추가
        </v-btn>
      </v-col>
    </v-row>

    <v-row>
      <v-col>
        <v-table density="comfortable">
          <thead>
          <tr>
            <th class="text-left">디바이스 관리명</th>
            <th class="text-left">용도</th>
            <th class="text-left">출입구분</th>
            <th class="text-left">연동 키오스크</th>
            <th class="text-left">연동 강의실</th>
            <th class="text-left">화면 바로가기</th>
          </tr>
          </thead>
          <tbody>
          <tr v-for="item in entryDevices" :key="item.id">
            <td @click="editEntryDevice(item)" style="cursor: pointer;">{{ item.name }}</td>
            <td>{{ item.parentKioskName ? '독서실' : '강의실' }}</td>
            <td>{{ item.accessType === 'IN' ? '입실' : '퇴실' }}</td>
            <td>{{ item.parentKioskName || '' }}</td>
            <td>{{ item.lectureRoomName || '' }}</td>
            <td>
              <router-link
                  :to="`/views/${item.parentKioskName ? 'readingroom' : 'lectureroom'}/${item.accessType === 'IN' ? 'enter' : 'exit'}/${item.id}`">
                링크
              </router-link>
            </td>
          </tr>

          </tbody>
        </v-table>
      </v-col>
    </v-row>

    <v-dialog v-model="addEntryDeviceDialog" max-width="500px">
      <v-card>
        <v-card-title>출입 디바이스 추가</v-card-title>

        <v-card-text>
          <v-row>
            <v-col>
              <v-text-field v-model="entryDeviceName" label="디바이스 관리명" density="compact" variant="outlined" required
                            :rules="[v => !!v || '필수 입력']"></v-text-field>
            </v-col>
          </v-row>

          <v-row>
            <v-col>
              <v-radio-group label="용도" v-model="kioskSync" @change="onKioskSyncChange" inline>
                <v-radio label="독서실" :value="true"></v-radio>
                <v-radio class="mr-6" label="강의실" :value="false"></v-radio>
              </v-radio-group>
            </v-col>
          </v-row>

          <v-row>
            <v-col>
              <v-radio-group label="출입구분" v-model="accessType" inline>
                <v-radio class="mr-6" label="입실" value="IN" :disabled="kioskSync === true"></v-radio>
                <v-radio label="퇴실" value="OUT"></v-radio>
              </v-radio-group>
            </v-col>
          </v-row>

          <v-row v-if="kioskSync">
            <v-col>
              <v-select v-model="selectedKiosk" :items="kiosks" item-title="name" item-value="id" label="키오스크 선택"
                        density="compact" variant="outlined" required></v-select>
            </v-col>
          </v-row>

          <v-row v-if="!kioskSync">
            <v-col>
              <v-select v-model="selectedLectureRoom" :items="lectureRooms" item-title="name" item-value="id"
                        label="강의실 선택" density="compact" variant="outlined"></v-select>
            </v-col>
          </v-row>
        </v-card-text>

        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="primary" @click="addEntryDevice">추가</v-btn>
          <v-btn color="error" @click="addEntryDeviceDialog = false">취소</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-dialog v-model="editEntryDeviceDialog" max-width="500px">
      <v-card>
        <v-card-title>출입 디바이스 수정</v-card-title>

        <v-card-text>
          <v-row>
            <v-col>
              <v-text-field v-model="editedEntryDevice.name" label="디바이스 관리명" density="compact" variant="outlined"
                            required
                            :rules="[v => !!v || '필수 입력']"></v-text-field>
            </v-col>
          </v-row>

          <v-row>
            <v-col>
              <v-radio-group label="용도" v-model="editedEntryDevice.kioskSync" @change="onEditKioskSyncChange" inline>
                <v-radio label="독서실" :value="true"></v-radio>
                <v-radio class="mr-6" label="강의실" :value="false"></v-radio>
              </v-radio-group>
            </v-col>
          </v-row>

          <v-row>
            <v-col>
              <v-radio-group label="출입구분" v-model="editedEntryDevice.accessType" inline>
                <v-radio class="mr-6" label="입실" value="IN" :disabled="editedEntryDevice.kioskSync === true"></v-radio>
                <v-radio label="퇴실" value="OUT"></v-radio>
              </v-radio-group>
            </v-col>
          </v-row>

          <v-row v-if="editedEntryDevice.kioskSync">
            <v-col>
              <v-select v-model="editedEntryDevice.selectedKiosk" :items="kiosks" item-title="name" item-value="id"
                        label="키오스크 선택"
                        density="compact" variant="outlined" required></v-select>
            </v-col>
          </v-row>

          <v-row v-if="!editedEntryDevice.kioskSync">
            <v-col>
              <v-select v-model="editedEntryDevice.selectedLectureRoom" :items="lectureRooms" item-title="name"
                        item-value="id"
                        label="강의실 선택" density="compact" variant="outlined"></v-select>
            </v-col>
          </v-row>
        </v-card-text>

        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="error" text @click="deleteEntryDevice">삭제</v-btn>
          <v-btn color="primary" @click="updateEntryDevice">수정</v-btn>
          <v-btn color="error" @click="editEntryDeviceDialog = false">취소</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script setup>
import {ref, onMounted, watch} from 'vue';
import axios from 'axios';

const entryDeviceName = ref('');
const accessType = ref('OUT');
const kioskSync = ref(true);
const selectedKiosk = ref(null);
const selectedLectureRoom = ref(null);
const entryDevices = ref([]);
const kiosks = ref([]);
const addEntryDeviceDialog = ref(false);
const editEntryDeviceDialog = ref(false);
const lectureRooms = ref([]);

const editedEntryDevice = ref({
  id: null,
  name: '',
  accessType: 'OUT',
  kioskSync: true,
  selectedKiosk: null,
  selectedLectureRoom: null,
});

const editEntryDevice = (item) => {
  editedEntryDevice.value = {
    id: item.id,
    name: item.name,
    accessType: item.accessType,
    kioskSync: item.parentKioskName ? true : false,
    selectedKiosk: kiosks.value.find(kiosk => kiosk.name === item.parentKioskName),

    selectedLectureRoom: lectureRooms.value.find(lectureRoom => lectureRoom.name === item.lectureRoomName)

  };
  editEntryDeviceDialog.value = true;
};

const onEditKioskSyncChange = () => {
  if (!editedEntryDevice.value.kioskSync) {
    editedEntryDevice.value.selectedKiosk = null;
    editedEntryDevice.value.accessType = "IN";
  } else {
    editedEntryDevice.value.selectedLectureRoom = null;
    editedEntryDevice.value.accessType = "OUT";
  }
};

const updateEntryDevice = () => {
  if (!editedEntryDevice.value.name) {
    alert('디바이스 관리명을 입력해주세요.');
    return;
  }

  if (editedEntryDevice.value.kioskSync && !editedEntryDevice.value.selectedKiosk) {
    alert('키오스크를 선택해주세요.');
    return;
  }

  if (!editedEntryDevice.value.kioskSync && !editedEntryDevice.value.selectedLectureRoom) {
    alert('강의실을 선택해주세요.');
    return;
  }

  const payload = {
    name: editedEntryDevice.value.name,
    accessType: editedEntryDevice.value.accessType,
    parentKioskId: editedEntryDevice.value.selectedKiosk,
    lectureRoomId: editedEntryDevice.value.selectedLectureRoom,
  };

  axios.put(`https://veritas-s.app/api/devices/entryDevices/${editedEntryDevice.value.id}`, payload).then((response) => {
    if (response.data.header.success) {
      location.reload();
    } else {
      alert(response.data.header.message);
    }
  });
};

const fetchKioskList = async () => {
  try {
    const response = await axios.get('https://veritas-s.app/api/devices/kiosks');
    kiosks.value = response.data.data;
  } catch (error) {
    console.error('Failed to fetch kiosk list:', error);
  }
};

const fetchLectureRooms = async () => {
  try {
    const response = await axios.get('https://veritas-s.app/api/lecturerooms');
    lectureRooms.value = response.data.data
  } catch (error) {
    console.error('Failed to fetch lectureRoom list:', error);
  }

}

const fetchEntryDevices = async () => {
  try {
    const response = await axios.get('https://veritas-s.app/api/devices/entryDevices');
    entryDevices.value = response.data.data;
  } catch (error) {
    console.error('Failed to fetch entryDevices list:', error);
  }
}

const onKioskSyncChange = () => {
  if (!kioskSync.value) {
    selectedKiosk.value = null;
    accessType.value = "IN"
  } else {
    selectedLectureRoom.value = null;
    accessType.value = "OUT"
  }
};

const addEntryDevice = () => {
  if (!entryDeviceName.value) {
    alert('디바이스 관리명을 입력해주세요.')
    return
  }

  if (kioskSync.value && !selectedKiosk.value) {
    alert('키오스크를 선택해주세요.');
    return;
  }

  if (!kioskSync.value && !selectedLectureRoom.value) {
    alert('강의실을 선택해주세요.')
    return
  }

  const payload = {
    name: entryDeviceName.value,
    accessType: accessType.value,
    parentKioskId: selectedKiosk.value,
    lectureRoomId: selectedLectureRoom.value,
  };
  // 서버에 출입 디바이스를 추가하는 API 호출
  axios.post('https://veritas-s.app/api/devices/entryDevices', payload).then((response) => {
    if (response.data.header.success) {
      location.reload()
    } else {
      alert(response.data.header.message)
    }
  })
}


const deleteEntryDevice = () => {
  if (confirm('정말로 삭제하시겠습니까?')) {
    axios.delete(`https://veritas-s.app/api/devices/entryDevices/${editedEntryDevice.value.id}`).then((response) => {
      if (response.data.header.success) {
        location.reload();
      } else {
        alert(response.data.header.message);
      }
    });
  }
};

watch(accessType, (newValue) => {
  if (newValue === 'IN') {
    kioskSync.value = false;
    selectedKiosk.value = null;
  }
});

onMounted(() => {
  fetchKioskList();
  fetchEntryDevices();
  fetchLectureRooms();

});
</script>