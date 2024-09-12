<script setup>
import {ref, onMounted, nextTick, reactive} from "vue";
import {useAlbumStore} from "@/stores/album.js";
import {useStageStore} from "@/stores/stage.js";
import {mdiClose, mdiPlus} from "@mdi/js";
import {useTranslationStore} from "@/stores/translation.js";

const albumStore = useAlbumStore();
const stageStore = useStageStore();
const translationStore = useTranslationStore();

const size = ref()
const stageRef = ref()

function syncSize() {
  const {width, height} = size.value.getBoundingClientRect()
  stageStore.setSize(width, height)
  stageStore.initScale()
}

const resizeObserver = new ResizeObserver(syncSize)

onMounted(() => {
  stageStore.stage = stageRef.value
  nextTick(() => syncSize())
  resizeObserver.observe(size.value)
});

function translationRectConfig(translation) {
  const area = translation.area
  return {
    x: area.x,
    y: area.y,
    width: area.w,
    height: area.h,
    fill: translation === translationStore.currentTranslation ? "rgba(200, 200, 200, 0.5)" : "rgba(0, 0, 0, 0.5)",
  }
}
</script>

<template>
  <v-container class="position-absolute w-auto pa-0">
    <div>
      <v-stage ref="stageRef" :config="stageStore.config" @wheel="stageStore.handleWheel">
        <v-layer>
          <v-image :config="stageStore.imageConfig"/>
        </v-layer>
        <v-layer>
          <v-rect
            v-for="(item, index) in translationStore.currentTranslationList(albumStore.currentPage)"
            :key="index"
            :config="translationRectConfig(item)"
          ></v-rect>
        </v-layer>
        <v-layer>
          <v-rect :config="stageStore.maskRectConfig"/>
          <v-rect :config="stageStore.drawRectConfig"/>
          <v-rect
            :config="stageStore.interactionRectConfig"
            @mousedown="stageStore.handleDrawMouseDown"
            @mousemove="stageStore.handleDrawMouseMove"
            @mouseup="stageStore.handleDrawMouseUp"
          />
        </v-layer>
      </v-stage>
    </div>
  </v-container>
  <v-container class="h-100 pa-0">
    <div ref="size" class="h-100"/>
    <v-fab
      :active="!!albumStore.album.length"
      :icon="stageStore.isAdding ? mdiClose : mdiPlus"
      location="bottom left"
      absolute
      app
      appear
      @click="stageStore.toggleAdding"
    ></v-fab>
  </v-container>
</template>

<style scoped>

</style>