import {computed, reactive, ref, unref} from "vue";
import {defineStore} from "pinia";
import {Translation, TranslationArea} from "@/translation.js";
import {useAlbumStore} from "@/stores/album.js";
import {useTranslationStore} from "@/stores/translation.js";

export const useStageStore = defineStore('stage', () => {
    const stage = ref()

    function mousePosition() {
        return stage.value.getNode().getPointerPosition()
    }

    function stagePosition() {
        try {
            const _stage = stage.value.getNode()
            return {x: _stage.x(), y: _stage.y()}
        } catch (e) {
            return {x: 0, y: 0}
        }
    }

    function mouseStagePosition() {
        const pointer = mousePosition()
        const stagePos = stagePosition()
        return {
            x: (pointer.x - stagePos.x) / scale.value,
            y: (pointer.y - stagePos.y) / scale.value
        }
    }

    const x = ref(0)
    const y = ref(0)
    const width = ref(100)
    const height = ref(100)
    const scale = ref(1)
    const draggable = ref(false)

    const config = computed(() => {
        return {
            x: x.value,
            y: y.value,
            width: width.value,
            height: height.value,
            scale: {x: scale.value, y: scale.value},
            draggable: draggable.value
        }
    })

    function setPos(_x, _y) {
        x.value = _x
        y.value = _y
    }

    function setSize(w, h) {
        width.value = w
        height.value = h
    }

    function setScale(s) {
        scale.value = s
    }

    function enableDraggable() {
        draggable.value = true
    }

    let scaleMax = 2
    let scaleMin = 0.5

    function initScale() {
        if (!image.value) return
        if (image.value.width > image.value.height) {
            setScale(width.value / image.value.width)
            setPos(0, (height.value - image.value.height * scale.value) / 2)
        } else {
            setScale(height.value / image.value.height)
            setPos((width.value - image.value.width * scale.value) / 2, 0)
        }
        scaleMax = Math.max(scale.value, 1) * 2
        scaleMin = Math.min(scale.value, 1) / 2
    }

    const image = ref()
    const imageConfig = computed(() => {
        return {image: image.value}
    })

    function setImage(src) {
        if (!isAdding.value) enableDraggable()
        const _image = new Image()
        _image.onload = () => {
            image.value = _image
            initScale()
        }
        _image.src = src
    }

    function handleWheel(event) {
        event.evt.preventDefault()
        if (!draggable.value) return
        const scaleBy = 1.1
        const oldScale = scale.value
        const newScale = event.evt.deltaY < 0 ? oldScale * scaleBy : oldScale / scaleBy
        if (newScale > scaleMax || newScale < scaleMin) return
        const pointer = mousePosition()
        const mousePointTo = mouseStagePosition()
        setScale(newScale)
        setPos(pointer.x - mousePointTo.x * newScale, pointer.y - mousePointTo.y * newScale)
    }

    const isAdding = ref(false)

    function toggleAdding() {
        isAdding.value = !isAdding.value
        draggable.value = !isAdding.value
    }

    const maskRectConfig = computed(() => {
        const stagePos = stagePosition()
        return {
            x: - stagePos.x / scale.value,
            y: - stagePos.y / scale.value,
            width: width.value / scale.value,
            height: height.value / scale.value,
            fill: 'rgba(0, 0, 0, 0.3)',
            visible: isAdding.value
        }
    })

    const interactionRectConfig = computed(() => {
        const maskConfig = maskRectConfig.value
        return {
            x: maskConfig.x,
            y: maskConfig.y,
            width: maskConfig.width,
            height: maskConfig.height,
            visible: isAdding.value
        }
    })

    const isDrawingRect = ref(false)

    function toggleDrawingRect(value=null) {
        isDrawingRect.value = value !== null ? value : !isDrawingRect.value
    }

    const drawRectConfig = reactive({
        x: 0,
        y: 0,
        width: 0,
        height: 0,
        fill: 'rgba(240, 240, 240, 0.6)',
        visible: isDrawingRect
    })

    function isInsideImage(x, y) {
        return x >= 0 && x <= image.value.width && y >= 0 && y <= image.value.height
    }

    function handleDrawMouseDown(event) {
        if (event.evt.button >= 1) return
        if (event.evt.altKey) {
            enableDraggable()
            return
        }
        drawRectConfig.x = drawRectConfig.y = drawRectConfig.width = drawRectConfig.height = 0
        const mousePointTo = mouseStagePosition()
        if (!isInsideImage(mousePointTo.x, mousePointTo.y)) return
        toggleDrawingRect(true)
        drawRectConfig.x = mousePointTo.x
        drawRectConfig.y = mousePointTo.y
        // console.log("mouseDown")
    }

    function handleDrawMouseMove(event) {
        if (!event.evt.altKey && draggable.value) draggable.value = false
        if (!isDrawingRect.value) return
        const mousePointTo = mouseStagePosition()
        if (!isInsideImage(mousePointTo.x, mousePointTo.y)) return
        drawRectConfig.width = mousePointTo.x - drawRectConfig.x
        drawRectConfig.height = mousePointTo.y - drawRectConfig.y
        // console.log(drawRectConfig)
    }

    function handleDrawMouseUp(event) {
        if (event.evt.altKey) return draggable.value = false
        if (!isDrawingRect.value) return
        const albumStore = useAlbumStore();
        const translationStore = useTranslationStore();
        const translation = new Translation(new TranslationArea(drawRectConfig.x, drawRectConfig.y, drawRectConfig.width, drawRectConfig.height))
        translationStore.newTranslation(albumStore.currentPage, translation)
        // console.log(translation.area)
        toggleDrawingRect(false)
        // console.log("mouseUp")
    }

    return {
        stage,
        config,
        setSize,
        initScale,
        imageConfig,
        setImage,
        handleWheel,
        isAdding,
        toggleAdding,
        maskRectConfig,
        interactionRectConfig,
        drawRectConfig,
        handleDrawMouseDown,
        handleDrawMouseMove,
        handleDrawMouseUp
    };
})
