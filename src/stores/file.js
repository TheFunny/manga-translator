import {defineStore} from "pinia";
import {ref} from "vue";

export const useFileStore = defineStore('file', () => {
    const files = ref([])

    return {files}
})
