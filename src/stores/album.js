import {computed, ref} from "vue";
import {defineStore} from "pinia";
import {Page} from "@/page.js";

export const useAlbumStore = defineStore('album', () => {
    const album = ref([]);
    const currentPageIndex = ref(0);

    const currentPage = computed(() => {
        return album.value[currentPageIndex.value];
    })

    function newAlbum(files) {
        album.value = Array.from(files).map((file, index) => {
            const page = new Page(file, index);
            page.loadImage.then().catch((error) => {
                console.error(error);
            });
            return page;
        });
        currentPageIndex.value = 0;
        return album.value
    }

    function switchPage(index) {
        currentPageIndex.value = index;
    }

    return {album, currentPageIndex, currentPage, newAlbum, switchPage};
})
