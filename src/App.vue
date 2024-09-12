<script setup>
import AppBar from "@/components/AppBar.vue";
import ThumbScrollView from "@/components/ThumbScrollView.vue";
import TranslationList from "@/components/TranslationList.vue";
import PageView from "@/components/PageView.vue";
import {onResize} from "@/window.js";
</script>

<template>
  <v-app full-height>
    <AppBar title="Manga Translator"/>
    <v-main v-resize="onResize">
      <ThumbScrollView>
      </ThumbScrollView>
      <PageView/>
      <TranslationList/>
    </v-main>
  </v-app>
</template>

