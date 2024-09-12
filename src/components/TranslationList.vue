<script setup>
import {computed, ref} from "vue";
import {mdiPencil} from "@mdi/js";
import TranslationEdit from "@/components/TranslationEdit.vue";
import {TranslationStatus} from "@/translation.js";
import {windowSize} from "@/window.js";
import {useTranslationStore} from "@/stores/translation.js";
import {useAlbumStore} from "@/stores/album.js";

const albumStore = useAlbumStore();
const translationStore = useTranslationStore();

const isEdit = ref(false);

const width = computed(() => {
  const w = windowSize.value.w;
  return w / ((w > 1280) ? 3 : 2);
})

function toggleEdit(index) {
  translationStore.setCurrentTranslation(albumStore.currentPage, index);
  isEdit.value = !isEdit.value;
}

</script>

<template>
  <TranslationEdit v-model:is-edit="isEdit"/>
  <v-navigation-drawer :width location="right" permanent>
    <v-list>
      <v-list-item
          v-for="(item, index) in translationStore.currentTranslationList(albumStore.currentPage)"
          :key="index"
          :title="item.translation ? item.translation : 'Translation #' + (index + 1)"
          slim
      >
        <template #prepend>
          <v-icon :icon="TranslationStatus.icon(item.status)"></v-icon>
        </template>
        <template #append>
          <v-btn :icon="mdiPencil" size="small" variant="text" @click="toggleEdit(index)"></v-btn>
        </template>
      </v-list-item>
    </v-list>
  </v-navigation-drawer>
</template>

<style scoped>

</style>