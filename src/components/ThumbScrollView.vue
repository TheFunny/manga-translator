<script setup>
import {useAlbumStore} from "@/stores/album.js";
import {useStageStore} from "@/stores/stage.js";

const albumStore = useAlbumStore();
const stageStore = useStageStore()

function switchPage(page) {
  if (page === albumStore.currentPage) return;
  albumStore.switchPage(page.index);
  stageStore.setImage(page.src);
}
</script>

<template>
  <v-navigation-drawer>
    <v-virtual-scroll :items="albumStore.album">
      <template v-slot="{ item }">
        <v-list-item>
          <v-hover v-slot="{ isHovering, props }">
            <v-img
              :src="item.thumbnail"
              @click="switchPage(item)"
              v-bind="props"
            >
              <v-overlay
                :model-value="!!isHovering"
                class="align-center justify-center"
                contained
              >
                <p
                  class="text-h1 font-weight-bold opacity-50"
                  style="filter: invert(1); user-select: none;"
                >
                  {{ item.index + 1 }}
                </p>
              </v-overlay>
              <template #placeholder>
                <v-skeleton-loader :height="item.height" :width="item.width" type="image"></v-skeleton-loader>
              </template>
            </v-img>
          </v-hover>
        </v-list-item>
      </template>
    </v-virtual-scroll>
  </v-navigation-drawer>
</template>
