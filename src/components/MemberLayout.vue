<template>
  <v-app-bar app color="primary" density="compact">
    <v-app-bar-nav-icon @click.stop="drawer = !drawer" v-if="!$vuetify.display.mdAndUp"></v-app-bar-nav-icon>
    <v-toolbar-title>Veritas-S 멤버 페이지</v-toolbar-title>
  </v-app-bar>
  <router-view/>
</template>