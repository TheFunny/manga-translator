<script setup>
import ButtonTheme from "@/components/ThemeButton.vue";
import FileButton from "@/components/FileButton.vue";
import {mdiContentSave, mdiExport, mdiFile, mdiFileUpload, mdiFolder} from "@mdi/js";
import {useTranslationStore} from "@/stores/translation.js";
import {ref} from "vue";
import {saveAs} from "file-saver";

defineProps({
  title: String
})

const translationStore = useTranslationStore();

const dialog = ref(false)
const file = ref(null)

function saveTranslation() {
  const jsonStr = JSON.stringify(translationStore.translations);

  const url = window.URL.createObjectURL(new Blob([jsonStr], {type: "application/json"}));
  const a = document.createElement("a");
  a.href = url;
  a.download = "translations.json";
  a.click();
}

function uploadTranslation() {
  if (!file) return
  const reader = new FileReader()
  reader.onload = () => {
    translationStore.$patch({
      translations: JSON.parse(reader.result)
    })
  }
  reader.readAsText(file.value)
  dialog.value = false
  file.value = null
}

function cancel() {
  dialog.value = false
  file.value = null
}

function exportCurrentPage() {
  const exportJson = {
    path: "translationExport.json",
    groups: ["Group"],
    images: Object.fromEntries(
        Object.entries(translationStore.translations).map(
            ([key, value]) => {
              const size = value.size
              const ls = Array.from(value.translation).map((t) => {
                return {
                  x: (t.area.x + t.area.w / 2) / size.width,
                  y: (t.area.y + t.area.h / 2) / size.height,
                  contents: t.translation,
                  group: "Group"
                }
              })
              return [key, ls]
            }
        )
    )
  }
  saveAs(new Blob([JSON.stringify(exportJson)], {type: "application/json"}), "translationExport.json")
}
</script>

<template>
  <v-app-bar :title class="px-3">
    <v-spacer></v-spacer>
    <v-btn :icon="mdiExport" @click="exportCurrentPage"/>
    <v-dialog
        v-model="dialog"
        max-width="600"
    >
      <template #activator="{ props: activatorProps }">
        <v-btn
            :icon="mdiFileUpload"
            v-bind="activatorProps"
        ></v-btn>
      </template>
      <v-card
          :prepend-icon="mdiFolder"
          title="Upload Translation"
      >
        <v-card-text>
          <v-file-input
              v-model="file"
              label="File input"
              :prepend-icon="mdiFile"
              accept="application/json"
          />
        </v-card-text>
        <v-divider/>
        <v-card-actions>
          <v-btn @click="cancel">Cancel</v-btn>
          <v-btn @click="uploadTranslation">Confirm</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-btn :icon="mdiContentSave" @click="saveTranslation" v-if="Object.keys(translationStore.translations).length"/>
    <FileButton/>
    <ButtonTheme/>
  </v-app-bar>
</template>
