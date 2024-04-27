<template>
  <v-container>
    <v-row>
      <v-col>
        <h2 class="text-h5 mb-4">키오스크 관리</h2>
      </v-col>
    </v-row>

    <v-row>
      <v-col>
        <v-btn class="mb-4 float-right" color="primary" @click="openAddKioskDialog">
          키오스크 추가
        </v-btn>
      </v-col>
    </v-row>

    <v-row>
      <v-col>
        <v-table density="comfortable">
          <thead>
          <tr>
            <th class="text-left">디바이스 관리명</th>
            <th class="text-left">연동 독서실</th>
          </tr>
          </thead>
          <tbody>
          <tr v-for="item in kiosks" :key="item.id">
            <td @click="openEditKioskDialog(item)" style="cursor: pointer;">{{ item.name }}</td>
            <td>{{ item.readingRoomName }}</td>
          </tr>
          </tbody>
        </v-table>
      </v-col>
    </v-row>

    <!-- 키오스크 추가 다이얼로그 -->
    <v-dialog v-model="addKioskDialog" max-width="500px">
      <v-card>
        <v-card-title>키오스크 추가</v-card-title>
        <v-card-text>
          <v-row>
            <v-col>
              <v-text-field v-model="kioskName" label="디바이스 관리명" aria-required="true" density="comfortable"
                            :rules="[v => !!v || '필수 입력']"></v-text-field>
            </v-col>
          </v-row>
          <v-row>
            <v-col>
              <v-select v-model="selectedReadingRoom" :items="readingRooms" item-title="name"
                        item-value="id" label="독서실 선택" density="comfortable"></v-select>
            </v-col>
          </v-row>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="primary" text @click="addKiosk">추가</v-btn>
          <v-btn color="error" text @click="closeAddKioskDialog">취소</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- 키오스크 수정 다이얼로그 -->
    <v-dialog v-model="editKioskDialog" max-width="500px">
      <v-card>
        <v-card-title>키오스크 수정</v-card-title>
        <v-card-text>
          <v-row>
            <v-col>
              <v-text-field v-model="editedKioskName" label="디바이스 관리명" density="comfortable" aria-required="true"
                            :rules="[v => !!v || '필수 입력']"></v-text-field>
            </v-col>
          </v-row>
          <v-row>
            <v-col>
              <v-select v-model="editedSelectedReadingRoom" :items="readingRooms" item-title="name"
                        item-value="id" label="독서실 선택" density="comfortable" ></v-select>
            </v-col>
          </v-row>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="error" text @click="deleteKiosk">삭제</v-btn>
          <v-btn color="primary" text @click="updateKiosk">수정</v-btn>
          <v-btn color="error" text @click="closeEditKioskDialog">취소</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script setup>
import { onMounted, ref } from "vue";
import axios from "axios";

const addKioskDialog = ref(false);
const editKioskDialog = ref(false);
const kioskName = ref("");
const editedKioskName = ref("");
const kiosks = ref([]);
const readingRooms = ref([]);
const selectedReadingRoom = ref(null);
const editedSelectedReadingRoom = ref(null);
const editedKioskId = ref(null);

const fetchReadingRooms = () => {
  axios.get("http://localhost:8080/api/readingrooms").then((response) => {
    readingRooms.value = response.data.data;
  });
};

const fetchKiosks = () => {
  axios.get("http://localhost:8080/api/devices/kiosks").then((response) => {
    kiosks.value = response.data.data;
  });
};

const openAddKioskDialog = () => {
  addKioskDialog.value = true;
};

const closeAddKioskDialog = () => {
  addKioskDialog.value = false;
  kioskName.value = "";
  selectedReadingRoom.value = null;
};

const addKiosk = () => {
  if (!kioskName.value) {
    alert("디바이스 관리명을 입력하세요");
    return;
  }

  if (!selectedReadingRoom.value) {
    alert("독서실을 선택하세요");
    return;
  }

  axios
      .post("http://localhost:8080/api/devices/kiosks", {
        name: kioskName.value,
        readingRoomId: selectedReadingRoom.value,
      })
      .then((response) => {
        if (response.data.header.success) {
          fetchKiosks();
          closeAddKioskDialog();
        } else {
          alert(response.data.header.message);
        }
      });
};

const openEditKioskDialog = (kiosk) => {
  editedKioskId.value = kiosk.id;
  editedKioskName.value = kiosk.name;
  editedSelectedReadingRoom.value = readingRooms.value.find(room => room.name === kiosk.readingRoomName);
  editKioskDialog.value = true;
};

const closeEditKioskDialog = () => {
  editKioskDialog.value = false;
  editedKioskId.value = null;
  editedKioskName.value = "";
  editedSelectedReadingRoom.value = null;
};

const updateKiosk = () => {
  if (!editedKioskName.value) {
    alert("디바이스 관리명을 입력하세요");
    return;
  }

  if (!editedSelectedReadingRoom.value) {
    alert("독서실을 선택하세요");
    return;
  }

  axios
      .put(`http://localhost:8080/api/devices/kiosks/${editedKioskId.value}`, {
        name: editedKioskName.value,
        readingRoomId: editedSelectedReadingRoom.value,
      })
      .then((response) => {
        if (response.data.header.success) {
          fetchKiosks();
          closeEditKioskDialog();
        } else {
          alert(response.data.header.message);
        }
      });
};

const deleteKiosk = () => {
  if (confirm("정말 삭제하시겠습니까?")) {
    axios.delete(`http://localhost:8080/api/devices/kiosks/${editedKioskId.value}`).then((response) => {
      if (response.data.header.success) {
        fetchKiosks();
        closeEditKioskDialog();
      }
    });
  }
};

onMounted(() => {
  fetchKiosks();
  fetchReadingRooms();
});
</script>