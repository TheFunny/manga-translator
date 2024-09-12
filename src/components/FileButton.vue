<script setup>
import {ref} from "vue";
import {mdiFolder, mdiFolderPlus, mdiImageAlbum} from "@mdi/js";
import {useAlbumStore} from "@/stores/album.js";
import {useStageStore} from "@/stores/stage.js";
import {useFileStore} from "@/stores/file.js";

const albumStore = useAlbumStore();
const stageStore = useStageStore();
const fileStore = useFileStore();

const dialog = ref(false)

function cancel() {
  dialog.value = false
  fileStore.files = []
}

function confirm() {
  dialog.value = false
  if (fileStore.files.length === 0) return
  albumStore.newAlbum(fileStore.files)
  stageStore.setImage(albumStore.currentPage.src)
  fileStore.files = []
}
</script>

<template>
  <v-dialog
    v-model="dialog"
    max-width="600"
  >
    <template #activator="{ props: activatorProps }">
      <v-btn
        :icon="mdiFolderPlus"
        v-bind="activatorProps"
      ></v-btn>
    </template>
    <v-card
      :prepend-icon="mdiFolder"
      title="Upload Images"
    >
      <v-card-text>
        <v-file-input
          v-model="fileStore.files"
          label="File input"
          :prepend-icon="mdiImageAlbum"
          accept="image/*"
          counter
          multiple
        >
          <template #selection="{ fileNames }">
            <template v-for="(fileName, index) in fileNames" :key="index">
              <v-chip
                color="primary"
                size="small"
                label
              >
                {{ fileName }}
              </v-chip>
            </template>
          </template>
        </v-file-input>
      </v-card-text>
      <v-divider/>
      <v-card-actions>
        <v-btn @click="cancel">Cancel</v-btn>
        <v-btn @click="confirm">Confirm</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>
