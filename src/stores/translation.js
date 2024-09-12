import {reactive, ref} from "vue";
import {defineStore} from "pinia";
import {Translation} from "@/translation.js";

export const useTranslationStore = defineStore('translation', () => {
    const translations = reactive({})

    async function newTranslationPage(page) {
        return translations[page.name] = {
            size: await page.dimensions(),
            translation: []
        };
    }

    function newTranslation(page, translation = new Translation()) {
        translations[page.name].translation.push(translation);
    }

    function currentTranslationList(page) {
        if (!page) return []
        if (translations[page.name]) return translations[page.name].translation
        newTranslationPage(page).then((t) => {
            return t.translation
        })
    }

    const currentTranslation = ref()

    function setCurrentTranslation(page, index) {
        return currentTranslation.value = currentTranslationList(page)[index]
    }

    function deleteCurrentTranslation(page) {
        if (!currentTranslation) return
        currentTranslationList(page).splice(currentTranslationList(page).indexOf(currentTranslation.value), 1)
    }

    return {
        translations,
        // newTranslationPage,
        newTranslation,
        currentTranslationList,
        currentTranslation,
        setCurrentTranslation,
        deleteCurrentTranslation
    }
})
