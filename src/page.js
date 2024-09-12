import {ref} from "vue";

export class Page {
    constructor(file, index) {
        this.file = file; // file blob
        this.index = index;
        this.name = file.name;
        this.src = URL.createObjectURL(file); // TODO: destroy
        this.thumbnail = ref(null);
        this.loadImage = new Promise((resolve, reject) => {
            try {
                file.arrayBuffer().then(arraybuffer => {
                    const worker = new Worker(new URL('@/workers/page.worker.js', import.meta.url));
                    worker.onmessage = (event) => {
                        const {width, height, thumbnail} = event.data;
                        this.width = width;
                        this.height = height;
                        this.thumbnail.value = URL.createObjectURL(new Blob([thumbnail]));
                        resolve(this);
                    }
                    worker.postMessage(arraybuffer, [arraybuffer]);
                });
            } catch (e) {
                reject(e);
            }
        });
    }

    async dimensions() {
        await this.loadImage
        return {width: this.width, height: this.height};
    }
}
