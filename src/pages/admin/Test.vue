<template>
  <v-app>
    <v-main>
      <v-container>
        <v-row justify="center">
          <v-col cols="12" md="6">
            <div
                class="context-menu-area"
                @contextmenu.prevent="showContextMenu($event)"
            >
              우클릭하면 컨텍스트 메뉴가 나타납니다.
            </div>
            <v-menu
                v-model="showMenu"
                :position-x="contextMenuX"
                :position-y="contextMenuY"
                absolute
                offset-y
            >
              <v-list>
                <v-list-item
                    v-for="(item, index) in menuItems"
                    :key="index"
                    @click="handleMenuItemClick(item)"
                >
                  <v-list-item-title>{{ item.title }}</v-list-item-title>
                </v-list-item>
              </v-list>
            </v-menu>
          </v-col>
        </v-row>
      </v-container>
    </v-main>
  </v-app>
</template>

<script>
import { ref } from 'vue'

export default {
  setup() {
    const showMenu = ref(false)
    const contextMenuX = ref(0)
    const contextMenuY = ref(0)
    const menuItems = ref([
      { title: '복사', action: 'copy' },
      { title: '붙여넣기', action: 'paste' },
      { title: '잘라내기', action: 'cut' },
    ])

    const showContextMenu = (event) => {
      event.preventDefault()
      showMenu.value = false
      contextMenuX.value = event.clientX
      contextMenuY.value = event.clientY
      showMenu.value = true
    }

    const handleMenuItemClick = (item) => {
      // 선택된 메뉴 항목에 대한 액션 처리
      console.log(`선택된 메뉴 항목: ${item.title} (${item.action})`)
      showMenu.value = false
    }

    return {
      showMenu,
      contextMenuX,
      contextMenuY,
      menuItems,
      showContextMenu,
      handleMenuItemClick,
    }
  },
}
</script>

<style>
.context-menu-area {
  height: 200px;
  background-color: #f5f5f5;
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>