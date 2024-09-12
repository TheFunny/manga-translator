import {ref} from "vue";

export const windowSize = ref({w: window.innerWidth, h: window.innerHeight});

export function onResize() {
    windowSize.value.w = window.innerWidth;
    windowSize.value.h = window.innerHeight;
}