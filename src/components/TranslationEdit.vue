<script setup>
import {TranslationStatus} from "@/translation.js";
import {mdiClose, mdiDelete} from "@mdi/js";
import {useTranslationStore} from "@/stores/translation.js";
import {watch} from "vue";
import {useAlbumStore} from "@/stores/album.js";

const isEdit = defineModel('isEdit', {type: Boolean});

const albumStore = useAlbumStore();
const translationStore = useTranslationStore();

function exitEdit() {
  isEdit.value = false;
}

watch(isEdit, (value) => {
  if (!value) translationStore.currentTranslation = null
});

function deleteTranslation() {
  exitEdit()
  translationStore.deleteCurrentTranslation(albumStore.currentPage)
}
</script>

<template>
  <v-navigation-drawer v-model="isEdit" location="right" temporary width="384">
    <v-toolbar density="compact" title="Edit Translation">
      <v-spacer></v-spacer>
      <v-btn :icon="mdiClose" @click="exitEdit">
      </v-btn>
    </v-toolbar>
    <v-list v-if="translationStore.currentTranslation">
      <v-list-item>
        <v-chip-group
            v-model="translationStore.currentTranslation.status"
            column
            mandatory
            selected-class="text-primary"
        >
          <v-chip
              v-for="(translationStatus, index) in TranslationStatus.ALL"
              :key="index"
              :prepend-icon="TranslationStatus.icon(translationStatus)"
              :text="translationStatus.name"
              :value="translationStatus"
              rounded="true"
          ></v-chip>
        </v-chip-group>
      </v-list-item>
      <v-list-item>
        <v-textarea
            v-model="translationStore.currentTranslation.original"
            auto-grow
            label="Original Text"
            rows="3"
        ></v-textarea>
      </v-list-item>
      <v-list-item>
        <v-textarea
            v-model="translationStore.currentTranslation.translation"
            auto-grow
            label="Translation"
            rows="3"
        ></v-textarea>
      </v-list-item>
    </v-list>
    <template #append>
      <v-container>
        <v-btn
            :prepend-icon="mdiDelete"
            text="Delete"
            color="error"
            @click="deleteTranslation"
        />
      </v-container>
    </template>
  </v-navigation-drawer>
</template>
