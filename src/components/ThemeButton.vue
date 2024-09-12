<script setup>
import {computed, onMounted, ref, watch} from "vue";
import {useTheme} from 'vuetify';
import {mdiThemeLightDark, mdiWeatherNight, mdiWeatherSunny} from "@mdi/js";

const theme = useTheme()

const themeMode = ref(localStorage.getItem('theme') || 'system')

window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
  if (themeMode.value === 'system') {
    setTheme(e.matches ? 'dark' : 'light')
  }
})

function setTheme(mode) {
  if (mode === 'system') {
    theme.global.name.value = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
  } else {
    theme.global.name.value = mode
  }
}

function toggleTheme() {
  switch (themeMode.value) {
    case 'system':
      themeMode.value = 'light'
      break
    case 'light':
      themeMode.value = 'dark'
      break
    case 'dark':
      themeMode.value = 'system'
      break
  }
}

const themeIcon = computed(() => {
  switch (themeMode.value) {
    case 'system':
      return mdiThemeLightDark
    case 'light':
      return mdiWeatherSunny
    case 'dark':
      return mdiWeatherNight
  }
})

watch(themeMode, (newMode) => {
  localStorage.setItem('theme', newMode)
  setTheme(newMode)
})

onMounted(() => {
  setTheme(themeMode.value)
})
</script>

<template>
  <v-btn
      :icon="themeIcon"
      @click="toggleTheme"
  ></v-btn>
</template>
